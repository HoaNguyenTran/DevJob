import { statusProgress } from 'src/constants/statusConstant'
import { actionTypesInitData, InitDataAction } from './actions'


export const initialStateInitData: InitDataGlobal.InitDataState = {
  data: {} as InitDataGlobal.InitData,
  code: "",
  status: statusProgress.idle,
  errors: [],
}

const sortFjobProvice = (provices) => {
  const fjobProvice:any = [...provices || []];
  const hnID = 1;
  const hcmID = 79;

  const indexItemHn = fjobProvice.findIndex(item => item.id === hnID);
  const indexItemHcm = fjobProvice.findIndex(item => item.id === hcmID);
  const hcmProvice = fjobProvice.splice(indexItemHcm, 1)?.[0];
  fjobProvice.splice(indexItemHn + 1, 0, hcmProvice);
  
  return fjobProvice;
}

export const reducers = (
  state: InitDataGlobal.InitDataState = initialStateInitData,
  action: InitDataAction,
): InitDataGlobal.InitDataState => {
  switch (action.type) {
    case actionTypesInitData.GET_INIT_DATA_REQUEST:
      return {
        ...state,
        status: statusProgress.loading,
        errors: [],
      }

    case actionTypesInitData.GET_INIT_DATA_SUCCESS:
      // eslint-disable-next-line no-case-declarations
     
      return {
        ...state,
        status: statusProgress.succeeded,
        errors: [],
        data: {
          ...action.payload.data,
          FjobProvince: sortFjobProvice(action.payload.data?.FjobProvince)
        }
      }

    case actionTypesInitData.GET_INIT_DATA_FAILURE:
      return {
        ...state,
        status: statusProgress.failed,
        ...action.payload,
      }

    case actionTypesInitData.GET_VERSION_CODE_REQUEST:
      return {
        ...state,
        status: statusProgress.loading,
        errors: [],
      }

    case actionTypesInitData.GET_VERSION_CODE_SUCCESS:
      return {
        ...state,
        status: statusProgress.succeeded,
        errors: [],
        code: action.payload.data,
      }

    case actionTypesInitData.GET_VERSION_CODE_FAILURE:
      return {
        ...state,
        status: statusProgress.failed,
        ...action.payload,
      }

    default:
      return state
  }
}
