import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { Divider, Form, Input, message } from 'antd'
import { changePasswordApi } from 'api/client/user'
import React, { useState } from 'react'
import { useAppSelector } from 'src/redux'
import { getTokenUser, handleError } from 'src/utils/helper'
import ModalPopup from '../../ModalPopup/ModalPopup'

interface IProps {
  callbackCloseModalApp(): void
}

export default function ModalChangePass({ callbackCloseModalApp }: IProps): JSX.Element {
  const [isSuggestAppModal, setIsSuggestAppModal] = useState(true)
  const [form] = Form.useForm();
  const profile = useAppSelector(state => state.user.profile || {})
  const token = getTokenUser()

  const submitForm = () => {
    form.submit()
    form
      .validateFields()
      .then(() => {
        changePassword()
      })
      .catch(() => {
        message.warning('Bạn cần phải điền đầy đủ thông tin!')
      })
  }

  const changePassword = async () => {
    try {
      const data = {
        accessToken: token,
        oldPassword: form.getFieldValue('password'),
        newPassword: form.getFieldValue('newPassword'),
        confirmPassword: form.getFieldValue('confirmPassword')
      }
      const result = await changePasswordApi(data, profile.code)
      // console.log("result", result);
      message.success("Thay đổi mật khẩu thành công")
      callbackCloseModalApp()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <ModalPopup
      positionAction="center"
      isCancelBtn
      textConfirm="Lưu"
      textCancel="Huỷ"
      transition='move-up'
      visible={isSuggestAppModal}
      handleCancelModal={() => {
        setIsSuggestAppModal(!isSuggestAppModal)
        callbackCloseModalApp()
      }}
      handleConfirmModal={submitForm}
    >
      <div>
        <div style={{ fontWeight: 'bold', fontSize: 18, color: '#6E00C2' }}>
          Thay đổi mật khẩu đăng nhập
        </div>
        <Form
          form={form}
          layout="vertical"
        >
          <div style={{ padding: '10px 0', fontWeight: 'bold' }}>
            Mật khẩu hiện tại
            <span style={{ color: 'red' }}> *</span>
          </div>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng điền mật khẩu hiện tại!' }]}
          >
            <Input.Password
              placeholder=""
              style={{ borderRadius: 7, height: 44 }}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <Divider />
          <div style={{ padding: '10px 0', fontWeight: 'bold' }}>
            Nhập mật khẩu mới
            <span style={{ color: 'red' }}> *</span>
          </div>
          <Form.Item
            name="newPassword"
            rules={[{
              required: true,
              message: 'Mật khẩu cần ít nhất 8 ký tự!',
              min: 8
            }]}
          >
            <Input.Password
              placeholder="Mật khẩu cần ít nhất 8 ký tự"
              style={{ borderRadius: 7, height: 44 }}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
          <div style={{ padding: '10px 0', fontWeight: 'bold' }}>
            Nhập lại mật khẩu mới
            <span style={{ color: 'red' }}> *</span>
          </div>
          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Mật khẩu cần ít nhất 8 ký tự!',
                min: 8
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu mới không trùng khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Mật khẩu cần ít nhất 8 ký tự"
              style={{ borderRadius: 7, height: 44 }}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            />
          </Form.Item>
        </Form>
      </div>
    </ModalPopup>
  )
}
