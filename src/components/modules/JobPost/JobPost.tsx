import React, {
  useEffect,
  useRef,
  useState,
} from 'react'

/* eslint-disable camelcase */
import {
  Col,
  Empty,
  message,
  Modal,
  Pagination,
  Row,
  Select,
  Skeleton,
} from 'antd'
import {
  deleteJobApi,
  getDetailJobApi,
  getJobPostApi,
  postChangeStatusJobApi,
} from 'api/client/job'
import { useRouter } from 'next/router'
import Loading from 'src/components/elements/Loading/Loading'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import Post from 'src/components/elements/Post/Post'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { statusPostConstants } from 'src/constants/statusConstant'
import { useAppSelector } from 'src/redux'
import {
  handleError,
  scrollToTopForSection,
} from 'src/utils/helper'

import JobDetailPage from '../JobDetail/JobDetailPage'
import ExtendPost from './components/ExtendPost/ExtendPost'
import UpgradeHotJob from './components/UpgradeHotJob/UpgradeHotJob'
import styles from './JobPost.module.scss'

const { Draft, Waiting, Posted, Closed, Expired, Complete, Refuse } = statusPostConstants

enum NumberEnum {
  DefaultPage = 1,
  FilterAll = 2,
  FilterUrgent = 1,
  FilterNormal = 0,
  SortStartDate = 1,
  SortExpireDate = 2,
  SortApply = 3,
}

