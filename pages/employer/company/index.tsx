import { AntDesignOutlined, DeleteTwoTone, LaptopOutlined, NotificationOutlined, PlusCircleTwoTone, SearchOutlined } from '@ant-design/icons'
import { Avatar, Button, Divider, Image, Input as Inp2, Layout, Menu, message, Modal, Spin, Tooltip } from 'antd'
import { getAllUserCompanyApi, getDetailCompanyApi, getSearchCompanyApi, postSaveAddressCompanyApi, postCreateNewCompanyApi } from 'api/client/company'
import { patchUpdateUserApi } from 'api/client/user'
import { Formik } from 'formik'
import { Form, Input, InputNumber } from 'formik-antd'
import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Map from 'src/components/elements/Map/Map'
import PendingCompany from 'src/components/draft/Business/PendingCompany'
import TabProfileBusiness from 'src/components/draft/Business/TabProfiile'
import { configConstant } from 'src/constants/configConstant'
import { roleConstant, userRoleInCompany } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useDebounceValue } from 'src/hooks/useDebounce'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { handleError } from 'src/utils/helper'
import { phoneRegExp } from 'src/utils/patterns'
import * as Yup from 'yup'
import { routerPathConstant } from 'src/constants/routerConstant'
import defaultConstant from 'src/constants/defaultConstant'
import styles from './company.module.scss'

