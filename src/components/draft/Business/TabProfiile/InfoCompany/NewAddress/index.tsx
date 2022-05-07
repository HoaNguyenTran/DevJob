import React, { FC, useEffect, useState } from 'react'

import { Button, Col, Form, Input, message, Modal, Row, Select } from 'antd'
import { postSaveAddressCompanyApi } from 'api/client/company'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/redux'
import { filterSelectOption } from 'src/utils/helper'

import styles from './new-address.module.scss'

interface ModalProp {
  companyId: number
  modalStatus: (value: boolean, request: boolean) => void
  isModal: boolean
}
const NewAddress: FC<ModalProp> = ({ companyId, modalStatus, isModal }) => {
  const masterData = useAppSelector(state => state.initData.data)

  const [userAddress, setUserAddress] = useState({
    address: '',
    provinceId: 1,
    districtId: masterData.FjobDistrict?.filter(distr => distr.provinceId === 1)[0].id,
    communeId: masterData.FjobCommune?.filter(commune => commune.districtId === 1)[0].id,
  })
  const [location, setLocation] = useState<Record<'latitude' | 'longitude', number>>({
    latitude: 0,
    longitude: 0,
  })
  const [geolocationStatus, setGeolocationStatus] = useState<boolean>(true)

  useEffect(() => {
    const checkBrowserSupportNavigator = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        })
      } else {
        setGeolocationStatus(false)
      }
    }
    checkBrowserSupportNavigator()
  }, [])

  const { t } = useTranslation()
  const handleOk = async () => {
    const newAddress = {
      ...userAddress,
      ...location,
      companyId,
    }
    try {
      const data = await postSaveAddressCompanyApi(newAddress)
      modalStatus(false, true)
    } catch (error) {
      message.error('Có lỗi xảy ra')
      modalStatus(false, false)
    }
  }
  const handleCancel = () => {
    modalStatus(false, false)
  }

  // Change address

  const onDistrictChange = (value: number) => {
    const communeArray = masterData.FjobCommune?.filter(commune => commune.districtId === value)
    const communeId = communeArray.length === 0 ? 0 : communeArray[0].id
    setUserAddress(preUserAddress => ({
      ...preUserAddress,
      districtId: value,
      communeId,
    }))
  }
  const onCommnueChange = (value: number) => {
    setUserAddress(preUserAddress => ({ ...preUserAddress, communeId: value }))
  }
  const onProvinceChange = (value: number) => {
    const districtId = masterData.FjobDistrict?.filter(distr => distr.provinceId === value)[0].id
    const communeArray = masterData.FjobCommune?.filter(
      commune => commune.districtId === districtId,
    )
    const communeId = communeArray.length === 0 ? 0 : communeArray[0].id

    setUserAddress(preUserAddress => ({
      ...preUserAddress,
      provinceId: value,
      districtId,
      communeId,
    }))
  }

  return (
    <Modal
      wrapClassName="modal-global"
      width={384}
      footer={null}
      title=""
      visible={isModal}
      onOk={handleOk}
      onCancel={() => handleCancel()}
    >
      <div className="modal-body">
        <div className="modal-title">{t('common.addnewAddress')}</div>
        <div style={{ marginBottom: '10px' }}>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            defaultValue={1}
            showSearch
            placeholder={t('signup.userAddressShortDescription')}
            optionFilterProp="children"
            onChange={onProvinceChange}
            filterOption={filterSelectOption}
            className={styles.select}
          >
            {masterData.FjobProvince?.map((province, i) => (
              <Select.Option key={i} value={province.id}>
                {province.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            getPopupContainer={trigger => trigger.parentNode}
            value={
              userAddress.districtId === 0
                ? masterData.FjobDistrict?.filter(
                    distr => distr.provinceId === userAddress.provinceId,
                  )[0].id
                : userAddress.districtId
            }
            showSearch
            className={styles.select}
            placeholder={t('signup.userAddressDistrictPlaceholder')}
            optionFilterProp="children"
            onChange={onDistrictChange}
            filterOption={filterSelectOption}
          >
            {masterData.FjobDistrict?.filter(
              distr => distr.provinceId === userAddress.provinceId,
            ).map((district, i) => (
              <Select.Option key={i} value={district.id}>
                {district.name}
              </Select.Option>
            ))}
          </Select>
          {userAddress.communeId !== 0 && (
            <Select
              getPopupContainer={trigger => trigger.parentNode}
              value={userAddress.communeId}
              showSearch
              className={styles.select}
              placeholder={t('signup.userAddressDistrictPlaceholder')}
              optionFilterProp="children"
              onChange={onCommnueChange}
              filterOption={filterSelectOption}
            >
              {masterData.FjobCommune?.filter(
                commune => commune.districtId === userAddress.districtId,
              ).map((commune, i) => (
                <Select.Option key={i} value={commune.id}>
                  {commune.name}
                </Select.Option>
              ))}
            </Select>
          )}
          <Form.Item name="addres" className={styles.select}>
            <Input
              placeholder={t('signup.userAddressSpecifyPlaceholder')}
              onChange={e =>
                setUserAddress(preUserAddress => ({ ...preUserAddress, address: e.target.value }))
              }
            />
          </Form.Item>
        </div>
        {
          <Row className="justify-content-between modal-btn-group">
            <Col span={11}>
              <Button
                className="modal-btn-cancel"
                onClick={() => {
                  handleCancel()
                }}
              >
                {t('common.cancel')}
              </Button>
            </Col>
            <Col span={11}>
              <Button
                className="modal-btn-ok"
                htmlType="submit"
                // loading={isLoadingConfirmPayment}
                // onClick={payAvailablePackage}
                onClick={() => {
                  handleOk()
                }}
              >
                {t('common.addnew')}
              </Button>
            </Col>
          </Row>
        }
      </div>
    </Modal>
  )
}
export default NewAddress
