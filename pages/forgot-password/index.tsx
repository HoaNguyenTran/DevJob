import React, {
  FC,
  useState,
} from 'react'

import { Image } from 'antd'
import StepFour from 'src/components/modules/ForgotPass/StepFour'
import StepOne from 'src/components/modules/ForgotPass/StepOne'
import StepThree from 'src/components/modules/ForgotPass/StepThree'
import StepTwo from 'src/components/modules/ForgotPass/StepTwo'

import { useAppSelector } from 'src/redux'
import styles from './forgotpass.module.scss'

const ForgotPassword: FC = () => {
  const profile = useAppSelector(state => state.user.profile || {})
  const [currentStep, setCurrentStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber)
  const [accessToken, setAccessToken] = useState('')

  const getCurrentStep = (step, phone?: string, token?: string) => {
    setCurrentStep(step)
    if (phone) setPhoneNumber(phone)
    if (token) setAccessToken(token)
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_img} />
      <div className={styles.main_wrap}>
        <div className={styles.main_wrap_banner}>
          <Image height={97} width={190.4} src="/assets/images/logo/logo.svg" alt="logo" />
          <span>Nền tảng cung cấp việc làm cho thế hệ trẻ</span>
        </div>
        <div className={styles.main_wrap_box}>
          <div className={styles.main_wrap_item}>
            {currentStep === 0 && <StepOne getCurrentStep={getCurrentStep} />}
            {currentStep === 1 && (
              <StepTwo getCurrentStep={getCurrentStep} phoneNumber={phoneNumber} />
            )}
            {currentStep === 2 && (
              <StepThree
                fbtoken={accessToken}
                phone={phoneNumber}
                getCurrentStep={getCurrentStep}
              />
            )}
            {currentStep === 3 && <StepFour />}
          </div>
        </div>
      </div>
    </div>
  )
}
export default ForgotPassword

export async function getServerSideProps(ctx) {
  return { props: {} }
}
