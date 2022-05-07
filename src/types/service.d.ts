declare namespace ServiceGlobal {
  interface ServiceTypeService {
    id: number
    serviceTypeId: number
    code: string
    name: string
    desc: string
    img: string | null
    basePrice: number
    priceUnit: number
    quantity: number
    canBuy: number
    addition: string
  }

  interface ServiceTypeMyService {
    id: number
    userId: number
    quantity: number
    serviceBasePrice: number
    serviceName: string
    serviceDesc: string
    serviceTypeId: number
    addition: string
    priceUnit: number
    serviceCode: string
    userId: string
    serviceId: number
  }


  interface ServiceFullTypeService extends Pagination.Pagi {
    data: ServiceTypeService[]
  }
  interface ServiceFullTypeMyService extends Pagination.Pagi {
    data: ServiceTypeMyService[]
  }

  interface ServiceBuyServiceResponse {
    message: string,
    buyResult: {
      userServices: ServiceTypeMyService[],
      totalDiamondsUsed: number,
      totalDiamondsRemaining: number
    }
  }

  interface UseServiceResponse {
    message: string,
    result: {
      userServices: { id: number, userId: number, serviceId: number, quantity: number }[],
      effects: {
        serviceId: number,
        object: { jobId: number, group: number, validFrom, endAt, id, createdAt, updatedAt }
      }[]
    }
  }

  interface BuyAndUseServiceResponse {
    message: string,
    buyResult: {
      userServices: { [key: string]: string | number }[],
      totalDiamondsUsed: number
      totalDiamondsRemaining: number
    },
    useResult: {
      userServices: { [key: string]: string | number }[],
      effects: {
        serviceId: number,
        object: { [key: string]: string | number }
      }[]
    }
  }

  interface PromotionFull extends Pagination.Pagi {
    data: Promotion[]
  }

  interface Promotion {
    basePrice: number
    buyLimit: number
    fromTime: number
    id: number
    name: string
    img: string
    desc: string
    packageService: {
      id: number
      main: number
      packageId: number
      quantity: number
      serviceId: number
      service: ServiceTypeService
    }
    promotionParam1: number
    promotionParam2: number | null
    promotionTypeCode: string
    promotionTypeId: number
    sold: number
    status: number
    toTime: number
    useNow: null
    userBuyLimit: number
  }
}
