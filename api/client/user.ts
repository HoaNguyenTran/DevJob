import requestApi from 'api/config/requestApi'
import { validateResponse } from 'api/config/validateApi'
import { AxiosResponse } from 'axios'
import { configConstant } from 'src/constants/configConstant'
import { SchoolsSchema } from 'src/entities/Schools'
import { UserSchema } from 'src/entities/User'
import { userSchedulesSchema } from 'src/entities/UserSchedules'
import { GetProfileSuccessResponse } from 'src/redux/user/types'

// postExampleApi = (query, data) = ({id}, {}) => requestApi().post(`/user/id=${id}`, data)

export const getProfileApi = async (userCode: string): Promise<AxiosResponse<GetProfileSuccessResponse>> => {
  const res = await requestApi().get(`/users/${userCode}`)
  validateResponse("getProfileApi", UserSchema, res.data)
  return res;
}

export const postSigninApi = (data: Auth.SigninDataPayload): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/users/login`, data)

export const getOTPApi = (phoneNumber: string): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/users/get-otp`, { phoneNumber })


// export const postRefreshToken = (refreshToken: string, userCode: string): Promise<AxiosResponse<any>> =>
//   requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/users/renew-token`, { refreshToken, userCode })

export const postCheckPhoneApi = (phoneNumber: string): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/users/check-phone-number`, { phoneNumber })


export const patchUpdateUserApi = (userCode: string, data: any): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/users/${userCode}`, data)

export const patchUserInfomationApi = (data: any, code: string): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/users/${code}`, data)

export const getAgoraTokenApi = (channel: string): Promise<AxiosResponse<any>> =>
  requestApi().get(`/users/agora-token?channel=${channel}`)


export const getVerifyEmailApi = (params) =>
  requestApi().get(`/users/verify-email`, { params })

export const getAccountVerificationApi = (params) =>
  requestApi().get(`/user-identification/${params.userId}`, { })

export const getCheckVerifyEmailApi = (email, code) =>
  requestApi().get(`/users/check-verify-email?email=${email}&code=${code}`)


export const postSignUpApi = (data: Auth.SignupDataPayload): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/social/phonelogin`, data)

export const postGGAuthApi = (ggtoken: string, deviceId: string): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/social/gglogin`, { ggtoken, deviceId })

  export const postAppleAuthApi = (token: string, name: string, email: string, avatarUrl: string, deviceId: string): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/social/applelogin`, { token, name, email, avatarUrl, deviceId })

export const postFBAuthApi = (data: Auth.FBLoginPayload): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/social/fblogin`, data)

export const postUpdateInfoSocialApi = (data: Auth.UpdateInfo): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/social/update-info`, data)

export const changePasswordApi = (data, code): Promise<AxiosResponse<any>> =>
  requestApi({ prefixDomain: configConstant.prefixDomain.auth }).post(`/users/changePassword/${code}`, data)


export const patchUserExperienceApi = (data, id): Promise<AxiosResponse<any>> =>
  requestApi().patch(`/user-exp/${id}`, data)

export const postSaveUserExperienceApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-exp`, data)
  
export const deleteUserExperienceApi = (id): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/user-exp/${id}`)


export const patchSaveUserExperienceApi = (data): Promise<AxiosResponse<any>> => {
  if (data.id) return requestApi().patch(`/user-prof-skill/${data.id}`, data)
  return requestApi().post(`/user-prof-skill`, data)
}

export const deleteUserProSkillApi = (id): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/user-prof-skill/${id}`)



export const updateUserEducationApi = (data): Promise<AxiosResponse<any>> => {
  if (data.id) return requestApi().patch(`/user-extra/edu/${data.id}`, data)
  return requestApi().post(`/user-extra/edu`, data)
}

export const deleteUserEducationApi = (id): Promise<AxiosResponse<any>> =>
  requestApi().delete(`/user-extra/edu/${id}`)



export const getAllDataSchoolApi = async (): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-extra/school`)
  validateResponse("getAllDataSchool",SchoolsSchema,res)
  return res;
}



export const postFavCatsApi = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-favourite-category/update-batch`, data)



export const getUserScheduleApi = async(): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/user-schedules?page=1&limit=10`)
  validateResponse("getUserScheduleApi", userSchedulesSchema, res.data)
  return res;
}

export const postUserSchedule = (userIds, schedules): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-schedules`, { userId: userIds, userSchedules: schedules })

export const accountVerificationAPI = (data): Promise<AxiosResponse<any>> =>
  requestApi().post(`/user-identification`, data)




export const getSearchUserApi = async ({ params }): Promise<AxiosResponse<any>> => {
  const res = await requestApi().get(`/users/search${params}`)
  return res;
}
