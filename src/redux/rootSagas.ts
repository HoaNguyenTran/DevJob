import { all, takeLatest, AllEffect, ForkEffect } from 'redux-saga/effects'

import { actionTypesProfile } from 'src/redux/user/actions'
import { sagaGetProfileRequest } from './user/saga'
import { actionTypesInitData } from './initData/actions'
import { sagaInitDataRequest, sagaVersionCodeRequest } from './initData/saga'
import { actionTypesUserCompany } from './userCompany'
import { sagaGetUserCompanyRequest } from './userCompany/saga'

function* rootSaga(): Generator<AllEffect<ForkEffect<never>>, void, unknown> {
  yield all([
    takeLatest(actionTypesProfile.GET_PROFILE_REQUEST, sagaGetProfileRequest),
    takeLatest(actionTypesUserCompany.GET_USERCOMPANY_REQUEST, sagaGetUserCompanyRequest),

    takeLatest(actionTypesInitData.GET_INIT_DATA_REQUEST, sagaInitDataRequest),
    takeLatest(actionTypesInitData.GET_VERSION_CODE_REQUEST, sagaVersionCodeRequest),
  ])
}

export default rootSaga
