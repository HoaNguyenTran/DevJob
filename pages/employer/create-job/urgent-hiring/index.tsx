import { CaretRightOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Col, Divider, Form, InputNumber, message, Modal, Radio, Row, Select, Steps } from 'antd'
import { getAllUserAddressApi, getCompanyAddressByIdApi, postCompanyAddressApi, postUserAddressApi } from 'api/client/address'
import { getUserCompanyApi } from 'api/client/company'
import React, { useEffect, useRef, useState } from 'react'
import Map from 'src/components/elements/Map/Map'
import ChoicePackage from 'src/components/modules/CreateUrgentJob/choice-package'
import jobConstant from 'src/constants/jobConstant'
import { jobPostRole, roleConstant, userRoleInCompany } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { filterSelectOption, filterSortSelectOption, formatNumber, getTokenUser, handleError, parseNumber } from 'src/utils/helper'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import styles from './UrgentHiring.module.scss'



const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}
const listStepRef = [
  { id: jobConstant.stepPost.step1, title: 'Tạo mới tin' },
  { id: jobConstant.stepPost.step2, title: 'Chọn dịch vụ và đăng tin' },
]

const UrgentHiringForm = (): JSX.Element => {
  const [form]: any = Form.useForm()
  const [step, setStep] = useState(jobConstant.stepPost.step1)
  const [fjobCategoryChild, setFjobCategoryChild] = useState<any>([])
  const [companies, setCompanies] = useState<any>([])
  const [isFormCreate, setIsFormCreate] = useState(true)
  const [userAddress, setUserAddress] = useState<any>([])
  const [jobRole, setJobRole] = useState(0)
  const [isMapModalVisible, setIsMapModalVisible] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any>()
  const [selectedAddress, setSelectedAddress] = useState<any>()
  const [selectedCompanyName, setSelectedCompanyName] = useState<any>('')
  const [selectedCompanyAddresses, setSelectedCompanyAddresses] = useState<any>([])

  const { user } = useAppSelector(state => state || {})
  const { FjobCategory: fjobCategory = [] } = useAppSelector(state => state.initData.data)

  const clonedCompanyRef = useRef([]);

  const handleChangeStep = currentStep => {
    if (currentStep === 1) {
      form
        .validateFields()
        .then(() => {
          setStep(currentStep)
        })
        .catch(() => {
          // message.warning('Bạn cần phải điền đầy đủ thông tin!')
        })
    } else {
      setStep(currentStep)
    }
  }

  const fjobCategoryParent = fjobCategory
    .filter(category => category.parentId === 0)
    .filter(item => item.canDoQuickPosting)

  const onChangeCategoryParent = value => {
    form.setFieldsValue({ 'jobPostExpRequiredCateIds': null })
    setFjobCategoryChild(
      fjobCategory.filter(item => item.parentId === value && item.canDoQuickPosting) || [],
    )
  }

  const onFinish = async () => {
    setIsFormCreate(false);
    setStep(jobConstant.stepPost.step2)
  }

  const loadCompanies = async () => {
    const result: any = await getUserCompanyApi()
    const companyList = (result?.data || []).filter(
      (item: any) => item.userRole === userRoleInCompany.admin || item.userRole === userRoleInCompany.agent,
    )
    clonedCompanyRef.current = companyList

    // companyList = companyList.map(item => ({
    //   value: Number(item.id),
    //   label: item.name,
    //   isLeaf: false,
    // }))
    setCompanies(companyList)
  }

  const loadPersonalAddresses = async () => {
    try {
      const res = await getAllUserAddressApi()
      setUserAddress(res?.data?.data)
    } catch (e) {
      handleError(e);
    }
  }

  const toogleMapModal = () => {
    setIsMapModalVisible(!isMapModalVisible)
  }

  const onChangePostRole = event => {
    setJobRole(event.target.value)
    form.setFieldsValue({
      jobPosition: '',
    })
    setSelectedCompany(null)
    if (jobPostRole.company === event.target.value) {
      loadCompanies()
    } else {
      loadPersonalAddresses()
    }
  }

  const chooseAddress = async data => {
    const { longitude, latitude, address, provinceId, districtId, communeId } = data

    try {
      const dataBody = {
        longitude,
        latitude,
        address,
        provinceId,
        districtId,
        communeId,
      }

      console.log(jobRole);


      if (jobRole) {
        const res = await postCompanyAddressApi({
          companyId: selectedCompany,
          ...dataBody,
        })

        const dataResponse = res?.data?.data || {}

        console.log(dataResponse);

        setSelectedCompanyAddresses([...selectedCompanyAddresses, dataResponse])

        // const newCompanies = companies.map(item => {
        //   if (selectedCompany === item.value) {
        //     const newChildren = [...item.children]
        //     newChildren.unshift({
        //       // id: dataResponse.id,
        //       label: dataResponse.address,
        //       value: dataResponse.id,  // JSON.stringify(dataResponse),
        //     })
        //     return {
        //       ...item,
        //       children: newChildren,
        //     }
        //   }
        //   return item
        // })

        // setCompanies(newCompanies)

        // console.log(newCompanies);

        // set into Input

        // const company = newCompanies.find(item => item.value === selectedCompany) || {}
        setSelectedCompany(selectedCompany)
        setSelectedAddress(dataResponse.id)

        form.setFieldsValue({
          jobPosition: dataResponse.id,
        })
      } else {
        const res = await postUserAddressApi({
          userId: user.profile.id,
          ...dataBody,
        })
        const dataResponse = res?.data?.data || {}
        const newAddress = [...userAddress]
        newAddress.unshift(dataResponse)
        setUserAddress(newAddress)
        // set into Input
        setSelectedAddress(dataResponse.id)
        form.setFieldsValue({
          jobPosition: dataResponse.id,
        })
      }



      message.success('Thêm địa chỉ thành công!')
    } catch (error) {
      handleError(error)
    } finally {
      setIsMapModalVisible(false)
    }
  }

  const onSelectAddress = value => {
    setSelectedAddress(value)
  }
  
  const onSelectCompany = async value => {
    try {
      const res: any = await getCompanyAddressByIdApi({ companyIds: value })
      const { data } = res.data;
      setSelectedCompany(value);
      setSelectedCompanyName(companies.find(item => item.id === value)?.name);
      setSelectedCompanyAddresses(data)
    } catch (e) {
      handleError(e)
    }
  }

  useEffect(() => {
    if (getTokenUser()) {
      loadPersonalAddresses()
    }
  }, [JSON.stringify(user)])


  return (
    <div className={`hiring py-4 ${styles.hiring}`}>
      <div className={styles.hiring_wrap}>
        <div className={`bg-white ${styles.stepList}`}>
          <Steps className='mt-0' responsive current={step} onChange={(value) => handleChangeStep(value)}>
            {listStepRef.map(item => (
              <Steps.Step key={item.id} title={item.title} />
            ))}
          </Steps>
        </div>
        <Form
          {...formItemLayout}
          form={form}
          initialValues={{}}
          scrollToFirstError
          onFinish={onFinish}
          className={isFormCreate ? "d-block" : "d-none"}
        >
          <div className={styles.section_form_hiring}>
            <div className={styles.header}>
              Tạo tin mới
            </div>

            <div className={`${styles.content_wrap} py-5`}>
              <div className={styles.title}>
                Vai trò đăng tin<span className={styles.textRequired}>*</span>
              </div>
              <Form.Item
                name="postRole"
                rules={[
                  {
                    required: true,
                    message: 'Vai trò đăng tin không được để trống!',
                  },
                ]}
                initialValue={jobPostRole.personal}
              >
                <Radio.Group onChange={onChangePostRole}>
                  <Radio value={jobPostRole.personal}>Cá nhân</Radio>
                  <Radio value={jobPostRole.company}>Công ty</Radio>
                </Radio.Group>
              </Form.Item>

              {
                !!jobRole &&
                <>
                  <div className={styles.title}>
                    Chọn công ty<span className={styles.textRequired}>*</span>
                  </div>
                  <Form.Item
                    name="company"
                    rules={[
                      {
                        required: true,
                        message: 'Công ty không được để trống!',
                      },
                    ]}
                  >
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      style={{ zIndex: 1 }}
                      onChange={
                        (value) => onSelectCompany(value)

                      }
                      allowClear
                      showSearch
                      filterOption={filterSelectOption}
                      filterSort={filterSortSelectOption}
                      optionFilterProp="children"

                    >
                      {companies.map(item => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </>
              }

              <div className={styles.title}>
                Ngành nghề đăng tuyển<span className={styles.textRequired}>*</span>
              </div>
              <Form.Item
                name="jobPostCategoryIds"
                rules={[
                  {
                    required: true,
                    message: 'Ngành nghề đăng tuyển không được để trống!',
                  },
                ]}
              >
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                  allowClear
                  showSearch
                  placeholder="Chọn ngành nghề đăng tuyển"
                  filterOption={filterSelectOption}
                  optionFilterProp="children"
                  filterSort={filterSortSelectOption}
                  onChange={onChangeCategoryParent}
                >
                  {fjobCategoryParent.map(item => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Row className='justify-content-between'>
                <Col xs={24} md={11}>
                  <div className={styles.title}>
                    Vị trí tuyển dụng<span className={styles.textRequired}>*</span>
                  </div>
                  <Form.Item
                    name="jobPostExpRequiredCateIds"
                    rules={[
                      {
                        required: true,
                        message: 'Vị trí tuyển dụng không được để trống!',
                      },
                    ]}
                  >
                    <Select
                      getPopupContainer={trigger => trigger.parentNode}
                      allowClear
                      showSearch
                      disabled={!fjobCategoryChild.length}
                      optionFilterProp="children"
                      filterOption={filterSelectOption}
                      filterSort={filterSortSelectOption}
                      placeholder="Chọn vị trí tuyển dụng"
                    >
                      {fjobCategoryChild.map((item: any) => (
                        <Select.Option key={item.id} value={item.id}>
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={11}>
                  <div className={styles.title}>
                    Số lượng tuyển dụng<span className={styles.textRequired}>*</span>
                  </div>
                  <Form.Item
                    name="hiringCount"
                    initialValue={1}
                    rules={[
                      {
                        required: true,
                        message: 'Số lượng tuyển dụng ít nhất một người!',
                      },
                      {
                        pattern: /^\d+$/g,
                        message: 'Số lượng người tuyển dụng phải là số nguyên!',
                      },
                    ]}
                  >
                    <InputNumber
                      controls={false}
                      min="1"
                      max="5000"
                      placeholder="100" className="custom-text-left-input"
                      formatter={value => formatNumber(value)}
                      parser={(value: string | undefined) => parseNumber(value)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <div className={styles.title}>
                Địa chỉ nơi làm việc<span className={styles.textRequired}>*</span>
              </div>

              <Form.Item
                name="jobPosition"
                rules={[
                  {
                    required: true,
                    message: 'Địa chỉ nơi làm việc không được để trống!',
                  },
                ]}
              >
                {jobRole ? (
                  <Select
                    disabled={!form.getFieldValue("company")}
                    placeholder="Chọn địa chỉ nơi làm việc"
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ zIndex: 1 }}
                    onChange={onSelectAddress}
                    allowClear
                    showSearch
                    filterOption={filterSelectOption}
                    filterSort={filterSortSelectOption}
                    optionFilterProp="children"
                    dropdownRender={menu => {
                      const isAdminOfCompany = clonedCompanyRef.current.find((item: any) => item.id === selectedCompany && item.userRole === userRoleInCompany.admin);
                      return (
                        <div className={styles.employmentInfo_address}>
                          {menu}
                          {isAdminOfCompany &&
                            <>
                              <Divider className="m-2" />
                              <div className="hiring_continue text-center mb-2">
                              <Button type="primary" onClick={toogleMapModal}>
                                  <PlusOutlined /> Thêm địa chỉ
                                </Button>
                              </div>
                            </>
                          }
                        </div>
                      )
                    }}
                  >
                    {selectedCompanyAddresses.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.address}
                      </Select.Option>
                    ))}
                  </Select>
                ) : (
                  <Select
                      placeholder="Chọn địa chỉ nơi làm việc"
                    getPopupContainer={trigger => trigger.parentNode}
                    style={{ zIndex: 1 }}
                    onChange={onSelectAddress}
                    allowClear
                    showSearch
                    filterOption={filterSelectOption}
                    filterSort={filterSortSelectOption}
                    optionFilterProp="children"
                    dropdownRender={menu => (
                      <div className={styles.employmentInfo_address}>
                        {menu}
                        <Divider className="m-2" />
                        <div className="hiring_continue text-center mb-2">
                          <Button type="primary" onClick={toogleMapModal}>
                            <PlusOutlined /> Thêm địa chỉ
                          </Button>
                        </div>
                      </div>
                    )}
                  >
                    {userAddress.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.address}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <div className="hiring_continue d-flex justify-content-end mt-4">
                <Button type="primary" htmlType="submit">
                  Tiếp tục
                  <CaretRightOutlined />
                </Button>
              </div>

            </div>
          </div>
        </Form>


        <div className={isFormCreate ? ' d-none' : ' d-block'}>
          <ChoicePackage
            formData={form.getFieldsValue()}
            backToForm={() => setIsFormCreate(true)}
            jobRole={jobRole}
            selectedAddress={selectedAddress}
            selectedCompany={selectedCompany}
          />
        </div>
      </div>

      {isMapModalVisible && (
        <Modal
          zIndex={999999999}
          wrapClassName="modal-global"
          width={700}
          footer={null}
          title=""
          visible={isMapModalVisible}
          onOk={toogleMapModal}
          onCancel={toogleMapModal}
        >
          <div className="modal-body">
            <div className="modal-title mb-4">{`Thêm địa chỉ: ${selectedCompany ? selectedCompanyName : 'cá nhân'
              }`}</div>
            <Map
              handleCloseModalMap={toogleMapModal}
              handlePostAddress={data => chooseAddress(data)}
            />
          </div>
        </Modal>
      )}
    </div>
  )
}

export default UrgentHiringForm

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

  setUserRoleCookieSSR({ ctx, role: roleConstant.ER.key })
  return {
    props: {},
  }
}
