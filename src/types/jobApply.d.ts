// check again

declare namespace JobApplyGlobal {
  interface JobApply {
    id: number
    jobId: number
    userId: number
    appliedTime: number
    respondedTime: number
    hiringStatus: number
    employerNote: string
    reasonChangeStatus: string
    jobReasonId: number
    createdAt: string
    updatedAt: string
    company: {
      id: number
      name: string
    }
    user: {
      name: string
      gender: number
      birthday: string
      shortAddress: string
      avatar: string
      experience: []
      favCats: []
    }
    job: {
      id: number
      title: string
      wageMin: number
      wageMax: number
      wageUnit: number
      addressId: number
      workingAddress: string
      canApplyDate: number
      urgent: number
      matching: number
      isHotJob: number
      isSavedJob: number
      jobSchedules: {
        dayOfWeek: number
        workingShift: number
        workTimeFrom: number
        workTimeTo: number
      }[]
      userPostJob: {
        id: number
        name: string
      }
    }
  }

  interface JobApplyFull {
    data: JobApply[]
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

  // interface JobApplyStateFull {
  //   job: JobApplyFull | null
  //   status: statusProgress.idle | 'loading' | 'succeeded' | 'failed'
  //   errors: Errors
  // }

  interface JobApplyUnReason {
    reason: number | null
    note?: string
  }

  interface JobApplyPayload {
    jobId: number 
    userId: number | undefined 
  }

  interface JobApplyResponse {
    data: {
      id: number
      jobId: number
      userId: number
      appliedTime: number
      respondedTime: number
      hiringStatus: number
      reasonChangeStatus: string
      jobReasonId: number
      createdAt: string
      updatedAt: string
    }
    message: string
  }
}
