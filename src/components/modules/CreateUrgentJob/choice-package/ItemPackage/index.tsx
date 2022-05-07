import { Button, Col, message, Row } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import styles from './ItemPackage.module.scss'

export default function ItemPackage(props) {
  const { item = {}, callBackChoosePackage, user } = props
  const [isChoosePackage, setIsChoosePackage] = useState(false)
  const [isConfirmUsingCoin, setIsConfirmUsingCoin] = useState(false)
  const { t } = useTranslation()

  const choosePackage = () => {
    if (item.basePrice > user?.profile?.walletValue) {
      message.error('Hãy nạp thêm kim cương để mua dịch vụ!')
      return
    }
    if (!isChoosePackage) {
      if (!item.quantity) {
        setIsConfirmUsingCoin(!isConfirmUsingCoin)
      } else {
        setIsChoosePackage(!isChoosePackage)
        if (callBackChoosePackage) callBackChoosePackage(item, isChoosePackage)
      }
    } else {
      setIsChoosePackage(!isChoosePackage)
      if (callBackChoosePackage) callBackChoosePackage(item, isChoosePackage)
    }
  }

  const confirmUsingCoin = () => {
    setIsChoosePackage(!isChoosePackage)
    setIsConfirmUsingCoin(!isConfirmUsingCoin)
    if (callBackChoosePackage) callBackChoosePackage(item, isChoosePackage, true)
  }

  return (
    <Row className={`justify-content-between ${styles.item_package}`} key={item.id}>
      <Col xs={24} md={24} className='d-flex align-items-center justify-content-between'>
        <div>
          <div className="font-weight-bold">{item.name}</div>
          <div className="my-2">{item.desc}</div>
          <div className="d-flex justify-content-between">
            <div className={styles.price}><span style={{color: "black"}}>Bạn còn:</span> {item.quantity || 0} gói</div>
            </div>
        </div>
        
          <div className="hiring_continue">
            <Button htmlType="button" type="primary" onClick={() => choosePackage()} 
              style={isChoosePackage ? {background: 'var(--secondary-color)', border: 0} : {background: 'var(--primary-color)'} }>
              {isChoosePackage ? 'Sử dụng (1)' : 'Sử dụng'}
            </Button>
          </div>
      </Col>

      <ModalPopup
        title="Xác nhận thanh toán"
        visible={isConfirmUsingCoin}
        handleCancelModal={() => setIsConfirmUsingCoin(!isConfirmUsingCoin)}
        handleConfirmModal={confirmUsingCoin}
      >
        <div className="mt-2">{`Bạn xác nhận thanh toán ${item.basePrice} KC để mua gói dịch vụ: ${item.name} `}</div>
      </ModalPopup>
    </Row>
  )
}
