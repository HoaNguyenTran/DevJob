/* eslint-disable camelcase */

// check again
declare namespace JobPostGlobal {
  interface JobPostFull {
    data: JobPostData[]
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

  // like job detail, check again
  interface JobPostData {
    acceptedCount: number
    addressId: number
    ageFrom: number
    ageTo: number
    appliedCount: number
    benefitIds: number[]
    canApplyDate: number
    candidates: any[]
    companyId: number
    createdAt: string
    detailDesc: string
    distance: number
    educationLevel: number
    experienceId: number
    expireTime: number
    genders: number[]
    hiringCount: number
    id: number
    image_url: string
    isHotJob: number
    isSavedJob: number
    jobPostCategoryIds: number[]
    jobPostExpRequiredCateIds: number[]
    jobSchedules: JobPostSchedule[]
    jobStatus: number
    jobType: number
    matching: number
    methodReceiveNotify: number
    otherDesc: string
    startTime: number
    title: string
    updatedAt: string
    urgent: number
    user: any
    userId: number
    video_url: string
    viewCount: number
    wageMax: number
    wageMin: number
    wageUnit: number
    wokingShortTimeFrom: null
    wokingShortTimeTo: null
    workingAddress: string
    workingDay: number
    workingDayCount: number
    workingTime: number
    workingTimeCount: number
  }



  interface JobPostSchedule {
    dayOfWeek: number
    shiftId: number
    workTimeFrom: number
    workTimeTo: number
  }
}
