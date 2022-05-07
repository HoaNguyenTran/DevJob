import { call, CallEffect, put, PutEffect } from 'redux-saga/effects'
import { getProfileApi } from 'api/client/user'

import { AxiosResponse } from 'axios'
import { getProfileSuccess, getProfileFailure } from '..'
import { GetProfileSuccessPayload, GetProfileSuccessResponse } from '../types'
import { getProfileRequestAction, UserAction } from '../actions'


export function* sagaGetProfileRequest(payload: getProfileRequestAction)
  : Generator<CallEffect<AxiosResponse<GetProfileSuccessResponse>>
    | PutEffect<UserAction>, void, AxiosResponse<GetProfileSuccessResponse>> {
  const { userCode } = payload.payload
  try {
    const response = yield call(getProfileApi, userCode)
    yield put(getProfileSuccess({ profile: response?.data?.data || {} }))
  } catch (errors: any) {
    yield put(getProfileFailure({ errors }))
  }
}