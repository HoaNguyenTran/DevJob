import { Col, Dropdown, Menu, Row, Skeleton } from 'antd'
import React, { FC, useEffect, useState } from 'react'
import { getJobApplyApi, getSaveJobApi } from 'api/client/job'
import { statusApplyConstants } from 'src/constants/statusConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { useRouter } from 'next/router'
import { handleError } from 'src/utils/helper'
import JobAndDetail from 'src/components/elements/JobAndDetail'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { CaretDownOutlined } from '@ant-design/icons'
import styles from './MyJob.module.scss'

const TabMyJobEnum = {
  Saved: { id: statusApplyConstants.Saved, slug: 'job_saved', name: 'Công việc quan tâm', icon: '/assets/EE/my-job/job_saved.svg' },
  Accept: { id: statusApplyConstants.Accept, slug: 'job_accept', name: 'Công việc đã nhận', icon: '/assets/EE/my-job/job_accept.svg' },
  Waiting: { id: statusApplyConstants.Waiting, slug: 'job_waiting', name: 'Công việc chờ duyệt', icon: '/assets/EE/my-job/job_waiting.svg' },
  Reject: { id: statusApplyConstants.Reject, slug: 'job_reject', name: 'Công việc bị từ chối', icon: '/assets/EE/my-job/job_reject.svg' },
}

const filterList = [
  {
    key: 0,
    label: "Ngày đăng mới nhất",
  },
  // {
  //   key: 1,
  //   label: "Phù hợp nhất",
  // },
]


