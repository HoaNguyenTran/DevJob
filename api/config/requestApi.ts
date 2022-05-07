/* eslint-disable no-param-reassign */
import { message } from 'antd'
import axios, { AxiosInstance } from 'axios'
import { differenceInHours } from 'date-fns'
import https from "https"
import jwtDecode from 'jwt-decode'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { removeCookieCSR, removeLocalStorageWhenLogout, setAccessTokenCookieCSR } from 'src/utils/storage'
import { getTokenUser, isServer } from 'src/utils/helper'
import { errorCodeConstant } from 'src/constants/errorCodeConstant'
import { destroyCookie } from 'nookies'

let processFetchRefreshToken = false


const requestApi = (configuration: any = {}): AxiosInstance => {
  const tokenUser = configuration.token || getTokenUser() || null;
  let headers = {
    'Content-Type': 'application/json',
    ...configuration.headers
  }
  let baseURL = "";

  if (process.env.NEXT_PUBLIC_WEB_ENV !== configConstant.environment.development) {
    baseURL = `${process.env.NEXT_PUBLIC_API_URL}/${configuration.prefixDomain || configConstant.prefixDomain.main}/${process.env.NEXT_PUBLIC_API_VERSION}`
  } else {
    baseURL = `${process.env.NEXT_PUBLIC_API_URL}/${configuration.prefixDomain || configConstant.prefixDomain.mainDev}`
    if (tokenUser) {
      const decoded: { uid: string, userCode: string } = jwtDecode(tokenUser) || {};

      headers = {
        ...headers,
        'x-fjob-user-id': decoded.uid,
        'x-fjob-role': 'user',
        'x-fjob-user-code': decoded.userCode,
      }
    }

  }

  let initAxios = {
    baseURL,
    timeout: 10000,
    headers,
    ...configuration
  }

  // fix bug: unable_to_verify_leaf_signature 
  if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development) {
    initAxios = {
      ...initAxios,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    }
  }

  const axiosInstance = axios.create(initAxios)

  axiosInstance.interceptors.request.use(
    async (config) => {
      config.params = { ...config.params, platform: 'web' }

      if (process.env.NEXT_PUBLIC_WEB_ENV !== configConstant.environment.development && tokenUser) {
        config.headers.Authorization = `Bearer ${tokenUser}`
      }

      if (!isServer() && !processFetchRefreshToken) {
        if (localStorage.getItem(storageConstant.localStorage.refreshToken)
          && localStorage.getItem(storageConstant.localStorage.expiredToken)
          && localStorage.getItem(storageConstant.localStorage.userCode) && getTokenUser()
        ) {
          const expiredTime = differenceInHours(
            new Date(Number(localStorage.getItem(storageConstant.localStorage.expiredToken)))
            , Date.now());

          if (expiredTime > 0 && expiredTime < 6) {
            fetchRefreshToken();
          }
        }
      }

      return config
    },
    error => Promise.reject(error),
  )

  axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
      if (error?.response?.data?.errorCode === errorCodeConstant.invalidHeader) {
        deleteStorageAndRedirectLogin()
      }

      // const originalRequest = error.config;
      // if ([401, 403].includes(error?.response?.status) && getAccessTokenCookieCSR()) {
      //   if (process.env.NEXT_PUBLIC_WEB_ENV !== configConstant.environment.production) {
      //     message.error(`Code: ${error?.response?.status}`)
      //     console.error(`Code: ${error?.response?.status}. Message: ${error?.response?.data.message}`)
      //   }
      //   try {
      //     const newAccessToken = await fetchRefreshToken();

      //     if (process.env.NEXT_PUBLIC_WEB_ENV !== configConstant.environment.development) {
      //       originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      //     } else {
      //       const decoded: { uid: string, userCode: string } = jwtDecode(newAccessToken) || {};
      //       originalRequest.headers = {
      //         ...originalRequest.headers,
      //         'x-fjob-user-id': decoded.uid,
      //         'x-fjob-role': 'user',
      //         'x-fjob-user-code': decoded.userCode,
      //       }
      //     }
      //     axiosInstance(originalRequest);
      //     return
      //   } catch (e) {
      //     deleteStorageAndRedirectLogin();
      //   }
      // }

      if (error?.response?.status === 503) {
        message.error('Hệ thống đang bảo trì, bạn vui lòng chờ trong giây lát!')
      }

      return Promise.reject(error)
    },
  )

  return axiosInstance
}

const fetchRefreshToken = async () => {
  processFetchRefreshToken = true
  try {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/${configConstant.prefixDomain.auth}/users/renew-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: localStorage.getItem(storageConstant.localStorage.refreshToken) || "",
        userCode: localStorage.getItem(storageConstant.localStorage.userCode) || ""
      })
    })
      .then(response => response.json())
      .then(response => {
        if (response.errorCode) {
          removeCookieCSR(storageConstant.cookie.accessToken)
          removeCookieCSR(storageConstant.cookie.userRole)

          console.log('clear storage in request api')

          removeLocalStorageWhenLogout()
          window.location.href = routerPathConstant.signIn
          return
        }

        const { accessToken, refreshToken, userCode, expiredAt } = response.data
        console.log(accessToken);

        const hoursExpires = differenceInHours(new Date(expiredAt), Date.now())

        localStorage.setItem(storageConstant.localStorage.refreshToken, refreshToken)
        localStorage.setItem(storageConstant.localStorage.userCode, userCode)
        localStorage.setItem(storageConstant.localStorage.expiredToken, expiredAt)

        setAccessTokenCookieCSR({ accessToken, hoursExpires })
        return accessToken;
      })
  } catch (error) {
    removeCookieCSR(storageConstant.cookie.accessToken)
    removeCookieCSR(storageConstant.cookie.userRole)

    console.log('clear storage in request api')

    removeLocalStorageWhenLogout()
    window.location.href = routerPathConstant.signIn
  } finally {
    processFetchRefreshToken = false
  }
}

const deleteStorageAndRedirectLogin = () => {
  destroyCookie(null, storageConstant.cookie.accessToken, { path: '/' })
  removeLocalStorageWhenLogout();
  window.location.href = `${routerPathConstant.signIn}?next=${window.location.href}`
}

export default requestApi
