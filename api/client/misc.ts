import requestApi from "api/config/requestApi"
import { AxiosResponse } from "axios"

export const getInfoRedeemCode = async (): Promise<AxiosResponse<any>> =>
  requestApi().get(`/redeem-code/active-referer-campaign`)

export const redeemCode = async (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/redeem-code`, data)