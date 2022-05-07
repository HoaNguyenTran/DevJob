import React, { useState, useEffect } from 'react'
import { Card, Checkbox, Col, Collapse, Form, InputNumber, message, Radio, Row, Select, Space } from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/redux'
import jobConstant from 'src/constants/jobConstant'

import { filterSelectOption, formatNumber, parseNumber, removeAccents } from 'src/utils/helper'
import { useRouter } from 'next/router'

import { DownOutlined } from '@ant-design/icons'
import styles from './Sidebar.module.scss'

const formItemLayout = {
  labelCol: {
    span: 24,
  },
}


const defaultPage = 1

const Sidebar = ({ form, handleSearchEE }) => {
  const { t } = useTranslation()
  const router = useRouter()

  const {
    FjobEducationLevel: educationList = [],
    FjobProvince: provinceList = [],
    FjobCategory: categorieList = [],
    Gender: genderList = [],
    FjobExperience: experienceList = [],
    FjobDistrict: districtList = [],
    WageUnit: salaryUnitList = [],
  } = useAppSelector(state => state.initData.data)

  const [isDisableSelectDistrict, setIsDisableSelectDistrict] = useState(!router.query.provinceId)


  const [dataDistrict, setDataDistrict] = useState(districtList.filter(item => item.provinceId === Number(router.query.provinceId) || []))


  const handleChangeProvince = value => {
    setDataDistrict(districtList.filter(item => item.provinceId === value))
    setIsDisableSelectDistrict(false)
    form.setFieldsValue({
      districtId: null,
    })
  }

  const handleRouter = num => {
    if (router.query[num]) return Number(router.query[num])
    return null
  }


  const initialValues = {
    jobCateId: handleRouter('categories'),
    provinceId: handleRouter('provinceId'),
    districtId: handleRouter('districtId')
      ? {
        ...districtList
          .filter(item => item.provinceId === handleRouter('provinceId'))
          .find(item => item.id === handleRouter('districtId'))
      }.id
      : null,
    experienceId: handleRouter('experienceId'),
    salaryMin: handleRouter('expectSalaryFrom'),
    salaryMax: handleRouter('expectSalaryTo'),
    salaryUnit: handleRouter('expectWageUnit'),
    educationId: handleRouter('academicId'),

    genderType: (handleRouter('male') || handleRouter('female') || handleRouter('other')) || handleRouter('other') === jobConstant.genderName.other.key ? jobConstant.genderType.chooseGender.key : null,
    chooseGender: handleRouter('male') || handleRouter('female') || handleRouter('other'),

    ageType: (handleRouter('ageFrom') || handleRouter('ageTo')) ? jobConstant.ageType.chooseAge.key : null,
    ageMin: handleRouter('ageFrom'),
    ageMax: handleRouter('ageTo'),
  }

  useEffect(() => {
    form.setFieldsValue(initialValues)

  }, [router.asPath])



  return (
    <div className={`findEE_sidebar ${styles.findEE_sidebar}`}>
      <Card size="small" className={styles.findEE_sidebar_card}>
        <Collapse defaultActiveKey={[]} expandIconPosition="right">
          <Collapse.Panel header="Lựa chọn tìm kiếm" key="1">
            <Form
              {...formItemLayout}
              form={form}
              onFinish={() => handleSearchEE(defaultPage)}
              style={{ transition: "transform .35s ease-in-out" }}
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                  <div className={styles.label}>
                    Ngành nghề tìm kiếm
                  </div>
                  <Form.Item name="jobCateId">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={filterSelectOption}
                      placeholder={t('erSearchEe.chooseCategories')}
                      getPopupContainer={trigger => trigger.parentNode}
                    >
                      {categorieList.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={styles.label}>
                    Trình độ học vấn
                  </div>
                  <Form.Item name="educationId">
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      allowClear
                      placeholder={t('erSearchEe.educationLevel')}
                    >
                      <Select.Option key={0} value={0} >
                        Không yêu cầu
                      </Select.Option>
                      {educationList.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={`findEE_salary ${styles.findEE_sidebar_salary}`}>
                    <div className={styles.label}>
                      Mức lương sẵn sàng chi trả
                    </div>
                    <div className={styles.findEE_sidebar_salary_bottom}>
                      <div className={styles.findEE_sidebar_salary_bottom_select}>
                        <div className={styles.findEE_sidebar_salary_bottom_select_text}>Từ</div>
                        <Form.Item name="salaryMin">
                          <InputNumber
                            min={0}
                            formatter={value => formatNumber(value)}
                            parser={(value: string | undefined) => parseNumber(value) || 0}
                            style={{ backgroundColor: "transparent", border: "none", borderRadius: 0 }}
                          />
                        </Form.Item>
                      </div>
                      <div className={styles.findEE_sidebar_salary_bottom_select}>
                        <div className={styles.findEE_sidebar_salary_bottom_select_text}>Đến</div>
                        <Form.Item name="salaryMax">
                          <InputNumber
                            min={0}
                            formatter={value => formatNumber(value)}
                            parser={(value: string | undefined) => parseNumber(value) || 0}
                            style={{ backgroundColor: "transparent", border: "none", borderRadius: 0 }}
                          />
                        </Form.Item>
                      </div>

                      <div className={styles.findEE_sidebar_salary_unit}>VNĐ/</div>
                      <Form.Item name="salaryUnit">
                        <Select
                          getPopupContainer={trigger => trigger.parentNode}
                          allowClear
                          placeholder="Giờ"
                        >
                          {salaryUnitList.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className={styles.label}>
                    Độ tuổi
                  </div>
                  <div className={styles.findEE_sidebar_age}>
                    <Form.Item name="ageType">
                      <Radio.Group>
                        <Space direction="vertical">
                          <Radio value={jobConstant.ageType.notRequire.key}>Không yêu cầu</Radio>
                          <Radio value={jobConstant.ageType.chooseAge.key}>Chọn độ tuổi</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) => {
                        if (getFieldValue('ageType') === jobConstant.ageType.chooseAge.key)
                          return (
                            <div className={styles.findEE_sidebar_age_bottom}>
                              <div className={styles.findEE_sidebar_age_bottom_unit}>
                                <div className={styles.findEE_sidebar_age_unit}>Từ: </div>
                                <Form.Item name="ageMin">
                                  <InputNumber
                                    min={0}
                                    formatter={value => formatNumber(value)}
                                    parser={(value: string | undefined) => parseNumber(value) || 0}
                                    style={{ backgroundColor: "transparent", border: "none", borderRadius: 0, height: 44 }}
                                  />
                                </Form.Item>
                              </div>
                              <div className={styles.findEE_sidebar_age_bottom_unit}>
                                <div className={styles.findEE_sidebar_age_unit}>đến: </div>
                                <Form.Item name="ageMax">
                                  <InputNumber
                                    min="0"
                                    formatter={value => formatNumber(value)}
                                    parser={(value: string | undefined) => parseNumber(value) || 0}
                                    style={{ backgroundColor: "transparent", border: "none", borderRadius: 0, height: 44 }}
                                  />
                                </Form.Item>
                              </div>
                            </div>
                          )
                      }}
                    </Form.Item>
                  </div>
                </Col>
                <Col xs={24} md={12}>
                  <div className={styles.label}>
                    Địa điểm
                  </div>
                  <Row gutter={[12, 12]}>
                    <Col xs={12}>
                      <Form.Item name="provinceId">
                        <Select
                          getPopupContainer={trigger => trigger.parentNode}
                          onChange={handleChangeProvince}
                          allowClear
                          showSearch
                          optionFilterProp="children"
                          filterOption={filterSelectOption}
                          placeholder={t('erSearchEe.chooseProvince')}
                        >
                          {provinceList.map(item => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <Form.Item name="districtId" className={styles.findEE_sidebar_district}>
                        <Select
                          getPopupContainer={trigger => trigger.parentNode}
                          allowClear
                          showSearch
                          filterOption={filterSelectOption}
                          disabled={form.getFieldValue('districtId') ? false : isDisableSelectDistrict}
                          placeholder={t('erSearchEe.chooseDistrict')}
                        >
                          {dataDistrict.map((item: any) => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <div className={styles.label}>
                    Kinh nghiệm yêu cầu
                  </div>
                  <Form.Item name="experienceId">
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={filterSelectOption}
                      placeholder="Thời gian kinh nghiệm"
                    >
                      {experienceList.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={styles.label}>
                    Giới tính
                  </div>
                  <Form.Item name="chooseGender">
                    <Select
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      filterOption={filterSelectOption}
                      placeholder="Giới tính"
                    >
                      {genderList.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className={styles.findEE_sidebar_btn}>
                    <Form.Item>
                      <button type="submit">Tìm kiếm</button>
                    </Form.Item>
                  </div>
                </Col>
              </Row>
            </Form>
          </Collapse.Panel>
        </Collapse>
      </Card>
      {/* <button type="button" onClick={showModalSuggestBuyService}>
                Mua KM xem chi tiết ứng viên
              </button> */}
    </div>
  )
}

export default Sidebar
