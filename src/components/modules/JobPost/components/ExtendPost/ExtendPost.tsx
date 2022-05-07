import React, { FC, useEffect, useState } from 'react'

import { Button, message, Modal, Spin } from 'antd'
import { getMyServiceApi, getAllPromotionApi, postBuySerProApi, postUseServiceApi } from 'api/client/service'
import Slider from 'react-slick'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatNumber, formatDiamond, handleError } from 'src/utils/helper'
import { CaretRightOutlined } from '@ant-design/icons'
import BuyMoreModal from 'src/components/modules/CreateJob/BuyMoreModal/BuyMoreModal'
import { serviceConstant } from 'src/constants/serviceConstant'

import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { regexPattern } from 'src/utils/patterns'
import styles from './ExtendPost.module.scss'

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

type CartItemType = {
  id: number
  serviceId: number
  quantity: number
}

interface Props {
  triggerFetchData: () => void
  jobId: number
  changeStatusModal: (status: boolean) => void
}

const serviceBasic = [serviceConstant.basic.code]
const serviceOther = [serviceConstant.hotJobAWeek.code, serviceConstant.urgentJobAWeek.code, serviceConstant.hotJob24h.code, serviceConstant.urgentJob24h.code]

const ExtentPost: FC<Props> = ({ jobId, triggerFetchData, changeStatusModal }) => {
  const profile = useAppSelector(state => state.user.profile || {})
  const [promotion, setPromotion] = useState<ServiceGlobal.Promotion[]>([])
  const [mySerPro, setMySerPro] = useState<ServiceGlobal.ServiceTypeMyService[]>([])
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false)
  const [dataModalAction, setDataModalAction] = useState<any>({})
  const [quantityPackage, setQuantityPackage] = useState(1)
  const [isModalConfirm, setIsModalConfirm] = useState<boolean>(false)
  const [isModalService, setIsModalService] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [cartService, setCartService] = useState<JobGlobal.JobUseService[]>([])
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [loadingExtent, setLoadingExtent] = useState<boolean>(false)



  const handleCloseModalService = async () => {
    setIsModalService(false)
    try {
      const resMySer = await getMyServiceApi()
      setMySerPro(resMySer.data.data)
    } catch (error) {
      handleError(error)
    }
  }

  const handleOpenModalDetail = data => {
    setIsModalDetail(true)
    setDataModalAction(data)
  }

  const handleCloseModalDetail = () => {
    setIsModalDetail(false)
    setQuantityPackage(1)
  }

  const handleOpenModalConfirm = data => {
    setIsModalDetail(false)
    setIsModalConfirm(true)
    setDataModalAction(data)
  }

  const handleClickBuyMore = () => {
    const userCode = localStorage.getItem(storageConstant.localStorage.userCode)
    if (userCode) {
      dispatch(getProfileRequest({ userCode }))
    }
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

  const handleConfirmPayment = async data => {
    setIsModalDetail(false)
    setIsModalConfirm(false)

    if (
      (dataModalAction.promotionTypeCode === 'SALE_PRICE' && dataModalAction.promotionParam1
        ? (100 - dataModalAction.promotionParam1) / 100
        : 1) *
      dataModalAction.basePrice *
      quantityPackage >
      profile.walletValue
    )
      return message.error('Bạn cần nạp thêm kim cương để mua dịch vụ!')
    try {
      await postBuySerProApi({
        services: [],
        promotions: [
          {
            packageId: data.id,
            quantity: quantityPackage,
          },
        ],
      })
      const resMySer = await getMyServiceApi()
      setMySerPro(resMySer.data.data)
      dispatch(
        getProfileRequest({
          userCode: localStorage.getItem(storageConstant.localStorage.userCode) as string,
        }),
      )
      message.success('Mua khuyến mại thành công!')
    } catch (error) {
      message.error('Mua khuyến mại thất bại!')
    } finally {
      setIsModalDetail(false)
      setIsModalConfirm(false)
      setLoadingBtn(false)
    }
    setQuantityPackage(1)
  }

  const handleExtent = async () => {
    if (!cartService.length) {
      return message.error('Bạn chưa chọn dịch vụ nào cả')
    }

    const existBaseService = cartService.find(item => item.serviceId === 1)

    if (!existBaseService) {
      return message.error('Bạn chưa sử dụng gói đăng tin')
    }

    setLoadingExtent(true)

    const useServices = cartService.map(item => ({
      quantity: item.quantity,
      serviceId: item.serviceId,
    }))

    const data = {
      useServices,
      jobId,
    }

    try {
      await postUseServiceApi(data)
      dispatch(getProfileRequest({ userCode: profile.code }))
      setLoadingExtent(false)
      triggerFetchData()
      changeStatusModal(false)
      message.success('Gia hạn thành công')
    } catch (error) {
      handleError(error)
      setLoadingExtent(false)
    }
  }

  const handleAddToCart = ({ id, serviceId, name, code }) => {
    const resultSetState = prev => {
      const isItemInCart = prev.find(item => item.id === id)
      if (isItemInCart) {
        return prev.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { id, serviceId, quantity: 1, name, code }]
    }
    setCartService(resultSetState)
  }

  const handleChangeToCart = ({ id, serviceId, quantity, name, code }) => {
    const resultSetState = prev => {
      const isItemInCart = prev.find(item => item.id === id)
      if (isItemInCart) {
        return prev.map(item => (item.id === id ? { ...item, quantity } : item))
      }
      return [...prev, { id, serviceId, quantity, name, code }]
    }
    setCartService(resultSetState)
  }

  const renderMySerBasic = () => {
    const arrMySer = mySerPro.filter(item => serviceBasic.includes(item.serviceCode))
    if (arrMySer.length < 1)
      return (
        <div className={styles.serpro_useSer_text}>
          Bạn không có dịch vụ đăng tuyển nào, vui lòng mua thêm để tiếp tục đăng tuyển!
        </div>
      )

    return arrMySer.map(mySer => {
      const qty = cartService.find(i => i.id === mySer.id)?.quantity || 0
      return (
        <div key={mySer.id} className={styles.serpro_useSer_item}>
          <div className={styles.serpro_useSer_item_info}>
            <div>
              <span>Dịch vụ:</span> {mySer.serviceName}
            </div>
            <div>
              <span>Mô tả:</span>
              <div className="ml-4">
                {mySer.serviceDesc}
                {/* {mySer.serviceDesc
                  .slice(1)
                  .split('- ')
                  .map((char, idx) => (
                    <div key={idx}>- {char}</div>
                  ))} */}
              </div>
            </div>
            <div className="d-flex">
              <span>Bạn đang có:</span>
              <div className={styles.serpro_useSer_item_number}>
                {formatNumber(mySer.quantity)} gói
              </div>
            </div>
          </div>

          <div className={styles.serpro_useSer_item_quantity}>
            <span>Số lượng sử dụng:</span>
            <div className={styles.serpro_useSer_item_input}>
              <div
                className={styles.serpro_useSer_item_minus}
                onClick={() => handleRemoveFromCart(mySer.id)}
              >
                <span>-</span>
              </div>

              <div className={styles.serpro_useSer_item_qty}>
                <input
                  type="number"
                  min={0}
                  value={qty}
                  onChange={e => {
                    if (Number(e.target.value) <= mySer.quantity && regexPattern.digit.test(e.target.value))
                      handleChangeToCart({
                        id: mySer.id,
                        serviceId: mySer.serviceId,
                        quantity: Number(e.target.value),
                        name: mySer.serviceName,
                        code: mySer.serviceCode,
                      })
                  }}
                />
              </div>
              <div
                className={styles.serpro_useSer_item_plus}
                onClick={() => {
                  if (qty < mySer.quantity)
                    handleAddToCart({
                      id: mySer.id,
                      serviceId: mySer.serviceId,
                      name: mySer.serviceName,
                      code: mySer.serviceCode,
                    })
                }}
              >
                <span>+</span>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const renderMySerOther = () => {
    const arrMySer = mySerPro.filter(item => serviceOther.includes(item.serviceCode))

    if (arrMySer.length < 1)
      return (
        <div className={styles.serpro_useSer_text}>
          Bạn không có dịch vụ bổ sung nào, vui lòng mua thêm!
        </div>
      )

    return arrMySer.map(mySer => {
      const qty = cartService.find(i => i.id === mySer.id)?.quantity || 0
      return (
        <div key={mySer.id} className={styles.serpro_useSer_item}>
          <div className={styles.serpro_useSer_item_info}>
            <div>
              <span>Dịch vụ:</span> {mySer.serviceName}
            </div>
            <div>
              <span>Mô tả:</span>
              <div className="ml-4">
                {mySer.serviceDesc}
                {/* {mySer.serviceDesc
                  .slice(1)
                  .split('- ')
                  .map((char, idx) => (
                    <div key={idx}>- {char}</div>
                  ))} */}
              </div>
            </div>
            <div className="d-flex">
              <span>Bạn đang có:</span>
              <div className={styles.serpro_useSer_item_number}>{mySer.quantity} gói</div>
            </div>
          </div>
          <div className={styles.serpro_useSer_item_quantity}>
            <span>Số lượng sử dụng:</span>
            <div className={styles.serpro_useSer_item_input}>
              <div
                className={styles.serpro_useSer_item_minus}
                onClick={() => handleRemoveFromCart(mySer.id)}
              >
                <span>-</span>
              </div>

              <div className={styles.serpro_useSer_item_qty}>
                <input
                  type="number"
                  min={0}
                  value={qty}
                  onChange={e => {
                    if (Number(e.target.value) <= mySer.quantity && regexPattern.digit.test(e.target.value))
                      handleChangeToCart({
                        id: mySer.id,
                        serviceId: mySer.serviceId,
                        quantity: Number(e.target.value),
                        name: mySer.serviceName,
                        code: mySer.serviceCode,
                      })
                  }}
                />
              </div>

              <div
                className={styles.serpro_useSer_item_plus}
                onClick={() => {
                  if (qty < mySer.quantity)
                    handleAddToCart({
                      id: mySer.id,
                      serviceId: mySer.serviceId,
                      name: mySer.serviceName,
                      code: mySer.serviceCode,
                    })
                }}
              >
                <span>+</span>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  useEffect(() => {
    async function fetchData() {
      const resData = await Promise.allSettled([getAllPromotionApi({}), getMyServiceApi()])
      if (resData[0].status === "fulfilled") setPromotion(resData[0].value.data.data)
      if (resData[1].status === "fulfilled") setMySerPro(resData[1].value.data.data)
    }
    fetchData()
  }, [])

  return (
    <div>
      <div>
        <Slider {...settingsPromoJob}>
          {promotion.map(item => (
            <div
              key={item.id}
              className={styles.serpro_proJob_item}
              onClick={() => handleOpenModalDetail(item)}
            >
              <img src={item.img} alt="" />
            </div>
          ))}
        </Slider>
      </div>
      {!!promotion.length && <div style={{ marginTop: '60px' }} className={styles.serpro_promo}>
        <div className={styles.serpro_promo_title}>Gói khuyến mại</div>
        <div className={styles.serpro_promo_list}>
          {promotion
            // .filter(
            //   promo => promo.buyLimit > promo.sold && promo.toTime * 1000 > getTime(new Date()),
            // )
            .map(item => (
              <div key={item.id} className={styles.serpro_promo_item}>
                <div className={styles.serpro_promo_item_info}>
                  <div>
                    <span>Khuyến mại:</span> {item.name}
                  </div>
                  <div>
                    <span>Mô tả:</span>
                    <div>
                      {item.desc}
                      {/* {item.desc.split(', ').map((char, idx) => (
                        <div key={idx}>- {char}</div>
                      ))} */}
                    </div>
                  </div>
                  <div>
                    <span>Áp dụng đến hết ngày:</span>{' '}
                    {/* {format(new Date(item.toTime * 1000), 'dd/MM/yyyy')} */}
                  </div>
                </div>
                <div className={styles.serpro_promo_item_price}>
                  <div className="d-flex">
                    <span>Giá tiền:</span>{' '}
                    <div className={styles.serpro_promo_item_number}>
                      <span>{formatDiamond(item.basePrice)}</span>
                      <img src="/assets/icons/color/diamond.svg" alt="" />
                    </div>
                  </div>
                  <div
                    className={styles.serpro_promo_item_buy}
                    onClick={() => handleOpenModalDetail(item)}
                  >
                    Mua ngay
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      }
      <div className={styles.serpro_useSer}>
        <div className={styles.serpro_useSer_title}>
          <span>Dịch vụ đăng tuyển</span>
          <button
            type="button"
            onClick={() => {
              setIsModalService(true)
              handleClickBuyMore()
            }}
          >
            <span>Mua thêm</span>
            <img alt="" src="/assets/icons/default/cart.svg" />
          </button>
        </div>
        <div className={styles.serpro_useSer_list}>{renderMySerBasic()}</div>
      </div>
      <div className={styles.serpro_useSer}>
        <div className={styles.serpro_useSer_title}>
          <span>Gói dịch vụ khác</span>
          <button
            type="button"
            onClick={() => {
              setIsModalService(true)
              handleClickBuyMore()
            }}
          >
            <span>Mua thêm</span>
            <img alt="" src="/assets/icons/default/cart.svg" />
          </button>
        </div>
        <div className={styles.serpro_useSer_list}>{renderMySerOther()}</div>
      </div>

      {!!cartService.length && (
        <div className={styles.serpro_useService_title}>Dịch vụ đã chọn</div>
      )}
      <div className={styles.serpro_useService_list}>
        {cartService.map(item => (
          <div key={item.id} className={styles.serpro_useService_item}>
            <div>
              <span>Tên dịch vụ: </span>
              {item.name}
            </div>
            <div>
              <span>Số lượng: </span>
              {item.quantity} gói
            </div>
          </div>
        ))}
      </div>
      <div className="hiring_continue d-flex justify-content-between m-4 mt-5">
        <Button
          style={{
            backgroundColor: 'rgba(204, 204, 204,0.5)',
            border: 'none',
            color: '#000',
          }}
          disabled={loadingExtent}
          onClick={() => changeStatusModal(false)}
          type="primary"
        >
          Hủy
        </Button>
        <Button disabled={loadingExtent} onClick={handleExtent} type="primary">
          {loadingExtent ? <Spin /> : 'Gia hạn'}
          <CaretRightOutlined />
        </Button>
      </div>
      <Modal
        wrapClassName="modal-global"
        visible={isModalDetail}
        onCancel={handleCloseModalDetail}
        footer={
          quantityPackage > 0
            ? [
              <div key="submit" className={styles.modal_buyDetail_footer}>
                <div className={styles.modal_buyDetail_footer_left}>
                  <div>
                    Tổng cộng:&nbsp;
                    <span>
                      {formatDiamond((dataModalAction.promotionTypeCode === 'SALE_PRICE' &&
                        dataModalAction.promotionParam1
                        ? (100 - dataModalAction.promotionParam1) / 100
                        : 1) *
                        dataModalAction.basePrice *
                        quantityPackage)}
                    </span>
                    &nbsp; <img src="/assets/icons/color/diamond.svg" alt="" />
                  </div>
                  <div className="">
                    Bạn còn: <span>{formatDiamond(profile.walletValue)}</span>&nbsp;
                    <img src="/assets/icons/color/diamond.svg" alt="" /> trong ví
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.modal_btn_submit}
                  onClick={() => {
                    handleOpenModalConfirm(dataModalAction)
                  }}
                >
                  <div>Mua gói</div>
                </button>
              </div>,
            ]
            : null
        }
      >
        <div className="modal-title mb-2">Mua dịch vụ</div>
        <div className={styles.modal_buyDetail}>
          <div className={styles.modal_buyDetail_name}>
            <span>Tên gói:</span> {dataModalAction.name}
          </div>
          <div className={styles.modal_buyDetail_package}>
            <span>Mô tả:</span>
            <div>
              {dataModalAction.desc}
              {/* {dataModalAction.desc.split(', ').map((char, idx) => (
                  <div key={idx}>- {char}</div>
                ))} */}
            </div>
          </div>
          <div className={styles.modal_buyDetail_package}>
            <span>Áp dụng đến hết ngày:</span>
            {/* {format(new Date(dataModalAction.toTime * 1000), 'dd/MM/yyyy')} */}
          </div>

          <div className={styles.modal_buyDetail_price}>
            <span>Giá tiền:</span>
            <div className={styles.modal_buyDetail_number}>
              {formatDiamond(dataModalAction.basePrice)}{' '}
              <img src="/assets/icons/color/diamond.svg" alt="" />
            </div>
          </div>
          <div className={styles.modal_buyDetail_quantity}>
            <span>Số lượng cần mua:</span>
            <div
              className={styles.modal_buyDetail_minus}
              onClick={() => {
                if (quantityPackage > 1) setQuantityPackage(pre => pre - 1)
              }}
            >
              <span>-</span>
            </div>
            <div className={styles.modal_buyDetail_qty}>
              <input
                type="number"
                min={0}
                onChange={e => { if (regexPattern.digit.test(e.target.value)) setQuantityPackage(Number(e.target.value))}}
                value={quantityPackage}
              />
            </div>
            <div
              className={styles.modal_buyDetail_plus}
              onClick={() => setQuantityPackage(pre => pre + 1)}
            >
              <span>+</span>
            </div>
          </div>
        </div>
      </Modal>
      
      <ModalPopup
        title='Xác nhận thanh toán'
        visible={isModalConfirm}
        isCancelBtn={false}
        isConfirmBtn={false}
        handleCancelModal={() => {
          setIsModalConfirm(false)
          setQuantityPackage(1)
        }}
      >
        <div className={styles.modal_buy}>
          <div className={`${styles.modal_buy_chance  } text-center`}>
            Bạn có chấp nhận thanh toán
            <span>
              {(dataModalAction.promotionTypeCode === 'SALE_PRICE' &&
                dataModalAction.promotionParam1
                ? (100 - dataModalAction.promotionParam1) / 100
                : 1) *
                dataModalAction.basePrice *
                quantityPackage}
              &nbsp; <img src='/assets/icons/color/diamond.svg' alt='kim cương' />
            </span>
            {/* {dataModalAction.promotionTypeCode === "SALE_PRICE" && `(Giá cũ là: ${dataModalAction.basePrice} kim cương)`} */}
            không?
          </div>
          <div className={styles.modal_buy_btn}>
            <Button
              disabled={loadingBtn}
              onClick={() => {
                setLoadingBtn(true)
                setIsModalDetail(false)
                setIsModalConfirm(false)
                handleConfirmPayment(dataModalAction)
              }}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </ModalPopup>
      <Modal
        wrapClassName="modal-global"
        visible={isModalService}
        title="Mua thêm dịch vụ"
        width={1000}
        footer={null}
        onCancel={() => {
          setIsModalService(false)
        }}
      >
        <BuyMoreModal handleCloseModalService={handleCloseModalService} />
      </Modal>
    </div>
  )
}

export default ExtentPost
