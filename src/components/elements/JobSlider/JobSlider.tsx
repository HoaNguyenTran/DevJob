/* eslint-disable react/require-default-props */
/* eslint-disable camelcase */
import React, { FC } from 'react'
import Slider from 'react-slick'
import { convertTimeToHHmm } from 'src/utils/helper'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useRouter } from 'next/router'
import Job from '../Job/Job'

interface Props {
  data: Array<Record<string, any>>
  row?: number
  dots?: boolean
  flag?: string
}

const JobSlider: FC<Props> = ({ data, row = 3, dots = true, flag = "" }) => {
  const router = useRouter()
  const sliderSettings = {
    dots,
    infinite: true,
    arrows: true,
    speed: 500,
    fade: true,
    swipeToSlide: true,
    // slidesToShow: 3,
    // slidesToScroll: 3,
    rows: row,
    slidesPerRow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          // slidesToScroll: 2,
          slidesPerRow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          // slidesToScroll: 1,
          slidesPerRow: 1,
          dots: false
        },
      },
    ],
  }

  return (
    <div>
      <Slider {...sliderSettings}>
        {data.map(job => {
          const {
            id, companyId, title, canApplyDate, user, company, jobSchedules, urgent, workingAddress,
            wageMin, wageMax, wageUnit, matching, isHotJob, isSavedJob, distance, applyingStatus,
            userId, addressId, jobStatus, image_url, video_url, jobType, hiringCount, startTime, expireTime, viewCount, appliedCount, acceptedCount, educationLevel, detailDesc, otherDesc,
            ageFrom, ageTo, wokingShortTimeFrom, wokingShortTimeTo, methodReceiveNotify, genders, jobPostCategoryIds, jobPostExpRequiredCateIds, experienceId, benefitIds, adddress,
          } = job


          const ownPost = {
            ownJobId: user.id,
            ownJobName: user.name,
            ownJobAvatar: "",
          }

          if (companyId) {
            ownPost.ownJobId = company?.id
            ownPost.ownJobName = company?.name
            ownPost.ownJobAvatar = company?.avatar
          }

          const renderSchedule = () => {
            const workSchedule: any = []
            let workDay = ''
            const arrHour: any = []
            if (!jobSchedules) return
            if (jobSchedules[0].dayOfWeek === 1) {
              workDay = 'Hằng ngày'
            } else {
              workDay = 'Thứ '
              const arrWorkDay: any[] = []
              jobSchedules.map(
                item => !arrWorkDay.includes(item.dayOfWeek) && arrWorkDay.push(item.dayOfWeek),
              )
              if (arrWorkDay.length === 1 && arrWorkDay[0] === dayOfWeekConstant.sunday.key)
                workDay = "CN"
              else {
                arrWorkDay.sort().forEach(item => {
                  if (item === dayOfWeekConstant.sunday.key) workDay += 'CN, '
                  else workDay += `${item}, `
                })
                workDay = workDay.slice(0, -2)
              }
            }
            if (!jobSchedules[0].shiftId) {
              arrHour.push({
                workTimeFrom: jobSchedules[0].workTimeFrom,
                workTimeTo:
                  jobSchedules[0].workTimeTo >= 24
                    ? jobSchedules[0].workTimeTo - 24
                    : jobSchedules[0].workTimeTo,
              })
            } else {
              const arrShift: any = []
              jobSchedules.forEach(
                schedule =>
                  !arrShift.includes(schedule.shiftId) &&
                  arrShift.push(schedule.shiftId) &&
                  arrHour.push({
                    workTimeFrom: schedule.workTimeFrom,
                    workTimeTo:
                      schedule.workTimeTo >= 24
                        ? String(schedule.workTimeTo - 24).concat('.00')
                        : schedule.workTimeTo,
                  }),
              )
            }

            const strTmp: any = []
            // arrHour.forEach(item => strTmp.push(` ${item.workTimeFrom}h - ${item.workTimeTo}h`))
            arrHour.forEach(item =>
              strTmp.push(
                ` ${convertTimeToHHmm(item.workTimeFrom)}-${convertTimeToHHmm(item.workTimeTo)}`,
              ),
            )
            workSchedule.push(`${strTmp} | ${workDay}`)

            return workSchedule
          }

          const obj = {
            ownPost,
            title,
            id,
            workingAddress,
            schedule: renderSchedule(),
            wageMax,
            wageMin,
            wageUnit,
            matching,
            expiredDate: canApplyDate,
            userId: user.id,
            isSaveJob: isSavedJob,
            isUrgent: urgent,
            isHotJob,
            applyingStatus,
            distance,
          }

          return (
            <div key={id}>
              <Job {...obj} onHandleClickJob={() => {
                const query = { jobId: id } as any;
                if (flag === "aroundJob") {
                  router.push({
                    pathname: routerPathConstant.suitableDistance,
                    query: {
                      ...query,
                      isOtherPage: true
                    }
                  })
                  return;
                }
                if (flag === "isHotJob") {
                  query.isHotJob = 1;
                }
                if (flag === "urgent") {
                  query.urgent = 1
                }
                router.push({
                  pathname: routerPathConstant.search,
                  query: {
                    ...query,
                    isOtherPage: true
                  }
                })
              }} />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default JobSlider
