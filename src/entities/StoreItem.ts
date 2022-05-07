export const StoreItemSchema = {
  data: {
    type: "array", items: {
      type: "object", strict: true, props: {
        cost: { type: "number", optional: true },
        createdAt: { type: "string", optional: true},
        extraRewards: {
          type: "array", items: {
            type: "object", strict: true, props: {
              id: { type: "number", optional: true },
              storeItemId: { type: "number", optional: true },
              rewardTypeId: { type: "number", optional: true },
              rewardId: { type: "number", optional: true },
              rewardCount: { type: "number", optional: true },
              createdAt: { type: "string", optional: true },
              updatedAt: { type: "string", optional: true },
            }
          }
        },
        id: { type: "number", optional: true },
        imageUrl: { type: "string", optional: true, nullable: true },
        itemId: { type: "string", optional: true},
        itemType: { type: "number", optional: true },
        name: { type: "string", optional: true},
        platform: { type: "number", optional: true },
        updatedAt: { type: "string", optional: true},
        validFrom: { type: "number", optional: true },
        validTo: { type: "number", optional: true },
        walletValue: { type: "number", optional: true },
      }
    }
  }
}
export const StoreItemDetailSchema = {
  data: {
    type: "object", strict: true, props: {
      cost: { type: "number", optional: true },
      createdAt: { type: "string", optional: true},
      extraRewards: {
        type: "array", items: {
          type: "object", strict: true, props: {
            id: { type: "number", optional: true },
            storeItemId: { type: "number", optional: true },
            rewardTypeId: { type: "number", optional: true },
            rewardId: { type: "number", optional: true },
            rewardCount: { type: "number", optional: true },
            createdAt: { type: "string", optional: true },
            updatedAt: { type: "string", optional: true },
          }
        }
      },
      id: { type: "number", optional: true },
      imageUrl: { type: "string", optional: true, nullable: true },
      itemId: { type: "string", optional: true},
      itemType: { type: "number", optional: true },
      name: { type: "string", optional: true},
      platform: { type: "number", optional: true },
      updatedAt: { type: "string", optional: true},
      validFrom: { type: "number", optional: true },
      validTo: { type: "number", optional: true },
      walletValue: { type: "number", optional: true },
    }
  }

}
