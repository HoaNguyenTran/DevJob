import { getSearchNewJobsApi } from 'api/client/job'
import React, { FC, useEffect, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { routerPathConstant } from 'src/constants/routerConstant'
import { handleError } from 'src/utils/helper'
import styles from "./NewJob.module.scss"

const NewJob: FC = () => {
  const [newJobs, setNewJobs] = useState<JobGlobal.Job[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getSearchNewJobsApi(96)
      setNewJobs(data.data)
    }
    try {
      fetchData()
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }, [])

  return <div className={styles.newJob}>
    {newJobs.length > 0 && (
      <div className={styles.newJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              {/* <img src="/assets/icons/color/hot-job.svg" alt="" /> */}
              <span>Việc làm Mới Nhất</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.search}?limit=10&page=1`}>
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider data={newJobs} row={4} />
        </div>
      </div>
    )}
  </div>
}

export default NewJob