import React, { FC, useEffect, useState } from 'react'

import { Button, Spin } from 'antd'
import { postSigninApi } from 'api/client/user'
import { differenceInHours } from 'date-fns'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { Base64 } from 'js-base64'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import SocialAuth from 'src/components/elements/SocialAuth'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { useAppDispatch } from 'src/redux'
import { getLogoutRequest, getProfileRequest } from 'src/redux/user'
import { firebase } from 'src/utils/firebase'
import { handleError } from 'src/utils/helper'
import { phoneRegExp } from 'src/utils/patterns'
import { removeCookieCSR, removeLocalStorageWhenLogout, setAccessTokenCookieCSR, setUserRoleCookieCSR } from 'src/utils/storage'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import { PhoneOutlined, UnlockOutlined } from '@ant-design/icons'

import styles from './Signin.module.scss'

const SignInPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deviceId, setDeviceId] = useState<string>()
  const [isEmployee, setIsEmployee] = useState(true);

  const SCREEN = useWindowDimensions()

  const getLoadingAuth = (value: boolean) => {
    setIsLoading(value)
  }

  const { type = roleConstant.EE.name } = router.query

  useEffect(() => {
    if (router.query.type) {
      if (type === roleConstant.ER.name) {
        setIsEmployee(false);
      } else {
        setIsEmployee(true);
      }
    }
  }, [JSON.stringify(router.query)])

  const loginSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .matches(phoneRegExp, '* Số điện thoại không hợp lệ')
      .min(10, '* Số điện thoại không hợp lệ')
      .max(11, '* Số điện thoại không hợp lệ')
      .required('* Số điện thoại là bắt buộc'),
    password: Yup.string().max(50, 'Mật khẩu quá dài').required('* Mật khẩu là bắt buộc'),
  })

  const onSubmit = async values => {
    firebase.analytics().logEvent(firebaseAnalytics.signIn)

    setIsLoading(true)
    const loginRequestData = { deviceId, ...values }
    try {
      const postSigninApiResponse = await postSigninApi(loginRequestData)
      const { data } = postSigninApiResponse.data

      const hoursExpires = differenceInHours(new Date(data.expiredAt), Date.now()) || 48

      localStorage.setItem(storageConstant.localStorage.userCode, data.userCode)
      localStorage.setItem(storageConstant.localStorage.mqttToken, Base64.encode(data.mqttToken))
      localStorage.setItem(storageConstant.localStorage.refreshToken, data.refreshToken)
      localStorage.setItem(storageConstant.localStorage.deviceId, loginRequestData.deviceId)
      localStorage.setItem(storageConstant.localStorage.expiredToken, data.expiredAt)

      setAccessTokenCookieCSR({ accessToken: data.accessToken, hoursExpires })

      setUserRoleCookieCSR({ role: roleConstant.EE.name })

      dispatch(getProfileRequest({ userCode: data.userCode }))

      // redirect page detail if url has query: next=

      if (router.query.next) {
        router.replace(router.query.next.toString())
      } else if (isEmployee) {
        router.replace(routerPathConstant.homepage)
      } else {
        router.replace(routerPathConstant.erDashboard)
      }
    } catch (error) {
      dispatch(getLogoutRequest())
      removeLocalStorageWhenLogout()
      console.error('login: clear information user')
      removeCookieCSR(storageConstant.cookie.accessToken)
      removeCookieCSR(storageConstant.cookie.userRole)

      handleError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setDeviceId(localStorage.getItem(storageConstant.localStorage.deviceId) || uuidv4())
  }, [])

  const calcTranslateX = (width) => {
    if (width >= 516) {
      return 244
    }
    if (width >= 500) {
      return 220
    }
    return width * 220 / 500
  }

  const translateX = SCREEN.width ? calcTranslateX(SCREEN.width) : 244

  const setRole = () => {
    const role = isEmployee ? roleConstant.EE.name : roleConstant.ER.name
    const saveLocal = {
      role,
      status: 0,
      step: 1
    }
    localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
    setUserRoleCookieCSR({ role })
  }

  const onClickSignUp = () => {
    setRole()
    router.push('/signup')
  }

  return (
    <>
      <NextSeo title="Đăng nhập" description="Đăng nhập" />
      <div className={styles.main}>
        <div className={styles.main_img} />
        <div className={styles.main_wrap}>
          <div className={styles.main_wrap_banner} onClick={() => router.push("/")}>
            <img
              src="/assets/images/logo/logo.svg"
              alt="logo" />
            <span>Nền tảng cung cấp việc làm cho thế hệ trẻ</span>
          </div>
          <div className={styles.main_wrap_box}>
            <div className={styles.header}>
              <div className={styles.box_selected} style={{ transform: `translateX(${!isEmployee ? translateX + 5 : 4}px)`, width: `${translateX}px` }} />
              <div className={styles.main_header} onClick={() => setIsEmployee(true)}>
                <span className={styles.title_header}>Bạn là người tìm việc</span>
              </div>
              <div className={styles.main_header} onClick={() => setIsEmployee(false)}>
                <span className={styles.title_header}>Bạn là nhà tuyển dụng</span>
              </div>
            </div>
            <Formik
              initialValues={{
                phoneNumber: '',
                password: '',
              }}
              onSubmit={onSubmit}
              validationSchema={loginSchema}
            >
              {({ errors, touched }) => (
                <Form className={styles.main_wrap_box}>
                  <div className={styles.main_wrap_box_item}>
                    <h4 style={{ fontWeight: "bold" }}>{t('profile.phoneNumber')} <span style={{ color: "red" }}> * </span></h4>
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
                    <h4 style={{ fontWeight: "bold" }}>{t('signin.passwordPlaceholder')} <span style={{ color: "red" }}> * </span></h4>
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
                  <div className={styles.main_wrap_box_option}>
                    <span
                      onClick={() => router.push(routerPathConstant.forgotPass)}
                      className={styles.main_wrap_box_option_text}
                    >
                      {t('signin.forgotPassword')}
                    </span>
                  </div>
                  <Button
                    className={styles.main_wrap_box_btn}
                    htmlType="submit"
                    style={{ backgroundColor: isLoading ? 'white' : 'var(--primary-color)' }}
                  >
                    {isLoading ? <Spin style={{ color: 'white' }} /> : t('header.signin')}
                  </Button>
                </Form>
              )}
            </Formik>
            <div style={{ width: '100%', margin: '15px 0px' }} className="auth-legend">
              <p style={{ margin: '0px', color: '#838383' }}>
                <span style={{ fontSize: 12 }}>{t('hoặc tiếp tục đăng nhập bằng')}</span>
              </p>
            </div>
            <div
              className="form-main"
              style={{ marginTop: '0px', textAlign: 'center', width: '100%' }}
            >
              <SocialAuth getLoadingAuth={getLoadingAuth} role={isEmployee} />
            </div>
            <div className="auth-askaccount2">
              <span>
                {t('signin.haveNoAccount')}&nbsp;<span
                  onClick={onClickSignUp}
                  className={styles.txt_signup}
                >
                  {isEmployee ? "Đăng ký người tìm việc" : "Đăng ký nhà tuyển dụng"}
                </span>
              </span>
            </div>
            <p className={styles.main_wrap_box_option_service}>
              Bằng cách ấn vào nút đăng ký, mặc định bạn đã đồng ý với
              <a href="/terms-of-service"> <span className={styles.main_wrap_box_option_service_text}> Điều khoản dịch vụ </span></a> và
              <a href="/privacy"><span className={styles.main_wrap_box_option_service_text}> Chính sách bảo mật </span></a>
              của Fjob.
            </p>
          </div>
        </div>
      </div>
    </>

  )
}
export default SignInPage

export async function getServerSideProps(ctx) {
  return {
    props: {},
  }
}
