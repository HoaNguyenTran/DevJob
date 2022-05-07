import React, { FC, useState } from 'react'

import { Button, Form, Input, message, Spin } from 'antd'
import { postCheckPhoneApi } from 'api/client/user'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { routerPathConstant } from 'src/constants/routerConstant'
import { firebase } from 'src/utils/firebase'
import { getTokenUser, handleError } from 'src/utils/helper'

import { PhoneOutlined } from '@ant-design/icons'

import { useAppSelector } from 'src/redux'
import styles from './step_one.module.scss'

interface GetCurrentStep {
  getCurrentStep: (step: number, phone: string) => void
}
const StepOne: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const { t } = useTranslation()
  const profile = useAppSelector(state => state.user.profile || {})
  const [phone, setPhone] = useState(`+${profile.phoneNumber}` || "")
  const [loading, setLoading] = useState(false)
  const route = useRouter()

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': response => {
        // console.log(response)
      },
    })
  }

  const firebaseAuth = () => {
    configureCaptcha()
    let codePhone = phone;
    if (phone[0] === "0") {
      codePhone = '+84'.concat(phone.substring(1))
    }
    const appVerifier = window.recaptchaVerifier
    firebase
      .auth()
      .signInWithPhoneNumber(codePhone, appVerifier)
      .then(confirmationResult => {
        message.success('Mã OTP đã được gửi!')
        window.confirmationResult = confirmationResult
        getCurrentStep(1, phone)
      })
      .catch(error => {
        setLoading(false)
        handleError(error)
      })
      .finally(() => {
        window.recaptchaVerifier.reset()
      })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const checkNumber = await postCheckPhoneApi(phone)
      if (checkNumber.status === 201) {
        firebaseAuth()
      }
    } catch (error) {
      setLoading(false)
      handleError(error)
    }
  }

  // console.log("profile.phoneNumber", profile.phoneNumber, phone);


  return (
    <div className={styles.main}>
      <div className="auth-main_title">
        <span>{t('forgotPassword.title')}</span>
      </div>
      <p className={styles.main_des} style={{ marginTop: 10 }}>Vui lòng nhập số điện thoại đăng ký tài khoản để nhận</p>
      <p className={styles.main_des}> mã xác minh cấp lại mật khẩu</p>
      <div className="auth-main_form" style={{ backgroundColor: 'transparent' }}>
        <h4>{t('profile.phoneNumber')}</h4>
        <Form style={{ marginTop: '20px', width: '100%' }} initialValues={{ phone: `+${profile.phoneNumber || "84"}` }}>
          <Form.Item
            name="phone"
            required
            rules={[
              {
                required: true,
                message: t('validation.phoneRequired'),
              },
              {
                pattern: /((^(\+84|84|0|0084){1})(3|5|7|8|9))+([0-9]{8})$/,
                message: t('validation.phonePattern'),
              },
            ]}
          >
            <Input
              onChange={value => setPhone(value.target.value)}
              style={{ borderRadius: '6px' }}
              prefix={<PhoneOutlined style={{ fontSize: '15px', marginRight: '10px' }} />}
              placeholder={t('signin.phonePlaceholder')}
              disabled={!!profile.phoneNumber}
            />
          </Form.Item>
        </Form>
        {
          !getTokenUser() && (
            <div className={styles.main_option}>
              <span className={styles.main_option_text} onClick={() => route.replace(routerPathConstant.signIn)}>
                {t('forgotPassword.backLogin')}
              </span>
              <span className={styles.main_option_text} onClick={() => route.replace(routerPathConstant.signUp)}>
                {t('forgotPassword.newRegister')}
              </span>
            </div>
          )
        }
        <Button
          disabled={phone === '' || phone === null}
          className={styles.main_btn}
          htmlType="submit"
          onClick={() => handleSubmit()}
        >
          {loading ? <Spin /> : t('common.continue')}
        </Button>
        <div id="recaptcha-container" />
      </div>
    </div>
  )
}
export default StepOne
