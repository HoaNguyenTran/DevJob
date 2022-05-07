
/* eslint-disable react/jsx-key */
import React, { FC, useEffect, useRef, useState } from 'react'
import { getAllPromotionApi, getMyServiceApi, postBuySerProApi } from 'api/client/service'
import { Button, Col, message, Modal, Row, Spin } from 'antd'

import { useAppDispatch, useAppSelector } from 'src/redux'
import { format } from 'date-fns'
import { getProfileRequest } from 'src/redux/user'
import { CaretLeftOutlined } from '@ant-design/icons'
import Slider from 'react-slick'

import { formatNumber, formatDiamond, handleError } from 'src/utils/helper'
import Payment from 'src/components/elements/Payment/Payment'
import { serviceConstant } from 'src/constants/serviceConstant'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { regexPattern } from 'src/utils/patterns'
import styles from './ServicePromoUrgent.module.scss'

type TModalDetail = { action: number; type: number; data: any }

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

interface IProps {
  handleCloseModalService(): void
}

const ServicePromotionForUrgent: FC<IProps> = ({ handleCloseModalService }) => {
  const dispatch = useAppDispatch()
  const masterData = useAppSelector(state => state.initData.data)

  const profile = useAppSelector(state => state.user.profile || {})

  const [loading, setLoading] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const [quantityPackage, setQuantityPackage] = useState(1)


  const [promotion, setPromotion] = useState<ServiceGlobal.Promotion[]>([])

  const [mySerPro, setMySerPro] = useState<ServiceGlobal.ServiceTypeMyService[]>([])



  const [dataModalType, setDataModalType] = useState<any>({})
  const [dataModalAction, setDataModalAction] = useState<any>({})
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [isModalConfirm, setIsModalConfirm] = useState<boolean>(false)
  const [isModalBuyKC, setIsModalBuyKC] = useState<boolean>(false)
  const [isModalConfirmBuyKC, setIsModalConfirmBuyKC] = useState<boolean>(false)
  const [isModalDetail, setIsModalDetail] = useState<boolean>(false)

  const refConstants = useRef({ buy: 1, use: 2, service: 1, promotion: 2, buyPackage: 3 })

  const allServices = masterData.FjobService || []

  const myPackageServices = allServices.filter(item => item.code === serviceConstant.urgent.code) || []

  // let additions: any = []
  // myPackageServices.map(item => {
  //   additions = [...item?.addition?.split(',')]
  // })

  const otherServices = allServices.filter(item => item.serviceTypeId === 2) || []

  const getAvaiablePackage = packageId => mySerPro.find(item => item.serviceId === packageId) || {}

  const backToScreen = async () => {
    if (handleCloseModalService) {
      handleCloseModalService()
    }
    try {
      const resMySer = await getMyServiceApi()
      setMySerPro(resMySer.data.data)
    } catch (error) {
      handleError(error)
    }
  }

  const handleCloseModalDetail = () => {
    setIsModalDetail(false)
    setIsModalVisible(false)
    setQuantityPackage(1)
  }

  const handleOpenModalConfirm = data => {
    // handleCloseModalDetail()
    // handleCloseModalDetail()
    setIsModalDetail(false)
    setIsModalConfirm(true)
    setDataModalAction(data)
  }

  const handleAction = async data => {
    setIsModalVisible(false)
    setIsModalConfirm(false)

    if (data.action === refConstants.current.buy) {
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
        dispatch(getProfileRequest({ userCode: profile.code }))
        message.success('Mua khuyến mại thành công!')
      } catch (error) {
        message.error('Mua khuyến mại thất bại!')
      } finally {
        setIsModalVisible(false)
        setIsModalConfirm(false)
        setLoadingBtn(false)
      }
    } else if (data.action === refConstants.current.buyPackage) {
      try {
        await postBuySerProApi({
          services: [
            {
              serviceId: data.id,
              quantity: quantityPackage,
            },
          ],
          promotions: [],
        })
        const resMySer = await getMyServiceApi()
        setMySerPro(resMySer.data.data)
        dispatch(getProfileRequest({ userCode: profile.code }))
        message.success('Mua gói dịch vụ thành công!')
      } catch (error) {
        message.error('Mua gói dịch vụ thất bại!')
      } finally {
        setIsModalVisible(false)
        setIsModalConfirm(false)
        setLoadingBtn(false)
      }
    }
    setQuantityPackage(1)
  }

  const formModalDetail = async ({ action, type, data }: TModalDetail) => {
    setIsModalVisible(true)
    if (type === refConstants.current.service) {
      setDataModalType({ action, title: 'Chi tiết dịch vụ', ...data })
    }
    if (type === refConstants.current.promotion) {
      setDataModalType({ action, title: 'Chi tiết khuyến mại', ...data })
    }
  }

  const handleOpenModalDetail = data => {
    setIsModalDetail(true)
    setDataModalAction({ ...data, action: refConstants.current.buy })
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const arrResponse = await Promise.allSettled([getAllPromotionApi({}), getMyServiceApi()])
        if (arrResponse[0].status === "fulfilled") {
          setPromotion(arrResponse[0].value.data.data)
        }
        if (arrResponse[1].status === "fulfilled") setMySerPro(arrResponse[1].value.data.data)
      } catch (error) {
        handleError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    dispatch(getProfileRequest({ userCode: profile.code }))
  }, [])

  if (loading)
    return (
      <div className="position-center mt-4">
        <Spin />
      </div>
    )

  return (
    <div>
      {!!promotion.length && <div className={styles.serpro_promo}>
        <div className={styles.serpro_promo_title}>Gói khuyến mại</div>
        <Slider {...settingsPromoJob}>
          {promotion
            // .filter(promotionItem =>
            //   promotionItem.packageService.some(promo => promo.service.code === 'JOBPOST_BASIC'),
            // )
            .map(item => (
              <div
                key={item.id}
                className={styles.serpro_proJob_item}
                onClick={() => handleOpenModalDetail(item)}
              >
                <img src={item.img} alt="" />
              </div>
            ))}
        </Slider>
      </div>}

      <div className={styles.serpro_useSer}>
        <div className={styles.serpro_useSer_title}>
          <span>Dịch vụ đăng tuyển</span>
        </div>
        <div className={styles.serpro_useSer_list}>
          {myPackageServices.map(mySer => (
            <div key={mySer.id} className={styles.serpro_useSer_item}>
              <div className={styles.serpro_useSer_item_info}>
                <div>
                  <span>Dịch vụ:</span> {mySer.name}
                </div>
                <div>
                  <span>Mô tả:</span>
                  <div className="ml-4">
                    {mySer.desc
                      .slice(1)
                      .split('- ')
                      .map((char, idx) => (
                        <div key={idx}>{char}</div>
                      ))}
                  </div>
                </div>
                <div className="d-flex">
                  <span>Bạn đang có:</span>
                  <div className={styles.serpro_useSer_item_number}>
                    {formatNumber((mySerPro.find(item => item.serviceId === mySer.id) || {}).quantity || 0)} gói
                  </div>
                </div>
              </div>

              <div className="d-flex align-items-center">
                <div
                  className={styles.serpro_promo_item_buy}
                  onClick={() =>
                    formModalDetail({
                      action: refConstants.current.buyPackage,
                      type: refConstants.current.service,
                      data: mySer,
                    })
                  }
                >
                  Mua ngay
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.serpro_useSer}>
        <div className={styles.serpro_useSer_title}>
          <span>Gói dịch vụ khác</span>
        </div>
        <div className={styles.serpro_useSer_list}>
          {otherServices.map(mySer => (
            <div key={mySer.id} className={styles.serpro_useSer_item}>
              <div className={styles.serpro_useSer_item_info}>
                <div>
                  <span>Dịch vụ:</span> {mySer.name}
                </div>
                <div>
                  <span>Mô tả:</span>
                  <div className="ml-4">
                    {mySer.desc
                      .slice(1)
                      .split('- ')
                      .map((char, idx) => (
                        <div key={idx}>{char}</div>
                      ))}
                  </div>
                </div>
                <div className="d-flex">
                  <span>Bạn đang có:</span>
                  <div className={styles.serpro_useSer_item_number}>
                    {formatNumber((mySerPro.find(item => item.serviceId === mySer.id) || {}).quantity || 0)} gói
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div
                  className={styles.serpro_promo_item_buy}
                  onClick={() =>
                    formModalDetail({
                      action: refConstants.current.buyPackage,
                      type: refConstants.current.service,
                      data: mySer,
                    })
                  }
                >
                  Mua ngay
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="hiring_continue d-flex justify-content-start m-4 mt-5">
        <Button type="primary" onClick={() => backToScreen()}>
          <CaretLeftOutlined />
          Quay lại
        </Button>
      </div>

      <Modal
        style={{ zIndex: 10 }}
        title={dataModalType.title}
        visible={isModalVisible}
        onCancel={handleCloseModalDetail}
        footer={
          quantityPackage && [
            <div className="d-flex justify-content-between">
              <div className="information text-left">
                <div>
                  Tổng cộng:{' '}
                  <span className="text-secondary font-weight-bold">
                    {formatDiamond(quantityPackage * dataModalType.basePrice)}
                  </span>{' '}
                  <img src='/assets/icons/color/diamond.svg' alt='kim cuong' />
                </div>
                <div>
                  Bạn còn:{' '}
                  <span className="text-secondary font-weight-bold">
                    {formatDiamond(profile.walletValue)}
                  </span>{' '}
                  <img src='/assets/icons/color/diamond.svg' alt='kim cuong' /> trong ví
                </div>
              </div>
              <button
                key="submit"
                type="button"
                className={styles.modal_btn_submit}
                onClick={() => {
                  handleCloseModalDetail()
                  if (quantityPackage * dataModalType.basePrice > profile.walletValue) {
                    // message.error("Bạn cần nạp thêm kim cương để mua dịch vụ!");
                    setIsModalConfirmBuyKC(true)
                    return
                  }
                  handleOpenModalConfirm(dataModalType)
                }}
              >
                <div>Mua gói</div>
              </button>
            </div>,
          ]
        }
      >
        {/* {dataModalType.action === refConstants.current.buy && ( */}
        <div className={styles.modal_buyDetail}>
          <div className={`${styles.modal_buyDetail_name} font-weight-bold`}>
            <span>Tên gói:</span> {dataModalType.name}
          </div>
          <div className={`${styles.modal_buyDetail_package} mt-2`}>
            <span>Mô tả:</span>
            {dataModalType?.desc ? (
              <div className="ml-4">
                {dataModalType?.desc?.split(', ').map((char, idx) => (
                  <div key={idx}>{char}</div>
                ))}
              </div>
            ) : (
              <div className="ml-4">
                {dataModalType?.serviceDesc?.split('-').map((char, idx) => (
                  <div key={idx}>{!!char.trim().length && `${char}`}</div>
                ))}
              </div>
            )}
          </div>
          {dataModalType.toTime && (
            <div className={`${styles.modal_buyDetail_package} mt-2`}>
              <span>Áp dụng đến hết ngày:</span>
              {format(new Date(dataModalType.toTime * 1000), 'dd/MM/yyyy')}
            </div>
          )}

          <div className={`${styles.modal_buyDetail_price} mt-2`}>
            <span className="font-weight-bold">Giá tiền:</span>
            <div className={styles.modal_buyDetail_number}>
              {formatDiamond(dataModalType.basePrice)} <img src='/assets/icons/color/diamond.svg' alt='kim cuong' />
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
                onChange={e => {
                  if (regexPattern.digit.test(e.target.value)) {
                    setQuantityPackage(Number(e.target.value))
                  }
                }}
                value={quantityPackage}
                min={1}
                type="number"
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
        {/* )} */}
      </Modal>
      
      <ModalPopup
        transition='move-up'
        visible={isModalConfirm}
        title="Xác nhận thanh toán"
        handleCancelModal={() => {
          // setIsModalVisible(false)
          setIsModalConfirm(false)
        }}
        handleConfirmModal={() => {
          setIsModalVisible(false)
          setIsModalConfirm(false)
          handleAction(dataModalAction)
        }}
      >
        <div className="modal-body">
          <div className="text-center">
            Bạn có xác nhận thanh toán&nbsp;
            <span className="text-secondary">
              {dataModalAction.basePrice * quantityPackage}&nbsp; <img src='/assets/icons/color/diamond.svg' alt='kim cuong' />&nbsp;
            </span>
            không?
          </div>
        </div>
        {/* <Row className="justify-content-between modal-btn-group">
          <Col span={11}>
            <Button
              className="modal-btn-cancel"
              onClick={() => {
                // setIsModalVisible(false)
                setIsModalConfirm(false)
              }}
            >
              Huỷ bỏ
            </Button>
          </Col>
          <Col span={11}>
            <Button
              className="modal-btn-ok"
              htmlType="submit"
              loading={loadingBtn}
              onClick={() => {
                // setLoadingBtn(true)
                setIsModalVisible(false)
                setIsModalConfirm(false)
                handleAction(dataModalAction)
              }}
            >
              Đồng ý
            </Button>
          </Col>
        </Row> */}
      </ModalPopup>
      <ModalPopup
        visible={isModalConfirmBuyKC}
        title="Thông báo"
        handleCancelModal={() => {
          setIsModalConfirmBuyKC(!isModalConfirmBuyKC)
        }}
        textCancel="Huỷ bỏ"
        textConfirm="Nạp"
        handleConfirmModal={() => {

          setIsModalConfirmBuyKC(!isModalConfirmBuyKC)
          setIsModalBuyKC(true)
        }}
      >
        <div className="modal-body" style={{ minHeight: '50px' }}>
          <div className="modal-title font-weight-normal">
            Bạn cần nạp thêm <span className="text-secondary"><img src='/assets/icons/color/diamond.svg' alt='kim cuong' /> </span> để mua dịch vụ!
          </div>
        </div>
      </ModalPopup>

      <ModalPopup
        visible={isModalBuyKC}
        title="Nạp kim cương"
        handleCancelModal={() => {
          setIsModalBuyKC(!isModalBuyKC)
        }}
        isConfirmBtn={false}
        isCancelBtn={false}
        width={1200}
        closeBtn
      >
        <Payment
          handleCloseModalPayment={() => {
            dispatch(getProfileRequest({ userCode: profile.code }))
            setIsModalVisible(false)
            setIsModalBuyKC(false)
            setIsModalConfirmBuyKC(false)
          }}
        />
      </ModalPopup>

      {/* <Modal
        style={{ zIndex: 999999999 }}
        wrapClassName="modal-global"
        visible={isModalBuyKC}
        title="Nạp kim cương"
        width={900}
        footer={null}
        onCancel={() => {
          setIsModalBuyKC(!isModalBuyKC)
        }}
      >
        <Payment
          handleCloseModalPayment={() => {
            dispatch(getProfileRequest({ userCode: profile.code }))
            setIsModalVisible(false)
            setIsModalBuyKC(false)
            setIsModalConfirmBuyKC(false)
          }}
        />
      </Modal> */}
      {isModalDetail && (
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
                        {(dataModalAction.promotionTypeCode === 'SALE_PRICE' &&
                          dataModalAction.promotionParam1
                          ? (100 - dataModalAction.promotionParam1) / 100
                          : 1) *
                          dataModalAction.basePrice *
                          quantityPackage}
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
              {format(new Date(dataModalAction.toTime * 1000), 'dd/MM/yyyy')}
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
                  onChange={e => { 
                    if (regexPattern.digit.test(e.target.value)) 
                    setQuantityPackage(Number(e.target.value))} 
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
    </div>
  )
}

export default ServicePromotionForUrgent
