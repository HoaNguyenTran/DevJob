import { EditOutlined } from '@ant-design/icons'
import { Col, DatePicker, Form, Input, message, Row, Select } from 'antd'
import { getProfileApi, patchUserInfomationApi } from 'api/client/user'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { handleError } from 'src/utils/helper'
import ModalRewardDiamond from 'src/components/elements/Modal/ModalRewardDiamond/ModalRewardDiamond'
import defaultConstant from 'src/constants/defaultConstant'
import ChangeEmail from './components/ChangeEmail/ChangeEmail'
import ChangePhoneNumber from './components/ChangePhoneNumber/ChangePhoneNumber'
import UploadAvatar from './components/UploadAvatar/UploadAvatar'
import styles from "./AccountInformation.module.scss"
import Address from './components/Address/Address'



const formatBirthday = 'YYYY-MM-DD'

interface IRewardDiamond {
  name: string,
  diamond: number
}


const TabpersonalInfoEdit = (): JSX.Element => {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()


  const profile = useAppSelector(state => state.user.profile || {})


  const [avatar, setAvatar] = useState<string>(profile.avatar || defaultConstant.defaultAvatarUser)
  const [phoneNumberInput, setPhoneNumberInput] = useState('')
  const [emailInput, setEmailInput] = useState('')

  const [isChangePhoneNumberModal, setIsChangePhoneNumberModal] = useState(false)
  const [isChangeEmailModal, setIsChangeEmailModal] = useState(false)

  const [rewardDiamond, setRewardDiamond] = useState<IRewardDiamond>({} as IRewardDiamond)
  const [isRewardDiamondModal, setIsRewardDiamondModal] = useState(false)


  const onFinish = async values => {
    // console.log(values);
    const dataInfomation: any = {}

    if (avatar) dataInfomation.avatar = avatar
    if (values.name) dataInfomation.name = values.name
    if (values.email) dataInfomation.email = values.email
    if (typeof values.gender === 'number') dataInfomation.gender = values.gender
    if (values.birthday) dataInfomation.birthday = moment(values.birthday).format(formatBirthday) || ''

    if (Object.keys(dataInfomation).length) {
      try {
        const { data } = await patchUserInfomationApi(dataInfomation, profile.code)
        // console.log(data);

        if (data.data.accountInfoRewarded) {
          setIsRewardDiamondModal(true)
          setRewardDiamond({ name: "th??ng tin t??i kho???n", diamond: data.data.accountInfoRewarded })
        }

        const response = await getProfileApi(profile.code)
        // dispatch(getProfileSuccess({ profile: response.data.data }))
        dispatch(getProfileRequest({ userCode: profile.code }))

        if (router.query.next) {
          const { name, birthday, gender, addresses } = data.data || {}

          if (!name) return message.warning("B???n ph???i th??m t??n ng?????i d??ng ????? ti???p t???c ???ng tuy???n!")
          if (!data.data.phoneNumber) return message.warning("B???n ph???i th??m s??? ??i???n tho???i ????? ti???p t???c ???ng tuy???n!")
          if (!birthday) return message.warning("B???n ph???i th??m ng??y sinh ????? ti???p t???c ???ng tuy???n!")
          if (typeof gender !== 'number') return message.warning("B???n ph???i th??m gi???i t??nh ????? ti???p t???c ???ng tuy???n!")
          if (!addresses.length) return message.warning("B???n ph???i th??m ?????a ch??? ????? ti???p t???c ???ng tuy???n!")

          const slug = decodeURIComponent(router.query.next as string).split("/") || []
          localStorage.setItem(storageConstant.localStorage.flagAutoApplyJob, slug[slug.length - 1])

          if (name && data.data.phoneNumber && birthday && typeof gender === 'number' && addresses.length) {
            const objRouter: any = { pathname: decodeURIComponent(String(router.query.next)) }
            if (router.query.attachNext) objRouter.query = { next: decodeURIComponent(String(router.query.attachNext)) }
            router.push(objRouter)
          }
        }
        else message.success(t('profile.updateSuccess'))

      } catch (error) {
        handleError(error)
      }
    }
  }

  const valueForm = {
    // avatar: profile.avatar || '',
    name: profile.name || '',
    birthday: profile.birthday ? moment(profile?.birthday, formatBirthday) : '',
    gender: profile.gender ?? '',
    email: profile.email || '',
    phoneNumber: profile.phoneNumber || '',
  }

  // const renderGender = gender => Gender[gender]

  const renderActionBtn = () =>
    // if (profile.verifyKyc) return <></>;
    <div className={styles.account_action}>
      <button type="submit">L??u</button>
    </div>


  return (
    <div className={`profile ${styles.account}`}>
      <div className={styles.account_wrap}>
        <div className={styles.account_title}>Th??ng tin t??i kho???n</div>
        <Form
          form={form}
          initialValues={valueForm}
          onFinish={onFinish}
          className={styles.account_form}
        >
          <Row className="my-5">
            <div className={styles.account_avatar}>
              <Form.Item>
                <UploadAvatar avatar={profile.avatar} setAvatar={setAvatar} />
              </Form.Item>
              <img alt="" src="/assets/icons/default/camera.svg" className={styles.account_avatar_icon} />
            </div>

            <Col xs={16} md={8}>
              <div className={styles.header}>
                <span className={styles.item_label}>T??n ????ng nh???p</span>
                <div className={styles.name}>
                  <Form.Item name="name">
                    <Input type="text" disabled={!!profile.verifyKyc} />
                  </Form.Item>
                </div>

                {profile.verifyKyc ? (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/isVerified.svg" />
                    &nbsp;
                    <span>T??i kho???n ???? ???????c x??c th???c</span>
                  </div>
                ) : (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/unVerified.svg" />
                    &nbsp;
                    <span>T??i kho???n ch??a ???????c x??c th???c</span>
                  </div>
                )}
              </div>

            </Col>
          </Row>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} md={12}>
              <span className={styles.item_label}>
                Ng??y sinh
              </span>
              <Form.Item name="birthday" >
                <DatePicker
                  format="DD-MM-YYYY"
                  disabledDate={now => now && now > moment()}
                  placeholder="Ch???n ng??y sinh"
                  allowClear={false}
                  className={styles.text_input}
                  disabled={!!profile.verifyKyc}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <span className={styles.item_label}>Gi???i t??nh
              </span>
              <Form.Item className="profile" name="gender">
                <Select getPopupContainer={trigger => trigger.parentNode} placeholder="Ch???n gi???i t??nh" disabled={!!profile.verifyKyc}>
                  <Select.Option value={1}>{t(`gender.male`)}</Select.Option>
                  <Select.Option value={2}>{t(`gender.female`)}</Select.Option>
                  <Select.Option value={0}>{t(`gender.other`)}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} md={12}>
              <span className={styles.item_label}>S??? ??i???n tho???i
              </span>
              <Form.Item name="phoneNumber"
              >
                <div className={styles.phoneNumber}>
                  <div>
                    {phoneNumberInput || (profile.phoneNumber ? "0".concat(profile.phoneNumber?.slice(2)) : "")}
                  </div>
                  <EditOutlined onClick={() => setIsChangePhoneNumberModal(true)} />
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <div className={styles.verifyEmail}>
                <span className={styles.item_label}>Email</span>
                {profile.verifyEmail ? <div className={styles.verified}>???? x??c th???c!</div> : <div className={styles.unVerify}>Ch??a x??c th???c!</div>}
              </div>
              <Form.Item
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: t('validation.emailInvalid'),
                  },
                ]}
              >
                <div className={styles.email}>
                  <div>
                    {emailInput || profile.email}
                  </div>
                  <EditOutlined onClick={() => setIsChangeEmailModal(true)} />
                </div>
              </Form.Item>
            </Col>
          </Row>

          <Address setRewardDiamond={setRewardDiamond} setIsRewardDiamondModal={setIsRewardDiamondModal} />

          <div style={{ textAlign: 'center', marginTop: "2rem" }}>
            {router.query.next
              ? <button type="submit" className={styles.btn_next}>Ti???p t???c</button>
              : renderActionBtn()}
          </div>
        </Form>
      </div>

      <div id="recaptcha-container" />

      {isChangePhoneNumberModal &&
        <ChangePhoneNumber
          isChangePhoneNumberModal={isChangePhoneNumberModal}
          handleCloseChangePhoneNumberModal={() => setIsChangePhoneNumberModal(false)}
          handleSetPhoneNumber={(val) => setPhoneNumberInput(val)}
          rewardDiamond={rewardDiamond}
          setRewardDiamond={setRewardDiamond}
          setIsRewardDiamondModal={setIsRewardDiamondModal}
        />
      }

      {isChangeEmailModal &&
        <ChangeEmail
          isChangeEmailModal={isChangeEmailModal}
          handleCloseChangeEmailModal={() => {
            setIsChangeEmailModal(false);
            dispatch(getProfileRequest({ userCode: profile.code }))
          }}
          handleSetEmail={(val) => setEmailInput(val)}
        />
      }

      <ModalRewardDiamond
        isRewardDiamondModal={isRewardDiamondModal}
        setIsRewardDiamondModal={setIsRewardDiamondModal}
        rewardDiamond={rewardDiamond}
      />
    </div>
  )
}

export default TabpersonalInfoEdit
