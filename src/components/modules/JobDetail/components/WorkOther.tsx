/* eslint-disable camelcase */
import { Empty, Pagination, Skeleton } from 'antd'
import { getSaveJobApi, getSearchJobApi } from 'api/client/job'
import router from 'next/router'
import React, { FC, useEffect, useState } from 'react'
import Job from 'src/components/elements/Job/Job'
import { configConstant } from 'src/constants/configConstant'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import { convertTimeToHHmm, handleError } from 'src/utils/helper'
import styles from './Job.module.scss'


const WorkOther: FC<any> = ({ companyIdJob, userIdJob, data }) => {
  const [jobs, setJobs] = useState<any>()
  const [loading, setLoading] = useState(false)
  
  const handleClickSave = async () => {
    try {
      await getSaveJobApi({})
    } catch (error) {
      handleError(error)
    }
  }

  const fetchData = async pageNumber => {
    setLoading(true)
    try {
      const isCreatedJobByCompany = data.companyId;
      let params: any = {
        page: pageNumber || 1,
        limit: configConstant.limit.blogs
      } 
      if (isCreatedJobByCompany) {
        params = {
          ...params,
          companyId: companyIdJob
        }
      } else {
        params = {
          ...params,
          userId: userIdJob
        }
      }
      
      const resData = await getSearchJobApi(params)
      setJobs(resData.data)
    } catch (error) {
      setJobs(undefined)
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [])

  const renderPagi = ({ total, currentPage }) => (
    <Pagination
      total={total}
      current={currentPage}
      onChange={pageNumber => {
        fetchData(pageNumber)
        window?.scrollTo(0, 0)
      }}
      hideOnSinglePage
    />
  )

  if (loading)
    return (
      <div style={{ padding: '2rem' }}>
        <div className={styles.skeleton}>
          <Skeleton avatar active round />
        </div>
        <div className={styles.skeleton}>
          <Skeleton avatar active round />
        </div>
      </div>
    )
  
  const formatRelatedJob = (jobs?.data || []).filter(item=> item.id !== Number(router.query.jobId))
  return (
    <div>
      {formatRelatedJob.length ? (
        formatRelatedJob.map((job,index) => {
          const {
            id,
            userId,
            companyId,
            addressId,
            jobStatus,
            title,
            image_url,
            video_url,
            jobType,
            urgent,
            workingAddress,
            wageMin,
            wageMax,
            wageUnit,
            hiringCount,
            startTime,
            expireTime,
            viewCount,
            appliedCount,
            acceptedCount,
            educationLevel,
            detailDesc,
            otherDesc,
            ageFrom,
            ageTo,
            wokingShortTimeFrom,
            wokingShortTimeTo,
            methodReceiveNotify,
            canApplyDate,
            user,
            company,
            jobSchedules,
            genders,
            jobPostCategoryIds,
            jobPostExpRequiredCateIds,
            matching,
            isHotJob,
            isSavedJob,
            experienceId,
            benefitIds,
            distance,
            adddress,
            applyingStatus,
          } = job

          const ownPost = {
            ownJobId: user.id,
            ownJobName: user.name,
            ownJobAvatar: "",
          }

          if (companyId) {
            ownPost.ownJobId = company.id
            ownPost.ownJobName = company.name
            ownPost.ownJobAvatar = company.avatar
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
                if (item === '8') workDay += 'CN, '
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
                ` ${convertTimeToHHmm(item.workTimeFrom)} - ${convertTimeToHHmm(item.workTimeTo)}`,
              ),
            )

            workSchedule.push(`${strTmp}, ${workDay}`)

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
         return <div className='mt-2' key={index}><Job {...obj} handleClickSave={handleClickSave} /></div>
        }
        )
      ) : (
        <Empty description="Không có việc làm nào!" />
      )}

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        {!!formatRelatedJob.length &&
          <Pagination
            showSizeChanger={false}
            total={jobs?.meta?.pagination?.total}
            current={jobs?.meta?.pagination?.currentPage}
            onChange={pageNumber => {
              fetchData(pageNumber)
              // window?.scrollTo(0, 0)
            }}
            hideOnSinglePage
          />
        }
      </div>
    </div>
  )
}

export default WorkOther
