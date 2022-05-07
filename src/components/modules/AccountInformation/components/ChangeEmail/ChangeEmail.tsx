import { Form, Input, message } from 'antd';
import { getVerifyEmailApi } from 'api/client/user';
import React, { FC } from 'react'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { handleError } from 'src/utils/helper';

import styles from "./ChangeEmail.module.scss"


interface IProps {
  isChangeEmailModal: boolean
  handleCloseChangeEmailModal: () => void
  handleSetEmail: (val) => void
}

const ChangeEmail: FC<IProps> = ({ isChangeEmailModal, handleCloseChangeEmailModal, handleSetEmail }) => {


  const onFinish = async (val) => {
    try {
      const resData = await getVerifyEmailApi({ email: val.email })
      handleSetEmail(val.email)
      handleCloseChangeEmailModal()
      message.success(resData.data.message)
    } catch (error) {
      handleError(error)
    }
  }


  return (
    <ModalPopup
      visible={isChangeEmailModal}
      handleCancelModal={handleCloseChangeEmailModal}
      title="Thay đổi email"
      width={800}
      isCancelBtn={false}
      isConfirmBtn={false}
      closeBtn
    >
      <div className={`modal_changePhoneNumber ${styles.modal}`}>
        <Form
          layout="vertical"
          labelCol={{ span: 8 }}
          onFinish={onFinish}
        >
          <div className={styles.label}>Nhập email</div>
          <Form.Item
            name="email"
            rules={[{ type: 'email', required: true, message: 'Bạn cần phải nhập email' }]}
          >
            <Input />
          </Form.Item>
          <div className="hiring_continue d-flex justify-content-end m-4">
            <button
              type="submit" className={styles.btn}
            >
              Gửi email
            </button>
          </div>

        </Form>
      </div>
    </ModalPopup>
  )
}

export default ChangeEmail