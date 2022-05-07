import { actionTypesNotification, NotificationAction } from "./actions"
import { INotification } from "./types"



export const initialStateNotification = {
  data: "",
  type: ""
}

export const reducers = (state: INotification = initialStateNotification, action: NotificationAction): INotification => {
  switch (action.type) {
    case actionTypesNotification.GET_NOTIFICATION_REQUEST:
      return {
        ...state,
        ...action.payload
      }
    case actionTypesNotification.RESET_NOTIFICATION_REQUEST:
      return {
        ...state,
        ...initialStateNotification
      }

    default:
      return state
  }
}
