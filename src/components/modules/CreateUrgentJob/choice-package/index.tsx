
import React, { useEffect, useState } from 'react'

import { Alert, Button, Col, message, Modal, Row } from 'antd'
import { postUrgentJobApi } from 'api/client/job'
import { getMyServiceApi } from 'api/client/service'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { jobPostRole } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatDiamond, handleError } from 'src/utils/helper'
import { CaretLeftOutlined } from '@ant-design/icons'
import { useDebounceFunction } from 'src/hooks/useDebounce'
import { serviceConstant } from 'src/constants/serviceConstant'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'

import styles from './ChoicePackage.module.scss'
import ItemPackage from './ItemPackage'
import BuyMoreModal from '../../CreateJob/BuyMoreModal/BuyMoreModal'


const serviceBasic = [serviceConstant.urgent.code]
const serviceOther = [serviceConstant.hotJob24h.code, serviceConstant.urgentJob24h.code, serviceConstant.hotJobAWeek.code, serviceConstant.urgentJobAWeek.code]

export default function ChoicePackage(props) {
  const { formData, backToForm, selectedAddress = {}, selectedCompany = {}, jobRole } = props

  const { t } = useTranslation()
  const router = useRouter()

  const { user } = useAppSelector(state => state)
  const profile = useAppSelector(state => state.user.profile || {})
  const { FjobService: serviceList = [] } = useAppSelector(state => state.initData.data)

  const dispatch = useAppDispatch()

  const [myServices, setMyServices] = useState<ServiceGlobal.ServiceTypeMyService[]>([])

  const [packages, setPackages] = useState<any>([])


  const [isBuyMoreModalVisible, setIsBuyMoreModalVisible] = useState(false)
  const [isModalVisibleConfirmBuyPackage, setIsModalVisibleConfirmBuyPackage] = useState(false)
  const [isModalVisibleNotificationSuccessfully, setIsModalVisibleNotificationSuccessfully] = useState(false)

  const [isLoadingConfirmBuy, setIsLoadingConfirmBuy] = useState(false)

  const [mypackages, setMypackages] = useState<any>([])
  const [sumCoin, setSumCoin] = useState<any>(0)


  const toggleModalConfirmBuyPackage = () => {
    setIsModalVisibleConfirmBuyPackage(!isModalVisibleConfirmBuyPackage)
  }

  const loadServices = async () => {
    dispatch(getProfileRequest({ userCode: profile.code }))
    try {
      const res = await getMyServiceApi()
      setMyServices(res.data.data)
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  const addServices = services => {
    const newArray: any = []

    services.forEach((item: any) => {
      newArray.push({
        serviceId: item.id,
        quantity: 1,
      })
    })

    return newArray
  }

  const buyAndPayPackage = async () => {
    try {
      setIsLoadingConfirmBuy(true)
      toggleModalConfirmBuyPackage()

      let services: any = []
      let useServices: any = []

      const availablePackages = packages.filter(item => !item.isUsingCoin)
      const usingCoinPackages = packages.filter(item => item.isUsingCoin)

      if (availablePackages.length) {
        useServices = [...addServices(availablePackages)]
      }
      if (usingCoinPackages.length) {
        services = [...addServices(usingCoinPackages)]
      }
      const body = {
        'userId': profile.id,
        'jobPostCategoryIds': [formData.jobPostCategoryIds],
        'jobPostExpRequiredCateIds': [formData.jobPostExpRequiredCateIds],
        'addressId': Number(selectedAddress),
        'companyId': jobPostRole.personal === jobRole ? 0 : Number(selectedCompany),
        'hiringCount': formData?.hiringCount,
        'promotions': [],
        useServices,
        services,
        educationLevel: 0
      }
      await postUrgentJobApi(body)
      setIsModalVisibleNotificationSuccessfully(!isModalVisibleNotificationSuccessfully)
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (e) {
      handleError(e)
    } finally {
      setIsLoadingConfirmBuy(false)
      toggleModalConfirmBuyPackage()
    }
  }

  const handleChooseMyPackage = (data, status) => {
    const newArray = [...mypackages]
    const index = newArray.findIndex(item => item.id === data.id)
    if (!status && index === -1) {
      newArray.push({
        isUsingCoin: true,
        ...data,
      })
    } else {
      newArray.splice(index, 1)
    }
    setMypackages(newArray)
  }

  const chooseService = (data, status, isUsingCoin) => {
    const index = packages.findIndex(item => item.id === data.id)
    const array = [...packages]
    if (!status && index === -1) {
      if (isUsingCoin) {
        array.push({
          isUsingCoin: true,
          ...data,
        })
      } else {
        array.push({
          isUsingCoin: false,
          ...data,
        })
      }
    } else {
      array.splice(index, 1)
    }
    setPackages(array)
  }

  const handleCloseModalService = async () => {
    loadServices()
    setIsBuyMoreModalVisible(!isBuyMoreModalVisible)
  }

  const calculateSum = () => {
    const array = packages.filter(item => item.isUsingCoin)
    let sum = 0
    array.forEach(element => {
      sum += element.basePrice
    })
    setSumCoin(sum)
  }

  useEffect(() => {
    calculateSum()
  }, [JSON.stringify(packages)])

  useEffect(() => {
    loadServices()
  }, [])




  const renderMySerBasic = () => {
    const servicePostJob = serviceList.filter(item => serviceBasic.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: myServices.find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map((mySer, i) =>
      <div key={mySer.id}>
        <ItemPackage
          item={mySer}
          callBackChoosePackage={(data, status, isUsingCoin) => {
            handleChooseMyPackage(data, status)
            chooseService(data, status, isUsingCoin)
          }}
          user={user}
        />
      </div>
    )
  }

  const renderMySerOther = () => {
    const servicePostJob = serviceList.filter(item => serviceOther.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: myServices.find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map((mySer, i) => (
      <div key={mySer.id}>
        <ItemPackage
          item={mySer}
          callBackChoosePackage={(data, status, isUsingCoin) =>
            chooseService(data, status, isUsingCoin)
          }
        />
      </div>
    ))
  }

  return (
    <div className={`hiring ${styles.hiring} mt-4`}>
      {
        !mypackages.length && 
        <Alert
          message={<div>Bạn cần sử dụng ít nhất 1 gói đăng tin siêu tốc &nbsp;</div>}
          type="warning"
          showIcon
        />
      }
      
      <div className={styles.serpro}>
        <div className={styles.serpro_inner}>
          <div className={styles.section_form_hiring}>
            <div className={styles.header}>
              Chọn dịch vụ và đăng tin
            </div>
            <div className={`${styles.content_wrap}`}>
              {/* {!!mySerPro.length && ( */}
              <div className={styles.serpro_useSer}>
                <div className={styles.serpro_useSer_title}>
                  <span>Gói đăng tin của tôi</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBuyMoreModalVisible(true)
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
              <div className={`${styles.serpro_useSer  } mt-5`}>
                <div className={styles.serpro_useSer_title}>
                  <span>Gói dịch vụ khác</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBuyMoreModalVisible(true)
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
            </div>
                
          </div>
        </div>
      </div>

      
      <div className={`${styles.infoAccount} mt-3 d-flex justify-content-around align-items-end`}>
        <div className={styles.btnBack}>
          <Button 
          className={styles.btn_back_step}
          // htmlType="button" 
          // type="primary" 
          onClick={backToForm}>
            <CaretLeftOutlined />
            Quay lại
          </Button>
        </div>
        <div>
          <strong>
            TK của bạn còn:{' '}
            <span className='text-primary'>{formatDiamond(user?.profile?.walletValue)} <img src='/assets/icons/color/diamond.svg' alt='kim cuong' /> </span>
          </strong>
          <br />
          <strong>
            Sử dụng: <span className="text-danger">{sumCoin} <img src='/assets/icons/color/diamond.svg' alt='kim cuong' /></span>
          </strong>
          <div className="hiring_continue mt-3">
            <Button
              htmlType="button"
              type="primary"
              onClick={() => {
                if (!mypackages.length) {
                  message.warning(`Bạn cần chọn ít nhất 1 gói đăng tin siêu tốc`)
                  return
                }
                toggleModalConfirmBuyPackage()
              }}
            >
              Đăng tin siêu tốc
            </Button>
          </div>
        </div>
      </div>

      <ModalPopup
        visible={isBuyMoreModalVisible}
        handleCancelModal={handleCloseModalService}
        title="Mua dịch vụ"
        width={768}
        closeBtn
        isConfirmBtn={false}
        isCancelBtn={false}
      >
        {/* <ServicePromotionUrgent handleCloseModalService={handleCloseModalService} /> */}
        <BuyMoreModal handleCloseModalService={handleCloseModalService} />
      </ModalPopup>

      <ModalPopup
        title="Xác nhận thanh toán"
        visible={isModalVisibleConfirmBuyPackage}
        handleConfirmModal={() => useDebounceFunction(buyAndPayPackage, 300)}
        handleCancelModal={() => toggleModalConfirmBuyPackage()}
      // closeBtn
      // isCancelBtn={false}
      // positionAction="center"
      >
        <div className="content text-center">Bạn có chắc muốn sử dụng các gói đã chọn?</div>
      </ModalPopup>


      {/*= ================== start popup post successfully =================== */}
      <Modal
        wrapClassName="modal-global"
        width={500}
        footer={null}
        title=""
        visible={isModalVisibleNotificationSuccessfully}
        onCancel={() => router.push(routerPathConstant.erPostJob)}
      >
        <div className="modal-body">
          <div className="content text-center">
            <img src='/assets/ER/urgent_apply_successfully.png' alt='urgent success'/>
            <div className='mt-4'>
              <strong>{t(`Chúc mừng bạn đã đăng tin thành công`)}</strong>
            </div>
            <div className="mt-2">
              Hệ thống sẽ gửi thông báo cho bạn
              ngay khi có ứng viên ứng tuyển.
            </div>
            <div className="mt-4">Ấn vào tiếp tục để đi đến Quản lý tin đăng.</div>
          </div>
          <Row className="justify-content-center modal-btn-group">
            <Col span={11}>
              <Button
                className="modal-btn-ok"
                htmlType="submit"
                onClick={() => router.push(routerPathConstant.erJobPost)}
              >
                {t('Tiếp tục')}
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
      {/* =========== end popup post successfully ======================= */}
    </div>
  )
}
