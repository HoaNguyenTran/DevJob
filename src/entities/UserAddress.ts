/* eslint-disable lines-between-class-members */

export default class UserAddress {
  id?: number = 0;
  userId?: number = 0;
  provinceId?: number = 0;
  districtId?: number = 0;
  communeId?: number = 0;
  address?: string = "";
  latitude?: number = 0;
  longitude?: number = 0;
  needSynced?: boolean = false;
  userAddressId?: number = 0;
}
export const UserAddressSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        // userId: { type: "number", optional: true },
        provinceId: { type: "number", optional: true },
        districtId: { type: "number", optional: true },
        communeId: { type: "number", optional: true },
        address: { type: "string", optional: true },
        latitude: { type: "number", optional: true },
        longitude: { type: "number", optional: true },
        // needSynced: { type: "boolean", optional: true },
        userAddressId: { type: "number", optional: true },
        main: { type: "number", optional: true },
        createdAt: { type: "string", optional: true },
        updatedAt: { type: "string", optional: true },
        //
      }
    },
  }
  // $$strict:true
}
