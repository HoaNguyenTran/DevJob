import { getMessageInAppApi } from 'api/client/notifications'
import { formatRelative } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { handleError } from 'src/utils/helper'
import viLocale from 'date-fns/locale/vi'
import styles from "./Notify.module.scss"

const Notify = (): JSX.Element => {
  const [personMessage, setPersonMessage] = useState<any[]>([])
  const [globalMessage, setGlobalMessage] = useState<any[]>([])

  const fetchDataNotify = async () => {
    try {
      const { data } = await getMessageInAppApi({ page: 1, limit: 100 })
      setPersonMessage(data.data?.filter(item => item.msgType === 1))
      setGlobalMessage(data.data?.filter(item => item.msgType === 0))
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  useEffect(() => {
    fetchDataNotify()
  }, [])

  return (
    <div className={styles.notify}>
      <div className={styles.person}>
        <div className={styles.message}>Thông báo việc làm</div>
        <div className={styles.content}>
          {personMessage.length
            ? personMessage.map(notify => <div key={notify.id} className={styles.item}>
              <div className={styles.title}>{notify.title}</div>
              <div className={styles.subtitle}>{notify.detail}</div>
              <div className={styles.time}><img alt="" src="/assets/icons/default/time.svg" />&nbsp;{formatRelative(new Date(notify.updatedAt), new Date(), { locale: viLocale })}</div>
            </div>)
            : <div className={styles.empty}>Không có thông báo nào!</div>
          }
        </div>
      </div>
      <div className={styles.global}>
        <div className={styles.message}>Có thể bạn quan tâm</div>
        <div className={styles.content}>
          {globalMessage.length
            ? globalMessage.map(notify => <div key={notify.id} className={styles.item}>
              <div className={styles.title}>{notify.title}</div>
              <div className={styles.subtitle}>{notify.detail}</div>
              <div className={styles.time}><img alt="" src="/assets/icons/default/time.svg" />&nbsp;
                {formatRelative(new Date(notify.updatedAt), new Date(), { locale: viLocale })}
              </div>
            </div>)
            : <div className={styles.empty}>Không có thông báo nào!</div>
          }
        </div>
      </div>
    </div>
  )
}

export default Notify