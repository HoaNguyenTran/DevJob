/* eslint-disable lines-between-class-members */
/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-inferrable-types */
export default class Services {
  id: number = 0;
  serviceTypeId: number = 0;
  code: string = "";
  name: string = "";
  desc: string = "";
  img: string = "";
  basePrice: number = 0;
  priceUnit: number = 0;
  quantity: number = 0;
  createdAt: number = 1623012141;
  updatedAt: number = 1623012199;
  canBuy: number = 0;
  addition: string = "";
}
export const ServicesSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        serviceTypeId: { type: "number", optional: true },
        code: { type: "string", max: 50, optional: true },
        name: { type: "string", max: 150, optional: true },
        desc: { type: "string", max: 250, optional: true },
        img: { type: "string", max: 250, optional: true },
        basePrice: { type: "number", optional: true },
        priceUnit: { type: "number", optional: true },
        quantity: { type: "number", optional: true },
        canBuy: { type: "number", optional: true },
        addition: { type: "string", max: 500, optional: true },
        createdAt: { type: "date", optional: true },
        updatedAt: { type: "date", optional: true },
      }
    }
  }
}
export const ServicesDetailSchema = {
  data: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        serviceTypeId: { type: "number", optional: true },
        code: { type: "string", max: 50, optional: true },
        name: { type: "string", max: 150, optional: true },
        desc: { type: "string", max: 250, optional: true },
        img: { type: "string", max: 250, optional: true },
        basePrice: { type: "number", optional: true },
        priceUnit: { type: "number", optional: true },
        quantity: { type: "number", optional: true },
        canBuy: { type: "number", optional: true },
        addition: { type: "string", max: 500, optional: true },
        createdAt: { type: "date", optional: true },
        updatedAt: { type: "date", optional: true },
      }
  }
}
export const PromotionSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        name: { type: "string", optional: true },
        desc: { type: "string", optional: true },
        img: { type: "string", optional: true },
        basePrice: { type: "number", optional: true },
        userBuyLimit: { type: "number", optional: true },
        fromTime: { type: "number", optional: true },
        toTime: { type: "number", optional: true },
        promotionTypeId: { type: "number", optional: true },
        promotionParam1: { type: "number", optional: true },
        promotionParam2: { type: "number", optional: true, nullable: true },
        buyLimit: { type: "number", optional: true },
        sold: { type: "number", optional: true },
        useNow: { type: "number", optional: true, nullable: true },
        promotionTypeCode: { type: "string", optional: true },
        status: { type: "number", optional: true },
        packageService: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              packageId: { type: "number", optional: true },
              serviceId: { type: "number", optional: true },
              quantity: { type: "number", optional: true },
              main: { type: "number", optional: true },
              service: {
                type: "object", strict: true, props: {
                  id: { type: "number", optional: true },
                  serviceTypeId: { type: "number", optional: true },
                  code: { type: "string", optional: true },
                  name: { type: "string", optional: true },
                  desc: { type: "string", optional: true },
                  img: { type: "string", optional: true, nullable: true },
                  basePrice: { type: "number", optional: true },
                  priceUnit: { type: "number", optional: true },
                  quantity: { type: "number", optional: true },
                  canBuy: { type: "number", optional: true },
                  addition: { type: "string", optional: true }
                }
              }
            }
          }
        }
      }
    }
  }
}
export const PromotionDetailSchema = {
  data: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        name: { type: "string", optional: true },
        desc: { type: "string", optional: true },
        img: { type: "string", optional: true },
        basePrice: { type: "number", optional: true },
        userBuyLimit: { type: "number", optional: true },
        fromTime: { type: "number", optional: true },
        toTime: { type: "number", optional: true },
        promotionTypeId: { type: "number", optional: true },
        promotionParam1: { type: "number", optional: true },
        promotionParam2: { type: "number", optional: true, nullable: true },
        buyLimit: { type: "number", optional: true },
        sold: { type: "number", optional: true },
        useNow: { type: "number", optional: true, nullable: true },
        promotionTypeCode: { type: "string", optional: true },
        status: { type: "number", optional: true },
        packageService: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              packageId: { type: "number", optional: true },
              serviceId: { type: "number", optional: true },
              quantity: { type: "number", optional: true },
              main: { type: "number", optional: true },
              service: {
                type: "object", strict: true, props: {
                  id: { type: "number", optional: true },
                  serviceTypeId: { type: "number", optional: true },
                  code: { type: "string", optional: true },
                  name: { type: "string", optional: true },
                  desc: { type: "string", optional: true },
                  img: { type: "string", optional: true, nullable: true },
                  basePrice: { type: "number", optional: true },
                  priceUnit: { type: "number", optional: true },
                  quantity: { type: "number", optional: true },
                  canBuy: { type: "number", optional: true },
                  addition: { type: "string", optional: true }
                }
              }
            }
          }
        }
      }
    }
}
