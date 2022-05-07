import React, {
  createContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Button,
  Col,
  message,
  Modal,
  Row,
} from 'antd'
import { deleteSaveJobApi, postJobApplyApi, postSaveJobApi } from 'api/client/job'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { useDispatch } from 'react-redux'
import { updateInAppAllNotificationMqtt, updateInAppNotificationMqtt } from 'src/redux/mqtt'
import { infoUserStatus, notificationStatus } from 'src/constants/statusConstant'
import useConnectionMQTT from 'src/hooks/useConnectionMQTT'
import { checkCompleteInfo, handleError } from 'src/utils/helper'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { CheckOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { errorCodeConstant } from 'src/constants/errorCodeConstant'
import { IMessageNotification, INotification } from './type'
import styles from "./MQTT.module.scss"

export const QosOption = createContext([])

const HookMqtt = () => {
  const [payload, setPayload] = useState<any>({})
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [messagesQueue, setMessagesQueue] = useState<any>([])
  const [isLoadingApply, setIsLoadingApply] = useState(false)

  const router = useRouter()
  const { t } = useTranslation()
  const { user, mqtt = {} } = useAppSelector(state => state)
  const profile = useAppSelector(state => state.user.profile || {});

  const dispatch = useDispatch()

  const { client } = useConnectionMQTT(user)

  const isFirstRef = useRef(false)
  const reconnectRef = useRef(0)
  const cloneMessageRef = useRef({});

  const interval: any = null;

  const [isShowSuggestUpdateInfoModal, setIsShowSuggestUpdateInfoModal] = useState(false)
  const [isSaveJob, setIsSaveJob] = useState(false)




  // const mqttUnSub = (subscription) => {
  //   if (client) {
  //     const { topic } = subscription;
  //     client.unsubscribe(topic, error => {
  //       if (error) {
  //         console.log('Unsubscribe error', error)
  //         return
  //       }
  //       setIsSub(false);
  //     });
  //   }
  // };

  const dataUrgentJobMqtt = {
    topic: `fjob/public/${user.profile?.id}/${configConstant.mqttTopic.topicUrgentPath}`,
    qos: 0,
  }
  const dataAllNotificationsMqtt = {
    topic: `fjob/public/${configConstant.mqttTopic.topicInAppAllNotificationPath}`,
    qos: 0,
  }
  const dataNotificationsByUserMqtt = {
    topic: `fjob/public/${user.profile?.id}/${configConstant.mqttTopic.topicInAppNotificationPath}`,
    qos: 0,
  }

  const mqttSub = () => {
    client.subscribe(dataUrgentJobMqtt.topic, { qos: dataUrgentJobMqtt.qos }, error => {
      console.log("sub thanh cong", `fjob/public/${user.profile?.id}/${configConstant.mqttTopic.topicUrgentPath}`);
      if (error) {
        console.log('Subscribe to topics error', error)
      }
    })
    client.subscribe(dataAllNotificationsMqtt.topic, { qos: dataAllNotificationsMqtt.qos }, error => {
      // console.log("sub thanh cong:", `${dataAllNotificationsMqtt.topic}`);
      if (error) {
        console.log('Subscribe to topics error', error)
      }
    })
    client.subscribe(dataNotificationsByUserMqtt.topic, { qos: dataNotificationsByUserMqtt.qos }, error => {
      // console.log("sub thanh cong:", `${dataNotificationsByUserMqtt.topic}`);
      if (error) {
        console.log('Subscribe to topics error', error)
      }
    })
  }

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible)
  }
  const updateDataStore = (key, array) => {
    localStorage.setItem(key, JSON.stringify(array))
  }
  const handleUpdateQueue = () => {
    const queue = JSON.parse(localStorage.getItem(storageConstant.localStorage.messageQueueStore) || '[]')
    queue.shift();
    setMessagesQueue(queue)
    updateDataStore(storageConstant.localStorage.messageQueueStore, queue)
  }
  const handleCancelPopup = () => {
    handleUpdateQueue()
    toggleModal()
    // setTimeout(() => {
    setIsModalVisible(true)
    // }, configConstant.timeoutUrgentPopup)
  }
  const redirectHiringList = () => {
    handleUpdateQueue()
    toggleModal()
    setTimeout(() => {
      setIsModalVisible(true)
      router.push(routerPathConstant.erPostJob)
    }, configConstant.timeoutUrgentPopup)
  }
  const handleTopicHiringUrgent = () => {
    const queue: any = [...messagesQueue]
    queue.push(payload.message)
    updateDataStore(storageConstant.localStorage.messageQueueStore, queue)
    setMessagesQueue(queue)
  }

  const handleTopicInAppAllNotifications = () => {
    const allNotificationsStore: INotification[] = [...mqtt.data.allNotifications]
    const dataMqtt: any = JSON.parse(payload.message);
    // console.log("dataMqtt", dataMqtt);

    allNotificationsStore.unshift(dataMqtt)
    dispatch(updateInAppAllNotificationMqtt(allNotificationsStore))
  }
  const redirectJobDetail = data => {
    handleUpdateQueue()
    router.push(routerPathConstant.jobDetail.replace(':id', data?.job?.id))
  }

  const checkOpenModal = () => true; // !router.pathname.includes(routerPathConstant.jobDetail.replace('/:id', ''));

  const applyJob = async data => {
    setIsLoadingApply(true);
    try {
      handleUpdateQueue()
      await postJobApplyApi({
        'jobId': data?.job?.id,
        'userId': data?.userId,
      })
      message.success('Ứng tuyển công việc thành công!')
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoadingApply(false)
      setIsModalVisible(false)
    }
  }

  const handleOpenLinkJob = (data) => {
    switch (checkCompleteInfo(profile)) {

      case infoUserStatus.infoAcc:
        return router.push({
          pathname: routerPathConstant.portfolio,
          query: {
            next: encodeURIComponent(data?.job?.id ? `/job/${data?.job?.id}` : router.asPath),
          }
        })

      case infoUserStatus.cv:
        return router.push({
          pathname: routerPathConstant.accInfo,
          query: {
            next: encodeURIComponent(data?.job?.id ? `/job/${data?.job?.id}` : router.asPath),
          }
        })

      case infoUserStatus.nothing:
        return router.push({
          pathname: routerPathConstant.accInfo,
          query: {
            next: encodeURIComponent(routerPathConstant.portfolio),
            attachNext: encodeURIComponent(data?.job?.id ? `/job/${data?.job?.id}` : router.asPath),
          }
        })

      default:
        break;
    }
  }



  useEffect(() => {
    const messageQueueStore = JSON.parse(
      localStorage.getItem(storageConstant.localStorage.messageQueueStore) || '[]',
    )
    if (messageQueueStore && messageQueueStore.length) {
      setIsModalVisible(true)
      setMessagesQueue(messageQueueStore)
    }
  }, [])

  // useEffect(() => {

  //   // if(messagesQueue.length) {
  //   //   interval = setInterval(() => {
  //   //     console.log("vao day");
  //   //     handleCancelPopup();
  //   //     clearInterval(interval)
  //   //   }, 6000);
  //   // }
  //   //  else {
  //   //   clearInterval(interval)
  //   // }
  // }, [JSON.stringify(messagesQueue)])

  useEffect(() => {
    if (Object.keys(client).length && Object.keys(user).length && !isFirstRef.current) {
      client.on('connect', () => {
        mqttSub();
        reconnectRef.current = 0
      })
      client.on('error', err => {
        console.error('Connection error: ', err)
        client.end()
      })
      client.on('reconnect', err => {
        reconnectRef.current += 1
        // reconnect 5 times
        if (reconnectRef.current === 5) {
          client.end()
        }
        console.log('Reconnecting', err)
      })
      client.on('message', (topic, mess) => {
        const payloadClient = { topic, message: mess.toString() }
        setPayload(payloadClient)
        reconnectRef.current = 0
      })
      if (!isFirstRef.current) {
        isFirstRef.current = true
      }
    }
  }, [JSON.stringify(client), JSON.stringify(user)])

  useEffect(() => {
    if (Object.keys(payload).length) {
      const topic = payload.topic || ''
      switch (topic) {
        case dataUrgentJobMqtt.topic:
          if (!isModalVisible) {
            toggleModal()
          }
          handleTopicHiringUrgent()
          break;

        case dataNotificationsByUserMqtt.topic:
        case dataAllNotificationsMqtt.topic:
          handleTopicInAppAllNotifications()

          break;

        default:
          break;
      }
    }
  }, [JSON.stringify(payload)])

  const firstMessage = messagesQueue[0] || '{}'
  const messageObj = JSON.parse(firstMessage)

  const messageTitle = messageObj?.job?.title
  const messageDescription = messageObj?.job?.detailDesc
  const messageWorkingAddress = messageObj?.job?.workingAddress

  const handleSaveJob = async e => {
    e.preventDefault();
    try {
      await postSaveJobApi({ userId: profile.id, jobId: messageObj.job?.id })
      setIsSaveJob(true)
      message.success("Thêm công việc vào danh sách yêu thích thành công.")
    } catch (error: any) {
      if (!(error?.response?.data.errorCode === errorCodeConstant.invalidHeader)) {
        message.error((error as ErrorMsg)?.response?.data?.message)
      }
    }
  }

  const handleUnSaveJob = async e => {
    e.preventDefault()
    try {
      await deleteSaveJobApi(messageObj.job?.id)
      setIsSaveJob(false)
      message.success("Hủy công việc yêu thích thành công.")
    } catch (error: any) {
      if (!(error?.response?.data.errorCode === errorCodeConstant.invalidHeader)) {
        handleError(error)
      }
    }
  }

  return (
    <div>
      {isModalVisible && checkOpenModal() && !!Object.keys(messageObj).length
        && (<ModalPopup
        visible={isModalVisible}
        handleCancelModal={handleCancelPopup}
        handleConfirmModal={() => {
          cloneMessageRef.current = { ...messageObj };
          handleCancelPopup()
          if (checkCompleteInfo(profile) === infoUserStatus.full) return applyJob(messageObj);
          return setIsShowSuggestUpdateInfoModal(true)
        }}
        textConfirm="Ứng tuyển"
        title="Thông báo!"
        iconTopRight={(
          <>
            {
              isSaveJob ? (
                <HeartFilled className={styles.icon} onClick={e => handleUnSaveJob(e)} />
              ) : (
                <HeartOutlined className={styles.icon} onClick={e => handleSaveJob(e)} />
              )
            }
          </>
        )}
        >
        <div>
            <div className="content text-left font-weight-bold">{messageTitle}</div>
            <div className="content text-left mt-2">Mô tả: {messageDescription}</div>
            <div className="content text-left mt-2">Địa chỉ: {messageWorkingAddress}</div>
            <div
              className="content text-left font-weight-bold mt-4 cursor-pointer"
              onClick={() => redirectJobDetail(messageObj)}
            >
              Xem thêm...
            </div>
          </div>
        </ModalPopup>)
      }

      {isShowSuggestUpdateInfoModal &&
        <ModalPopup
          visible={isShowSuggestUpdateInfoModal} title="Thông báo"
          handleCancelModal={() => setIsShowSuggestUpdateInfoModal(false)}
          handleConfirmModal={() => { setIsShowSuggestUpdateInfoModal(false); handleOpenLinkJob(cloneMessageRef.current) }}
        >
          <div className={styles.modal_update}>
            <div className={styles.title}>Bạn chưa điền đầy đủ thông tin cá nhân!</div>
            <div className={styles.subtitle}>Vui lòng cập nhật thông tin để nhà tuyển dụng có thể nhìn thấy thông tin của bạn.</div>
            <div className={styles.item}>
              {checkCompleteInfo(profile) === infoUserStatus.infoAcc ? <CheckOutlined style={{ color: 'var(--green-color)' }} /> : <CheckOutlined style={{ color: 'var(--gray-color)' }} />} <div>Thông tin tài khoản</div>
            </div>
            <div className={styles.item}>
              {checkCompleteInfo(profile) === infoUserStatus.cv ? <CheckOutlined style={{ color: 'var(--green-color)' }} /> : <CheckOutlined style={{ color: 'var(--gray-color)' }} />} <div>Hồ sơ cá nhân</div>
            </div>
          </div>
        </ModalPopup>}
    </div>
  )
}

export default HookMqtt
