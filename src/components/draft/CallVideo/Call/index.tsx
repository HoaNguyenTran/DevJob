import React, { FC, useState } from 'react'
import { Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { PhoneOutlined } from '@ant-design/icons'
import styles from './call.module.scss'

interface Props {
  calleeId: number
  jobId?: number
  mode: string
}

const Call: FC<any> = props => {
  const { t } = useTranslation()
  const [displayCall, setDisplayCall] = useState<boolean>(false)
  const [confirmCallDialog, setConfirmCallDialog] = useState<boolean>(false)

  const RTC = dynamic(() => import('src/components/draft/CallVideo/RTC'), { ssr: false })

  const call = () => {
    setConfirmCallDialog(true)
  }

  const handleCancelPopupConfirm = () => {
    setConfirmCallDialog(false)
  }

  const handleOKPopupConfirm = async () => {
    setConfirmCallDialog(false)
    setDisplayCall(true)
  }

  const handleDisplayCall = state => {
    setDisplayCall(state)
  }

  return (
    <>
      <button type="button" className={styles['btn-call']} onClick={() => call()}>
        {/* <i style={{ marginRight: '2px' }} /><PhoneOutlined /> {" "} */}
        {t('call.contact')}
      </button>
      <Modal
        visible={displayCall}
        centered
        width="70%"
        footer={null}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
      >
        <RTC
          mode={props.mode}
          calleeId={props.calleeId}
          jobId={props.jobId}
          handleDisplayCall={handleDisplayCall}
        />
      </Modal>
      <Modal
        visible={confirmCallDialog}
        centered
        width="300px"
        footer={null}
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
      >
        <p className={styles['confirm-payment']}>{t('call.confirmPaymentTitle')}</p>
        <p>{t('call.confirmPaymentContent')}</p>
        <div className="d-flex" style={{ justifyContent: 'center' }}>
          <button
            type="button"
            className={`${styles.btn} ${styles['btn-cancelpayment']}`}
            onClick={() => handleCancelPopupConfirm()}
          >
            {t('call.confirmPaymentCancel')}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles['btn-confirmpayment']}`}
            onClick={() => handleOKPopupConfirm()}
          >
            {t('call.confirmPaymentOK')}
          </button>
        </div>
      </Modal>
      <style jsx>{`
        .ant-modal {
          width: 90vw !important;
        }
      `}</style>
    </>
  )
}

export default Call
