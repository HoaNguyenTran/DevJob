import React from 'react'

import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
} from 'antd'
import { postEmailContactApi } from 'api/client/other'
import { NextSeo } from 'next-seo'
// import ReCAPTCHA from "react-google-recaptcha"
import { emailConfig } from 'src/constants/configConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'

import {
  HomeOutlined,
  PhoneFilled,
} from '@ant-design/icons'

import styles from './Contact.module.scss'

const { TextArea } = Input;

const Contact = (): JSX.Element => {
  // const reRef = useRef<ReCAPTCHA>()

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const { data } = await postEmailContactApi({
        email: values.email,
        subject: emailConfig.subject,
        html: `<p><b>Tên</b>: ${values.username}</p><p><b>SĐT</b>: ${values.phoneNumber}</p><p><b>email</b>: ${values.email}</p><p><b>Nội dung</b>: ${values.content}</p>`
      })

      await postEmailContactApi({
        email: emailConfig.emailSupport,
        subject: emailConfig.subject,
        html: `<p><b>Tên</b>: ${values.username}</p><p><b>SĐT</b>: ${values.phoneNumber}</p><p><b>email</b>: ${values.email}</p><p><b>Nội dung</b>: ${values.content}</p>`
      })
      form.resetFields();
      message.success(data.message)
    } catch (error) {
      message.error("Gửi email thất bại!")
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div className={`contact ${styles.contact}`}>
      <NextSeo title="Liên hệ" description="Liên hệ" />
      <div className={styles.contact_wrap}>
        <div className={styles.banner}>
          <img src="/assets/images/contact/banner.png" alt="" />
        </div>
        <div className={styles.breadcrumb}>
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <HomeOutlined />
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/contact">Liên hệ</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Row className={styles.main}>
          <Col sm={24} md={12} className={styles.information}>
            <div className={styles.inner}>
              <div className={styles.title}>Thông tin liên hệ</div>
              <div className={styles.info}>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/icon/phone.svg" />
                  <div className={styles.description}>
                    <a href="tel:1900 98 98 26">1900 98 98 26</a>
                  </div>
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/icon/mail.svg" />
                  <div className={styles.description}>
                    <a href="mailto:fjob.support@zetagroup.vn">fjob.support@zetagroup.vn</a>
                  </div>
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/icon/address.svg" />
                  <div className={styles.description}>
                    Tầng 7, 188 Trường Chinh, Đống Đa, Hà Nội
                  </div>
                </div>
              </div>
              <div className={styles.image}>
                <img src="/assets/images/contact/information.png" alt="" />
              </div>
            </div>
          </Col>
          <Col sm={24} md={12} className={styles.help}>
            <div className={styles.inner}>
              <div className={styles.title}>Gửi yêu cầu hỗ trợ</div>
              <div>
                <Form
                  form={form}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Form.Item
                    label="Họ và tên"
                    name="username"
                    rules={[{ required: true, message: 'Trường họ và tên bắt buộc!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phoneNumber"
                    rules={[{ required: true, message: 'Trường số điện thoại bắt buộc!' }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Trường email là bắt buộc!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <div className="contact_desc">
                    <Form.Item
                      label="Nội dung cần hỗ trợ"
                      name="content"
                      rules={[{ required: true, message: 'Trường nội dung là bắt buộc!' }]}
                    >
                      <TextArea autoSize={{ minRows: 4 }} />
                    </Form.Item>
                  </div>
                  {/* <ReCAPTCHA sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} size="invisible" ref={reRef} /> */}
                  <Form.Item wrapperCol={{ offset: 16, span: 16 }}>
                    <Button className={styles.button} type="primary" htmlType="submit">
                      {/* Tính năng đang phát triển */}
                      Gửi đi
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
        <div className={styles.hotline}>
          <div className={styles.inner}>
            <div className={styles.header}>hotline tư vấn dành cho nhà tuyển dụng</div>
            <Row className={styles.main}>
              <Col sm={24} md={12} className={styles.advise}>
                <div className={styles.title}>
                  Hotline tư vấn tuyển dụng
                </div>
                <div className={styles.value}>
                  <PhoneFilled style={{ color: "var(--secondary-color)", marginTop: ".125rem" }} />
                  <div>1900 98 98 26</div>
                  <div> - Nguyễn Hương Ly</div>
                </div>
              </Col>
              <Col sm={24} md={12} className={styles.complain}>
                <div className={styles.title}>
                  CSKH & khiếu nại dịch vụ
                </div>
                <div className={styles.value}>
                  <PhoneFilled style={{ color: "var(--secondary-color)", marginTop: ".125rem" }} />
                  <div>1900 98 98 26</div>
                  <div> - Phùng Thuỳ Dương</div>
                </div>
              </Col>
            </Row>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact


export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies[storageConstant.cookie.userRole]) setUserRoleCookieSSR({ ctx, role: roleConstant.EE.key })
  return { props: {} }
}
