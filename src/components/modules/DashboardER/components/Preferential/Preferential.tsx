import React, { useState } from 'react'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { postBuySerProApi } from 'api/client/service'
import { format } from 'date-fns'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useRouter } from 'next/router'
import { getProfileRequest } from 'src/redux/user'
import { formatDiamond } from 'src/utils/helper'
import { Divider, message } from 'antd'
import LinkTo from 'src/components/elements/LinkTo'
import { regexPattern } from 'src/utils/patterns'
import styles from "./Preferential.module.scss"

const Preferential = (): JSX.Element => {
  const { width } = useWindowDimensions()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const profile = useAppSelector(state => state.user.profile || {})
  const { FjobPromotionPackage: promotionList = [] } = useAppSelector(state => state.initData.data)

  const [quantityPackage, setQuantityPackage] = useState(1)
  const [detailPromoData, setDetailPromoData] = useState<any>({})

  const [isDetailPromoModal, setIsDetailPromoModal] = useState(false)
  const [isConfirmBuyModal, setIsConfirmBuyModal] = useState(false)
  const [isPurchaseDiamondModal, setIsPurchaseDiamondModal] = useState(false)

  const handleConfirmPayment = async data => {
    if (
      (detailPromoData.promotionTypeCode === 'SALE_PRICE' && detailPromoData.promotionParam1
        ? (100 - detailPromoData.promotionParam1) / 100
        : 1) *
      detailPromoData.basePrice *
      quantityPackage >
      profile?.walletValue
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
      dispatch(getProfileRequest({ userCode: profile.code }),)
      message.success('Mua khuyến mại thành công!')
    } catch (error) {
      message.error('Mua khuyến mại thất bại!')
    }
    setQuantityPackage(1)
  }


  return (
    <div className={styles.preferential}>
      {width && <div className={styles.preferential_inner}>
        <div className={styles.preferential_title}>Ưu đãi</div>
        <div className={styles.preferential_content}>
          {promotionList.slice(0, width > 576 ? 6 : 3).map(service => (
            <div key={service.id} className={styles.service_item}>
              <div
                className={styles.inner}
                onClick={() => { setIsDetailPromoModal(true); setDetailPromoData(service) }}
              >
                <div className={styles.image}>
                  <img alt="" width={200} height={200} src={service.img} />
                </div>
                <div className={styles.information}> 
                  <div className={styles.info}>  <div className={styles.title}>{service.name}</div>
                    <div className={styles.subtitle}>{service.desc}</div>
                  </div>

                  <div className={styles.date}>Ngày hết hạn: {format(new Date(service.toTime * 1000), 'dd/MM/yyyy')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.preferential_more}>
          <LinkTo href={routerPathConstant.erService}>
            Xem tất cả ưu đãi
          </LinkTo>
        </div>
      </div>}

      {isDetailPromoModal &&
        <ModalPopup
          visible={isDetailPromoModal} title="Chi tiết khuyến mãi" textConfirm='Mua gói'
          handleConfirmModal={() => {
            setIsDetailPromoModal(false)
            if ((detailPromoData.promotionTypeCode === 'SALE_PRICE' && detailPromoData.promotionParam1
              ? (100 - detailPromoData.promotionParam1) / 100
              : 1) *
              detailPromoData.basePrice *
              quantityPackage >
              profile?.walletValue
            ) return setIsPurchaseDiamondModal(true)

            setIsConfirmBuyModal(true)
          }}
          handleCancelModal={() => {
            setIsDetailPromoModal(false)
            setDetailPromoData({})
          }}
        >
          <div className={styles.modal_buyDetail}>
            <div className={styles.modal_buyDetail_name}>
              <span>Tên gói:</span> {detailPromoData.name}
            </div>
            <div className={styles.modal_buyDetail_package}>
              <span>Mô tả:</span>
              <div>
                {detailPromoData.desc}
              </div>
            </div>
            <div className={styles.modal_buyDetail_package}>
              <span>Áp dụng đến hết ngày:</span>
              {format(new Date(detailPromoData.toTime * 1000), 'dd/MM/yyyy')}
            </div>

            <div className={styles.modal_buyDetail_price}>
              <span>Giá tiền:</span>
              <div className={styles.modal_buyDetail_number}>
                {formatDiamond(detailPromoData.basePrice)}&nbsp;
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
            <Divider />
            <div className={styles.modal_buyDetail_footer}>
              <div>
                Tổng cộng:&nbsp;
                <span>
                  {formatDiamond((detailPromoData.promotionTypeCode === 'SALE_PRICE' &&
                    detailPromoData.promotionParam1
                    ? (100 - detailPromoData.promotionParam1) / 100
                    : 1) *
                    detailPromoData.basePrice *
                    quantityPackage)}
                </span>
                <img src="/assets/icons/color/diamond.svg" alt="" />
              </div>
              <div>
                Bạn còn: <span>{formatDiamond(profile?.walletValue)}</span>
                <img src="/assets/icons/color/diamond.svg" alt="" />
              </div>
            </div>
          </div>
        </ModalPopup>}

      {isConfirmBuyModal &&
        <ModalPopup visible={isConfirmBuyModal} title="Xác nhận thanh toán" textConfirm='Thanh toán'
          handleConfirmModal={() => {
            setIsConfirmBuyModal(false)
            handleConfirmPayment(detailPromoData)
          }}
          handleCancelModal={() => {
            setIsConfirmBuyModal(false);
            setDetailPromoData({})
          }}
        >
          <div className={styles.modal_buy}>
            <div className={`${styles.modal_buy_chance  } text-center`}>
              Bạn có chấp nhận thanh toán
              <span>
                {(detailPromoData.promotionTypeCode === 'SALE_PRICE' &&
                  detailPromoData.promotionParam1
                  ? (100 - detailPromoData.promotionParam1) / 100
                  : 1) *
                  detailPromoData.basePrice *
                  quantityPackage}
                &nbsp; kim cương
              </span> không?
            </div>
          </div>
        </ModalPopup>}

      {isPurchaseDiamondModal &&
        <ModalPopup
        visible={isPurchaseDiamondModal} title="Bạn không đủ kim cương" textConfirm="Nạp kim cương"
        handleCancelModal={() => setIsPurchaseDiamondModal(false)}
        handleConfirmModal={() => { router.push({ pathname: routerPathConstant.erPayment, query: { next: router.asPath } }); setIsPurchaseDiamondModal(false) }}
      >
        <div>
          Không đủ kim cương trong ví. Vui lòng nạp thêm để mua dịch vụ!
        </div>
      </ModalPopup>}

    </div>
  )
}

export default Preferential