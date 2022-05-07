import { AxiosResponse } from 'axios'
import requestApi from 'api/config/requestApi'
import { GetInitDataSuccessPayload, GetVersionCodeSuccessPayload } from 'src/redux/initData/types'


export const getInitDataApi = (): Promise<AxiosResponse<GetInitDataSuccessPayload>> =>
  requestApi().get(`/dictionary/init-data`)

export const getVersionCodeApi = (): Promise<AxiosResponse<GetVersionCodeSuccessPayload>> =>
  requestApi().get(`/dictionary/check-data-changed`)