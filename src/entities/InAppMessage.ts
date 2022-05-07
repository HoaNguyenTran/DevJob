export const InAppMessageSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        detail: { type: "string", optional: true, nullable: true },
        id: { type: "number", optional: true, nullable: true },
        msgStatus: { type: "string", optional: true, nullable: true },
        msgType: { type: "number", optional: true, nullable: true },
        title: { type: "string", optional: true, nullable: true },
        updatedAt: { type: "string", optional: true, nullable: true },
        userId: { type: "number", optional: true, nullable: true },
      }
    }
  },
  // optional: true,
  // nullable: true
  //
  // $$strict:true
}
