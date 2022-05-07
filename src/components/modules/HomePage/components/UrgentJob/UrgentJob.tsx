import { getSearchUrgentJobsApi } from 'api/client/job'
import React, { FC, useEffect, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./UrgentJob.module.scss"

const UrgentJob: FC = () => {
  const [urgentJobs, setUrgentJobs] = useState<JobGlobal.Job[]>([])

  const fetchData = async () => {
    const { data } = await getSearchUrgentJobsApi(72)
    setUrgentJobs(data.data)
  }

  useEffect(() => {
    try {
      fetchData()
    } catch (error) {
      handleError(error)
    }
  }, [])

  return <div className={styles.urgentJob}>
    <div className={styles.urgentJob_wrap}>
      {urgentJobs.length > 0 && (
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              <img src="/assets/icons/color/urgent-job.svg" alt="" />
              <span>Việc làm Siêu Gấp</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1&urgent=1`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider flag="urgent" data={urgentJobs} row={4} />
        </div>)
      }
    </div>
  </div>
}

export default UrgentJob