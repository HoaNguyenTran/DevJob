/* eslint-disable no-unused-expressions */
import React, { FC, useEffect, useState } from 'react'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { Input, message, Result, Steps, Spin } from 'antd'
import { postCheckPhoneApi, postUpdateInfoSocialApi } from 'api/client/user'
import { firebase } from 'src/utils/firebase'
import { handleError } from 'src/utils/helper'
import { isVietnamesePhoneNumberRegex } from 'src/utils/patterns'
import OtpInput from 'react-otp-input'
import { useAppSelector } from 'src/redux'
import { configConstant } from 'src/constants/configConstant'
import { useDispatch } from 'react-redux'
import { getProfileRequest } from 'src/redux/user'
import styles from "./ChangePhoneNumber.module.scss"

interface IProps {
  isChangePhoneNumberModal: boolean
  handleCloseChangePhoneNumberModal: () => void
  handleSetPhoneNumber: (val: string) => void
  setRewardDiamond?: (data) => void
  setIsRewardDiamondModal?: (data) => void
  rewardDiamond?: any
}

enum Step {
  step1 = 0,
  step2 = 1,
  step3 = 2,
}


const ChangePhoneNumber: FC<IProps> = (
  { isChangePhoneNumberModal,
    handleCloseChangePhoneNumberModal,
    handleSetPhoneNumber,
    setRewardDiamond,
    setIsRewardDiamondModal,
    rewardDiamond
  }) => {
  const dispatch = useDispatch()
  const profile = useAppSelector(state => state.user.profile || {})

  const [stepChangePhoneNumber, setStepChangePhoneNumber] = useState(Step.step1)
  const [timeRemain, setTimeRemain] = useState(configConstant.timeOTP)
  const [phoneNumberInput, setPhoneNumberInput] = useState("")
  const [otpValue, setOtpValue] = useState("")
  const [loading, setLoading] = useState(false)




  const configureCaptcha = () => {
    // console.log('configureCaptcha')
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': response => {
        // console.log(response)
        // setTimeRemain(120)
        // window.recaptchaVerifier.clear()
      },
    })
  }

  const handleSendOTPToClient = async () => {
    setLoading(true)
    try {
      const { data } = await postCheckPhoneApi(phoneNumberInput)
      message.error(data.message)
    } catch (e) {
      configureCaptcha()
      const codePhone = '+84'.concat(phoneNumberInput.substring(1))
      const appVerifier = window.recaptchaVerifier
      firebase
        .auth()
        .signInWithPhoneNumber(codePhone, appVerifier)
        .then(confirmationResult => {
          message.success('M?? OTP ???? ???????c g???i!')
          window.confirmationResult = confirmationResult
          setStepChangePhoneNumber(Step.step2)
        })
        .catch(error => {
          // handleError(error)
          message.error("Vui l??ng t???i l???i trang ????? g???i OTP!")
        })
        .finally(() => {
          // window.recaptchaVerifier.reset()
          // window.recaptchaVerifier.clear()
          setLoading(false)
        })
    } finally {
      setLoading(false)
    }
  }

  const saveInfo = async fbtoken => {
    const updateInfo: Auth.UpdateInfo = {
      fbtoken,
      code: profile.code,
      phone: phoneNumberInput,
    }
    try {
      const { data } = await postUpdateInfoSocialApi(updateInfo);

      message.success('S??? ??i???n tho???i ???? c???p nh???t th??nh c??ng')
      setStepChangePhoneNumber(Step.step3)
      if (data.user.phoneNumberRewarded) 
        setRewardDiamond && setRewardDiamond({ name: "x??c th???c s??? ??i???n tho???i", diamond: data.user.phoneNumberRewarded })

      if (data.user.accountInfoRewarded) 
        setRewardDiamond && setRewardDiamond({ name: "ho??n th??nh th??ng tin t??i kho???n", diamond: data.user.accountInfoRewarded })

    } catch (error) {
      handleError(error)
    }
  }


  const handleConfirmOTP = () => {
    configureCaptcha()

    window.confirmationResult
      .confirm(otpValue)
      .then(async result => {
        const fbtoken = await result.user?.getIdToken()
        await saveInfo(fbtoken)
        setLoading(false)

      })
      .catch(error => {
        // handleError("Vui l??ng reload l???i trang ????? g???i m?? OTP!")
        handleError(error.message)
        setLoading(false)
      })
    // console.log("clear captcha");
    // window.recaptchaVerifier.clear()
  }


  const renderContinueBtn = () => {
    switch (stepChangePhoneNumber) {
      case Step.step1:
        return <div className={styles.modal_step1_btnConfirm}>
          {loading ? <Spin /> : <button type="button"
            disabled={!isVietnamesePhoneNumberRegex(phoneNumberInput)}
            style={{ cursor: isVietnamesePhoneNumberRegex(phoneNumberInput) ? "pointer" : "not-allowed" }}
            onClick={() => { handleSendOTPToClient(); setLoading(true) }} >G???i m?? OTP</button>}
        </div>

      case Step.step2:
        return <div className={styles.modal_step1_btnConfirm}>
          {loading ? <Spin /> :
            <button type="button"
              disabled={otpValue.length < 6}
              style={{ cursor: timeRemain && otpValue.length === 6 ? "pointer" : "not-allowed" }}
              onClick={() => { handleConfirmOTP(); setLoading(true) }}>X??c nh???n m?? OTP</button>
          }
        </div>

      case Step.step3:
        return <div className={styles.modal_step1_btnConfirm}>
          <button type="button"
            onClick={() => {
              handleCloseChangePhoneNumberModal();
              handleSetPhoneNumber(phoneNumberInput)
              if (rewardDiamond.diamond) {
                setIsRewardDiamondModal && setIsRewardDiamondModal(true)
                dispatch(getProfileRequest({ userCode: profile.code }))
              }
            }}>Xong</button>
        </div>

      default:
        break;
    }
  }


  const renderStepChangePhoneNumber = () => {
    switch (stepChangePhoneNumber) {
      case Step.step1:
        return <div className={styles.modal_step1}>
          <div className={styles.input}>
            <Input placeholder='Nh???p s??? ??i???n tho???i' onChange={e => setPhoneNumberInput(e.target.value)} />
          </div>
          <div className={styles.message}>
            {!isVietnamesePhoneNumberRegex(phoneNumberInput) && phoneNumberInput
              && <div>Vui l??ng nh???p ????ng ?????nh d???ng s??? ??i???n tho???i!</div>}
          </div>
        </div>

      case Step.step2:
        return <div className={styles.modal_step2}>
          <OtpInput
            inputStyle={styles.otp}
            onChange={value => setOtpValue(value)}
            numInputs={6}
            value={otpValue}
            separator={<span style={{ marginRight: '12px' }} />}
          />
        </div>

      case Step.step3:

        return <div>
          <Result
            status="success"
            title="X??c th???c m?? OTP th??nh c??ng!"
          />

        </div>

      default:
        break;
    }
  }

  useEffect(() => {
    if (stepChangePhoneNumber === Step.step2) {
      if (timeRemain === 0) {
        return message.info('M?? OTP ???? h???t h???n!')
      }
      if (timeRemain >= 1) {
        const timer = setTimeout(() => setTimeRemain(timeRemain - 1), 1000)
        return () => clearTimeout(timer)
      }
    }

  }, [timeRemain, stepChangePhoneNumber])


  return <div>

    <ModalPopup
      visible={isChangePhoneNumberModal}
      handleCancelModal={handleCloseChangePhoneNumberModal}
      title="Thay ?????i s??? ??i???n tho???i"
      width={800}
      isCancelBtn={false}
      isConfirmBtn={false}
      closeBtn
      maskClosable={false}
    >
      <div className={`modal_changePhoneNumber ${styles.modal}`}>
        <Steps current={stepChangePhoneNumber}
        // onChange={(val) => setStepChangePhoneNumber(val)}
        >
          <Steps.Step title="??i???n s??? ??i???n tho???i" />
          <Steps.Step title="X??c nh???n OTP" />
          <Steps.Step title="Ho??n th??nh" />
        </Steps>
        <div className={styles.modal_main}>

          {renderStepChangePhoneNumber()}
        </div>
        {
          stepChangePhoneNumber === Step.step2 &&
          <div className={styles.modal_time}>
            C??n l???i:&nbsp;
            <span style={{ color: 'red', fontWeight: 'bold' }}>{timeRemain}s</span>
          </div>
        }
        <div className={styles.modal_btn}>
          {renderContinueBtn()}
        </div>
      </div>
    </ModalPopup>

  </div>



}

export default ChangePhoneNumber