/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class UserService {
  id: string = "";
  userId: string = "";
  serviceId: number | undefined = undefined;
  quantity: number | undefined = undefined;
  serviceName: string = "";
  serviceDesc: string = "";
  serviceBasePrice: number | undefined = undefined;
  serviceCode: string = "";
  serviceTypeId: number | undefined = undefined;
  addition: string = "";
  priceUnit: number | undefined = undefined;
}
export const UserServiceSchema = {
  data: {
    type: "array", items: {
    type: "object", strict: true, props: {
      id: { type: "number", optional: true, nullable: true },
      userId: { type: "number", optional: true, nullable: true },
      serviceId: { type: "number", optional: true, nullable: true },
      quantity: { type: "number", optional: true, nullable: true },
      serviceName: { type: "string", optional: true, nullable: true },
      serviceDesc: { type: "string", optional: true, nullable: true },
      serviceBasePrice: { type: "number", optional: true, nullable: true },
      serviceCode: { type: "string", optional: true, nullable: true },
      serviceTypeId: { type: "number", optional: true, nullable: true },
      addition: { type: "string", max: 500, optional: true, nullable: true },
      priceUnit: { type: "number", optional: true, nullable: true },
      // can_buy: { type: "number", optional: true, nullable: true },
      // createdAt: { type: "date", optional: true, nullable: true },
      // updatedAt: { type: "date", optional: true, nullable: true },
    }
    },
  }
  // $$strict:true
}
