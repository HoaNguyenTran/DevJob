/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class UserCompanies {
  id: number = 0;
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
}
export const UserCompaniesSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true, nullable: true },
        name: { type: "string", optional: true, nullable: true },
        contactPhone: { type: "string", optional: true, nullable: true },
        website: { type: "string", optional: true, nullable: true },
        numEmployee: { type: "number", optional: true, nullable: true },
        industryId: { type: "number", optional: true, nullable: true },
        desc: { type: "string", optional: true, nullable: true },
        isVerified: { type: "number", optional: true, nullable: true },
        parentId: { type: "number", optional: true, nullable: true },
        avatar: { type: "string", optional: true, nullable: true },
        status: { type: "number", optional: true, nullable: true },
        adminUserId: { type: "number", optional: true, nullable: true },
        shortName: { type: "string", optional: true, nullable: true },
        imagesJson: { type: "string", optional: true, nullable: true },
        userId: { type: "number", optional: true, nullable: true, default: 0 },
        userRole: { type: "number", optional: true, nullable: true, default: 0 },
        // createdAt: { type: "date", optional: true, nullable: true },
        // updatedAt: { type: "date", optional: true, nullable: true },
      }
    },
  }
  // $$strict:true
}
