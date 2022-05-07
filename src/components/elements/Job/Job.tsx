/* eslint-disable no-param-reassign */
import { AlignLeftOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons'
import { message } from 'antd'
import { deleteSaveJobApi, postSaveJobApi } from 'api/client/job'
import { addDays, compareAsc, formatDistanceToNow, fromUnixTime } from 'date-fns'
import viLocale from 'date-fns/locale/vi'
import { useRouter } from 'next/router'
import React, { FC, useRef, useState } from 'react'
import { configConstant } from 'src/constants/configConstant'
import { errorCodeConstant } from 'src/constants/errorCodeConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useAppSelector } from 'src/redux'
import { convertToHumanDate, formatNumber, getTokenUser, handleError, transformTextLocation } from 'src/utils/helper'
import DiamondSmall from '../Diamond/DiamondSmall'
import LinkTo from '../LinkTo'
import styles from './Job.module.scss'

const Job: FC<any> = (props): JSX.Element => {
  const router = useRouter()
  const profile = useAppSelector(state => state.user.profile || {})
  const masterData = useAppSelector(state => state.initData.data)


  const [isSave, setIsSave] = useState(props.isSaveJob)

  const squareRef = useRef(null)

  const handleSaveJob = async e => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const responseSave = await postSaveJobApi({ userId: profile.id, jobId: props.id })
      if (responseSave.data) {
        setIsSave(1)
        if (props.handleClickSave) props.handleClickSave()
        message.success("Thêm công việc yêu thích thành công!")
      }
    } catch (error: any) {
      if (!(error?.response?.data.errorCode === errorCodeConstant.invalidHeader)) {
        message.error((error as ErrorMsg)?.response?.data?.message)
      }
    }
  }

  const handleUnSaveJob = async e => {
    e.preventDefault()
    e.stopPropagation();
    try {
      const responseUnsave = await deleteSaveJobApi(props.id)
      if (responseUnsave.data) {
        setIsSave(0)
        if (props.handleClickSave) props.handleClickSave()
        message.success("Bỏ công việc yêu thích thành công!")
      }
    } catch (error: any) {
      if (!(error?.response?.data.errorCode === errorCodeConstant.invalidHeader)) {
        handleError(error)
      }
    }
  }

  const checkOwnPost = () => {
    if (props.userId === profile.id) return true
    return false
  }

  const renderExpireTime = () => {
    const days = 30
    let strExpireTime = ''
    if (compareAsc(addDays(new Date(), days), fromUnixTime(props.expiredDate)) > 0) {
      strExpireTime = `Còn lại ${formatDistanceToNow(fromUnixTime(props.expiredDate), {
        locale: viLocale,
      })}`
    } else strExpireTime = `${convertToHumanDate(props.expiredDate)}`

    return (
      <>
        <img src="/assets/icons/color/time_out.svg" alt="" />
        <div className={styles.value}>
          {Math.floor(Date.now() / 1000) - props.expiredDate > 0 ? ('Hết hạn ứng tuyển') : (
            <>{strExpireTime}</>
          )}
        </div>
      </>
    )
  }

  const renderWage = () =>
    `${(props.wageMin && props.wageMax)
      ? `${formatNumber(props.wageMin)} - ${formatNumber(props.wageMax)} VNĐ/${masterData.WageUnit?.find(item => item.id === props.wageUnit)?.name
      }`
      : 'Thoả thuận'
    }`

  const renderTags = () => (
    <>
      {props.isUrgent === 1 && (
        <div className={styles.urgent}>
          <img alt="" src="/assets/icons/color/icon_urgent.svg" />
          Siêu gấp
        </div>
      )}
      {props.isHotJob === 1 && (
        <div className={styles.hotjob}>
          <img alt="" src="/assets/icons/color/icon_hot.svg" />
          Siêu hot
        </div>
      )}
    </>
  )

  const onClickJob = () => {
    if (props.onHandleClickJob) {
      props.onHandleClickJob()
    } else {
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          jobId: props.id
        }
      })
    }
  }
  const renderJobPC = () => (
    <div className={`${styles.job} ${props.isActive ? styles.item_active : ""}`} ref={squareRef}>
      {/* <LinkTo href={`${router.pathname}?jobId=${props.id}`}> */}
      <div className={styles.job_wrap} onClick={() => onClickJob()}>
        <div className={styles.job_left}>
          <div className={styles.information}>
            <div className={styles.avatar}>
              <img src={props.ownPost?.ownJobAvatar || configConstant.defaultPicture} alt=""
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = configConstant.defaultPicture;
                }}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.tags}>
                {renderTags()}
              </div>
              <div className={styles.title}>
                <LinkTo title={props.title} href={`${routerPathConstant.jobDetail.replace("/:id", "")}/${props.id}`} target="_blank">
                  {props.title}
                </LinkTo>
              </div>

              <div className={styles.name}>
                <img alt="" src="/assets/icons/color/isVerified.svg" />&nbsp;
                <span>{props.ownPost.ownJobName}</span>
              </div>
            </div>
          </div>
          <div className={styles.main}>
            {props.reasonChangeStatus && (
              <div className={styles.location}>
                <AlignLeftOutlined style={{ color: "var(--secondary-color)" }} />
                <div className={styles.value}>
                  {props.reasonChangeStatus}
                </div>
              </div>
            )}
            <div className={styles.location}>
              <img src="/assets/icons/color/location.svg" alt="" />
              <div className={styles.value}>
                {props.workingAddress && transformTextLocation(props.workingAddress)}
                {!checkOwnPost() && !!props.distance && <span>{` (${props.distance} km)`}</span>}
              </div>
            </div>
            <div className={styles.bottom}>
              <div className={styles.salary}>
                <img src="/assets/icons/color/money.svg" alt="" />
                <div className={styles.value}>{renderWage()}</div>
              </div>
              <div className={styles.expired}>{renderExpireTime()}</div>
            </div>
          </div>
        </div>

        <div className={styles.job_right}>
          <div className={styles.save}>
            {isSave ? (
              <HeartFilled className={styles.icon} onClick={e => handleUnSaveJob(e)} />
            ) : (
              <HeartOutlined className={styles.icon} onClick={e => handleSaveJob(e)} />
            )}
          </div>
          {getTokenUser() &&
            <div className={props.matching ? styles.progress : `${styles.progress} invisible`}>
              <div className={styles.text}>Phù hợp</div>
              <DiamondSmall percent={props.matching || 0} />
            </div>}
        </div>
      </div>
      {/* </LinkTo> */}
    </div>
  )

  return <>{renderJobPC()}</>
}

export default Job
