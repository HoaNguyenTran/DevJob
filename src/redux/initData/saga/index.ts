import { call, CallEffect, put, PutEffect } from 'redux-saga/effects'
import { getInitDataApi, getVersionCodeApi } from 'api/client/initData'
import { AxiosResponse } from 'axios'

import {
  getInitDataFailure,
  getInitDataSuccess,
  getVersionCodeFailure,
  getVersionCodeSuccess,
  InitDataAction,
} from '../actions'
import { GetInitDataSuccessPayload, GetVersionCodeSuccessPayload } from '../types'

export function* sagaInitDataRequest()
  : Generator<CallEffect<AxiosResponse<GetInitDataSuccessPayload>>
    | PutEffect<InitDataAction>, void, AxiosResponse<GetInitDataSuccessPayload>> {
  try {
    const res = yield call(getInitDataApi)

    yield put(getInitDataSuccess(res.data))
  } catch (errors: any) {
    yield put(getInitDataFailure({ errors }))
  }
}

export function* sagaVersionCodeRequest()
  : Generator<CallEffect<AxiosResponse<GetVersionCodeSuccessPayload>>
    | PutEffect<InitDataAction>, void, AxiosResponse<GetVersionCodeSuccessPayload>> {
  try {
    const res = yield call(getVersionCodeApi)
    yield put(getVersionCodeSuccess(res.data))
  } catch (errors: any) {
    yield put(getVersionCodeFailure({ errors }))
  }
}
