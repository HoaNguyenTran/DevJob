import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons'
import { Button, Divider, Form, Input, InputNumber, message, Modal, Select, Spin } from 'antd'
import {
  deleteAddressCompanyApi, getAddressOfOneCompanyApi, patchUpdateCompanyApi, postSaveAddressCompanyApi
} from 'api/client/company'
import React, { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Map from 'src/components/elements/Map/Map'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { filterSelectOption, handleError } from 'src/utils/helper'
import styles from './info.module.scss'
import UploadAvatar from './UploadAvatar'
import UploadImage from './UploadImage'




const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

interface ImageData {
  image: string
  type: number
}

const InfoCompany: FC<{
  data: CompanyGlobal.CompanyDetail
  handleChangeAvatarCompany: (id: number) => void
}> = ({ data, handleChangeAvatarCompany }) => {
  const { t } = useTranslation()
  const profile = useAppSelector(state => state.user.profile || {})

  const accountType = profile.isEmployer ? t('postjob.hiringCompany') : t('postjob.hiringPersonal')
  const [dataCompany, setDataCompany] = useState<CompanyGlobal.CompanyDetail>(data)
  const [isOpenModal, setOpenModal] = useState<boolean>(false)
  const [loadingAddress, setLoadingAddress] = useState(false)
  const [userFavouriteJob, setUserFavouriteJob] = useState<number>(dataCompany.industryId)
  const [licenseImg, setLicenseImg] = useState<ImageData[]>([])
  const [referralImg, setReferralImg] = useState<ImageData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addresses, setAddresses] = useState<CompanyGlobal.CompanyAddress[]>(
    dataCompany.companyAddress,
  )

  const dispatch = useAppDispatch()
  const masterData = useAppSelector(state => state.initData.data)
  const rootIndustry = masterData.FjobIndustry || []
  const onFavouriteJobChange = (value: number) => {
    setDataCompany({ ...dataCompany, industryId: value })
    setUserFavouriteJob(value)
  }

  const removeAddress = async id => {
    setLoadingAddress(true)
    try {
      const remove = await deleteAddressCompanyApi(id)
      message.success(remove.data.message)
      const newAddress = await getAddressOfOneCompanyApi(dataCompany.id)
      setDataCompany({ ...dataCompany, companyAddress: newAddress.data.data })
      setAddresses(newAddress.data.data.reverse())
    } catch (error) {

      if ((error as ErrorMsg).response.data.errorCode === 9104) {
        const emptyArray = []
        setDataCompany({ ...dataCompany, companyAddress: emptyArray })
        setAddresses([])
      } else if ((error as ErrorMsg).response.data.errorCode === 9000) {
        message.error((error as ErrorMsg).response.data.message)
      }
      else {
        message.error((error as ErrorMsg).response.data.cause.errorContent.message)
      }
    } finally {
      setLoadingAddress(false)
    }
  }
  const getAvatar = (url: string) => {
    setDataCompany({ ...dataCompany, avatar: url })
  }

  const renderAddress = addresses?.map((address, index) => (
    <div key={address.id}>
      <div className={styles.main_form_address_exist}>
        <span>
          {index + 1}. {address.address}
        </span>
        <DeleteTwoTone
          onClick={() => removeAddress(address.id)}
          className={styles.main_form_delete}
          style={{ marginLeft: '10px' }}
          twoToneColor="red"
        />
      </div>
      <Divider />
    </div>
  ))

  const handleCloseModalMap = () => {
    setOpenModal(false)
  }
  const handlePostAddress = async value => {
    // setAddresses([...addresses, { ...value, companyId: dataCompany.id }])
    setLoadingAddress(true)
    try {
      await postSaveAddressCompanyApi({ ...value, companyId: dataCompany.id })
      message.success("Thêm địa chỉ thành công")
      const newAddress = await getAddressOfOneCompanyApi(dataCompany.id)
      setDataCompany({ ...dataCompany, companyAddress: newAddress.data.data })
      setAddresses(newAddress.data.data.reverse())
      setLoadingAddress(false)
    } catch (error) {
      if ((error as ErrorMsg).response.data.errorCode === 9104) {
        const emptyArray = []
        setDataCompany({ ...dataCompany, companyAddress: emptyArray })
      } else {
        handleError(error)
      }
    } finally {
      setLoadingAddress(false)
    }
  }

  const getImageUpload = (value: ImageData[], type: number) => {
    if (type === 1) {
      setLicenseImg(value)
    } else {
      setReferralImg(value)
    }
  }

  const handleSubmit = async () => {
    const imageJson = JSON.stringify([...licenseImg, ...referralImg])
    setLoading(true)
    const dataUpdate = {
      name: dataCompany.name,
      contactPhone: dataCompany.contactPhone,
      website: dataCompany.website,
      numEmployee: dataCompany.numEmployee,
      industryId: dataCompany.industryId,
      desc: dataCompany.desc,
      isVerified: dataCompany.isVerified,
      parentId: dataCompany.parentId,
      avatar: dataCompany.avatar,
      shortName: dataCompany.shortName,
      imagesJson: imageJson,
    }
    await Promise.all([
      // dataCompany.companyAddress.filter(item => deleteAddressCompanyApi(item.id)),
      // addresses.filter(item => postSaveAddressCompanyApi(item)),
      patchUpdateCompanyApi(dataCompany.id, dataUpdate),
    ])
      .then(result => {
        message.success(t('profile.updateSuccess'))
        dispatch(getProfileRequest({ userCode: profile.code }))
      })
      .catch(err => {
        handleError(err)
      })
      .finally(() => setLoading(false))
    handleChangeAvatarCompany(dataCompany.id)
  }

  return (
    <div className={styles.main}>
      <UploadAvatar getAvatar={getAvatar} avatar={dataCompany.avatar} />
      <Form className={styles.main_form} {...layout}>
        <Form.Item labelAlign="left" label={t('signup.accountType')} rules={[{ required: true }]}>
          <Input className={styles.main_form_input} value={accountType} disabled />
        </Form.Item>
        <Form.Item labelAlign="left" label={t('signup.nameCompany')}>
          <Input
            value={dataCompany.name}
            onChange={e => setDataCompany({ ...dataCompany, name: e.target.value })}
            className={styles.main_form_input}
          />
        </Form.Item>
        <Form.Item labelAlign="left" label={t('signup.abbreviationsCompany')}>
          <Input
            onChange={e => setDataCompany({ ...dataCompany, shortName: e.target.value })}
            value={dataCompany.shortName}
            className={styles.main_form_input}
          />
        </Form.Item>
        <Form.Item
          labelAlign="left"
          label={t('signup.CompanySize')}
          rules={[{ type: 'number', min: 0, max: 99 }]}
        >
          <InputNumber
            onChange={e => setDataCompany({ ...dataCompany, numEmployee: Number(e) })}
            value={dataCompany.numEmployee}
            className={styles.main_form_input}
          />
        </Form.Item>
        <Form.Item labelAlign="left" label={t('search.career')}>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            allowClear
            style={{ width: '100%' }}
            placeholder={t('signup.userFavCatsPlaceholder')}
            optionFilterProp="children"
            onChange={onFavouriteJobChange}
            filterOption={filterSelectOption}
            value={userFavouriteJob}
          >
            {rootIndustry.map((job, i) => (
              <Select.Option key={i} value={job.id}>
                {job.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          labelAlign="left"
          label={t('profile.phoneNumber')}
          rules={[{ type: 'number', min: 0, max: 99 }]}
        >
          <Input
            onChange={e => setDataCompany({ ...dataCompany, contactPhone: e.target.value })}
            value={dataCompany.contactPhone}
            className={styles.main_form_input}
          />
        </Form.Item>

        <Form.Item labelAlign="left" label="Website">
          <Input
            onChange={e => setDataCompany({ ...dataCompany, website: e.target.value })}
            value={dataCompany.website}
            className={styles.main_form_input}
          />
        </Form.Item>
        <Form.Item labelAlign="left" label={t('signup.workAddress')}>
          {loadingAddress ? (
            <Spin />
          ) : (
            <div className={styles.main_form_address}>
                {renderAddress}
              <p onClick={() => setOpenModal(true)} className={styles.main_form_address_addnew}>
                <PlusCircleTwoTone twoToneColor="#8218D1" style={{ marginRight: '10px' }} />
                Thêm địa chỉ
              </p>
            </div>
          )}
        </Form.Item>
        <Form.Item labelAlign="left" label={t('signup.Businesslicense')}>
          <UploadImage
            type={1}
            getImageUpload={getImageUpload}
            imagesData={
              JSON.parse(dataCompany.imagesJson ? dataCompany.imagesJson : '[]').filter(
                item => item.type === 1,
              ) ?? []
            }
          />
        </Form.Item>
        <Form.Item labelAlign="left" label={t('Giấy giới thiệu công ty')}>
          <UploadImage
            type={2}
            getImageUpload={getImageUpload}
            imagesData={JSON.parse(dataCompany.imagesJson ? dataCompany.imagesJson : '[]').filter(
              item => item.type === 2,
            )}
          />
        </Form.Item>
        <Form.Item labelAlign="left" label={t('Mô tả công ty')}>
          <Input.TextArea
            rows={4}
            onChange={e => setDataCompany({ ...dataCompany, desc: e.target.value })}
            value={dataCompany.desc}
            className={styles.main_form_input}
          />
        </Form.Item>
        {dataCompany.userRole === 2 && (
          <p style={{ color: 'red', textAlign: 'center' }}>
            Chỉ có quản trị viên mới có quyền cập nhật
          </p>
        )}
        <Form.Item labelAlign="left" wrapperCol={{ ...layout.wrapperCol, offset: 10 }}>
          <Button
            disabled={dataCompany.userRole === 2 && true}
            onClick={handleSubmit}
            type="primary"
            htmlType="submit"
            className={styles.main_form_btn}
          >
            {loading ? <Spin /> : 'Lưu'}
          </Button>
        </Form.Item>
      </Form>
      <Modal
        onCancel={handleCloseModalMap}
        visible={isOpenModal}
        width={800}
        footer={null}
        wrapClassName="modal-global"
      >
        <div className="modal-body">
          <div className="modal-title">{`Thêm địa chỉ  `}</div>
          <Map handlePostAddress={handlePostAddress} handleCloseModalMap={handleCloseModalMap} />
        </div>
      </Modal>
    </div>
  )
}
export default InfoCompany
