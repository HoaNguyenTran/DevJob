import React, { FC, useEffect, useState } from 'react'

import { Button, message, Modal, Spin } from 'antd'
import { postCheckPhoneApi } from 'api/client/user'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { Base64 } from 'js-base64'
import { useTranslation } from 'react-i18next'
import Link from 'src/components/elements/LinkTo'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { firebase } from 'src/utils/firebase'
import { handleError } from 'src/utils/helper'
import { phoneRegExp } from 'src/utils/patterns'
import * as Yup from 'yup'

import { LoadingOutlined, PhoneOutlined, UnlockOutlined } from '@ant-design/icons'

import styles from './step1.module.scss'

declare global {
  interface Window {
    recaptchaVerifier: any
    confirmationResult: any
  }
}

interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}

// Input phone number and password in this step
const StepOneSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<boolean>(false)
  const [userRole, setUserRole] = useState(roleConstant.EE.name)
  
  useEffect(() => {
    const userRoleRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (userRoleRaw) {
      setUserRole(JSON.parse(userRoleRaw).role)
    }
  }, [])

  const signupSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(phoneRegExp, '* Số điện thoại không hợp lệ')
      .min(10, '* Số điện thoại không hợp lệ')
      .max(11, '* Số điện thoại không hợp lệ')
      .required('* Số điện thoại là bắt buộc'),
    password: Yup.string()
      .min(8, '* Mật khẩu quá ngắn')
      .max(50, 'Mật khẩu quá dài')
      .required('* Mật khẩu là bắt buộc'),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], '* Mật khẩu không trùng nhau')
      .required('* Xác nhận mật khẩu là bắt buộc'),
  })

  const configureCaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': response => {
        // console.log(response)
      },
    })
  }

  const onSubmit = async values => {
    setLoading(true)

    try {
      const res = await postCheckPhoneApi(values.phoneNumber)
      if (res.data) {
        Modal.error({
          title: 'Đăng ký thất bại',
          content: 'Người dùng đã tồn tại',
        })
        handleError('Người dùng đã tồn tại')
      }
      setLoading(false)
    } catch (error) {
      configureCaptcha()
      const appVerifier = window.recaptchaVerifier
      const codePhone = '+84'.concat(values.phoneNumber.substring(1))
      // Auth phone number
      firebase
        .auth()
        .signInWithPhoneNumber(codePhone, appVerifier)
        .then(async confirmationResult => {
          window.confirmationResult = confirmationResult
          message.success('Mã OTP đã được gửi!')
          getCurrentStep(2)
          const userInfo = {
            phoneNumber: values.phoneNumber,
            password: values.password,
          }
          localStorage.setItem(
            storageConstant.localStorage.signupInfo,
            Base64.encode(JSON.stringify(userInfo)),
          )
        })
        .catch(err => {
          // console.log(err)
          message.error('Mã OTP không gửi được!')
        })
        .finally(() => {
          window.recaptchaVerifier.reset()
          setLoading(false)
        })
    }
  }

  return (
    <div className={styles.main_wrap_box}>
      <Formik
        initialValues={{
          phoneNumber: '',
          password: '',
          passwordConfirmation: '',
        }}
        onSubmit={onSubmit}
        validationSchema={signupSchema}
      >
        {({ errors, touched }) => (
          <Form className={styles.main_wrap_box}>
            <div className={styles.main_wrap_box_item}>
              <h4>
                {t('profile.phoneNumber')} <span style={{ color: 'red' }}>*</span>
              </h4>
              <Input
                size="large"
                name="phoneNumber"
                style={{ borderRadius: '6px', width: '100%', padding: '10px' }}
                prefix={<PhoneOutlined style={{ fontSize: '15px', marginRight: '10px' }} />}
                placeholder={t('signin.phonePlaceholder')}
              />
              {errors.phoneNumber && touched.phoneNumber ? (
                <div className={styles.error}>{errors.phoneNumber} </div>
              ) : null}
            </div>
            <div className={styles.main_wrap_box_item}>
              <h4>
                {t('signin.passwordPlaceholder')} <span style={{ color: 'red' }}>*</span>
              </h4>
              <Input.Password
                size="large"
                name="password"
                // onChange={value => setPhone(value.target.value)}
                style={{ borderRadius: '6px', width: '100%', padding: '10px' }}
                prefix={<UnlockOutlined style={{ fontSize: '15px', marginRight: '10px' }} />}
                placeholder={t('signin.passwordPlaceholder')}
                type="password"
              />
              {errors.password && touched.password ? (
                <div className={styles.error}>{errors.password}</div>
              ) : null}
            </div>
            <div className={styles.main_wrap_box_item}>
              <h4>
                {t('Xác nhận mật khẩu')} <span style={{ color: 'red' }}>*</span>
              </h4>
              <Input.Password
                size="large"
                name="passwordConfirmation"
                // onChange={value => setPhone(value.target.value)}
                style={{ borderRadius: '6px', width: '100%', padding: '10px' }}
                prefix={<UnlockOutlined style={{ fontSize: '15px', marginRight: '10px' }} />}
                placeholder={t('Nhập lại mật khẩu')}
                type="password"
              />
              {errors.passwordConfirmation && touched.passwordConfirmation ? (
                <div className={styles.error}>{errors.passwordConfirmation}</div>
              ) : null}
            </div>
            <Button
              className={styles.main_wrap_box_btn}
              htmlType="submit"
              // onClick={() => handleSubmit()}
              disabled={loading}
            >
              {loading ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              ) : (
                t('Đăng ký')
              )}
            </Button>
          </Form>
        )}
      </Formik>

      <div className="auth-askaccount2">
        <span>
          {t('Bạn đã có tài khoản?')} &nbsp;
          <Link href={routerPathConstant.signIn}>{t('Đăng nhập ngay')}</Link>
        </span>
      </div>
      <p className={styles.main_wrap_box_option_service}>
        Bằng cách ấn vào nút đăng ký, mặc định bạn đã đồng ý với{' '}
        <span className={styles.main_wrap_box_option_service_text}>Điều khoản dịch vụ </span> và
        <span className={styles.main_wrap_box_option_service_text}> Chính sách bảo mật</span>
        &nbsp;của Fjob.
      </p>
      <div id="recaptcha-container" />
    </div>
  )
}
export default StepOneSignUp
