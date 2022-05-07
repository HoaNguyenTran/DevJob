/* eslint-disable dot-notation */
import React, { FC, useState, useEffect, useRef } from 'react'
import AgoraRTC, {
  ILocalVideoTrack,
  IRemoteVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
} from 'agora-rtc-sdk-ng'
import { Button } from 'antd'
import useAgora from 'src/hooks/useAgora'
import { useAppSelector } from 'src/redux'
import { contactER, makeCall, contactEE } from 'api/client/notifications'
import { firebase } from 'src/utils/firebase'
import { useTranslation } from 'react-i18next'
import { getAgoraTokenApi } from '../../../../../api/client/user'
import styles from './rtc.module.scss'

interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined
}

const MediaPlayer = (props: VideoPlayerProps) => {
  const { videoTrack, audioTrack } = props
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current)
    return () => {
      videoTrack?.stop()
    }
  }, [container, videoTrack])

  useEffect(() => {
    audioTrack?.play()
    return () => {
      audioTrack?.stop()
    }
  }, [audioTrack])

  return <div ref={container} className="video-player" style={{ width: '100%', height: '100%' }} />
}

const MediaPlayer2 = (props: VideoPlayerProps) => {
  const container = useRef<HTMLDivElement>(null)
  const { videoTrack, audioTrack } = props
  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current)
    return () => {
      videoTrack?.stop()
    }
  }, [container, videoTrack])

  useEffect(() => {
    audioTrack?.play()
    return () => {
      audioTrack?.stop()
    }
  }, [audioTrack])
  return (
    <div
      ref={container}
      className="video-player-guest"
      style={{ width: '150px', height: '200px', border: '2px solid #fff' }}
    />
  )
}

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
})

interface Props {
  handleDisplayCall: (state: boolean) => void
  calleeId: number
  jobId?: number
  mode: string
}

const RTC: FC<any> = ({ mode, jobId, calleeId, handleDisplayCall }) => {
  const { t } = useTranslation()
  const profile = useAppSelector(state => state.user.profile || {})

  const [error, setError] = useState<string>('')
  const appid = process.env.NEXT_PUBLIC_AGORA_APPID
  const [UUID, setUUID] = useState()

  const db = firebase.database()
  const ref = db.ref(`video-calls/${UUID}`)
  ref.on('value', snapshot => {
    const value = snapshot.val()
    // console.log(value)
  })

  const { localAudioTrack, localVideoTrack, leave, join, joinState, remoteUsers } = useAgora(client)

  const channelName = [profile.id, calleeId].sort().join('_')

  const joinAgora = async () => {
    try {
      const getTokenResponse = await getAgoraTokenApi(channelName)
      join(appid, channelName, getTokenResponse.data.data.token, profile.id)
      handleDisplayCall(true)
    } catch (e) {
      setError('Fail')
    }
  }

  const endCall = () => {
    leave()
    if (joinState) {
      ref.remove(e => console.log('remove channel ', e))
    } else {
      handleDisplayCall(false)
    }
  }

  useEffect(() => {
    const call = async () => {
      const callRequestData = {
        calleeId,
        callerId: profile.id,
        callerName: profile.name,
        callerAvatar: profile.avatar,
        handle: 'handle',
        channelName,
      }

      try {
        let uuid
        if (mode === 'toER') {
          if (jobId) {
            callRequestData['jobId'] = jobId
          }
          const contactERResponse = await contactER(callRequestData)
          uuid = contactERResponse.data.uuid
        } else if (jobId) {
          callRequestData['jobId'] = jobId
          const contactEEResponse = await contactEE(callRequestData)
          uuid = contactEEResponse.data.uuid
        } else {
          const makeCallResponse = await makeCall(callRequestData)
          uuid = makeCallResponse.data.uid
        }
        setUUID(uuid)
        await joinAgora()
      } catch (e) {
        setError('Fail')
      }
    }
    call()
    return () => {
      leave()
    }
  }, [])

  return (
    <>
      {!error ? (
        <div className={styles.rtc}>
          {remoteUsers.map(remoteUser => (
            // eslint-disable-next-line react/jsx-key
            <MediaPlayer videoTrack={remoteUser.videoTrack} audioTrack={remoteUser.audioTrack} />
          ))}
          <div className={styles['bottom-function']}>
            <div className={styles['endcall-container']}>
              {joinState ? (
                <i className={`${styles.endcallbutton} fas fa-phone`} onClick={() => endCall()} />
              ) : (
                <button type="button" onClick={() => endCall()}>
                  {t('rtc.endCall')}
                </button>
              )}
            </div>
          </div>
          <div className={styles['remote-container']}>
            <MediaPlayer2 videoTrack={localVideoTrack} audioTrack={localAudioTrack} />
          </div>
        </div>
      ) : (
        <div>
          <p style={{ color: 'red' }}>{t('rtc.cannotCall')}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => endCall()}>{t('rtc.cannotCallOK')}</Button>
          </div>
        </div>
      )}
    </>
  )
}

export default RTC
