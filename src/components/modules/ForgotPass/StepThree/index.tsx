import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Button, Form, Input, Space, Spin } from 'antd'
import { postUpdateInfoSocialApi } from 'api/client/user'
import React, { FC, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { handleError } from 'src/utils/helper'
import styles from './step_three.module.scss'




interface Prop {
  getCurrentStep: (step: number) => void
  fbtoken: string
  phone: string
}
const StepThree: FC<Prop> = ({ fbtoken, phone, getCurrentStep }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const passwordRef = useRef<Input>(null)
  const onFinish = async () => {
    setLoading(true)
    if (!fbtoken) {
      handleError(t('error.notToken'))
    } else {
      passwordRef.current?.focus()
      const data = {
        fbtoken,
        code: '',
        phone,
        password: passwordRef.current?.state.value,
      }
      try {
        await postUpdateInfoSocialApi(data)
        getCurrentStep(3)
      } catch (error) {
        setLoading(false)
        handleError(error)
      }
    }
    setLoading(false)
  }
  return (
    <div style={{ minHeight: 'calc(100vh - 5rem)' }}>
      <div className={styles.header}>
        Đặt lại mật khẩu
      </div>
      <div style={{ marginTop: '10px', textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ fontSize: '14px' }}>{t('forgotPassword.inputNewPassword')}</span>
      </div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Form onFinish={onFinish}>
          <div className={styles.label}>{t('forgotPassword.newPassword')}</div>
          <Form.Item
            required
            rules={[
              {
                required: true,
                message: t('validation.passwordRequired'),
              },
              {
                min: 8,
                message: t('validation.passwordMinlength'),
              },
            ]}
            name="password"
          >
            <Input.Password
              ref={passwordRef}
              placeholder={t('signin.passwordPlaceholder')}
              className={styles.input}
            />
          </Form.Item>
          <div className={styles.label}>{t('forgotPassword.confirmPassword')}</div>

          <Form.Item
            name="repassword"
            required
            validateFirst
            rules={[
              {
                required: true,
                message: t('validation.passwordRequired'),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error(t('validation.confirmPasswordNotmatch')))
                },
              }),
            ]}
          >
            <Input.Password
              className={styles.input}
              placeholder={t('signin.passwordPlaceholder')}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Form.Item className={styles.btn}>
            <Button className={styles.btn_option} htmlType="submit">
              {/* {loading ? <Spin /> : t('common.continue')} */}
              {loading ? <Spin /> : "Hoàn thành" }
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  )
}
export default StepThree
