import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Button, message, Modal } from 'antd'
import { getMyServiceApi, getAllPromotionApi, postBuySerProApi } from 'api/client/service'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'
import jobConstant from 'src/constants/jobConstant'
import { statusPostConstants } from 'src/constants/statusConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { serviceConstant } from 'src/constants/serviceConstant'
import { formatDiamond, handleError } from 'src/utils/helper'
import { configConstant } from 'src/constants/configConstant'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { regexPattern } from 'src/utils/patterns'
import BuyMoreModal from '../BuyMoreModal/BuyMoreModal'
import styles from './ServicePromo.module.scss'


interface IProps {
  handleChangeStep(data): void
  cartService: any
  handleChangeToCart(data): void
  handleAddToCart(data): void
  handleRemoveFromCart(id): void
}

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

const serviceBasic = [serviceConstant.basic.code]
const serviceOther = [serviceConstant.hotJobAWeek.code, serviceConstant.urgentJobAWeek.code, serviceConstant.hotJob24h.code, serviceConstant.urgentJob24h.code]


const ServicePromo: FC<IProps> = ({
  handleChangeStep,
  cartService = [],
  handleChangeToCart,
  handleAddToCart,
  handleRemoveFromCart,
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch()

  const profile = useAppSelector(state => state.user.profile || {})
  const { FjobService: serviceList = [] } = useAppSelector(state => state.initData.data)


  const [promotion, setPromotion] = useState<ServiceGlobal.Promotion[]>([])
  const [mySerPro, setMySerPro] = useState<ServiceGlobal.ServiceTypeMyService[]>([])

  const [quantityPackage, setQuantityPackage] = useState(1)
  const [dataModalAction, setDataModalAction] = useState<any>({})

  const cartServiceRef = useRef(cartService);
  const [loadingBtn, setLoadingBtn] = useState(false)

  const [isModalDetail, setIsModalDetail] = useState<boolean>(false)
  const [isModalService, setIsModalService] = useState<boolean>(false)
  const [isModalConfirm, setIsModalConfirm] = useState<boolean>(false)



  const handleCloseModalService = async () => {
    setIsModalService(false)
    try {
      const resMySer = await getMyServiceApi()

      setMySerPro(resMySer.data.data)
    } catch (error) {
      handleError(error)
    }
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
      dispatch(getProfileRequest({ userCode: profile.code }),)
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


  const renderMySerBasic = () => {
    const servicePostJob = serviceList.filter(item => serviceBasic.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: mySerPro.find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map(mySer => {
      const qty = cartService.find(i => i.id === mySer.id)?.quantity || 0
      return (
        <div key={mySer.id} className={styles.serpro_useSer_item}>
          <div className={styles.serpro_useSer_item_info}>
            <div className='font-weight-bold'>
              {mySer.name}
            </div>
            <div>
              <div className="ml-4">
                {mySer.desc}
              </div>
            </div>
            <div className="d-flex mt-2">
              <span>Bạn đang có:</span>
              <div className={styles.serpro_useSer_item_number}>{mySer.quantity} gói</div>
            </div>
          </div>
          {
            mySer.quantity ?
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
                    if (e.target.value <= mySer.quantity && regexPattern.digit.test(e.target.value))
                      handleChangeToCart({
                        id: mySer.id,
                        serviceId: mySer.id,
                        quantity: Number(e.target.value),
                        name: mySer.name,
                        code: mySer.code,
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
                          serviceId: mySer.id,
                          name: mySer.name,
                          code: mySer.code,
                        })
                    }}
                  >
                    <span>+</span>
                  </div>
                </div>
              </div> : "Gói dịch vụ của bạn đã hết. Hãy mua thêm gói dịch vụ để sử dụng!"
          }

        </div>
      )
    })
  }


  const renderMySerOther = () => {
    const servicePostJob = serviceList.filter(item => serviceOther.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: mySerPro.find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map(mySer => {
      const qty = cartService.find(i => i.id === mySer.id)?.quantity || 0
      return (
        <div key={mySer.id} className={styles.serpro_useSer_item}>
          <div className={styles.serpro_useSer_item_info}>
            <div className='font-weight-bold'>
              {mySer.name}
            </div>
            <div>
              <div className="ml-4">
                {mySer.desc}
              </div>
            </div>
            <div className="d-flex mt-2">
              <span>Bạn đang có:</span>
              <div className={styles.serpro_useSer_item_number}>{mySer.quantity} gói</div>
            </div>
          </div>
          {
            mySer.quantity ? <div className={styles.serpro_useSer_item_quantity}>
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
                      if (e.target.value <= mySer.quantity && regexPattern.digit.test(e.target.value))
                        handleChangeToCart({
                          id: mySer.id,
                          serviceId: mySer.id,
                          quantity: Number(e.target.value),
                          name: mySer.name,
                          code: mySer.code,
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
                        serviceId: mySer.id,
                        name: mySer.name,
                        code: mySer.code,
                      })
                  }}
                >
                  <span>+</span>
                </div>
              </div>
            </div> : <div className='d-flex align-items-center' style={{ fontStyle: "italic" }}>Gói dịch vụ của bạn đã hết. Hãy mua thêm gói dịch vụ để sử dụng!</div>
          }

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
    dispatch(getProfileRequest({ userCode: profile.code }))
  }, [])

  return (
    <div className={styles.serpro}>
      <div className={styles.serpro_inner}>
        <div className={styles.section_form_hiring}>
          <div className={styles.header}>
            Chọn dịch vụ đăng tin
          </div>
          <div className={`${styles.content_wrap} pb-4`}>
            <div className='mt-4'>
              <Slider {...settingsPromoJob}>
                {promotion
                  // .filter(promotionItem =>
                  //   promotionItem.packageService.some(promo => promo.service.code === 'JOBPOST_BASIC'),
                  // )
                  .map(item => (
                    <div
                      key={item.id}
                      className={styles.serpro_proJob_item}
                      onClick={() => {
                        setIsModalDetail(true)
                        setDataModalAction(item)
                      }}
                    >
                      <img src={item.img} alt="" />
                    </div>
                  ))}
              </Slider>
            </div>
            {
              (Number(router.query.jobStatus) !== statusPostConstants.Refuse || !cartServiceRef.current.length) &&
              <>
                {!!promotion.length && (
                  <div className={styles.serpro_promo}>
                    <div className={styles.serpro_promo_title}>Gói khuyến mại</div>
                    <div className={styles.serpro_promo_list}>
                      {promotion
                        // .filter(
                        //   promo => promo.buyLimit > promo.sold && promo.toTime * 1000 > getTime(new Date()),
                        // )
                        .map(item => (
                          <div key={item.id} className={styles.serpro_promo_item}>
                            <div className={`${styles.serpro_promo_item_info} d-flex`}>
                              <img src={item.img || configConstant.defaultPicture} alt="images-promotion" width={150} height="100%" className="object-fit-cover" />
                              <div className='px-3 w-100'>
                                <div className='font-weight-bold mt-2'>
                                  {item.name}
                                </div>
                                <div className={`mt-2 ${styles.textEllipsis2}`}>
                                  {item.desc}
                                </div>
                                <div className='mt-2'>
                                  {item.toTime &&
                                    <div style={{ color: 'red' }}>
                                      {/* <span>Áp dụng đến hết:</span>{' '} */}
                                      {`Áp dụng đến hết ${format(new Date(item.toTime * 1000), 'dd/MM/yyyy')}`}
                                    </div>
                                  }

                                </div>
                                <div className={`${styles.serpro_promo_item_price} my-2 align-items-center`}>
                                  <div className="d-flex">
                                    <img className='mr-2' src="/assets/icons/color/icon_cart.svg" alt='cart' />
                                    <div className={`${styles.serpro_promo_item_number}`}>
                                      <span style={{ color: "red" }}>{formatDiamond(item.basePrice)}</span>
                                      <img src="/assets/icons/color/diamond.svg" alt="" />
                                    </div>
                                  </div>
                                  <div
                                    className={`${styles.serpro_promo_item_buy} py-1 px-3`}
                                    onClick={() => {
                                      setIsModalDetail(true)
                                      setDataModalAction(item)
                                    }}
                                  >
                                    Chi tiết
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* {!!mySerPro.length && ( */}
                <div className={styles.serpro_useSer}>
                  <div className={styles.serpro_useSer_title}>
                    <span>Dịch vụ đăng tuyển</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalService(true)
                        dispatch(getProfileRequest({ userCode: profile.code }))
                      }}
                    >
                      <span>Mua thêm</span>
                      <img alt="" src="/assets/icons/default/cart.svg" />
                    </button>
                  </div>
                  <div className={styles.serpro_useSer_list}>{renderMySerBasic()}</div>
                </div>
                {/* )} */}

                {/* {!!mySerPro.length && ( */}
                <div className={styles.serpro_useSer}>
                  <div className={styles.serpro_useSer_title}>
                    <span>Gói dịch vụ khác</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalService(true)
                        dispatch(getProfileRequest({ userCode: profile.code }))
                      }}
                    >
                      <span>Mua thêm</span>
                      <img alt="" src="/assets/icons/default/cart.svg" />
                    </button>
                  </div>
                  <div className={styles.serpro_useSer_list}>{renderMySerOther()}</div>
                </div>
                {/* )} */}
              </>
            }

            {!!cartService.length &&
              <>
              <div className={`${styles.serpro_useService_title} mt-5`}>Dịch vụ đã chọn</div>
                <div className={styles.serpro_useService_list}>
                  {cartService.map(item => (
                    <div key={item.id} className={styles.serpro_useService_item}>
                      <div className='font-weight-bold'>
                        {item.name}
                      </div>
                      <div>
                        <span>Số lượng: </span>
                        {item.quantity} gói
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          </div>
        </div>
      </div>

      <div className="hiring_continue d-flex justify-content-center py-4">
        <Button
          className={`${styles.btn_back_step} mr-4`}
          // type="primary" 
          onClick={() => handleChangeStep(jobConstant.stepPost.step2)}>
          <CaretLeftOutlined />
          Quay lại
        </Button>
        <Button type="primary" onClick={() => handleChangeStep(jobConstant.stepPost.step4)}>
          Tiếp tục
          <CaretRightOutlined />
        </Button>
      </div>

      {isModalDetail && (
        <Modal
          wrapClassName="modal-global"
          visible={isModalDetail}
          onCancel={() => {
            setIsModalDetail(false)
            setQuantityPackage(1)
          }}
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
                      setIsModalDetail(false)
                      setIsModalConfirm(true)
                      setDataModalAction(dataModalAction)
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
            <div className={`${styles.modal_buyDetail_package} mt-2`}>
              <span>Mô tả:</span>
              <div>
                {dataModalAction.desc}
                {/* {dataModalAction.desc.split(', ').map((char, idx) => (
                  <div key={idx}>- {char}</div>
                ))} */}
              </div>
            </div>
            <div className={`${styles.modal_buyDetail_package} mt-2`}>
              <span>Áp dụng đến hết ngày:</span>
              {format(new Date(dataModalAction.toTime * 1000), 'dd/MM/yyyy')}
            </div>

            <div className={`${styles.modal_buyDetail_price} mt-2`}>
              <span>Giá tiền:</span>
              <div className={styles.modal_buyDetail_number}>
                {formatDiamond(dataModalAction.basePrice)}{' '}
                <img src="/assets/icons/color/diamond.svg" alt="" />
              </div>
            </div>
            <div className={`${styles.modal_buyDetail_quantity} mt-2`}>
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
                  onChange={e => {
                    if (regexPattern.digit.test(e.target.value)) {
                      setQuantityPackage(Number(e.target.value))
                    }
                  }
                  }
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
      )}

      {isModalService &&
        <ModalPopup
          isConfirmBtn={false}
          positionAction="center"
          isCancelBtn={false}
          title="Mua dịch vụ"
          width={768}
          visible={isModalService}
          handleCancelModal={() => {
            setIsModalService(false)
          }}
          closeBtn
        >
          <BuyMoreModal handleCloseModalService={handleCloseModalService} />
        </ModalPopup>
      }

      <ModalPopup
        closeBtn
        title="Xác nhận thanh toán"
        visible={isModalConfirm}
        handleCancelModal={() => {
          setIsModalConfirm(false)
          setQuantityPackage(1)
        }}
        isCancelBtn={false}
        isConfirmBtn={false}
      >
        <div className={styles.modal_buy}>
          <div className={`${styles.modal_buy_chance} text-center`}>
            Bạn có chấp nhận thanh toán
            <span>
              {(dataModalAction.promotionTypeCode === 'SALE_PRICE' &&
                dataModalAction.promotionParam1
                ? (100 - dataModalAction.promotionParam1) / 100
                : 1) *
                dataModalAction.basePrice *
                quantityPackage}
              &nbsp;<img src='/assets/icons/color/diamond.svg' alt='diamond' />
            </span>không?

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
    </div>
  )
}

export default ServicePromo
