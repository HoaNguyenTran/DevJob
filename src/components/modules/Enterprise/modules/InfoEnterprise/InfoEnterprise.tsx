

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
    message.success("Cập nhật thông tin công ty thành công!")
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
                label="Tên doanh nghiệp"
                rules={[
                  {
                    required: true,
                    message: 'Tên doanh nghiệp không được để trống!',
                  },
                ]}
              >
                <Input placeholder='Nhập tên doanh nghiệp của bạn' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="shortName"
                label="Tên viết tắt"
              >
                <Input placeholder='Tên viết tắt' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={28}>
            <Col span={8}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: 'Số điện thoại không được để trống!',
                  },
                ]}
              >
                <Input
                  type="number"
                  placeholder='Nhập số điện thoại của công ty'
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
                    message: 'Phải là định dạng email!',
                  },
                ]}
              >
                <Input placeholder='Nhập email của công ty' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="website"
                label="Website"
              >
                <Input placeholder='Nhập website của công ty' />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={28}>
            <Col span={16}>
              <Form.Item
                name="inductry"
                label="Lĩnh vực"
                rules={[
                  {
                    required: true,
                    message: 'Lĩnh vực không được để trống!',
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
                label="Quy mô"
                rules={[
                  {
                    required: true,
                    message: 'Quy mô công ty không được để trống!',
                  },
                ]}
              >
                <InputNumber placeholder='Nhập quy mô công ty' />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ làm việc"
            rules={[
              {
                required: true,
                message: "Cần ít nhất 1 địa chỉ làm việc!"
              },
            ]}
          >
            <div className={styles.main_address_list}>
              {renderAddressEnterprise}
            </div>
          </Form.Item>

          {addressEnterprise.length < 5 && <button type="button" className={styles.address_btn}
            onClick={() => setIsAddAddressModal(true)}>
            <span>Thêm địa chỉ</span>
          </button>}

          <div style={{ fontWeight: 500 }}>Giấy phép kinh doanh</div>

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
                label="Giới thiệu"
              >
                <Input.TextArea autoSize={{ minRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ fontWeight: 500 }}>Hình ảnh công ty</div>

          <div className={styles.picture}>
            {pictureIntro.map((picture, idx) => <div key={idx}>
              <img alt="" src={picture} />
            </div>)}
            {pictureIntro.length < 5 && <UploadMultiPicture setPicture={handleAddPictureIntro} />}
          </div>

          <Form.Item className={styles.enterprise_button}>
            <button type='submit'>
              Lưu
            </button>
          </Form.Item>
        </Form>

        {isAddAddressModal &&
          <ModalPopup
            visible={isAddAddressModal}
            width={800}
            title="Thêm địa chỉ"
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