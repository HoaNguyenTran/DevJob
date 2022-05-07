import { Pagination, Modal, message, Radio, Empty } from 'antd'
import { useAppSelector } from 'src/redux'
import { getJobApplyApi, patchJobApplyApi } from 'api/client/job'
import { useRouter } from 'next/router'
import React, { useEffect, useState, useRef } from 'react'
import Loading from 'src/components/elements/Loading/Loading'
import Candidate from 'src/components/elements/Candidate/Candidate'
import { roleConstant } from 'src/constants/roleConstant'
import { convertTimeToHHmm, handleError } from 'src/utils/helper'
import { CommonStatusConstant } from 'src/constants/statusConstant'
import { dayOfWeekConstant } from 'src/constants/dayOfWeekConstant'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import styles from './TabCandidate.module.scss'

const TabCandidate = ({ jobId, status }) => {
  const masterData = useAppSelector(state => state.initData.data)

  const router = useRouter()

  const [candidateData, setCandidateData] = useState<any>()
  const [loading, setLoading] = useState(false)

  const [isModalAcceptVisible, setIsModalAcceptVisible] = useState(false)
  const [isModalRefuseVisible, setIsModalRefuseVisible] = useState(false)

  const [dataAccept, setDataAccept] = useState<any>({})
  const [dataRefuse, setDataRefuse] = useState<any>({})

  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const [statusRej, setStatusRej] = useState(null)
  const [noteRej, setNoteRej] = useState('')

  const refMore = useRef<HTMLInputElement | null>(null)

  const handleShowModalApp = () => {
    setIsShowModalApp(true)
  }

  const handleCancelModalRefuse = () => {
    setIsModalRefuseVisible(false)
    setStatusRej(null)
    setNoteRej('')
  }

  const handleShowModalAccept = ({
    id,
    userId,
    name,
    title,
    canApplyDate,
    workingAddress,
    jobSchedules,
  }) => {
    setIsModalAcceptVisible(true)
    setDataAccept({
      id,
      userId,
      jobId,
      name,
      title,
      canApplyDate,
      workingAddress,
      jobSchedules,
    })
  }

  const handleShowModalRefuse = ({ statusJob, userId }) => {
    setIsModalRefuseVisible(true)
    setDataRefuse({
      statusJob,
      jobId,
      userId,
    })
  }

  const handleOkModalAccept = () => {
    setIsModalAcceptVisible(false)
    handleChangeJobApply({
      statusJob: CommonStatusConstant.Accept,
      userId: dataAccept.userId,
    })
  }

  const handleChangeJobApply = async ({ statusJob, userId }) => {
    if (statusJob === CommonStatusConstant.Accept) {
      try {
        await patchJobApplyApi({
          jobId,
          data: { userId, hiringStatus: CommonStatusConstant.Accept },
        })
        tabCondition(status, 1)

        message.success('Chấp nhận ứng viên thành công!');
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            isRenderTab: true,
          }
        })
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
        tabCondition(status, 1)
        message.success('Từ chối ứng viên thành công!')
        router.push({
          pathname: router.pathname,
          query: {
            ...router.query,
            isRenderTab: true,
          }
        })
      } catch (error) {
        message.error('Từ chối ứng viên thất bại!')
      }
    }
  }
  console.log(router);
  const tabCondition = async (num: number, pageNumber: number) => {
    try {
      // console.log("day r");
      setLoading(true)
      const responseData = await getJobApplyApi({
        pageNumber,
        jobId,
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

  const renderSchedule = jobSchedules => {
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
    // arrHour.forEach(item => strTmp.push(` ${item.workTimeFrom}h - ${item.workTimeTo}h`))
    arrHour.forEach(item =>
      strTmp.push(
        ` ${convertTimeToHHmm(item.workTimeFrom)} - ${convertTimeToHHmm(item.workTimeTo)}`,
      ),
    )
    workSchedule.push(`${strTmp}, ${workDay}`)

    return workSchedule
  }

  const handleOkModalRefuse = () => {
    if (statusRej === 0 && noteRej.trim().length === 0) {
      return message.error('Bạn cần điền lý do từ chối!')
    }
    handleChangeJobApply({ ...dataRefuse })
    // setIsModalRefuseVisible(false)
    setNoteRej('')
    setStatusRej(null)
  }

  const formatResponseDataApply = object => {
    const { hiringStatus, appliedTime, id, userId, reasonChangeStatus } = object
    const { avatar, name, gender, userRating, birthday, code, shortAddress } = object.user
    const { title, workingAddress, canApplyDate, jobSchedules, matching } = object.job

    const obj = {
      jobId,
      hiringStatus,
      appliedTime,
      id,
      userId,
      reasonChangeStatus,
      avatar,
      name,
      gender,
      userRating,
      birthday,
      code,
      shortAddress,
      title,
      workingAddress,
      canApplyDate,
      jobSchedules,
      matching,
    }

    return (
      <div key={id} className={styles.candidate}>
        <Candidate
          obj={obj}
          handleShowModalAccept={handleShowModalAccept}
          handleShowModalRefuse={handleShowModalRefuse}
          handleShowModalApp={handleShowModalApp}
        />
      </div>
    )
  }

  const renderPagi = ({ totalPage, currentPage }) => (
    <Pagination
      total={totalPage}
      current={currentPage}
      onChange={num => tabCondition(status, num)}
      className={styles.candidateList_pagi}
      hideOnSinglePage
    />
  )

  useEffect(() => {
    tabCondition(status, 1)
  }, [status, router])

  if (loading) return <Loading />

  return (
    <div className={styles.candidateList}>
      {candidateData ? (
        <div className={styles.candidateList_content}>
          {candidateData.data.map(item => formatResponseDataApply(item))}
        </div>
      ) : (
        <div className={styles.candidateList_empty}>
          <Empty description="Không có ứng viên nào!" />
        </div>
      )}
      {candidateData &&
        renderPagi({
          totalPage: candidateData.meta.pagination.total,
          currentPage: candidateData.meta.pagination.currentPage,
        })}

      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}

      <Modal
        wrapClassName="modal-global"
        footer={null}
        visible={isModalAcceptVisible}
        onCancel={() => setIsModalAcceptVisible(false)}
        closable={false}
      >
        <div className={`modal-body ${styles.candidateList_modal_accept}`}>
          <div className="modal-title">Chấp nhận ứng viên</div>
          <div className={styles.candidateList_modal_accept_main}>
            <div className={styles.candidateList_modal_accept_title}>
              Thêm ứng viên mã #{dataAccept.userId} vào danh sách nhân viên
            </div>
            <div className={styles.candidateList_modal_accept}>
              <span>Tên:</span> {dataAccept.name}
            </div>
            <div className={styles.candidateList_modal_accept}>
              <span>Vị trí ứng tuyển:</span> {dataAccept.title}
            </div>
            <div className={styles.candidateList_modal_accept}>
              <span>Địa điểm làm việc:</span> {dataAccept.workingAddress}
            </div>
            <div className={styles.candidateList_modal_accept}>
              <span>Thời gian làm việc:</span> {renderSchedule(dataAccept.jobSchedules)}
            </div>
          </div>

          <div className={styles.candidateList_modal_accept_action}>
            <button
              type="button"
              className={styles.candidateList_modal_accept_ok}
              onClick={handleOkModalAccept}
            >
              OK
            </button>
            <button
              type="button"
              className={styles.candidateList_modal_accept_cancel}
              onClick={() => setIsModalAcceptVisible(false)}
            >
              Huỷ
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        wrapClassName="modal-global"
        visible={isModalRefuseVisible}
        footer={null}
        closable={false}
        onCancel={handleCancelModalRefuse}
      >
        <div className="modal-title">Lý do từ chối</div>
        <div className="modal-content">
          <Radio.Group value={statusRej} onChange={e => setStatusRej(e.target.value)}>
            {masterData.JobReason?.filter(item => item.id < 5).map(item => (
              <Radio key={item.id} value={item.id} className="d-block my-2">
                {item.name}
              </Radio>
            ))}
            <Radio
              className={`d-block  my-2 ${styles.candidateList_modal_more}`}
              onClick={() => refMore.current?.focus()}
              value={0}
            >
              <span className="mr-2">Lý do khác</span>
              {statusRej === 0 && (
                <input ref={refMore} value={noteRej} onChange={e => setNoteRej(e.target.value)} />
              )}
            </Radio>
          </Radio.Group>
        </div>

        <div className="modal-action">
          <button type="button" className="modal-cancel" onClick={handleCancelModalRefuse}>
            Huỷ
          </button>
          <button type="button" className="modal-confirm" onClick={handleOkModalRefuse}>
            OK
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default TabCandidate
