import requestApi from 'api/config/requestApi'
import { AxiosResponse } from 'axios'

interface payloadEmailContact {
  email: string
  html: string
  subject: string
}

interface payloadEmailContactBusiness {
  name: string
  phoneNumber: string
  company: string
  details: string
}
interface responseEmailContact {
  data: unknown
  message: string
}

export const postEmailContactApi = (params: payloadEmailContact): Promise<AxiosResponse<responseEmailContact>> => requestApi().post(`fjob-mailer`, params)

export const postEmailContactBusinessApi = (params: payloadEmailContactBusiness) => requestApi().post(`fjob-support/send-support`, params)

export const getJobViewByIdApi = (params) => requestApi().get(`/jobs/view/${params.id}`)

export const getBannersApi = () => requestApi().get(`/banners`)

export const getBannersByTypeApi = (bannerType :number) => requestApi().get(`/banners/search?bannerType=${bannerType}`)

export const getReportDashboardApi = () => requestApi().get("/users/dash-board")
