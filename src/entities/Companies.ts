/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class Companies {
  id: number = 1;
  name: string = "";
  contactPhone: string = "";
  website: string = "";
  numEmployee: number = 0;
  industryId: number = 0;
  desc: string = "";
  isVerified: number = 0;
  parentId: number = 0;
  avatar: string = "";
  status: number = 0;
  adminUserId: number = 0;
  shortName: string = "";
  imagesJson: string = "";
  userId: string = "";
  userRole: number = 0;
  companyAddress: {
    id: number,
    shortAddress: string,
    companyId: number
  }[] | undefined = undefined;

}
export const CompaniesSchema = {
  data: {
    type: "array", items: {
    type: "object", strict: true, props: {
      id: { type: "number" },
      name: { type: "string", max: 100, optional: true, nullable: true },
      contactPhone: { type: "string", max: 255, optional: true, nullable: true },
      website: { type: "string", max: 255, optional: true, nullable: true },
      numEmployee: { type: "number", optional: true, nullable: true },
      industryId: { type: "number", optional: true, nullable: true },
      desc: { type: "string", max: 500, optional: true, nullable: true },
      isVerified: { type: "number", optional: true, nullable: true },
      parentId: { type: "number", optional: true, nullable: true },
      avatar: { type: "string", max: 255, optional: true, nullable: true },
      status: { type: "number", optional: true, nullable: true },
      adminUserId: { type: "number", optional: true, nullable: true },
      shortName: { type: "string", max: 50, optional: true, nullable: true },
      imagesJson: { type: "string", optional: true, nullable: true },
      userId: { type: "number", optional: true, nullable: true, default: 0 },
      userRole: { type: "number", optional: true, nullable: true, default: 0 },
      companyAddress: {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", integer: true, optional: true, nullable: true },
            // longitude: { type: "number", integer: true, optional: true, nullable: true },
            // latitude: { type: "number", integer: true, optional: true, nullable: true },
            // address: { type: "string", max: 150, optional: true, nullable: true },
            shortAddress: { type: "string", max: 150, optional: true, nullable: true },
            // provinceId: { type: "number", integer: true, optional: true, nullable: true },
            // districtId: { type: "number", integer: true, optional: true, nullable: true },
            // communeId: { type: "number", integer: true, optional: true, nullable: true },
            // userAddressId: { type: "number", integer: true, optional: true, nullable: true },
            // main: { type: "number", integer: true, optional: true, nullable: true },
            // createdAt: { type: "date", optional: true, nullable: true },
            // updatedAt: { type: "date", optional: true, nullable: true },
            companyId:{ type: "number", optional: true, nullable: true}
          }, optional: true,
        },
      }
    }
    },
  },
  // $$strict:true
}
export const CompanyDetailSchema = {
  data: {
    type: "object", strict: true, props: {
      id: { type: "number" },
      name: { type: "string", max: 100, optional: true, nullable: true },
      contactPhone: { type: "string", max: 255, optional: true, nullable: true },
      website: { type: "string", max: 255, optional: true, nullable: true },
      numEmployee: { type: "number", optional: true, nullable: true },
      industryId: { type: "number", optional: true, nullable: true },
      desc: { type: "string", max: 255, optional: true, nullable: true },
      isVerified: { type: "number", optional: true, nullable: true },
      parentId: { type: "number", optional: true, nullable: true },
      avatar: { type: "string", max: 255, optional: true, nullable: true },
      status: { type: "number", optional: true, nullable: true },
      adminUserId: { type: "number", optional: true, nullable: true },
      shortName: { type: "string", max: 50, optional: true, nullable: true },
      imagesJson: { type: "string", optional: true, nullable: true },
      userId: { type: "number", optional: true, nullable: true, default: 0 },
      userRole: { type: "number", optional: true, nullable: true, default: 0 },
      companyAddress: {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", integer: true, optional: true, nullable: true },
            // longitude: { type: "number", integer: true, optional: true, nullable: true },
            // latitude: { type: "number", integer: true, optional: true, nullable: true },
            // address: { type: "string", max: 150, optional: true, nullable: true },
            shortAddress: { type: "string", max: 150, optional: true, nullable: true },
            // provinceId: { type: "number", integer: true, optional: true, nullable: true },
            // districtId: { type: "number", integer: true, optional: true, nullable: true },
            // communeId: { type: "number", integer: true, optional: true, nullable: true },
            // userAddressId: { type: "number", integer: true, optional: true, nullable: true },
            // main: { type: "number", integer: true, optional: true, nullable: true },
            // createdAt: { type: "date", optional: true, nullable: true },
            // updatedAt: { type: "date", optional: true, nullable: true },
            companyId:{ type: "number", optional: true, nullable: true}
          },
        },
      }
    }
  }
}
