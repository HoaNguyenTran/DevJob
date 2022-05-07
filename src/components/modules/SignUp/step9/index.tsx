import React, { FC, useEffect, useState } from 'react'

import { Avatar, Button, Divider, Image, message, Modal, Spin } from 'antd'
import { getSearchCompanyApi, postSaveAddressCompanyApi, postCreateNewCompanyApi } from 'api/client/company'
import { getProfileApi, patchUpdateUserApi } from 'api/client/user'
import { Formik } from 'formik'
import { Form, Input } from 'formik-antd'
import { useTranslation } from 'react-i18next'
import { configConstant } from 'src/constants/configConstant'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useDebounceValue } from 'src/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { firebase } from 'src/utils/firebase'
import { handleError } from 'src/utils/helper'
import { phoneRegExp } from 'src/utils/patterns'
import * as Yup from 'yup'

import { SearchOutlined } from '@ant-design/icons'

import styles from './step9.module.scss'

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
  const [loadingJoining, setLoadingJoining] = useState<boolean>(false)
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
              src={company.avatar === '' ? configConstant.defaultAvatar : company.avatar}
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
        avatar: 'https://storage.googleapis.com/fjob-dev/bcedc860-5ffc-11ec-a2ed-8945ee31ff60.png',
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
        status: 0,
        step: 5,
        role: userRole,
        code: profile.code
      }
      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
      getCurrentStep(5)
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

  const joinCompany = async () => {
    setLoadingJoining(true)
    try {
      await patchUpdateUserApi(profile.code, {
        ...profile,
        companyId: companyChoose?.id,
      })
      dispatch(getProfileRequest({ userCode: profile.code }))
      const saveLocal = {
        status: 1,
        step: 6,
        role: userRole,
        code: profile.code
      }
      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
      getCurrentStep(6)
      setLoadingJoining(false)
    } catch (error) {
      handleError(error)
      setLoadingJoining(false)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_text}>
        <p className={styles.text_role}>Tham gia doanh nghiệp</p>
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
                  name="search"
                  // onChange={value => setPhone(value.target.value)}
                  style={{
                    borderRadius: '6px',
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#f5f5f5',
                  }}
                  className={styles.main_item_input}
                  suffix={<SearchOutlined />}
                  placeholder={t('Tìm kiếm doanh nghiệp')}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {!!renderResultSearch.length && (
                  <div className={styles.main_item_loading_search}>
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      {isSearching ? <Spin /> : renderResultSearch}
                    </div>
                  </div>
                )}
              </div>
              <Button className={styles.btn} htmlType="submit">
                {loading ? <Spin /> : t('Tiếp tục')}
              </Button>
            </Form>
          )}
        </Formik>
      }

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
                          ? configConstant.defaultAvatar
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
          <div>
            <button type="button" onClick={joinCompany} className={styles.btn}>
              {loadingJoining ? <Spin /> : 'Xin tham gia'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default StepSevenSignUp
