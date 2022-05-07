export interface INotification {
  userId: number
  message: IMessageNotification
  id: number
}
export interface IMessageNotification {
  title: string
  detail: string
  msgType?: number
  openTime?: number | null
  expireTime?: number | null
  userIds?: number[]
  rewards?: any[]
}