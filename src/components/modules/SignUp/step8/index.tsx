import React, { FC, useEffect, useState } from 'react'

import { Button } from 'antd'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'

import { useAppSelector } from 'src/redux'
import styles from './step8.module.scss'

interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}

const StepSevenSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const [userRole, setUserRole] = useState(roleConstant.EE.name)

  useEffect(() => {
    const userRoleRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (userRoleRaw) {
      setUserRole(JSON.parse(userRoleRaw).role)
    }
  }, [])

  const { profile } = useAppSelector(state => state.user)

  const createCompany = () => {
    const saveLocal = {
      status: 0,
      step: 7,
      role: userRole,
      code: profile.code
    }
    localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
    getCurrentStep(7)
  }

  const joinCompany = () => {
    const saveLocal = {
      status: 0,
      step: 9,
      role: userRole,
      code: profile.code
    }
    localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
    getCurrentStep(9)
  }

  const btnContinue = () => {
    const saveLocal = {
      status: 1,
      step: 6,
      role: userRole,
      code: profile.code
    }
    localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
    getCurrentStep(6)
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_text}>
        <p className={styles.text_role}>{userRole === roleConstant.EE.name ? "Vai trò ứng viên" : "Vai trò tuyển dụng"}</p>
      </div>
      <div className={styles.company}>
        <div className={styles.action} onClick={createCompany}>
          <p className={styles.text_action} >Doanh nghiệp của tôi</p>
        </div>
        <div className={styles.action} onClick={joinCompany}>
          <p className={styles.text_action} >Tham gia doanh nghiệp</p>
        </div>
      </div>
      <div className={styles.text}>
        {`Để cập nhật thông tin doanh nghiệp, chọn "Doanh nghiệp của tôi".`}
      </div>
      <div className={styles.text}>
        {`Để tham gia vào doanh nghiệp có sẵn trên hệ thống, chọn "Tham gia doanh nghiệp" và tìm kiếm doanh nghiệp muốn tham gia.`}
      </div>
      <Button className={styles.btn} htmlType="submit" onClick={btnContinue}>
        Tiếp tục với tư cách tuyển dụng cá nhân
      </Button>
    </div >
  )
}

export default StepSevenSignUp
