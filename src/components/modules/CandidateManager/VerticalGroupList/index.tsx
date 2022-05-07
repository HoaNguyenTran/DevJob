/* eslint-disable no-param-reassign */
import { QuestionCircleOutlined, RightOutlined } from '@ant-design/icons'
import { Col, message, Popconfirm, Rate, Row } from 'antd'
import { deleteUserGroupApi, getUserGroupsApi } from 'api/client/group'
import { getYear } from 'date-fns'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { configConstant } from 'src/constants/configConstant'
import jobConstant from 'src/constants/jobConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { convertObjectToArraytData, getObjectOfArray, handleError } from 'src/utils/helper'
import styles from './VerticalGroupList.module.scss'

interface IVerticalGroupList {
  groups: any
}

const VerticalGroupList: FC<IVerticalGroupList> = ({ groups = [] }) => {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [LoadingCandidate, setLoadingCandidates] = useState(false);
  const [dataGroups, setDataGroups] = useState(groups);
  const [dataCandidates, setDataCandidates] = useState([]);

  const [isShowModalApp, setIsShowModalApp] = useState(false);
  const [isModalDeleteCandidate, setIsModalDeleteCandidate] = useState(false);

  const idUserDelete = useRef<any>();

  const initData = useSelector((state: any) => state.initData) || {};
  const { FjobExperience, FjobCategory } = initData.data || {}

  const getCandidatesByGroup = async (id) => {
    setLoadingCandidates(true)
    try {
      const { data } = await getUserGroupsApi(id)
      setDataCandidates(data.data)
    } catch (error) {
      handleError(error)
    } finally {
      setLoadingCandidates(false)

    }
  }

  const activeItemGroup = (id) => {
    const newDataGroups = dataGroups.map(item => ({
      ...item,
      isActive: item.id === id
    }));
    setDataGroups(newDataGroups)
  }

  const onClickGroup = (id) => {

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        group: id
      }
    })
  }

  const getGenderText = (genderKey) => getObjectOfArray(genderKey, "key", convertObjectToArraytData(jobConstant.genderName)).value

  const getCategoryText = (data) =>(FjobCategory.find(item => item.id === data.categoryId) || {}).name 

  const getFavCategoryText = (data) =>(FjobCategory.find(item => item.id === data) || {}).name 

  const confirmDelete = async candidate => {
    try {
      await deleteUserGroupApi(candidate.userGroupId)
      message.success('Xóa thành công')
      getCandidatesByGroup(candidate.groupId)
    } catch (e) {
      handleError(e)
    }
  }

  useEffect(() => {
    if (router.query.group) {
      getCandidatesByGroup(Number(router.query.group));
      activeItemGroup(Number(router.query.group));
    }
  }, [JSON.stringify(router.query)])
  return (
    <div className={styles.verticle_group_list}>

      <div className={styles.container}>

        <Row className='w-100'>
          <Col span={6}>
            <div className={styles.group_list}>
              {
                dataGroups.map((item, index) =>
                  <div
                    key={index}
                    onClick={() => onClickGroup(item.id)}
                    className={`${styles.item} d-flex justify-content-between align-items-center w-100 ${item.isActive ? styles.item_active : ""}`}
                  >
                    <div className='d-flex align-items-center'>
                      <img src='/assets/icons/default/group.png' alt='group-default' />
                      <div className={`${styles.name} ml-2`}>{item.name || ""}</div>
                    </div>
                    <div>
                      <RightOutlined />
                    </div>
                  </div>
                )
              }

            </div>
          </Col>

          <Col span={18}>
            {
              dataCandidates.length ?
                <div className={styles.user_list}>
                  <div className={styles.container}>
                    {
                      dataCandidates.map((item: any, index) =>
                        <Col
                          key={index}
                          className={`candidate ${styles.candi}`} >
                          <div className={styles.header}>
                            <Link href={`${routerPathConstant.user}/${item.code}`}>
                              <div className={styles.title}>
                                <img
                                  className={styles.avt}
                                  src={item.avatar || '/assets/images/avatar/avt.jpeg'}
                                  width={64}
                                  height={64}
                                  alt=""
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = configConstant.defaultPicture;
                                  }}
                                />
                                <div>
                                  <div className={styles.name}>
                                    #{item.id}-{item.name}
                                  </div>
                                  <Rate disabled value={1} defaultValue={4} />
                                </div>
                              </div>
                            </Link>
                            <div
                              className={styles.icon}
                              onClick={() => {
                                idUserDelete.current = item
                                setIsModalDeleteCandidate(true)
                              }}
                            >
                              <img 
                                alt="" 
                                src="/assets/icons/color/remove_user.svg" 
                                onError={({ currentTarget }) => {
                                  currentTarget.onerror = null; // prevents looping
                                  currentTarget.src = configConstant.defaultPicture;
                                }}
                              />
                            </div>
                          </div>
                          <div className={styles.main}>
                            <div className='w-100'>
                              <div className={styles.information}>
                                <Row>
                                  <Col span={24}>
                                    <div className={`${styles.info} `}>
                                      {item.birthday && (
                                        <div className={styles.age}>
                                          <img src="/assets/icons/color/year.svg" alt="" />
                                          {getYear(new Date()) - moment(item.birthday).year()} tuổi
                                        </div>
                                      )}
                                      {
                                        item.gender !== null &&
                                        <div className={styles.gender}>
                                          <img src="/assets/icons/color/sex.svg" alt="" />
                                          {getGenderText(item.gender)}
                                        </div>
                                      }

                                      {item.shortAddress && (
                                        <div className={styles.gender}>
                                          <img src="/assets/icons/color/location.svg" alt="" />
                                          {item.shortAddress || ""}
                                        </div>
                                      )}
                                    </div>
                                    <div className={`${styles.item} mt-2`}>
                                      <img src="/assets/icons/color/achievements.svg" alt="" />
                                      <span>Kinh nghiệm: </span>
                                      {item.experiences?.length ?
                                        item.experiences.map((data, i) =>
                                          <span className='p-0 font-weight-normal' key={i}>{getCategoryText(data)} {item.experiences.length - 1 !== i ? ", " : ""}</span>
                                        )
                                        :
                                        "Chưa có"}
                                    </div>
                                    <div className={`${styles.item} mt-2 d-flex align-items-center`}>
                                      <img src="/assets/icons/color/package.svg" alt="" />
                                      <span>Ngành nghề quan tâm: </span>
                                      <div>
                                        {
                                          item.favCats?.length ?
                                            item.favCats.map((data, i) =>
                                              <span key={i} className={`${styles.tag} ml-2`}>
                                                {getFavCategoryText(data)}
                                              </span>
                                            ) : "Chưa có"
                                        }
                                      </div>
                                    </div>
                                    <button className={styles.btn_contact} type='button' onClick={() => setIsShowModalApp(true)}>
                                      <img src='/assets/icons/color/call_white.png' alt='call' />
                                      <span>Liên hệ</span>
                                    </button>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        </Col>
                      )
                    }
                  </div>

                </div>
                : <div className='text-center'>Không có ứng viên</div>
            }
          </Col>
        </Row>
        {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
        <ModalPopup
          positionAction="center"
          title="Xoá nhóm"
          isConfirmBtn={false}
          isCancelBtn={false}
          transition='move-up'
          visible={isModalDeleteCandidate}
          titleStyle={{ color: "red" }}
        >
          <div>
            <div className='text-center mb-0'>Bạn có chắc chắn muốn xoá <span style={{ fontWeight: "bold" }}>{idUserDelete.current?.name}</span> ra khỏi nhóm?</div>
            <div style={{ display: 'flex', marginTop: "30px" }}>
              <div
                onClick={() => setIsModalDeleteCandidate(!isModalDeleteCandidate)}
                style={{ width: '100%', textAlign: 'center', border: '1px solid #6E00C2', margin: '0 10px', padding: '8px 0', color: '#6E00C2', borderRadius: 10, fontWeight: 'bold', cursor: "pointer" }}>
                Huỷ
              </div>
              <div
                onClick={() => {
                  setIsModalDeleteCandidate(!isModalDeleteCandidate)
                  confirmDelete(idUserDelete.current)
                }}
                style={{ width: '100%', textAlign: 'center', backgroundColor: '#E6161A', margin: '0 10px', padding: '8px 0', color: 'white', borderRadius: 10, fontWeight: 'bold', cursor: "pointer" }}>
                Xoá
              </div>
            </div>
          </div>
        </ModalPopup>
      </div>
    </div>
  )

}

export default VerticalGroupList
