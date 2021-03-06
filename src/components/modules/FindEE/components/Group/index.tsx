/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
import { ArrowLeftOutlined, ExclamationCircleOutlined, MoreOutlined } from "@ant-design/icons";
import { Col, Dropdown, Input, Menu, message, Modal, Row } from "antd";
import { deleteFjobGroupsApi, getFjobGroupsApi, patchUpdateFjobGroupsApi, postSaveFjobGroupsApi } from "api/client/group";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react"
import Loading from "src/components/elements/Loading/Loading";
import ModalPopup from "src/components/elements/ModalPopup/ModalPopup";
import { configConstant } from "src/constants/configConstant";
import { useAppSelector } from "src/redux";
import { handleError } from "src/utils/helper";

import VerticleGroupList from '../../../CandidateManager/VerticalGroupList'
import styles from "./Group.module.scss";

interface DataGroups {
  id: number
  name: string
  user_id: number
}

const minLengthGroupName = 10
const maxLengthGroupName = 50

const Group = () => {
  const [isViewGroupDetail, setIsViewGroupDetail] = useState(false);
  const [dataGroups, setDataGroups] = useState<DataGroups[]>([]);
  const [currentGroupName, setCurrentGroupName] = useState<string>('')
  const [currentGroupId, setCurrentGroupId] = useState<number>(0)
  const [isModalEditSavedTab, setIsModalEditSavedTab] = useState(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isModalNewSavedTab, setIsModalNewSavedTab] = useState(false)
  const [isModalConfirmDelete, setIsModalConfirmDelete] = useState(false);
  const router = useRouter()
  const dataGroupsRef = useRef([])
  const profile = useAppSelector(state => state.user.profile || {})
  const idGroupDelete = useRef<number>();

  const onClickOptions = (id) => {
    document.getElementById(`options_${id}`)?.click()
  }

  useEffect(() => {
    getDataGroups()
  }, [])

  useEffect(() => {
    setIsViewGroupDetail(!!router.query.group)
  }, [JSON.stringify(router.query)])

  const newGroups = async () => {

    const data = {
      user_id: profile?.id,
      name: currentGroupName,
    }
    setLoading(true)
    try {
      await postSaveFjobGroupsApi(data)
      message.success('Th??m m???i th??nh c??ng')
      getDataGroups()
      setIsModalNewSavedTab(false)
    } catch (error) {
      handleError(error)
      setIsModalNewSavedTab(false)
    }
  }

  const showDeleteConfirm = id => {
    Modal.confirm({
      title: 'B???n c?? mu???n x??a nh??m n??y?',
      icon: <ExclamationCircleOutlined />,
      okText: 'C??',
      okType: 'danger',
      cancelText: 'Kh??ng',
      onOk() {
        deleteGroups(id)
      },
      onCancel() {
        // console.log('Cancel')
      },
    })
  }

  const deleteGroups = async id => {
    setLoading(true)
    try {
      await deleteFjobGroupsApi(id)
      message.success('X??a kh???i nh??m th??nh c??ng')
      getDataGroups()
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false)
    }
  }

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

  const updateGroups = async () => {
    setLoading(true)
    const data = {
      name: currentGroupName,
    }
    try {
      await patchUpdateFjobGroupsApi(currentGroupId, data)
      message.success('C???p nh???t th??nh c??ng')
      setIsModalEditSavedTab(false)
    } catch (error) {
      handleError(error)
    } finally {
      getDataGroups()
    }
  }

  const onClickBack = () => {
    router.push({
      pathname: router.pathname,
      query: {
        tab: router.query.tab
      }
    })
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <>
      {
        isViewGroupDetail ?
          <>
            <div style={{ color: 'var(--primary-color)', cursor: 'pointer' }} onClick={onClickBack}>
              <ArrowLeftOutlined style={{ color: 'var(--primary-color)', marginRight: 5 }} />
              Quay l???i
            </div>
            {
              dataGroups.length && <VerticleGroupList groups={dataGroups} />
            }
          </>
          :
          <div className={styles.groups}>
            <Row gutter={[24, 24]} >
              {
                dataGroups.map(group => (
                  <Col xs={12} md={6} key={group.id} >
                    <div className={`${styles.item} cursor-pointer`}>
                      <div className={styles.container} onClick={
                        () =>
                          router.push({
                            pathname: router.pathname,
                            query: {
                              ...router.query,
                              group: group.id
                            }
                          })
                      }>
                        <div>
                          <img
                            src='/assets/icons/default/group.png' 
                            alt='group_default'
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null; // prevents looping
                              currentTarget.src = configConstant.defaultPicture;
                            }}
                          />
                          <Dropdown
                            overlay={
                              <Menu
                                style={{ width: "120px" }}
                              >
                                <Menu.Item key="0">
                                  <a href="#"
                                    onClick={(event) => {
                                      event.preventDefault()
                                      router.push({
                                        pathname: router.pathname,
                                        query: {
                                          ...router.query,
                                          group: group.id
                                        }
                                      })
                                    }}>Xem chi ti???t</a>
                                </Menu.Item>
                                <Menu.Item key="1">
                                  <a
                                    href="#"
                                    onClick={(event) => {
                                      event.preventDefault()
                                      event.stopPropagation();
                                      onClickOptions(group.id)
                                      setCurrentGroupName(group.name)
                                      setCurrentGroupId(group.id)
                                      setIsModalEditSavedTab(true)
                                    }}
                                  >Ch???nh s???a</a>
                                </Menu.Item>

                                <Menu.Item key="3"
                                >
                                  <a
                                    href="#"
                                    onClick={(event) => {
                                      event.preventDefault()
                                      event.stopPropagation();
                                      onClickOptions(group.id)
                                      idGroupDelete.current = group.id;
                                      setIsModalConfirmDelete(true);
                                    }}
                                  >X??a</a>
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={['click']}
                            arrow
                            placement="bottomRight"

                          >
                            <MoreOutlined id={`options_${group.id}`} className={styles.icon_options} onClick={e => e.stopPropagation()} />
                          </Dropdown>

                        </div>
                        <div className='mt-4'>{group.name}</div>

                      </div>
                    </div>
                  </Col>
                ))
              }
              <Col
                xs={12}
                md={6}
                onClick={() => {
                  setCurrentGroupName('')
                  setIsModalNewSavedTab(true)
                }}
              >
                <div className={`${styles.item} cursor-pointer`}>
                  <div className={styles.container}>
                    <div>
                      <img src='/assets/images/icon/plus.png' alt='group_default' />
                    </div>
                    <div
                      className='mt-4 text-primary'
                    >
                      Th??m nh??m m???i
                    </div>

                  </div>
                </div>

              </Col>
            </Row>
          </div>
      }
      <Modal
        wrapClassName="modal-global"
        footer={null}
        visible={isModalNewSavedTab}
        onCancel={() => setIsModalNewSavedTab(false)}
      >
        <div className={`modal-body  ${styles.candidate_modal_accept}`}>
          <div className="modal-title">T???o nh??m m???i</div>
          <Input
            value={currentGroupName}
            onChange={e => setCurrentGroupName(e.target.value)}
            style={{ borderRadius: '6px', margin: '20px 0px', height: '44px' }}
            maxLength={configConstant.maxLengthInput}
            placeholder='Nh??m m???i 1'
          />
          {!!currentGroupName.length && currentGroupName.trim().length < minLengthGroupName && <div style={{ color: "var(--red-color) " }}>T??n nh??m t???i thi???u 10 k?? t???</div>}
          {!!currentGroupName.length && currentGroupName.trim().length > maxLengthGroupName && <div style={{ color: "var(--red-color) " }}>T??n nh??m t???i ??a 50 k?? t???</div>}

          <div className="modal-action">
            <button
              onClick={() => setIsModalNewSavedTab(false)}
              type="button"
              className={styles.candidate_modal_accept_cancel}
            >
              Hu???
            </button>
            <button
              onClick={newGroups}
              type="button"
              className={styles.candidate_modal_accept_ok}
              disabled={currentGroupName.trim().length < minLengthGroupName || currentGroupName.trim().length > maxLengthGroupName}
            >
              Th??m
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        wrapClassName="modal-global"
        footer={null}
        visible={isModalEditSavedTab}
        onCancel={() => setIsModalEditSavedTab(false)}
      >
        <div className={`modal-body  ${styles.candidate_modal_accept}`}>
          <div className="modal-title">Ch???nh s???a t??n</div>

          <Input
            value={currentGroupName}
            onChange={e => setCurrentGroupName(e.target.value)}
            style={{ borderRadius: '6px', margin: '20px 0px', height: '50px' }}
          />

          {currentGroupName.trim().length < minLengthGroupName && <div style={{ color: "var(--red-color) " }}>T??n nh??m t???i thi???u 10 k?? t???</div>}
          {currentGroupName.trim().length > maxLengthGroupName && <div style={{ color: "var(--red-color) " }}>T??n nh??m t???i ??a 50 k?? t???</div>}
          <div className={styles.candidate_modal_accept_action}>
            <button
              disabled={currentGroupName.trim().length < minLengthGroupName || currentGroupName.trim().length > maxLengthGroupName}
              onClick={updateGroups}
              type="button"
              className={styles.candidate_modal_accept_ok}
            >
              C???p nh???t
            </button>
            <button
              onClick={() => setIsModalEditSavedTab(false)}
              type="button"
              className={styles.candidate_modal_accept_cancel}
            >
              Hu???
            </button>
          </div>
        </div>
      </Modal>
      <ModalPopup
        positionAction="center"
        title="Xo?? nh??m"
        isConfirmBtn={false}
        isCancelBtn={false}
        transition='move-up'
        visible={isModalConfirmDelete}
        titleStyle={{ color: "red" }}
      >
        <div>
          <div className='text-center mb-3'>B???n c?? ch???c ch???n mu???n xo?? nh??m <span style={{ fontWeight: "bold" }}>{dataGroups.find(item => item.id === idGroupDelete.current)?.name}</span> ?</div>
          <div style={{ display: 'flex', marginTop: 20 }}>
            <div
              onClick={() => setIsModalConfirmDelete(!isModalConfirmDelete)}
              style={{ width: '100%', textAlign: 'center', border: '1px solid #6E00C2', margin: '0 10px', padding: '8px 0', color: '#6E00C2', borderRadius: 10, fontWeight: 'bold', cursor: "pointer" }}>
              Hu???
            </div>
            <div
              onClick={() => {
                setIsModalConfirmDelete(!isModalConfirmDelete)
                deleteGroups(idGroupDelete.current)
              }}
              style={{ width: '100%', textAlign: 'center', backgroundColor: '#E6161A', margin: '0 10px', padding: '8px 0', color: 'white', borderRadius: 10, fontWeight: 'bold', cursor: "pointer" }}>
              Xo??
            </div>
          </div>
        </div>
      </ModalPopup>
    </>
  )
}

export default Group;