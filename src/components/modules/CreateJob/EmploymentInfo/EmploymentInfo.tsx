import React, {
  FC,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select,
  TimePicker,
} from 'antd'
import {
  getAllCompanyAddressApi,
  getAllUserAddressApi,
  postCompanyAddressApi,
  postUserAddressApi,
} from 'api/client/address'
import { getUserCompanyApi } from 'api/client/company'
import { startOfToday } from 'date-fns'
import Map from 'src/components/elements/Map/Map'
import { configConstant } from 'src/constants/configConstant'
import jobConstant from 'src/constants/jobConstant'
import { userRoleInCompany } from 'src/constants/roleConstant'
import { useAppSelector } from 'src/redux'
import {
  filterSelectOption,
  formatNumber,
  handleError,
  parseNumber,
} from 'src/utils/helper'

import {
  CaretRightOutlined,
  PlusOutlined,
} from '@ant-design/icons'

import UploadFile from '../UploadFile/UploadFile'
import styles from './EmploymentInfo.module.scss'

const { Option } = Select
const { TextArea } = Input

const dateFormat = 'DD/MM/YYYY'
const timeFormat = 'HH:mm'


// interface Obj {
//   [name: string]: number | string | undefined
// }

interface IProps {
  form: any
  valueForm: JobGlobal.JobValueForm
  handleChangeStep(step: number): void
  handleChangeValueForm(data: any): void
}
interface IUserAddress {
  address: string
  communeId: number
  createdAt: string
  districtId: number
  id: number
  latitude: number
  longitude: number
  main: number
  provinceId: number
  updatedAt: string
  userAddressId: number
}

interface ICompanyAddress {
  address: string
  communeId: number
  companyId: number
  createdAt: string
  districtId: number
  id: number
  latitude: number
  longitude: number
  provinceId: number
  updatedAt: string
}

interface ICompany {
  adminUserId: string
  avatar: string
  contactPhone: string
  desc: string
  id: number
  imagesJson: string
  industryId: number
  isVerified: number
  name: string
  numEmployee: number
  parentId: number
  shortName: string
  status: number
  userId: string
  userRole: number
  website: string
}

// interface IParentAddress {
//   value: number
//   label: string
//   children: IChildrenAddress[]
// }
// interface IChildrenAddress {
//   value: number
//   label: string
//   companyId: number
// }

