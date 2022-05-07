/* eslint-disable camelcase */

// check again
declare namespace JobDetailGlobal {
  interface JobDetailData {
    id: number
    userId: number
    companyId: number
    addressId: number
    jobStatus: number
    title: string
    image_url: string
    video_url: string
    jobType: number
    urgent: number
    workingAddress: string
    wageMin: number
    wageMax: number
    wageUnit: number
    hiringCount: number
    startTime: number
    expireTime: number
    viewCount: number
    appliedCount: number
    acceptedCount: number
    educationLevel: number
    detailDesc: string
    otherDesc: string
    ageFrom: number
    ageTo: number
    wokingShortTimeFrom: number
    wokingShortTimeTo: number
    methodReceiveNotify: number
    canApplyDate: number
    user: JobDetailUser
    company: JobDetailCompany
    jobSchedules: JobDetailSchedule[]
    genders: number[]
    jobPostCategoryIds: number[]
    jobPostExpRequiredCateIds: number[]
    matching: number
    isHotJob: number
    isSavedJob: number
    experienceId
    benefitIds: number
    distance: number
    adddress: JobDetailAddress
    applyingStatus: number
    imageUrl: string,
    serviceList: JobDetailService[],
    workingDayNote: string
  }
}
