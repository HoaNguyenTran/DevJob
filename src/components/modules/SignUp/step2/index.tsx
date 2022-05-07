import React, { FC, useEffect, useState } from 'react'

import { Button, message, Spin } from 'antd'
import { postSignUpApi } from 'api/client/user'
import { differenceInHours } from 'date-fns'
import { Base64 } from 'js-base64'
import { useTranslation } from 'react-i18next'
import OtpInput from 'react-otp-input'
import { configConstant } from 'src/constants/configConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { firebase } from 'src/utils/firebase'
import { v4 as uuidv4 } from 'uuid'

import { LoadingOutlined, SyncOutlined } from '@ant-design/icons'

import { setAccessTokenCookieCSR } from 'src/utils/storage'
import defaultConstant from 'src/constants/defaultConstant'
import { roleConstant } from 'src/constants/roleConstant'
import styles from './step2.module.scss'

interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}
// Validate Phone number with otp in this step
const StepTwoSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const { t } = useTranslation()
  const [otp, setOtp] = useState('')
  const [btnResendOtp, setbtnResendOtp] = useState(false)
  const [timeRemain, setTimeRemain] = useState(configConstant.timeOTP)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const dispatch = useAppDispatch()
  const [userRole, setUserRole] = useState(roleConstant.EE.name)

  useEffect(() => {
    const userRoleRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (userRoleRaw) {
      setUserRole(JSON.parse(userRoleRaw).role)
    }
  }, [])

  const ftemp = localStorage.getItem(storageConstant.localStorage.signupInfo)

  const userInfo: { phoneNumber: string; password: string } = ftemp
    ? JSON.parse(Base64.decode(ftemp))
    : { phoneNumber: '', password: '' }

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': response => {
        setTimeRemain(configConstant.timeOTP)
      },
    })
  }

  useEffect(() => {
    if (timeRemain === 0) {
      // setTimeRemain(-1)
      return message.info('Mã OTP đã hết hạn!')
    }
    if (timeRemain >= 1) {
      const timer = setTimeout(() => setTimeRemain(timeRemain - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeRemain])

  const saveInfo = async (fbtoken: string, uid: string) => {
    const deviceId: string = localStorage.getItem(storageConstant.localStorage.deviceId) || uuidv4()
    const signUpData: Auth.SignupDataPayload = {
      fbtoken,
      name: 'Người dùng Fjob',
      email: "",
      id: uid,
      avatarUrl: defaultConstant.defaultAvatarUser,
      deviceId,
      phone: userInfo.phoneNumber,
      password: userInfo.password,
    }
    try {
      // create new account when auth success
      const { data } = await postSignUpApi(signUpData)
      // const encodedAccessToken = Base64.encode(data.data.accessToken)

      // save step in localstorage (f_process)
      const saveLocal = {
        status: 0,
        step: 4,
        role: userRole,
        code: data.data.user.code
      }
      const hoursExpires = differenceInHours(new Date(data.data.expiredAt), Date.now())
      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
      localStorage.setItem(storageConstant.localStorage.userCode, data.data.user.code)
      localStorage.setItem(storageConstant.localStorage.expiredToken, data.expiredAt)

      setAccessTokenCookieCSR({ accessToken: data.data.accessToken, hoursExpires })

      getCurrentStep(4)
      setLoading(false)
      dispatch(getProfileRequest({ userCode: data.data.user.code }))
    } catch (e) {
      message.error('Đăng ký thất bại!')
      setLoading(false)
    }
  }

  const handleResend = () => {
    setError(false)
    configureCaptcha()
    const appVerifier = window.recaptchaVerifier
    //  const codePhone = '+84'.concat(form.getFieldValue('phone').substring(1))
    setbtnResendOtp(true)
    const phoneNumber = '+84'.concat(userInfo.phoneNumber.substring(1))

    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, appVerifier)
      .then(async confirmationResult => {
        window.confirmationResult = confirmationResult
        message.success('Mã OTP đã được gửi!')
        // const resOTP = await getOTPApi(phoneNumber)
        //  setFormData({ ...form.getFieldsValue(), otp: resOTP.data.data.otp })
        setTimeRemain(configConstant.timeOTP)
      })
      .catch(e => {
        message.error('Mã OTP không gửi được!')
      })
      .finally(() => {
        window.recaptchaVerifier.reset()
        setbtnResendOtp(false)
        // setDisableIpt(false)
      })
  }

  const handleSubmit = () => {
    setLoading(true)
    configureCaptcha()
    window.confirmationResult
      .confirm(otp)
      .then(async result => {
        const fbtoken = await result.user?.getIdToken()
        if (fbtoken && result.user?.uid) {
          await saveInfo(fbtoken, result.user?.uid)
        }
      })
      .catch(e => {
        setLoading(false)
        setError(true)
      })
  }

  return (
    <>
      <div id="recaptcha-container" />
      <div className="auth-main_title">
        <span>{t('signup.titleOtp')}</span>
      </div>
      <div className='my-4'>
        {
          error ? (
            <>
              <p className={styles.quote_error}>
                Mã xác minh không chính xác.
              </p>
              <p className={styles.quote_error}>Vui lòng kiếm tra lại hoặc yêu cầu gửi lại mã xác minh.</p>
            </>
          ) : (
            <>
              <p className={styles.quote}>
                {t('forgotPassword.quote_2_1')}
                <span style={{ fontWeight: 'bold', color: "black" }}>{userInfo.phoneNumber}</span>
              </p>
              <p className={styles.quote}>{t('forgotPassword.quote_2_2')}</p>
            </>
          )
        }

        <div className={styles.otp}>
          <OtpInput
            inputStyle={styles.otp_border}
            onChange={value => setOtp(value)}
            numInputs={6}
            value={otp}
            separator={<span style={{ margin: '0px 5px' }} />}
          />
        </div>
        <div className={styles.option}>
          <div className={styles.option_text}>
            {t('forgotPassword.timeRemaining')}
            <span style={{ color: 'red', fontWeight: 'bold' }}>{timeRemain}s</span>
          </div>
          <div className={styles.option_text} onClick={handleResend}>
            <SyncOutlined spin={btnResendOtp} style={{ marginRight: '5px', fontSize: '20px' }} />
            {t('forgotPassword.sendAgain')}
          </div>
        </div>
        <Button
          disabled={!timeRemain || !otp || otp.length !== 6 || !Number(otp) || loading}
          className={styles.btn}
          htmlType="submit"
          onClick={handleSubmit}
        >
          {/* {loading ? <Spin /> : t('common.continue')} */}
          {loading ? (
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          ) : (
            t('common.continue')
          )}
        </Button>
      </div>
    </>
  )
}
export default StepTwoSignUp