
import { AxiosResponse } from 'axios'
import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { InAppMessageSchema } from 'src/entities/InAppMessage'

export const makeCall = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/notification/make-call`, data)

export const contactER = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/notification/contact-er`, data)

export const contactEE = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/notification/contact-ee`, data)

export const deleteInAppMessageApi = (id: number): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/inapp-message/${id}`) 

export const patchInAppMessageApi = (id: number): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/inapp-message/${id}`) 

export const postReadInAppMessageApi = (id: number): Promise<AxiosResponse<any>> =>
  requestApi().post(`/inapp-message/read/${id}`) 

export const getReadAllInAppMessageApi = (): Promise<AxiosResponse<any>> =>
  requestApi().get(`/inapp-message/read-all`) 

export const getMessageInAppApi = async (data): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/inapp-message`, { params: data })
  validateResponse("getMessageInAppApi", InAppMessageSchema, res.data)
  return res
}