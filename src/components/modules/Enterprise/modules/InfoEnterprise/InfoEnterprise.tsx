

import { DeleteTwoTone } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, message, Row, Select } from 'antd'
import { deleteAddressCompanyApi, patchUpdateCompanyApi, postSaveAddressCompanyApi } from 'api/client/company';
import React, { useEffect, useState } from 'react'
import Map from 'src/components/elements/Map/Map';
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { configConstant } from 'src/constants/configConstant';
import { useAppSelector } from 'src/redux';
import { handleError } from 'src/utils/helper';
import UploadMultiPicture from '../../components/UploadMultiPicture/UploadMultiPicture';
import styles from "./InfoEnterprise.module.scss"

const InfoEnterprise = ({
  avatar,
  enterpriseId,
  form,
  addressEnterprise,
  setAddressEnterprise,
  detailCompany,
  triggerFetchDetailCompany,
  imgList

}): JSX.Element => {

  const masterData = useAppSelector(state => state.initData.data)

  const [newAddress, setNewAddress] = useState<any>([])

  const [isAddAddressModal, setIsAddAddressModal] = useState(false)


  const [pictureCertificate, setPictureCertificate] = useState<any>([])
  const [pictureIntro, setPictureIntro] = useState<any>([])


  const handleAddPictureCertificate = (imgUrl) => {
    setPictureCertificate([...pictureCertificate, imgUrl])
  }

  const handleAddPictureIntro = (imgUrl) => {
    setPictureIntro([...pictureIntro, imgUrl])
  }

  console.log(imgList);


  useEffect(() => {
    setPictureCertificate(imgList.filter(item => item.type === 1).map(item => item.image))
    setPictureIntro(imgList.filter(item => item.type === 2).map(item => item.image))
  }, [imgList])


  const handlePostAddress = async data => {
    form.setFieldsValue({ address: [...addressEnterprise, data] })
    setAddressEnterprise([...addressEnterprise, data])
    setNewAddress([...newAddress, data])
  }


  const handleRemoveCompanyAddress = async (address) => {
    if (address.id) {
      try {
        const { data } = await deleteAddressCompanyApi(address.id)
        setAddressEnterprise(addressEnterprise.filter(item => item.id !== address.id))
        form.setFieldsValue({ address: addressEnterprise.filter(item => item.id !== address.id) })

        message.success(data.message)
      } catch (error) {
        handleError(error)
      }
    }
    else setAddressEnterprise(addressEnterprise.filter(item => item.address !== address.address))
  }



  const renderAddressEnterprise = addressEnterprise.map((address, index) => (
    <div key={index} className={styles.main_address_item}>
      <span>
        {index + 1}. {address.address}
      </span>
      <DeleteTwoTone
        onClick={() => {
          // setAddressEnterprise(addressEnterprise.filter(item => item.address !== address.address))
          handleRemoveCompanyAddress(address)
        }}
        twoToneColor="red"
      />
    </div>
  ))



  const handleFinishUpdateEnterprise = async (values) => {
    // console.log(values.career);

    const arr: any = []

    pictureCertificate.forEach(picture => {
      if (picture !== configConstant.defaultPicture) arr.push({ image: picture, type: 1 })
    })
    pictureIntro.forEach(picture => {
      if (picture !== configConstant.defaultPicture) arr.push({ image: picture, type: 2 })
    })


    // console.log(JSON.stringify(arr))

    const { data } = await patchUpdateCompanyApi(enterpriseId, {
      name: values.fullName,
      shortName: values.shortName,
      contactPhone: String(values.phoneNumber),
      website: values.website,
      email: values.email,
      numEmployee: values.scale,
      industryId: Number(values.inductry),
      desc: values.introduction,
      // isVerified: 0,
      parentId: 0,
      avatar,
      imagesJson: JSON.stringify(arr),
      // companyAddress: addressEnterprise
    })

    Promise.all(newAddress.map(item => postSaveAddressCompanyApi({
      ...item, companyId: data.id
    })))
      .then()
      .catch(error => {
        handleError(error)
      })

    triggerFetchDetailCompany()

    // router.push(routerPathConstant.erEnterprise)
    message.success("C???p nh???t th??ng tin c??ng ty th??nh c??ng!")
  }



  return (
    <div className={styles.infoEnterprise}>
      <div className={styles.enterprise_main}>
        <Form
          form={form}
          onFinish={handleFinishUpdateEnterprise}
          layout="vertical"
          scrollToFirstError
        >
          <Row gutter={28}>
            <Col span={16}>
              <Form.Item
                name="fullName"
                label="T??n doanh nghi???p"
                rules={[
                  {
                    required: true,
                    message: 'T??n doanh nghi???p kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <Input placeholder='Nh???p t??n doanh nghi???p c???a b???n' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="shortName"
                label="T??n vi???t t???t"
              >
                <Input placeholder='T??n vi???t t???t' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={28}>
            <Col span={8}>
              <Form.Item
                name="phoneNumber"
                label="S??? ??i???n tho???i"
                rules={[
                  {
                    required: true,
                    message: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder='Nh???p s??? ??i???n tho???i c???a c??ng ty'
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: 'email',
                    message: 'Ph???i l?? ?????nh d???ng email!',
                  },
                ]}
              >
                <Input placeholder='Nh???p email c???a c??ng ty' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="website"
                label="Website"
              >
                <Input placeholder='Nh???p website c???a c??ng ty' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={28}>
            <Col span={16}>
              <Form.Item
                name="inductry"
                label="L??nh v???c"
                rules={[
                  {
                    required: true,
                    message: 'L??nh v???c kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <Select>
                  {(masterData.FjobIndustry || []).map(inductry => <Select.Option key={inductry.id} value={inductry.id}>
                    {inductry.name}
                  </Select.Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="scale"
                label="Quy m??"
                rules={[
                  {
                    required: true,
                    message: 'Quy m?? c??ng ty kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <InputNumber placeholder='Nh???p quy m?? c??ng ty' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="?????a ch??? l??m vi???c"
            rules={[
              {
                required: true,
                message: "C???n ??t nh???t 1 ?????a ch??? l??m vi???c!"
              },
            ]}
          >
            <div className={styles.main_address_list}>
              {renderAddressEnterprise}
            </div>
          </Form.Item>

          {addressEnterprise.length < 5 && <button type="button" className={styles.address_btn}
            onClick={() => setIsAddAddressModal(true)}>
            <span>Th??m ?????a ch???</span>
          </button>}

          <div style={{ fontWeight: 500 }}>Gi???y ph??p kinh doanh</div>

          <div className={styles.picture}>
            {pictureCertificate.map((picture, idx) => <div key={idx}>
              <img alt="" src={picture} />
            </div>)}
            {pictureCertificate.length < 5 && <UploadMultiPicture setPicture={handleAddPictureCertificate} />}
          </div>


          <Row gutter={28}>
            <Col span={24}>
              <Form.Item
                name="introduction"
                label="Gi???i thi???u"
              >
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ fontWeight: 500 }}>H??nh ???nh c??ng ty</div>

          <div className={styles.picture}>
            {pictureIntro.map((picture, idx) => <div key={idx}>
              <img alt="" src={picture} />
            </div>)}
            {pictureIntro.length < 5 && <UploadMultiPicture setPicture={handleAddPictureIntro} />}
          </div>

          <Form.Item className={styles.enterprise_button}>
            <button type='submit'>
              L??u
            </button>
          </Form.Item>
        </Form>

        {isAddAddressModal &&
          <ModalPopup
            visible={isAddAddressModal}
            width={800}
            title="Th??m ?????a ch???"
            isConfirmBtn={false}
            isCancelBtn={false}
            closeBtn
            handleCancelModal={() => setIsAddAddressModal(false)}
          >
            <Map handlePostAddress={handlePostAddress} handleCloseModalMap={() => setIsAddAddressModal(false)} />
          </ModalPopup>}
      </div>
    </div>

  )
}

export default InfoEnterprise