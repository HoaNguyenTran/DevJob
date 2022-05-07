import { Button, message, Modal, Spin } from 'antd'
import { postBuyAndUseServicesApi, postUseServiceApi } from 'api/client/service'
import { differenceInDays, formatDistanceToNow } from 'date-fns'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { handleError } from 'src/utils/helper'
import viLocale from 'date-fns/locale/vi'
import styles from './UpgradeHotJob.module.scss'

const serviceHotJob = [
  'HOT_JOB',
  'HOT_JOB_DAY',
  'REFRESH_EVERY_DAY_JOB',
  'REFRESH_EVERY_FIX_TIME',
  'SPECIAL_EVERY_WEEK_JOB',
]

const buyService = [

  {
    'id': 21,
    'serviceTypeId': 2,
    'code': 'HOT_JOB_DAY',
    'name': 'Việc làm siêu hot 24h',
    'desc': '- Tin tuyển dụng nằm trong box "Siêu hot" trên trang chủ trong vòng 24h',
    'img': null,
    'basePrice': 100,
    'priceUnit': 1,
    'quantity': 1,
    'canBuy': 1,
    'addition': '',
  },
  {
    'id': 5,
    'serviceTypeId': 2,
    'code': 'HOT_JOB',
    'name': 'Việc làm siêu hot 7 ngày',
    'desc': '- Tin tuyển dụng nằm trong box "Siêu hot" trên trang chủ trong vòng 7 ngày',
    'img': null,
    'basePrice': 600,
    'priceUnit': 2,
    'quantity': 1,
    'canBuy': 1,
    'addition': '',
  },
]

