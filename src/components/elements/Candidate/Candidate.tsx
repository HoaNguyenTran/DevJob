import { SearchOutlined } from '@ant-design/icons'
import { Input, message, Modal, Rate } from 'antd'
import { getFjobGroupsApi, postAddUserGroupApi } from 'api/client/group'
import { getYear } from 'date-fns'
import router from 'next/router'
import React, { useRef, useState } from 'react'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { CommonStatusConstant } from 'src/constants/statusConstant'
import { convertToHumanDate, handleError, removeAccents } from 'src/utils/helper'
import DiamondSmall from '../Diamond/DiamondSmall'
import ModalQRDownload from '../Modal/ModalQRDownload'
import styles from './Candidate.module.scss'


const Candidate = ({ obj, handleShowModalAccept, handleShowModalRefuse, handleShowModalApp }) => {
  
  const [isGroupListModal, setIsGroupListModal] = useState(false)
  const [dataGroups, setDataGroups] = useState<any>([])
  const [isShowModalApp, setIsShowModalApp] = useState(false);
  const dataGroupsRef = useRef([])
  const isPreviewJob = !router.pathname.includes(routerPathConstant.jobDetail.replace(":id", ""));

  const {
    code,
    avatar,
    id,
    name,
    userRating,
    birthday,
    shortAddress,
    title,
    gender,
    hiringStatus,
    appliedTime,
    reasonChangeStatus,
    matching,
    userId,
    jobId,
    canApplyDate,
    workingAddress,
    jobSchedules,
  } = obj

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
            <div className='text-line-clamp-1'>
              {reasonChangeStatus}
            </div>
          </>
        )
      case CommonStatusConstant.Cancel:
        return (
          <>
            <img src="/assets/icons/color/cancel.svg" alt="" />
            <span>Lý do: </span>
            <div className='text-line-clamp-1'>
              {reasonChangeStatus}
            </div>
        </>
        )
      default:
        break
    }
  }

  const renderAction = () => {
    switch (hiringStatus) {
      case CommonStatusConstant.Waiting:
        return (
          <>
            <div className={styles.candidate_candi_action_accept}>
              <button
                type="button"
                onClick={() =>{
                  handleShowModalAccept({
                    id,
                    userId,
                    name,
                    title,
                    canApplyDate,
                    workingAddress,
                    jobSchedules,
                  })
                  // if(isPreviewJob) {
                  //   router.push({
                  //     pathname: router.pathname,
                  //     query: {
                  //       ...router.query,
                  //       isReloadPreview: true,
                  //     }
                  //   })
                  // }
                }}
              >
                Chấp nhận
              </button>
            </div>
            <div className={styles.candidate_candi_action_reject}>
              <button
                type="button"
                onClick={() => {
                  handleShowModalRefuse({
                    statusJob: CommonStatusConstant.Reject,
                    jobId,
                    userId,
                  })
                  // if(isPreviewJob) {
                  //   router.push({
                  //     pathname: router.pathname,
                  //     query: {
                  //       ...router.query,
                  //       isReloadPreview: true,
                  //     }
                  //   })
                  // }
                }
                  
                }
              >
                Từ chối
              </button>
            </div>
            <div className={styles.candidate_candi_action_contact}>
              <button type="button" onClick={handleShowModalApp}>
                Liên hệ
              </button>
            </div>
          </>
        )
      case CommonStatusConstant.Accept:
        return (
          <>
            <div className={styles.candidate_candi_action_review}>
              <button type="button" onClick={handleShowModalApp}>
                Đánh giá
              </button>
            </div>
            <div className={styles.candidate_candi_action_reject}>
              <button
                type="button"
                onClick={() =>
                  handleShowModalRefuse({
                    statusJob: CommonStatusConstant.Reject,
                    jobId,
                    userId,
                  })
                }
              >
                Huỷ chấp nhận
              </button>
            </div>
            <div className={styles.candidate_candi_action_contact}>
              <button type="button" onClick={handleShowModalApp}>
                Liên hệ
              </button>
            </div>
          </>
        )
      case CommonStatusConstant.Reject:
        return (
          <>
            <div className={styles.candidate_candi_action_review}>
              <button type="button" onClick={handleShowModalApp}>
                Đánh giá
              </button>
            </div>
            <div className={styles.candidate_candi_action_accept}>
              <button
                type="button"
                onClick={() =>
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
                }
              >
                Chấp nhận
              </button>
            </div>
            <div className={styles.candidate_candi_action_contact}>
              <button type="button" onClick={handleShowModalApp}>
                Liên hệ
              </button>
            </div>
          </>
        )

      default:
        break
    }
  }

  const addItemIntoGroup = async item => {
    try {
      await postAddUserGroupApi({
        'userId': obj?.id,
        'groupId': item?.id,
      })
      message.success('Thêm vào nhóm thành công')
      setIsGroupListModal(false)
    } catch (e) {
      handleError(e)
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

  const getDataGroups = async () => {
    try {
      const { data } = await getFjobGroupsApi()
      setDataGroups(data.data)
      dataGroupsRef.current = data.data
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className={`candidate ${styles.candidate_candi}`}>
      <div className={styles.candidate_candi_header}>
        <a target="_blank" href={`${routerPathConstant.user}/${code}`} rel="noreferrer">
          <div className={styles.candidate_candi_title}>
            <img
              className={styles.candidate_candi_avt}
              src={avatar || configConstant.defaultAvatar}
              width={64}
              height={64}
              alt=""
            />
            <div>
              <div className={styles.candidate_candi_name}>
                #{id} - {name}
              </div>
              <Rate disabled value={userRating} defaultValue={4} />
            </div>
          </div>
        </a>
        <div
            className={styles.candidate_candi_icon}
            onClick={() => {
              getDataGroups()
              setIsGroupListModal(true)
            }}
          >
            <img alt="" src="/assets/icons/color/add_user.svg" />
          </div>
      </div>
      <div className={styles.candidate_candi_main}>
        <div className={styles.candidate_candi_information}>
          <div className={styles.candidate_candi_info}>
            {birthday && (
              <div className={styles.candidate_candi_info_age}>
                <img src="/assets/icons/color/year.svg" alt="" />
                {getYear(new Date()) - birthday?.slice(0, 4)} tuổi
              </div>
            )}
            {
              gender !== null &&
              <div className={`${styles.candidate_candi_info_age  }`}>
                <img src="/assets/icons/color/sex.svg" alt="" />
                {renderGender()}
              </div>
            }
            
            {shortAddress && (
              <div className={`${styles.candidate_candi_info_address  }`}>
                <img src="/assets/icons/color/location.svg" alt="" />
                <div className='text-line-clamp-1'>
                  {shortAddress}
                </div>
              </div>
            )}
          </div>
          <div className={`${styles.candidate_candi_item } `}>
            <img src="/assets/icons/color/package.svg" alt="" />
            <span>Vị trí ứng tuyển: </span>
            <div className='text-line-clamp-1'>
              {title}
            </div>
          </div>
          <div className={styles.candidate_candi_item}>{renderOption()}</div>
        </div>
        {!!matching && (
          <div className={styles.candidate_candi_progress}>
            <span className={styles.text_des}>Phù hợp</span>
            <DiamondSmall percent={matching} />
          </div>
        )}
      </div>
      <div className={styles.candidate_candi_action}>{renderAction()}</div>
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

export default Candidate
