import React, { FC, useEffect, useState } from 'react'

import { Button, message, Spin } from 'antd'
import { useTranslation } from 'react-i18next'
import OtpInput from 'react-otp-input'
import { firebase } from 'src/utils/firebase'

import { SyncOutlined } from '@ant-design/icons'

import { configConstant } from 'src/constants/configConstant'
import styles from './step_two.module.scss'

interface Prop {
  getCurrentStep: (step: number, phoneNumber: string, token: string) => void
  phoneNumber: string
}
declare global {
  interface Window {
    recaptchaVerifier: any
    confirmationResult: any
  }
}

const StepTwo: FC<Prop> = ({ getCurrentStep, phoneNumber }) => {
  const { t } = useTranslation()
  const [otp, setOtp] = useState('')
  const [time, setTime] = useState(configConstant.timeOTP)
  const [btnResendOtp, setbtnResendOtp] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (time >= 1) {
      const timer = setTimeout(() => setTime(time - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [time])
  const handleSubmit = () => {
    setLoading(true)
    configureCaptcha()
    window.confirmationResult
      .confirm(otp)
      .then(async result => {
        getCurrentStep(2, phoneNumber, await result.user?.getIdToken())
      })
      .catch(error => {
        setLoading(false)
        message.error('Nhập sai mã OTP. Vui lòng thử lại')
      })
  }
  const configureCaptcha = () => {
    // console.log('configureCaptcha')
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': response => {
        // console.log('Recaptca varified')
        setTime(configConstant.timeOTP)
      },
    })
  }
  const handleResend = () => {
    setbtnResendOtp(true)
    configureCaptcha()
    // console.log('onSignInSubmit')
    const appVerifier = window.recaptchaVerifier
    firebase
      .auth()
      .signInWithPhoneNumber('+84'.concat(phoneNumber), appVerifier)
      .then(async confirmationResult => {
        window.confirmationResult = confirmationResult
        message.success('Mã OTP đã được gửi!')
      })
      .catch(error => {
        message.error('Mã OTP không gửi được!')
      })
      .finally(() => {
        window.recaptchaVerifier.reset()
        setbtnResendOtp(false)
      })
  }
  return (
    <div style={{minHeight: 'calc(100vh - 5rem)'}}>
      <div id="recaptcha-container" />
      <div className="auth-main_title">
        <span>{t('signup.titleOtp')}</span>
      </div>
      <div className="auth-main_des" style={{ marginTop: '10px' }}>
        <p className={styles.quote}>
          {t('forgotPassword.quote_2_1')}
          <span style={{ fontWeight: 'bold', color: "black" }}>{phoneNumber}</span>
        </p>
        <p className={styles.quote}>
          {t('forgotPassword.quote_2_2')}
        </p>

        <div className={styles.otp}>
          <OtpInput
            inputStyle={styles.otp_border}
            onChange={value => setOtp(value)}
            numInputs={6}
            value={otp}
            separator={<span style={{ marginRight: '10px' }} />}
          />
        </div>
        <div className={styles.option}>
          <div className={styles.option_text}>
            {t('forgotPassword.timeRemaining')}
            <span style={{ color: 'red', fontWeight: 'bold' }}>{time}s</span>
          </div>
          <div className={styles.option_text} onClick={handleResend}>
            <SyncOutlined spin={btnResendOtp} style={{ marginRight: '5px', fontSize: '20px' }} />
            {t('forgotPassword.sendAgain')}
          </div>
        </div>
        <Button
          disabled={!time || !otp || otp.length !== 6 || !Number(otp)}
          className={styles.btn}
          htmlType="submit"
          onClick={handleSubmit}
        >
          {/* {loading ? <Spin /> : t('common.continue')} */}
          {loading ? <Spin size="default" /> : t('common.continue')}
        </Button>
      </div>
    </div>
  )
}
export default StepTwo
