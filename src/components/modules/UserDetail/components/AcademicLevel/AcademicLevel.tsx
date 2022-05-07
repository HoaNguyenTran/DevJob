
import React from 'react'
import { message, Select } from 'antd'
import { patchUserInfomationApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { filterSelectOption, handleError } from 'src/utils/helper'
import styles from './AcademicLevel.module.scss'


const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

const AcademicLevel = (): JSX.Element => {
  const { FjobEducationLevel: educationList = [] } = useAppSelector(state => state.initData.data)
  const profile = useAppSelector(state => state.user.profile || {})

  const dispatch = useAppDispatch()


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
    <div className={`portfolio ${styles.academic}`}>
      <div className={styles.academic_header}>
        <div className={styles.academic_title}>
          <div className={styles.title}>Trình độ học vấn
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
      </div>

      <div className={styles.academic_content}>
        <Select
          getPopupContainer={trigger => trigger.parentNode}
          filterOption={filterSelectOption}
          placeholder="Trình độ học vấn"
          defaultValue={profile.academicId}
          onChange={handleChangeSelectAcademicId}
          className={styles.select}
        >
          {educationList.map(education => {
            if (education.id === 1) return <Select.Option key={education.id} value={education.id}>Chưa tốt nghiệp THPT</Select.Option>
            return <Select.Option key={education.id} value={education.id}>{education.name}</Select.Option>
          }
          )}
        </Select>
      </div>
    </div>
  )
}
export default AcademicLevel
