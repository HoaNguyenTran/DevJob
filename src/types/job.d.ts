// check again

declare namespace JobGlobal {
  interface JobInfoForm {
    canCall: boolean
    canMessage: boolean
    jobTitle: string
    jobCate: number
    hireCount: number
    jobType: number
    shortWorkTime: any
    addressType: number
    userAddress: number
    companyAddressId?: number
    companyId?: number
    dayOfWeek: number[]
    calendarType: number
    workHour: any
    workShift: number[]
    salaryType: number
    salaryMin: number
    salaryMax: number
    salaryUnit: number
    detailDesc: string
    genderType: number
    chooseGender: number[]
    ageType: number
    ageFrom: number | null
    ageTo: number | null
    educationLevel: number
    experienceJob: number[]
    experienceTime: number
    benefitPolicy: number[]
    moreRequire: string
    uploadFile: any
    imageUrl: string
    workingDayNote?: string
  }
  interface JobScheduleForm {
    timePostJob: number | any
    deadlineSubmit: number | any
    canMessage: boolean
    canCall: boolean
  }
  interface JobValueForm  extends JobInfoForm, JobScheduleForm {
    companyId?: number | undefined
    companyAddress?: number | undefined
    companyAddressId?: number | undefined
    useServices: JobUseService[]
  }

  interface JobUseService {
    id: number
    serviceId: number
    quantity: number
    code: string
    name: string
  }




  interface Job {
    // message(message: any);
    acceptedCount?: number
    adddress?: CommonGlobal.AddressJobInfo
    addressId?: number
    ageFrom?: number | undefined
    ageTo?: number | undefined
    appliedCount?: number
    applyingStatus?: number
    canApplyDate?: number
    companyId?: number
    createdAt?: string
    detailDesc?: string
    distance?: number
    educationLevel?: number
    experienceId?: number
    expireTime?: number
    genders?: number[]
    hiringCount?: number
    id?: number
    imageUrl?: string
    isHotJob?: number
    isSavedJob?: number
    jobPostCategoryIds?: number[]
    jobPostExpRequiredCateIds?: number[]
    jobSchedules?: CommonGlobal.Schedule[]
    jobStatus?: number
    jobType?: number
    matching?: number
    methodReceiveNotify?: number | null
    otherDesc?: string
    serviceList?: CommonGlobal.JobService[]
    startTime?: number
    title?: string
    updatedAt?: string
    urgent?: number
    user?: UserGlobal.Profile
    userId?: number
    videoUrl?: string
    viewCount?: number
    wageMax?: number
    wageMin?: number
    wageUnit?: number
    wokingShortTimeFrom?: number
    wokingShortTimeTo?: number
    workingAddress?: string
  }

  interface JobFull {
    data: Job[]
    meta: {
      pagination: {
        currentPage: number
        links: {
          next: string
          prev: string
        }
        limit: number
        total: number
        totalPages: number
      }
    }
  }

  interface JobsSearchRequest {
    page?: number
    limit?: number
    fields?: string
    userId?: number
    companyId?: number
    jobType?: number
    shifts?: Array[number]
    isHotJob?: number
    isSavedJob?: number
    categories?: Array[number]
    search?: string
    urgent?: number
    locationType?: number
    districtIds?: number
    latitude?: number
    longitude?: number
    distance?: number
  }
}

declare namespace JobSaveGlobal {
  interface JobSave {
    id: number
    userId: number
    companyId: number
    title: string
    jobType: number
    urgent: number
    workingAddress: string
    wageMin: number
    wageMax: number
    wageUnit: number
    wokingShortTimeFrom: number
    wokingShortTimeTo: number
    canApplyDate: number
    userSavedJobId: number
    user: any
    isHotJob: number
    matching: number
    jobSchedules: any
    company: {
      id: number
      name: string
      contactPhone: number
      website: string
      numEmployee: number
      industryId: number
      desc: string
      isVerified: number
      parentId: number
      avatar: string
      status: number
    }
    distance: number
  }

  interface JobSaveFull {
    data: JobSave[]
    meta: {
      pagination: {
        currentPage: number
        links: {
          next: string
          prev: string
        }
        limit: number
        total: number
        totalPages: number
      }
    }
  }
}
