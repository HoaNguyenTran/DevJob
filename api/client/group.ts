import requestApi from "api/config/requestApi"
import { validateResponse } from "api/config/validateApi"
import { AxiosResponse } from "axios"
import { GroupSchema } from "src/entities/Groups"
import { UserGroupSchema } from "src/entities/UserDetail"

export const getFjobGroupsApi = async (): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/groups`)
  validateResponse("getFjobGroupsApi", GroupSchema, res.data)
  return res
}

export const deleteFjobGroupsApi = (id: number): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/groups/${id}`)

export const getUserGroupsApi = async (id: number): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-groups/${id}`)
  validateResponse("getUserGroupsApi", UserGroupSchema, res.data)
  return res
}

export const postAddUserGroupApi = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-groups`, data)

export const deleteUserGroupApi = (id: number): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/user-groups/${id}`)

export const patchUpdateFjobGroupsApi = (id: number, data: any): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/groups/${id}`, data)

export const postSaveFjobGroupsApi = (data: any): Promise<AxiosResponse<any>> =>
  requestApi().post(`/groups`, data)

