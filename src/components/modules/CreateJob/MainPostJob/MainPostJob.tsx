
import { Card, Form, message, Steps } from 'antd'
import {
  patchUpdateJobApi, postChangeStatusJobApi, postJobApi
} from 'api/client/job'
import { getUnixTime } from 'date-fns'
import moment from 'moment'
import { useRouter } from 'next/router'
import React, { FC, useRef, useState } from 'react'
import { configConstant } from 'src/constants/configConstant'
import jobConstant from 'src/constants/jobConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { serviceConstant } from 'src/constants/serviceConstant'
import { statusPostConstants } from 'src/constants/statusConstant'
import useElementSize from 'src/hooks/useElementSize'
import { useAppSelector } from 'src/redux'
import { formatDiamond, handleError, isPositiveInteger } from 'src/utils/helper'
import EmploymentInfo from '../EmploymentInfo/EmploymentInfo'
import PostTime from '../PostTime/PostTime'
import PreviewJob from '../PreviewJob/PreviewJob'
import ServicePromo from '../ServicePromo/ServicePromo'
import styles from './MainPostJob.module.scss'

const { Step } = Steps
interface IProps {
  initDataPostJob: any
  setInitDataPostJob: any,
}


const Hiring: FC<IProps> = (props) => {
  const { initDataPostJob, setInitDataPostJob } = props
  let valueForm = {...initDataPostJob};

  const setValueForm = setInitDataPostJob;
  const squareRef = useRef(null)
  const router = useRouter()
  // const { width } = useElementSize(squareRef)
  const profile = useAppSelector(state => state.user.profile || {})


  const [step, setStep] = useState(jobConstant.stepPost.step1)

  const [formInfo] = Form.useForm()
  const [formTime] = Form.useForm()

  const cartService = valueForm.useServices || []

  const listStepRef = useRef([
    { id: jobConstant.stepPost.step1, title: 'Tạo mới tin' },
    { id: jobConstant.stepPost.step2, title: 'Thiết lập tin đăng'},
    { id: jobConstant.stepPost.step3, title: 'Chọn dịch vụ đăng tin' },
    { id: jobConstant.stepPost.step4, title: 'Đăng tin' },
  ])

  const handleChangeValueForm = data => {
    valueForm = { ...initDataPostJob, ...data }
  }

  const {
    addressType,
    jobTitle,
    jobCate,
    hireCount,
    jobType,
    shortWorkTime,
    userAddress,
    // companyAddressArr,
    companyAddressId,
    companyId,
    calendarType,
    workHour,
    workShift,
    dayOfWeek,
    salaryType,
    salaryMax,
    salaryMin,
    salaryUnit,
    detailDesc,
    genderType,
    chooseGender,
    ageType,
    ageFrom,
    ageTo,
    educationLevel,
    experienceJob,
    experienceTime,
    benefitPolicy,
    moreRequire,
    deadlineSubmit,
    timePostJob,
    canMessage,
    canCall,
    useServices,
    imageUrl,
    uploadFile,
    workingDayNote
  } = valueForm

  const prepareData = ({ statusPost, data }) => {
    let methodReceiveNotify = jobConstant.statusContact.none
    let wageMin
    let wageMax
    let addressId


    const jobSchedules: {
      dayOfWeek: number
      shiftId: number
      workTimeFrom?: number
      workTimeTo?: number
    }[] = []

    // if (canMessage) methodReceiveNotify = 1
    if (canMessage) methodReceiveNotify = jobConstant.statusContact.message
    if (canCall) methodReceiveNotify = jobConstant.statusContact.call

    if (calendarType === jobConstant.calendarType.hour.key) {
      dayOfWeek.map(day =>
        jobSchedules.push({
          dayOfWeek: day,
          shiftId: 0,
          workTimeFrom:
            new Date(workHour[0]).getHours() +
            Number((new Date(workHour[0]).getMinutes() / 60).toFixed(2)),
          workTimeTo:
            new Date(workHour[1]).getHours() +
            Number((new Date(workHour[1]).getMinutes() / 60).toFixed(2)),
        }),
      )
    }

    if (calendarType === jobConstant.calendarType.shift.key) {
      dayOfWeek.map(day =>
        workShift.sort().map(shift => jobSchedules.push({ dayOfWeek: day, shiftId: shift })),
      )
    }

    const wokingShortTimeFrom = shortWorkTime?.length ? getUnixTime(new Date(shortWorkTime[0])) : undefined
    const wokingShortTimeTo = () => {
      if (!shortWorkTime?.length) return undefined
      if (wokingShortTimeFrom === getUnixTime(new Date(shortWorkTime[1])))
        return getUnixTime(new Date(shortWorkTime[1])) + 1
      return getUnixTime(new Date(shortWorkTime[1]))
    }

    if (salaryType === jobConstant.salaryType.deal.key) {
      wageMin = 0
      wageMax = salaryMax
    }
    if (salaryType === jobConstant.salaryType.range.key) {
      wageMin = salaryMin
      wageMax = salaryMax
    }


    if (addressType === jobConstant.recruit.person.key) {
      addressId = userAddress
      // companyId = 0
    }
    if (addressType === jobConstant.recruit.company.key) {
      // companyId = companyAddressArr[0]
      // addressId = companyAddressArr[1]
      // [companyId, addressId] = [co]
      addressId = companyAddressId;
    }
    
    return {
      userId: profile.id,
      companyId: addressType === jobConstant.recruit.company.key ? companyId : 0,
      title: jobTitle,
      jobType,
      urgent: 0,
      hiringCount: hireCount,
      wokingShortTimeFrom,
      wokingShortTimeTo: wokingShortTimeTo(),
      startTime: timePostJob,
      canApplyDate: deadlineSubmit,
      wageMin,
      wageMax,
      wageUnit: salaryUnit,
      genders: chooseGender?.sort() || [],
      jobPostCategoryIds: [jobCate],
      jobPostExpRequiredCateIds: experienceJob || [],
      detailDesc,
      otherDesc: moreRequire,
      benefitIds: benefitPolicy?.sort() || [],
      // promotions: [],
      // services: [],
      // useServices,
      expireTime: 0,
      methodReceiveNotify,
      jobSchedules,
      addressId,
      imageUrl,
      videoUrl: '',
      experienceId: experienceTime || 1,
      educationLevel: educationLevel || 0,
      ageFrom:  ageFrom || 0,
      ageTo: ageTo || 100,
      jobStatus: statusPost,
      workingDayNote,
      ...data,
    }
  }
  const updateInformationAndRePostJob = async ({ statusPost, data }) => {
    const body = {
      ...prepareData({ statusPost, data }),
    }
    delete body.jobStatus;
    delete body.expireTime;
    try {
      const id = Number(router.query?.id);
      const resData = await patchUpdateJobApi(id, body);
      await postChangeStatusJobApi(id, {
        jobStatus: statusPostConstants.Waiting,
        services: [],
        promotions: [],
        useServices: statusPost === statusPostConstants.Draft ? useServices : [],
      })
      message.success(resData.data.message);

      router.push({
        pathname: routerPathConstant.erJobPost,
        query: {
          limit: configConstant.itemPerPage.job,
          page: 1,
          jobStatus: statusPostConstants.Waiting
        },
      })
    } catch (e) {
      console.log(e);
      handleError(e)
    }
  }
  const handlePostJob = async ({ statusPost, data }) => {
    
    const body = {
      ...prepareData({ statusPost, data }),
      promotions: [],
      services: [],
      useServices: statusPostConstants.Draft === statusPost? []: useServices,
      jobStatus: statusPost,
    }

    try {
      const resData = await postJobApi(body)
      // eslint-disable-next-line no-unused-expressions
      statusPostConstants.Draft === statusPost ? message.success("Lưu tin nháp thành công.") : message.success(resData.data.message);

      const query: any = {
        limit: configConstant.itemPerPage.job,
        page: 1,
        jobStatus: statusPost
      }
      // if (statusPost === statusPostConstants.Draft) {
      //   query.jobStatus = statusPostConstants.Draft
      // }
      router.push({
        pathname: routerPathConstant.erJobPost,
        query,
      })
    } catch (error) {
      handleError(error);
    }
  }

  const handleChangeToCart = ({ id, serviceId, quantity, name, code }) => {
    const tempCart = [...cartService]
    const index = tempCart.findIndex(item => Number(item.id) === Number(id));
    if (index === -1) {
      tempCart.push({ id, serviceId, name, code, quantity })
    } else {
      tempCart[index] = { id, serviceId, name, code, quantity }
    }
    setValueForm(
      {
        ...valueForm,
        useServices: tempCart
      }
    )
  }
  const handleAddToCart = ({ id, serviceId, name, code }) => {
    const tempCart = [...cartService]
    const index = tempCart.findIndex(item => Number(item.id) === Number(id));
    if (index === -1) {
      tempCart.push({ id, serviceId, name, code, quantity: 1 })
    } else {
      tempCart[index] = { id, serviceId, name, code, quantity: tempCart[index].quantity + 1 }
    }
    setValueForm(
      {
        ...valueForm,
        useServices: tempCart
      }
    )
  }

  const handleRemoveFromCart = (id: number) => {
    const tempCart = [...cartService]
    const index = tempCart.findIndex(item => Number(item.id) === Number(id));
    if (index === -1) return;
    const quantity = tempCart[index].quantity - 1;
    tempCart[index] = {
      ...tempCart[index],
      quantity,
    }
    if (quantity <= 0) tempCart.splice(index, 1);
    setValueForm(
      {
        ...valueForm,
        useServices: tempCart
      }
    )
  }

  const isValidDateBeforeSumbitStepInfo = (form) => {
    
    const values = form.getFieldsValue() || {};
    if (values.shortWorkTime?.length > 1) {
      const compareStartDateToCurrentDate = moment(values.shortWorkTime[0]).diff(new Date(), 'days');
      const compareEndDateToCurrentDate = moment(values.shortWorkTime[1]).diff(new Date(), 'days');
      return isPositiveInteger(compareStartDateToCurrentDate) && isPositiveInteger(compareEndDateToCurrentDate)
    }
    return true
  }

  const isValidDateBeforeSumbitStepTime = (form) => {
    const values = form.getFieldsValue() || {};

    const compareStartDateToCurrentDate = moment(values.timePostJob).diff(new Date(), 'days');
    const compareEndDateToCurrentDate = moment(values.deadlineSubmit).diff(new Date(), 'days');
    return isPositiveInteger(compareStartDateToCurrentDate) && isPositiveInteger(compareEndDateToCurrentDate)
  }

  const handleChangeStep = currentStep => {
    window.scrollTo(0, 0)
    if (currentStep < step) setStep(currentStep)
    else if (currentStep - step === 1)
      switch (step) {
        case jobConstant.stepPost.step1:
          formInfo.submit()
          formInfo
            .validateFields()
            .then(() => {

              if (!isValidDateBeforeSumbitStepInfo(formInfo)) {
                message.warning("Thời gian loại hình công việc phải lớn hơn thời gian hiện tại.");
                return;
              } 
              valueForm = {
                  ...valueForm,
                ...formInfo.getFieldsValue()
              }
              // console.log("valueForm main postjob", valueForm );
              // console.log("formInfo.getFieldsValue", formInfo.getFieldsValue(true));
              setValueForm(valueForm)
              setStep(currentStep)
               })
            .catch(() => {
              message.warning('Bạn cần phải điền đầy đủ thông tin ở bước 1!')
            })

          break

        case jobConstant.stepPost.step2:
          formTime.submit()
          formTime
            .validateFields()
            .then(() => {
              if (!isValidDateBeforeSumbitStepTime(formTime)) {
                message.warning("Thời gian đăng tin và thời gian hạn nộp hồ sơ phải lớn hơn thời gian hiện tại.");
                return;
              } 
              
              valueForm = {
                ...valueForm, 
                ...formTime.getFieldsValue(),
                timePostJob: getUnixTime(new Date(formTime.getFieldValue('timePostJob'))),
                deadlineSubmit: getUnixTime(new Date(formTime.getFieldValue('deadlineSubmit'))),
              };
              setValueForm(valueForm)
              setStep(currentStep)
            })
            .catch(() => {
              message.warning('Bạn cần phải điền đầy đủ thông tin ở bước 2!')
            })
          break

        case jobConstant.stepPost.step3:
          if (cartService.length === 0) {
            message.warning('Bạn cần phải chọn dịch vụ sử dụng ở bước 3!')
          } else if (cartService.every(item => item.code !== serviceConstant.basic.code)) {
            message.warning('Bạn cần phải sử dụng gói cước đăng tin!')
          } else {
            valueForm = { ...valueForm, useServices: cartService };
            setValueForm(valueForm)
            setStep(currentStep)
          }
          break

        case jobConstant.stepPost.step4:
          
          setStep(currentStep)
          break

        default:
          break
      }
    else {
      message.warning('Vui lòng chọn bước tiếp theo!')
    }
  }

  const showStep = () => {
    switch (step) {
      case jobConstant.stepPost.step1:
        return (
          <EmploymentInfo
            form={formInfo}
            valueForm={valueForm}
            handleChangeStep={handleChangeStep}
            handleChangeValueForm={handleChangeValueForm}
          />
        )

      case jobConstant.stepPost.step2:
        return (
          <PostTime
            form={formTime}
            valueForm={valueForm}
            handleChangeStep={handleChangeStep}
            handlePostJob={handlePostJob}
          />
        )

      case jobConstant.stepPost.step3:
        return (
          <ServicePromo
            handleChangeStep={handleChangeStep}
            cartService={cartService}
            handleChangeToCart={handleChangeToCart}
            handleAddToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
          />
        )

      case jobConstant.stepPost.step4:
        return <PreviewJob
          handleChangeStep={handleChangeStep}
          valueForm={valueForm}
          handlePostJob={handlePostJob}
          updateInformationAndRePostJob={updateInformationAndRePostJob}
        />

      default:
        break
    }
  }

  return (
    <div className={`hiring ${styles.hiring}`} ref={squareRef}>
     
      <div className={styles.hiring_wrap}>
        <div className={`bg-white ${styles.stepList}`}>
          <Steps className='mt-0' responsive current={step} onChange={currentStep => handleChangeStep(currentStep)}>
            {listStepRef.current?.map(item => (
              <Step key={item.id} title={item.title} />
            ))}
          </Steps>
        </div>
        <div
          className={`${styles.hiring_card  } mt-4 `}
        >
          {showStep()}
        </div>
      </div>
    </div>
  )
}

export default Hiring