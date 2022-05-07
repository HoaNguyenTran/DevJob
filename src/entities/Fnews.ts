/* eslint-disabl
/* eslint-disabllines-between-class-members */
export default class Fnews {
  id = 0;

  title = "";

  summary = "";

  originalUrl = "";

  imageUrl = "";

  content = "";

  status = 1;
}
export const FnewsSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true, nullable: true },
        title: { type: "string", max: 250, optional: true, nullable: true },
        summary: { type: "string", optional: true, nullable: true },
        originalUrl: { type: "string", max: 250, optional: true, nullable: true },
        imageUrl: { type: "string", max: 250, optional: true, nullable: true },
        content: { type: "string", optional: true, nullable: true },
        status: { type: "number", optional: true, nullable: true },
      }
    }
  }
}
export const FnewsDetailSchema = {
  data: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true, nullable: true },
        title: { type: "string", max: 250, optional: true, nullable: true },
        summary: { type: "string", optional: true, nullable: true },
        originalUrl: { type: "string", max: 250, optional: true, nullable: true },
        imageUrl: { type: "string", max: 250, optional: true, nullable: true },
        content: { type: "string", optional: true, nullable: true },
        status: { type: "number", optional: true, nullable: true },
      }
  }
}
export const FnewsCategorySchema = {
  data: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true },
        name: { type: "string", max: 250, optional: true, nullable: true },
        type: { type: "number", optional: true },
      }
  }
}
