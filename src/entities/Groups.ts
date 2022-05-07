export const GroupSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number",optional: true, nullable: true},
        user_id: {type: "number",optional: true, nullable: true},
        name: { type: "string", optional: true, nullable: true}
      }
    }
  }
}
export const GroupDetailSchema = {
  data: {
      type: "object", strict: true, props: {
        id: { type: "number",optional: true, nullable: true},
        user_id: {type: "number",optional: true, nullable: true},
        name: { type: "string", optional: true, nullable: true}
      }
  }
}
