/* eslint-disable no-unused-expressions */
import React, {
  useEffect,
  useState,
} from 'react'

/* eslint-disable camelcase */
import {
  Col,
  message,
  Row,
} from 'antd'
import {
  deleteJobApplyApi,
  deleteSaveJobApi,
  getDetailJobApi,
  postJobApplyApi,
  postSaveJobApi,
} from 'api/client/job'
import { useRouter } from 'next/router'
import { configConstant } from 'src/constants/configConstant'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { CommonStatusConstant } from 'src/constants/statusConstant'
import { useAppSelector } from 'src/redux'
import { firebase } from 'src/utils/firebase'
import { handleError } from 'src/utils/helper'
import { getUserRoleCookieCSR } from 'src/utils/storage'

import JobDetail from './components/JobDetail'
import SideBar from './components/SideBar'
import TabCandidate from './components/TabCandidate/TabCandidate'
import styles from './JobDetailPage.module.scss'

interface IJobDetailProps {
  dataSSR?: any,
  showSavedJob?: boolean,
  changeDataSSR?: void
}

const TabViewJobDetailEnum = {
  ViewJobDetail: { id: 1, slug: 'view_job_detail', name: '' },
  // ViewJobWith: { id: 3, slug: 'view_job_with', name: 'Các việc làm khác' },
}


