import {
  GetProfileRequestPayload,
  GetProfileSuccessPayload,
  GetProfileFailurePayload,
} from './types'

export enum actionTypesProfile {
  GET_PROFILE_REQUEST = 'user/GET_PROFILE_REQUEST',
  GET_PROFILE_SUCCESS = 'user/GET_PROFILE_SUCCESS',
  GET_PROFILE_FAILURE = 'user/GET_PROFILE_FAILURE',
  GET_LOGOUT_REQUEST = 'user/GET_LOGOUT_REQUEST',
}

// type action profile
export interface getProfileRequestAction {
  type: typeof actionTypesProfile.GET_PROFILE_REQUEST
  payload: GetProfileRequestPayload
}
interface getProfileSuccessAction {
  type: typeof actionTypesProfile.GET_PROFILE_SUCCESS
  payload: GetProfileSuccessPayload
}
interface getProfileFailureAction {
  type: typeof actionTypesProfile.GET_PROFILE_FAILURE
  payload: GetProfileFailurePayload
}

// type action logout
export interface getLogoutRequestAction {
  type: typeof actionTypesProfile.GET_LOGOUT_REQUEST
}

export type UserAction =
  | getProfileRequestAction
  | getProfileSuccessAction
  | getProfileFailureAction
  | getLogoutRequestAction

// action get profile

export const getProfileRequest = (userCode: GetProfileRequestPayload): UserAction => ({
  type: actionTypesProfile.GET_PROFILE_REQUEST,
  payload: userCode,
})
export const getProfileSuccess = (profile: GetProfileSuccessPayload): UserAction => ({
  type: actionTypesProfile.GET_PROFILE_SUCCESS,
  payload: profile,
})
export const getProfileFailure = (errors: GetProfileFailurePayload): UserAction => ({
  type: actionTypesProfile.GET_PROFILE_FAILURE,
  payload: errors,
})

// action logout

export const getLogoutRequest = (): UserAction => ({
  type: actionTypesProfile.GET_LOGOUT_REQUEST,
})
