/* eslint-disable no-sequences */
import React, { FC, useEffect, useMemo, useState } from 'react'
import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd'
import {
  deleteUserEducationApi,
  getAllDataSchoolApi,
  updateUserEducationApi,
  patchUserInfomationApi
} from 'api/client/user'
import { format, getUnixTime } from 'date-fns'
import moment from 'moment'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { filterSelectOption, handleError } from 'src/utils/helper'
import debounce from "lodash.debounce"
import styles from './academic.module.scss'


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

const Academic: FC = () => {
  const { FjobEducationLevel: educationList = [] } = useAppSelector(state => state.initData.data)
  const profile = useAppSelector(state => state.user.profile || {})
  const [isModal, setIsModal] = useState(false)
  const [school, setSchool] = useState<any[]>([])

  const [form]: any = Form.useForm()
  const dispatch = useAppDispatch()
  const { code, educations, academicId } = profile
  const [visible, setVisible] = React.useState(false)
  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [currentId, setCurrentId] = useState<number>()




  const handleOk = async () => {
    setConfirmLoading(true)
    try {
      await deleteUserEducationApi(currentId)
      dispatch(getProfileRequest({ userCode: code }))
      message.success('Xóa thành công')
      setVisible(false)
      setConfirmLoading(false)
    } catch (error) {
      handleError(error)
      setVisible(false)
      setConfirmLoading(false)
    }
  }


  const getAllSchool = async () => {
    const result = await getAllDataSchoolApi()
    if (result.data) {
      setSchool(result.data)
    }
  }

  useEffect(() => {
    getAllSchool()
  }, [])

  const noData = (
    <div className={styles.no_data}>
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Giúp bạn tiến gần hơn với công việc mơ ước, giúp nhà tuyển dụng đánh giá khả năng của bạn
        tốt hơn.
      </p>
    </div>
  )

  const renderItem = educations?.map(item => {
    const timeStart = format(new Date(item.startDate * 1000), 'dd/MM/yyyy')
    const timeEnd = item.endDate ? format(new Date(item.endDate * 1000), 'dd/MM/yyyy') : null

    return (
      <div key={item.id} className={styles.academic_wrap}>
        <div className={styles.main}>
          <div style={{ width: '100%' }}>
            <div className={styles.info}>
              <div className={styles.academic_text}>
                <p className={styles.academic_text_title}>Trường: {item.name}</p>
                <p className={styles.academic_text_score}>Ngành học: {item.major}</p>
              </div>
              <div className={styles.academic_text}>
                {!!item.grade && <p className={styles.academic_text_score}>Điểm học tập (GPA) : {item.grade}</p>}
                {item.degree && <p>Bằng cấp: {item.degree}</p>}
              </div>
            </div>
            <div className={styles.sub}>
              <p>{timeStart} - {timeEnd || 'nay'}</p>
              {item.otherDesc && <p>Ghi chú: {item.otherDesc}</p>}
            </div>
          </div>
        </div>

        <div className={styles.option}>
          <EditOutlined
            onClick={() => {
              setValueToForm(item)
            }}
            style={{ fontSize: '20px', cursor: 'pointer', color: '#b5b5b5', margin: '10px 0' }}
          />
          <DeleteOutlined
            onClick={() => {
              setCurrentId(item.id)
              setVisible(true)
            }}
            style={{ fontSize: '20px', cursor: 'pointer', color: '#b5b5b5' }}
          />
        </div>

      </div>
    )
  })

  const setValueToForm = item => {
    form.setFieldsValue({ 'id': item.id })
    form.setFieldsValue({ 'schoolId': item.schoolId })
    form.setFieldsValue({ 'grade': item.grade || null })
    form.setFieldsValue({ 'startDate': moment(item.startDate * 1000) })
    form.setFieldsValue({ 'endDate': item.endDate ? moment(item.endDate * 1000) : null })
    form.setFieldsValue({ 'degree': item.degree })
    form.setFieldsValue({ 'major': item.major })
    form.setFieldsValue({ 'otherDesc': item.otherDesc })

    setIsModal(true)
  }

  const handlerOkModal = async () => {
    try {
      const { id, schoolId, grade, startDate, endDate, degree, major, otherDesc } = form.getFieldsValue()
      const formData: any = { userId: profile.id }

      if (id) formData.id = id
      if (schoolId) formData.schoolId = schoolId
      if (grade) formData.grade = Number(grade)
      if (startDate) formData.startDate = getUnixTime(new Date(form.getFieldValue('startDate')))
      if (endDate) formData.endDate = getUnixTime(new Date(form.getFieldValue('endDate')))
      if (degree) formData.degree = degree
      if (major) formData.major = major
      if (otherDesc) formData.otherDesc = otherDesc

      // const formData = {
      //   ...form.getFieldsValue(),

      //   userId: user.id,
      //   certificateImg,
      //   startDate: getUnixTime(new Date(form.getFieldValue('startDate'))),
      //   endDate: getUnixTime(new Date(form.getFieldValue('endDate'))),
      //   // grade: parseFloat(form.getFieldsValue().grade),
      // }

      if (!formData.id) {
        delete formData.id
      }

      if (!formData.endDate) {
        delete formData.endDate
      }

      if (!formData.grade) {
        delete formData.grade
      }

      if (!formData.degree) {
        delete formData.degree
      }

      if (!formData.otherDesc) {
        delete formData.otherDesc
      }

      await updateUserEducationApi(formData)
      getAllSchool()
      dispatch(getProfileRequest({ userCode: code }))

      if (!formData.id) {
        message.success('Thêm mới thành công')
      } else {
        message.success('Cập nhật thành công')
      }
    } catch (error) {
      handleError(error)
    }
    setIsModal(false)
  }

  const debouncedEventHandler = useMemo(
    () => debounce(handlerOkModal, 300)
    , []);


  const handleChangeSelectAcademicId = async (val) => {
    try {
      await patchUserInfomationApi({ academicId: Number(val) }, profile.code)
      message.success("Trình độ học vấn thêm mới thành công")
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className={styles.academic}>
      <div className={styles.row}>
        <h3 className={styles.title}>Học vấn</h3>
        <div
          className={styles.add}
          onClick={() => {
            setIsModal(true)
            form.resetFields()
          }}
        >
          <PlusOutlined style={{ marginRight: '10px' }} /> Thêm học vấn
        </div>
      </div>
      <div className={styles.header}>
        <div className={styles.title}>Trình độ học vấn<span> (*)</span></div>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          filterOption={filterSelectOption}
          placeholder="Trình độ học vấn"
          defaultValue={academicId}
          onChange={handleChangeSelectAcademicId}
        >
          {educationList.map(education => {
            if (education.id === 1) return <Select.Option key={education.id} value={education.id}>Chưa tốt nghiệp THPT</Select.Option>
            return <Select.Option key={education.id} value={education.id}>{education.name}</Select.Option>
          }
          )}
        </Select>
      </div>

      <div className={styles.content}>{educations?.length === 0 ? noData : renderItem}</div>

      <Modal
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
        cancelText="Hủy"
        okText="Xóa"
        wrapClassName="modal-global"
      >
        <div className="modal-title">Bạn muốn xoá học vấn?</div>
      </Modal>
      <Modal
        destroyOnClose
        wrapClassName="modal-global portfolio"
        visible={isModal}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setIsModal(false)}
        width={800}
        cancelText="Hủy"
        okText="Hoàn thành"
      >
        <div className="modal-body">
          <div className="modal-title">Học vấn</div>
          <Form
            {...formItemLayout}
            form={form}
            initialValues={{}}
            scrollToFirstError
            onFinish={debouncedEventHandler}
          >
            <Form.Item name="id" hidden />
            <span className="fieldLabel">
              Chọn trường <span className="field-required">*</span>
            </span>
            <Form.Item
              name="schoolId"
              rules={[
                {
                  required: true,
                  message: 'Trường đại học không được để trống!',
                },
              ]}
            >
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                size="large"
                allowClear
                showSearch
                placeholder="Chọn trường"
                // filterOption={filterSelectOption}
                // filterSort={filterSortSelectOption}
                optionFilterProp="children"
              >
                {school.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.shortName} - {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className="fieldLabel">
              Ngành học <span className="field-required">*</span>
            </span>
            <Form.Item
              name="major"
              rules={[
                {
                  required: true,
                  message: 'Ngành học không được để trống!',
                },
              ]}
            >
              <Input style={{ height: '40px', borderRadius: '6px' }} placeholder="Ngành học" />
            </Form.Item>
            <span className="fieldLabel">
              Điểm học tập (GPA)
            </span>
            <Form.Item
              name="grade"
            >
              <Input
                style={{ height: '40px', borderRadius: '6px' }}
                placeholder="Điểm học tập (GPA)"
              />
            </Form.Item>
            <span className="fieldLabel">
              Thời gian bắt đầu <span className="field-required">*</span>
            </span>
            <Form.Item
              name="startDate"
              rules={[
                {
                  required: true,
                  message: 'Thời gian bắt đầu không được để trống!',
                },
              ]}
            >
              <DatePicker
                size="large"
                style={{ width: '100%', borderRadius: '6px' }}
                placeholder="Thời gian bắt đầu"
              />
            </Form.Item>
            <span className="fieldLabel">
              Thời gian kết thúc
            </span>
            <Form.Item
              name="endDate"

            >
              <DatePicker
                style={{ width: '100%', borderRadius: '6px' }}
                size="large"
                placeholder="Thời gian kết thúc"
              />
            </Form.Item>
            <span className="fieldLabel">Bằng cấp</span>
            <Form.Item
              name="degree"
            >
              <Input style={{ height: '40px', borderRadius: '6px' }} placeholder="Bằng cấp" />
            </Form.Item>
            <span className="fieldLabel">Ghi chú</span>
            <Form.Item
              rules={[
                {
                  max: 500,
                  message: 'Tối đa 500 kí tự!',
                },
              ]}
              name="otherDesc"
            >
              <Input style={{ height: '40px', borderRadius: '6px' }} placeholder="Ghi chú" />
            </Form.Item>
            <Button
              style={{ borderRadius: '10px', width: '100%', marginTop: '20px' }}
              type="primary"
              htmlType="submit"
            >
              Hoàn thành
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
export default Academic