const MyJob: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [resData, setResData] = useState<any>()
  const tab = String(router.query.tab) || "job_saved"

  const SCREEN = useWindowDimensions();

  const filterKey = Number(router.query.filter) || 0

  const handleChangeTab = obj => {
    const query: any = {
      ...router.query,
      tab: obj.slug,
      page: 1
    }
    if (query.jobId) {
      delete query.jobId
    }
    router.push({
      pathname: router.pathname,
      query,
    })
  }

  useEffect(() => {
    if (router.query.jobId) {
      activeItemGroup(Number(router.query.jobId))
    } else {
      setLoading(true)
    }
    tabCondition()
  }, [JSON.stringify(router.query)])

  useEffect(() => {
    const query: any = {
      ...router.query,
      tab: TabMyJobEnum.Saved.slug,
      page: 1
    }
    router.push({
      pathname: router.pathname,
      query,
    })
  }, [])


  const activeItemGroup = (id) => {
    const newDataGroups = (resData?.data || []).map(item => ({
      ...item,
      isActive: item.id === id
    }));
    setResData({
      ...resData,
      data: newDataGroups
    })
  }

  const tabCondition = async () => {
    const num = String(router.query.tab) || "job_saved";
    const pageNumber = Number(router.query.page) || 1;

    try {
      switch (num) {
        case TabMyJobEnum.Saved.slug:
          {
            const responseSave = await getSaveJobApi({ pageNumber })
            setResData(responseSave.data)
          }
          break
        case TabMyJobEnum.Accept.slug:
          {
            const responseAcp = await getJobApplyApi({
              pageNumber,
              status: statusApplyConstants.Accept,
              role: roleConstant.EE.id,
            })
            setResData(responseAcp.data)
          }
          break
        case TabMyJobEnum.Waiting.slug:
          {
            const responseWait = await getJobApplyApi({
              pageNumber,
              status: statusApplyConstants.Waiting,
              role: roleConstant.EE.id,
            })
            setResData(responseWait.data)
          }
          break
        case TabMyJobEnum.Reject.slug:
          {
            const responseRej = await getJobApplyApi({
              pageNumber,
              status: statusApplyConstants.Reject,
              role: roleConstant.EE.id,
            })
            setResData(responseRej.data)
          }
          break

        default:
          break
      }
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
      setResData(undefined)
    } finally {
      setLoading(false)
    }
  }

  const renderJob = () => {
    switch (tab) {
      case TabMyJobEnum.Saved.slug:
      case TabMyJobEnum.Accept.slug:
      case TabMyJobEnum.Waiting.slug:
      case TabMyJobEnum.Reject.slug:
        return (
          <JobAndDetail data={resData} />
        )
      default:
        break
    }
  }

  const classFontWeight = (index: string): string => {
    if (tab === index) return 'bold'
    return 'normal'
  }

  const renderTab = () =>
    Object.keys(TabMyJobEnum).map(key => (
      <div
        key={TabMyJobEnum[key].id}
        onClick={() => handleChangeTab(TabMyJobEnum[key])}
        style={{
          color: 'var(--primary-color)',
          fontWeight: classFontWeight(TabMyJobEnum[key].slug)
        }}
        className={styles.statusJob_tab}
      >
        <div style={{ marginRight: 5 }}>
          <img src={TabMyJobEnum[key].icon} alt="" />
        </div>
        {TabMyJobEnum[key].name}
      </div>
    ))

  const calcTranslateX = (width) => {
    let index;
    switch (tab) {
      case TabMyJobEnum.Saved.slug:
        index = 0;
        break;
      case TabMyJobEnum.Accept.slug:
        index = 1;
        break;
      case TabMyJobEnum.Waiting.slug:
        index = 2;
        break;
      case TabMyJobEnum.Reject.slug:
        index = 3;
        break;
      default:
        index = 0
        break
    }
    if (width >= 1200) {
      return index * 290 + 10;
    }
    if (width >= 736) {
      return index * (290 * width / 1200);
    }
    return index * (290 * 736 / 1200);
  }

  const widthTranslateX = (width) => {
    if (width >= 1200) {
      return 300
    }
    if (width >= 736) {
      return 300 * width / 1200;
    }
    return 300 * 736 / 1200
  }

  const translateX = SCREEN.width ? calcTranslateX(SCREEN.width) : 244
  const width = SCREEN.width ? widthTranslateX(SCREEN.width) : 244


  const getTitle = () => {
    switch (tab) {
      case TabMyJobEnum.Saved.slug:
        return 'đang quan tâm'
      case TabMyJobEnum.Accept.slug:
        return 'đã nhận'
      case TabMyJobEnum.Waiting.slug:
        return 'chờ duyệt'
      case TabMyJobEnum.Reject.slug:
        return 'bị từ chối'
      default:
        return '';
    }
  }

  const onSelectFilter = ({ key }) => {
    // console.log(key);
  }

  const menuFilter = (
    <Menu onClick={onSelectFilter}>
      {
        filterList.map(i => (
          <Menu.Item key={i.key}>
            <div>
              {i.label}
            </div>
          </Menu.Item>
        ))
      }
    </Menu>
  );


  return (
    <div className={styles.layout_content}>
      <div className={styles.content_inner}>
        <div className={styles.statusJob}>
          <div className={styles.statusJob_wrap}>
            <div className={styles.statusJob_tabs}>
              <div className={styles.box_selected} style={{ transform: `translateX(${translateX}px)`, width: `${width}px` }} />
              {renderTab()}
            </div>
            <div>
              {loading ? (
                <div className={styles.statusJob_main}>
                  <div className={styles.skeleton}>
                    <Skeleton avatar active round />
                  </div>
                  <div className={styles.skeleton}>
                    <Skeleton avatar active round />
                  </div>
                </div>
              ) : (
                <>
                  {resData?.meta?.pagination?.total && <Row>
                    <Col md={12} xs={24} className={styles.filter}>
                      <div className={styles.totalJob}>
                        Bạn có <span className={styles.count}>{resData?.meta?.pagination?.total || 0} công việc</span> {getTitle()}
                      </div>
                      {/* <Dropdown overlay={menuFilter}>
                        <div className={styles.main_wrap_filter_select}>
                          <div className={styles.main_wrap_filter_select_text}>
                            {filterList.find(i => i.key === filterKey)?.label || ""}
                          </div>
                          <CaretDownOutlined style={{ color: "#6E00C2" }} />
                        </div>
                      </Dropdown> */}
                    </Col>
                  </Row>}
                  {renderJob()}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default MyJob