const UpgradeHotJob = ({ propsData, triggerFetchData, changeStatusFeatureUpgradeHotJobModal }: { propsData: { id: number, expireTime: number }, triggerFetchData, changeStatusFeatureUpgradeHotJobModal }) => {
  const dispatch = useAppDispatch()
  const profile: UserGlobal.Profile = useAppSelector(state => state.user.profile || {})
  const [loadingUseService, setLoadingUseService] = useState<boolean>(false)

  const [isUpgradeHotJobModal, setIsUpgradeHotJobModal] = useState(false)
  const [serviceDetail, setServiceDetail] = useState<any>({})

  const handleFlagWaring = ({ serviceExpired }) => {
    let dayExtend = 1

    switch (serviceExpired) {
      case 1:
        dayExtend = 1
        break
      case 2:
        dayExtend = 7
        break
      case 3:
        dayExtend = 30
        break

      default:
        break;
    }

    if (dayExtend > differenceInDays(new Date(propsData.expireTime * 1000), Date.now())) return true
    return false
  }

  const useServiceExist = async (serviceId: number) => {
    setLoadingUseService(true)
    const data = {
      useServices: [
        {
          serviceId,
          quantity: 1,
        },
      ],
      jobId: propsData.id,
    }
    try {
      // setIsUpgradeHotJobModal(false)
      await postUseServiceApi(data)
      dispatch(getProfileRequest({ userCode: profile.code }))
      triggerFetchData()
      changeStatusFeatureUpgradeHotJobModal(false)
      message.success('Nâng cấp gói Hot Job thành công')
    } catch (error) {
      handleError(error)
    } finally {
      setLoadingUseService(false)
      setIsUpgradeHotJobModal(false)
    }
  }




  const buyAndUseService = async (serviceId: number) => {
    setLoadingUseService(true)
    const data = {
      jobId: propsData.id,
      services: [
        {
          serviceId,
          quantity: 1,
        },
      ],
      promotions: [],
      useServices: [],
    }
    try {
      await postBuyAndUseServicesApi(data)

      dispatch(getProfileRequest({ userCode: profile.code }))
      triggerFetchData()
      changeStatusFeatureUpgradeHotJobModal(false)
      message.success('Mua và sử dụng gói Hot Job thành công')
    } catch (error) {
      handleError(error)
    } finally {
      setLoadingUseService(false)
      setIsUpgradeHotJobModal(false)
    }
  }

  const renderHotJobService = profile?.userServices
    .filter(item => serviceHotJob.includes(item.serviceCode))
    .map(service => (
      <div
        key={service.id}
        className={`w-100 d-flex flex-row align-items-center justify-content-between ${styles.modal_service}`}
      >

        <div className={`d-flex flex-column ${styles.item}`}>
          <span className={styles.title}>{service.serviceName}</span>
          <span>
            Số lượng : <span className={styles.count}>{service.quantity}</span>
          </span>
        </div>
        <Button
          disabled={loadingUseService || !service.quantity}
          className={styles.btn}
          onClick={() => {
            setServiceDetail({
              type: 1,
              id: service.serviceId,
              name: service.serviceName,
              flagWarning: handleFlagWaring({ serviceExpired: service.priceUnit })
            })
            setIsUpgradeHotJobModal(true)
          }}
        >
          Sử dụng
        </Button>
      </div>
    ))

  const renderBuyHotJobService = buyService.map(service => (
    <div
      key={service.id}
      className={`w-100 d-flex flex-row align-items-center justify-content-between ${styles.modal_service}`}
    >
      <div className={`d-flex flex-column ${styles.item}`}>
        <span className={styles.title}>{service.name}</span>
        <span>{service.desc}</span>
      </div>
      <Button
        onClick={() => {
          setServiceDetail({
            type: 2,
            id: service.id,
            name: service.name,
            price: service.basePrice,
            flagWarning: handleFlagWaring({ serviceExpired: service.priceUnit })
          })
          setIsUpgradeHotJobModal(true)
        }}
        disabled={loadingUseService}
        className={styles.btn}
      >
        Mua và dùng ngay
      </Button>
    </div>
  ))

  const renderMessage = () => {
    if (serviceDetail.flagWarning) {
      // const time = differenceInDays(new Date(propsData.expireTime * 1000), Date.now()) === 0
      //   ? formatDistanceToNow(new Date(propsData.expireTime * 1000), { locale: viLocale })
      //   : formatDistanceToNow(new Date(propsData.expireTime * 1000), { locale: viLocale })
      if (serviceDetail.type === 1) {
        return <div>Tin đăng của bạn sẽ hết hạn sau {formatDistanceToNow(new Date(propsData.expireTime * 1000), { locale: viLocale })}
          . Bạn có chắc chắn muốn sử dụng gói dịch vụ {serviceDetail.name} không?</div>
      }
      return <div>Tin đăng của bạn sẽ hết hạn sau
        {formatDistanceToNow(new Date(propsData.expireTime * 1000), { locale: viLocale })}
        . Bạn có xác nhận thanh toán {serviceDetail.price} KC để mua gói dịch vụ {serviceDetail.name}?</div>
    }

    if (serviceDetail.type === 1) {
      return <div>Bạn có chắc chắn muốn sử dụng gói dịch vụ {serviceDetail.name} không?</div>
    } return <div>Bạn có xác nhận thanh toán {serviceDetail.price} KC để mua gói dịch vụ {serviceDetail.name}?</div>
  }

  return (
    <div>
      <div className={styles.custom_modal}>
        {loadingUseService ? <Spin /> : <div />}Dịch vụ của bạn
      </div>
      {renderHotJobService}
      <div className={styles.custom_modal}>Mua thêm dịch vụ</div>
      {renderBuyHotJobService}

      {(Object.keys(serviceDetail).length !== 0) && <Modal
        onCancel={() => setIsUpgradeHotJobModal(false)}
        visible={isUpgradeHotJobModal}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Xác nhận nâng cấp Hot Job</div>
          <div className={styles.warning}>
            {renderMessage()}

          </div>
          <div className="modal-action">
            <button
              type="button"
              onClick={() => {
                setIsUpgradeHotJobModal(false);
                setServiceDetail({})
              }}
              className="modal-cancel"
            >
              Huỷ bỏ
            </button>
            <button
              type="button"
              onClick={() => {
                if (serviceDetail.type === 1) useServiceExist(serviceDetail.id)
                if (serviceDetail.type === 2) buyAndUseService(serviceDetail.id)
                setServiceDetail({})
              }}
              className="modal-confirm"
            >
              Đồng ý
            </button>
          </div>
        </div>
      </Modal>}
    </div>
  )
}

export default UpgradeHotJob
