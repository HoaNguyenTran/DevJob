import {
  GetUserCompanySuccessPayload,
  GetUserCompanyFailurePayload,
} from './types'

export enum actionTypesUserCompany {
  GET_USERCOMPANY_REQUEST = 'user/GET_USERCOMPANY_REQUEST',
  GET_USERCOMPANY_SUCCESS = 'user/GET_USERCOMPANY_SUCCESS',
  GET_USERCOMPANY_FAILURE = 'user/GET_USERCOMPANY_FAILURE',
}

// type action profile
export interface getUserCompanyRequestAction {
  type: typeof actionTypesUserCompany.GET_USERCOMPANY_REQUEST
}
interface getUserCompanySuccessAction {
  type: typeof actionTypesUserCompany.GET_USERCOMPANY_SUCCESS
  payload: GetUserCompanySuccessPayload
}
interface getUserCompanyFailureAction {
  type: typeof actionTypesUserCompany.GET_USERCOMPANY_FAILURE
  payload: GetUserCompanyFailurePayload
}


export type UserCompanyAction =
  | getUserCompanyRequestAction
  | getUserCompanySuccessAction
  | getUserCompanyFailureAction

// action get profile

export const getUserCompanyRequest = (): UserCompanyAction => ({
  type: actionTypesUserCompany.GET_USERCOMPANY_REQUEST
})

export const getUserCompanySuccess = (obj: GetUserCompanySuccessPayload): UserCompanyAction => ({
  type: actionTypesUserCompany.GET_USERCOMPANY_SUCCESS,
  payload: obj,
})

export const getUserCompanyFailure = (errors: GetUserCompanyFailurePayload): UserCompanyAction => ({
  type: actionTypesUserCompany.GET_USERCOMPANY_FAILURE,
  payload: errors,
})
