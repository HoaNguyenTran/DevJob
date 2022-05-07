
// check again
declare namespace Auth {
  interface SignupDataPayload {
    fbtoken: string
    name: string
    email: string
    id: string
    avatarUrl: string
    deviceId: string
    password?: string
    phone?: string
  }

  interface SigninDataPayload {
    deviceId: string
    phoneNumber: string
    password: string
  }

  interface UserAddressPayload {
    userId: number
    longitude: number
    latitude: number
    address: string
    provinceId: number
    districtId: number
    communeId: number
    main?: number
  }

  interface UpdateUserAddressPayload {
    main: number
    longitude: number
    latitude: number
    address: string
    provinceId: number
    districtId: number
    communeId: number
  }

  interface UserMultipleFavouriteJobPayload {
    catIds: number[]
    userId: number
  }
  interface FBLoginPayload {
    fbtoken: string
    name: string
    email: string
    id: string
    avatarUrl: string
    deviceId: string
  }
  interface UpdateInfo {
    fbtoken: string
    code: string
    phone: string
    password?: string
  }
}
