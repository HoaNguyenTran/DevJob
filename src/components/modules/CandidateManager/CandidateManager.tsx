/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { SearchOutlined } from '@ant-design/icons'
import { Col, Empty, Input, message, Modal, Pagination, Radio, Rate, Row, Skeleton } from 'antd'
import { getFjobGroupsApi, postAddUserGroupApi } from 'api/client/group'
import { getJobApplyApi, patchJobApplyApi } from 'api/client/job'
import { getYear } from 'date-fns'
import { useRouter } from 'next/router'
import UserDetail from 'src/components/modules/UserDetail/UserDetail'
import React, { FC, useEffect, useRef, useState } from 'react'
import DiamondSmall from 'src/components/elements/Diamond/DiamondSmall'
import Link from 'src/components/elements/LinkTo'
import Loading from 'src/components/elements/Loading/Loading'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { CommonStatusConstant } from 'src/constants/statusConstant'
import { useAppSelector } from 'src/redux'
import { convertTimeToHHmm, convertToHumanDate, getErrorText, handleError, removeAccents } from 'src/utils/helper'
import { configConstant } from 'src/constants/configConstant'
import { getProfileApi } from 'api/client/user'
import Group from '../FindEE/components/Group'
import styles from './CandidateManager.module.scss'



interface IDataRefuse {
  statusJob: number
  jobId: number
  userId: number
}

interface DataGroups {
  id: number
  name: string
  user_id: number
}

interface DataAccept {
  id: number
  jobId: number
  canApplyDate: number
  userId: number
  name: string
  title: string
  workingAddress: string
  jobSchedules: { dayOfWeek: number; shiftId: number; workTimeFrom: string; workTimeTo: string }[]
}

const defaultPage = 1

const TabCandidateManagerEnum = {
  Waiting: {
    id: CommonStatusConstant.Waiting,
    slug: 'candidate_waiting',
    name: 'Chờ duyệt',
  },
  Accept: { id: CommonStatusConstant.Accept, slug: 'candidate_accept', name: 'Đã tuyển' },
  Reject: {
    id: CommonStatusConstant.Reject,
    slug: 'candidate_reject',
    name: 'Từ chối',
  },
  Saved: { id: CommonStatusConstant.Saved, slug: 'candidate_saved', name: 'Đã lưu' },
  Cancel: { id: CommonStatusConstant.Cancel, slug: 'candidate_cancel', name: 'Ứng viên huỷ' },
}

