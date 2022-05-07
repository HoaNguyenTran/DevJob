import {
  Input,
  message
} from 'antd'
import { postBuySerProApi } from 'api/client/service'
import { format } from 'date-fns'
import React, { useState } from 'react'
import Slider from 'react-slick'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { serviceConstant } from 'src/constants/serviceConstant'
import {
  useAppDispatch,
  useAppSelector
} from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatDiamond } from 'src/utils/helper'
import { regexPattern } from 'src/utils/patterns'
import BuyMoreModal from '../BuyMoreModal/BuyMoreModal'
import styles from './BuyService.module.scss'



const settingsPromoJob = {
  dots: true,
  arrows: false,
  infinite: true,
  // autoplay: true,
  speed: 1000,
  // autoplaySpeed: 1000,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToScroll: 5,
  slidesToShow: 5,
  pauseOnHover: true,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
  ],
}

const serviceBasic = [serviceConstant.basic.code, serviceConstant.urgent.code]
// const serviceOther = [serviceConstant.hotJobAWeek.code, serviceConstant.urgentJobAWeek.code, serviceConstant.hotJob24h.code, serviceConstant.urgentJob24h.code]


const BuyService = ({ typePackageBuy, setTypePackageBuy, dataServiceDeatail, setDataServiceDetail }): JSX.Element => {
  const dispatch = useAppDispatch()

  const profile = useAppSelector(state => state.user.profile || {})
  const { FjobService: serviceList = [],
    FjobPromotionPackage: promotionList = [],
  } = useAppSelector(state => state.initData.data)


  const [quantityPackage, setQuantityPackage] = useState(1)

  const [isModalService, setIsModalService] = useState<boolean>(false)
  const [isConfirmPaymentModal, setIsConfirmPaymentModal] = useState<boolean>(false)

  // console.log(dataServiceDeatail);

  const handleCloseModalService = async () => {
    setIsModalService(false)
    dispatch(getProfileRequest({ userCode: profile.code }))
    // try {
    //   const resMySer = await getMyServiceApi()
    //   setMySerPro(resMySer.data.data)
    // } catch (error) {
    //   handleError(error)
    // }
  }


  const handleConfirmPayment = async data => {
    setIsConfirmPaymentModal(false)

    if (
      (dataServiceDeatail.promotionTypeCode === 'SALE_PRICE' && dataServiceDeatail.promotionParam1
        ? (100 - dataServiceDeatail.promotionParam1) / 100
        : 1) *
      dataServiceDeatail.basePrice *
      quantityPackage >
      profile.walletValue
    )
      return message.error('Bạn cần nạp thêm kim cương để mua dịch vụ!')

    try {
      let query = {
        services: [{}],
        promotions: [{}],
      }

      if (typePackageBuy === 1) query = {
        services: [{
          serviceId: data.id,
          quantity: quantityPackage,
        }],
        promotions: [],
      }

      else if (typePackageBuy === 2) query = {
        services: [],
        promotions: [{
          packageId: data.id,
          quantity: quantityPackage,
        }],
      }


      await postBuySerProApi(query)
      dispatch(getProfileRequest({ userCode: profile.code }))
      setDataServiceDetail({})
      setTypePackageBuy(0)

      message.success('Giao dịch thành công!')
    } catch (error) {
      message.error('Giao dịch thất bại!')
    } finally {
      setIsConfirmPaymentModal(false)
    }
    setQuantityPackage(1)
  }


  const renderMySerBasic = () => {
    const servicePostJob = serviceList.filter(item => serviceBasic.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: (profile.userServices || []).find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map(mySer => (
      <div key={mySer.id} className={styles.serpro_useSer_item}>
        <div className={styles.serpro_useSer_item_info}>
          <div className={styles.name}>
            {mySer.name}
          </div>
          <div className={styles.desc}>
            {mySer.desc}
          </div>
          <div className="d-flex">
            <div className={styles.serpro_useSer_item_number} style={{ color: mySer.quantity ? "var(--secondary-color)" : "#B5B5B5" }}>Bạn còn: {mySer.quantity} gói</div>
          </div>
        </div>
        <div className={styles.serpro_useSer_item_action}>
          <div className={styles.diamond}>
            <img src="/assets/icons/color/diamond.svg" alt="" /> {mySer.basePrice} KC
          </div>
          <div className={styles.btn}>
            <button type="button" onClick={() => {
              setDataServiceDetail(mySer)
              setTypePackageBuy(1)
            }}>Mua ngay</button>
          </div>
        </div>
      </div>
    ))
  }


  const renderMySerOther = () => {
    const servicePostJob = serviceList.filter(item => !serviceBasic.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: (profile.userServices || []).find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map(mySer => (
      <div key={mySer.id} className={styles.serpro_useSer_item}>
        <div className={styles.serpro_useSer_item_info}>
          <div className={styles.name}>
            {mySer.name}
          </div>
          <div className={styles.desc}>
            {mySer.desc}
          </div>
          <div className="d-flex">
            <div
              className={styles.serpro_useSer_item_number}
              style={{ color: mySer.quantity ? "var(--secondary-color)" : "#B5B5B5" }}>
              Bạn còn: {mySer.quantity} gói</div>
          </div>
        </div>
        <div className={styles.serpro_useSer_item_action}>
          <div className={styles.diamond}>
            <img src="/assets/icons/color/diamond.svg" alt="" /> {mySer.basePrice} KC
          </div>
          <div className={styles.btn}>
            <button type="button" onClick={() => {
              setDataServiceDetail(mySer)
              setTypePackageBuy(1)
            }}>Mua ngay</button>
          </div>
        </div>

      </div>
    ))
  }

  return (
    <div className={styles.serpro}>
      <div className={styles.serpro_inner}>
        <div className={styles.serpro_proJob}>
          <Slider {...settingsPromoJob}>
            {promotionList
              .map(item => (
                <div
                  key={item.id}
                  className={styles.serpro_proJob_item}
                  onClick={() => {
                    setDataServiceDetail(item)
                    setTypePackageBuy(2)
                  }}
                >
                  <img src={item.img} alt="" />
                </div>
              ))}
          </Slider>
        </div>

        {!!promotionList.length && (
          <div className={styles.serpro_promo}>
            <div className={styles.serpro_promo_title}>Gói khuyến mại</div>
            <div className={styles.serpro_promo_list}>
              {promotionList
                .map(item => (
                  <div key={item.id} className={styles.serpro_promo_item}>
                    <div className={styles.image}>
                      <img alt="" src={item.img} />
                    </div>
                    <div className={styles.main}>
                      <div className={styles.serpro_promo_item_info}>
                        <div className={styles.name}>{item.name}</div>
                        <div className={styles.desc}>{item.desc}</div>
                      </div>
                      <div className={styles.bottom}>
                        <div>
                          {item.toTime &&
                            <div className={styles.time}>
                              <span>Áp dụng đến hết ngày:</span>{' '}
                              {format(new Date(item.toTime * 1000), 'dd/MM/yyyy')}
                            </div>
                          }
                          <div className={styles.price}>
                            <div className={styles.serpro_promo_item_number}>
                              <img src="/assets/icons/color/icon_cart.svg" alt="" />
                              <span>{formatDiamond(item.basePrice)}</span>&nbsp;
                              <span>kim cương</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={styles.serpro_promo_item_buy}
                        >
                          <button type="button" onClick={() => {
                            setDataServiceDetail(item)
                            setTypePackageBuy(2)
                          }}>
                            Mua ngay
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className={styles.serpro_useSer}>
          <div className={styles.serpro_useSer_title}>
            Dịch vụ đăng tuyển
            {/* <button
              type="button"
              onClick={() => {
                setIsModalService(true)
                dispatch(getProfileRequest({ userCode: profile.code }))
              }}
            >
              <span>Mua thêm</span>
              <img alt="" src="/assets/icons/default/cart.svg" />
            </button> */}
          </div>
          <div className={styles.serpro_useSer_list}>{renderMySerBasic()}</div>
        </div>

        <div className={styles.serpro_useSer}>
          <div className={styles.serpro_useSer_title}>
            <span>Gói dịch vụ khác</span>
            {/* <button
              type="button"
              onClick={() => {
                setIsModalService(true)
                dispatch(getProfileRequest({ userCode: profile.code }))
              }}
            >
              <span>Mua thêm</span>
              <img alt="" src="/assets/icons/default/cart.svg" />
            </button> */}
          </div>
          <div className={styles.serpro_useSer_list}>{renderMySerOther()}</div>
        </div>

        {dataServiceDeatail.id && <div className={styles.serpro_cart}>
          <div className={styles.information}>
            <div className={styles.info}>
              <div className={styles.name}>
                {dataServiceDeatail.name}
              </div>
              <div className={styles.wallet}>
                Bạn còn: <span>{formatDiamond(profile.walletValue)}</span>&nbsp;KC trong ví
              </div>
            </div>
            <div className={styles.quantity}>
              <div
                className={styles.quantity_minus}
                onClick={() => {
                  if (quantityPackage > 1) setQuantityPackage(pre => pre - 1)
                }}
              >
                <span>-</span>
              </div>
              <div className={`${styles.quantity_qty} input_custom`}>
                <Input
                  suffix={undefined}
                  type="number"
                  min="0"
                  onChange={e => {if (regexPattern.digit.test(e.target.value)) setQuantityPackage(Number(e.target.value))} }
                  value={quantityPackage}
                />
              </div>
              <div
                className={styles.quantity_plus}
                onClick={() => setQuantityPackage(pre => pre + 1)}
              >
                <span>+</span>
              </div>
            </div>
            <div className={styles.total}>
              Tổng cộng:&nbsp;
              <span>
                {formatDiamond((dataServiceDeatail.promotionTypeCode === 'SALE_PRICE' &&
                  dataServiceDeatail.promotionParam1
                  ? (100 - dataServiceDeatail.promotionParam1) / 100
                  : 1) *
                  dataServiceDeatail.basePrice *
                  quantityPackage)}
              </span>&nbsp;<img src="/assets/icons/color/diamond.svg" alt="" />

            </div>
            <div className={styles.action}>
              <button type="button" className={styles.action_payment} onClick={() => {
                if (quantityPackage < 0) {
                  setQuantityPackage(-quantityPackage)
                }
                setIsConfirmPaymentModal(true)
              }}>Thanh toán</button>
              <button type="button" className={styles.action_cancel} onClick={() => {
                setDataServiceDetail({})
                setTypePackageBuy(0)
              }}>Hủy</button>
            </div>
          </div>
          <div className={styles.description}>
            <div>
              <div className={styles.title}>Mô tả:</div>
              <div className={styles.value}>{dataServiceDeatail.desc}</div>
            </div>
            {dataServiceDeatail.toTime && <div className={styles.time}>
              <span>Áp dụng đến hết ngày:&nbsp;</span>
              {format(new Date(dataServiceDeatail.toTime * 1000), 'dd/MM/yyyy')}
            </div>}
          </div>
        </div>}

      </div>


      {isModalService && <ModalPopup
        visible={isModalService}
        handleCancelModal={() => setIsModalService(false)}
        title="Mua thêm dịch vụ"
        width={1000}
        isConfirmBtn={false}
        isCancelBtn={false}
        closeBtn
      >
        <BuyMoreModal handleCloseModalService={handleCloseModalService} />
      </ModalPopup>}


      <ModalPopup
        visible={isConfirmPaymentModal}
        title="Xác nhận thanh toán"
        handleCancelModal={() => setIsConfirmPaymentModal(false)}
        handleConfirmModal={() => {
          setIsConfirmPaymentModal(false)
          handleConfirmPayment(dataServiceDeatail)
        }}
        transition="move-up"
      >
        <div className={styles.modal_buy}>
          <div className={`${styles.modal_buy_chance  } text-center`}>
            Bạn có chấp nhận thanh toán&nbsp;
            <span>
              {(dataServiceDeatail.promotionTypeCode === 'SALE_PRICE' &&
                dataServiceDeatail.promotionParam1
                ? (100 - dataServiceDeatail.promotionParam1) / 100
                : 1) *
                dataServiceDeatail.basePrice *
                quantityPackage}
              &nbsp;kim cương&nbsp;
            </span>
            cho gói <span> {dataServiceDeatail.name}</span>&nbsp;
            không?
          </div>
        </div>
      </ModalPopup>
    </div>
  )
}

export default BuyService
