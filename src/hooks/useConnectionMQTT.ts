import { useEffect, useState } from 'react'
import mqtt from 'mqtt'
import { Base64 } from 'js-base64'
import { mqttConstant } from 'src/constants/mqttConstant'
import { storageConstant } from 'src/constants/storageConstant'

const useConnectionMQTT = user => {
  const [client, setClient] = useState<any>({})

  useEffect(() => {
    const url = `${mqttConstant.protocol}://${mqttConstant.host}:${mqttConstant.port}${mqttConstant.path}`
    const mqttTokenDecode: string = localStorage.getItem(storageConstant.localStorage.mqttToken) || ''
    if (mqttTokenDecode && Object.keys(user?.profile || {}).length) {
      const options: any = {
        protocol: mqttConstant.protocol,
        protocolVersion: 5,
        reconnectPeriod: 3000, // 3s reconnect again
        connectTimeout: 10 * 1000,
        username: mqttConstant.username,
        password: Base64.decode(mqttTokenDecode),
        clean: true,
        keepalive: mqttConstant.keepAlive,
        reschedulePings: true,
        protocolId: 'MQTT',
      }
      const mqttConnect: any = mqtt.connect(url, options)
      setClient(mqttConnect)
    }
  }, [JSON.stringify(user?.profile || {})])
  return { client }
}

export default useConnectionMQTT
