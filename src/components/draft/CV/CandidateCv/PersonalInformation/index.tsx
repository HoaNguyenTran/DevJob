import { Col, Row } from 'antd'
import moment from 'moment';
import React from 'react'
import { configConstant } from 'src/constants/configConstant';
import { convertObjectToArraytData } from 'src/utils/helper';
import jobConstant from '../../../../../constants/jobConstant';
import styles from "./PersonalInformation.module.scss"

const PersonalInformation = ({data}) => {
  const getTextGender = (genderNumber) => {
    const genders = convertObjectToArraytData(jobConstant.genderName);
    return genders.find(item => item.key === genderNumber)?.value
  }
  return (
    <div className={styles.personal_information}>
      <div className={styles.personal_information_wrap}>
        <div className={styles.title}>
           Thông tin cá nhân
        </div>
        <Row >
          <Col span={6}>
            <span className='font-weight-bold'>Họ và tên:</span>
          </Col>
          <Col span={18}>
            {data.name || ""}
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col span={6}>
            <span className='font-weight-bold'>Ngày sinh:</span>
          </Col>
          <Col span={18}>
            {moment(data.birthday).format(configConstant.displayTime.DDMMYYY)  || ""}
          </Col>
        </Row>
        {
          data.gender !== null &&
          <Row className='mt-2'>
            <Col span={6}>
              <span className='font-weight-bold'>Giới tính:</span>
            </Col>
            <Col span={18}>
              {getTextGender(data.gender)}
            </Col>
          </Row>
        }
        <Row className='mt-2'>
          <Col span={6}>
            <span className='font-weight-bold'>Địa chỉ:</span>
          </Col>
          <Col span={18}>
            {data.shortAddress || ""}
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col span={6}>
            <span className='font-weight-bold'>Email:</span>
          </Col>
          <Col span={18}>
            {data.email || ""}
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col span={6}>
            <span className='font-weight-bold'>Điện thoại:</span>
          </Col>
          <Col span={18}>
            {data.phoneNumber || ""}
          </Col>
        </Row>
        
      </div>
    </div>
  )
} 

export default PersonalInformation