const JobPost = (): JSX.Element => {
  const router = useRouter()
  const profile = useAppSelector(state => state.user.profile || {})

  const [status, setStatus] = useState<number>(Posted)
  const [color, setColor] = useState('var(--primary-color)')
  const [loading, setLoading] = useState<boolean>(false)
  const [pagi, setPagi] = useState(NumberEnum.DefaultPage)

  const [filterPost, setFilterPost] = useState(Number(router.query.urgent) || NumberEnum.FilterAll)
  const [postData, setPostData] = useState<any>() // JobPostGlobal.JobPostFull

  const [detailPost, setDetailPost] = useState<any>({})

  const containerRef = useRef(null)

  const [isFeatureExtendPostModal, setIsFeatureExtendPostModal] = useState(false)
  const [isFeatureClosePostModal, setIsFeatureClosePostModal] = useState(false)
  const [isFeatureRemovePostModal, setIsFeatureRemovePostModal] = useState(false)
  const [isFeatureUpgradeHotJobModal, setIsFeatureUpgradeHotJobModal] = useState(false)
  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [dataJobPreview, setDataJobPreview] = useState({});

  const query: any = {
    id: detailPost.id,
  }

  const featureCreatePostWithAvailableData = () => {
    router.push({
      pathname: routerPathConstant.erPostJobHiring,
      query,
    })
  }

  const updateInformationRePostJob = () => {
    const tempQuery = {
      ...query,
      // timePostJob: detailPost.startTime,
      // deadlineSubmit: detailPost.expireTime,
      jobStatus: detailPost.jobStatus,
      isUpdating: true,
    }
    router.push({
      pathname: routerPathConstant.erPostJobHiring,
      query: tempQuery,
    })
  }
  const featureClosePost = async () => {
    try {
      const data = {
        userId: profile.id,
        jobStatus: 5,
        services: [],
        promotions: [],
        useServices: [],
      }
      await postChangeStatusJobApi(detailPost.id, data)
      fetchData()
      if (postData.data[0].id === Number(router.query.jobId)) {
        previewJob(postData.data[1])
      } else {
        previewJob(postData.data[0])
      }
    } catch (error) {
      handleError(error)
    }
    setIsFeatureClosePostModal(false)
  }

  const featureRemovePost = async () => {
    try {
      await deleteJobApi(detailPost.id)
      await fetchData()
      if (postData.data[0].id === Number(router.query.jobId)) {
        previewJob(postData.data[1])
      } else {
        previewJob(postData.data[0])
      }
      message.success("Xoá tin thành công!")
    } catch (error) {
      message.error('Xoá tin thất bại')
    }
    setIsFeatureRemovePostModal(false)
  }


  const extendFuncConstants = {
    // PostJob: { key: 0, text: 'Đăng tin', func: () => setIsShowModalApp(true) },
    Extend: { key: 1, text: 'Gia hạn', func: () => setIsFeatureExtendPostModal(true) },
    SamePost: {
      key: 2,
      text: 'Tạo tin mới với nội dung tương tự',
      func: featureCreatePostWithAvailableData,
    },
    EditPost: {
      key: 3,
      text: 'Chỉnh sửa tin và đăng lại',
      func: () => updateInformationRePostJob(),
    },
    UpgradeHotJob: {
      key: 4,
      text: 'Nâng cấp Hot Job',
      func: () => setIsFeatureUpgradeHotJobModal(true),
    },
    ClosePost: {
      key: 5, text: 'Đóng tin', func: () => {
        setIsFeatureClosePostModal(true)
        postData.data.forEach((item: any) => {
          if (item.isActive) {
            previewJob(item)
          }
        })
      }
    },
    RemovePost: {
      key: 5, text: 'Xoá tin', func: () => {
        setIsFeatureRemovePostModal(true)
      }
    },
  }

  const extendFunc = (data) => {
    const extendFunctions: any = []
    switch (status) {
      case Posted:
        // eslint-disable-next-line no-case-declarations
        extendFunctions.push(
          extendFuncConstants.Extend,
          extendFuncConstants.SamePost,
          extendFuncConstants.ClosePost,
        )
        if (!data.isHotJob) {
          extendFunctions.splice(1, 0, extendFuncConstants.UpgradeHotJob)
        }
        break;
      case Waiting:
        extendFunctions.push(extendFuncConstants.SamePost)
        break;
      case Closed:
        extendFunctions.push(extendFuncConstants.SamePost, extendFuncConstants.RemovePost);
        break;
      case Expired:
        extendFunctions.push(extendFuncConstants.SamePost, extendFuncConstants.RemovePost)
        break;
      case Refuse:
        extendFunctions.push(
          extendFuncConstants.EditPost,
          extendFuncConstants.SamePost,
          extendFuncConstants.RemovePost,
        )
        break;
      case Draft:
        extendFunctions.push(
          extendFuncConstants.EditPost,
          extendFuncConstants.SamePost,
          extendFuncConstants.RemovePost,
        )
        break;
      default:
        break;
    }
    return extendFunctions
  }

  const handleFetchData = ({ page, jobStatus, urgent }) => {
    const tempQuery: any = {
      limit: configConstant.itemPerPage.job,
      page: page || NumberEnum.DefaultPage,
      jobStatus: jobStatus || Posted,
    }
    const queryRequest = {
      ...router.query,
      ...tempQuery
    }
    if (urgent !== NumberEnum.FilterAll) queryRequest.urgent = urgent;
    else {
      delete queryRequest.urgent
    }
    router.push({
      pathname: routerPathConstant.erJobPost,
      query: queryRequest
    })
  }

  const renderTab = () =>
    [Posted, Waiting, Closed, Refuse, Draft].map(item => (
      <div
        key={item}
        style={{
          backgroundColor: status === item ? 'var(--primary-color)' : '#f9f9f9',
          color: status === item ? 'var(--white-color)' : 'black',
          border: status === item ? '0' : 'solid 1px #e7e7e7 '
        }}
        className={styles.jobPost_tab}
        onClick={() => {
          router.push({
            pathname: routerPathConstant.erJobPost,
            query: {
              // page: 1,
              jobStatus: item
            }
          })
          setDataJobPreview({});
          setFilterPost(NumberEnum.FilterAll)
        }
        }
      >
        {(() => {
          switch (item) {
            case Posted:
              return 'Tin đang hiển thị'
            case Waiting:
              return 'Tin đang chờ duyệt'
            case Closed:
              return 'Tin đã đóng'
            case Expired:
              return 'Tin hết hạn'
            case Refuse:
              return 'Tin bị từ chối'
            case Draft:
              return 'Tin nháp'
            default:
              break
          }
        })()}
      </div>
    ))


  const onChangePagi = (page: number) => {
    scrollToTopForSection(document.getElementById('layout-content'))
    setPagi(page)
    handleFetchData({ page, jobStatus: status, urgent: filterPost })
  }

  const activeItemGroup = (id) => {
    const newDataGroups = (postData?.data || []).map(item => ({
      ...item,
      isActive: item.id === id
    }));
    setPostData({
      ...postData,
      data: newDataGroups
    })
  }

  const previewJob = (data) => {
    if (data.id !== Number(router.query.jobId)) {
      setLoadingPreview(true)
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          jobId: data.id
        }
      })
    }

  }


  const renderPost = () => (
    <div className={styles.jobPost_body_post}>
      <Row className='justify-content-space-between'>

        {postData ? (
          <>
            <Col md={router.query.jobId ? 11 : 24}>
              <Row className={`justify-content-between ${styles.content}`} style={{
                maxHeight: router.query.jobId ? "735px" : "unset",
                overflow: router.query.jobId ? "auto" : "unset"
              }}
              >
                {postData?.data.map(item => (
                  <Col
                    key={item.id}
                    xs={router.query.jobId ? 24 : 12}
                    md={router.query.jobId ? 24 : 12}
                    style={{ maxWidth: "558px" }}
                    onClick={() => {

                      previewJob(item)
                    }}
                  >
                    <Post
                      handleGetDetailPost={data => setDetailPost(data)}
                      extendFunc={
                        extendFunc(item)
                      }
                      isOptions
                      propsData={{ ...item, color, isUrgent: item.urgent }}
                    />
                  </Col>


                ))}
              </Row>
              {!!postData?.meta?.pagination?.total &&
                <Pagination
                  total={postData.meta.pagination.total}
                  current={postData.meta.pagination.currentPage}
                  onChange={onChangePagi}
                  className={styles.jobPost_pagi}
                  hideOnSinglePage
                  showQuickJumper
                />
              }
            </Col>
            {
              !!router.query.jobId && !!Object.keys(dataJobPreview).length &&
              <Col md={13} className='pl-3' >
                {
                  loadingPreview ?
                    <>
                      <Skeleton active className='p-4' />
                      <Skeleton active className='p-4 mt-2' />
                    </>
                    :
                    <div className='bg-white custom_scroll' style={{
                      maxHeight: "735px",
                      overflow: "auto",
                      borderRadius: "8px",
                      border: "1px solid #E7E7E7"
                    }}>
                      <JobDetailPage
                        dataSSR={dataJobPreview}
                        changeDataSSR={(job) => setDataJobPreview(job)}
                      />
                    </div>
                }
              </Col>
            }

          </>
        ) : (
          <div className={`${styles.jobPost_body_empty} mx-auto`}>
            <Empty description="Không có bài đăng nào!" />
          </div>
        )}
      </Row>
    </div>
  )

  const fetchData = async () => {
    // setLoading(true)
    try {
      let str = '?limit=10&page=1&jobStatus=3'
      if (router.asPath.indexOf('?') > 0) str = router.asPath.slice(router.asPath.indexOf('?'))
      if (router.query?.jobStatus === String(statusPostConstants.Closed)) {
        str = str.replace('jobStatus=5', 'jobStatus=4%2C5')
      }
      // console.log(str);
      const resData = await getJobPostApi(str)
      window.scrollTo(0, 0)
      // active item
      let newDataGroups = resData.data.data;
      if (router.query.jobId) {
        newDataGroups = (resData.data.data || []).map((item, index) => ({
          ...item,
          isActive: item.id === Number(router.query.jobId)
        }));
      } else {
        // newDataGroups = (resData.data.data || []).map((item, index) => ({
        //   ...item,
        //   isActive: index === 0
        // }));
      }
      setPostData({
        ...resData.data,
        data: newDataGroups
      })

    } catch (error) {
      setPostData(undefined)
      handleError(error)
    } finally {
      // setLoading(false)
    }
  }
  const loadingDataPreview = async (id) => {
    try {
      const { data } = await getDetailJobApi(id);
      setDataJobPreview(data)
    } catch (error) {
      handleError(error)
    }
  }

  useEffect(() => {
    setStatus(router.query.jobStatus ? Number(router.query.jobStatus) : Posted)
    fetchData()
    if (router.query.jobId) {
      loadingDataPreview(Number(router.query.jobId))
      activeItemGroup(Number(router.query.jobId))
    }
    if (Number(router.query.jobStatus)) {
      switch (Number(router.query.jobStatus)) {
        case Posted:
          return setColor('var(--primary-color)')
        case Waiting:
          return setColor('var(--secondary-color)')
        case Expired:
          return setColor('var(--sources-color)')
        case Closed:
          return setColor('var(--black-color)')
        case Refuse:
          return setColor('var(--red-color)')
        case Draft:
          return setColor('var(--sources-color)')
        default:
          break
      }
    }
  }, [JSON.stringify(router.query)])

  useEffect(() => {
    if (Object.keys(dataJobPreview).length) {
      setLoadingPreview(false)
    }
  }, [JSON.stringify(dataJobPreview)])

  const getSlug = () => {
    switch (status) {
      case Posted:
        return 'hiển thị'
      case Waiting:
        return 'chờ duyệt'
      case Closed:
        return 'đã đóng'
      case Refuse:
        return 'bị từ chối'
      case Draft:
        return 'nháp'
      default:
        return 'hiển thị'
    }
  }

  return (
    <div className={styles.jobPost} ref={containerRef}>
      <div className={styles.jobPost_wrap}>

        <div className={styles.jobPost_tabs}>
          <div className={styles.container_tabs}>
            {renderTab()}
          </div>
        </div>

        <div className={`${styles.information_record} d-flex justify-content-between align-items-center`}>
          {
            postData?.data?.length ? (
              <div>
                Có <span className={styles.number}> {postData.data.length} tin </span> {getSlug()}
              </div>
            ) : <div />
          }
          <Select
            style={{
              width: "135px",
              borderRadius: "6px"
            }}
            onChange={value => {
              setFilterPost(value)
              handleFetchData({ page: 1, jobStatus: status, urgent: value })
            }}
            value={filterPost} >
            <Select.Option value={NumberEnum.FilterAll}>Tất cả</Select.Option>
            <Select.Option value={NumberEnum.FilterUrgent}>Tuyển gấp</Select.Option>
            <Select.Option value={NumberEnum.FilterNormal}>Tin tuyển dụng</Select.Option>
          </Select>
        </div>


        <div className={styles.jobPost_body}>
          {/* {renderSideBar()} */}
          {loading ? <Loading /> : renderPost()}
        </div>
      </div>

      <Modal
        wrapClassName="modal-global"
        visible={isFeatureExtendPostModal}
        width={1200}
        footer={null}
        destroyOnClose
        onCancel={() => {
          setIsFeatureExtendPostModal(false)
        }}
      >
        <div className="modal-body">
          <div className="modal-title" style={{ marginBottom: '20px' }}>
            Gia hạn tin đăng
          </div>
          <ExtendPost
            jobId={detailPost.id}
            triggerFetchData={fetchData}
            changeStatusModal={bool => setIsFeatureExtendPostModal(bool)}
          />
        </div>
      </Modal>

      <Modal
        wrapClassName="modal-global"
        visible={isFeatureUpgradeHotJobModal}
        onCancel={() => setIsFeatureUpgradeHotJobModal(false)}
        width={1200}
        footer={null}
      >
        <div className="modal-body">
          <div className="modal-title">Nâng cấp Hot Job</div>
          <div className="modal-content">
            <UpgradeHotJob
              propsData={detailPost}
              triggerFetchData={fetchData}
              changeStatusFeatureUpgradeHotJobModal={bool => setIsFeatureUpgradeHotJobModal(bool)}
            />
          </div>
        </div>
      </Modal>

      <Modal
        wrapClassName="modal-global"
        visible={isFeatureClosePostModal}
        onCancel={() => setIsFeatureClosePostModal(false)}
        footer={null}
      >
        <div className="modal-body">
          <div className="modal-title">Bạn có chắc chắn muốn đóng tin?</div>
          <div className="modal-content" />
          <div className="modal-action">
            <button
              type="button"
              className="modal-cancel"
              onClick={() => setIsFeatureClosePostModal(false)}
            >
              Huỷ
            </button>
            <button type="button" className="modal-confirm" onClick={featureClosePost}>
              OK
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        wrapClassName="modal-global"
        visible={isFeatureRemovePostModal}
        onCancel={() => setIsFeatureRemovePostModal(false)}
        footer={null}
      >
        <div className="modal-body">
          <div className="modal-title">Bạn có chắc chắn muốn xoá tin?</div>
          <div className="modal-content" />
          <div className="modal-action">
            <button
              type="button"
              className="modal-cancel"
              onClick={() => setIsFeatureRemovePostModal(false)}
            >
              Huỷ
            </button>
            <button type="button" className="modal-confirm" onClick={featureRemovePost}>
              OK
            </button>
          </div>
        </div>
      </Modal>

      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
    </div>
  )
}

export default JobPost
