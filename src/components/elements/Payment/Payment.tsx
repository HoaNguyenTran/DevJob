import React, {
  useEffect,
  useState,
} from 'react'

import { message } from 'antd'
import {
  getPackageDiamondApi,
  postPaymentOnePayApi,
} from 'api/client/payment'
import { useRouter } from 'next/router'
import { routerPathConstant } from 'src/constants/routerConstant'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/redux'
import { resetNotificationRequest } from 'src/redux/noti'
import { getProfileRequest } from 'src/redux/user'
import {
  formatDiamond,
  handleError,
} from 'src/utils/helper'

import { ArrowRightOutlined } from '@ant-design/icons'

import ModalPopup from '../ModalPopup/ModalPopup'
import ContactForm from './contact'
import styles from './Payment.module.scss'

interface IProps {
  handleCloseModalPayment?: (bool: boolean) => void
}

const Payment = ({ handleCloseModalPayment }: IProps): JSX.Element => {

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { notification } = useAppSelector(state => state)

  const profile = useAppSelector(state => state.user.profile || {})

  const [packageDiamond, setPackageDiamond] = useState<DiamondGlobal.DiamondPackageResponse[]>([])
  const [promo, setPromo] = useState<DiamondGlobal.DiamondPackageResponse>({} as DiamondGlobal.DiamondPackageResponse)

  const [isComfirmBuyModal, setIsComfirmBuyModal] = useState(false)

  const [isCongratsModal, setIsCongratsModal] = useState(false)

  const onConfirmPayment = async storeItemId => {
    setIsComfirmBuyModal(false)
    if (handleCloseModalPayment) handleCloseModalPayment(false)

    try {
      const linkOnePay = await postPaymentOnePayApi({
        storeItemId: `${storeItemId}`,
        userId: profile.id,
        againLink: `${window.location.origin}${routerPathConstant.erResponsePayment}`,
        phoneNumber: profile.phoneNumber,
        email: profile.email,
      })

      if (linkOnePay.data) {
        window.open(linkOnePay.data, '_blank')
      }
    } catch (error) {
      handleError(error)
    }

  }


  useEffect(() => {
    dispatch(getProfileRequest({ userCode: profile.code }))

    const fetchData = async () => {
      const res = await getPackageDiamondApi()
      setPackageDiamond(res.data)
    }
    fetchData()



    if (notification.data) {
      if (notification.type === "success")
        setIsCongratsModal(true)
      else message.error("Mua kim cương thất bại!")
      // message[notification.type](notification.data)
      dispatch(resetNotificationRequest())
    }
  }, [])


  // if (typeof window !== 'undefined') {
  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       if (!document.hidden && win?.closed) {
  //         clearInterval(timer)
  //         dispatch(getProfileRequest({ userCode: profile.code }))
  //         message.success('Giao dịch thành công!')
  //         setTimeout(() => {
  //           if (router.query.action) window.close()
  //         }, 2000);
  //       }
  //     }, 500)
  //     // document.addEventListener(
  //     //   'visibilitychange',
  //     //   function () {
  //     //     if (document.hidden) {
  //     //       console.log('bye')
  //     //     } else {
  //     //       console.log('well back')
  //     //     }
  //     //   },
  //     //   false,
  //     // )
  //   }, [win, document.hidden])
  // }

  const renderNameScreen = () => {
    switch (router.query.next) {
      case routerPathConstant.erSearchEmployee:
        return "tìm kiếm ứng viên"
      case routerPathConstant.erService:
        return "dịch vụ"

      default:
        break;
    }
  }

  return (
    <div className={styles.payment}>

      <div className={styles.payment_header}>
        <div className={styles.payment_info}>
          <div className={styles.payment_info_left}>
            <div>
              <div>Tên người dùng:</div>
              <div className={styles.payment_info_name}>{profile.name}</div>
            </div>
            <div>
              <div>Hạng:</div>
              <div className={styles.payment_info_rank}>THƯỜNG</div>
            </div>
          </div>
          <div className={styles.payment_info_right}>
            <div>Tài khoản của bạn còn:</div>
            <div className={styles.wallet}>
              <div>
                {formatDiamond(profile.walletValue)}
                <img alt="" src="/assets/icons/color/diamond.svg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.payment_wrap}>
        <div className={styles.payment_title}>Cửa hàng kim cương</div>


        <div className={styles.payment_package}>
          {!!packageDiamond.filter(item => item.itemType === 2).length && <div className={styles.payment_package_title}>Gói khuyến mại</div>}
          <div className={styles.payment_package_main}>
            {packageDiamond
              .filter(item => item.itemType === 2)
              .map(item => (
                <div
                  key={item.id}
                  className={styles.payment_package_item}
                >
                  <img alt="" src="/assets/images/banners/banner_promo_1.svg" />
                  <div className={styles.payment_package_information}>
                    <div className={styles.payment_package_information_info}>
                      <div className={styles.payment_package_information_name}>{item.name}</div>
                      <div className={styles.payment_package_information_amount}>
                        <div className={styles.payment_package_information_total}>
                          <div className={styles.payment_package_information_number}>
                            {formatDiamond(item.walletValue)}
                          </div>
                          <span>&nbsp;kim cương</span>
                        </div>
                        <div className={styles.payment_package_information_extra}>
                          {item?.extraRewards.map(extra => (
                            <div key={extra.id}>+ {extra.rewardCount} tặng thêm</div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className={styles.payment_package_buy}>
                      <div className={styles.payment_package_cost}>{formatDiamond(item.cost)} đ</div>
                      <button type='button' onClick={() => {
                        setPromo(item)
                        setIsComfirmBuyModal(true)
                      }}>Mua ngay</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className={styles.payment_package}>
          {!!packageDiamond.filter(item => item.itemType === 1).length && <div className={styles.payment_package_title}>Gói thường</div>}
          <div className={styles.payment_package_main}>
            {packageDiamond
              .filter(item => item.itemType === 1)
              .map(item => (
                <div
                  key={item.id}
                  className={styles.payment_package_item}
                >
                  <img alt="" src="/assets/images/banners/banner_promo_2.png" />
                  <div className={styles.payment_package_information}>
                    <div className={styles.payment_package_information_info}>
                      <div className={styles.payment_package_information_name}>{item.name}</div>
                      <div className={styles.payment_package_information_amount}>
                        <div className={styles.payment_package_information_total}>
                          <div className={styles.payment_package_information_number}>
                            {formatDiamond(item.walletValue)}
                          </div>
                          <span>&nbsp;kim cương</span>
                        </div>
                        <div className={styles.payment_package_information_extra}>
                          {item?.extraRewards.map(extra => (
                            <div key={extra.id}>+ {extra.rewardCount} tặng thêm</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className={styles.payment_package_buy}>
                      <div className={styles.payment_package_cost}>{formatDiamond(item.cost)} đ</div>
                      <button type='button' onClick={() => {
                        setPromo(item)
                        setIsComfirmBuyModal(true)
                      }}>Mua ngay</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>


        {router.query.next && <div>
          <button onClick={() => router.push(router.query.next as string)} type="button" className={styles.btn_next} >
            Trở lại màn hình&nbsp;
            {renderNameScreen()}&nbsp;
            <ArrowRightOutlined />
          </button>
        </div>}
      </div>

      <div className={styles.payment_wrap}>
        <ContactForm />
      </div>

      <ModalPopup
        visible={isComfirmBuyModal}
        title="Xác nhận thanh toán"
        handleCancelModal={() => setIsComfirmBuyModal(false)}
        handleConfirmModal={() => onConfirmPayment(promo.id)}
        transition="move-up"
      >
        <div className={styles.modal_payment}>
          <div className={styles.model_item}>
            <div>Tên gói: </div>
            <div className="font-weight-bold">{promo.name}</div>
          </div>
          <div className={styles.model_item}>
            <span>Số lượng:</span>
            <span className="d-flex">
              <span className="text-primary font-weight-bold">
                &nbsp;{formatDiamond(promo.walletValue || 0)}
              </span>
              &nbsp; <img src="/assets/icons/color/diamond.svg" alt='KC' />
              {promo?.extraRewards?.map(extra => (
                <span key={extra.id}>(+ {extra.rewardCount} <img src="/assets/icons/color/diamond.svg" alt='KC' />)</span>
              ))}
            </span>
          </div>
          <div className={styles.model_item}>
            <span>Giá tiền: </span>
            <span className="text-primary font-weight-bold">{formatDiamond(promo.cost || 0)} </span>{' '}
            đ
          </div>
          <div className={styles.model_item}>
            <span>Hình thức thanh toán: </span>
            <img alt="" src="/assets/images/payment/onepay-logo.png" />
          </div>
        </div>
      </ModalPopup>

      <ModalPopup
        visible={isCongratsModal}
        title="Chúc mừng"
        handleCancelModal={() => setIsCongratsModal(false)}
        handleConfirmModal={() => setIsCongratsModal(false)}
        isCancelBtn={false}
        positionAction="center"
      >
        <div className={styles.modal_congrats}>
          <img alt="" src="/assets/images/payment/congrats.png" />
          <div>Bạn đã thanh toán dịch vụ thành công</div>
          <div>Kim cương sẽ được cộng vào mục Kim cương của tôi</div>
        </div>
      </ModalPopup>
    </div>
  )
}

export default Payment

Payment.defaultProps = {
  handleCloseModalPayment: null
}
