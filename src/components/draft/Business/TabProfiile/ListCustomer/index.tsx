import { ExclamationCircleOutlined, SmallDashOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Image, message, Modal, Row, Spin } from 'antd'
import { getMemberCompanyApi, postPermissonUserCompanyApi, postRejectUserCompanyApi } from 'api/client/company'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './list-customer.module.scss'




enum Role {
  'Quản trị viên',
  'Nhân viên',
}

const ListCustomer: FC<{ dataUsers: CompanyGlobal.CompanyDetail }> = ({ dataUsers }) => {
  const { t } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [userInfo, setUserInfo] = useState<UserGlobal.UserCompany>()
  const [userData, setUserData] = useState<UserGlobal.UserCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState(true)
  const { confirm } = Modal

  const getFirstUserCompany = async () => {
    try {
      const res = await getMemberCompanyApi(dataUsers.id)
      setUserData(res.data)
      setLoading(false)
    } catch (error) {
      message.error(t('Chỉ có quản trị viên mới có quyền truy cập'))
      setLoading(false)
    }
  }

  useEffect(() => {
    getFirstUserCompany()
  }, [])

  const pendingData = userData.filter(item => item.userRole === 0)
  const activeData = userData.filter(item => item.userRole !== 0)

  const showModal = item => {
    setIsModalVisible(true)
    setUserInfo(item)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const cancelPending = async (companyId, memberId) => {
    const data = {
      companyId,
      memberId,
    }
    setLoading(true)
    try {
      setLoading(true)
      await postRejectUserCompanyApi(data)
      message.success('Xóa thành công')
      getFirstUserCompany()
    } catch (error) {
      message.error('Xóa thất bại')
    }
  }

  const acceptPending = async (companyId, memberId, userRole) => {
    const data = {
      companyId,
      memberId,
      userRole,
    }
    try {
      setLoading(true)
      await postPermissonUserCompanyApi(data)
      getFirstUserCompany()
      message.success('Thành công')
    } catch (error) {
      message.error('Thất bại')
    }
  }

  const renderItemsActive = activeData.map(item => (
    <div
      key={item.id}
      className={styles.main_item}
      onClick={() => {
        showModal(item)
        setActiveModal(true)
      }}
    >
      <div className={styles.main_item_block}>
        <Avatar size={50} icon={<Image src={item.avatar} />} />
        <div className={styles.main_text}>
          <span className={styles.main_text_span1}>{item.userName}</span>
          <span className={styles.main_text_span2}>{Role[item.userRole - 1]}</span>
        </div>
      </div>
      <SmallDashOutlined />
    </div>
  ))

  function showCancelConfirm(item) {
    confirm({
      title: 'Xác nhận hủy yêu cầu tham gia công ty',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa người này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      async onOk() {
        try {
          cancelPending(item?.companyId, item?.userId)
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa')
        }
      },
      onCancel() {
        // console.log("");
      },
    })
  }

  const noData = (
    <div className={styles.no_data}>
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Hiện tại không có nhân sự nào trong công ty của bạn
      </p>
    </div>
  )

  const renderData = () => {
    if (!pendingData.length && !activeData.length) {
      return noData
    }
    return (
      <div className={styles.main}>
        {!!pendingData.length && (
          <>
            <h4 style={{ textAlign: 'left' }}>Đang chờ duyệt</h4>
            {renderItemsPending}
          </>
        )}
        {!!activeData.length && (
          <>
            <h4>Đã tham gia</h4>
            {renderItemsActive}
          </>
        )}
        {userInfo && (
          <Modal
            wrapClassName="modal-global"
            width={384}
            footer={null}
            title=""
            visible={isModalVisible}
            onOk={() => handleOk()}
            onCancel={() => handleCancel()}
          >
            <div className="modal-body">
              <div className="modal-title">Thông tin nhân sự</div>

              <div className="content text-center">
                <Avatar size={50} icon={<Image src={userInfo.avatar} />} />
              </div>
              <div className="content text-center" style={{ marginTop: '15px' }}>
                {userInfo.verifyKyc ? (
                  <span
                    style={{
                      color: 'green',
                      fontStyle: 'italic',
                      fontWeight: '300',
                      fontSize: '14px',
                    }}
                  >
                    Tài khoản đã được xác thực
                  </span>
                ) : (
                  <span
                    style={{
                      color: 'red',
                      fontStyle: 'italic',
                      fontWeight: '300',
                      fontSize: '14px',
                    }}
                  >
                    Tài khoản chưa được xác thực
                  </span>
                )}
              </div>
              <div className={styles.modal}>
                <div className={`${styles.modal_title} content text-left`}>Giới thiệu</div>
                <div className={`${styles.modal_key} content text-left`}>
                  {t('profile.fullName')} :{' '}
                  <span className={styles.modal_value}>{userInfo.userName}</span>
                </div>
                <div className={`${styles.modal_key} content text-left`}>
                  {t('profile.birthday')} :{' '}
                  <span className={styles.modal_value}>{userInfo.birthday}</span>
                </div>
              </div>
              <div className={styles.modal}>
                <div className={`${styles.modal_title} content text-left`}>Thông tin liên hệ</div>
                <div className={`${styles.modal_key} content text-left`}>
                  {t('profile.address')} :{' '}
                  <span className={styles.modal_value}>{userInfo.address.address}</span>
                </div>
                <div className={`${styles.modal_key} content text-left`}>
                  Email : <span className={styles.modal_value}>{userInfo.email}</span>
                </div>
                <div className={`${styles.modal_key} content text-left`}>
                  {t('profile.phoneNumber')} :{' '}
                  <span className={styles.modal_value}>{userInfo.phoneNumber}</span>
                </div>
              </div>
              {activeModal && (
                <Row className="justify-content-between modal-btn-group">
                  <Col span={11}>
                    <Button className="modal-btn-cancel" onClick={() => showDeleteConfirm()}>
                      {t('common.remove')}
                    </Button>
                  </Col>
                  {userInfo.userRole === 1 && (
                    <Col span={11}>
                      <Button
                        className="modal-btn-ok"
                        htmlType="submit"
                        // loading={isLoadingConfirmPayment}
                        // onClick={payAvailablePackage}
                        onClick={() => {
                          handleCancel()
                          acceptPending(userInfo.companyId, userInfo.userId, 2)
                        }}
                      >
                        {t('common.adminRemove')}
                      </Button>
                    </Col>
                  )}
                  {userInfo.userRole === 2 && (
                    <Col span={11}>
                      <Button
                        className="modal-btn-ok"
                        htmlType="submit"
                        // loading={isLoadingConfirmPayment}
                        // onClick={payAvailablePackage}
                        onClick={() => {
                          handleCancel()
                          acceptPending(userInfo.companyId, userInfo.userId, 1)
                        }}
                      >
                        {t('common.adminAccept')}
                      </Button>
                    </Col>
                  )}
                </Row>
              )}
            </div>
          </Modal>
        )}
      </div>
    )
  }

  const renderItemsPending = pendingData.map(item => (
    <div key={item.id} className={styles.main_item}>
      <div className={styles.main_item_block}>
        <Avatar size={50} icon={<Image src={item.avatar} />} />
        <div className={styles.main_text}>
          <span className={styles.main_text_span1}>{item.userName}</span>
          <span className={styles.main_text_span2}>{Role[item.userRole - 1]}</span>
        </div>
      </div>
      <div className={styles.main_item_btn}>
        <Button onClick={() => showCancelConfirm(item)} className={styles.main_item_btn_cancel}>
          Xóa
        </Button>

        <Button
          onClick={() => acceptPending(item.companyId, item.userId, 2)}
          className={styles.main_item_btn_accept}
        >
          Duyệt
        </Button>

        <Button
          onClick={() => {
            showModal(item)
            setActiveModal(false)
          }}
          className={styles.main_item_btn_info}
        >
          Xem thông tin
        </Button>
      </div>
    </div>
  ))

  function showDeleteConfirm() {
    confirm({
      title: 'Xác nhận xóa nhân viên',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa nhân viên này này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      async onOk() {
        try {
          handleCancel()
          cancelPending(userInfo?.companyId, userInfo?.userId)
        } catch (error) {
          message.error('Có lỗi xảy ra khi xóa')
        }
      },
      onCancel() {
        // console.log('Không')
      },
    })
  }

  return loading ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
      }}
    >
      <Spin />
    </div>
  ) : renderData()
}
export default ListCustomer
