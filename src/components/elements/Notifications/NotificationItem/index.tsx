import { Avatar, Col, Dropdown, Menu, Row } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { configConstant } from 'src/constants/configConstant';
import { notificationStatus } from 'src/constants/statusConstant';

import { BellOutlined, CalendarOutlined, CheckOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import moment from 'moment';
import styles from './NotificationItem.module.scss';

interface INotificationItem {
  item: any
  isCloseDropDownMenuItem: boolean
  callbackToggleNotiDetailModal(event, data): void
  callbackDeleteNotification(event, data): void
  callbackReadAndUpdateNotifications(event, data): void
}

const NotificationItem: FC<INotificationItem> = (props) => {
  const { t } = useTranslation();
  const [isVisiableMenuItem, setIsVisiableMenuItem] = useState(false);

  const toggleVisiableMenu = () => {
    setIsVisiableMenuItem(!isVisiableMenuItem)
  }

  const {
    item,
    isCloseDropDownMenuItem = false, 
    callbackToggleNotiDetailModal, 
    callbackDeleteNotification, 
    callbackReadAndUpdateNotifications
  } = props;

  const toggleNotiDetailModal= (e, data) => {
    toggleVisiableMenu()
    if(callbackToggleNotiDetailModal) {
      callbackToggleNotiDetailModal(e, data)
    }
  }
    
  const deleteNotification = (e, data) => {
    toggleVisiableMenu()
    if(callbackDeleteNotification) {
            callbackDeleteNotification(e, data)
    }
  }
  
  const readAndUpdateNotifications = (e, data) => {
    toggleVisiableMenu()
    if(callbackReadAndUpdateNotifications) {
      callbackReadAndUpdateNotifications(e, data)
    }
  }
  // useEffect(()=> {
  //   console.log("isCloseDropDownMenuItem", isCloseDropDownMenuItem);
  //   if(isCloseDropDownMenuItem) {
  //     setIsVisiableMenuItem(false)
  //   }
  // },[isCloseDropDownMenuItem])
  return (
        <Menu.Item key={item.id} className={styles.notificationItem} onClick={(e) => toggleNotiDetailModal(e, item)}>
          <Row>
            <Col span={3}>
              <Avatar style={{ minWidth: '32px' }} icon={<BellOutlined />} className='mr-2' />
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
              <Dropdown 
              
              // visible={isVisiableMenuItem} 
              className='options' 
              overlay={
                // <div onBlur={()=>alert("blur")}>
                    <Menu key="option-menu-item" >
                  <Menu.Item key="delete">
                    <div onClick={(e) => deleteNotification(e, item)}
                    >
                      <DeleteOutlined style={{ color: 'var(--primary-color)' }} />
                      &nbsp; Xoá thông báo
                    </div>

                  </Menu.Item>
                  <Menu.Item key="read">
                    <div onClick={(e: any) => readAndUpdateNotifications(e, item)}>
                      <CheckOutlined style={{ color: 'var(--primary-color)' }} />
                      &nbsp; Đánh dấu là đã đọc
                    </div>

                  </Menu.Item>
                </Menu>
                // </div>
                
              } 
              placement="bottomCenter" 
              arrow 
              trigger={['click']} >
                <a onClick={e => {
                  // e.preventDefault();
                  e.stopPropagation();
                  // toggleVisiableMenu();
                }}>
                  <EllipsisOutlined  />
                </a>
                
              </Dropdown>

            </Col>
         
          </Row>
          <div className={`${Number(item.msgStatus) === notificationStatus.unread ? 'font-weight-bold' : ''} text-right`}
            style={{ fontSize: "14px" }}>
            <CalendarOutlined className='mr-1' />
            {moment(item.updatedAt).format(configConstant.displayTime.DDMMYYYHHmm)}
          </div>
        </Menu.Item>
  )
}
export default NotificationItem;