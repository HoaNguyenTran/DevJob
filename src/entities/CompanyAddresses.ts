/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class Addresses {
  id: number = 0;
  longitude: number = 0;
  latitude: number = 0;
  address: string = "";
  shortAddress: string = "";
  provinceId: number = 0;
  districtId: number = 0;
  communeId: number = 0;
  userAddressId: number = 0;
  main: number = 0;
}

export const CompanyAddressesScheme = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        longitude: { type: "number", optional: true },
        latitude: { type: "number", optional: true },
        address: { type: "string", max: 150, optional: true },
        shortAddress: { type: "string", max: 150, optional: true },
        provinceId: { type: "number", optional: true },
        districtId: { type: "number", optional: true },
        communeId: { type: "number", optional: true },
        userAddressId: { type: "number", optional: true },
        main: { type: "number", optional: true },
        createdAt: { type: "string", optional: true },
        updatedAt: { type: "string", optional: true },
        companyId: { type: "number", optional: true },
      }
    },
  }
  // $$strict:true
}
export const CompanyAddressesDetailScheme = {
  data: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        longitude: { type: "number", optional: true },
        latitude: { type: "number", optional: true },
        address: { type: "string", max: 150, optional: true },
        shortAddress: { type: "string", max: 150, optional: true },
        provinceId: { type: "number", optional: true },
        districtId: { type: "number", optional: true },
        communeId: { type: "number", optional: true },
        userAddressId: { type: "number", optional: true },
        main: { type: "number", optional: true },
        createdAt: { type: "string", optional: true },
        updatedAt: { type: "string", optional: true },
        companyId: { type: "number", optional: true },
      }
  }
  // $$strict:true
}
