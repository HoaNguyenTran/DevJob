import React, { useState } from 'react'

import { patchUpdateUserApi, postAppleAuthApi, postFBAuthApi, postGGAuthApi } from 'api/client/user'
import axios from 'axios'
import { differenceInHours } from 'date-fns'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { configConstant } from 'src/constants/configConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch } from 'src/redux'
import { getLogoutRequest, getProfileRequest } from 'src/redux/user'
import { firebase } from 'src/utils/firebase'
import { getTokenUser, handleError } from 'src/utils/helper'
import { removeCookieCSR, removeLocalStorageWhenLogout, setAccessTokenCookieCSR, setUserRoleCookieCSR } from 'src/utils/storage'
import { v4 as uuidv4 } from 'uuid'
import defaultConstant from 'src/constants/defaultConstant'

import styles from './SocialAuth.module.scss'

const SocialAuth = ({ getLoadingAuth, role }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [avatar, setAvatar] = useState("")
  const userRole = role ? roleConstant.EE.name : roleConstant.ER.name

  function base64ToBlob(base64, mime = '') {
    // mime = mime || '';
    const sliceSize = 1024;
    const byteChars = atob(base64);
    const byteArrays: any = [];
  
    for (let offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      const slice = byteChars.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i += 1) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
  
      byteArrays.push(byteArray);
    }
  
    return new Blob(byteArrays, { type: mime });
  }

  async function handleUpdateAvatar(avatarImg) {
    try {
      const res = await axios.get(avatarImg, { responseType: 'arraybuffer' })
      const base64 = Buffer.from(res.data, 'binary').toString('base64')
      const base64ImageContent = base64.replace(/^data:image\/(png|jpg);base64,/, "");
      const blob = base64ToBlob(base64ImageContent, 'image/jpeg');
      const formData = new FormData();
      formData.append("file", blob, "filename.jpg");
      const config = {
        'headers': {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getTokenUser()}`,
        },
      }

      const handleDomainPostImg = () => {
        if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development) return "https://api.dev.fjob.com.vn"
        return process.env.NEXT_PUBLIC_API_URL
      }

      const resData = await axios.post(`${handleDomainPostImg()}/upload/v1.0/upload`, formData, config)
      setAvatar(resData.data.linkUrl)

    } catch (error) {
      setAvatar(defaultConstant.defaultLinkAvatarUser)
    }
  }

  const isEmptyObject = (obj: Record<string, any>) => Object.keys(obj).length === 0

  const clearStorage = () => {
    dispatch(getLogoutRequest())
    removeLocalStorageWhenLogout()
    removeCookieCSR(storageConstant.cookie.accessToken)
    removeCookieCSR(storageConstant.cookie.userRole)

    console.log('clearStorage')
  }

  const saveSocialDataToStorage = (data, deviceId) => {
    localStorage.setItem(storageConstant.localStorage.refreshToken, data.refreshToken)
    localStorage.setItem(storageConstant.localStorage.userCode, data.userCode)
    localStorage.setItem(storageConstant.localStorage.deviceId, deviceId)
    localStorage.setItem(storageConstant.localStorage.expiredToken, data.expiredAt)

    const hoursExpires = differenceInHours(new Date(data.expiredAt), Date.now())

    setAccessTokenCookieCSR({ accessToken: data.accessToken, hoursExpires })

    setUserRoleCookieCSR({ role: userRole })
  }


  const handleLoginFacebook = async () => {
    setUserRoleCookieCSR({ role: userRole })
    const deviceId = localStorage.getItem(storageConstant.localStorage.deviceId) || uuidv4()
    const provider = new firebase.auth.FacebookAuthProvider()
    provider.addScope('email')

    getLoadingAuth(true)

    try {
      const initFBresponse = await firebase.auth().signInWithPopup(provider)
      const credential = initFBresponse.credential as firebase.auth.OAuthCredential

      const additionalUserInfo = initFBresponse.additionalUserInfo?.profile as any
      const email = additionalUserInfo.email || `fb${additionalUserInfo.id}@fjob.vn`

      if (
        additionalUserInfo &&
        !isEmptyObject(additionalUserInfo) &&
        credential.accessToken &&
        deviceId
      ) {


        const fbloginpayload: Auth.FBLoginPayload = {
          deviceId,
          name: additionalUserInfo.name,
          id: additionalUserInfo.id,
          email,
          avatarUrl: additionalUserInfo.picture.data.url,
          fbtoken: credential.accessToken,
        }
        const signinFBresponse = await postFBAuthApi(fbloginpayload)
        const { data } = signinFBresponse.data
        saveSocialDataToStorage(data, deviceId)

        if (data.isNewUser) {
          handleUpdateAvatar(additionalUserInfo.picture.data.url)

          const updateUserPayload: UserGlobal.UpdateUser = {
            name: additionalUserInfo.name,
            email,
            avatar,
          }
          await patchUpdateUserApi(data.userCode, updateUserPayload)
          dispatch(getProfileRequest({ userCode: data.userCode }))
          const saveLocal = {
            status: 0,
            step: 4,
            role: userRole,
            code: data.userCode
          }

          const hoursExpires = differenceInHours(new Date(data.expiredAt), Date.now())

          localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
          localStorage.setItem(storageConstant.localStorage.userCode, data.user.code)
          localStorage.setItem(storageConstant.localStorage.expiredToken, data.expiredAt)

          setAccessTokenCookieCSR({ accessToken: data.accessToken, hoursExpires })

          router.push(routerPathConstant.signUp)
        } else {
          dispatch(getProfileRequest({ userCode: data.userCode }))
          if (Object.keys(router.query).length && router.query.next) {
            router.push(router.query.next.toString())
          } else if (role) {
            router.push(routerPathConstant.homepage)
          } else {
            router.push(routerPathConstant.erDashboard)
          }
        }
      }
      getLoadingAuth(false)
    } catch (error) {
      handleError(t('signin.socialFailed'))
      clearStorage()
      getLoadingAuth(false)
    }
  }

  const handleLoginGoogle = async () => {
    setUserRoleCookieCSR({ role: userRole })
    const deviceId = localStorage.getItem(storageConstant.localStorage.deviceId) || uuidv4()
    const provider = new firebase.auth.GoogleAuthProvider()
    getLoadingAuth(true)

    try {
      const initGGresponse = await firebase.auth().signInWithPopup(provider)
      const credential = initGGresponse.credential as firebase.auth.OAuthCredential
      const { user } = initGGresponse as any
      const ggtoken = credential.idToken
      if (ggtoken) {
        const signinGGResponse = await postGGAuthApi(ggtoken, deviceId)
        const { data } = signinGGResponse.data
        saveSocialDataToStorage(data, deviceId)

        if (data.isNewUser) {
          handleUpdateAvatar(user.photoURL)

          const updateUserPayload: UserGlobal.UpdateUser = {
            name: user.displayName,
            email: user.email,
            avatar,
          }

          await patchUpdateUserApi(data.userCode, updateUserPayload)

          dispatch(getProfileRequest({ userCode: data.userCode }))

          const saveLocal = {
            status: 0,
            step: 4,
            role: userRole,
            code: data.userCode
          }

          const hoursExpires = differenceInHours(new Date(data.expiredAt), Date.now())

          localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
          localStorage.setItem(storageConstant.localStorage.userCode, data.user.code)
          localStorage.setItem(storageConstant.localStorage.expiredToken, data.expiredAt)

          setAccessTokenCookieCSR({ accessToken: data.accessToken, hoursExpires })

          router.push(routerPathConstant.signUp)
        } else {
          dispatch(getProfileRequest({ userCode: data.userCode }))
          if (Object.keys(router.query).length && router.query.next) {
            router.push(router.query.next.toString())
          } else if (role) {
            router.push(routerPathConstant.homepage)
          } else {
            router.push(routerPathConstant.erDashboard)
          }
        }
      }
    } catch (error) {
      clearStorage()
      handleError(t('signin.socialFailed'))
    } finally {
      getLoadingAuth(false)
    }
  }

  const handlerLoginApple = async () => {
    setUserRoleCookieCSR({ role: userRole })
    const deviceId = localStorage.getItem(storageConstant.localStorage.deviceId) || uuidv4()
    const provider = new firebase.auth.OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    const response = await firebase.auth().signInWithPopup(provider)

    const credential = response.credential as firebase.auth.OAuthCredential
    await firebase.auth().signInWithCredential(credential);
    const idToken = await firebase.auth().currentUser?.getIdToken(false);
    const user = firebase.auth().currentUser as firebase.User
    if (idToken) {
      const signinAppleResponse = await postAppleAuthApi(idToken, user.displayName || "No Name", user.email || "", user.photoURL || "", deviceId)
      const { data } = signinAppleResponse.data
      saveSocialDataToStorage(data, deviceId)

      if (data.isNewUser) {
        handleUpdateAvatar(user.photoURL)

        const updateUserPayload: UserGlobal.UpdateUser = {
          name: user.displayName || "No Name",
          email: user.email || "",
          avatar,
        }

        await patchUpdateUserApi(data.userCode, updateUserPayload)

        dispatch(getProfileRequest({ userCode: data.userCode }))

        const saveLocal = {
          status: 0,
          step: 4,
          role: userRole,
          code: data.userCode
        }

        const hoursExpires = differenceInHours(new Date(data.expiredAt), Date.now())

        localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
        localStorage.setItem(storageConstant.localStorage.userCode, data.user.code)
        localStorage.setItem(storageConstant.localStorage.expiredToken, data.expiredAt)

        setAccessTokenCookieCSR({ accessToken: data.accessToken, hoursExpires })

        router.push(routerPathConstant.signUp)
      } else {
        dispatch(getProfileRequest({ userCode: data.userCode }))
        if (Object.keys(router.query).length && router.query.next) {
          router.push(router.query.next.toString())
        } else if (role) {
          router.push(routerPathConstant.homepage)
        } else {
          router.push(routerPathConstant.erDashboard)
        }
      }
    }
  }

  return (
    <div className={styles.auth_social}>
      <div onClick={handleLoginFacebook} className={styles.button}>
        <span>
          <img alt="" src="/assets/icons/default/facebook.svg" />
        </span>
        <span className={styles.text}>Facebook</span>
      </div>
      <div onClick={handleLoginGoogle} className={styles.button}>
        <span>
          <img alt="" src="/assets/icons/default/google.svg" />
        </span>
        <span className={styles.text}>Google</span>
      </div>
      {/* <div onClick={handlerLoginZalo} className={styles.button}>
        <span>
          <img alt="" src="/assets/icons/default/zalo.svg" />
        </span>
        <span className={styles.text}>Zalo</span>
      </div> */}
      <div onClick={handlerLoginApple} className={styles.button}>
        <span>
          <img alt="" src="/assets/icons/default/apple.svg" />
        </span>
        <span className={styles.text}>Apple</span>
      </div>
    </div>
  )
}

export default SocialAuth
