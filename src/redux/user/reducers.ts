import { statusProgress } from 'src/constants/statusConstant'
import { actionTypesProfile, UserAction } from './actions'


export const initialStateUser: UserGlobal.UserState = {
  status: statusProgress.idle,
  profile: {} as UserGlobal.Profile,
  errors: [],
}

export const reducers = (state: UserGlobal.UserState = initialStateUser, action: UserAction): UserGlobal.UserState => {
  switch (action.type) {
    case actionTypesProfile.GET_PROFILE_REQUEST:
      return {
        ...state,
        status: statusProgress.loading,
        errors: [],
      }
    case actionTypesProfile.GET_PROFILE_SUCCESS:
      return {
        ...state,
        status: statusProgress.succeeded,
        errors: [],
        ...action.payload,
      }
    case actionTypesProfile.GET_PROFILE_FAILURE:
      return {
        ...state,
        status: statusProgress.failed,
        ...action.payload,
      }

    default:
      return state
  }
}
