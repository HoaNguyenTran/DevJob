import { message, Modal } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { getAllServiceApi, postBuySerProApi } from 'api/client/service'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatDiamond, handleError } from 'src/utils/helper'
import Payment from 'src/components/elements/Payment/Payment'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'

import { storageConstant } from 'src/constants/storageConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { serviceConstant } from 'src/constants/serviceConstant'
import { regexPattern } from 'src/utils/patterns'
import styles from './BuyMoreModal.module.scss'

type CartItemType = {
  id: number
  price: number
  quantity: number
}

interface IProps {
  handleCloseModalService(): void
}

const serviceBasic = [serviceConstant.basic.code]
const serviceOther = [serviceConstant.hotJobAWeek.code, serviceConstant.urgentJobAWeek.code, serviceConstant.hotJob24h.code, serviceConstant.urgentJob24h.code]

const BuyMoreModal: FC<IProps> = ({ handleCloseModalService }) => {
  let win: any = {}
  const profile = useAppSelector(state => state.user.profile || {})


  const dispatch = useAppDispatch()
  const [service, setService] = useState<any>()
  const [cartService, setCartService] = useState([] as CartItemType[])
  const [isModalConfirm, setIsModalConfirm] = useState(false)

  const [modalPayment, setModalPayment] = useState(false)


  const [isPurchaseDiamondModal, setIsPurchaseDiamondModal] = useState(false)

  const handleConfirmPurchaseModal = () => {
    win = window.open(`${routerPathConstant.erPayment}?action=${encodeURIComponent("is open instruction modal")}`, '_blank')
    setIsPurchaseDiamondModal(false)
  }

  const showModalConfirm = () => {
    if (handleTotalCart() <= 0) {
      message.warning('Hãy chọn ít nhất 1 dịch vụ để thanh toán!')
    } else if (handleTotalCart() > profile.walletValue) {
      setIsPurchaseDiamondModal(true)
    }
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
    // if (profile.walletValue < handleTotalCart()) {
    //   return message.warning('Vui lòng nạp thêm kim cương để mua dịch vụ!')
    // }
    setIsModalConfirm(false)
    try {
      const newCartService = cartService.map(item => ({
        serviceId: item.id,
        quantity: item.quantity,
      }))
      const responseBuy = await postBuySerProApi({
        services: newCartService,
        promotions: [],
      })

      dispatch(getProfileRequest({ userCode: localStorage.getItem(storageConstant.localStorage.userCode) || "" }))

      setCartService([])
      message.success(responseBuy.data.message)
      handleCloseModalService()
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    async function fetchData() {
      const responseService = await getAllServiceApi({})
      setService(responseService.data)
    }
    fetchData()
    dispatch(getProfileRequest({ userCode: profile.code }))
  }, [])


  // console.log("document", document.hidden);

  if (typeof window !== 'undefined') {
    useEffect(() => {
      const timer = setInterval(() => {
        if (!document.hidden && win?.closed) {
          console.log("b", win?.closed);
          clearInterval(timer)
          dispatch(getProfileRequest({ userCode: profile.code }))
        }
      }, 500)
    }, [win, document.hidden])
  }

  return (
    <div className={`buyMoreModal ${styles.buy}`}>
      <div
        className={styles.buy_coin}
        onClick={() => {
          win = window.open(`${routerPathConstant.erPayment}?action=${encodeURIComponent("is open instruction modal")}`, '_blank')
        }}
      >
        <div>Nạp kim cương</div>
      </div>
      <div className={styles.buy_wrap}>
        <div className={styles.buy_service}>
          <div className={styles.buy_service_title}>Danh sách dịch vụ đăng tin cơ bản</div>
          {service?.data
            .filter(ser => serviceBasic.includes(ser.code))
            .map(item => (
              <div key={item.id} className={styles.buy_item}>
                <div className={styles.buy_item_title}>
                  <span>Dịch vụ: </span>
                  {item.name}
                </div>
                <div className={styles.buy_item_desc}>
                  <span>Mô tả: </span>
                  <div className="ml-4">
                    {item.desc
                      .split('-')
                      .splice(1)
                      .map((char, idx) => (
                        <div key={idx}>- {char}</div>
                      ))}
                  </div>
                </div>
                <div className={styles.buy_item_input}>
                  <div className={styles.buy_item_price}>
                    <div>Đơn giá:</div> <span>{item.basePrice} kim cương</span>
                  </div>
                  <div className={styles.buy_item_quantity}>
                    <span>Số lượng cần mua:</span>
                    <div
                      className={styles.buy_item_minus}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <span>-</span>
                    </div>
                    <div className={styles.buy_item_qty}>
                      <input
                      type="number"
                      min={0}
                        value={cartService.find(i => i.id === item.id)?.quantity || 0}
                        onChange={e => {
                          if(regexPattern.digit.test(e.target.value)) {
                            handleChangeToCart(item.id, item.basePrice, Number(e.target.value))
                          }
                        }}
                      />
                    </div>
                    <div
                      className={styles.buy_item_plus}
                      onClick={() => handleAddToCart(item.id, item.basePrice)}
                    >
                      <span>+</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className={styles.buy_service_title}>Danh sách dịch vụ khác</div>
          {service?.data
            .filter(ser => serviceOther.includes(ser.code))
            .map(item => (
              <div key={item.id} className={styles.buy_item}>
                <div className={styles.buy_item_title}>
                  <span>Dịch vụ: </span>
                  {item.name}
                </div>
                <div className={styles.buy_item_desc}>
                  <span>Mô tả: </span>
                  <div className="ml-4">
                    {item.desc
                      .split('-')
                      .splice(1)
                      .map((char, idx) => (
                        <div key={idx}>- {char}</div>
                      ))}
                  </div>
                </div>
                <div className={styles.buy_item_input}>
                  <div className={styles.buy_item_price}>
                    <div>Đơn giá:</div> <span>{item.basePrice} kim cương</span>
                  </div>
                  <div className={styles.buy_item_quantity}>
                    <span>Số lượng cần mua:</span>
                    <div
                      className={styles.buy_item_minus}
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      <span>-</span>
                    </div>
                    <div className={styles.buy_item_qty}>
                      <input
                        type="number"
                        min={0}
                        value={cartService.find(i => i.id === item.id)?.quantity || 0}
                        onChange={e => {
                          if(regexPattern.digit.test(e.target.value))
                          handleChangeToCart(item.id, item.basePrice, Number(e.target.value))
                        }}
                      />
                    </div>
                    <div
                      className={styles.buy_item_plus}
                      onClick={() => handleAddToCart(item.id, item.basePrice)}
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
      <Modal
        visible={isModalConfirm}
        footer={null}
        title="Xác nhận thanh toán"
        onCancel={() => setIsModalConfirm(false)}
      >
        <div className={styles.modal_buy}>
          <div className={styles.modal_buy_title}>Xác nhận thanh toán</div>
          <div className={`${styles.modal_buy_chance  } text-center`}>
            Bạn có chấp nhận thanh toán <span>{formatDiamond(handleTotalCart())} kim cương </span>
            không?
          </div>
          <div className={styles.modal_buy_btn} onClick={handlePayment}>
            Thanh toán
          </div>
        </div>
      </Modal>

      <Modal visible={modalPayment} footer={null} onCancel={() => setModalPayment(false)} width={1000}>
        <Payment handleCloseModalPayment={() => setModalPayment(false)} />
      </Modal>

      <ModalPopup
        visible={isPurchaseDiamondModal} title="Bạn không đủ kim cương" textConfirm="Nạp kim cương"
        handleCancelModal={() => setIsPurchaseDiamondModal(false)}
        handleConfirmModal={handleConfirmPurchaseModal}
      >
        <div>
          Không đủ kim cương trong ví. Vui lòng nạp thêm để mua dịch vụ!
        </div>
      </ModalPopup>
    </div>
  )
}

export default BuyMoreModal
