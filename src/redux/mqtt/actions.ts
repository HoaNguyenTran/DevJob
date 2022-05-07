export enum actionTypes {
  UPDATE_CLIENT_MQTT = 'mqtt/UPDATE_CLIENT_MQTT',
  UPDATE_URGENT_JOBS_MQTT = 'mqtt/UPDATE_URGENT_JOBS_MQTT',
  UPDATE_IN_APP_NOTIFICATION_MQTT = 'mqtt/UPDATE_IN_APP_NOTIFICATION_MQTT',
  UPDATE_IN_APP_ALL_NOTIFICATION_MQTT = 'mqtt/UPDATE_IN_APP_ALL_NOTIFICATION_MQTT',
  // UPDATE_IS_FIRST_SHOW_NOTIFICATION_MQTT = 'mqtt/UPDATE_IS_FIRST_SHOW_NOTIFICATION_MQTT',
}
export const updateClientMqtt = (payload) => ({
  type: actionTypes.UPDATE_CLIENT_MQTT,
  payload,
})
export const updateUrgentJobsMqtt = (payload) => ({
  type: actionTypes.UPDATE_URGENT_JOBS_MQTT,
  payload,
})

export const updateInAppNotificationMqtt = (payload) => ({
  type: actionTypes.UPDATE_IN_APP_NOTIFICATION_MQTT,
  payload,
})

export const updateInAppAllNotificationMqtt = (payload) => ({
  type: actionTypes.UPDATE_IN_APP_ALL_NOTIFICATION_MQTT,
  payload,
})
// export const updateIsfirstShowNotificationMqtt = (payload:boolean) => ({
//   type: actionTypes.UPDATE_IS_FIRST_SHOW_NOTIFICATION_MQTT,
//   payload,
// })