import React, { FC, useEffect, useState } from 'react'

import { Button, Divider, message, Modal } from 'antd'
import { getAllUserAddressApi, patchUserAddressApi, postUserAddressApi } from 'api/client/address'
import { getProfileApi, patchUserInfomationApi } from 'api/client/user'
import { Formik } from 'formik'
import { DatePicker, Form, Input, Select } from 'formik-antd'
import { Base64 } from 'js-base64'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import Map from 'src/components/elements/Map/Map'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { handleError } from 'src/utils/helper'
import * as Yup from 'yup'

import { EditOutlined, PlusCircleTwoTone } from '@ant-design/icons'

import styles from './step4.module.scss'
import ChangePhoneNumber from '../../AccountInformation/components/ChangePhoneNumber/ChangePhoneNumber'


interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}

const StepFourSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const { t } = useTranslation()
  const dateFormat = 'DD-MM-yyyy'
  const profile = useAppSelector(state => state.user.profile || {})
  const [dataUser, setDataUser] = useState<any>({})

  const [addresses, setAddresses] = useState<Auth.UserAddressPayload[]>([])
  const [isOpenModalEditAddress, setOpenModalEditAddress] = useState<boolean>(false)

  const [initLocation, setInitLocation] = useState<CommonGlobal.AddressUser>({} as CommonGlobal.AddressUser)
  const [currentIdAddress, setCurrentIdAddress] = useState<number>(0)
  const [phone, setPhone] = useState(profile?.phoneNumber ?? undefined)
  const [birthday, setBirthDay] = useState<string>()
  const dispatch = useAppDispatch()
  const [userRole, setUserRole] = useState(roleConstant.EE.name)
  const [isChangePhoneNumberModal, setIsChangePhoneNumberModal] = useState(false)
  const [phoneNumberInput, setPhoneNumberInput] = useState('')

  useEffect(() => {
    const userRoleRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (userRoleRaw) {
      setUserRole(JSON.parse(userRoleRaw).role)
    }
  }, [])
  const [isModalMap, setIsModalMap] = useState(false)

  const eeFormSchema = Yup.object().shape({
    name: Yup.string().max(50, '* Tên quá dài').required('* Trường họ và tên là bắt buộc'),
    // email: Yup.string().email().required('* Trường email là bắt buộc'),

  })

  const handleSubmit = async values => {
    try {
      // update info user in server
      // const { name, email, gender } = values
      const data = {
        ...dataUser,
        isEmployee: 1,
        isEmployer: 1,
        isPersonal: 0,
        name: values.name,
        email: values.email,
        // phoneNumber: phone,
        birthday,
        gender: values.gender,
        expectSalaryFrom: 1,
        expectSalaryTo: 10,
        expectSalaryHourlyFrom: 1,
        expectSalaryHourlyTo: 10,
        phoneNumber: phoneNumberInput
      }
      if (!phoneNumberInput) {
        delete data.phoneNumber
      }
      if (!data.name) return message.error("Bạn cần điền tên để tiếp tục!")
      if (typeof data.gender !== 'number') return message.error("Bạn cần chọn giới tính để tiếp tục!")
      if (!data.birthday) return message.error("Bạn cần chọn ngày sinh để tiếp tục!")
      if (!profile.addresses?.length) return message.error("Bạn cần thêm địa chỉ để tiếp tục!")

      const updateData = await patchUserInfomationApi(data, dataUser.code)

      // update info user in redux store
      dispatch(getProfileRequest({ userCode: profile?.code ?? updateData.data.data.code }))

      // **** save step in localstorage ***
      // ----- case 1------
      if (userRole === roleConstant.ER.name) {
        const saveLocal = {
          status: 0,
          step: 8,
          role: userRole,
          code: profile.code
        }
        localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
        getCurrentStep(8)
      } else {
        const saveLocal = {
          status: 0,
          step: 5,
          role: userRole,
          code: profile.code
        }
        localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
        getCurrentStep(5)
      }
      localStorage.removeItem(storageConstant.localStorage.signupInfo)
      // setLoading(false)
    } catch (error) {
      handleError(error)
      // setLoading(false)
    }
  }

  const updateDataUser = async () => {
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

  useEffect(() => {
    if (!profile.id) {
      updateDataUser()
    } else {
      setDataUser(profile)
    }

    if (!phone) {
      const ftemp = localStorage.getItem(storageConstant.localStorage.signupInfo)
      const userInfo: { phoneNumber: string; password: string } = ftemp
        ? JSON.parse(Base64.decode(ftemp))
        : { phoneNumber: '', password: '' }
      setPhone(userInfo.phoneNumber)
    }
  }, [])

  // ==============Update address User==================
  // new address

  const getUserAdresses = async () => {
    try {
      const { data } = await getAllUserAddressApi()
      setAddresses(data.data)
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  useEffect(() => {
    getUserAdresses()
  }, [])

  const handlePostAddress = async data => {
    try {
      await postUserAddressApi({ ...data, userId: profile.id })
      message.success('Thêm mới địa chỉ thành công')
      getUserAdresses()
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      message.error('Thêm mới địa chỉ thất bại')
    }
  }
  const handleCloseModalMap = () => {
    setIsModalMap(false)
  }
  // update address
  const handleUpdateAddress = async data => {
    if (JSON.stringify(initLocation) !== JSON.stringify(data)) {
      try {
        await patchUserAddressApi({ ...data, main: 0 }, currentIdAddress)
        message.success('Địa chỉ cập nhật thành công')
        getUserAdresses()
      } catch (error) {
        message.error('Địa chỉ cập nhật thất bại')
      }
    }
  }

  const handleChangeMainAddress = async data => {
    try {
      await patchUserAddressApi({ ...data, main: 1 }, currentIdAddress)
      message.success('Địa chỉ cập nhật thành công')
      getUserAdresses()
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      message.error('Địa chỉ cập nhật thất bại')
    }
  }

  const handleCloseModalEditAddress = () => {
    setOpenModalEditAddress(false)
  }

  const handleEditAddressModal = values => {
    setCurrentIdAddress(values.userAddressId)
    setInitLocation({
      isMain: !!values.main,
      idAddress: values.userAddressId,
      latitude: values.latitude,
      longitude: values.longitude,
      address: values.address,
      provinceId: values.provinceId,
      districtId: values.districtId,
      communeId: values.communeId,
    })
    setOpenModalEditAddress(true)
  }

  const renderAddress = addresses
    ?.slice(0)
    .reverse()
    .map((address, index) => (
      <div key={index}>
        <div className={styles.main_form_address_exist}>
          <span style={{ color: address.main ? 'green' : 'black' }}>
            {index + 1}. {address.address}
          </span>
          <EditOutlined
            onClick={() => handleEditAddressModal(address)}
            className={styles.main_form_delete}
            style={{ marginLeft: '10px' }}
            twoToneColor="red"
          />
        </div>
        <Divider />
      </div>
    ))

  return (
    <div className={`signup ${styles.main}`}>
      <div id="recaptcha-container" />
      <div className={styles.main_text}>
        <p className={styles.text_role}>{userRole === roleConstant.EE.name ? "Vai trò ứng viên" : "Vai trò tuyển dụng"}</p>
      </div>
      <Formik
        initialValues={{
          name: dataUser.name && dataUser.name !== 'Người dùng Fjob' ? dataUser.name : '',
          email: dataUser.email ?? '',
          gender: 0,
          phoneNumber: dataUser.phoneNumber
          // birthday: undefined,
        }}
        onSubmit={handleSubmit}
        validationSchema={eeFormSchema}
      >
        {({ errors, touched }) => (
          <Form>
            <div className={styles.main_item}>
              <Input
                name="name"
                style={{ borderRadius: '6px', width: '100%', padding: '10px', height: 44, fontSize: 14 }}
                placeholder={t('Họ và tên')}
              />
              {errors.name && touched.name ? (
                <div className={styles.error}>{errors.name} </div>
              ) : null}
              <div className={styles.main_item_box}>
                <div className={styles.phoneNumber} style={{ color: profile.phoneNumber ? "black" : "#d6d6d6", fontSize: 14 }}>
                  <div>
                    {phoneNumberInput || (profile.phoneNumber ? "0".concat(profile.phoneNumber?.slice(2)) : "Số điện thoại")}
                  </div>
                  {
                    !profile.phoneNumber && (
                      <EditOutlined onClick={() => setIsChangePhoneNumberModal(true)} />
                    )
                  }
                </div>
                <Input
                  disabled
                  name="email"
                  className={styles.main_item_box_select}
                  placeholder={t('Email')}
                  value={dataUser.email}
                  style={{ height: 44, fontSize: 14 }}
                />
              </div>
              <div className={styles.main_item_box}>
                <Select
                  getPopupContainer={trigger => trigger.parentNode}
                  name="gender"
                  defaultValue={0}
                  className={styles.main_item_box_select}
                  size="large"
                  style={{ fontSize: 14, height: 44 }}
                >
                  <Select.Option value={0}>{t('gender.male')}</Select.Option>
                  <Select.Option value={1}>{t('gender.female')}</Select.Option>
                  <Select.Option value={2}>{t('gender.other')}</Select.Option>
                </Select>
                <div className={styles.main_item_box_select} style={{ width: 'calc(50% - 10px)' }}>
                  <DatePicker
                    name="birthday"
                    placeholder={t('profile.birthday')}
                    style={{ width: '100%' }}
                    format={dateFormat}
                    disabledDate={now => now && now > moment()}
                    onChange={(date, dateString) => {
                      if (date) {
                        setBirthDay(date?.format('YYYY-MM-DD'))
                      } else {
                        setBirthDay(undefined)
                      }
                    }}
                  />
                </div>

              </div>
            </div>
            <div className={styles.main_item}>
              <p className={styles.main_item_title}>{t('Địa chỉ của bạn')}</p>
              {!!addresses.length && (
                <div className={styles.main_form_address}>{renderAddress}</div>
              )}

              <p
                style={{ marginTop: '10px' }}
                onClick={() => setIsModalMap(true)}
                className={styles.main_form_address_addnew}
              >
                <PlusCircleTwoTone twoToneColor="#8218D1" style={{ marginRight: '10px' }} />
                Thêm địa chỉ
              </p>
            </div>
            <Button className={styles.btn} htmlType="submit">
              {t('Tiếp tục')}
            </Button>
          </Form>
        )}
      </Formik>

      {isChangePhoneNumberModal &&
        <ChangePhoneNumber
          isChangePhoneNumberModal={isChangePhoneNumberModal}
          handleCloseChangePhoneNumberModal={() => setIsChangePhoneNumberModal(false)}
          handleSetPhoneNumber={(val) => setPhoneNumberInput(val)}
        />
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
        onCancel={handleCloseModalEditAddress}
        visible={isOpenModalEditAddress}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">Chỉnh sửa địa chỉ</div>
          <Map
            handlePostAddress={handleUpdateAddress}
            handleCloseModalMap={handleCloseModalEditAddress}
            initLocation={initLocation}
            handleChangeMainAddress={handleChangeMainAddress}
          />
        </div>
      </Modal>
    </div>
  )
}

export default StepFourSignUp
