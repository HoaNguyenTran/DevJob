import { getSearchHotJobsApi } from 'api/client/job'
import React, { useEffect, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./HotJob.module.scss"

const HotJob = (): JSX.Element => {
  const [hotJobs, setHotJobs] = useState<JobGlobal.Job[]>([])

  const fetchData = async () => {
    try {
      const { data } = await getSearchHotJobsApi(72)
      setHotJobs(data.data)
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])


  return <div className={styles.hotJob}>
    {hotJobs.length > 0 && (
      <div className={styles.hotJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              <img src="/assets/icons/color/hot-job.svg" alt="" />
              <span>Việc làm Siêu Hot</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1&isHotJob=1`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider flag='isHotJob' data={hotJobs} row={4} />
        </div>
      </div>)
    }
  </div>
}

export default HotJob