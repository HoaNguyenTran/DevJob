import React, { useState } from 'react'
import { Form, InputNumber, message, Select } from 'antd'
import { patchUpdateUserApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatNumber } from 'src/utils/helper'
import { EditOutlined } from '@ant-design/icons'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import styles from './ExpectSalary.module.scss'

const ExpectSalary = (): JSX.Element => {
  const [form] = Form.useForm();

  const dispatch = useAppDispatch()
  const profile = useAppSelector(state => state.user.profile || {})
  const { WageUnit = [] } = useAppSelector(state => state.initData.data)


  const initialValues = {
    minSalary: profile.expectSalaryFrom,
    maxSalary: profile.expectSalaryTo,
    unitSalary: profile.expectSalaryUnit
  }


  const [isExpectSalaryModal, setIsExpectSalaryModal] = useState(false)

  const handleConfirmExpectSalaryModal = () => {
    form.submit()
    form
      .validateFields()
      .then(async () => {
        try {
          await patchUpdateUserApi(profile.code, {
            expectSalaryUnit: form.getFieldValue("unitSalary"),
            expectSalaryFrom: form.getFieldValue("minSalary"),
            expectSalaryTo: form.getFieldValue("maxSalary"),
          })
          dispatch(getProfileRequest({ userCode: profile.code }))
          message.success("Cập nhật mức lương thành công!")
        } catch (error) {
          message.error('Cập nhật mức lương không thành công!')
        }
      })
      .catch(() => {
        message.warning('Mức lương không được để trống!')
      })
  }

  const handleCancelExpectSalaryModal = () => {
    setIsExpectSalaryModal(false)
  }

  return (
    <div className={`portfolio ${styles.salary}`}>
      <div className={styles.salary_header}>
        <div className={styles.salary_title}>
          <div className={styles.title}>Mức lương mong muốn
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
        <div
          className={styles.salary_edit}
          onClick={() => setIsExpectSalaryModal(true)}
        >
          <EditOutlined style={{ marginRight: '.5rem' }} /> Chỉnh sửa
        </div>
      </div>
      <div className={styles.salary_content}>
        <span>
          {formatNumber(profile.expectSalaryFrom)} - {formatNumber(profile.expectSalaryTo)} VNĐ/giờ
        </span>
      </div>

      {isExpectSalaryModal && <ModalPopup
        visible={isExpectSalaryModal}
        handleCancelModal={handleCancelExpectSalaryModal}
        handleConfirmModal={handleConfirmExpectSalaryModal}
        title="Mức lương mong muốn"
        className="portfolio_salary"
      >
        <Form
          form={form}
          className={styles.modal}
          initialValues={initialValues}
        >
          <div className={styles.modal_wrap}>
            <div className={styles.salary_min}>
              <div className={styles.title}>Từ</div>
              <Form.Item name="minSalary" rules={[
                {
                  required: true,
                  message: 'Mức lương không được để trống!',
                },
              ]}>
                <InputNumber
                  controls={false}
                  min={0}
                // formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, "")}
                // parser={value => String(value).replace('%', '')}
                />
              </Form.Item>
            </div>
            <div className={styles.salary_max}>
              <div className={styles.title}>Đến</div>
              <Form.Item name="maxSalary" rules={[
                {
                  required: true,
                  message: 'Mức lương không được để trống!',
                },
              ]}>
                <InputNumber
                  controls={false}
                  min={0}
                // formatter={(value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
                />
              </Form.Item>
            </div>
            <Form.Item name="unitSalary" rules={[
              {
                required: true,
                message: 'Mức lương không được để trống!',
              },
            ]}>
              <Select placeholder="VNĐ / Tháng" >
                {[...WageUnit].reverse().map(item => <Select.Option key={item.id} value={item.id}>
                  VNĐ / {item.name}
                </Select.Option>)}
              </Select>
            </Form.Item>

          </div>
        </Form>
      </ModalPopup>}
    </div>
  )
}
export default ExpectSalary
