
export interface GetUserCompanySuccessPayload {
  arrAdmin: CompanyGlobal.CompanyDetail[],
  arrAgent: CompanyGlobal.CompanyDetail[],
  arrPending: CompanyGlobal.CompanyDetail[],
}

export interface GetUserCompanyFailurePayload {
  errors: Errors
}

export type Payload = GetUserCompanySuccessPayload | GetUserCompanyFailurePayload
