import React, { FC, useEffect, useState } from 'react'

import { Divider, Form, Input, InputNumber, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import Map from 'src/components/elements/Map/Map'

import { DeleteTwoTone, PlusCircleTwoTone } from '@ant-design/icons'

import styles from './form.module.scss'

interface FormBusiness {
  getFormBusiness: ({
    nameBusiness,
    abbreviation,
    emailBusiness,
    phoneBusiness,
    website,
    addressesER,
    companySize,
  }) => void
}
const FormInfoBusiness: FC<FormBusiness> = ({ getFormBusiness }) => {
  const { t } = useTranslation()
  const [nameBusiness, setNameBusiness] = useState('')
  const [abbreviation, setAbbreviation] = useState('')
  const [emailBusiness, setEmailBusiness] = useState('')
  const [phoneBusiness, setPhoneBusiness] = useState('')
  const [website, setWebsite] = useState('')
  const [companySize, setCompanySize] = useState(0)

  const [addressesER, setAddressesER] = useState<Auth.UserAddressPayload[]>([])
  const [isModalMap, setIsModalMap] = useState(false)

  const handlePostAddress = async data => {
    setAddressesER([...addressesER, data])
  }
  const handleCloseModalMap = () => {
    setIsModalMap(false)
  }

  useEffect(() => {
    getFormBusiness({
      nameBusiness,
      abbreviation,
      emailBusiness,
      phoneBusiness,
      website,
      addressesER,
      companySize,
    })
  }, [companySize, nameBusiness, abbreviation, emailBusiness, phoneBusiness, website, addressesER])

  const showAddressER = addressesER.map((address, index) => (
    <div key={index}>
      <div className={styles.info_address_exist}>
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

  return (
    <div className={styles.info}>
      <h4 className="txt-left">{t('signup.infoBusiness')}</h4>
      <Form style={{ width: '100%' }} name="normal_login" initialValues={{ remember: true }}>
        <Form.Item style={{ marginBottom: '0px' }}>
          <Form.Item
            name="company's name"
            rules={[{ required: true, message: t('require.companyname'), whitespace: true }]}
            style={{
              marginBottom: '10px',
              width: 'calc(100% - 8px)',
            }}
          >
            <Input
              placeholder={t('signup.nameCompany')}
              onChange={value => setNameBusiness(value.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="abbreviations"
            style={{
              marginBottom: '10px',
              display: 'inline-block',
              width: 'calc(50% - 8px)',
            }}
          >
            <Input
              placeholder={t('signup.abbreviationsCompany')}
              onChange={value => setAbbreviation(value.target.value)}
            />
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder={t('signup.CompanySize')}
              onChange={value => setCompanySize(Number(value))}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item>
          <Form.Item
            rules={[
              {
                pattern: /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/,
                message: 'Số điện thoại không đúng định dạng',
              },
            ]}
            name="phone"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input
              placeholder={t('profile.phoneNumber')}
              onChange={value => setPhoneBusiness(value.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="website"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
          >
            <Input
              placeholder={t('signup.website')}
              onChange={value => setWebsite(value.target.value)}
            />
          </Form.Item>
        </Form.Item>
      </Form>
      <h4 className="txt-left">{t('signup.addressBusiness')}</h4>
      {showAddressER}
      <p onClick={() => setIsModalMap(true)} className={styles.info_address_addnew}>
        <PlusCircleTwoTone twoToneColor="#8218D1" style={{ marginRight: '10px' }} />
        Thêm địa chỉ
      </p>
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
    </div>
  )
}
export default FormInfoBusiness
