import { actionTypes } from './actions'

interface IMqtt {
  client: any
  data: {
    urgentJobs: any[]
    notificationsByUser: any
    allNotifications: any
    // isFirstShowNotification: boolean
  }
}

export const initialStateUser: IMqtt = {
  client: {},
  data: {
    urgentJobs: [],
    notificationsByUser: [],
    // isFirstShowNotification: false,
    allNotifications: []
  }
}

export const reducers = (state=initialStateUser, action) => {
  switch (action.type) {
    case actionTypes.UPDATE_CLIENT_MQTT:
      return {
        ...state,
        client: action.payload,
      }
    case actionTypes.UPDATE_IN_APP_NOTIFICATION_MQTT:
      return {
        ...state,
        data: {
          ...state.data,
          notificationsByUser: action.payload,
        }
      }
    case actionTypes.UPDATE_IN_APP_ALL_NOTIFICATION_MQTT:
      return {
        ...state,
        data: {
          ...state.data,
          allNotifications: action.payload,
        }
      }
    // case actionTypes.UPDATE_IS_FIRST_SHOW_NOTIFICATION_MQTT:
    //   return {
    //     ...state,
    //     data: {
    //       ...state.data,
    //       isFirstShowNotification: action.payload,
    //     }
    //   }

    default:
      return state
  }
}