const EmploymentInfo: FC<IProps> = ({
  form,
  valueForm,
  handleChangeStep,
  handleChangeValueForm,
}) => {
  const profile = useAppSelector(state => state.user.profile || {})

  const {
    FjobShift: shiftList = [],
    DayOfWeek: dayList = [],
    WageUnit: wageUnitList = [],
    Gender: genderList = [],
    FjobEducationLevel: educationList = [],
    FjobCategory: categoryList = [],
    FjobExperience: experienceList = [],
    FjobBenefit: benefitList = [],
  } = useAppSelector(state => state.initData.data)

  const checkListDays = useRef<number[]>([])

  const [selectExperience, setSelectExperience] = useState<any>([]) // antd

  const arrDay: number[] = []

  dayList.map(item => arrDay.push(item.id))

  const disabledDatePost = current => current && new Date(current) < startOfToday()

  const [userAddress, setUserAddress] = useState<IUserAddress[]>([]);
  const [companyAddress, setCompanyAddress] = useState<ICompanyAddress[]>([]);
  const [userCompany, setUserCompany] = useState<ICompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<any>();

  const [selectedAddressType, setSelectedAddressType] = useState<any>({})
  const [isModalMap, setIsModalMap] = useState(false)

  const isFirstUpdateValueRef = useRef<any>(false)
  const companyAddressRef = useRef<any>([])

  const handlePostAddress = async data => {
    const { address, communeId, districtId, latitude, longitude, provinceId } = data

    if (selectedAddressType.type === jobConstant.recruit.person.key) {
      try {
        const resData = await postUserAddressApi({
          userId: profile.id,
          ...data
        })
        message.success('Th??m ?????a ch??? th??nh c??ng!')
        form.setFieldsValue({ userAddress: resData.data.data.id })
        fetchUserAddress()
      } catch (error) {
        handleError(error)
      } finally {
        // setSelectedAddressType({})
      }
    } else {
      try {
        const resData = await postCompanyAddressApi({
          companyId: selectedCompany,
          longitude,
          latitude,
          address,
          provinceId,
          districtId,
          communeId,
        })

        await fetchCompanyAddress()
        await getCompanyAddress(selectedCompany)
        form.setFieldsValue({
          // companyAddressArr: [resData.data.data.companyId, resData.data.data.id],
          companyId: resData.data.data.companyId,
          companyAdressId: resData.data.data.id
        })
        message.success('Th??m ?????a ch??? th??nh c??ng!')
      } catch (error) {
        handleError(error)
      } finally {
        // setSelectedAddressType({})
      }
    }
  }

  const handleCloseModalMap = () => {
    setIsModalMap(false)
  }

  const fetchUserAddress = async () => {
    try {
      const responseUserAddress = await getAllUserAddressApi()
      setUserAddress(responseUserAddress.data.data)
    } catch (error) {
      setUserAddress([])
    }
  }

  const fetchCompanyAddress = async () => {
    try {
      const responseCompanyAddress = await getAllCompanyAddressApi()
      setCompanyAddress(responseCompanyAddress.data.data);
      companyAddressRef.current = responseCompanyAddress.data.data;
    } catch (error) {
      setCompanyAddress([])
    }
  }

  const fetchUserCompany = async () => {
    try {
      const responseCompany = await getUserCompanyApi()
      setUserCompany(
        responseCompany.data.filter(
          item =>
            item.userRole === jobConstant.userRole.admin ||
            item.userRole === jobConstant.userRole.staff,
        ),
      )
    } catch (error) {
      setUserCompany([])
    }
  }

  const handleChangeDayOfWeek = listDaysOfWeek => {
    if (listDaysOfWeek.includes(1)) {
      if (!checkListDays.current.includes(1)) {
        form.setFieldsValue({ dayOfWeek: arrDay })
        checkListDays.current = arrDay
      } else {
        const filterArr = listDaysOfWeek.filter(item => item !== 1)
        form.setFieldsValue({ dayOfWeek: filterArr })
        checkListDays.current = filterArr
      }
    } else if (listDaysOfWeek.length === 7) {
      if (!checkListDays.current.includes(1)) {
        form.setFieldsValue({ dayOfWeek: arrDay })
        checkListDays.current = arrDay
      } else {
        form.setFieldsValue({ dayOfWeek: [] })
        checkListDays.current = []
      }
    } else {
      checkListDays.current = listDaysOfWeek
      form.setFieldsValue({ dayOfWeek: listDaysOfWeek })
    }
  }

  const handleChangeAddress = (type: any) => {
    setIsModalMap(true)
    setSelectedAddressType({
      type,
      value: profile.id,
      name: jobConstant.recruit.person.value,
    })
    handleChangeValueForm({ companyId: undefined, companyAddressId: undefined })
  }

  const getCompanyAddress = (companyId) => {

    const newCompanyAddress = companyAddressRef.current.filter(itemCompanyAddress => itemCompanyAddress.companyId === companyId);
    setCompanyAddress(newCompanyAddress)
  }

  const onSelectCompany = (value) => {
    setSelectedCompany(value);
  }

  useEffect(() => {
    if (userAddress.length === 0) fetchUserAddress()
    if (companyAddress.length === 0) fetchCompanyAddress()
    if (userCompany.length === 0) fetchUserCompany()
  }, [])

  useEffect(() => {
    if (!isFirstUpdateValueRef.current && Object.keys(valueForm).length) {
      form.setFieldsValue(valueForm);
      isFirstUpdateValueRef.current = true
    }
  }, [JSON.stringify(valueForm)])


  /**
   * todo:  refactor function handleChangeValueForm
   */
  return (
    <div>
      <Form
        // {...formItemLayout}
        form={form}
        initialValues={valueForm}
        autoComplete="off"
        scrollToFirstError
      // preserve={false}
      >
        <div className={styles.section_form_hiring}>
          <div className={styles.header}>
            T???o tin m???i
          </div>

          <div className={styles.content_wrap}>
            <div className={styles.title}>
              Vai tr?? ????ng tin<span className={styles.textRequired}>*</span>
            </div>

            <Form.Item
              name="addressType"
              rules={[
                {
                  required: true,
                  message: '?????a ch??? l??m vi???c kh??ng ???????c ????? tr???ng!',
                },
              ]}
              style={{ marginBottom: 10 }}
            >
              <Radio.Group
                onChange={e => {
                  e.preventDefault();
                  // form.setFieldsValue({ companyAddressArr: undefined, userAddress: undefined })
                  // setSelectedAddressType({})
                  if (e.target.value === jobConstant.recruit.person.key) {
                    form.setFieldsValue({
                      companyId: undefined,
                      companyAddressId: undefined,
                      userAddress: undefined
                    })
                  }
                   
                  if (e.target.value === jobConstant.recruit.company.key) {
                    form.setFieldsValue({
                      userAddress: undefined,
                      companyId: undefined,
                      companyAddressId: undefined,

                    })
                  }

                }}
              >
                <Radio value={jobConstant.recruit.person.key}>{jobConstant.recruit.person.value}</Radio>
                <Radio value={jobConstant.recruit.company.key}>
                  {jobConstant.recruit.company.value}
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item noStyle shouldUpdate>
              {({ getFieldValue }) =>
                getFieldValue('addressType') === jobConstant.recruit.company.key &&
                <>
                  <div className={`${styles.title} mt-4`}>
                    Ch???n c??ng ty <span className={styles.textRequired}>*</span>
                  </div>
                  <Form.Item
                    name="companyId"
                    rules={[
                      {
                        required: true,
                        message: 'C??ng ty kh??ng ???????c ????? tr???ng!',
                      },
                    ]}
                  >
                    <Select
                      style={{ zIndex: 1 }}
                      getPopupContainer={trigger => trigger.parentNode}
                      allowClear
                      showSearch
                      filterOption={filterSelectOption}
                      onChange={value => {
                        onSelectCompany(value)
                        getCompanyAddress(value);
                        form.setFieldsValue({ experienceJob: undefined })
                      }}
                    >
                      {userCompany
                        .map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </>
              }
            </Form.Item>
          </div>
        </div>
        <div className={styles.section_form_hiring}>
          <div className={styles.content_wrap}>
            <div className={`${styles.title} mt-4`}>
              Ti??u ????? tin tuy???n d???ng<span className={styles.textRequired}>*</span>
            </div>
            <Form.Item
              name="jobTitle"
              rules={[
                {
                  required: true,
                  message: 'Ti??u ????? tin kh??ng ???????c ????? tr???ng!',
                },
                {
                  min: 10,
                  message: 'Ti??u ????? tin tuy???n d???ng ??t nh???t 10 k?? t???!',
                },
                {
                  max: 255,
                  message: 'Ti??u ????? tin tuy???n d???ng nhi???u nh???t 255 k?? t???!',
                },
              ]}
            >
              <Input
                onBlur={e => {
                  form.setFieldsValue({ jobTitle: e.target.value.replace(/\s+/g, ' ').trim() })
                  form.validateFields(['jobTitle'])
                }}
                placeholder="V?? d???: Nh??n vi??n kinh doanh"
              // onPressEnter={val => {
              //   // form.setFieldsValue({ jobTitle: e.target.value.replace(/\s+/g, ' ').trim() })
              //   console.log(val)
              //   form.validateFields(['jobTitle'])
              // }}
              />
            </Form.Item>
            <Row className='justify-content-between'>
              <Col xs={24} md={11}>
                <div className={styles.title}>
                  Ng??nh ngh??? ????ng tuy???n<span className={styles.textRequired}>*</span>
                </div>
                <Form.Item
                  name="jobCate"
                  rules={[
                    {
                      required: true,
                      message: 'Ng??nh ngh??? ????ng tuy???n kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <Select
                    placeholder="Ch???n ng??nh ngh??? ????ng tuy???n"
                    style={{ zIndex: 1 }}
                    getPopupContainer={trigger => trigger.parentNode}
                    allowClear
                    showSearch
                    filterOption={filterSelectOption}
                    onChange={value => {
                      // setJobCate(value)
                      form.setFieldsValue({ experienceJob: undefined })
                    }}
                  >
                    {categoryList
                      .filter(category => category.parentId === 0)
                      .map(item => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={11}>
                <div className={styles.title}>
                  S??? l?????ng tuy???n d???ng<span className={styles.textRequired}>*</span>
                </div>
                <Form.Item
                  name="hireCount"
                  rules={[
                    {
                      required: true,
                      message: 'S??? l?????ng tuy???n d???ng ??t nh???t m???t ng?????i!',
                    },
                    { type: 'number', max: 5000, message: 'S??? l?????ng tuy???n d???ng t???i ??a 5000 ng?????i!' },

                  ]}
                >
                  <InputNumber
                    className="custom-text-left-input"
                    controls={false}
                    min="1"
                    placeholder="Nh???p s??? l?????ng"
                    formatter={value => formatNumber(value)}
                    parser={(value: string | undefined) => parseNumber(value)}
                    // style={{width: "100%"}}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row className='justify-content-between'>
              <Col xs={24} md={11}>
                <div className={styles.title}>
                  M???c l????ng<span className={styles.textRequired}>*</span>
                </div>
                <Form.Item
                  name="salaryType"
                  rules={[
                    {
                      required: true,
                      message: 'M???c l????ng kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={() => {
                      form.setFieldsValue({
                        salaryMin: undefined,
                        salaryMax: undefined,
                        salaryUnit: undefined,
                      })
                    }}
                  // defaultValue={jobConstant.salaryType.range.key}
                  >
                    <Radio value={jobConstant.salaryType.range.key}>
                      {jobConstant.salaryType.range.value}
                    </Radio>
                    <Radio value={jobConstant.salaryType.deal.key}>
                      {jobConstant.salaryType.deal.value}
                    </Radio>
                  </Radio.Group>
                </Form.Item>
                <div className="hiring_salary">
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      if (getFieldValue('salaryType') === jobConstant.salaryType.range.key)
                        return (
                          <div className={styles.employmentInfo_salary}>
                            <div className={styles.employmentInfo_salary_range}>
                              <div className={styles.employmentInfo_salary_range_item}>
                                {/* <div className={styles.employmentInfo_salary_range_title}>T???:</div> */}
                                <Form.Item
                                  name="salaryMin"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'M???c l????ng kh??ng ???????c ????? tr???ng!',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    controls={false}
                                    className='custom-addon-input-number'
                                    step={1000}
                                    min={1}
                                    addonBefore="T???"
                                    formatter={value => formatNumber(value)}
                                    parser={(value: string | undefined) => parseNumber(value) || 1}
                                  />
                                </Form.Item>
                              </div>
                              <div className={styles.employmentInfo_salary_range_item}>
                                {/* <div className={styles.employmentInfo_salary_range_title}>?????n:</div> */}
                                <Form.Item
                                  name="salaryMax"
                                  rules={[
                                    {
                                      required: true,
                                      message: 'M???c l????ng kh??ng ???????c ????? tr???ng!',
                                    },
                                  ]}
                                >
                                  <InputNumber
                                    controls={false}
                                    className='custom-addon-input-number'
                                    step={1000}
                                    addonBefore="?????n"
                                    min={Number(getFieldValue('salaryMin')) + 1 || 0}
                                    formatter={value => formatNumber(value)}
                                    parser={(value: string | undefined) => parseNumber(value) || (Number(getFieldValue('salaryMin')) + 1)}
                                  />
                                </Form.Item>
                              </div>
                              <div className={styles.employmentInfo_salary_range_item}>
                                {/* <div className={styles.employmentInfo_salary_range_title}>VN??&nbsp;/</div> */}
                                <Form.Item
                                  name="salaryUnit"
                                  rules={[
                                    {
                                      required: true,
                                      message: '????n v??? th???i gian kh??ng ???????c ????? tr???ng!',
                                    },
                                  ]}
                                // initialValue={jobConstant.wageUnit.month.id}
                                >
                                  <Select
                                    placeholder="VN?? / Th??ng"
                                    getPopupContainer={trigger => trigger.parentNode}
                                    allowClear>
                                    {wageUnitList.reverse().map(item => (
                                      <Option key={item.id} value={item.id}>
                                        VN?? / {item.name}
                                      </Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                              </div>
                            </div>
                          </div>
                        )
                      if (getFieldValue('salaryType') === jobConstant.salaryType.deal.key)
                        return (
                          <div className={styles.employmentInfo_salary}>
                            <div className={styles.employmentInfo_salary_deal}>
                              <Form.Item
                                name="salaryMax"
                                rules={[
                                  {
                                    required: true,
                                    message: 'M???c l????ng kh??ng ???????c ????? tr???ng!',
                                  },
                                ]}
                              >
                                <InputNumber
                                  className='custom-addon-input-number'
                                  addonBefore="T???i ??a"
                                  step={1000}
                                  min={1}
                                  controls={false}
                                  formatter={value => formatNumber(value)}
                                  parser={(value: string | undefined) => parseNumber(value) || 1}
                                />
                              </Form.Item>
                              {/* <div className={styles.employmentInfo_salary_deal_unit}>VN??&nbsp;/</div> */}
                              <Form.Item
                                name="salaryUnit"
                                rules={[
                                  {
                                    required: true,
                                    message: '????n v??? th???i gian kh??ng ???????c ????? tr???ng!',
                                  },
                                ]}
                              >
                                <Select
                                  placeholder="VN?? / Th??ng"
                                  getPopupContainer={trigger => trigger.parentNode}
                                  allowClear
                                >
                                  {wageUnitList.reverse().map(item => (
                                    <Option key={item.id} value={item.id}>
                                      VN?? / {item.name}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                          </div>
                        )

                    }}
                  </Form.Item>
                </div>
              </Col>
              <Col xs={24} md={11}>
                <div className={styles.title}>
                  Lo???i h??nh c??ng vi???c<span className={styles.textRequired}>*</span>
                </div>
                <Form.Item
                  name="jobType"
                  rules={[
                    {
                      required: true,
                      message: 'Lo???i h??nh c??ng vi???c kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={e => {
                      form.setFieldsValue({ "shortWorkTime": [] })
                    }}
                  // defaultValue={jobConstant.jobType.short.key}
                  >
                    <Radio value={jobConstant.jobType.short.key}>{jobConstant.jobType.short.value}</Radio>
                    <Radio value={jobConstant.jobType.long.key}>{jobConstant.jobType.long.value}</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) =>
                    getFieldValue('jobType') === jobConstant.jobType.short.key && (
                      <div className={styles.employmentInfo_jobType}>
                        <Form.Item
                          name="shortWorkTime"
                          rules={[
                            {
                              required: true,
                              message: 'Th???i gian l??m vi???c kh??ng ???????c ????? tr???ng!',
                            },
                          ]}
                        >
                          <DatePicker.RangePicker
                            format={dateFormat}
                            placeholder={['Ng??y b???t ?????u', 'Ng??y k???t th??c']}
                            disabledDate={disabledDatePost}
                          />
                        </Form.Item>
                      </div>
                    )
                  }
                </Form.Item>
              </Col>
            </Row>
            <div className={`${styles.title} mt-4`}>
              ?????a ch??? n??i l??m vi???c<span className={styles.textRequired}>*</span>
            </div>
            <div className="hiring_workAddress">
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  if (getFieldValue('addressType') === jobConstant.recruit.person.key)
                    return (
                      <div className={styles.employmentInfo_workAddress}>
                        <Form.Item
                          name="userAddress"
                          rules={[
                            {
                              required: true,
                              message: '?????a ch??? l??m vi???c kh??ng ???????c ????? tr???ng!',
                            },
                          ]}
                        >
                          <Select

                            getPopupContainer={trigger => trigger.parentNode}
                            allowClear
                            dropdownClassName={
                              isModalMap
                                ? styles.employmentInfo_workAddress_dropdown_hide
                                : styles.employmentInfo_workAddress_dropdown_show
                            }
                            dropdownRender={menu => (
                              <div className={styles.employmentInfo_address}>
                                {menu}
                                <Divider />
                                <div className={styles.employmentInfo_address_form}>
                                  <button
                                    type="button"
                                    className={styles.employmentInfo_address_add}
                                    onClick={() => handleChangeAddress(jobConstant.recruit.person.key)}
                                  >
                                    <PlusOutlined /> Th??m ?????a ch???
                                  </button>
                                </div>
                              </div>
                            )}
                          >
                            {userAddress.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.address}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    )

                  if (getFieldValue('addressType') === jobConstant.recruit.company.key)
                    return (
                      <div className={`hiring_cascader ${styles.employmentInfo_workAddress}`}>
                        <Form.Item
                          name="companyAddressId"
                          rules={[
                            {
                              required: true,
                              message: '?????a ch??? l??m vi???c kh??ng ???????c ????? tr???ng!',
                            },
                          ]}
                        >
                          <Select
                            getPopupContainer={trigger => trigger.parentNode}
                            allowClear
                            dropdownClassName={
                              isModalMap
                                ? styles.employmentInfo_workAddress_dropdown_hide
                                : styles.employmentInfo_workAddress_dropdown_show
                            }
                            dropdownRender={menu => {
                              const isAdminOfCompany = userCompany.find((item: any) => item.id === selectedCompany && item.userRole === userRoleInCompany.admin);

                              return (
                                <div className={styles.employmentInfo_address}>
                                  {menu}
                                  {
                                    isAdminOfCompany &&
                                    <>
                                      <Divider />
                                      <div className={styles.employmentInfo_address_form}>
                                        <button
                                          type="button"
                                          className={styles.employmentInfo_address_add}
                                          onClick={() => handleChangeAddress(jobConstant.recruit.company.key)}
                                        >
                                          <PlusOutlined /> Th??m ?????a ch???
                                        </button>
                                      </div>
                                    </>
                                  }
                                </div>
                              )
                            }}
                          >
                            {companyAddress.map(item => (
                              <Option key={item.id} value={item.id}>
                                {item.address}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </div>
                    )

                  return (
                    <div className={styles.employmentInfo_workAddress}>
                      <div className="font-italic">Vui l??ng ch???n t?? c??ch ????ng tuy???n!</div>
                    </div>
                  )
                }}
              </Form.Item>
            </div>
          </div>
        </div>

        <div className={styles.section_form_hiring}>
          <div className={styles.content_wrap}>
            <div className={`${styles.title} mt-4`}>
              L???ch l??m vi???c<span className={styles.textRequired}>*</span>
            </div>
            <Form.Item
              name="calendarType"
              rules={[
                {
                  required: true,
                  message: 'L???ch l??m vi???c kh??ng ???????c ????? tr???ng!',
                },
              ]}
            >
              <Radio.Group
                onChange={e => {
                  form.setFieldsValue({ workShift: [], workHour: [] })
                  // if (e.target.value === jobConstant.calendarType.hour.key)
                  //   form.setFieldsValue({ workShift: [] })
                  // if (e.target.value === jobConstant.calendarType.shift.key)
                  //   form.setFieldsValue({ workHour: [] })
                }}
              >
                <Radio value={jobConstant.calendarType.hour.key}>
                  {jobConstant.calendarType.hour.value}
                </Radio>
                <Radio value={jobConstant.calendarType.shift.key}>
                  {jobConstant.calendarType.shift.value}
                </Radio>
              </Radio.Group>
            </Form.Item>

            <div className="hiring_workTime">
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  if (getFieldValue('calendarType') === jobConstant.calendarType.hour.key)
                    return (
                      <div className={styles.employmentInfo_workCalendar}>
                        <Form.Item
                          name="workHour"
                          rules={[
                            {
                              required: true,
                              message: 'Gi??? l??m vi???c kh??ng ???????c ????? tr???ng!',
                            },
                          ]}
                        >
                          <TimePicker.RangePicker
                            format={timeFormat}
                            // minuteStep={15}
                            placeholder={['Gi??? b???t ?????u', 'Gi??? k???t th??c']}
                          />
                        </Form.Item>
                      </div>
                    )
                  if (getFieldValue('calendarType') === jobConstant.calendarType.shift.key)
                    return (
                      <div className={styles.employmentInfo_workCalendar}>
                        {!getFieldValue('jobCate') ? (
                          <div className="font-italic mb-4">Vui l??ng ch???n ng??nh ngh??? ????ng tuy???n!</div>
                        ) : (
                          <Form.Item
                            name="workShift"
                            rules={[
                              {
                                required: true,
                                message: 'Ca l??m vi???c kh??ng ???????c ????? tr???ng!',
                              },
                            ]}
                          >
                            <Checkbox.Group>
                              {shiftList
                                .filter(shift => shift.categoryId === form.getFieldValue('jobCate'))
                                .map(item => (
                                  <Checkbox key={item.id} value={item.id} className="mr-md-4">
                                    {item.name === 'Ca s??ng' && 'Ca s??ng (6:00-14:00)'}
                                    {item.name === 'Ca chi???u' && 'Ca chi???u (14:00-22:00)'}
                                    {item.name === 'Ca ????m' && 'Ca ????m (22:00-6:00 h??m sau)'}
                                  </Checkbox>
                                ))}
                            </Checkbox.Group>
                          </Form.Item>
                        )}
                      </div>
                    )
                }}
              </Form.Item>
            </div>
            <div className={`${styles.title} mt-4`}>
              Ng??y l??m vi???c<span className={styles.textRequired}>*</span>
            </div>

            <Form.Item
              name="dayOfWeek"
              rules={[
                {
                  required: true,
                  message: 'Ng??y l??m vi???c kh??ng ???????c ????? tr???ng!',
                },
              ]}
            >
              <Checkbox.Group onChange={handleChangeDayOfWeek}>
                {dayList.map(item => (
                  <Checkbox key={item.id} value={item.id}>
                    {item.name}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Form.Item>
            <Form.Item
              name='workingDayNote'

            >
              <Input placeholder='Ghi ch??: vd th??? 7 l??m vi???c bu???i s??ng' maxLength={9999} />
            </Form.Item>

            <div className={`${styles.title} mt-4`}>
              M?? t??? c??ng vi???c<span className={styles.textRequired}>*</span>
            </div>

            <div className="hiring_desc">
              <Form.Item
                name="detailDesc"
                rules={[
                  {
                    required: true,
                    message: 'Tr?????ng m?? t??? c??ng vi???c kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </div>

            <div className={`${styles.hiring_upload} py-4 mb-4`}>
              <div className={`${styles.title_video} text-center`}>
                Th??m h??nh ???nh m?? t??? c??ng vi???c
              </div>
              <div className={`${styles.description} text-center`}>
                (????ng file h??nh ???nh .png, .jpg r?? n??t. Dung l?????ng file kh??ng v?????t qu?? 5MB)
              </div>
              <div className='d-flex justify-content-center mt-4'>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="imageUrl">
                      <UploadFile
                        getAvatar={ava => {
                          form.setFieldsValue({ imageUrl: ava })
                        }}
                        data={getFieldValue('uploadFile')}
                        handleSetValue={val => form.setFieldsValue({ uploadFile: val })}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </div>

            </div>

          </div>
        </div>

        <div className={styles.section_form_hiring}>
          <div className={styles.content_wrap}>
            <Row className='justify-content-between'>
              <Col xs={24} md={11}>
                <div className={`${styles.title} mt-4`}>
                  Gi???i t??nh <span className={styles.note_title}>(????? tr???ng n???u kh??ng y??u c???u)</span>
                </div>
                {/* <Form.Item name="genderType">
                  <Radio.Group onChange={() => {
                    form.setFieldsValue({ chooseGender: [] });
                  }}>
                    <Radio value={jobConstant.genderType.notRequire.key}>
                      {jobConstant.genderType.notRequire.value}
                    </Radio>
                    <Radio value={jobConstant.genderType.chooseGender.key}>
                      {jobConstant.genderType.chooseGender.value}
                    </Radio>
                  </Radio.Group>
                </Form.Item> */}
                <div className="hiring_gender">
                  {/* <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      if (getFieldValue('genderType') === jobConstant.genderType.chooseGender.key)
                        return ( */}
                  <div className={styles.employmentInfo_gender}>
                    <Form.Item name="chooseGender">
                      <Checkbox.Group>
                        {genderList.map(item => (
                          <Checkbox key={item.id} value={item.id}>
                            {item.name}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </Form.Item>
                  </div>
                  {/* )
                    }}
                  </Form.Item> */}
                </div>
              </Col>
              <Col xs={24} md={11}>
                <div className={`${styles.title} mt-4`}>
                  ????? tu???i <span className={styles.note_title}>(????? tr???ng n???u kh??ng y??u c???u)</span>
                </div>
                {/* <Form.Item name="ageType">
                  <Radio.Group
                    onChange={() => {
                      form.setFieldsValue({ ageFrom: undefined, ageTo: undefined })
                    }}
                  >
                    <Radio value={jobConstant.ageType.notRequire.key}>
                      {jobConstant.ageType.notRequire.value}
                    </Radio>
                    <Radio value={jobConstant.ageType.chooseAge.key}>
                      {jobConstant.ageType.chooseAge.value}
                    </Radio>
                  </Radio.Group>
                </Form.Item> */}
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) =>
                    <div className={styles.employmentInfo_age}>
                      <div className={styles.employmentInfo_age_list}>
                        <Form.Item name="ageFrom">
                          <InputNumber
                            controls={false}
                            className='custom-addon-input-number'
                            addonBefore='T???'
                            min={(configConstant.age.minAge + 1) || undefined}
                            max={(configConstant.age.maxAge - 1) || undefined}
                          />
                        </Form.Item>
                        <Form.Item name="ageTo">
                          <InputNumber
                            controls={false}
                            className='custom-addon-input-number'
                            addonBefore='?????n'
                            min={(Number(getFieldValue('ageFrom')) === configConstant.age.maxAge - 1
                              ? Number(getFieldValue('ageFrom'))
                              : Number(getFieldValue('ageFrom')) + 1) || undefined}
                            max={(configConstant.age.maxAge - 1) || undefined} />
                        </Form.Item>
                        {/* <div className={styles.employmentInfo_age_text}> tu???i</div> */}
                      </div>
                    </div>
                  }
                </Form.Item>
              </Col>

            </Row>
            <Row className='justify-content-between'>
              <Col xs={24} md={11}>
                <div className={`${styles.title} mt-4`}>
                  Tr??nh ????? h???c v???n <span className={styles.note_title}>(????? tr???ng n???u kh??ng y??u c???u)</span>
                </div>
                <Form.Item name="educationLevel">
                  <Select
                    placeholder="Ch???n tr??nh ????? h???c v???n"
                    getPopupContainer={trigger => trigger.parentNode} allowClear>
                    <Option key={0} value={0} >
                      Kh??ng y??u c???u
                    </Option>
                    {educationList.map(item => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

              </Col>
              <Col xs={24} md={11}>
                <Row className='justify-content-between'>
                  <div className={`${styles.title} mt-4`}>
                    Kinh nghi???m y??u c???u <span className={styles.note_title}>(????? tr???ng n???u kh??ng y??u c???u)</span>
                  </div>
                  <Col xs={24} md={11}>
                    <Form.Item noStyle shouldUpdate>
                      {({ getFieldValue }) => {
                        if (!getFieldValue('jobCate')) {
                          return (
                            <Form.Item name="experienceJob">
                              <div className="font-italic">Vui l??ng ch???n ng??nh ngh??? ????ng tuy???n!</div>
                            </Form.Item>
                          )
                        }
                        return (
                          <Form.Item name="experienceJob">
                            <Select
                              placeholder="L??nh v???c y??u c???u"
                              getPopupContainer={trigger => trigger.parentNode}
                              allowClear
                              mode="multiple"
                              onChange={value => {
                                setSelectExperience(value)
                              }}
                              maxTagCount='responsive'
                            >
                              {categoryList
                                .filter(cate => cate.parentId === form.getFieldValue('jobCate'))
                                .map(item => (
                                  <Option
                                    key={item.id}
                                    value={item.id}
                                    disabled={
                                      selectExperience.length > 2 ? !selectExperience.includes(item.id) : false
                                    }
                                  >
                                    {item.name}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        )
                      }}
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={11}>
                    <Form.Item name="experienceTime">
                      <Select
                        placeholder="Th???i gian kinh nghi???m"
                        getPopupContainer={trigger => trigger.parentNode} allowClear>
                        <Option value={1}>Kh??ng y??u c???u</Option>
                        {experienceList.map(item => (
                          <Option key={item.id} value={item.id}>
                            {item.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

              </Col>
            </Row>
            <div className={`${styles.title} mt-4`}>
              Ph??c l???i ????i ng??? <span className={styles.note_title}>(????? tr???ng n???u kh??ng y??u c???u)</span>
            </div>
            <Form.Item name="benefitPolicy">
              <Select
                placeholder="Ch???n ph??c l???i ????i ng???"
                getPopupContainer={trigger => trigger.parentNode} mode="multiple" allowClear maxTagCount="responsive">
                {benefitList.map(item => (
                  <Option key={item.id} value={item.id}>
                    <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>
                    <Image preview={ false} src={ item.imageUrl}/>
                    <span style={{marginLeft:"10px"}}>{item.name}</span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div className={`${styles.title} mt-4`}>
              Y??u c???u th??m
            </div>
            <div className="hiring_desc">
              <Form.Item name="moreRequire" >
                <TextArea autoSize={{ minRows: 4 }} placeholder="V?? d???: Y??u c???u giao ti???p t???t b???ng ti???ng Nh???t." />
              </Form.Item>
            </div>
          </div>
        </div>


        <div className="hiring_continue d-flex justify-content-center py-4">
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              console.log("form step1", form.getFieldsValue());
              handleChangeStep(jobConstant.stepPost.step2)
            }
          }
          >
            Ti???p t???c
            <CaretRightOutlined />
          </Button>
        </div>

      </Form>
      <Modal
        onCancel={handleCloseModalMap}
        visible={isModalMap}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">{`Th??m ?????a ch??? cho: ${selectedAddressType?.name} `}</div>
          <Map handlePostAddress={handlePostAddress} handleCloseModalMap={handleCloseModalMap} />
        </div>
      </Modal>
    </div>
  )
}

export default EmploymentInfo
