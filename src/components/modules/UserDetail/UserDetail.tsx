import { Button, message, Modal } from 'antd'
import { postViewDetailEEApi } from 'api/client/service'

import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import ViewCv from 'src/components/draft/CV/CandidateCv/ViewCv/ViewCv'
import { serviceConstant } from 'src/constants/serviceConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { handleError } from 'src/utils/helper'
import ExpectSalary from './components/ExpectSalary/ExpectSalary'
import InfoHeader from './components/InfoHeader/InfoHeader'
import OccupationInterest from './components/OccupationInterest/OccupationInterest'
import PersonalInformation from './components/PersonalInformation/PersonalInformation'
import WorkExperience from './components/WorkExperience/WorkExperience'
import styles from './UserDetail.module.scss'



const UserDetail: FC<any> = ({ userData = {}, fetchUserPreview }) => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const profile = useAppSelector(state => state.user.profile || {})

  const [isShowModalBuyService, setIsShowModalBuyService] = useState(false)
  const [isShowModalUseService, setIsShowModalUseService] = useState(false)
  const buyContactBuyCallService = (profile.userServices || []).find(item => item.serviceCode === serviceConstant.buyContactBuyCall.code)

  const handleClickViewDetail = () => {
    if (profile.userServices?.some(item => item.serviceCode === serviceConstant.buyContactBuyCall.code)) {
      setIsShowModalUseService(true)
    } else setIsShowModalBuyService(true)
  }

  const handleBuyViewDetail = async () => {
    try {
      await postViewDetailEEApi({ targetId: userData.id })
      dispatch(getProfileRequest({ userCode: profile.code }))
      message.success('Mua dịch vụ xem chi tiết ứng viên thành công!')
      router.replace(router.asPath)
    } catch (error) {
      handleError(error)
    } finally {
      setIsShowModalBuyService(false)
    }
  }

  const handleUseViewDetail = async () => {
    try {
      await postViewDetailEEApi({ targetId: userData.id })
      dispatch(getProfileRequest({ userCode: profile.code }))
      router.replace(router.asPath)
      message.success('Sử dụng dịch vụ xem chi tiết ứng viên thành công!')
    } catch (error) {
      handleError(error)
    } finally {
      setIsShowModalUseService(false)
      if (fetchUserPreview) fetchUserPreview()
    }
  }

  return (
    <div className={`portfolio ${styles.candidate}`}>
      <div className={styles.candidate_wrap}>
        <InfoHeader props={{ avatar: userData.avatar, name: userData.name, verifyKyc: userData.verifyKyc }} />

        <PersonalInformation data={userData || {}} />

        {!userData.canviewDetailProfile && (
          <div className={styles.candidate_view}>
            <Button onClick={handleClickViewDetail} className={styles.btn}>
              Xem thông tin chi tiết của ứng viên
            </Button>
          </div>
        )}

        {userData.cvLink && <ViewCv propsData={userData.cvLink} />}
        <OccupationInterest propsData={{ favCats: userData.favCats ?? [] }} />

        <ExpectSalary propsData={{ expectSalaryFrom: userData.expectSalaryFrom, expectSalaryTo: userData.expectSalaryTo }} />
        <WorkExperience />
      </div>

      <Modal
        wrapClassName="modal-global"
        visible={isShowModalBuyService}
        onCancel={() => setIsShowModalBuyService(false)}
        onOk={() => handleBuyViewDetail()}
      >
        Xem thông tin liên hệ sẽ mất 10KC. Bạn có muốn tiếp tục?
      </Modal>


      {/* hear */}
      <Modal
        wrapClassName="modal-global"
        visible={isShowModalUseService}
        onCancel={() => setIsShowModalUseService(false)}
        footer={null}
        closable={false}
      >
        <div className="modal-title">Thông báo</div>
        <div className="modal-content">
          {buyContactBuyCallService && buyContactBuyCallService.quantity > 0 ? (
            <div>
              Bạn còn&nbsp;
              {
                buyContactBuyCallService.quantity
              }
              &nbsp;lượt xem hồ sơ và liên hệ Ứng viên. Bạn có chấp nhận xem hồ sơ của Ứng viên này?
            </div>
          ) : (
            <div>Xem thông tin liên hệ sẽ mất 10KC. Bạn có muốn tiếp tục?</div>
          )}
        </div>

        <div className="modal-action">
          <button
            type="button"
            onClick={() => setIsShowModalUseService(false)}
            className="modal-cancel"
            style={{
              backgroundColor: 'white',
              borderRadius: '6px',
              border: '1px solid rgb(130, 24, 209)',
              padding: '0px 10px',
              color: 'rgb(130, 24, 209)',
            }}
          >
            Huỷ bỏ
          </button>
          <button
            style={{
              backgroundColor: 'rgb(130, 24, 209)',
              borderRadius: '6px',
              border: 'none',
              padding: '0px 10px',
              color: 'white',
            }}
            type="button"
            onClick={handleUseViewDetail}
            className="modal-confirm"
          >
            Đồng ý
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default UserDetail