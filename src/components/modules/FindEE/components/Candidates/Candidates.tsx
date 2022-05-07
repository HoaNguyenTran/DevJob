import React, { useRef, useState } from 'react'
import { Input, message, Modal, Pagination, Rate } from 'antd'
import { useAppSelector } from 'src/redux'
import Link from 'src/components/elements/LinkTo'
import { formatNumber, getErrorText, handleError, removeAccents } from 'src/utils/helper'
import { getYear } from 'date-fns'
import { SearchOutlined } from '@ant-design/icons'
import { routerPathConstant } from 'src/constants/routerConstant'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import { getFjobGroupsApi, postAddUserGroupApi } from 'api/client/group'
import styles from './Candidates.module.scss'

enum Gender {
  'Khác',
  'Nam',
  'Nữ',
}

interface Props {
  dataSSR: any;
  handleSearchEE?: (number) => void
}

const Candidates = ({ dataSSR, handleSearchEE }: Props) => {
  
  const renderGender = gender => Gender[gender]
  const { FjobCategory: categorieList = [], WageUnit: salaryUnitList = [] } = useAppSelector(state => state.initData.data)

  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const [isGroupListModal, setIsGroupListModal] = useState(false)
  const [dataGroups, setDataGroups] = useState<any[]>([])
  const dataGroupsRef = useRef([])
  const cadidateDetailRef = useRef<any>({})

  const getDataGroups = async () => {
    try {
      const { data } = await getFjobGroupsApi()
      dataGroupsRef.current = data.data
      setDataGroups(data.data)
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

  const addItemIntoGroup = async item => {
    try {
      const resData = await postAddUserGroupApi({
        'userId': cadidateDetailRef.current?.id,
        'groupId': item?.id,
      })
      
      message.success(resData.data.message)
    } catch (e: any) {
      message.error(getErrorText(e))
    } finally {
      setIsGroupListModal(false)
    }
  }

  return (
    <div className={styles.findEE_main}>
      <div className={styles.findEE_content}>
        {dataSSR?.data ? (
          dataSSR?.data.map(item => {
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
            } = item

            const renderPosition = () => {
              if (!experiences.length) return []
              const arrPosition: any[] = []
              experiences.filter(exp =>
                arrPosition.push(categorieList.find(cate => cate.id === exp.categoryId)?.name),
              )
              return arrPosition
            }

            return (
              <div className={styles.findEE_item} key={id}>
                <div className={styles.findEE_item_header}>
                  <Link href={`${routerPathConstant.user}/${code}`}>
                    <div className={styles.findEE_item_title}>
                      <img className={styles.findEE_item_avt} src={avatar} alt="" />
                      <div>
                        <div className={styles.findEE_item_name}>
                          #{id} - {name}
                        </div>
                        <Rate disabled value={userRating} style={{ fontSize: 16 }} />
                      </div>
                    </div>
                  </Link>
                  <div
                    className={styles.findEE_item_icon}
                    onClick={() => {
                      getDataGroups()
                      cadidateDetailRef.current = item
                      setIsGroupListModal(true)
                    }}
                  >
                    <img alt="" src="/assets/icons/color/add_user.svg" />
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
                      <span>Kinh nghiệm: </span>
                      <div className={styles.findEE_item_location_text}>
                        {renderPosition().length ? renderPosition().join(', ') : 'Không có'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.findEE_item_action}>
                  <div className={styles.findEE_item_action_btn}>
                    <button type="button" onClick={() => setIsShowModalApp(true)}>
                      <img alt="" src="/assets/icons/color/phone.svg" />
                      <span>Liên hệ</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
            <></>
        )}
      </div>
      {dataSSR?.meta && (
        <div className={styles.findEE_pagi}>
          <Pagination
            total={dataSSR?.meta?.pagination?.total}
            current={dataSSR?.meta?.pagination?.currentPage}
            onChange={num => handleSearchEE?.(num)}
            className={styles.findEE_pagi}
            hideOnSinglePage
          />
        </div>
      )}
      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
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
    </div>
  )
}

export default Candidates
