import { LeftOutlined, DeleteTwoTone } from '@ant-design/icons';
import { Cascader, Col, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { postCreateNewCompanyApi, postSaveAddressCompanyApi } from 'api/client/company';
import { patchUpdateUserApi } from 'api/client/user'
import router from 'next/router';
import React, { useState, useEffect } from 'react'
import Map from 'src/components/elements/Map/Map';
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { configConstant } from 'src/constants/configConstant';
import { routerPathConstant } from 'src/constants/routerConstant';
import { useAppSelector } from 'src/redux';
import { checkPhoneNumber, createCategories, handleError, } from 'src/utils/helper';
import UploadAvatar from '../components/UploadAvatar/UploadAvatar';
import UploadMultiPicture from '../components/UploadMultiPicture/UploadMultiPicture';
import styles from "./CreateEnterprise.module.scss"

const CreateEnterprise = (): JSX.Element => {
  const masterData = useAppSelector(state => state.initData.data) 
  const categoryList = createCategories(masterData.FjobCategory)
  const profile = useAppSelector(state => state.user.profile || {})
  const [form] = Form.useForm();

  const [avatar, setAvatar] = useState(configConstant.defaultCirclePicture)

  const [addressEnterprise, setAddressEnterprise] = useState<any>([])

  const [cascaderValues, setCascaderValues] = useState<any>()

  const [pictureCertificate, setPictureCertificate] = useState<any>([])
  const [pictureIntro, setPictureIntro] = useState<any>([])

  const [isAddAddressModal, setIsAddAddressModal] = useState(false)

  const handleAddPictureCertificate = (imgUrl) => {
    setPictureCertificate([...pictureCertificate, imgUrl])
  }

  const handleAddPictureIntro = (imgUrl) => {
    setPictureIntro([...pictureIntro, imgUrl])
  }


  const handlePostAddress = async data => {
    form.setFieldsValue({ address: [...addressEnterprise, data] })
    setAddressEnterprise([...addressEnterprise, data])
  }

  const renderAddressEnterprise = addressEnterprise.map((address, index) => (
    <div key={index} className={styles.main_address_item}>
      <span>
        {index + 1}. {address.address}
      </span>
      <DeleteTwoTone
        onClick={() => {
          form.setFieldsValue({ address: addressEnterprise.filter(item => item.address !== address.address) })
          setAddressEnterprise(addressEnterprise.filter(item => item.address !== address.address))
        }}
        twoToneColor="red"
      />
    </div>
  ))

  const handleFinishCreateEnterprise = async (values) => {
    if (!checkPhoneNumber(String(values.phoneNumber).trim()))
      return message.error("S??? ??i???n tho???i kh??ng ????ng!")

    const arr: any = []

    pictureCertificate.forEach(picture => {
      if (picture !== configConstant.defaultPicture) arr.push({ image: picture, type: 1 })
    })
    pictureIntro.forEach(picture => {
      if (picture !== configConstant.defaultPicture) arr.push({ image: picture, type: 2 })
    })

    const { data } = await postCreateNewCompanyApi({
      name: values.fullName,
      shortName: values.shortName,
      contactPhone: String(values.phoneNumber),
      website: values.website,
      email: values.email,
      numEmployee: values.scale,
      industryId: 0,
      desc: values.introduction,
      isVerified: 0,
      parentId: 0,
      avatar,
      imagesJson: JSON.stringify(arr),
    })

    const formatAddress = Array.from(addressEnterprise.map(item => ({ ...item, companyId: data.id })))

    Promise.all(formatAddress.map(item => postSaveAddressCompanyApi(item)))
      .then()
      .catch(error => {
        handleError(error)
      })

    // dispatch(getUserCompanyRequest())
    router.push(routerPathConstant.erEnterprise)
    message.success("T???o c??ng ty th??nh c??ng!")
  }

  useEffect(() => {
    if (profile.isEmployer !== 1) {
      const upgradeERRole = async () => {
        try {
          await patchUpdateUserApi(profile.code, {
            isEmployer: 1,
            isEmployee: 1,
            isPersonal: 1
          })
        } catch (error) {
          handleError(error)
        }
      }
      upgradeERRole()
    }
  }, [])


  return (
    <div className={`enterprise ${styles.enterprise}`}>
      <div className={styles.enterprise_wrap}>
        <div className={styles.enterprise_back} onClick={() => router.back()}><LeftOutlined /> Quay l???i</div>
        <div className={styles.enterprise_header}>
          <div className={styles.header_inner}>
            <div className={styles.header_title}>T???o m???i doanh nghi???p</div>
            <div className={styles.header_avatar}>
              {/* <div> */}
              <UploadAvatar avatar={avatar} setAvatar={setAvatar} />
              <img alt="" src="/assets/icons/default/camera.svg" className={styles.header_avatar_icon}  />
              {/* <div className={styles.header_photo}>
                <img alt="" src="/assets/icons/default/photo.svg" />
              </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className={styles.enterprise_main}>
          <Form
            form={form}
            onFinish={handleFinishCreateEnterprise}
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
                  <InputNumber placeholder='Nh???p s??? ??i???n tho???i c???a c??ng ty' controls={false} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: 'Email kh??ng ???????c ????? tr???ng!',
                    },
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
                  name="career"
                  label="L??nh v???c"
                  rules={[
                    {
                      required: true,
                      message: '?????a ch??? l??m vi???c kh??ng ???????c ????? tr???ng!',
                    },
                  ]}
                >
                  <Select placeholder="L??nh v???c ho???t ?????ng">
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
                  <InputNumber placeholder='Nh???p quy m?? c??ng ty' controls={false} />
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
              {renderAddressEnterprise}
            </Form.Item>

            {addressEnterprise.length < 5 && <button type="button" className={styles.address_btn}
              onClick={() => setIsAddAddressModal(true)}>
              <span>Th??m ?????a ch???</span>
            </button>}

            <div style={{ fontWeight: 500, marginTop: ".75rem" }}>Gi???y ph??p kinh doanh</div>

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
                  rules={[
                    {
                      required: true,
                      message: "Tr?????ng gi???i thi???u kh??ng ???????c ????? tr???ng!"
                    },
                  ]}
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
                T???o c??ng ty
              </button>
            </Form.Item>
          </Form>
        </div>
      </div>

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
      </ModalPopup>
    </div>
  )
}

export default CreateEnterprise