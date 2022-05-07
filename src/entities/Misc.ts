export const InfoRedeemSchema = {
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