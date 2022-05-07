import { call, CallEffect, put, PutEffect } from 'redux-saga/effects'
import { getAllUserCompanyApi } from 'api/client/company'
import { AxiosResponse } from 'axios'

import { userRoleInCompany } from 'src/constants/roleConstant'
import { getUserCompanyFailure, getUserCompanySuccess, UserCompanyAction } from '../actions'


export function* sagaGetUserCompanyRequest()
  : Generator<CallEffect<AxiosResponse<CompanyGlobal.CompanyDetail[]>>
    | PutEffect<UserCompanyAction>, void, AxiosResponse<CompanyGlobal.CompanyDetail[]>> {

  try {
    const data = yield call(getAllUserCompanyApi)
    const obj = {
      arrAdmin: data.data.filter(item => item.userRole === userRoleInCompany.admin),
      arrAgent: data.data.filter(item => item.userRole === userRoleInCompany.agent),
      arrPending: data.data.filter(item => item.userRole === userRoleInCompany.pending),
    }
    yield put(getUserCompanySuccess(obj))
  } catch (errors: any) {
    yield put(getUserCompanyFailure({ errors }))
  }
}