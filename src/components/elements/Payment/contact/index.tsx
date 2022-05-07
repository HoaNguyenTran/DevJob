import React, {
  FC,
  useState,
} from 'react'

import {
  Button,
  Form,
  Image,
  Input,
  message,
  Row,
} from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import { postEmailContactBusinessApi } from 'api/client/other'
import { handleError } from 'src/utils/helper'

import { PhoneOutlined } from '@ant-design/icons'

import styles from './contact.module.scss'
import ModalPopup from '../../ModalPopup/ModalPopup'

interface payloadEmailContactBusiness {
  name: string
  phoneNumber: string
  company: string
  details: string
}
const title = "dành cho khách hàng doanh nghiệp"
const subTitle = " Đối với khách hàng cần hỗ trợ vui lòng liên hệ với chúng tôi"

const ContactForm: FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();
  const [modalPopUp, setModalPopUp] = useState<boolean>(false)


  const onFinish = async (values: payloadEmailContactBusiness) => {
    setLoading(true)
    try {
      const { name, phoneNumber, company, details } = values
      const { data } = await postEmailContactBusinessApi({
        name,
        phoneNumber,
        company,
        details
      })
      message.success(data.message)
      setModalPopUp(true)
      setLoading(false)
      form.resetFields()

    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }



  return (
    <div className={styles.wrap}>
      <div className={styles.title}>{title.toUpperCase()}</div>
      <div className={styles.sub_title}>{subTitle}</div>
      <div className={styles.call_box}>
        <div className={styles.border}>
          <PhoneOutlined style={{ fontSize: "25px" }} />
        </div>
        <span className={styles.text}>Hotline: 0969 68 8282</span>

      </div>
      <div className={styles.container}>
        <Image preview={false} src="/assets/images/contact/banner-er.png" alt="" />
        <div className={styles.center_right}>
          <h3 style={{ fontWeight: "bold", marginBottom: "10px" }}>Yêu cầu tư vấn</h3>
          <Form
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Row className={styles.row} >
              <Form.Item
                style={{ width: "48%" }}
                name="name"
                rules={[{ required: true, message: 'Trường họ và tên bắt buộc!' }]}
              >
                <Input style={{ borderRadius: "7px", padding: "8px" }} placeholder="Họ và tên *" />
              </Form.Item>
              <Form.Item
                style={{ width: "48%" }}
                name="phoneNumber"
                rules={[{ required: true, message: 'Trường số điện thoại bắt buộc!' }]}
              >
                <Input style={{ borderRadius: "7px", padding: "8px" }} placeholder="Số điện thoại *" />
              </Form.Item>
            </Row>
            <Form.Item
              name="company"
              rules={[{ required: true, message: 'Trường tên công ty bắt buộc!' }]}
            >
              <Input style={{ borderRadius: "7px", padding: "8px" }} placeholder="Tên công ty *" />
            </Form.Item>
            <Form.Item
              name="details"
              rules={[{ required: true, message: 'Trường nội dung là bắt buộc!' }]}
            >
              <TextArea style={{ borderRadius: "7px", padding: "8px" }} placeholder="Nội dung *" autoSize={{ minRows: 4 }} />
            </Form.Item>
            <Form.Item>
              <Button loading={loading} className={styles.button} type="primary" htmlType="submit">
                Gửi đi
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

      <ModalPopup
        closeBtn
        handleCancelModal={() => setModalPopUp(false)}
        visible={modalPopUp}
        isConfirmBtn={false}
        isCancelBtn={false}
      >
        <div className={styles.modal_wrap}>
          <Image preview={false} src="/assets/images/contact/popup.png" />
          <span className={styles.title}>Chúc mừng</span>
          <span className={styles.content}>Cám ơn bạn đã gửi yêu cầu cho chúng tôi.</span>
          <span className={styles.content}> Đội ngũ tư vấn sẽ liên hệ lại cho bạn trong thời gian sớm nhất.</span>
        </div>
      </ModalPopup>
    </div>
  )
}

export default ContactForm