import { getSearchSuitableJobsApi } from 'api/client/job'
import React, { useEffect, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./SuitableJob.module.scss"

const SuitableJob = (): JSX.Element => {
  const [suitableJobs, setSuitableJobs] = useState<JobGlobal.Job[]>([])

  const fetchData = async () => {
    try {
      const { data } = await getSearchSuitableJobsApi(72)
      setSuitableJobs(data.data.sort((a: any, b: any) => b.matching - a.matching))
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  return <div className={styles.suitableJob}>
    {suitableJobs.length > 0 && (
      <div className={styles.suitableJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              {/* <img src="/assets/icons/color/hot-job.svg" alt="" /> */}
              <span>Việc làm phù hợp với bạn</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1&sortBy=matching`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider data={suitableJobs} row={4} />
        </div>
      </div>)
    }
  </div>
}

export default SuitableJob