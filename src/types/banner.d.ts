
declare namespace BannerDto{
  interface BannerResponse extends Pagination.Pagi {
    data: Banner[]
  }

  interface Banner{
    id: number
    bannerType: number
    bannerWebUrl: string
    bannerUrl: string
    status: number
    openTime: number
    expireTime: number
    bannerLink: string
    deepLink:string
  }
}