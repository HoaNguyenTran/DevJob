import { Form, Input, message } from 'antd'
import { getVerifyEmailApi } from 'api/client/user'
import React from 'react'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { handleError } from 'src/utils/helper'
import styles from './VerifyEmail.module.scss'

const index = () => {
  const onFinish = async (val) => {
    try {
      const resData = await getVerifyEmailApi({ email: val.email })
      message.success(resData.data.message)
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className={`verify ${styles.verifyEmail}`}>
    <div className={styles.verifyEmail_wrap}>
        <div className={styles.verifyEmail_modal}>
          <Form
            layout="vertical"
            labelCol={{ span: 8 }}
            // wrapperCol={{ span: 16 }}
            onFinish={onFinish}
          >
            <Form.Item
              label="Nhập email"
              name="email"
              rules={[{ type: 'email', required: true, message: 'Bạn cần phải nhập email' }]}
            >
              <Input />
            </Form.Item>
            <div className="hiring_continue d-flex justify-content-end m-4">
              <button type="submit">
              Gửi email
              </button>
            </div>

          </Form>
      </div>
    </div>
  </div>
)
}
export default index

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: {},
    }
  }
  return { props: {} }
}
