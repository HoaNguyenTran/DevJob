declare namespace InitDataGlobal {
  interface InitDataState {
    status: statusProgress.idle | statusProgress.loading | statusProgress.succeeded | statusProgress.failed
    data: InitData
    code: InitDataVersionCode
    errors: Errors
  }
  interface InitData {
    FjobNewCategory: {
      id: number
      name: string
      type: number
    }[]
    FjobPromotion: {
      id: number
      name: string
      desc: string
      basePrice: number
      propTypeId: number
      serviceId: number
      newPrice: number
      priceUnit: number
      fromTime: number
      toTime: number
      img: string
    }[]
    FjobBenefit: { id: number; name: string;imageUrl:string }[]
    FjobCategory: {
      id: number
      name: string
      industryId: number
      canDoQuickPosting: number
      parentId: number
      avatar: string
    }[]
    FjobDistrict: {
      id: number
      provinceId: number
      name: string
    }[]
    FjobEducationLevel: { id: number; name: string; }[]
    FjobIndustry: { id: number; name: string; }[]
    FjobItem: {
      id: number;
      name: string;
      itemTypeCode: string;
      useLimit: number;
      used: number;
    }[]
    FjobItemType: {
      id: number,
      code: string,
      desc: string,
      image: string
    }[]
    FjobPackageService: {
      id: number
      packageId: number
      serviceId: number
      quality: number
      createdAt: string
      updatedAt: string
    }[]
    FjobPromotionPackage: {
      id: string
      name: string
      desc: string
      basePrice: string
      priceUnit: string
      fromTime: string
      toTime: number
      promotionTypeId: string
      promotionParam1: string
      promotionParam2: string
      buyLimit: string
      sold: string
      useNow: string | null
      createdAt: string
      updatedAt: string
      img: string
      promotionTypeCode: string
      status: number
      userBuyLimit: number
    }[]
    FjobPromotionType: {
      id: number
      name: string
      desc: string
      createdAt: string
      updatedAt: string
    }[]
    FjobProvince: { id: number; name: string; }[]
    FjobService: {
      id: number;
      serviceTypeId: number;
      name: string;
      code: string
      name: string
      desc: string
      img: string | null
      basePrice: number
      priceUnit: number
      quantity: number
      canBuy: number
      addition: string
    }[]
    FjobExperience: { id: number; name: string; }[]
    FjobProfSkill: {
      id: number,
      jobCatId: number,
      name: string
    }[],
    JobReason: {
      id: number,
      name: string,
      type: number,
      createdAt: string,
      updatedAt: string
    }[]
    FjobShift: {
      id: number,
      categoryId: number,
      timeFrom: number,
      timeTo: number,
      name: string
    }[],
    FjobRewardType: {
      id: number,
      rewardDesc: string
    },
    TestCampaign:
    {
      id: number,
      name: string,
      startTime: number,
      endTime: number
    }[]
    TestCategory: {
      id: number,
      name: string,
      type: string
      explanation: string,
      fromPoint: number,
      toPoint: number
    }[]
    TestQuestionAnswer: {
      id: number,
      answerName: string,
      answerContent: string
    }[]
    TestQuestion: {
      id: number,
      content: string
    }[]
    FjobCommune: {
      id: number,
      districtId: number,
      name: string
    }[],
    FjobSetting: {
      JOBPOST_BASIC: string
      JOBPOST_UGENT: string
      BUY_CONTACT_BUY_CALL: string
      CONTACT_ER_SERVICE_ID: string
      IOS_STORE_VERSION: string
      IOS_BUILD_NUMBER: string
      IOS_MIN_VERSION: string
      IOS_MIN_BUILD_NUMBER: string
      ANDROID_STORE_VERSION: string
      ANDROID_MIN_VERSION: string
      ANDROID_BUILD_NUMBER: string
      ANDROID_MIN_BUILD_NUMBER: string
      campaignCheckInNormalId: string
      campaignCheckInTetId: string
      postNumerologyId: string
    },
    JobStatus: { id: number; name: string }[]
    JobType: { id: number; name: string }[]
    WageUnit: { id: number; name: string }[]
    DayOfWeek: { id: number; name: string }[]
    WorkingShift: { id: number; name: string }[]
    Gender: { id: number; name: string }[]
  }

  type InitDataVersionCode = string

}