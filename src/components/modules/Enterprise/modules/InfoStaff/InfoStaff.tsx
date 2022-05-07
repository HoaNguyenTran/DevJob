import { Col, Dropdown, message, Row } from 'antd';
import { getMemberCompanyApi, postPermissonUserCompanyApi, postRejectUserCompanyApi } from 'api/client/company';
import React, { useEffect, useState } from 'react'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { UserRole } from 'src/constants/configConstant';
import { useAppSelector } from 'src/redux';
import { handleError } from 'src/utils/helper';
import styles from "./InfoStaff.module.scss"


const InfoStaff = ({ enterpriseId, detailCompany }): JSX.Element => {
  const [tabMember, setTabMember] = useState(1)

  const [pendingMember, setPendingMember] = useState<any>([])
  const [participatedMember, setParticipatedMember] = useState<any>([])

  const [cancelPendingMemberModal, setCancelPendingMemberModal] = useState(false)
  const [infoMember, setInfoMember] = useState<any>({})



  const acceptPendingMember = async (companyId, memberId, userRole) => {
    const data = {
      companyId,
      memberId,
      userRole,
    }
    try {
      await postPermissonUserCompanyApi(data)
      fetchMemberEnterprise()
      message.success('Thành công')
    } catch (error) {
      message.error('Thất bại')
    }
  }


  const handleCancelPendingMember = async () => {
    try {
      await postRejectUserCompanyApi({
        companyId: infoMember.companyId,
        memberId: infoMember.userId
      })
      message.success('Thao tác thành công!')
      fetchMemberEnterprise()
    } catch (error) {
      handleError(error)
    }
  }

  const fetchMemberEnterprise = async () => {
    try {
      const { data } = await getMemberCompanyApi(enterpriseId)
      // console.log(data);

      setPendingMember(data.filter(item => item.userRole === 0))
      setParticipatedMember(data.filter(item => item.userRole !== 0))

    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    fetchMemberEnterprise()
  }, [])


  const menu = (
    <div className={styles.action_btn}>
      <button type="button" onClick={() => setCancelPendingMemberModal(true)
      }>
        Mời ra khỏi doanh nghiệp
      </button>
    </div>
  )

  const renderPendingMember = () => <div>
    <div className={styles.infoStaff_title}>Danh sách nhân sự muốn tham gia vai trò nhân viên tuyển dụng {detailCompany.fullName}</div>
    <div className={styles.infoStaff_main}>
      {pendingMember.map(member => <div key={member.id} className={styles.infoStaff_list}>
        <div className={styles.image}>
          <img src={member.avatar} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{member.userName}</div>
          <div className={styles.phone}>{member.phoneNumber}</div>
        </div>
        <div className={styles.action_pending}>
          <button type="button" onClick={() => acceptPendingMember(member.companyId, member.userId, 2)}>Chấp nhận</button>
          <button type="button" onClick={() => {
            setInfoMember(member)
            setCancelPendingMemberModal(true)
          }}>Từ chối</button>
        </div>
      </div>)}
    </div>
  </div>

  const renderParticipatedMember = () => <div>
    <div className={styles.infoStaff_title}>Danh sách nhân sự đã tham gia vai trò nhân viên tuyển dụng {detailCompany.fullName}</div>
    <div className={styles.infoStaff_main}>
      {participatedMember.map(member => <div key={member.id} className={styles.infoStaff_list}>
        <div className={styles.image}>
          <img src={member.avatar} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{member.userName}</div>
          <div className={styles.phone}>{UserRole[member.userRole]}</div>
        </div>
        <div className={styles.action_participated} onClick={() => setInfoMember(member)}>
          <Dropdown overlay={menu} placement="bottomLeft" >
            <img alt="" src="/assets/icons/default/icon-more.svg" />
          </Dropdown>
        </div>
      </div>)}
    </div>
  </div>

  return (
    <div className={styles.infoStaff}>
      <Row gutter={28}>
        <Col span={6} className={styles.infoStaff_sidebar}>
          <div
            style={{ backgroundColor: tabMember === 1 ? "#E7E7E7" : "#f9f9f9" }}
            onClick={() => setTabMember(1)}
          >Nhân sự chờ duyệt ({pendingMember.length})</div>
          <div
            style={{ backgroundColor: tabMember === 2 ? "#E7E7E7" : "#f9f9f9" }}
            onClick={() => setTabMember(2)}
          >Nhân sự đã tham gia ({participatedMember.length})</div>
        </Col>
        <Col span={18} className={styles.infoStaff_content}>
          {tabMember === 1 ? renderPendingMember() : renderParticipatedMember()}
        </Col>
      </Row>

      <ModalPopup
        title="Xác nhận"
        visible={cancelPendingMemberModal}
        handleConfirmModal={handleCancelPendingMember}
        handleCancelModal={() => setCancelPendingMemberModal(false)}
      >
        <div className={styles.modal_user}>
          <div className={styles.modal_info}>
            <div className={styles.image}>
              <img alt="" src={infoMember.avatar} />
            </div>
            <div>
              <div className={styles.name}>
                {infoMember.userName}
              </div>
              <div className={styles.verifyKyc}>
                {infoMember.verifyKyc ? (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/isVerified.svg" />
                    &nbsp;
                    <span>Tài khoản đã được xác thực</span>
                  </div>
                ) : (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/unVerified.svg" />
                    &nbsp;
                    <span>Tài khoản chưa được xác thực</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.modal_introduction}>
            {/* <div className={styles.title}>Giới thiệu</div> */}
            {/* <div>

            </div> */}
          </div>
        </div>
      </ModalPopup>
    </div>
  )
}

export default InfoStaff