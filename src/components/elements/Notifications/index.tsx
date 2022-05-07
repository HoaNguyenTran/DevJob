/* eslint-disable react/require-default-props */
import { BellOutlined, CalendarOutlined, CheckOutlined, DeleteOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Badge, Col, Divider, Dropdown, Menu, message, Modal, Row, Skeleton } from 'antd'

import { deleteInAppMessageApi, getMessageInAppApi, getReadAllInAppMessageApi, postReadInAppMessageApi } from 'api/client/notifications'
import moment from 'moment'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useDispatch } from 'react-redux'
import { configConstant } from 'src/constants/configConstant'
import { notificationStatus } from 'src/constants/statusConstant'
import { useAppSelector } from 'src/redux'
import { updateInAppAllNotificationMqtt } from 'src/redux/mqtt'
import { convertParamsSearch, handleError } from 'src/utils/helper'
import styles from './Notification.module.scss'

interface INotifications {
  bgColor?: string
}

const Notifications: FC<INotifications> = (props) => {
  const { bgColor } = props;
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<any>([]);
  const [isLoadingNotifcation, setIsLoadingNotification] = useState(true);
  const [countUnreadNotication, setCountUnreadNotification] = useState<number>(0)
  const [isVisiableNotiDetailModal, setIsVisiableNotiDetailModal] = useState(false);
  const [notificationDetail, setNotificationDetail] = useState<any>({});
  const [paramsSearch, setParamsSearch] = useState({ page: 1, limit: 20 });
  const [isLoadMore, setIsLoadMore] = useState(true)
  const [isFirstShowNoti, setIsFirstShowNoti] = useState(false);
  const [isNewNotifications, setIsNewNotifications] = useState(false);

  const dispatch = useDispatch();
  const { mqtt = {} } = useAppSelector(state => state) || {}


  const loadNotification = async (params) => {
    try {
        const { data } = await getMessageInAppApi(params);
        const formatData = (data?.data || []).filter((item: any) => Number(item.msgStatus) !== notificationStatus.deleted);
        
        if(data?.meta?.pagination?.links?.next) {
          const paramsNextPage = convertParamsSearch(data?.meta?.pagination?.links?.next);
          setParamsSearch(paramsNextPage)
        } else {
          setIsLoadMore(false)
        }

        const newNotifications = [
          ...notifications,
        ];
        
        const ids = notifications.map(item => item.id);

        formatData.forEach(element => {
          if(!ids.includes(element.id)) {
            newNotifications.push(element)
          }
        });

        formatNotificationMqtt().forEach(element => {
            if(!ids.includes(element.id)) {
              newNotifications.unshift(element)
            }
        });

        setNotifications(newNotifications);

    } catch (error) {
      handleError(error)
    } finally {
      setIsLoadingNotification(false);
      setIsFirstShowNoti(true)

    }
  }
  const formatNotificationMqtt = () => mqtt.data.allNotifications.map((item) => ({
    id: item.message?.id,
    title: item?.message?.title,
    detail: item?.message?.detail,
    msgType: item?.message?.msgType,
    msgStatus: Number(item?.message?.msgStatus) || 0,
    updatedAt: moment(item.message.updatedAt).format(configConstant.displayTime.YYYYMMDDHHmmss),
    userId: item?.userId,
    isReadMessage: item?.message?.isReadMessage || false
  }))
  const onClickOptions = (item) => {
    if (document && document.getElementById(`options-menu-dropdown${item.id}`)) {
      (document.getElementById(`options-menu-dropdown${item.id}`) as HTMLInputElement).click()
    }
  }
  const readAllNotfication = async () => {
    try {
      await getReadAllInAppMessageApi();
      message.success("Tất cả các thông báo đã được đánh dấu đọc");
      const newNotifications = notifications.map(element => ({
        ...element,
        msgStatus: notificationStatus.read,
      }))
      const newNotificationsInStore = mqtt.data.allNotifications.map(item => ({
        ...item,
        message: {
          ...item.message,
          msgStatus: notificationStatus.read
        }
      }))

      setNotifications(newNotifications)
      dispatch(updateInAppAllNotificationMqtt(newNotificationsInStore))
    } catch (e) {
      handleError(e)
    }
  }
  const readAndUpdateNotifications = async (event, item) => {
    // event.stopPropagation();
    // onClickOptions(item);
    try {
      await postReadInAppMessageApi(item.id);
      // update notifications
      const newNotifications = notifications.map(element => ({
        ...element,
        msgStatus: Number(element.id) === Number(item.id) ? notificationStatus.read : element.msgStatus
      }))
      const newNotificationsInStore = mqtt.data.allNotifications.map(element => ({
        ...element,
        message: {
          ...element.message,
          msgStatus: Number(element.message.id) === Number(item.id) ? notificationStatus.read : element.message.msgStatus
        }
      }))

      setNotifications(newNotifications)
      dispatch(updateInAppAllNotificationMqtt(newNotificationsInStore))
    } catch (e) {
      handleError(e)
    }
  }
  const openNotiDetailModal = (event, item) => {
    setIsVisiableNotiDetailModal(true);
    setNotificationDetail(item);
    readAndUpdateNotifications(event, item)
  }

  const deleteNotification = async (e, item) => {
    e.stopPropagation();
    onClickOptions(item);
    try {
      await deleteInAppMessageApi(item.id)
      message.success("Xoá thông báo thành công!")
      const newNotifications = notifications.filter(element => Number(element.id) !== Number(item.id))
      setNotifications(newNotifications)

      const newNotificationsInStore = mqtt.data.allNotifications.filter(element => Number(element.message.id) !== Number(item.id))
      dispatch(updateInAppAllNotificationMqtt(newNotificationsInStore))
    } catch (error) {
      handleError(error)
    }
  }

  const onClickNotificationIcon = () => {
    let notificationsInStore = [...mqtt.data.allNotifications];
    notificationsInStore = notificationsInStore.map(item => ({
      ...item,
      message: {
        ...item.message,
        isReadMessage: true,
      }
    }))
    setIsNewNotifications(false)
    dispatch(updateInAppAllNotificationMqtt(notificationsInStore))
    if (!isFirstShowNoti) 
    loadNotification(paramsSearch)
  }

  useEffect(() => {
    if (mqtt.data.allNotifications.length) {
      setIsNewNotifications(true) // show badge
      const newNotifications = [
        ...notifications
      ]
      // check unique notifications
      const ids = notifications.map(item => item.id);

      formatNotificationMqtt().reverse().forEach(element => {
          if(!ids.includes(element.id)) {
            newNotifications.unshift(element)
          }
      });

      setNotifications(newNotifications)

      // count number notifications new and unread
      const countUnReadNotification = formatNotificationMqtt().filter(
        item => Number(item.msgStatus) === notificationStatus.unread && !item.isReadMessage
      );
      setCountUnreadNotification(countUnReadNotification.length)
    }
  }, [JSON.stringify(mqtt.data.allNotifications)])

  return (
    <div className={styles.notification}>
      <Badge count={isNewNotifications ? countUnreadNotication : 0} className="badge-notification" offset={[-6, 4]}  >
        <div className={styles.notification} id="fjob-notification">
          <Dropdown
            getPopupContainer={() => document.getElementById('fjob-notification') as HTMLInputElement}
            placement="bottomCenter"
            arrow
            overlay={
              <Menu id='scrollableDiv' style={{ width: "350px", height: "500px", overflowY: "auto" }} className='p-3'>
                <div className='header font-weight-bold d-flex justify-content-between align-items-center'>
                  <div>
                    Thông báo
                  </div>

                  <Dropdown overlay={
                    <Menu key="menu-setting">
                      <Menu.Item key="read-all">
                        <div onClick={readAllNotfication}>
                          <CheckOutlined style={{ color: 'var(--primary-color)' }} /> Đánh dấu tất cả là đã đọc
                        </div>

                      </Menu.Item>
                    </Menu>
                  } placement="bottomCenter" arrow trigger={['click']}>

                    <SettingOutlined className={`cursor-ponter ${styles.settings}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                </div>
                <Divider className='my-2' />
                {

                  isLoadingNotifcation ?
                    <div className='text-center mt-2'>
                      <Skeleton avatar paragraph={{ rows: 4 }} />
                      <Skeleton avatar paragraph={{ rows: 4 }} className='mt-2' />
                    </div> :
                    <InfiniteScroll
                      dataLength={notifications.length}
                      next={() =>
                        loadNotification(paramsSearch)
                      }
                      hasMore={isLoadMore}
                      loader={ 
                        <Skeleton avatar paragraph={{ rows: 4 }} />
                      }
                      scrollableTarget="scrollableDiv"
                    >
                      {
                        notifications.length ?
                          notifications.map((item: any, index) =>
                            <Fragment key={index}>
                              <Menu.Item key={index} onClick={(e) => openNotiDetailModal(e, item)}>
                                <Row>
                                  <Col span={3}>
                                    <Avatar style={{ minWidth: '32px' }} icon={<BellOutlined style={{ fontSize: "1.5rem" }} />} className='mr-2' />
                                  </Col>
                                  <Col span={18} className={`pl-1 ${Number(item.msgStatus) === notificationStatus.unread ? styles.unreadNotification : ''}`
                                  }>
                                    <div className={styles.formatString}>
                                      {item.title || ""}
                                    </div>
                                    <div className={`${styles.formatString} mt-2`} style={{ fontSize: "14px" }}>
                                      {item.detail || ""}
                                    </div>

                                  </Col>
                                  <Col span={2} className={styles.options}>
                                    <Dropdown className='options' overlay={
                                      <Menu>
                                        <Menu.Item key="delete">
                                          <div onClick={(e: any) => {
                                            deleteNotification(e, item)
                                          }}>
                                            <DeleteOutlined style={{ color: 'var(--primary-color)' }} />
                                            &nbsp; Xoá thông báo
                                          </div>

                                        </Menu.Item>
                                        {
                                          Number(item.msgStatus) !== notificationStatus.read &&
                                          <Menu.Item key="read">
                                            <div onClick={(e: any) => {
                                              e.stopPropagation()
                                              onClickOptions(item)
                                              readAndUpdateNotifications(e, item);
                                            }}>
                                              <CheckOutlined style={{ color: 'var(--primary-color)' }} />
                                              &nbsp; Đánh dấu là đã đọc
                                            </div>
                                          </Menu.Item>
                                        }

                                      </Menu>
                                    } placement="bottomCenter" arrow trigger={['click']} >
                                      <EllipsisOutlined id={`options-menu-dropdown${item.id}`} onClick={e => {
                                        // e.preventDefault();
                                        e.stopPropagation();
                                        // toggleVisiableMenu();
                                      }} />
                                    </Dropdown>

                                  </Col>
                                </Row>
                                <div className={`${Number(item.msgStatus) === notificationStatus.unread ? 'font-weight-bold' : ''} text-right`}
                                  style={{ fontSize: "14px" }}>
                                  <CalendarOutlined className='mr-1' />
                                  {moment(item.updatedAt).format(configConstant.displayTime.DDMMYYYHHmm)}
                                </div>
                              </Menu.Item>
                              <Menu.Divider className={`${index !== notifications.length - 1 ? "d-block" : "d-none"} my-2`} />
                            </Fragment>
                          )
                          : <div className='text-center'>{t('common.noData')}</div>
                      }
                    </InfiniteScroll>
                }

              </Menu>
            }
            trigger={['click']}>
            <div className={`${styles.circleNoti} cursor-pointer`} style={{ background: bgColor ? "var(--secondary-color)" : "#8f30d6" }} onClick={() => {
              onClickNotificationIcon()

            }}>
              <BellOutlined style={{ fontSize: '1.5rem', color: 'white' }} className='cursor-pointer' />
            </div>
          </Dropdown>
        </div>
      </Badge>
      <Modal
        onCancel={() => setIsVisiableNotiDetailModal(false)}
        visible={isVisiableNotiDetailModal}
        width={500}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Chi tiết thông báo</div>
          <div className='mt-5'>
            <Avatar style={{ minWidth: '32px' }} icon={<BellOutlined style={{ fontSize: "1.5rem" }} />} className='mr-2' />
            <span className='font-weight-bold'>{notificationDetail.title || ""}</span>
          </div>
          <div className='mt-3'>
            {notificationDetail.detail || ""}
          </div>
          <div className='mt-3 text-right'>
            <CalendarOutlined className='mr-1' />
            {moment(notificationDetail.updatedAt).format(configConstant.displayTime.DDMMYYYHHmmss)}
          </div>
        </div>
      </Modal>
    </div>


  )
}
export default Notifications;