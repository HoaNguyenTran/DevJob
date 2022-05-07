/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable lines-between-class-members */
export default class Schools {
  id: number = 0;
  name: string = "";
  shortName: string = "";
  schoolType: number = 0;
}
export const SchoolsSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        id: { type: "number", optional: true,  },
        name: { type: "string", max: 150, optional: true,  },
        shortName: { type: "string", max: 50, optional: true,  },
        schoolType: { type: "number", optional: true,  },
        createdAt: { type: "date", optional: true,  },
        updatedAt: { type: "date", optional: true,  },
      }
    }
  }
}
export const SchoolsDetailSchema = {
  data: {
    type: "object", strict: true, props: {
      id: { type: "number", optional: true,  },
      name: { type: "string", max: 150, optional: true,  },
      shortName: { type: "string", max: 50, optional: true,  },
      schoolType: { type: "number", optional: true,  },
      createdAt: { type: "date", optional: true,  },
      updatedAt: { type: "date", optional: true,  },
    }
  },
}