const { Content, Sider } = Layout
const { SubMenu } = Menu
interface FormBusiness {
  companyName: string
  abbreviations: string
  phoneNumber: string
  website: string
  companySize: string
}
const ProfileBusinessPage: FC<{ isPending: any; isJoined: any }> = () => {
  const [loadingMainCompany, setLoadingMainCompany] = useState<boolean>(true)
  const [loadingContent, setLoadingContent] = useState<boolean>(false)
  const { profile } = useAppSelector(state => state.user)
  const [newJoined, setNewJoined] = useState<CompanyGlobal.CompanyDetail[]>()
  const [newPending, setNewPending] = useState<CompanyGlobal.CompanyDetail[]>()
  const [valueChange, setValueChange] = useState()
  const [mainCompany, setMainCompany] = useState<any>()
  const [isModalCompany, setIsModalCompany] = useState(false)
  const [isModalNewCompany, setIsModalNewCompany] = useState(false)
  const [isModalSearch, setIsModalSearch] = useState(false)
  const [resultsSearch, setResultsSearch] = useState<CompanyGlobal.CompanyDetail[]>([])
  const [addressesER, setAddressesER] = useState<Auth.UserAddressPayload[]>([])
  const [isModalMap, setIsModalMap] = useState(false)

  const [loading, setLoading] = useState<boolean>(false)

  const [companyChoose, setCompanyChoose] = useState<any>()
  const { FjobIndustry } = useAppSelector(state => state.initData.data)
  const [loadingJoining, setLoadingJoining] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounceValue(searchTerm, 1000)
  const [isSearching, setIsSearching] = useState(false)
  const { t } = useTranslation()

  const [detailCompany, setDetailCompany] = useState<CompanyGlobal.CompanyDetail>()
  const [itemChoose, setItemChoose] = useState<number>(profile?.companyId)
  const [firstRender, setFirstRender] = useState<boolean>(true)


  const size = useWindowDimensions()

  const getMainCompany = async id => {
    try {
      const { data } = await getDetailCompanyApi(id)
      if (data.userRole) {
        setMainCompany(data)
      }
      setLoadingMainCompany(false)
      setDetailCompany(data)
    } catch (error) {
      setLoadingMainCompany(false)
    }
  }

  const formCompanySchema = Yup.object().shape({
    companyName: Yup.string()
      .min(2, '* Tên công ty  quá ngắn')
      .max(255, '* Tên công ty  quá dài')
      .required('* Tên công ty là bắt buộc'),
    abbreviations: Yup.string().min(2, '* Tên công ty  quá ngắn').max(10, '* Tên công ty  quá dài'),
    companySize: Yup.string().required('* Quy mô công ty là bắt buộc').nullable(),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, '* Số điện thoại không hợp lệ')
      .min(10, '* Số điện thoại không hợp lệ')
      .max(11, '* Số điện thoại không hợp lệ')
      .required('* Số điện thoại công ty là bắt buộc'),
    website: Yup.string().min(4, '* Website quá ngắn').max(30, '* Website quá dài'),
  })

  const searchCharacters = async (search: string) => {
    try {
      const { data } = await getSearchCompanyApi(search)
      setResultsSearch(data.data)
      setIsSearching(false)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(
    () => {
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

  const getCompany = async id => {
    setLoadingContent(true)

    try {
      const { data } = await getDetailCompanyApi(id)
      setDetailCompany(data)
      setLoadingContent(false)
    } catch (error) {
      setLoadingContent(false)
    }
  }

  const getUserCompany = async () => {
    const { data } = await getAllUserCompanyApi()
    const isJoined = data.filter(item => item.userRole === userRoleInCompany.admin || item.userRole === userRoleInCompany.agent)
    const isPending = data.filter(item => item.userRole === 0)
    setNewPending(isPending)
    setNewJoined(isJoined)
  }

  useEffect(() => {
    getUserCompany()
    getMainCompany(profile?.companyId)
  }, [])

  useEffect(() => {
    // setLoadingContent(true)
    getCompany(itemChoose)
  }, [itemChoose])

  const renderJoined = newJoined?.map(item => (
    <Menu.Item key={item.id} onClick={value => {
      setItemChoose(Number(value.key))
      setFirstRender(false)
    }}>
      <Avatar
        size={25}
        icon={
          item.avatar !== '' ? <Image preview={false} src={item.avatar} /> : <AntDesignOutlined />
        }
      />
      <Tooltip placement="topLeft" title={item.name}>
        <span style={{ marginLeft: '10px' }}>{item.name}</span>
      </Tooltip>
    </Menu.Item>
  ))

  const renderPending = newPending?.map(item => (
    <Menu.Item key={item.id} onClick={value => {
      setItemChoose(Number(value.key))
      setFirstRender(false)
    }}>
      <Avatar
        size={25}
        icon={
          item.avatar !== '' ? <Image preview={false} src={item.avatar} /> : <AntDesignOutlined />
        }
      />
      <Tooltip placement="topLeft" title={item.name}>
        <span style={{ marginLeft: '10px' }}>{item.name}</span>
      </Tooltip>
    </Menu.Item>
  ))

  const getChangeCompany = companyId => {
    setValueChange(companyId)
  }

  const handleChangeAvatarCompany = async value => {
    const { data } = await getAllUserCompanyApi()
    const justJoined = data.filter(
      // item => (item.userRole === 1 || item.userRole === 2) && item.id !== profile.companyId,
      item => item.userRole === 1 || item.userRole === 2,
    )
    setNewJoined(justJoined)
  }

  const handleUserCompanyChange = async () => {
    if (valueChange) {
      const { data } = await getAllUserCompanyApi()
      const justJoined = data.filter(
        item => (item.userRole === 1 || item.userRole === 2) && item.id !== valueChange,
      )
      setNewJoined(justJoined)
      getMainCompany(valueChange)
    }
  }

  useEffect(() => {
    handleUserCompanyChange()
  }, [valueChange])

  const handleCloseModalCompany = () => {
    setIsModalCompany(false)
  }

  const handleCloseModalNewCompany = () => {
    setIsModalNewCompany(false)
  }

  const handleCloseModalSearch = () => {
    setIsModalSearch(false)
  }

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
      const penddingCompanyExist = newPending?.find(item => item.id === companyChoose?.id)
      const joinedCompanyExist = newJoined?.find(item => item.id === companyChoose?.id)

      if (!penddingCompanyExist && !joinedCompanyExist) {
        await patchUpdateUserApi(profile.code, {
          ...profile,
          companyId: companyChoose?.id,
        })
        dispatch(getProfileRequest({ userCode: profile.code }))
        setLoadingJoining(false)
        message.success('Xin tham gia vào công ty thành công')
        setIsModalCompany(false)
        getUserCompany()
      } else {
        message.error("Bạn đã yêu cầu tham gia vào công ty này hoặc đang thuộc công ty")
        setIsModalCompany(false)
        setLoadingJoining(false)
      }


    } catch (error) {
      handleError(error)
      setLoadingJoining(false)
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

  const saveCompany = async (values: FormBusiness) => {
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
            handleError(error)
          })
      }
      message.success('Tạo doanh nghiệp thành công')
      setIsModalNewCompany(false)
      setLoading(false)
      getUserCompany()
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }

  const showAddressER = addressesER.map((address, index) => (
    <div key={index}>
      <div className={styles.main_form_address_exist}>
        <span>
          {index + 1}. {address.address}
        </span>
        <DeleteTwoTone
          onClick={() => setAddressesER(addressesER.filter(item => item.address !== address.address))}
          className={styles.info_delete}
          style={{ marginLeft: '10px' }}
          twoToneColor="red"
        />
      </div>
      <Divider />
    </div>
  ))

  const handleCloseModalMap = () => {
    setIsModalMap(false)
  }

  const handlePostAddress = async data => {
    setAddressesER([...addressesER, data])
  }

  const renderButtonModal = () => {
    const penddingCompanyExist = newPending?.find(item => item.id === companyChoose?.id)
    const joinedCompanyExist = newJoined?.find(item => item.id === companyChoose?.id)
    if (penddingCompanyExist) {
      return (
        <button
          disabled
          type="button"
          // onClick={joinCompany}
          className={styles.btn}
          style={{ cursor: "not-allowed" }}
        >
          {loadingJoining ? <Spin /> : 'Đang chờ duyệt'}
        </button>
      )
    }

    if (joinedCompanyExist) {
      return (
        <button
          disabled
          type="button"
          onClick={joinCompany}
          className={styles.btn}
          style={{ cursor: "not-allowed" }}
        >
          {loadingJoining ? <Spin /> : 'Đã tham gia'}
        </button>
      )
    }

    return (
      <button
        disabled={loadingJoining}
        type="button"
        onClick={joinCompany}
        className={styles.btn}
      >
        {loadingJoining ? <Spin /> : 'Xin tham gia'}
      </button>
    )

  }

  return (
    <Layout>
      <Content style={{ padding: '20px 50px' }}>
        <div style={{ marginTop: '20px' }} />
        <Layout
          className={styles.background}
          style={{ borderRadius: '10px', minHeight: '100vh', padding: '24px 0' }}
        >
          <Sider className={styles.background} width={size.width && size.width > 768 ? 300 : 250}>
            <Menu
              mode="inline"
              // defaultSelectedKeys={[
              //   profile?.companyId === null ? '' : profile?.companyId.toString(),
              // ]}
              defaultOpenKeys={['sub2', 'sub3']}
              style={{ height: '100%' }}
            >
              <SubMenu key="sub2" icon={<LaptopOutlined />} title="Đang chờ duyệt">
                {renderPending}
              </SubMenu>
              <SubMenu key="sub3" icon={<NotificationOutlined />} title="Đã tham gia">
                {renderJoined}
              </SubMenu>
            </Menu>
          </Sider>
          <Content
            className="d-flex flex-column justify-content-start align-items-center"
            style={{
              padding: '0 24px',
              minHeight: 280,
            }}
          >
            <div className="w-100 d-flex flex-row justify-content-between align-items-center">
              <Button
                style={{ borderRadius: '10px', height: '44px', border: 'none' }}
                className="rounded-6 bg-success text-light"
                onClick={() => setIsModalNewCompany(true)}
              >
                Tạo doanh nghiệp
              </Button>
              <div className={styles.search} onClick={() => setIsModalSearch(true)}>
                <SearchOutlined size={50} style={{ fontSize: '20px', marginRight: '10px' }} />
                Tìm kiếm doanh nghiệp ...
              </div>
            </div>
            {loadingContent ? (
              <Spin />
            ) : (
              <>
                <Divider />
                {!firstRender && detailCompany &&
                  (!detailCompany.userRole ? (
                    <PendingCompany data={detailCompany} />
                  ) : (
                    <TabProfileBusiness
                      handleChangeAvatarCompany={handleChangeAvatarCompany}
                      getChangeCompany={getChangeCompany}
                      data={detailCompany}
                    />
                  ))}
              </>
            )}
          </Content>
        </Layout>
      </Content>
      <Modal
        onCancel={handleCloseModalSearch}
        visible={isModalSearch}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Tìm kiếm doanh nghiệp</div>
          <Divider />
          <Inp2
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
            placeholder="Tìm kiếm doanh nghiệp"
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
      </Modal>
      <Modal
        onCancel={handleCloseModalNewCompany}
        visible={isModalNewCompany}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Tạo doanh nghiệp mới</div>
          <Divider />
          <Formik
            initialValues={{
              companyName: '',
              abbreviations: '',
              companySize: '',
              phoneNumber: '',
              website: '',
            }}
            onSubmit={values => saveCompany(values)}
            validationSchema={formCompanySchema}
          >
            {({ errors, touched }) => (
              <Form>
                <div className={styles.main_item}>
                  <p className={styles.main_item_title}>{t('Thông tin doanh nghiệp')}</p>
                  <Input
                    name="companyName"
                    // onChange={value => setPhone(value.target.value)}
                    style={{ borderRadius: '6px', width: '100%', padding: '10px' }}
                    placeholder={t('signup.nameCompany')}
                  />
                  {errors.companyName && touched.companyName ? (
                    <div className={styles.error}>{errors.companyName} </div>
                  ) : null}
                  <div className={styles.main_item_box}>
                    <Input
                      name="abbreviations"
                      // onChange={value => setPhone(value.target.value)}
                      style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '10px' }}
                      placeholder={t('signup.abbreviationsCompany')}
                    />

                    <InputNumber
                      min={1}
                      name="companySize"
                      // onChange={value => setPhone(value.target.value)}
                      style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '10px' }}
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
                      size="large"
                      name="phoneNumber"
                      style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '10px' }}
                      placeholder={t('Số điện thoại')}
                    />
                    <Input
                      size="large"
                      name="website"
                      style={{ borderRadius: '6px', width: 'calc(50% - 10px)', padding: '10px' }}
                      placeholder={t('website')}
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
                  <p
                    onClick={() => setIsModalMap(true)}
                    className={styles.main_form_address_addnew}
                  >
                    <PlusCircleTwoTone twoToneColor="var(--primary-color)" style={{ marginRight: '10px' }} />
                    Thêm địa chỉ
                  </p>
                </div>
                <Button className={styles.btn} htmlType="submit">
                  {loading ? <Spin /> : t('Tiếp tục')}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
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
          <div>
            {renderButtonModal()}

          </div>
        </div>
      </Modal>
    </Layout>
  )
}

export default ProfileBusinessPage

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
  return { props: {} }
}
