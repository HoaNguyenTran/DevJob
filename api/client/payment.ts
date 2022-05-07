import requestApi from "api/config/requestApi"
import { validateResponse } from "api/config/validateApi"
import { AxiosResponse } from "axios"
import { StoreItemSchema } from "src/entities/StoreItem"

export const postPaymentOnePayApi = data =>
  requestApi().post(`/payments/create-onepay-link`, data)

export const postPaymentFjobApi = data =>
  requestApi().post(`/payments/create-payment-transaction`, data)


// check again
export const getPackageDiamondApi = async (): Promise<AxiosResponse<DiamondGlobal.DiamondPackageResponse[]>> => {
  const res = await requestApi().post(`/store-purchase/store-item`, { 'platform': 'web' })
  validateResponse("getPackageDiamondApi", StoreItemSchema, res)
  return res
}

export const getTransactionApi = ({ page = 1, limit = 10, transType = 0, fromDate, toDate }: { page: number, limit?: number, transType: number, fromDate?: number, toDate?: number }): Promise<AxiosResponse<TransactionGlobal.TransactionHistoryResponse>> =>
  requestApi().get(`user-transaction?page=${page}&limit=${limit}&transType=${transType}${fromDate ? `&fromDate=${fromDate}` : ""}${toDate ? `&toDate=${toDate}` : ""}`)

