import React, { FC, useEffect, useState } from 'react'

import { Avatar, Button, Divider, Image, message, Modal, Spin } from 'antd'
import { getSearchCompanyApi, postSaveAddressCompanyApi, postCreateNewCompanyApi } from 'api/client/company'
import { getProfileApi } from 'api/client/user'
import { Formik } from 'formik'
import { Form, Input, InputNumber } from 'formik-antd'
import { useTranslation } from 'react-i18next'
import Map from 'src/components/elements/Map/Map'
import { configConstant } from 'src/constants/configConstant'
import defaultConstant from 'src/constants/defaultConstant'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useDebounceValue } from 'src/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { firebase } from 'src/utils/firebase'
import { handleError } from 'src/utils/helper'
import { phoneRegExp } from 'src/utils/patterns'
import * as Yup from 'yup'

import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons'

import styles from './step7.module.scss'

interface FormBusiness {
  companyName: string
  abbreviations: string
  phoneNumber: string
  website: string
  companySize: string
}
interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}
const StepSevenSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [addressesER, setAddressesER] = useState<Auth.UserAddressPayload[]>([])
  const [isModalMap, setIsModalMap] = useState(false)
  const [isModalCompany, setIsModalCompany] = useState(false)

  const [dataUser, setDataUser] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [resultsSearch, setResultsSearch] = useState<CompanyGlobal.CompanyDetail[]>([])
  const [companyChoose, setCompanyChoose] = useState<CompanyGlobal.CompanyDetail>()
  const { t } = useTranslation()
  const profile = useAppSelector(state => state.user.profile || {})
  const { FjobIndustry } = useAppSelector(state => state.initData.data)
  const dispatch = useAppDispatch()
  const debouncedSearchTerm = useDebounceValue(searchTerm, 1000)
  const handleCloseModalMap = () => {
    setIsModalMap(false)
  }
  const handleCloseModalCompany = () => {
    setIsModalCompany(false)
  }

  const [userRole, setUserRole] = useState(roleConstant.EE.name)
  
  useEffect(() => {
    const userRoleRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (userRoleRaw) {
      setUserRole(JSON.parse(userRoleRaw).role)
    }
  }, [])

  useEffect(
    () => {
      // console.log('debouncedSearchTerm', debouncedSearchTerm)
      if (debouncedSearchTerm) {
        setIsSearching(true)
        searchCharacters(searchTerm)
      } else {
        setResultsSearch([])
        setIsSearching(false)
      }
    },
    [debouncedSearchTerm], // Only call effect if debounced search term changes
  )

  const searchCharacters = async (search: string) => {
    try {
      const { data } = await getSearchCompanyApi(search)
      setResultsSearch(data.data)
      setIsSearching(false)
    } catch (error) {
      handleError(error)
    }
  }

  const renderResultSearch = resultsSearch.map(company => (
    <div
      key={company.id}
      className={styles.main_item_search}
      onClick={() => {
        setIsModalCompany(true)
        setCompanyChoose(company)
      }}
    >
      <div className={styles.main_item_search_item}>
        <Avatar
          size="large"
          icon={
            <Image
              preview={false}
              src={company.avatar === '' ? defaultConstant.defaultAvatarUser : company.avatar}
            />
          }
        />
        <span style={{ marginLeft: '10px' }}>{company.name}</span>
      </div>
      <Divider />
    </div>
  ))

  const handleSubmit = async (values: FormBusiness) => {
    setLoading(true)
    try {
      // Create new company
      const { data } = await postCreateNewCompanyApi({
        name: values.companyName,
        shortName: values.abbreviations,
        contactPhone: values.phoneNumber,
        website: values.website,
        numEmployee: parseInt(values.companySize, 10),
        industryId: 0,
        desc: ' ',
        isVerified: 0,
        parentId: 0,
        avatar: defaultConstant.defaultLinkAvatarUser,
        imagesJson: '',
      })

      // Update multiple addresses for company
      const formatAddress = Array.from(addressesER.map(item => ({ ...item, companyId: data.id })))
      if (formatAddress.length) {
        Promise.all(formatAddress.filter(item => postSaveAddressCompanyApi(item)))
          .then()
          .catch(error => {
            if ((error as ErrorMsg).response?.data) {
              handleError(error)
            } else {
              message.error(t('error.unknown'))
            }
          })
      }

      // Update companyId for user in redux
      // await patchUserInfomationApi(
      //   {
      //     ...dataUser,
      //     companyId: data.id,
      //   },
      //   dataUser.code,
      // )
      // dispatch(getProfileRequest({ userCode: dataUser.code }))

      // save step in localstorage
      const saveLocal = {
        status: 1,
        step: 6,
        role: userRole,
        code: profile.code
      }
      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
      getCurrentStep(6)
      setLoading(false)
      firebase.analytics().logEvent(firebaseAnalytics.signUp)
      if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.production) {
        import('react-facebook-pixel').then(x => x.default).then(ReactPixel => {
          ReactPixel.init(`${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}`)
          ReactPixel.track("Web_signup_done", dataUser);
        })
      }
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }
  const handlePostAddress = async data => {
    setAddressesER([...addressesER, data])
  }

  useEffect(() => {
    const updateDataUser = async () => {
      if (profile !== null) {
        setDataUser(profile)
      } else {
        const userCode = localStorage.getItem(storageConstant.localStorage.userCode)
        if (userCode) {
          try {
            const { data } = await getProfileApi(userCode)
            setDataUser(data.data)
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
    updateDataUser()
  }, [])

  const showAddressER = addressesER.map((address, index) => (
    <div key={index}>
      <div className={styles.main_form_address_exist}>
        <span>
          {index + 1}. {address.address}
        </span>
        <DeleteTwoTone
          onClick={async () =>
            setAddressesER(addressesER.filter(item => item.address !== address.address))
          }
          className={styles.info_delete}
          style={{ marginLeft: '10px' }}
          twoToneColor="red"
        />
      </div>
      <Divider />
    </div>
  ))

  const formCompanySchema = Yup.object().shape({
    companyName: Yup.string()
      .min(2, '* Tên công ty quá ngắn')
      .max(255, '* Tên công ty quá dài')
      .required('* Tên công ty là bắt buộc'),
    abbreviations: Yup.string().min(2, '* Tên công ty quá ngắn').max(10, '* Tên công ty quá dài'),
    companySize: Yup.string().required('* Quy mô công ty là bắt buộc').nullable(),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, '* Số điện thoại không hợp lệ')
      .min(10, '* Số điện thoại không hợp lệ')
      .max(11, '* Số điện thoại không hợp lệ')
      .required('* Số điện thoại công ty là bắt buộc'),
    website: Yup.string().min(4, '* Website quá ngắn').max(30, '* Website quá dài'),
  })

  const renderIndustryName = () => {
    const industryName = FjobIndustry.find(item => item.id === companyChoose?.industryId)
    if (industryName) {
      return industryName.name
    }
    return 'Không có'
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_text}>
        <p className={styles.text_role}>Thông tin doanh nghiệp</p>
      </div>
      {
        <Formik
          initialValues={{
            companyName: '',
            abbreviations: '',
            companySize: '',
            phoneNumber: '',
            website: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={formCompanySchema}
        >
          {({ errors, touched }) => (
            <Form>
              <div className={styles.main_item}>
                <Input
                  name="companyName"
                  // onChange={value => setPhone(value.target.value)}
                  style={{ borderRadius: '6px', width: '100%', padding: '0 10px', height: 44 }}
                  placeholder={t('signup.nameCompany')}
                />
                {errors.companyName && touched.companyName ? (
                  <div className={styles.error}>{errors.companyName} </div>
                ) : null}
                <div className={styles.main_item_box}>
                  <Input
                    name="abbreviations"
                    // onChange={value => setPhone(value.target.value)}
                    style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '0 10px', height: 44 }}
                    placeholder={t('signup.abbreviationsCompany')}
                  />

                  <Input
                    min={1}
                    type="number"
                    name="companySize"
                    // onChange={value => setPhone(value.target.value)}
                    style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '0 10px', height: 44 }}
                    placeholder={t('signup.CompanySize')}
                    size="small"
                  />
                </div>

                <div className={styles.main_item_box} style={{ marginTop: '0px' }}>
                  {errors.abbreviations && touched.abbreviations ? (
                    <div className={styles.error}>{errors.abbreviations} </div>
                  ) : (
                    <div style={{ width: '50%' }} />
                  )}
                  {errors.companySize && touched.companySize ? (
                    <div
                      style={{ textAlign: 'left', width: '50%', paddingLeft: '10px' }}
                      className={styles.error}
                    >
                      {errors.companySize}{' '}
                    </div>
                  ) : null}
                </div>
                <div className={styles.main_item_box}>
                  <Input
                    name="phoneNumber"
                    style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '0 10px', height: 44 }}
                    placeholder={t('Số điện thoại')}
                  />
                  <Input
                    name="website"
                    style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '0 10px', height: 44 }}
                    placeholder={t('Website')}
                  />
                </div>

                <div className={styles.main_item_box} style={{ marginTop: '0px' }}>
                  {errors.phoneNumber && touched.phoneNumber ? (
                    <div className={styles.error}>{errors.phoneNumber} </div>
                  ) : (
                    <div style={{ width: '50%' }} />
                  )}
                  {errors.website && touched.website ? (
                    <div
                      style={{ textAlign: 'left', width: '50%', paddingLeft: '10px' }}
                      className={styles.error}
                    >
                      {errors.website}{' '}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={styles.main_item}>
                <p className={styles.main_item_title}>{t('Địa chỉ doanh nghiệp')}</p>
                {showAddressER}
                <p onClick={() => setIsModalMap(true)} className={styles.main_form_address_addnew}>
                  <PlusCircleTwoTone twoToneColor="#8218D1" style={{ marginRight: '10px' }} />
                  Thêm địa chỉ
                </p>
              </div>
              <Button className={styles.btn} htmlType="submit">
                {loading ? <Spin /> : t('Tiếp tục')}
              </Button>
            </Form>
          )}
        </Formik>
      }
      <Modal
        onCancel={handleCloseModalMap}
        visible={isModalMap}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">{`Thêm địa chỉ  `}</div>
          <Map handlePostAddress={handlePostAddress} handleCloseModalMap={handleCloseModalMap} />
        </div>
      </Modal>

      <Modal
        onCancel={handleCloseModalCompany}
        visible={isModalCompany}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Thông tin doanh nghiệp</div>
          {companyChoose && (
            <div className={styles.modal}>
              <div className={styles.avatar}>
                <Avatar
                  size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                  icon={
                    <Image
                      preview={false}
                      src={
                        companyChoose.avatar === ''
                          ? defaultConstant.defaultAvatarUser
                          : companyChoose.avatar
                      }
                    />
                  }
                />
                <span style={{ color: companyChoose.isVerified ? 'green' : '#ce2124c9' }}>
                  {companyChoose.isVerified
                    ? 'Doanh nghiệp đã xác thực'
                    : 'Doanh nghiệp chưa xác thực'}
                </span>
              </div>
              <div className={styles.content}>
                <span className={styles.title}>Giới thiệu</span>
                <div className={styles.item}>
                  <span>
                    Tên doanh nghiệp :{' '}
                    <span style={{ fontWeight: 'bold' }}> {companyChoose.name}</span>
                  </span>
                </div>
                <div className={styles.item}>
                  <span>
                    Tên Viết tắt :{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {companyChoose.shortName === '' ? 'Không có' : companyChoose.shortName}
                    </span>
                  </span>
                </div>
                <div className={styles.item}>
                  <span>
                    Ngành nghề : <span style={{ fontWeight: 'bold' }}>{renderIndustryName()}</span>
                  </span>
                </div>
                <Divider />
                <span className={styles.title}>Thông tin liên hệ</span>
                <div className={styles.item}>
                  <span>
                    Địa chỉ : <span style={{ fontWeight: 'bold' }}> {companyChoose.name}</span>
                  </span>
                </div>
                <div className={styles.item}>
                  <span>
                    Điện thoại :{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {companyChoose.shortName === '' ? 'Không có' : companyChoose.contactPhone}
                    </span>
                  </span>
                </div>
                <div className={styles.item}>
                  <span>
                    Website: <span style={{ fontWeight: 'bold' }}>{companyChoose.website}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default StepSevenSignUp
