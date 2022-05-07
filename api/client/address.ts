import requestApi from "api/config/requestApi";
import { validateResponse } from "api/config/validateApi";
import { AxiosResponse } from "axios";
import { CompanyAddressesScheme } from "src/entities/CompanyAddresses";
import { UserAddressSchema } from "src/entities/UserAddress";

export const getAllUserAddressApi = async (): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-address?limit=200`)
  validateResponse("getAllUserAddressApi", UserAddressSchema, res.data)
  return res;
}

export const getUserAddressBuyIdApi = async (id): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-address/${id}`)
  validateResponse("getUserAddressBuyIdApi", UserAddressSchema, res.data)
  return res
}

export const postUserAddressApi = (data: Auth.UserAddressPayload): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-address`, data)

export const deleteUserAddressApi = (id): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/user-address/${id}`)

export const patchUserAddressApi = (data: Auth.UpdateUserAddressPayload, id: number): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/user-address/${id}`, data)

export const getAllCompanyAddressApi = async (): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/company-address?limit=200`)
  validateResponse("getAllCompanyAddressApi", CompanyAddressesScheme, res.data)
  return res;
}

export const getCompanyAddressByIdApi = async (params): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/company-address`, { params })
  validateResponse("getCompanyAddressByIdApi", CompanyAddressesScheme, res.data)
  return res;
}

export const postCompanyAddressApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/company-address`, data)


