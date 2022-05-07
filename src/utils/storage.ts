import { roleConstant } from "src/constants/roleConstant"
import nookies, { destroyCookie, parseCookies, setCookie } from "nookies"
import { storageConstant } from "src/constants/storageConstant"
import { Base64 } from "js-base64"
import { configConstant } from "src/constants/configConstant"

export const getUserRoleCookieCSR = () => parseCookies()[storageConstant.cookie.userRole]

export const getAccessTokenCookieCSR = () => parseCookies()[storageConstant.cookie.accessToken]

export const setUserRoleCookieCSR = ({ role }) => {
  if (getUserRoleCookieCSR() !== role)
    setCookie(null, storageConstant.cookie.userRole, role, { path: '/' })
}

export const setAccessTokenCookieCSR = ({ accessToken, hoursExpires = 2 * 24 }: { accessToken: string, hoursExpires: number }): void => {
  setCookie(null, storageConstant.cookie.accessToken, Base64.encode(accessToken), {
    maxAge: hoursExpires * 60 * 60,
    path: '/',
    secure: process.env.NODE_ENV === configConstant.environment.production,
    // httpOnly: process.env.NODE_ENV !== configConstant.environment.development
  })
}

export const setUserRoleCookieSSR = ({ ctx, role }) => {
  if (nookies.get(ctx)[storageConstant.cookie.userRole] !== roleConstant[role].name) {
    nookies.set(ctx, storageConstant.cookie.userRole, roleConstant[role].name, { path: '/' })
  }
}

export const removeCookieCSR = (name: string, path = '/') => destroyCookie(null, name, { path })


export const removeLocalStorageWhenLogout = (): void => {
  [storageConstant.localStorage.messageQueueStore, storageConstant.localStorage.geolocation, storageConstant.localStorage.mqttToken,
  storageConstant.localStorage.refreshToken, storageConstant.localStorage.signupProcess, storageConstant.localStorage.signupInfo,
    storageConstant.localStorage.userCode, storageConstant.localStorage.flagAutoApplyJob, storageConstant.localStorage.expiredToken].forEach(element => localStorage.removeItem(element))
}
