import React, { FC, useEffect, useState } from 'react'

import { Button, Input } from 'antd'
import { getTime } from 'date-fns'
import jobConstant from 'src/constants/jobConstant'
import { statusPostConstants } from 'src/constants/statusConstant'
import { useAppSelector } from 'src/redux'
import { convertToHumanDate, formatNumber } from 'src/utils/helper'
import { getDetailCompanyApi } from 'api/client/company'
import { getUserAddressBuyIdApi } from 'api/client/address'

import { useRouter } from 'next/router'
import moment from 'moment'
import { configConstant } from 'src/constants/configConstant'
import { serviceConstant } from 'src/constants/serviceConstant'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import defaultConstant from 'src/constants/defaultConstant'
import { CaretLeftOutlined } from '@ant-design/icons'
import styles from './PreviewJob.module.scss'

interface IProps {
  valueForm: JobGlobal.JobValueForm
  handlePostJob({ statusPost, data }): void
  updateInformationAndRePostJob({ statusPost, data }): void
  handleChangeStep(step): void
}

const Preview: FC<IProps> = ({ valueForm, handlePostJob, updateInformationAndRePostJob,  handleChangeStep, }) => {
  const profile = useAppSelector(state => state.user.profile || {})

  // console.log("valueForm", valueForm);

  const {
    addressType,
    jobTitle,
    jobCate,
    workingDayNote,
    hireCount,
    jobType,
    shortWorkTime,
    userAddress,
    companyAddressId,
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
    companyId,
    uploadFile,
    imageUrl,
  } = valueForm

  const {
    WageUnit: wageUnitList,
    FjobEducationLevel: educationList,
    FjobCategory: categoryList,
    FjobBenefit: benefitList,
    JobType: jobTypeList,
    FjobShift: jobShiftList,
    FjobExperience: experienceList,
  } = useAppSelector(state => state.initData.data)

  const [ownPost, setOwnPost] = useState<any>({})
  const [isOnce, setIsOnce] = useState(true)
  const router = useRouter();

  const renderTagPost = () => (
    <>
      {useServices.some(item => [serviceConstant.urgentJob24h.code, serviceConstant.urgentJobAWeek.code].includes(item.code)) && (
        <div className={styles.previewJob_header_tag_urgent}>
          <img src="/assets/icons/icon_urgent.png" alt="" className='object-fit-contain' />
          Siêu gấp
        </div>
      )}
      {useServices.some(item => [serviceConstant.hotJob24h.code, serviceConstant.hotJobAWeek.code].includes(item.code)) && (
        <div className={styles.previewJob_header_tag_hot}>
          <img src="/assets/icons/icon_hot.png" alt="" className='object-fit-contain' />
          Siêu hot
        </div>
      )}
    </>
  )

  const renderWage = () =>
    `${salaryType === jobConstant.salaryType.range.key
      ? `${formatNumber(salaryMin)} - ${formatNumber(salaryMax)} VNĐ / ${wageUnitList.find(item => item.id === salaryUnit)?.name
      }`
      : 'Thoả thuận'
    }`

  const renderJobType = () => jobTypeList.find(item => item.id === jobType)?.name

  const renderGender = () => {
    const arrTmp: any = []
    if (chooseGender?.length) {
      Object.keys(jobConstant.genderName).forEach(element => {
        if (chooseGender.includes(jobConstant.genderName[element].key)) {
          arrTmp.push(jobConstant.genderName[element].value)
        }
      })
      return arrTmp.join(', ')
    }
    return 'Không yêu cầu'
  }

  const renderAge = () => {
    if (!ageTo && !ageFrom) return 'Không yêu cầu'
    if (ageFrom && ageTo) return `${ageFrom} - ${ageTo} tuổi`
    if (ageFrom) return `Từ ${ageFrom} tuổi`
    if (ageTo) return `Dưới ${ageTo} tuổi`
    // return 'Không yêu cầu'
  }

  const renderEducation = () => {
    if (!educationLevel) return 'Không yêu cầu'
    return educationList.find(item => item.id === educationLevel)?.name
  }

  const renderExperience = () => {
    const experience: any = []

    if (experienceJob?.length) {
      let str = 'Lĩnh vực kinh nghiệm:'
      experienceJob.forEach(id => {
        str += ` ${categoryList.find(item => item.id === id)?.name}, `
      })
      str = str.slice(0, -2)
      experience.push(str)
    } else experience.push('Lĩnh vực kinh nghiệm: Không yêu cầu')

    if (!experienceTime) experience.push('Thời gian kinh nghiệm: Không yêu cầu')
    else {
      experience.push(
        `Thời gian kinh nghiệm: ${experienceList.find(item => item.id === experienceTime)?.name || "Không yêu cầu"}`,
      )
    }

    return experience
  }

  const renderBenefit = () => {
    const benefit: any[] = []
    benefitList.forEach(element => {
      if (benefitPolicy.includes(element.id)) benefit.push(element)
    })
    return benefit
  }

  const renderSchedule = () => {
    const workTime: any = []
    let workDay = ''
    let wokingShortTime = ''

    const arrHour: any = []

    const jobSchedules: {
      dayOfWeek: number
      shiftId: number
      workTimeFrom?: number
      workTimeTo?: number
      workTimeFromM?: number
      workTimeToM?: number
      name?: string
    }[] = []

    if (calendarType === jobConstant.calendarType.hour.key) {
      dayOfWeek.sort().map(day =>
        jobSchedules.push({
          dayOfWeek: day,
          shiftId: 0,
          workTimeFrom: workHour && new Date(workHour[0]).getHours(),
          workTimeTo: workHour && new Date(workHour[1]).getHours(),
          workTimeFromM: new Date(workHour[0]).getMinutes(),
          workTimeToM: new Date(workHour[1]).getMinutes(),
        }),
      )
    }

    if (calendarType === jobConstant.calendarType.shift.key) {
      dayOfWeek.sort().map(day =>
        workShift?.sort().forEach(shiftId => {
          const jobShift = jobShiftList.find(item => item.id === shiftId)
          if (jobShift?.timeFrom && jobShift?.timeTo && jobShift?.name)
            jobSchedules.push({
              dayOfWeek: day,
              shiftId,
              workTimeFrom: jobShift.timeFrom,
              workTimeTo: jobShift.timeTo >= 24 ? jobShift.timeTo - 24 : jobShift.timeTo,
              name: jobShift.name,
            })
        }),
      )
    }

    if (shortWorkTime?.length && jobType === jobConstant.jobType.short.key) {
      wokingShortTime = `${convertToHumanDate(
        getTime(new Date(shortWorkTime[0] / 1000)),
      )} -> ${convertToHumanDate(getTime(new Date(shortWorkTime[1] / 1000)))}`
      workTime.push(wokingShortTime)


    }


    // else wokingShortTime = '- Dài hạn'

    // day
    if (jobSchedules.filter(item => Number(item.dayOfWeek) === dayOfWeekConstant.allDay.key).length) {
      workDay = 'Hằng ngày'
    } else {
      const arrWorkDay: any[] = []
      jobSchedules.map(
        item =>
          !arrWorkDay.includes(item.dayOfWeek.toString()) &&
          arrWorkDay.push(item.dayOfWeek.toString()),
      )

      workDay = arrWorkDay.filter(item => Number(item) !== dayOfWeekConstant.sunday.key).length ? 'Thứ ' : '';

      arrWorkDay.sort().forEach((item, index) => {
        if (Number(item) === dayOfWeekConstant.sunday.key) workDay += 'CN'
        else workDay += `${item} ${index !== arrWorkDay.length - 1 ? ", " : ""}`
      })
    }

    if (!jobSchedules[0].shiftId) {
      arrHour.push({
        workTimeFrom: jobSchedules[0].workTimeFrom,
        workTimeTo: jobSchedules[0].workTimeTo,
        workTimeFromM: jobSchedules[0].workTimeFromM,
        workTimeToM: jobSchedules[0].workTimeToM,
      })
    } else {
      const arrShift: any = []

      jobSchedules.forEach(
        schedule =>
          !arrShift.includes(schedule?.shiftId) &&
          arrShift.push(schedule?.shiftId) &&
          arrHour.push({
            workTimeFrom: schedule?.workTimeFrom,
            workTimeTo: schedule?.workTimeTo,

            name: schedule?.name,
          }),
      )
    }

    arrHour.forEach(item =>
      workTime.push(`${item.name ? `${item.name} (${item.workTimeFrom}h - ${item.workTimeTo}h)`
        : `${String(item.workTimeFrom).padStart(2, '0')}:${String(item.workTimeFromM).padStart(2, '0')} 
            - ${String(item.workTimeTo).padStart(2, '0')}:${String(item.workTimeToM).padStart(2, '0')}`}, ${workDay}`),
    )

    return workTime
  }

  useEffect(() => {
    const fetchData = async () => {
      if (addressType === jobConstant.recruit.person.key) {
        const resData = await getUserAddressBuyIdApi(userAddress)
        setOwnPost({
          id: profile?.id,
          name: profile?.name,
          avatar: profile?.avatar,
          address: resData.data.data.address,
        })
      }
      if (addressType === jobConstant.recruit.company.key) {
        const resData = await getDetailCompanyApi(companyId)

        setOwnPost({
          id: resData.data.id,
          name: resData.data.name,
          avatar: resData.data.avatar,
          address: resData.data.companyAddress.find(item => item.id === companyAddressId)
            ?.address,
        })
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div className={styles.section_form_hiring}>
          <div className={styles.header}>
            Đăng tin
          </div>
          <div className={styles.content_wrap}>
          <div className={styles.previewJob}>
            <div className={styles.previewJob_wrap}>
              <div className={styles.previewJob_header}>
                <div className={styles.previewJob_header_information}>
                  <div className={styles.previewJob_header_avt}>
                    <img
                      src={ownPost.avatar || defaultConstant.defaultAvatarUser}
                      width={64}
                      height={64}
                      alt=""
                    />
                  </div>
                  <div className={styles.previewJob_header_info}>
                    <div className={styles.previewJob_header_tag}>{renderTagPost()}</div>
                    <div className={styles.previewJob_header_name}>{ownPost.name}</div>
                    <div className={styles.previewJob_header_timeRemain}>
                      Hạn nộp hồ sơ: {moment.unix(deadlineSubmit).format(configConstant.displayTime.DDMMYYY)}
                    </div>
                  </div>
                </div>

                <div className={styles.previewJob_header_title}>{jobTitle}</div>
              </div>

              <div className={styles.previewJob_information}>
                <div className={styles.previewJob_information_title}>Thông tin công việc</div>
                <div className={styles.previewJob_information_list}>
                  <div className={styles.previewJob_information_item}>
                    <img alt="" src="/assets/icons/color/money.svg" />
                    <div className={styles.previewJob_information_name}>Mức lương:</div>
                    <div className={styles.previewJob_information_value}>{renderWage()}</div>
                  </div>
                  <div className={styles.previewJob_information_item}>
                    <img alt="" src="/assets/icons/color/job_type.svg" />
                    <div className={styles.previewJob_information_name}>Loại hình công việc:</div>
                    <div className={styles.previewJob_information_value}>{renderJobType()}</div>
                  </div>
                  <div className={styles.previewJob_information_item}>
                    <img alt="" src="/assets/icons/color/people_group.svg" />
                    <div className={styles.previewJob_information_name}>Số lượng cần tuyển:</div>
                    <div className={styles.previewJob_information_value}>{hireCount} người</div>
                  </div>
                  <div className={styles.previewJob_information_location}>
                    <img alt="" src="/assets/icons/color/location.svg" />
                    <span className={styles.previewJob_information_location_name}>Địa chỉ làm việc:</span>
                    <span className={styles.previewJob_information_location_value}>
                      {ownPost.address}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.previewJob_information}>
                <div className={styles.previewJob_information_title}>Lịch làm việc</div>
                <div className={styles.previewJob_information_list}>
                  <div className={styles.previewJob_information_schedule}>
                    {jobType === jobConstant.jobType.short.key ? (
                      <>
                        <div className={styles.previewJob_information_item}>
                          <img alt="" src="/assets/icons/color/time_access.svg" />
                          <div className={styles.previewJob_information_name}>Thời gian làm việc:</div>
                        </div>
                        <div className={`${styles.previewJob_information_value} ml-4`}>
                          {renderSchedule().map((item, idx) => (
                            <div key={idx}>{item}</div>
                          ))}
                          {
                            workingDayNote && 
                            <div>Ghi chú: {workingDayNote}</div>
                          }
                        </div>
                      </>
                      
                    ) : (
                      <div className={styles.previewJob_information_schedule_item}>
                        <div className={styles.previewJob_information_schedule_title}>
                          <img alt="" src="/assets/icons/color/time_access.svg" />
                          <div className={styles.previewJob_information_schedule_name}>
                            Thời gian làm việc:
                          </div>
                        </div>
                        <div className={styles.previewJob_information_schedule_value}>
                          {renderSchedule().map((item, idx) => (
                            <div key={idx}>- {item}</div>
                          ))}
                          {
                            workingDayNote && 
                            <div>Ghi chú: {workingDayNote}</div>
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.previewJob_require}>
                <div className={styles.previewJob_require_title}>Yêu cầu</div>
                <div className={styles.previewJob_require_list}>
                  <div className={styles.previewJob_require_item}>
                    <img alt="" src="/assets/icons/color/sex.svg" />
                    <div className={styles.previewJob_require_name}>Giới tính:</div>
                    <div className={styles.previewJob_require_value}>{renderGender()}</div>
                  </div>
                  <div className={styles.previewJob_require_item}>
                    <img alt="" src="/assets/icons/color/year.svg" />
                    <div className={styles.previewJob_require_name}>Độ tuổi:</div>
                    <div className={styles.previewJob_require_value}>{renderAge()}</div>
                  </div>
                  <div className={styles.previewJob_require_item}>
                    <img alt="" src="/assets/icons/color/edu.svg" />
                    <div className={styles.previewJob_require_name}>Học vấn:</div>
                    <div className={styles.previewJob_require_value}>{renderEducation()}</div>
                  </div>
                  <div className={styles.previewJob_require_exp}>
                    <div className={styles.previewJob_require_exp_title}>
                      <img alt="" src="/assets/icons/color/achievements.svg" />
                      <div className={styles.previewJob_require_exp_name}>Kinh nghiệm:</div>
                    </div>
                    <div style={{ marginLeft: '2rem' }}>
                      {renderExperience().map((item, idx) => (
                        <div key={idx}>- {item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.previewJob_desc}>
                <div className={styles.previewJob_desc_title}>Mô tả công việc</div>
                <div className={styles.previewJob_desc_text}>
                  <div className={`hiring_desc ${styles.previewJob_desc_textarea}`}>
                    <Input.TextArea autoSize={{ minRows: 1 }} value={detailDesc} bordered={false} />
                  </div>
                </div>
              </div>
              {
                imageUrl &&
                <div className={styles.previewJob_img}>
                  <div className={styles.previewJob_img_title}>Hình ảnh mô tả</div>
                  <div className={styles.previewJob_img_value}>
                    <img alt="" src={imageUrl} />
                  </div>
                </div>
              }

              <div className={styles.previewJob_more}>
                <div className={styles.previewJob_more_title}>Yêu cầu thêm</div>
                <div className={styles.previewJob_more_text}>
                  {moreRequire ? (
                    <div className={`hiring_desc ${styles.previewJob_desc_textarea}`}>
                      <Input.TextArea autoSize={{ minRows: 1 }} value={moreRequire} bordered={false} />
                    </div>
                  ) : (
                    <div>Không yêu cầu</div>
                  )}
                </div>
              </div>
              <div className={styles.previewJob_benefit} style={{borderBottom: 0}}>
                <div className={styles.previewJob_benefit_title}>Phúc lợi đãi ngộ</div>
                <div className={styles.previewJob_benefit_text}>
                  {benefitPolicy?.length ? (
                    renderBenefit().map(item => <div key={item.id}>- {item.name}</div>)
                  ) : (
                    <div>Thoả thuận</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.previewJob_post  } d-flex justify-content-center py-4`}>
        <Button
          // htmlType=''
          // htmlType='button'
          className={`${styles.btn_back_step} mr-4`}
          onClick={() => {
            handleChangeStep(jobConstant.stepPost.step3)}
          }
        >
          <CaretLeftOutlined />
          Quay lại
        </Button>
        {
          router.query.isUpdating ?
            <Button
              htmlType='submit'
              type="primary"
              style={{
                pointerEvents: isOnce ? 'all' : 'none',
                cursor: isOnce ? 'pointer' : 'not-allowed',
              }}
              className={styles.button_post_job}
              onClick={() => {
                setIsOnce(false)
                updateInformationAndRePostJob({ statusPost: Number(router.query.jobStatus), data: {} })
              }}
            >
              Đăng lại
            </Button> :
            <Button
              htmlType='submit'
              type="primary"
              style={{
                pointerEvents: isOnce ? 'all' : 'none',
                cursor: isOnce ? 'pointer' : 'not-allowed',
              }}
              onClick={() => {
                setIsOnce(false)
                handlePostJob({ statusPost: statusPostConstants.Waiting, data: {} })
              }}
              className={styles.button_post_job}
            >
              Đăng tin
            </Button>
        }

      </div>
    </>
    
  )
}

export default Preview
