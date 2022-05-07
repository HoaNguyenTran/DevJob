import React, { FC, useEffect, useState } from 'react'

import { Image } from 'antd'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import StepOneSignUp from 'src/components/modules/SignUp/step1'
import StepTwoSignUp from 'src/components/modules/SignUp/step2'
import StepFourSignUp from 'src/components/modules/SignUp/step4'
import StepFiveSignUp from 'src/components/modules/SignUp/step5'
import StepSixSignUp from 'src/components/modules/SignUp/step6'
import StepSevenSignUp from 'src/components/modules/SignUp/step7'
import StepEightSignUp from 'src/components/modules/SignUp/step8'
import StepNineSignUp from 'src/components/modules/SignUp/step9'
import { storageConstant } from 'src/constants/storageConstant'

import styles from './Signup.module.scss'

const SignUpPage: FC = () => {
  const router = useRouter();
  const rawInfoStep =
    typeof window !== 'undefined' ? localStorage.getItem(storageConstant.localStorage.signupProcess) : '{}'
  const stepInfo = rawInfoStep && JSON.parse(rawInfoStep)

  const [currentStep, setCurrentStep] = useState<number>(1)
  const getCurrentStep = (step: number) => {
    setCurrentStep(step)
  }

  const renderStepSignup = () => {
    switch (currentStep) {
      case 1:
        return <StepOneSignUp getCurrentStep={getCurrentStep} />
      case 2:
        return <StepTwoSignUp getCurrentStep={getCurrentStep} />
      case 3:
      case 4:
        return <StepFourSignUp getCurrentStep={getCurrentStep} />
      case 5:
        return <StepFiveSignUp getCurrentStep={getCurrentStep} />
      case 6:
        return <StepSixSignUp />
      case 7:
        return <StepSevenSignUp getCurrentStep={getCurrentStep} />
      case 8:
        return <StepEightSignUp getCurrentStep={getCurrentStep} />
      case 9:
        return <StepNineSignUp getCurrentStep={getCurrentStep} />
      default:
        break
    }
  }

  useEffect(() => {
    if (stepInfo) {
      if (!stepInfo.status) {
        if (stepInfo.step === 2) {
          getCurrentStep(1)
        } else {
          getCurrentStep(stepInfo.step)
        }
      } else {
        router.replace('/')
      }
    }
  }, [])

  const onClickLogo = () => {
    router.push("/")
  }

  return (
    <>
      <NextSeo title="Đăng kí" description="Đăng kí" />
      <div className={`signup ${styles.main}`}>
        <div className={styles.main_img} />
        <div className={styles.main_wrap}>
          <div className={styles.main_wrap_banner} onClick={onClickLogo}>
            <Image
              preview={false}
              height={97}
              width={190.4}
              src="/assets/images/logo/logo.svg"
              alt="logo"
            />
            <span>Nền tảng cung cấp việc làm cho thế hệ trẻ</span>
          </div>
          {renderStepSignup()}
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  return { props: {} }
}

export default SignUpPage