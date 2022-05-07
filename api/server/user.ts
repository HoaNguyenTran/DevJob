import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { AxiosResponse } from 'axios'
import { UserListSchema, UserSchema } from 'src/entities/User'


export const getProfileSSRApi = async (userCode: string, token: string): Promise<AxiosResponse<any>> => {
  const res = await requestApi({ token }).get(`/users/${userCode}`)
  validateResponse("getProfileSSRApi", UserSchema, res.data)
  return res;
}

export const getSearchUserSSRApi = async ({ token, params }): Promise<AxiosResponse<any>> => {
  const res = await requestApi({ token }).get(`/users/search${params}`)
  validateResponse("getSearchUserSSRApi", UserListSchema, res.data)
  return res;
}
