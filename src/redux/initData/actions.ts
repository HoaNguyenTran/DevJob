import {
  GetInitDataFailurePayload,
  GetInitDataSuccessPayload,
  GetVersionCodeFailurePayload,
  GetVersionCodeSuccessPayload,
} from './types'

export enum actionTypesInitData {
  GET_INIT_DATA_REQUEST = 'initData/GET_INIT_DATA_REQUEST',
  GET_INIT_DATA_SUCCESS = 'initData/GET_INIT_DATA_SUCCESS',
  GET_INIT_DATA_FAILURE = 'initData/GET_INIT_DATA_FAILURE',

  GET_VERSION_CODE_REQUEST = 'initData/GET_VERSION_CODE_REQUEST',
  GET_VERSION_CODE_SUCCESS = 'initData/GET_VERSION_CODE_SUCCESS',
  GET_VERSION_CODE_FAILURE = 'initData/GET_VERSION_CODE_FAILURE',
}

export interface getInitDataRequestAction {
  type: typeof actionTypesInitData.GET_INIT_DATA_REQUEST
}

export interface getInitDataSuccessAction {
  type: typeof actionTypesInitData.GET_INIT_DATA_SUCCESS
  payload: GetInitDataSuccessPayload
}

export interface getInitDataFailureAction {
  type: typeof actionTypesInitData.GET_INIT_DATA_FAILURE
  payload: GetInitDataFailurePayload
}

export interface getVersionCodeRequestAction {
  type: typeof actionTypesInitData.GET_VERSION_CODE_REQUEST
}

export interface getVersionCodeSuccessAction {
  type: typeof actionTypesInitData.GET_VERSION_CODE_SUCCESS
  payload: GetVersionCodeSuccessPayload
}

export interface getVersionCodeFailureAction {
  type: typeof actionTypesInitData.GET_VERSION_CODE_FAILURE
  payload: GetVersionCodeFailurePayload
}

export type InitDataAction =
  | getInitDataRequestAction
  | getInitDataSuccessAction
  | getInitDataFailureAction
  | getVersionCodeRequestAction
  | getVersionCodeSuccessAction
  | getVersionCodeFailureAction

export const getInitDataRequest = (): InitDataAction => ({
  type: actionTypesInitData.GET_INIT_DATA_REQUEST,
})

export const getInitDataSuccess = (data: GetInitDataSuccessPayload): InitDataAction => ({
  type: actionTypesInitData.GET_INIT_DATA_SUCCESS,
  payload: data,
})

export const getInitDataFailure = (errors: GetInitDataFailurePayload): InitDataAction => ({
  type: actionTypesInitData.GET_INIT_DATA_FAILURE,
  payload: errors,
})

export const getVersionCodeRequest = (): InitDataAction => ({
  type: actionTypesInitData.GET_VERSION_CODE_REQUEST,
})

export const getVersionCodeSuccess = (code: GetVersionCodeSuccessPayload): InitDataAction => ({
  type: actionTypesInitData.GET_VERSION_CODE_SUCCESS,
  payload: code,
})

export const getVersionCodeFailure = (errors: GetVersionCodeFailurePayload): InitDataAction => ({
  type: actionTypesInitData.GET_VERSION_CODE_FAILURE,
  payload: errors,
})
