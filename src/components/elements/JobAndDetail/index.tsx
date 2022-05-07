import { Col, Empty, Pagination, Row, Skeleton } from "antd";
import { getDetailJobApi } from "api/client/job";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import JobDetailPage from "src/components/modules/JobDetail/JobDetailPage";
import { dayOfWeekConstant } from "src/constants/dayOfWeekConstant";
import { convertTimeToHHmm, handleError } from "src/utils/helper";
import Job from "../Job/Job";
import styles from "./JobAndDetail.module.scss";

const JobAndDetail = ({ data }) => {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [dataJobPreview, setDataJobPreview] = useState({});
  const router = useRouter()

  const changeRoutePreviewJob = (d) => {
    if (d.id !== Number(router.query.jobId)) {
      setLoadingPreview(true)
      const query = { ...router.query }
      if (query.isOtherPage) {
        delete query.isOtherPage
      }
      router.push({
        pathname: router.pathname,
        query: {
          ...query,
          jobId: d.id
        }
      })
    }
  }

  useEffect(() => {
    if (router.query.jobId) {
      loadingDataPreview(Number(router.query.jobId))
    }
  }, [JSON.stringify(router.query)])

  const loadingDataPreview = async (id) => {
    try {
      const res = await getDetailJobApi(id);
      setDataJobPreview(res.data)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    if (Object.keys(dataJobPreview).length) {
      setLoadingPreview(false)
    }

  }, [JSON.stringify(dataJobPreview)])

  const onChangePagi = (pageNumber: number) => {
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        page: pageNumber
      }
    })
    window?.scrollTo(0, 0)
  }

  return (
    <div className={`${styles.job} search`}>
      <div className={styles.job_main}>
        <Row className={styles.job_main_content}>
          {
            !data?.data?.length || data?.data?.length === 0 ? (
              <div className={styles.emptyResult}>
                <Empty description="Không có công việc nào!" />
              </div>
            ) : (
              <Col md={router.query.jobId ? 12 : 24}>
                <Row className="justify-content-between" style={{
                  maxHeight: router.query.jobId ? "735px" : "unset",
                  overflow: router.query.jobId ? "auto" : "unset"
                }}
                >
                  {
                    data?.data.map((job, i) => {
                      let formatJob = job
                      if (job.job) {
                        formatJob = {
                          ...job.job,
                          user: job.user,
                          company: job.company
                        }
                      }

                      const {
                        id,
                        companyId,
                        title,
                        urgent,
                        workingAddress,
                        wageMin,
                        wageMax,
                        wageUnit,
                        canApplyDate,
                        user,
                        company,
                        jobSchedules,
                        matching,
                        isHotJob,
                        isSavedJob,
                        distance,
                        applyingStatus,
                        isActive,
                      } = formatJob

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
                            item =>
                              !arrWorkDay.includes(item.dayOfWeek) &&
                              arrWorkDay.push(item.dayOfWeek),
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
                        arrHour.forEach(item =>
                          strTmp.push(
                            ` ${convertTimeToHHmm(item.workTimeFrom)} - ${convertTimeToHHmm(
                              item.workTimeTo,
                            )}`,
                          ),
                        )

                        workSchedule.push(`${strTmp} | ${workDay}`)

                        return workSchedule
                      }

                      const obj = {
                        isActive, ownPost, title, id, workingAddress, wageMax, wageMin, wageUnit, matching, isHotJob, applyingStatus, distance,
                        userId: user.id, isSaveJob: isSavedJob, isUrgent: urgent, schedule: renderSchedule(), expiredDate: canApplyDate, reasonChangeStatus: job.hiringStatus === 2 ? job.reasonChangeStatus : ''
                      }

                      return <Col key={i}
                        xs={router.query.jobId ? 24 : 12}
                        md={router.query.jobId ? 24 : 12}
                      >
                        <div className={styles.content}>
                          <div className={styles.content_item}>
                            <Job {...obj} onHandleClickJob={() => changeRoutePreviewJob(formatJob)}/>
                          </div>
                        </div>
                      </Col>
                    })
                  }
                </Row>
                <div className={styles.job_main_content_pagi}>
                  {data
                    ?
                    <Pagination
                      total={data?.meta?.pagination?.total}
                      current={data?.meta?.pagination?.currentPage}
                      onChange={onChangePagi}
                      className={styles.candidate_pagi}
                      hideOnSinglePage
                    />
                    : null}
                </div>
              </Col>
            )
          }

          <>
            {
              !!router.query.jobId && !!Object.keys(dataJobPreview).length &&
              <Col md={12} className='pl-3' >
                {
                  loadingPreview ?
                    <>
                      <Skeleton active className='p-4' />
                      <Skeleton active className='p-4 mt-2' />
                    </>
                    :
                    <div className='bg-white' style={{ maxHeight: "735px", overflow: "auto" }}>
                      <JobDetailPage
                        dataSSR={dataJobPreview}
                        showSavedJob={false}
                        changeDataSSR={(job) => setDataJobPreview(job)}
                      />
                    </div>
                }
              </Col>
            }
          </>
        </Row>
      </div>
    </div>
  )
}

export default JobAndDetail;