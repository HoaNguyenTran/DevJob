// check again

declare namespace CompanyGlobal {
  interface CompanyDetail {
    status?: number
    id: number
    adminUserId: number
    avatar: string
    companyAddress: CompanyAddress[]
    contactPhone: string
    desc: string
    imagesJson: string | null
    industryId: number
    isVerified: number
    name: string
    numEmployee: number
    parentId: number
    shortName: string
    userId: string
    userRole: number
    website: string
  }
  interface CompanyAddress {
    address: string
    communeId: number
    companyId: number
    districtId: number
    id: number
    latitude: number
    longitude: number
    provinceId: number
    shortAddress: string | null
  }

  interface CompanyDetailPending {
    id: number
    adminUserId: number
    avatar: string
    companyAddress: CompanyAddressPending[]
    contactPhone: string
    desc: string
    imagesJson: string | null
    industryId: number
    isVerified: number
    name: string
    numEmployee: number
    parentId: number
    shortName: string
    userId: string
    userRole: number
    website: string
  }
  interface CompanyAddressPending {
    companyId: number
    id: number
    shortAddress: string | null
  }
}
