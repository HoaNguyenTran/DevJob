import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { AxiosResponse } from 'axios'
import { CompaniesSchema, CompanyDetailSchema } from 'src/entities/Companies'
import { UserListSchema } from 'src/entities/User'
import { UserCompaniesSchema } from 'src/entities/UserCompanies'

export const getSearchCompanyApi = async (name: string): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/company?page=1&limit=10&name=${name}`)
  validateResponse("searchCompany", CompaniesSchema, res.data)
  return res
}

export const postCreateNewCompanyApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/company`, data)

export const getDetailCompanyApi = async (id): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/company/${id}`)
  validateResponse("getDetailCompanyApi", CompanyDetailSchema, res)
  return res;
}

export const patchUpdateCompanyApi = (id, data): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/company/${id}`, data)

export const deleteCompanyApi = (id): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/company/${id}`)




export const postPermissonUserCompanyApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-company/promote`, data)

export const postRejectUserCompanyApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-company/reject-member`, data)

export const getUserCompanyApi = async (): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-company`)
  validateResponse("getUserCompanyApi", UserCompaniesSchema, res)
  return res;
}

export const getMemberCompanyApi = async (id): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-company/all-members/${id}`)
  validateResponse("getMemberCompanyApi", UserListSchema, res.data)
  return res
}

export const getAllUserCompanyApi = async (): Promise<AxiosResponse<CompanyGlobal.CompanyDetail[]>> => {
  const res = await requestApi().get(`/user-company`)
  validateResponse("getAllUserCompanyApi", UserCompaniesSchema, res.data)
  return res
}



export const getAddressOfOneCompanyApi = async (id): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/company-address?page=1&limit=100&companyIds=${id}`)
  validateResponse("getAddressOfOneCompanyApi", CompaniesSchema, res.data)
  return res
}

export const postSaveAddressCompanyApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/company-address`, data)

export const deleteAddressCompanyApi = (id): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/company-address/${id}`)