const CandidateManager: FC = () => {
  const masterData = useAppSelector(state => state.initData.data)

  const router = useRouter()
  const query = router.query || {};

  const handleFromUrlToTab = () => {
    let status = TabCandidateManagerEnum.Waiting.id

    if (!router.query.tab) return status
    Object.keys(TabCandidateManagerEnum).forEach(key => {
      if (TabCandidateManagerEnum[key].slug === router.query.tab) {
        status = TabCandidateManagerEnum[key].id
      }
    })
    return status
  }

  const [tab, setTab] = useState(handleFromUrlToTab())
  const [loading, setLoading] = useState<boolean>(true)
  const [candidateData, setCandidateData] = useState<any>() // <JobApplyGlobal.JobApplyFull>
  const [dataAccept, setDataAccept] = useState<DataAccept>({} as DataAccept)
  const [dataRefuse, setDataRefuse] = useState<IDataRefuse>({} as IDataRefuse)
  const [isModalAcceptVisible, setIsModalAcceptVisible] = useState(false)
  const [isModalRefuseVisible, setIsModalRefuseVisible] = useState(false)
  const [isGroupListModal, setIsGroupListModal] = useState(false)
  const [statusRej, setStatusRej] = useState(null)
  const [noteRej, setNoteRej] = useState('')
  const [numTabCurrent, setNumTabCurrent] = useState(0)
  const [dataGroups, setDataGroups] = useState<DataGroups[]>([])
  const [isShowModalApp, setIsShowModalApp] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);


  const [dataUserPreview, setDataUserPreview] = useState({});

  const dataGroupsRef = useRef([])
  const cadidateDetailRef = useRef<any>({})
  const refMore = useRef<HTMLInputElement | null>(null)

  const handleShowModalAccept = ({ id, userId, jobId, name, title, canApplyDate, workingAddress, jobSchedules }) => {
    setIsModalAcceptVisible(true)
    setDataAccept({ id, userId, jobId, name, title, canApplyDate, workingAddress, jobSchedules })
  }

  const handleOkModalAccept = () => {
    setIsModalAcceptVisible(false)
    handleChangeJobApply({
      statusJob: CommonStatusConstant.Accept,
      jobId: dataAccept.jobId,
      userId: dataAccept.userId,
    })
  }

  const handleShowModalRefuse = ({ statusJob, jobId, userId }: IDataRefuse) => {
    setIsModalRefuseVisible(true)
    setDataRefuse({ statusJob, jobId, userId })
  }

  const handleOkModalRefuse = () => {
    if (statusRej === null) return message.error('Bạn cần chọn lý do huỷ ứng tuyển!')
    if (statusRej === 0 && noteRej.trim().length === 0) {
      return message.error('Bạn cần điền lý do từ chối!')
    }
    handleChangeJobApply({ ...dataRefuse })
    setIsModalRefuseVisible(false)
    setNoteRej('')
    setStatusRej(null)
  }

  const handleCancelModalRefuse = () => {
    setIsModalRefuseVisible(false)
    setStatusRej(null)
    setNoteRej('')
  }


  const renderSchedule = jobSchedules => {
    const workSchedule: string[] = []
    let workDay = ''
    const arrHour: { workTimeFrom: number; workTimeTo: number }[] = []

    if (!jobSchedules) return

    if (jobSchedules[0].dayOfWeek === 1) {
      workDay = 'Hằng ngày'
    } else {
      workDay = 'Thứ '
      const arrWorkDay: number[] = []
      jobSchedules.map(
        item => !arrWorkDay.includes(item.dayOfWeek) && arrWorkDay.push(item.dayOfWeek),
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
      const arrShift: number[] = []

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

    const strTmp: string[] = []

    arrHour.forEach(item =>
      strTmp.push(
        ` ${convertTimeToHHmm(item.workTimeFrom)} - ${convertTimeToHHmm(item.workTimeTo)}`,
      ),
    )
    workSchedule.push(`${strTmp}, ${workDay}`)

    return workSchedule
  }

  const handleChangeJobApply = async ({ statusJob, jobId, userId }: IDataRefuse) => {
    if (statusJob === CommonStatusConstant.Accept) {
      try {
        await patchJobApplyApi({
          jobId,
          data: { userId, hiringStatus: CommonStatusConstant.Accept },
        })
        tabCondition(tab, defaultPage)
        message.success('Chấp nhận ứng viên thành công!')
      } catch (error) {
        message.error('Chấp nhận ứng viên thất bại!')
      }
    }

    if (statusJob === CommonStatusConstant.Reject) {
      try {
        const dataObj: {
          userId: number
          hiringStatus: number
          reason?: number | null
          reasonChangeStatus?: string
        } = {
          userId,
          hiringStatus: CommonStatusConstant.Reject,
          reason: statusRej,
        }

        if (statusRej === 0) dataObj.reasonChangeStatus = noteRej

        await patchJobApplyApi({
          jobId,
          data: dataObj,
        })

        tabCondition(tab, defaultPage)
        message.success('Từ chối ứng viên thành công!')
      } catch (error) {
        handleError(error)
      }
    }
  }

  const handleChangeTab = obj => {
    setTab(obj.id)
    router.push({
      pathname: router.pathname,
      query: { tab: obj.slug },
    })
    tabCondition(obj.id, defaultPage)
  }

  const onClickPreviewItem = (code) => {
    changeUserCodeQueryUrl(code)
    onChangeActiveItem(code)
  }

  const changeUserCodeQueryUrl = (code) => {
    if (String(router.query.usercode) !== code) {
      setLoadingPreview(true)
      router.push({
        pathname: router.pathname,
        query: {
          ...query,
          usercode: code
        },
      }).then(res => {
        setLoadingPreview(false)
      })
    }
  }
  const formatDataWithActive = (code) => (candidateData?.data || []).map((item: any) => ({
    ...item,
    isActive: item?.user?.code === code
  }))

  const onChangeActiveItem = (code) => {
    setCandidateData({
      ...candidateData,
      data: formatDataWithActive(code)
    })
  }

  const tabCondition = async (num: number, pageNumber) => {
    setNumTabCurrent(num)

    if (num === 3) return getDataGroups()

    try {
      // setLoading(true)
      const responseData = await getJobApplyApi({
        pageNumber,
        status: num,
        role: roleConstant.ER.id,
      })
      setCandidateData(responseData.data)
    } catch (error) {
      setCandidateData(undefined)
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserPreview = async () => {
    try {
      const { data } = await getProfileApi(String(router.query.usercode))
      setDataUserPreview(data.data)

    } catch (error) {
      handleError(error)
    } finally {
      setLoadingPreview(false)
    }
  }

  useEffect(() => {
    if (router.query.usercode)
      fetchUserPreview()
  }, [router.query.usercode])




  const renderContentTab = () => {
    if (numTabCurrent === 3) {
      return (
        <Group />
      )
    }
    return (
      <Row className='justify-content-space-between'>

        {candidateData ?
          <>
            <Col md={query.usercode ? 12 : 24}>
              <Row className="justify-content-between" style={{
                maxHeight: query.usercode ? "735px" : "unset",
                overflow: query.usercode ? "auto" : "unset"
              }}
              >
                {formatDataWithActive(router.query.usercode).map(item => formatResponseDataApply(item))}
              </Row>
              {candidateData
                ? renderPagi({
                  totalPage: candidateData.meta.pagination.total,
                  currentPage: candidateData.meta.pagination.currentPage,
                })
                : null}
            </Col>
            {
              !!query.usercode &&
              <Col md={12} className='pl-3' >
                {
                  loadingPreview ?
                    <>
                      <Skeleton active className='p-4' />
                      <Skeleton active className='p-4 mt-2' />
                    </>
                    :
                    <div className='bg-white' style={{ maxHeight: "735px", overflow: "auto" }}>
                      <UserDetail userData={dataUserPreview} fetchUserPreview={fetchUserPreview} />
                    </div>
                }
              </Col>
            }
          </>
          : (
            <div className={styles.candidate_main_empty}>
              <Empty description="Không có ứng viên nào!" />
            </div>
          )}
      </Row>
    )
  }

  const renderTab = () =>
    Object.keys(TabCandidateManagerEnum).map(key => (
      <div
        key={TabCandidateManagerEnum[key].id}
        onClick={() => handleChangeTab(TabCandidateManagerEnum[key])}
        style={{
          backgroundColor: tab === TabCandidateManagerEnum[key].id ? 'var(--primary-color)' : '#f9f9f9',
          color: tab === TabCandidateManagerEnum[key].id ? 'var(--white-color)' : 'black',
          border: tab === TabCandidateManagerEnum[key].id ? '0' : 'solid 1px #e7e7e7 '
        }}
        className={styles.candidate_tab}
      >
        <div className={styles.item}>
          {TabCandidateManagerEnum[key].name}
        </div>
      </div>
    ))

  const formatResponseDataApply = object => {
    const { hiringStatus, appliedTime, jobId, id, userId, reasonChangeStatus, isActive } = object
    const { avatar, name, gender, userRating, birthday, code, shortAddress } = object.user
    const { title, workingAddress, canApplyDate, jobSchedules, matching, expireTime } = object.job

    const renderGender = () => {
      switch (gender) {
        case 0:
          return 'Khác'
        case 1:
          return 'Nam'
        case 2:
          return 'Nữ'
        default:
          break
      }
    }

    const renderOption = () => {
      switch (hiringStatus) {
        case CommonStatusConstant.Waiting:
          return (
            <>
              <img src="/assets/icons/color/calendar.svg" alt="" />
              <span>Ngày ứng tuyển: </span>
              {convertToHumanDate(appliedTime)}
            </>
          )
        case CommonStatusConstant.Accept:
          return (
            <>
              <img src="/assets/icons/color/calendar.svg" alt="" />
              <span>Ngày tuyển: </span>
              {convertToHumanDate(appliedTime)}
            </>
          )
        case CommonStatusConstant.Reject:
          return (
            <>
              <img src="/assets/icons/color/cancel.svg" alt="" />
              <span>Lý do: </span>
              {reasonChangeStatus}
            </>
          )
        case CommonStatusConstant.Cancel:
          return (
            <>
              <img src="/assets/icons/color/cancel.svg" alt="" />
              <span>Lý do: </span>
              {reasonChangeStatus}
            </>
          )
        default:
          break
      }
    }

    const renderAction = () => {
      const tabKey = query.tab ? String(query.tab) : TabCandidateManagerEnum.Waiting.slug;
      switch (tabKey) {
        case TabCandidateManagerEnum.Waiting.slug:
          return (
            <>
              <div className={styles.candidate_candi_action_accept}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowModalAccept({
                      id,
                      userId,
                      jobId,
                      name,
                      title,
                      canApplyDate,
                      workingAddress,
                      jobSchedules,
                    })
                  }}
                >
                  Chấp nhận
                </button>
              </div>
              <div className={styles.candidate_candi_action_reject}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowModalRefuse({ statusJob: CommonStatusConstant.Reject, jobId, userId })
                  }}
                >
                  Từ chối
                </button>
              </div>
              <div className={styles.candidate_candi_action_contact}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setIsShowModalApp(true)
                }}>
                  Liên hệ
                </button>
                {/* <Call mode="toEE" jobId={jobId} calleeId={id} /> */}
              </div>
              <div className={styles.candidate_candi_action_view}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  router.push(`${routerPathConstant.jobDetail.replace("/:id", "/")}${jobId}`)
                }}>
                  Xem tin
                </button>
              </div>
            </>
          )
        case TabCandidateManagerEnum.Accept.slug:
          return (
            <>
              <div className={styles.candidate_candi_action_review}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setIsShowModalApp(true)
                }}>
                  Đánh giá
                </button>
              </div>
              <div className={styles.candidate_candi_action_reject}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShowModalRefuse({ statusJob: CommonStatusConstant.Reject, jobId, userId })
                  }}
                >
                  Huỷ chấp nhận
                </button>
              </div>
              <div className={styles.candidate_candi_action_contact}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setIsShowModalApp(true)
                }}>
                  Liên hệ
                </button>
                {/* <Call mode="toEE" jobId={jobId} calleeId={id} /> */}
              </div>
              <div className={styles.candidate_candi_action_view}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/job/${jobId}`)
                }}>
                  Xem tin
                </button>
              </div>
            </>
          )
        case TabCandidateManagerEnum.Reject.slug:
          return (
            <>
              <div className={styles.candidate_candi_action_review}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation()
                  setIsShowModalApp(true)
                }}>
                  Đánh giá
                </button>
              </div>
              <div className={styles.candidate_candi_action_accept}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleShowModalAccept({
                      id,
                      userId,
                      jobId,
                      name,
                      title,
                      canApplyDate,
                      workingAddress,
                      jobSchedules,
                    })
                  }}
                >
                  Chấp nhận
                </button>
              </div>
              <div className={styles.candidate_candi_action_contact}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  setIsShowModalApp(true)
                }}>
                  Liên hệ
                </button>
                {/* <Call mode="toEE" jobId={jobId} calleeId={id} /> */}
              </div>
              <div className={styles.candidate_candi_action_view}>
                <button type="button" onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/job/${jobId}`)
                }}>
                  Xem tin
                </button>
              </div>
            </>
          )
        default:
          return (
            <div className={`${styles.candidate_candi_action_view} w-100`}>
              <button className='w-100' type="button" onClick={(e) => {
                e.stopPropagation();
                router.push(`${routerPathConstant.jobDetail.replace("/:id", "/")}${jobId}`)
              }}>
                Xem tin
              </button>
            </div>
          )
      }
    }

    return (
      // <Row>
      <Col onClick={() => onClickPreviewItem(code)}
        xs={query.usercode ? 24 : 12}
        md={query.usercode ? 24 : 12}
        key={id}
        className={`candidate ${styles.candidate_candi} ${isActive ? styles.item_active : ""}`} >
        {Date.now() / 1000 > expireTime && <div className={styles.candidate_candi_expired} />}
        <div className={styles.candidate_candi_header}>
          <Link href={`${routerPathConstant.user}/${code}`}>
            <div className={styles.candidate_candi_title}>
              <img
                className={styles.candidate_candi_avt}
                src={avatar || '/assets/images/avatar/avt.jpeg'}
                width={64}
                height={64}
                alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = configConstant.defaultPicture;
                }}
              />
              <div>
                <div className={styles.candidate_candi_name}>
                  #{id} - {name}
                </div>
                <Rate disabled value={userRating} defaultValue={4} />
              </div>
            </div>
          </Link>
          <div
            className={styles.candidate_candi_icon}
            onClick={(e) => {
              e.stopPropagation()
              getDataGroups()
              cadidateDetailRef.current = object
              setIsGroupListModal(true)
            }}
          >
            <img alt="" src="/assets/icons/color/add_user.svg" />
          </div>
        </div>
        <div className={styles.candidate_candi_main}>
          <div className='w-100'>
            <div className={styles.candidate_candi_information}>
              <Row>
                <Col span={20}>
                  <div className={`${styles.candidate_candi_info} `}>
                    {birthday && (
                      <div className={styles.candidate_candi_info_age}>
                        <img src="/assets/icons/color/year.svg" alt="" />
                        {getYear(new Date()) - birthday?.slice(0, 4)} tuổi
                      </div>
                    )}
                    {
                      gender !== null &&
                      <div className={styles.candidate_candi_info_gender}>
                        <img src="/assets/icons/color/sex.svg" alt="" />
                        {renderGender()}
                      </div>
                    }

                    {shortAddress && (
                      <div className={styles.candidate_candi_info_gender}>
                        <img src="/assets/icons/color/location.svg" alt="" />
                        <span className={styles.customTextEllipsis}>{shortAddress}</span>
                      </div>
                    )}
                  </div>
                  <div className={`${styles.candidate_candi_item} mt-2`}>
                    <img src="/assets/icons/color/package.svg" alt="" />
                    <span>Vị trí ứng tuyển: </span>
                    {title}
                  </div>
                  <div className={`${styles.candidate_candi_item} mt-2`}>{renderOption()}</div>
                </Col>
                <Col span={4}>
                  {!!matching && (
                    <div className={styles.candidate_candi_progress}>
                      <span className={styles.candidate_candi_progress_title}>Phù hợp</span>
                      <DiamondSmall percent={matching} />
                    </div>
                  )}
                </Col>
              </Row>
            </div>
            <div className={styles.candidate_candi_action}>{renderAction()}</div>
          </div>

        </div>
      </Col>
      // </Row>  
    )
  }

  const handleChangePagi = pageNumber => {
    tabCondition(tab, pageNumber)
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        tab: router.query.tab || TabCandidateManagerEnum.Waiting.slug,
        page: pageNumber
      },
    })
  }

  const renderPagi = ({ totalPage, currentPage }) => (
    <Pagination
      total={totalPage}
      current={currentPage}
      onChange={pageNumber => handleChangePagi(pageNumber)}
      className={styles.candidate_pagi}
      hideOnSinglePage
    />
  )

  const getDataGroups = async () => {
    try {
      const { data } = await getFjobGroupsApi()
      dataGroupsRef.current = data.data
      setDataGroups(data.data)
      setLoading(false)
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }

  const searchGroupByName = value => {
    if (value) {
      const tempDataGroup = dataGroupsRef.current.filter((item: any) =>
        removeAccents(item?.name?.toLowerCase()).includes(removeAccents(value?.toLowerCase())),
      )
      setDataGroups(tempDataGroup)
    } else {
      getDataGroups()
    }
  }

  const addItemIntoGroup = async item => {
    try {
      await postAddUserGroupApi({
        'userId': cadidateDetailRef.current?.user?.id,
        'groupId': item?.id,
      })
      message.success('Thêm vào nhóm thành công')
      setIsGroupListModal(false)
    } catch (e) {
      message.error(getErrorText(e))
    }
  }

  useEffect(() => {
    tabCondition(tab, router.query.page || 1)
  }, [JSON.stringify(router.query)])

  const getSlug = () => {
    switch (String(router.query.tab)) {
      case TabCandidateManagerEnum.Waiting.slug:
        return 'chờ duyệt'
      case TabCandidateManagerEnum.Accept.slug:
        return 'đã tuyển'
      case TabCandidateManagerEnum.Reject.slug:
        return 'từ chối'
      case TabCandidateManagerEnum.Cancel.slug:
        return 'đã huỷ'
      default:
        return 'chờ duyệt'
    }
  }

  return (
    <div className={styles.candidate}>
      <div className={styles.candidate_card}>
        <div className={styles.candidate_tabs}>
          <div className={styles.container_tabs}>
            {renderTab()}
          </div>
        </div>

        <div className={styles.candidate_main}>
          {
            candidateData?.meta?.pagination?.total &&
            <div className={styles.candidate_information_record}>
              Có <span className={styles.number}> {candidateData?.meta?.pagination?.total}ứng viên</span>&nbsp;
              {getSlug()}
            </div>
          }

          {loading ? <Loading /> : renderContentTab()}
        </div>
      </div>
      <Modal
        wrapClassName="modal-global"
        // title="Lý do từ chối"
        visible={isModalRefuseVisible}
        onOk={handleOkModalRefuse}
        onCancel={handleCancelModalRefuse}
        footer={null}
      >
        <div className={`modal-body ${styles.candidate_modal_accept}`}>
          <div className="modal-title">Lý do từ chối</div>
          <div className='font-weight-normal'>
            <Radio.Group value={statusRej} onChange={e => setStatusRej(e.target.value)}>
              {masterData.JobReason?.filter(item => item.id < 5).map(item => (
                <Radio key={item.id} value={item.id} className="d-block my-2">
                  {item.name}
                </Radio>
              ))}
              <Radio
                className={`d-flex w-100 mt-2 ${styles.candidate_modal_more}`}
                onClick={() => refMore.current?.focus()}
                value={0}
              >
                <span className="mr-2 w-100">Lý do khác</span>

              </Radio>
            </Radio.Group>
            {statusRej === 0 && (
              <Input.TextArea rows={4} maxLength={999999999} className='d-block w-100 mt-2' ref={refMore} value={noteRej} onChange={e => setNoteRej(e.target.value)} />
            )}
          </div>
          <div className={styles.candidate_modal_accept_action}>
            <button
              type="button"
              className={styles.candidate_modal_accept_ok}
              onClick={handleOkModalRefuse}
            >
              OK
            </button>
            <button
              type="button"
              className={styles.candidate_modal_accept_cancel}
              onClick={handleCancelModalRefuse}
            >
              Huỷ
            </button>
          </div>
        </div>

      </Modal>

      <Modal
        wrapClassName="modal-global"
        footer={null}
        visible={isModalAcceptVisible}
        onCancel={() => setIsModalAcceptVisible(false)}
      >
        <div className={`modal-body ${styles.candidate_modal_accept}`}>
          <div className="modal-title">Chấp nhận ứng viên</div>
          <div className={styles.candidate_modal_accept_main}>
            <div className={styles.candidate_modal_accept_title}>
              Thêm ứng viên mã #{dataAccept.userId} vào danh sách nhân viên
            </div>
            <div className={styles.candidate_modal_accept}>
              <span>Tên: {dataAccept.name}</span>
            </div>
            <div className={styles.candidate_modal_accept}>
              <span>Vị trí ứng tuyển: {dataAccept.title}</span>
            </div>
            <div className='font-weight-500'>
              Lịch làm việc:
            </div>
            <div className={styles.candidate_modal_accept}>
              Địa điểm làm việc: {dataAccept.workingAddress}
            </div>
            <div className={styles.candidate_modal_accept}>
              Thời gian làm việc: {renderSchedule(dataAccept.jobSchedules)}
            </div>
          </div>

          <div className={styles.candidate_modal_accept_action}>
            <button
              type="button"
              className={styles.candidate_modal_accept_ok}
              onClick={handleOkModalAccept}
            >
              OK
            </button>
            <button
              type="button"
              className={styles.candidate_modal_accept_cancel}
              onClick={() => setIsModalAcceptVisible(false)}
            >
              Huỷ
            </button>
          </div>
        </div>
      </Modal>
      {isGroupListModal && (
        <Modal
          wrapClassName="modal-global"
          footer={null}
          visible={isGroupListModal}
          onCancel={() => setIsGroupListModal(false)}
        >
          <div className={`modal-body  ${styles.candidate_modal_accept}`}>
            <div className="modal-title">Chọn nhóm</div>
            <Input
              onChange={e => searchGroupByName(e.target.value)}
              style={{ borderRadius: '6px', margin: '20px 0px', height: '40px' }}
              suffix={<SearchOutlined />}
              placeholder="Tìm kiếm"
            />
            {dataGroups.length ? (
              <>
                {dataGroups.map((item, i) => (
                  <ul key={i} className="m-0 pl-0">
                    <li
                      onClick={() => addItemIntoGroup(item)}
                      className={`px-2 py-3 cursor-pointer ${styles.candidate_modal_accept_li}`}
                      style={{ borderBottom: '1px solid #f2f2f2' }}
                    >
                      {item.name}
                    </li>
                  </ul>
                ))}
              </>
            ) : (
              <div>Bạn chưa có nhóm nào</div>
            )}
          </div>
        </Modal>
      )}

      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
    </div>
  )
}

export default CandidateManager
