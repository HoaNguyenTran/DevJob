import React, {
  FC,
  useState,
} from 'react'

import {
  message,
  Modal,
} from 'antd'
import { postBuySerProApi } from 'api/client/service'
import Payment from 'src/components/elements/Payment/Payment'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatDiamond, handleError } from 'src/utils/helper'

import { storageConstant } from 'src/constants/storageConstant'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { regexPattern } from 'src/utils/patterns'
import styles from './BuyMoreModal.module.scss'

type CartItemType = {
  id: number
  price: number
  quantity: number
}

interface IProps {
  handleCloseModalService(): void
  myPackageServices: any
  otherServices: any
}

const BuyMoreModalForUrgent: FC<IProps> = ({
  handleCloseModalService,
  myPackageServices,
  otherServices,
}) => {

  const profile = useAppSelector(state => state.user.profile || {})
  const dispatch = useAppDispatch()
  const [cartService, setCartService] = useState([] as CartItemType[])
  const [isModalConfirm, setIsModalConfirm] = useState(false)

  const [modalPayment, setModalPayment] = useState(false)

  const handleCloseModalPayment = () => {
    setModalPayment(false)
  }

  const showModalConfirm = () => {
    if (handleTotalCart() <= 0) {
      message.error('Hãy chọn ít nhất 1 dịch vụ để thanh toán!')
    } else if (handleTotalCart() > profile.walletValue)
      message.error('Hãy nạp thêm kim cương để mua dịch vụ!')
    else setIsModalConfirm(true)
  }

  const handleChangeToCart = (itemId: number, itemPrice: number, qty: number) => {
    const resultSetState = prev => {
      const isItemInCart = prev.find(item => item.id === itemId)
      if (isItemInCart) {
        return prev.map(item => (item.id === itemId ? { ...item, quantity: qty } : item))
      }
      return [...prev, { id: itemId, price: itemPrice, quantity: qty }]
    }

    setCartService(resultSetState)
  }

  const handleAddToCart = (itemId: number, itemPrice: number) => {
    const resultSetState = prev => {
      const isItemInCart = prev.find(item => item.id === itemId)
      if (isItemInCart) {
        return prev.map(item =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { id: itemId, price: itemPrice, quantity: 1 }]
    }

    setCartService(resultSetState)
  }

  const handleRemoveFromCart = (id: number) => {
    const resultSetState = prev =>
      prev.reduce((ack: CartItemType[], item: { id: number; quantity: number }) => {
        if (item.id === id) {
          if (item.quantity === 1) return ack
          return [...ack, { ...item, quantity: item.quantity - 1 }]
        }
        return [...ack, item]
      }, [] as CartItemType[])

    setCartService(resultSetState)
  }

  const handleTotalCart = () =>
    cartService.reduce((ack, item) => ack + item.price * item.quantity, 0)

  const handlePayment = async () => {
    if (profile.walletValue < handleTotalCart()) {
      return message.error('Vui lòng nạp thêm kim cương để mua dịch vụ!')
    }
    setIsModalConfirm(false)
    try {
      const newCartService = cartService.map(item => ({
        serviceId: parseInt(item.id.toString(), 10),
        quantity: item.quantity,
      }))
      const responseBuy = await postBuySerProApi({
        services: newCartService,
        promotions: [],
      })

      if (responseBuy) {
        const userCode = localStorage.getItem(storageConstant.localStorage.userCode)
        if (userCode) {
          dispatch(getProfileRequest({ userCode }))
        }

        setCartService([])
        message.success(responseBuy.data.message)
        handleCloseModalService()
      }
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className={`buyMoreModal ${styles.buy}`}>
      <div
        className={styles.buy_coin}
        onClick={() => {
          setModalPayment(true)
          handleCloseModalService()
        }}
      >
        <div>Nạp kim cương</div>
      </div>
      <div className={styles.buy_wrap}>
        <div className={styles.buy_service}>
          <div className={styles.buy_service_title}>Danh sách dịch vụ đăng tuyển</div>

          {/* {(item => ( */}
          {myPackageServices.map(item => (
            <div key={item.id} className={styles.buy_item}>
              <div className={styles.buy_item_title}>
                <span>Dịch vụ: </span>
                {item.serviceName}
              </div>
              <div className={styles.buy_item_desc}>
                <span>Mô tả: </span>
                <div className="ml-4">{item.serviceDesc}</div>
              </div>
              <div className={styles.buy_item_input}>
                <div className={styles.buy_item_price}>
                  <div>Đơn giá:</div> <span>{item.serviceBasePrice} kim cương</span>
                </div>
                <div className={styles.buy_item_quantity}>
                  <span>Số lượng cần mua:</span>
                  <div
                    className={styles.buy_item_minus}
                    onClick={() => handleRemoveFromCart(item.serviceId)}
                  >
                    <span>-</span>
                  </div>
                  <div className={styles.buy_item_qty}>
                    <input
                      value={cartService.find(i => i.id === item.serviceId)?.quantity || 0}
                      onChange={e =>{
                        if(regexPattern.digit.test(e.target.value)) 
                        handleChangeToCart(
                          item.serviceId,
                          item.serviceBasePrice,
                          Number(e.target.value),
                        )
                      }
                      }
                    />
                  </div>
                  <div
                    className={styles.buy_item_plus}
                    onClick={() => handleAddToCart(item.serviceId, item.serviceBasePrice)}
                  >
                    <span>+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* ))} */}

          <div className={styles.buy_service_title}>Danh sách dịch vụ khác</div>
          {otherServices.map(item => (
            <div key={item.id} className={styles.buy_item}>
              <div className={styles.buy_item_title}>
                <span>Dịch vụ: </span>
                {item.serviceName}
              </div>
              <div className={styles.buy_item_desc}>
                <span>Mô tả: </span>
                <div className="ml-4">{item.serviceDesc}</div>
              </div>
              <div className={styles.buy_item_input}>
                <div className={styles.buy_item_price}>
                  <div>Đơn giá:</div> <span>{item.serviceBasePrice} kim cương</span>
                </div>
                <div className={styles.buy_item_quantity}>
                  <span>Số lượng cần mua:</span>
                  <div
                    className={styles.buy_item_minus}
                    onClick={() => handleRemoveFromCart(item.serviceId)}
                  >
                    <span>-</span>
                  </div>
                  <div className={styles.buy_item_qty}>
                    <input
                      type="number"
                      min={0}
                      value={cartService.find(i => i.id === item.serviceId)?.quantity || 0}
                      onChange={e => {
                        if(regexPattern.digit.test(e.target.value))
                        handleChangeToCart(
                          item.serviceId,
                          item.serviceBasePrice,
                          Number(e.target.value),
                        )
                      }}
                    />
                  </div>
                  <div
                    className={styles.buy_item_plus}
                    onClick={() => handleAddToCart(item.serviceId, item.serviceBasePrice)}
                  >
                    <span>+</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.buy_total}>
        <div className={styles.buy_total_wrap}>
          <div>
            <div>
              Tổng cộng: <span>{formatDiamond(handleTotalCart())} kim cương</span>
            </div>
            <div>Bạn còn {formatDiamond(profile.walletValue) || 0} kim cương trong ví</div>
          </div>
          <div className={styles.buy_total_payment} onClick={showModalConfirm}>
            Thanh toán
          </div>
        </div>
      </div>
      
      <ModalPopup
        isCancelBtn={false}
        isConfirmBtn={false}
        visible={isModalConfirm}
        closeBtn
        title="Xác nhận thanh toán"
        handleCancelModal={() => setIsModalConfirm(false)}
      >
        <div className={styles.modal_buy}>
          <div className={`${styles.modal_buy_chance  } text-center`}>
            Bạn có chấp nhận thanh toán <span>{formatDiamond(handleTotalCart())} <img src='/assets/icons/color/diamond.svg' alt='kim cương' /> </span>
            không?
          </div>
          <div className={styles.modal_buy_btn} onClick={handlePayment}>
            Thanh toán
          </div>
        </div>
      </ModalPopup>

      <Modal visible={modalPayment} footer={null} onCancel={handleCloseModalPayment} width={1000}>
        <Payment handleCloseModalPayment={handleCloseModalPayment} />
      </Modal>
    </div>
  )
}

export default BuyMoreModalForUrgent
