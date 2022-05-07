import { statusProgress } from 'src/constants/statusConstant'
import { actionTypesUserCompany } from './actions'


export const initialStateUserCompany = {
  status: statusProgress.idle,
  data: {},
  errors: [],
}

export const reducers = (state = initialStateUserCompany, action) => {
  switch (action.type) {
    case actionTypesUserCompany.GET_USERCOMPANY_REQUEST:
      return {
        ...state,
        status: statusProgress.loading,
        errors: [],
      }
    case actionTypesUserCompany.GET_USERCOMPANY_SUCCESS:
      return {
        ...state,
        status: statusProgress.succeeded,
        errors: [],
        data: action.payload,
      }
    case actionTypesUserCompany.GET_USERCOMPANY_FAILURE:
      return {
        ...state,
        status: statusProgress.failed,
        ...action.payload,
      }

    default:
      return state
  }
}
