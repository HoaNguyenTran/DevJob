export interface GetInitDataSuccessPayload {
  code: string
  data: InitDataGlobal.InitData
}

export interface GetInitDataFailurePayload {
  errors: Errors
}

export interface GetVersionCodeSuccessPayload {
  infoMessage: string
  data: InitDataGlobal.InitDataVersionCode
}

export interface GetVersionCodeFailurePayload {
  errors: Errors
}
