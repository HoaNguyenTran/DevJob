import { CheckOutlined } from '@ant-design/icons'
import { Col, Image, Input, message, Modal, Radio, Row } from 'antd'
import { addDays, compareAsc, formatDistanceToNow, fromUnixTime } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef, useState } from 'react'
import DiamondBig from 'src/components/elements/Diamond/DiamondBig'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { configConstant } from 'src/constants/configConstant'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import defaultConstant from 'src/constants/defaultConstant'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { infoUserStatus, statusApplyConstants } from 'src/constants/statusConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { firebase } from 'src/utils/firebase'
import {
  checkCompleteInfo, convertTimeToHHmm, convertToHumanDate, formatNumber,
  getTokenUser, isServer, newWindowPopupCenter
} from 'src/utils/helper'
import styles from './Job.module.scss'
import SideBar from './SideBar'
import WorkOther from './WorkOther'


interface IProps {
  handleSaveJob(): void
  handleUnSaveJob(): void
  handleApplyJob(): void
  handleUnApplyJob(data: JobApplyGlobal.JobApplyUnReason): void
  job?: any
  rawDataJob?: any
}


const JobDetail: FC<IProps> = ({
  job,
  handleSaveJob,
  handleUnSaveJob,
  handleApplyJob,
  handleUnApplyJob,
  rawDataJob,
}) => {
  const {
    id, userId, jobId, ownPost, adddress, isHotJob, isUrgent, isSaveJob, jobTitle, wageMax, wageMin, wageUnit, jobType, hireCount,
    workAddress, jobSchedules, genders, ageFrom, ageTo, educationLevel, experiences, matchJob, jobCateDetail, startTime, expireTime,
    expiredDate, detailDesc, moreDesc, benefits, jobStatus, applyingStatus, wokingShortTimeFrom, wokingShortTimeTo, imageUrl,
    workingDayNote
  } = job


  const masterData = useAppSelector(state => state.initData.data)
  const profile = useAppSelector(state => state.user.profile || {})

  const {
    WageUnit: wageUnitList = [],
    JobType: jobTypeList = [],
    Gender: genderList = [],
    FjobEducationLevel: educationList = [],
    JobReason: reasonList = [],
    FjobBenefit: benefitList = [],
    FjobCategory: categoryList = [],
    FjobExperience: experienceList = [],
    FjobShift: shiftList = [],
  } = masterData

  const router = useRouter();

  const refMore = useRef<HTMLInputElement | null>(null)
  const [statusRej, setStatusRej] = useState(null)
  const [noteRej, setNoteRej] = useState('');


  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const [isRefuseModal, setIsRefuseModal] = useState(false)
  const [isShowSuggestUpdateInfoModal, setIsShowSuggestUpdateInfoModal] = useState(false)

  const [isShowRelatedJobModal, setIsShowRelatedJobModal] = useState(false);
  const [isShowInformationCompanyModal, setIsShowInformationCompanyModal] = useState(false);

  const isCreatedJobByCompany = rawDataJob?.companyId;
  const isPreviewJob = !router.asPath.includes(routerPathConstant.jobDetail.replace(":id", ""))


  const checkOwnPost = () => {
    if (userId === profile.id) return true
    return false
  }


  const handleClickApplyJob = () => {
    if (!getTokenUser() && !isServer()) {
      window.location.href = `${routerPathConstant.signIn}?next=${window.location.href}`
      return;
    }
    // console.log(checkCompleteInfo(profile));

    if (checkCompleteInfo(profile) === infoUserStatus.full) return handleApplyJob()
    return setIsShowSuggestUpdateInfoModal(true)
  }


  const handleOpenLinkJob = () => {
    switch (checkCompleteInfo(profile)) {
      case infoUserStatus.infoAcc:
        return router.push({
          pathname: routerPathConstant.portfolio,
          query: {
            next: encodeURIComponent(router.asPath),
          }
        })

      case infoUserStatus.cv:
        return router.push({
          pathname: routerPathConstant.accInfo,
          query: {
            next: encodeURIComponent(router.asPath),
          }
        })

      case infoUserStatus.nothing:
        return router.push({
          pathname: routerPathConstant.accInfo,
          query: {
            next: encodeURIComponent(routerPathConstant.portfolio),
            attachNext: encodeURIComponent(router.asPath),
          }
        })

      default:
        break;
    }
  }

  const handleOkRefuseModal = () => {
    if (!statusRej) return message.error('Bạn cần chọn lý do huỷ ứng tuyển!')
    if ((statusRej === 0 && noteRej.trim().length === 0)) {
      return message.error('Bạn cần điền lý do huỷ ứng tuyển!')
    }
    if (statusRej === 0 && noteRej.trim().length > 0)
      handleUnApplyJob({ reason: statusRej, note: noteRej })
    else if (typeof statusRej === 'number') handleUnApplyJob({ reason: statusRej })
    setIsRefuseModal(false)
    setNoteRej('')
    setStatusRej(null)
  }

  const handleCancelRefuseModal = () => {
    setIsRefuseModal(false)
    setNoteRej('')
    setStatusRej(null)
  }

  const renderStatusApply = () => {

    switch (applyingStatus) {
      case statusApplyConstants.NotApply:
        return (
          <button onClick={handleClickApplyJob} className={styles.btn_appling_job} type="button">
            Ứng tuyển
          </button>
        )
      case statusApplyConstants.Waiting:
        return (
          <button
            onClick={() => setIsRefuseModal(true)}
            className={styles.btn_appling_job}
            type="button"
          >
            Huỷ ứng tuyển
          </button>
        )
      case statusApplyConstants.Accept:
        return (
          <button
            onClick={() => setIsRefuseModal(true)}
            className={styles.btn_appling_job}
            type="button"
          >
            Huỷ ứng tuyển
          </button>
        )
      case statusApplyConstants.Reject:
        return (
          <button onClick={handleClickApplyJob} className={styles.btn_appling_job} type="button">
            Ứng tuyển lại
          </button>
        )

      default:
        return (
          <button onClick={handleClickApplyJob} className={styles.btn_appling_job} type="button">
            Ứng tuyển lại
          </button>
        )
    }
  }

  const renderExpireTime = () => {
    const days = 30

    if (Math.floor(Date.now() / 1000) - expiredDate > 0) {
      return 'Hết hạn ứng tuyển'
    }

    if (compareAsc(addDays(new Date(), days), fromUnixTime(expiredDate)) > 0) {
      return `Còn lại ${formatDistanceToNow(fromUnixTime(expiredDate), { locale: viLocale })}`
    }

    return convertToHumanDate(expiredDate)
  }

  const renderWage = () =>
    `${wageMin
      ? `${formatNumber(wageMin)} - ${formatNumber(wageMax)} VNĐ / ${wageUnitList.find(item => item.id === wageUnit)?.name
      }`
      : 'Thoả thuận'
    }`

  const renderJobType = () => jobTypeList.find(item => item.id === jobType)?.name

  const renderGender = () => {
    let gender = ''
    const arrTmp: any = []
    if (!genders) {
      gender = 'Không yêu cầu'
      return gender
    }
    genderList.map(itemGender => genders.includes(itemGender.id))
    if (genders.includes(configConstant.gender.male.key)) arrTmp.push(configConstant.gender.male.text)
    if (genders.includes(configConstant.gender.female.key)) arrTmp.push(configConstant.gender.female.text)
    if (genders.includes(configConstant.gender.other.key)) arrTmp.push(configConstant.gender.other.text)
    return arrTmp.join(', ')
  }

  const renderAge = () => {
    if (!ageTo && !ageFrom) return 'Không yêu cầu'
    if (ageFrom!==configConstant.age.minAge && ageTo!==configConstant.age.maxAge) return `${ageFrom} - ${ageTo} tuổi`
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

    if (jobCateDetail?.length) {
      let str = 'Lĩnh vực kinh nghiệm:'
      jobCateDetail.forEach(idJobCate => {
        str += ` ${categoryList.find(item => item.id === idJobCate)?.name}, `
      })
      str = str.slice(0, -2)
      experience.push(str)
    } else experience.push('Lĩnh vực kinh nghiệm: Không yêu cầu')

    if (!experiences || experiences === 1) experience.push('Thời gian kinh nghiệm: Không yêu cầu')
    else {
      experience.push(
        `Thời gian kinh nghiệm: ${experienceList.find(item => item.id === experiences)?.name}`,
      )
    }

    return experience
  }

  const renderBenefit = () => {
    const benefit: any[] = []
    if (!benefits?.length) return []
    benefitList.forEach(element => {
      if (benefits.includes(element.id)) benefit.push(element.name)
    })
    return benefit
  }

  const renderSchedule = () => {
    const workSchedule: any = []
    let workDay = ''
    const arrHour: any = []
    let strShift = ''

    if (jobType === 1) {
      workSchedule.push(
        `- Từ ${convertToHumanDate(wokingShortTimeFrom)} đến ${convertToHumanDate(
          wokingShortTimeTo,
        )}`,
      )
    }
    if (!jobSchedules) return
    if (jobSchedules[0].dayOfWeek === 1) {
      workDay = 'Hằng ngày'
    } else {

      const arrWorkDay: any[] = []
      jobSchedules.map(
        item => !arrWorkDay.includes(item.dayOfWeek) && arrWorkDay.push(item.dayOfWeek),
      )

      if (arrWorkDay.length === 1 && arrWorkDay[0] === dayOfWeekConstant.sunday.key)
        workDay = "CN"
      else {
        workDay = 'Thứ '
        arrWorkDay.sort().forEach(item => {
          if (item === dayOfWeekConstant.sunday.key) workDay += 'CN, '
          else workDay += `${item}, `
        })
        workDay = workDay.slice(0, -2)
      }

    }

    const strTmp: any = []

    if (!jobSchedules[0].shiftId) {
      arrHour.push({
        workTimeFrom: jobSchedules[0].workTimeFrom,
        workTimeTo: jobSchedules[0].workTimeTo,
      })
      arrHour.forEach(item =>
        strTmp.push(
          `- ${convertTimeToHHmm(item.workTimeFrom)} - ${convertTimeToHHmm(item.workTimeTo)}`,
        ),
      )
      // arrHour.forEach(item => strTmp.push(`- ${item.workTimeFrom}h - ${item.workTimeTo}h`))
      workSchedule.push(`${strTmp}, ${workDay}`)
    } else {
      const arrShift: any = []

      jobSchedules.forEach(schedule => {
        strShift = shiftList.find(shift => shift.id === schedule.shiftId)?.name || ""

        return (
          !arrShift.includes(schedule.shiftId) &&
          arrShift.push(schedule.shiftId) &&
          strTmp.push(
            ` ${strShift} (${convertTimeToHHmm(schedule.workTimeFrom)} - ${schedule.workTimeTo >= 24
              ? convertTimeToHHmm(`${schedule.workTimeTo - 24}.00`)
              : convertTimeToHHmm(schedule.workTimeTo)
            })`,
          )
        )
      })
      strTmp.forEach(item => workSchedule.push(`- ${item}, ${workDay}`))
    }

    return workSchedule
  }
  const sharePostFb = () => {
    newWindowPopupCenter({
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
        typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}${routerPathConstant.jobDetail.replace(":id", "")}${router.query.jobId}` : '',
      )}`,
      title: 'Facebook Dialog',
      w: 500,
      h: 500,
    })
  }

  useEffect(() => {
    try {
      firebase.analytics().logEvent(firebaseAnalytics.viewJob, { id: jobId });
      if (localStorage.getItem(storageConstant.localStorage.flagAutoApplyJob) === String(jobId)) {
        const { name, phoneNumber, birthday, gender, addresses,
          academicId, favCats, profSkills, expectSalaryFrom, expectSalaryTo, hasExperience } = profile;

        if (name && phoneNumber && birthday && addresses?.length && typeof gender === 'number'
          && academicId && favCats?.length && profSkills?.length && expectSalaryFrom && expectSalaryTo
          && typeof hasExperience === 'number') return handleApplyJob()
      }
    } catch (error) {
      console.error("error", error);
    } finally {
      localStorage.removeItem(storageConstant.localStorage.flagAutoApplyJob);
    }
  }, [])

  return (
    <div className={styles.jobDetail}>
      <div className={styles.jobDetail_wrap}>
        <div className={styles.jobDetail_header}>
          <div className={`${styles.jobDetail_header_information} justify-content-space-between`}>
            <div className='d-flex align-items-center'>
              <div className={styles.jobDetail_header_avt}>
                <img
                  src={ownPost.ownJobAvatar || configConstant.defaultPicture}
                  width={64}
                  height={64}
                  alt=""
                />

              </div>
              <div className='ml-3'>
                <div className={styles.jobDetail_header_tag}>
                  <span className={styles.number_id}>#{id}</span>
                  {!!isUrgent && (
                    <div className={styles.jobDetail_header_tag_urgent}>
                      <img src="/assets/icons/icon_urgent.png" className='object-fit-contain' alt="" />
                      Siêu gấp
                    </div>
                  )}
                  {!!isHotJob && (
                    <div className={styles.jobDetail_header_tag_hotjob}>
                      <img src="/assets/icons/icon_hot.png" className='object-fit-contain' alt="" />
                      Siêu hot
                    </div>
                  )}
                </div>
                <div className={styles.jobDetail_header_name}>{jobTitle} </div>
                <div className={`${styles.jobDetail_header_ownPost} d-flex align-items-center`}>
                  <img src='/assets/icons/color/verification_success.png' alt='verification' className='mr-1' />
                  <span>{ownPost.ownJobName}</span>
                </div>
                <div className={`${styles.jobDetail_header_timeRemain} mt-2 d-flex align-items-center`}>
                  <img src='/assets/icons/color/icon_time_out.png' alt='time-out' className='mr-1' /> {renderExpireTime()}
                </div>
              </div>
            </div>
            <div className={`${styles.jobDetail_header_info} d-flex justify-content-space-between`}>
              <div className='action d-flex justify-content-space-between' style={{ flexDirection: "column" }}>
                <div className='d-flex' style={{ justifyContent: "flex-end" }}>
                  {
                    !isPreviewJob && (
                      <div>
                        {
                          !checkOwnPost() &&
                          (isSaveJob ? (
                            <img className='cursor-pointer mr-3' src='/assets/icons/color/heart.png' alt='heart' onClick={handleUnSaveJob} />

                          ) : (
                            <img className='cursor-pointer mr-3' src='/assets/icons/color/heart_default.png' alt='heart default' onClick={() => {
                              if (!getTokenUser() && !isServer()) {
                                window.location.href = `${routerPathConstant.signIn}?next=${window.location.href}`
                                return;
                              }
                              handleSaveJob()
                            }} />
                          ))}
                      </div>
                    )
                  }
                  <div>
                    <img onClick={sharePostFb} className='cursor-pointer' src="/assets/icons/color/share.png" alt='share-facebook' />
                  </div>
                </div>

                {
                  !checkOwnPost() &&
                  <div className={styles.btn_appling_job}>
                    {renderStatusApply()}
                  </div>
                }
              </div>
            </div>

          </div>
          {
            isPreviewJob &&
            <Row className='mb-4' gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} md={12} className="">
                <button onClick={() => setIsShowInformationCompanyModal(true)} className={styles.btn_popup_information} type='button'>Thông tin {isCreatedJobByCompany ? "công ty" : "nhà tuyển dụng"}</button>
              </Col>
                <Col xs={24} md={12} className="text-right">
                <button onClick={() => setIsShowRelatedJobModal(true)} className={styles.btn_popup_information} type='button'>Việc làm liên quan</button>
              </Col>
            </Row>
          }
        </div>

        <div className={styles.jobDetail_information}>
          <div className={styles.jobDetail_information_title}>Thông tin công việc</div>
          <div className={styles.jobDetail_information_list}>
            <div className={styles.jobDetail_information_item}>
              <img alt="" src="/assets/icons/color/money.svg" />
              <div className={styles.jobDetail_information_name}>Mức lương:</div>
              <div className={styles.jobDetail_information_value}>{renderWage()}</div>
            </div>
            <div className={styles.jobDetail_information_item}>
              <img alt="" src="/assets/icons/color/job_type.svg" />
              <div className={styles.jobDetail_information_name}>Loại hình công việc:</div>
              <div className={styles.jobDetail_information_value}>{renderJobType()}</div>
            </div>
            <div className={styles.jobDetail_information_item}>
              <img alt="" src="/assets/icons/color/people_group.svg" />
              <div className={styles.jobDetail_information_name}>Số lượng cần tuyển:</div>
              <div className={styles.jobDetail_information_value}>{hireCount} người</div>
            </div>
            <div className={`${styles.jobDetail_information_location}`}>
              <img alt="" src="/assets/icons/color/location.svg" />
              <span className={styles.jobDetail_information_location_name}>Địa chỉ làm việc:</span>
              <span className={styles.jobDetail_information_location_value}>
                {adddress?.address ? adddress?.address : workAddress}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.jobDetail_schedule}>
          <div className={styles.jobDetail_schedule_title}>Lịch làm việc</div>
          <div className={styles.jobDetail_schedule_list}>
            <div className={styles.jobDetail_schedule_name}>
              <img alt="" src="/assets/icons/color/time_access.svg" />
              <div className={styles.jobDetail_schedule_name}>Thời gian làm việc:</div>
            </div>
            <div className={styles.jobDetail_schedule_value}>
              {renderSchedule()?.map((item, idx) => (
                <div key={idx} className={styles.jobDetail_schedule_value_item}>
                  {item}
                </div>
              ))}
               <div>- Ghi chú: {workingDayNote}</div>
            </div>
           
          </div>
        </div>

        <div className={styles.jobDetail_require}>
          <div className={styles.jobDetail_require_title}>Yêu cầu</div>
          <div className={styles.jobDetail_require_list}>
            <div className={styles.jobDetail_require_item}>
              <img alt="" src="/assets/icons/color/sex.svg" />
              <div className={styles.jobDetail_require_name}>Giới tính:</div>
              <div className={styles.jobDetail_require_value}>{renderGender()}</div>
            </div>
            <div className={styles.jobDetail_require_item}>
              <img alt="" src="/assets/icons/color/year.svg" />
              <div className={styles.jobDetail_require_name}>Độ tuổi:</div>
              <div className={styles.jobDetail_require_value}>{renderAge()}</div>
            </div>
            <div className={styles.jobDetail_require_item}>
              <img alt="" src="/assets/icons/color/edu.svg" />
              <div className={styles.jobDetail_require_name}>Học vấn:</div>
              <div className={styles.jobDetail_require_value}>{renderEducation()}</div>
            </div>
            <div className={styles.jobDetail_require_exp}>
              <div className={styles.jobDetail_require_exp_title}>
                <img alt="" src="/assets/icons/color/achievements.svg" />
                <div className={styles.jobDetail_require_exp_name}>Kinh nghiệm:</div>
              </div>
              <div className="ml-5">
                {renderExperience().map((item, idx) => (
                  <div key={idx}>- {item}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* {!!matchJob && */}
        {!checkOwnPost() && getTokenUser() && (
          <div className={styles.jobDetail_match}>
            <div className={styles.jobDetail_match_wrap}>
              <div className={styles.jobDetail_match_title}>Mức phù hợp với công việc</div>
              <p className={styles.jobDetail_match_subtitle}>
                Đây là thang điểm đánh giá mức độ phù hợp dựa trên Hồ sơ của bạn và mô tả công việc
                này
              </p>
              {!!matchJob && <div className={styles.jobDetail_match_progress}>
                <DiamondBig value={matchJob} />
              </div>}
              <div className={styles.jobDetail_match_subtitle}>
                Độ phù hợp với công việc này là:
              </div>
              <div className={styles.jobDetail_match_number}>{matchJob || 0} %</div>
            </div>
          </div>
        )}
        {/* } */}

        <div className={styles.jobDetail_desc}>
          <div className={styles.jobDetail_desc_title}>Mô tả công việc</div>
          <div className="ml-5">
            <Input.TextArea autoSize={{ minRows: 1 }} value={detailDesc} bordered={false} />
          </div>
          <Image src={imageUrl} />
        </div>

        <div className={styles.jobDetail_more}>
          <div className={styles.jobDetail_more_title}>Yêu cầu thêm</div>
          <div className="ml-5">
            {moreDesc ? (
              <div className={`hiring_desc ${styles.previewJob_desc_textarea}`}>
                <Input.TextArea autoSize={{ minRows: 1 }} value={moreDesc} bordered={false} />
              </div>
            ) : (
              <div>Không yêu cầu</div>
            )}
          </div>
        </div>

        <div className={styles.jobDetail_benefit}>
          <div className={styles.jobDetail_benefit_title}>Phúc lợi đãi ngộ</div>
          <div className="ml-5">
            {renderBenefit().length
              ? renderBenefit().map((item, idx) => <div key={idx}>- {item}</div>)
              : 'Thoả thuận'}
          </div>
        </div>

        {!checkOwnPost() && (
          <div className={styles.jobDetail_action}>
            {renderStatusApply()}
            {/* <Call mode="toER" calleeId={userId} jobId={jobId} /> */}
            <button className={styles.call} type="button" onClick={() => setIsShowModalApp(true)}>
              Liên hệ
            </button>
          </div>
        )}
        {
          !isPreviewJob &&
          <div className={`${styles.related_jobs} mt-5`}>
            <div className={`${styles.title} mb-5`}>Việc làm liên quan</div>
            <WorkOther data={rawDataJob} companyIdJob={rawDataJob?.company?.id} userIdJob={rawDataJob?.user?.id} />
          </div>
        }

      </div>

      <Modal
        wrapClassName="modal-global"
        title="Lý do từ chối"
        visible={isRefuseModal}
        onOk={handleOkRefuseModal}
        onCancel={handleCancelRefuseModal}
      >
        <Radio.Group value={statusRej} onChange={e => setStatusRej(e.target.value)}>
          {reasonList
            .filter(item => item.id >= 5)
            .map(item => (
              <Radio key={item.id} value={item.id} className="d-block my-2">
                {item.name}
              </Radio>
            ))}
          <Radio
            className={`d-flex mt-2 ${styles.detail_modal_more}`}
            onClick={() => refMore.current?.focus()}
            value={0}
          >
            <span className="mr-2">Lý do khác</span>
            {statusRej === 0 && (
              <input ref={refMore} value={noteRej} onChange={e => setNoteRej(e.target.value)} />
            )}
          </Radio>
        </Radio.Group>
      </Modal>

      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}

      {isShowSuggestUpdateInfoModal &&
        <ModalPopup
          visible={isShowSuggestUpdateInfoModal} title="Thông báo"
          handleCancelModal={() => setIsShowSuggestUpdateInfoModal(false)}
          handleConfirmModal={handleOpenLinkJob}
        >
          <div className={styles.modal_update}>
            <div className={styles.title}>Bạn chưa điền đầy đủ thông tin cá nhân!</div>
            <div className={styles.subtitle}>Vui lòng cập nhật thông tin để nhà tuyển dụng có thể nhìn thấy thông tin của bạn.</div>
            <div className={styles.item}>
              {checkCompleteInfo(profile) === infoUserStatus.infoAcc ? <CheckOutlined style={{ color: 'var(--green-color)' }} /> : <CheckOutlined style={{ color: 'var(--gray-color)' }} />} <div>Thông tin tài khoản</div>
            </div>
            <div className={styles.item}>
              {checkCompleteInfo(profile) === infoUserStatus.cv ? <CheckOutlined style={{ color: 'var(--green-color)' }} /> : <CheckOutlined style={{ color: 'var(--gray-color)' }} />} <div>Hồ sơ cá nhân</div>
            </div>
          </div>
        </ModalPopup>}
      {
        isShowRelatedJobModal &&
        <ModalPopup
          isConfirmBtn={false}
          isCancelBtn={false}
          width={600}
          closeBtn
          visible={isShowRelatedJobModal} title="Việc làm liên quan"
          handleCancelModal={() => setIsShowRelatedJobModal(false)}
        // handleConfirmModal={handleOpenLinkJob}
        >
          <div className={styles.modal_related_job}>
            <WorkOther data={rawDataJob} companyIdJob={rawDataJob?.company?.id} userIdJob={rawDataJob?.user?.id} />
          </div>
        </ModalPopup>
      }
      {
        isShowInformationCompanyModal &&
        <ModalPopup
          isConfirmBtn={false}
          isCancelBtn={false}
          width={600}
          closeBtn
          visible={isShowInformationCompanyModal} title={`Thông tin ${isCreatedJobByCompany ? "công ty" : "nhà tuyển dụng"}`}
          handleCancelModal={() => setIsShowInformationCompanyModal(false)}
        >
          <div className={styles.modal_related_job}>
            <SideBar dataSSR={rawDataJob} jobId={rawDataJob.id} />
          </div>
        </ModalPopup>
      }

    </div>
  )
}

export default JobDetail
