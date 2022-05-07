import { SearchOutlined } from "@ant-design/icons";
import { Input, message, Modal, Rate } from "antd";
import { getFjobGroupsApi, postAddUserGroupApi } from "api/client/group";
import { getYear } from "date-fns";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import { Gender } from "src/constants/configConstant";
import { routerPathConstant } from "src/constants/routerConstant";
import { useAppSelector } from "src/redux";
import { formatNumber, getErrorText, handleError, removeAccents } from "src/utils/helper";
import LinkTo from "../LinkTo";
import ModalQRDownload from "../Modal/ModalQRDownload";

import styles from "./UserSearch.module.scss";

const UserSearch = ({ onClick, user }) => {
  const {
    id,
    code,
    name,
    avatar,
    gender,
    birthday,
    userRating,
    experiences,
    expectSalaryFrom,
    expectSalaryTo,
    expectSalaryUnit,
    shortAddress,
    wantNewJob
  } = user
  const [dataGroups, setDataGroups] = useState<any[]>([])
  const [isGroupListModal, setIsGroupListModal] = useState(false)
  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const { FjobCategory: categorieList = [], WageUnit: salaryUnitList = [] } = useAppSelector(state => state.initData.data)
  const dataGroupsRef = useRef([])
  const cadidateDetailRef = useRef<any>({})
  const router = useRouter()

  const renderPosition = () => {
    if (!experiences.length) return []
    const arrPosition: any[] = []
    experiences.filter(exp =>
      arrPosition.push(categorieList.find(cate => cate.id === exp.categoryId)?.name),
    )
    return arrPosition
  }

  const getDataGroups = async () => {
    try {
      const res = await getFjobGroupsApi()
      dataGroupsRef.current = res.data.data
      setDataGroups(res.data.data)
    } catch (error) {
      handleError(error)
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

  const renderGender = g => Gender[g]

  const addItemIntoGroup = async item => {
    try {
      const resData = await postAddUserGroupApi({
        'userId': cadidateDetailRef.current?.id,
        'groupId': item?.id,
      })

      message.success(resData.data.message)
    } catch (e) {
      message.error(getErrorText(e))
    } finally {
      setIsGroupListModal(false)
    }
  }

  return (
    <div className={styles.content} onClick={onClick}>
      <div className={styles.content_item}>
        <div className={styles.findEE_item} key={id}>
          <div className={styles.findEE_item_header}>
            <div onClick={() => router.push(`${routerPathConstant.user}/${code}`)} style={{ cursor: "pointer" }}>
              <img className={styles.findEE_item_avt} src={avatar} alt="" />
            </div>
            <div style={{ width: '100%' }}>
              <div className={styles.findEE_item_header_title}>
                <div className={styles.findEE_item_title}>
                  <LinkTo href={`${routerPathConstant.user}/${code}`}>
                    <div className={styles.findEE_item_name}>
                      #{id} - {name}
                    </div>
                  </LinkTo>
                </div>
                <div style={{ display: 'flex', height: 32 }}>
                  <div className={styles.findEE_item_action} onClick={(e) => {
                    e.stopPropagation();
                    setIsShowModalApp(true)
                  }}>
                    <span>Liên hệ</span>
                  </div>
                  <div
                    className={styles.findEE_item_icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      getDataGroups()
                      cadidateDetailRef.current = user
                      setIsGroupListModal(true)
                    }}
                  >
                    <img alt="" src="/assets/icons/color/add_user.svg" />
                  </div>
                </div>
              </div>
              {
                wantNewJob ? (
                  <div className={styles.findEE_item_find_job}>
                    Đang tìm việc
                  </div>
                ) : null
              }
            </div>

          </div>
          <div className={styles.findEE_item_main}>
            <div className={styles.findEE_item_information}>
              <div className={styles.findEE_item_info}>
                {birthday && (
                  <div className={`${styles.findEE_item_info_age} ${styles.item_detail}`}>
                    <img src="/assets/icons/color/year.svg" alt="" />
                    {getYear(new Date()) - birthday?.slice(0, 4)} tuổi
                  </div>
                )}
                {
                  gender !== null &&
                  <div className={`${styles.findEE_item_info_gender} ${styles.item_detail}`}>
                    <img src="/assets/icons/color/sex.svg" alt="" />
                    {renderGender(gender)}
                  </div>
                }

                {shortAddress && (
                  <div className={`${styles.findEE_item_info_address} ${styles.item_detail}`}>
                    <img src="/assets/icons/color/location.svg" alt="" />
                    {shortAddress}
                  </div>
                )}
              </div>
              <div className={styles.findEE_item_salary}>
                <img src="/assets/icons/color/money.svg" alt="" />
                <span>Tiền lương: </span>
                <div>
                  {formatNumber(expectSalaryFrom)} - {formatNumber(expectSalaryTo)} VNĐ/{' '}
                  {salaryUnitList.find(unit => unit.id === expectSalaryUnit)?.name}
                </div>
              </div>
              <div className={styles.findEE_item_location}>
                <img src="/assets/icons/color/achievements.svg" alt="" />
                <div className={styles.findEE_item_location_text}>
                  <span>Kinh nghiệm: </span>
                  <span >
                    {renderPosition().length ? renderPosition().join(', ') : 'Không có'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => { setIsShowModalApp(false) }} />}
      {isGroupListModal && (
        <Modal
          wrapClassName="modal-global"
          footer={null}
          visible={isGroupListModal}
          onCancel={(e) => {
            e.stopPropagation();
            setIsGroupListModal(false)
          }}
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
    </div>
  )
}

export default UserSearch;