import { Alert, Button, Form, message, Modal } from 'antd'
import { getPromotionByCodeApi, postBuySerProApi } from 'api/client/service'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import CandidateAndDetail from 'src/components/elements/CandidateAndDetail'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { routerPathConstant } from 'src/constants/routerConstant'
import { serviceConstant } from 'src/constants/serviceConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { handleError, scrollToTopForSection } from 'src/utils/helper'
import Sidebar from './components/Sidebar/Sidebar'
import styles from './FindEE.module.scss'

interface InfoPromo {
  id: number,
  name: string,
  price: number,
}

export default function FindEE(): JSX.Element {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [form] = Form.useForm()

  const profile = useAppSelector(state => state.user.profile || {})

  const [promoList, setPromoList] = useState<ServiceGlobal.Promotion[]>([])
  const [infoPromo, setInfoPromo] = useState<InfoPromo>({} as InfoPromo)


  const [isModalListPromo, setIsModalListPromo] = useState(false)
  const [isModalConfirmBuy, setIsModalConfirmBuy] = useState(false)
  const [isPurchaseDiamondModal, setIsPurchaseDiamondModal] = useState(false)


  const handleBuyService = async () => {
    try {
      const { data } = await postBuySerProApi({
        services: [],
        promotions: [
          {
            packageId: infoPromo.id,
            quantity: 1,
          },
        ],
      })
      message.success(data.message)
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
  }

  const handleSearchEE = async page => {
    scrollToTopForSection(document.getElementById('layout-content'))
    let tmpStr = `${routerPathConstant.erFindEE}/?limit=10&page=${page}`

    const {
      jobCateId,
      provinceId,
      districtId,
      salaryMin,
      salaryMax,
      salaryUnit,
      educationId,
      chooseGender = [],
      experienceId,
      ageMin,
      ageMax,
    } = form.getFieldsValue()


    if (jobCateId) tmpStr = tmpStr.concat(`&categories=${jobCateId || 1}`)
    if (provinceId) tmpStr = tmpStr.concat(`&provinceId=${provinceId}&locationType=2`)
    if (districtId) tmpStr = tmpStr.concat(`&districtId=${districtId}`)
    if (experienceId) tmpStr = tmpStr.concat(`&experienceId=${experienceId}`)
    if (salaryMin) tmpStr = tmpStr.concat(`&expectSalaryFrom=${salaryMin}`)
    if (salaryMax) tmpStr = tmpStr.concat(`&expectSalaryTo=${salaryMax}`)
    if (salaryUnit) tmpStr = tmpStr.concat(`&expectWageUnit=${salaryUnit}`)
    if (educationId) tmpStr = tmpStr.concat(`&academicId=${educationId}`)
    if (ageMin) tmpStr = tmpStr.concat(`&ageFrom=${ageMin}`)
    if (ageMax) tmpStr = tmpStr.concat(`&ageTo=${ageMax}`)
    if (chooseGender === 1) tmpStr = tmpStr.concat(`&male=1`)
    if (chooseGender === 2) tmpStr = tmpStr.concat(`&female=2`)
    if (chooseGender === 0) tmpStr = tmpStr.concat(`&other=0`)

    return router.push(tmpStr)
  }

  const fetchPromotionBuyContactBuyCall = async () => {
    const { data } = await getPromotionByCodeApi({ code: serviceConstant.buyContactBuyCall.code })
    setPromoList(data.data)
  }

  const handleConfirmPurchaseModal = () => {
    router.push({ pathname: routerPathConstant.erPayment, query: { next: router.asPath } });
    setIsPurchaseDiamondModal(false)
  }

  return (
    <div className={`findEE ${styles.findEE}`}>
      <div className={styles.findEE_wrap}>
        {!profile?.userServices?.find(
          service => service.serviceCode === serviceConstant.buyContactBuyCall.code,
        )?.quantity ? (
          <Alert
            message={
              <div>
                Gói dịch vụ xem thông tin tiết và liên hệ ứng viên đã hết. &nbsp;
                <Button
                  type="primary"
                    onClick={() => { setIsModalListPromo(true); fetchPromotionBuyContactBuyCall() }}
                >
                  Mua tại đây!
                </Button>
              </div>
            }
            type="warning"
            showIcon
          />
        ) : null}
        <div className={styles.main}>
          <Sidebar form={form} handleSearchEE={handleSearchEE} />
          <CandidateAndDetail />
        </div>
      </div>

      <Modal
        wrapClassName="modal-global"
        width={576}
        visible={isModalListPromo}
        footer={null}
        onCancel={() => setIsModalListPromo(false)}
      >
        <div className="modal-title">Danh sách dịch vụ</div>
        <div className={`modal-content ${styles.promoList}`}>
          {promoList.map(promo => (
            <div key={promo.id} className={styles.item}>
              <div className={styles.image}>
                <img alt="" src={promo.img} />
              </div>
              <div className={styles.information}>
                <div className={styles.name}>{promo.name}</div>
                <div className={styles.desc}>{promo.desc}</div>
                <div className={styles.expired}>
                  <span>Áp dụng đến hết ngày:</span>&nbsp;
                  {format(new Date(promo.toTime * 1000), 'dd/MM/yyyy')}
                </div>
                <div className={styles.action}>
                  <div className={styles.diamond}>
                    {(promo.promotionParam1 ? (100 - promo.promotionParam1) / 100 : 1) *
                      promo.basePrice}
                    &nbsp;
                    <img alt="" src="/assets/icons/color/diamond.svg" />
                  </div>
                  <div className={styles.buy}>
                    <button
                      type="button"
                      onClick={() => {
                        setInfoPromo({
                          id: promo.id,
                          name: promo.name,
                          price:
                            (promo.promotionParam1 ? (100 - promo.promotionParam1) / 100 : 1) *
                            promo.basePrice,
                        })
                        if ((promo.promotionParam1 ? (100 - promo.promotionParam1) / 100 : 1) *
                          promo.basePrice > profile.walletValue) {
                          setIsPurchaseDiamondModal(true)
                        } else {
                          setIsModalConfirmBuy(true)
                        }

                        setIsModalListPromo(false)
                      }}
                    >
                      Mua ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        wrapClassName="modal-global"
        closable={false}
        width={576}
        visible={isModalConfirmBuy}
        footer={null}
        onCancel={() => setIsModalConfirmBuy(false)}
      >
        <div className="modal-body">
          <div className="modal-title">Xác nhận thanh toán</div>
          <div className="modal-content">
            Bạn có xác nhận thanh toán&nbsp;
            <span style={{ 'color': 'var(--secondary-color)' }}>{infoPromo.price} KC</span> cho gói
            &quot;{infoPromo.name}&quot;
          </div>
          <div className="modal-action">
            <button type="button" onClick={() => setIsModalConfirmBuy(false)} className="modal-cancel">
              Huỷ bỏ
            </button>
            <button
              type="button"
              onClick={() => {
                setIsModalConfirmBuy(false)
                handleBuyService()
              }}
              className="modal-confirm"
            >
              Đồng ý
            </button>
          </div>
        </div>

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