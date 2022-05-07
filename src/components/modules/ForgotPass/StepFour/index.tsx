import React, { FC } from 'react'

import { Button } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

import { routerPathConstant } from 'src/constants/routerConstant'
import { getTokenUser } from 'src/utils/helper'
import styles from './step-four.module.scss'

const StepFour: FC = () => {
  const { t } = useTranslation()
  const router = useRouter()
  return (
    <div className={styles.main}>
      <Image height={103} width={100} src="/assets/images/icon/icon_reset-password.svg" className={styles.main_image} />
      <h3 className={styles.main_title}>{t('forgotPassword.congratulation')}</h3>
      <p className={styles.main_quote}>Bạn đã thay đổi mật khẩu mới thành công.</p>
      <p className={styles.main_quote}>Hãy đăng nhập để tiếp tục sử dụng dịch vụ.</p>
      <div className={styles.main_btn}>
        {
          getTokenUser() ? (
            <Button
              onClick={() => router.replace("/")}
              className={styles.main_btn_option}
              htmlType="submit"
            >
              Về trang chủ
            </Button>
          ) : (
            <Button
              onClick={() => router.replace(`${routerPathConstant.signIn}`)}
              className={styles.main_btn_option}
              htmlType="submit"
            >
              Đăng nhập ngay
            </Button>
          )
        }

      </div>
    </div>
  )
}
export default StepFour
