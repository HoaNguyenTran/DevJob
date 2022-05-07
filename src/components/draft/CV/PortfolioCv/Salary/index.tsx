import React, { useState } from 'react'

import {
  Button,
  Divider,
  message,
  Modal,
  Slider,
} from 'antd'
import { patchUpdateUserApi } from 'api/client/user'
import {
  useAppDispatch,
  useAppSelector,
} from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { formatNumber } from 'src/utils/helper'

import { EditOutlined } from '@ant-design/icons'

import styles from './salary.module.scss'

const Salary = () => {
  const [isModal, setIsModal] = useState(false)
  const dispatch = useAppDispatch()
  const { expectSalaryFrom, expectSalaryTo, code } = useAppSelector(state => state.user.profile || {})

  const [min, setMin] = useState(expectSalaryFrom)
  const [max, setMax] = useState(expectSalaryTo)

  const handlerOkModal = async () => {
    setIsModal(false)
    try {
      await patchUpdateUserApi(code, {
        expectSalaryUnit: 1,
        expectSalaryFrom: min,
        expectSalaryTo: max,
      })
      dispatch(getProfileRequest({ userCode: code }))
      message.success("Cập nhật mức lương mong muốn thành công!")
    } catch (error) {
      message.error('Cập nhật mức lương mong muốn không thành công!')
    }
    setIsModal(false)
  }

  const handleCancelModal = () => {
    setMin(expectSalaryFrom)
    setMax(expectSalaryTo)
    setIsModal(false)
  }

  const marks = {
    10000: '10000',
    1010000: {
      label: '1010000'
    },
  }

  const onChange = value => {
    setMin(Math.min(value[0], value[1]))
    setMax(Math.max(value[0], value[1]))
  }

  return (
    <div className={styles.salary}>
      <div className={styles.row}>
        <h3 className={styles.title}>Mức lương mong muốn<span> (*)</span></h3>
        <div
          className={styles.edit}
          onClick={() => {
            setIsModal(true)
          }}
        >
          <EditOutlined style={{ marginRight: '10px' }} /> Chỉnh sửa
        </div>
      </div>
      <div className={styles.item}>
        <span>
          {formatNumber(expectSalaryFrom)} - {formatNumber(expectSalaryTo)} VNĐ/giờ
        </span>
      </div>
      <Modal
        wrapClassName="modal-global"
        visible={isModal}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={handleCancelModal}
      >
        <div className="modal-title">Mức lương mong muốn</div>
        <Divider />
        <Slider
          range
          defaultValue={[min, max]}
          marks={marks}
          min={10000}
          max={1010000}
          step={10000}
          onChange={onChange}
        />
        <Button
          style={{ borderRadius: '10px', width: '100%', marginTop: '30px' }}
          type="primary"
          htmlType="submit"
          onClick={handlerOkModal}
        >
          Hoàn thành
        </Button>
      </Modal>
    </div>
  )
}
export default Salary
