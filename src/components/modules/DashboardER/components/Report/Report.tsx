import { getReportDashboardApi } from 'api/client/other'
import React, { useEffect, useState } from 'react'
import { handleError } from 'src/utils/helper'
import styles from "./Report.module.scss"

const Report = (): JSX.Element => {

  const [reportData, setReportData] = useState({
    appliedThisMonth: 0,
    appliedThisWeek: 0,
    numUnreadMsg: 0,
    postedThisMonth: 0,
    postedThisWeek: 0,
    totalApplied: 0,
    totalPosted: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getReportDashboardApi()
      setReportData(data);
    }
    try {
      fetchData()
    } catch (error) {
      handleError(error)
    }
  }, [])


  return (
    <div className={styles.report}>
      <div className={styles.report_inner}>
        <div className={styles.report_top}>
          <div className={styles.left}>
            <div className={styles.inner}>
              <div className={styles.info}>
                <div className={styles.count}>{reportData.totalPosted}</div>
                <div className={styles.text}>Tin tuyển dụng đã đăng</div>
              </div>
              <div className={styles.icon}>
                <img alt="" src="/assets/icons/dashboard/report/1.svg" />
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.inner}>
              <div className={styles.info}>
                <div className={styles.count}>{reportData.totalApplied}</div>
                <div className={styles.text}>Ứng viên<br />đã ứng tuyển</div>
              </div>
              <div className={styles.icon}>
                <img alt="" src="/assets/icons/dashboard/report/2.svg" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.report_bottom}>
          <div className={styles.left}>
            <div className={styles.text}>Tuần này</div>
            <div className={styles.value}><span>{reportData.postedThisWeek}</span> tin</div>
            <div className={styles.text}>Tháng này</div>
            <div className={styles.value}><span>{reportData.postedThisMonth}</span> tin</div>
          </div>
          <div className={styles.right}>
            <div className={styles.text}>Tuần này</div>
            <div className={styles.value}><span>{reportData.appliedThisWeek}</span> ứng viên</div>
            <div className={styles.text}>Tháng này</div>
            <div className={styles.value}><span>{reportData.appliedThisMonth}</span> ứng viên</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Report