declare namespace DiamondGlobal {
  interface DiamondPackageResponse {
    cost: number
    createdAt: string
    extraRewards:
    {
      id: number,
      rewardCount: string
    }[]
    id: number
    imageUrl: null
    itemId: string
    itemType: number
    name: string
    platform: number
    updatedAt: string
    validFrom: null
    validTo: null
    walletValue: number
  }
}
