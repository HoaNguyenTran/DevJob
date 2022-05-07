import { INotification } from "./types"


export interface getNotificationRequestAction {
  type: typeof actionTypesNotification.GET_NOTIFICATION_REQUEST
  payload: INotification
}

export interface resetNotificationRequestAction {
  type: typeof actionTypesNotification.RESET_NOTIFICATION_REQUEST
}


export type NotificationAction =
  | getNotificationRequestAction
  | resetNotificationRequestAction

export enum actionTypesNotification {
  GET_NOTIFICATION_REQUEST = 'notification/GET_NOTIFICATION_REQUEST',
  RESET_NOTIFICATION_REQUEST = 'notification/RESET_NOTIFICATION_REQUEST',
}


export const getNotificationRequest = (payload: INotification): getNotificationRequestAction => ({
  type: actionTypesNotification.GET_NOTIFICATION_REQUEST,
  payload
})

export const resetNotificationRequest = (): resetNotificationRequestAction => ({
  type: actionTypesNotification.RESET_NOTIFICATION_REQUEST,
})
