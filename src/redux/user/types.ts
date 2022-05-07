export interface GetProfileRequestPayload {
  userCode: string
}

export interface GetProfileSuccessPayload {
  profile: UserGlobal.Profile
}

export interface GetProfileFailurePayload {
  errors: Errors
}

export type Payload = GetProfileRequestPayload | GetProfileSuccessPayload | GetProfileFailurePayload


export interface GetProfileSuccessResponse {
  data: UserGlobal.Profile
}