const JobDetailPage = (props) => {
  const { dataSSR, showSavedJob = true, changeDataSSR } = props
  // const [dataDetailJob, setDataDetailJob] = useState(dataSSR || {})
  

  const router = useRouter()
  const jobId = Number(router.query.jobId)

  const profile = useAppSelector(state => state.user.profile || {})
  const isPreviewJob = !router.pathname.includes(routerPathConstant.jobDetail.replace(":id", ""));

  const TabManagerJobDetailEnum = {
    ManagerJobDetail: { id: 4, slug: 'manager_job_detail', name: 'Chi tiết công việc' },
    ManagerEEWaiting: { id: 5, slug: 'manager_ee_wait', name: `Ứng viên (${dataSSR.waittingCount || 0})` },
    ManagerEEAccept: { id: 6, slug: 'manager_ee_accept', name: `Đã tuyển (${dataSSR.acceptedCount || 0})` },
    ManagerEEReject: { id: 7, slug: 'manager_ee_reject', name: `Từ chối (${dataSSR.rejectedCount || 0})` },
    ManagerEECancel: { id: 8, slug: 'manager_ee_cancel', name: `Ứng viên huỷ (${dataSSR.deletedCount || 0})` },
  }

  const checkIsERManagerPost = () => {
    if (
      getUserRoleCookieCSR() === roleConstant.ER.name &&
      dataSSR.userId === profile.id
    )
      return true
    return false
  }
  const handleFromUrlToTab = str => {
    let status = TabViewJobDetailEnum.ViewJobDetail.id
    if (checkIsERManagerPost()) {
      status = TabManagerJobDetailEnum.ManagerJobDetail.id
      if (str.indexOf('#') === -1) return status

      Object.keys(TabManagerJobDetailEnum).forEach(key => {
        if (TabManagerJobDetailEnum[key].slug === str.slice(str.indexOf('#') + 1))
          status = TabManagerJobDetailEnum[key].id
      })
      return status
    }

    if (str.indexOf('#') === -1) return status
    Object.keys(TabViewJobDetailEnum).forEach(key => {
      if (TabViewJobDetailEnum[key].slug === str.slice(str.indexOf('#') + 1)) {
        status = TabViewJobDetailEnum[key].id
      }
    })
    return status
  }
  const [tab, setTab] = useState(handleFromUrlToTab(router.asPath))
  const [job, setJob] = useState<JobDetailGlobal.JobDetailData>(
    dataSSR as JobDetailGlobal.JobDetailData,
  )
  const handleApplyJob = async () => {
    try {
      firebase.analytics().logEvent(firebaseAnalytics.applyJob, { id: jobId });

      const responseApply = await postJobApplyApi({ jobId, userId: profile.id })
      message.success(responseApply.data.message)
      fetchData()
    } catch (error) {
      handleError(error)
    }
  }

  const handleUnApplyJob = async (data: JobApplyGlobal.JobApplyUnReason) => {
    try {
      const responseApply = await deleteJobApplyApi({ id: jobId, data })
      message.success(responseApply.data.message)
      fetchData()
    } catch (error) {
      handleError(error)
    }
  }

  const handleSaveJob = async () => {
    try {
      const responseSave = await postSaveJobApi({ userId: profile.id, jobId })
      message.success("Lưu công việc thành công")
      fetchData()
    } catch (error) {
      handleError(error)
    }
  }

  const handleUnSaveJob = async () => {
    try {
      const responseUnsave = await deleteSaveJobApi(jobId)
      message.success("Bỏ lưu công việc thành công")
      fetchData()
    } catch (error) {
      handleError(error)
    }
  }

  const fetchData = async () => {
    try {
      const resDetailJob = await getDetailJobApi(jobId)
      setJob(resDetailJob.data)
    } catch (error) {
      handleError(error)
    }
  }

  const handleChangeTab = obj => {
    setTab(obj.id)
    router.push(`${router.asPath.substring(0, router.asPath.indexOf('#'))}#${obj.slug}`)
  }

  const renderTab = () => {
    const loopTab = obj =>
      Object.keys(obj)
        .filter(tabItem => (dataSSR.companyId ? tabItem : obj[tabItem].id !== 2))
        .map(key => {
          if (obj[key].name) return <button
            key={obj[key].id}
            value={obj[key].id}
            onClick={() => handleChangeTab(obj[key])}
            className={
              tab === obj[key].id
                ? `${styles.detail_main_tab_active} ${styles.detail_main_tab}`
                : styles.detail_main_tab
            }
            type="button"
            style={{
              fontWeight: "normal"
            }}
          >
            {obj[key].name}
          </button>
          return null
        }
        )
    if (checkIsERManagerPost()) {
      return loopTab(TabManagerJobDetailEnum)
    }
    return loopTab(TabViewJobDetailEnum)
  }

  const reLoadingDataDetail = async (id) => {
    try {
      const { data } = await getDetailJobApi(id);
      changeDataSSR && changeDataSSR(data)
      return data;
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(()=> {
    if(router.query.isRenderTab) {
      reLoadingDataDetail(router.query.jobId);
      const tempQuery = {...router.query}
      delete tempQuery.isRenderTab
      router.push({
        pathname: router.pathname,
        query: tempQuery
      })
    }
  },[router.query.isRenderTab])

  const renderContent = () => {
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
      startTime,
      expireTime,
      hiringCount,
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
      imageUrl,
      workingDayNote
    } = job

    const ownPost = {
      ownJobId: user?.id,
      ownJobName: user?.name,
      ownJobAvatar: configConstant.defaultPicture, // user?.avatar,
      ownJobType: '',
    }

    if (companyId) {
      ownPost.ownJobId = company.id
      ownPost.ownJobName = company.name
      ownPost.ownJobAvatar = company.avatar
      ownPost.ownJobType = 'company'
    }

    const obj = {
      id,
      userId,
      companyId,
      jobId,
      ownPost,
      user,
      isHotJob,
      isUrgent: urgent,
      isSaveJob: isSavedJob,

      jobTitle: title,

      wageMax,
      wageMin,
      wageUnit,

      jobType,
      hireCount: hiringCount,
      workAddress: workingAddress,

      jobSchedules,
      genders,

      ageFrom,
      ageTo,
      educationLevel,
      experiences: experienceId,

      jobCateDetail: jobPostExpRequiredCateIds,
      matchJob: matching,

      startTime,
      expireTime,
      expiredDate: canApplyDate,

      detailDesc,
      moreDesc: otherDesc,
      benefits: benefitIds,
      jobStatus,
      applyingStatus,

      wokingShortTimeFrom,
      wokingShortTimeTo,
      image_url,
      adddress,
      imageUrl,
      workingDayNote
    }

    if (checkIsERManagerPost()) {
      switch (tab) {
        case TabManagerJobDetailEnum.ManagerJobDetail.id:
          return (
            <JobDetail
              job={obj}
              rawDataJob={dataSSR}
              handleSaveJob={handleSaveJob}
              handleUnSaveJob={handleUnSaveJob}
              handleApplyJob={handleApplyJob}
              handleUnApplyJob={handleUnApplyJob}
            />
          )

        case TabManagerJobDetailEnum.ManagerEEWaiting.id:
          return <TabCandidate jobId={obj.jobId} status={CommonStatusConstant.Waiting} />

        case TabManagerJobDetailEnum.ManagerEEAccept.id:
          return <TabCandidate jobId={obj.jobId} status={CommonStatusConstant.Accept} />

        case TabManagerJobDetailEnum.ManagerEEReject.id:
          return <TabCandidate jobId={obj.jobId} status={CommonStatusConstant.Reject} />

        case TabManagerJobDetailEnum.ManagerEECancel.id:
          return <TabCandidate jobId={obj.jobId} status={CommonStatusConstant.Cancel} />

        default:
          return (
            <JobDetail
              job={obj}
              rawDataJob={dataSSR}
              handleSaveJob={handleSaveJob}
              handleUnSaveJob={handleUnSaveJob}
              handleApplyJob={handleApplyJob}
              handleUnApplyJob={handleUnApplyJob}
            />
          )
      }
    } else
      switch (tab) {
        case TabViewJobDetailEnum.ViewJobDetail.id:
          return (
            <JobDetail
              job={obj}
              rawDataJob={dataSSR}
              handleSaveJob={handleSaveJob}
              handleUnSaveJob={handleUnSaveJob}
              handleApplyJob={handleApplyJob}
              handleUnApplyJob={handleUnApplyJob}
            />
          )

        // case TabViewJobDetailEnum.ViewInfoOwner.id:
        //   return <CompanyInfo companyId={obj.companyId} />

        // case TabViewJobDetailEnum.ViewJobWith.id:
        //   return <WorkOther companyIdJob={obj.companyId} userIdJob={obj.userId} />

        default:
          return (
            <JobDetail
              job={obj}
              rawDataJob={dataSSR}
              handleSaveJob={handleSaveJob}
              handleUnSaveJob={handleUnSaveJob}
              handleApplyJob={handleApplyJob}
              handleUnApplyJob={handleUnApplyJob}
            />
          )
      }
  }

  useEffect(() => {
    setTab(handleFromUrlToTab(router.asPath))
  }, [router])

  return (
    <div className={styles.detail}>
      <div className={styles.detail_wrap}>
        <Row>
          <Col xs={24} md={(router.query.jobId && isPreviewJob) ? 24 : 15} className={styles.detail_main}>
            <div className={styles.detail_main_tabs}>{renderTab()}</div>
            <div className={styles.detail_main_content}>{renderContent()}</div>
          </Col>
          {
            !isPreviewJob &&
            <Col xs={24} md={7} className={`${styles.detail_sub} pb-5 mt-md-0 mt-4`} style={{ height: "fit-content" }}>
              <SideBar dataSSR={dataSSR} jobId={jobId} />
            </Col>
          }

        </Row>
      </div>
    </div>
  )
}

export default JobDetailPage
