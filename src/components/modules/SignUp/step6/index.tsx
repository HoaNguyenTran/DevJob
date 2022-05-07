import React, { FC, useEffect, useRef } from 'react'

import { Button, Image } from 'antd'
import router from 'next/router'
import { useTranslation } from 'react-i18next'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'

import styles from './step6.module.scss'

interface ProcessEnum {
  status: number
  step: number
  role: string
  hasCompany: string
}

const StepSixSignUp: FC = () => {
  const { t } = useTranslation()
  const processRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
  const process: ProcessEnum = !processRaw ? undefined : JSON.parse(processRaw)
  const timeout = useRef<any>()

  const handleSubmit = () => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    if (process.role === roleConstant.EE.name) {
      router.replace(routerPathConstant.homepage)
    } else {
      router.replace(routerPathConstant.erDashboard)
    }
    localStorage.removeItem(storageConstant.localStorage.signupProcess)
  }

  useEffect(() => {
    timeout.current = setTimeout(() => {
      handleSubmit()
    }, 5000);
    return (() => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    })
  }, [])

  return (
    <div className={styles.main}>
      <Image src="/assets/icons/color/checked.svg" />
      <div className={styles.main_text}>
        <p className={styles.main_text_congrat}>{t('Chúc mừng')}</p>
        <p className={styles.main_text_quote}>
          Bạn đã đăng ký tài khoản thành công.
          <br />
          Bạn có thể bắt đầu tìm kiếm {process.role === roleConstant.EE.name ? 'công việc' : 'ứng viên'} phù hợp ngay bây giờ.
        </p>
      </div>
      <Button className={styles.btn} htmlType="submit" onClick={() => handleSubmit()}>
        {t('Bắt đầu ngay')}
      </Button>
    </div>
  )
}
export default StepSixSignUp
