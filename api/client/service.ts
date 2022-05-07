import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { AxiosResponse } from 'axios'
import { PromotionSchema } from 'src/entities/Services'
import { UserServiceSchema } from 'src/entities/UserServices'

export const getAllPromotionApi = async ({ limit = 200 }: { limit?: number }): Promise<AxiosResponse<ServiceGlobal.PromotionFull>> => {
  const res = await requestApi().get(`/promotions?limit=${limit}`)
  validateResponse("getAllPromotionApi", PromotionSchema, res.data)
  return res
}

export const getPromotionByCodeApi = ({ code }: { code: string }): Promise<AxiosResponse<ServiceGlobal.PromotionFull>> =>
  requestApi().get(`/promotions?serviceCode=${code}`)

export const getAllServiceApi = ({ limit = 200 }: { limit?: number }): Promise<AxiosResponse<ServiceGlobal.ServiceFullTypeService>> =>
  requestApi().get(`/fjob-service?limit=${limit}`)


export const postBuySerProApi = (data
  : { services: { serviceId?: number, quantity?: number }[], promotions: { packageId?: number, quantity?: number }[] })
  : Promise<AxiosResponse<ServiceGlobal.ServiceBuyServiceResponse>> =>
  requestApi().post(`/user-services/buy`, data)

export const getMyServiceApi = async (): Promise<AxiosResponse<ServiceGlobal.ServiceFullTypeMyService>> => {
  const res = await requestApi().get(`/user-services`)
  validateResponse("getMyServiceApi", UserServiceSchema, res.data)
  return res
}



export const postUseServiceApi = (data: {
  useServices: { serviceId: number, quantity: number }[],
  jobId: number
}): Promise<AxiosResponse<ServiceGlobal.UseServiceResponse>> =>
  requestApi().post(`/user-services/use-services`, data)

export const postBuyAndUseServicesApi = (data: {
  jobId: number, promotions: never[], useServices: never[],
  services: { serviceId: number, quantity: number }[],
}): Promise<AxiosResponse<ServiceGlobal.BuyAndUseServiceResponse>> =>
  requestApi().post(`/user-services/buy-and-use`, data)



export const postViewDetailEEApi = data =>
  requestApi().post(`/user-services/buy-candidate-detail`, data)


