/* eslint-disable camelcase */
declare namespace CommonGlobal {
  interface AddressJobInfo {
    address?: string
    latitude?: number
    longitude?: number
  }

  interface Schedule {
    dayOfWeek: number
    shiftId: number
    workTimeFrom: string | number
    workTimeTo: string | number
  }

  interface JobService {
    fjob_service_code: string
    jobId: number
    priceUnit: number
    quantity: number
    serviceId: number
    serviceName: string
    serviceTypeId: number
  }

  interface Experiences {
    categoryId: number
    experienceId: number
    id: number
    note: string
    userId: number
    userRating?: number
  }

  interface ProSkills {
    createdAt: string
    experience: number
    id: number
    note: string
    profSkillId: number
    updatedAt: string
    userId: number
  }

  interface Educations {
    certificateImg?: string
    createdAt?: string
    degree: string
    endDate: number
    grade?: number
    id: number
    major: string
    name?: string
    otherDesc: string
    schoolId?: number
    shortName?: string
    startDate: number
    updatedAt?: string
    userId?: number
  }

  interface Company {
    adminUserId: number
    avatar: string
    contactPhone: string
    desc: string
    id: number
    imagesJson: string
    industryId: number
    isVerified: number
    name: string
    numEmployee: number
    parentId: number
    shortName: string
    status: number
    userId: number
    userRole: number
    website: string
    companyAddress: any[]
  }

  interface UserAddress {
    address: string
    communeId: number
    districtId: number
    id?: number
    latitude: number
    longitude: number
    main?: number
    provinceId: number
    userAddressId?: number
    provinceName?: string
    districtName?: string
    communeName?: string
    addressDetail?: string
    needSynced?: boolean
  }
  interface UserServices {
    addition?: string
    id: string | number
    priceUnit: number
    quantity: number
    serviceBasePrice: number
    serviceCode: string
    serviceDesc: string
    serviceId: number
    serviceName: string
    serviceTypeId: number
    userId: string | number
    code: string
  }
  interface VipInfo {
    currentPoints: number
    currentVipLevel: null | string | any
    nextVipLevel: any
  }

  interface InfoStatusUser {
    completeAccountInfo?: boolean
    completeEducationLevel?: boolean
    completeProfSkill?: boolean
    completeUserProfile?: boolean
  }

  interface AddressUser {
    isMain: boolean
    idAddress: number
    address: string
    communeId: number
    districtId: number
    provinceId: number
    latitude: number
    longitude: number
  }



}