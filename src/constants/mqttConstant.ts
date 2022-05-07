export const mqttConstant = {
  host: process.env.NEXT_PUBLIC_MQTT_HOST,
  port: 8084,
  protocol: 'wss',
  username: 'fjob',
  password: '',
  path: '/mqtt',
  keepAlive: 90,
  connectTimeout: 4000,
}
