import { CaretLeftOutlined, CaretRightOutlined, CheckOutlined, CloseOutlined, DownloadOutlined } from '@ant-design/icons'
import { Button, DatePicker, Form, message, Switch, Row, Col } from 'antd'
import { getUnixTime, startOfToday } from 'date-fns'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { configConstant } from 'src/constants/configConstant'
import jobConstant from 'src/constants/jobConstant'
import { statusPostConstants } from 'src/constants/statusConstant'
import styles from './PostTime.module.scss'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

interface IProps {
  form: any
  valueForm: JobGlobal.JobValueForm
  handleChangeStep(step: number): void
  handlePostJob({ statusPost, data }): void
}

const PostTime: FC<IProps> = ({ form, valueForm, handleChangeStep, handlePostJob }) => {
  const router = useRouter();

  const disabledDatePost = current => current && new Date(current) < startOfToday()
  const disabledDateDeadline = current =>
    current && current < (form.getFieldValue('timePostJob') || startOfToday())
  const isUpdating = router.query?.isUpdating;

  const handleSaveDraft = () => {
    form.submit()
    form
      .validateFields()
      .then(async () => {
        // await handleChangeValueForm({
        //   startTime: getUnixTime(new Date(form.getFieldValue('timePostJob'))),
        //   canApplyDate: getUnixTime(new Date(form.getFieldValue('deadlineSubmit'))),
        //   useServices: [],
        // })
        handlePostJob({
          statusPost: statusPostConstants.Draft,
          data: {
            useServices: [],
            startTime: getUnixTime(new Date(form.getFieldValue('timePostJob'))),
            canApplyDate: getUnixTime(new Date(form.getFieldValue('deadlineSubmit'))),
          },
        })
      })
      .catch(() => message.warning('Vui lòng điền đầy đủ thông tin'))
  }
 
  return (
    <Form {...formItemLayout} form={form} initialValues={valueForm} scrollToFirstError>
        <div className={styles.section_form_hiring}>
          <div className={styles.header}>
              Thiết lập tin đăng
          </div>
          <div className={styles.content_wrap}>
            <Row className='justify-content-between'>
              <Col xs={24} md={11}>

                <div className={styles.title}>
                  Chọn thời gian đăng tin<span className={styles.textRequired}>*</span>
                </div>

                <div className={styles.postTime_jobType}>
                  <Form.Item
                    className="hirring_postTime"
                    name="timePostJob"
                    rules={[
                      {
                        required: true,
                        message: 'Thời gian đăng tin không được để trống!',
                      },
                    ]}
                  >
                    <DatePicker
                      showTime={{
                        showSecond: false
                      }}
                      placeholder="Ngày đăng tin"
                      disabledDate={disabledDatePost}
                      format={configConstant.displayTime.DDMMYYYHHmm}
                      className="w-100"
                    />
                  </Form.Item>

                </div>
              </Col>
              <Col xs={24} md={11}>

                <div className={styles.title}>
                  Hạn nộp hồ sơ<span className={styles.textRequired}>*</span>
                </div>
                <Form.Item
                  name="deadlineSubmit"
                  rules={[
                    {
                      required: true,
                      message: 'Hạn nộp hồ sơ không được để trống!',
                    },
                  ]}
                >
                  <DatePicker
                    className='w-100'
                    placeholder="Hạn nộp hồ sơ"
                    disabledDate={disabledDateDeadline}
                    format={configConstant.displayTime.DDMMYYY}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <div className={styles.content_wrap}>
            <div className={styles.title}>
              Tùy chọn liên hệ
            </div>
            <Row className='justify-content-between mb-4'>
              <Col xs={24} md={11} className={`d-flex justify-content-between align-items-center ${styles.item_contact}` }>
                <div> Cho phép ứng viên gọi điện </div>
                <Form.Item name="canCall" valuePropName="checked" className='mb-0'>
                  <Switch className='mb-0' />
                </Form.Item>
              </Col>
              <Col xs={24} md={11} className={`d-flex justify-content-between align-items-center ${styles.item_contact}`}>
                <div> Cho phép ứng viên nhắn tin </div>
                <Form.Item name="canMessage" valuePropName="checked" className='mb-0'>
                  <Switch
                    className='mb-0'
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className={`${styles.postTime_draft  } mr-auto mb-4 d-flex justify-content-end`}>
              {
                !isUpdating &&
                <button
                  type="button"
                  onClick={() => {
                    handleSaveDraft()
                  }}
                  className="d-flex align-items-center"
                  
                >
                  <DownloadOutlined size={18} />
                  Lưu thành tin nháp
                 
                </button>
              }
            </div>
            
         </div> 
        </div>
     
      <div className="hiring_continue d-flex justify-content-center my-4">
        <Button
          type="text"
          onClick={() => {
            handleChangeStep(jobConstant.stepPost.step1)
          }}
          className={`${styles.btn_back_step  } mr-4`}
        >
          <CaretLeftOutlined />
          Quay lại
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            handleChangeStep(jobConstant.stepPost.step3)
          }}
        >
          Tiếp tục
          <CaretRightOutlined />
        </Button>
      </div>
    </Form>
  )
}

export default PostTime
