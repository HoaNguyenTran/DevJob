declare namespace UserGlobal {
  interface UserState {
    status: statusProgress.idle | statusProgress.loading | statusProgress.succeeded | statusProgress.failed
    profile: Profile
    errors: Errors
  }

  interface Profile {
    id: number
    code: string
    phoneNumber: string
    username: string
    email: string
    name: string
    gender: number
    zetaAccount: number
    language: string
    birthday: string
    status: number
    avatar: string
    academicId: number
    isEmployee: number
    isEmployer: number
    isPersonal: number
    verifyKyc: number
    verifyOption1: string
    verifyOption2: string
    companyId: number
    expectSalaryFrom: number
    expectSalaryTo: number
    expectSalaryUnit: number
    expectSalaryHourlyFrom: number
    expectSalaryHourlyTo: number
    points: number
    mainAddressId: number
    verifyEmail: number
    cvLink: string
    hasExperience: number
    censorship: number
    shortAddress: string
    canviewDetailProfile: boolean
    experiences: CommonGlobal.Experiences[]
    profSkills: CommonGlobal.ProSkills[]
    favCats: number[]
    educations: CommonGlobal.Educations[]
    companyList: CommonGlobal.Company[]
    addresses: CommonGlobal.UserAddress[]
    walletValue: number
    userServices: CommonGlobal.UserServices[]
    // userServices: any[]
    vipInfo: CommonGlobal.VipInfo
    shouldShowAppReview: boolean
    isComplete: boolean
    infoStatus: CommonGlobal.InfoStatusUser
    wantNewJob: 0 | 1

    // check again
    provinceId: number | null
    districtId: number
    addressFull: string
    latitude: number
    longitude: number


  }




  interface UpdateUser {
    phoneNumber?: string
    email?: string
    name?: string
    gender?: number
    language?: string
    birthday?: string
    avatar?: string
    companyId?: number
    academicId?: number
    isEmployee?: number
    isEmployer?: number
    isPersonal?: number
    expectSalaryFrom?: number
    expectSalaryTo?: number
    expectSalaryUnit?: number
    verifyKyc?: 1
    verifyOption1?: string
    verifyOption2?: string
    cvLink?: string
    hasExperience?: number | null
  }
  interface UserCompany {
    address: userAddressId
    avatar: string
    birthday: string
    companyId: number
    email: string
    id: number
    phoneNumber: string
    userId: number
    userName: string
    userRole: number
    verifyKyc: number
  }

}
