import React, { FC } from 'react'

import { Button, message, Modal, Tabs } from 'antd'
import { deleteCompanyApi } from 'api/client/company'
import { patchUserInfomationApi } from 'api/client/user'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'

import {
  AppleOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons'

import InfoCompany from './InfoCompany'
import ListCustomer from './ListCustomer'
import styles from './tabprofile.module.scss'

enum Role {
  'Quản trị viên',
  'Nhân viên',
}
const TabProfileBusiness: FC<{
  data: CompanyGlobal.CompanyDetail
  getChangeCompany: (companyId) => void
  handleChangeAvatarCompany: (companyId) => void
}> = ({ data, getChangeCompany, handleChangeAvatarCompany }) => {
  const { confirm } = Modal
  const t = useTranslation()
  const { TabPane } = Tabs
  const router = useRouter()
  const profile = useAppSelector(state => state.user.profile || {})
  const dispatch = useAppDispatch()

  function showDeleteConfirm() {
    confirm({
      title: 'Xóa công ty',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa công ty này?',
      okText: 'Có',
      okType: 'danger',
      cancelText: 'Không',
      async onOk() {
        try {
          await deleteCompanyApi(data.id)
          message.success('Xóa thành công')
          router.reload()
        } catch (error) {
          message.error('Không xóa được công ty')
        }
      },
      onCancel() {
        // console.log('Không')
      },
    })
  }

  function showConvertConfirm() {
    confirm({
      title: 'Chuyển công ty',
      icon: <CheckOutlined style={{ color: 'green' }} />,
      content: 'Bạn có muốn chuyển sang công ty này?',
      okText: 'Có',
      okType: 'primary',
      cancelText: 'Không',
      async onOk() {
        try {
          await patchUserInfomationApi(
            {
              companyId: data.id,
            },
            profile.code,
          )
          dispatch(getProfileRequest({ userCode: profile.code }))
          message.success('Chuyển thành công')
          getChangeCompany(data.id)
        } catch (error) {
          message.error('Không chuyển được công ty')
        }
      },
      onCancel() {
        // console.log('Không')
      },
    })
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_top}>
        <div className={styles.main_top_role}>
          <span style={{ color: 'rgb(57, 141, 42)' }}>{Role[data.userRole - 1]}</span>
        </div>
        {/* {data.userRole !== 0 && profile.companyId !== data.id && (
          <Button onClick={() => showConvertConfirm()} className={styles.main_top_btn_convert}>
            Chuyển công ty
          </Button>
        )} */}
        {data.userRole === 1 && data.adminUserId === profile.id && (
          <Button onClick={() => showDeleteConfirm()} className={styles.main_top_btn_remove}>
            Xóa công ty
          </Button>
        )}
      </div>

      <Tabs defaultActiveKey="1" className={styles.main_tab} destroyInactiveTabPane>
        <TabPane
          tab={
            <span>
              <AppleOutlined />
              Hồ sơ doanh nghiệp
            </span>
          }
          key="1"
          style={{ width: '100%' }}
        >
          <InfoCompany handleChangeAvatarCompany={handleChangeAvatarCompany} data={data} />
        </TabPane>
        <TabPane

          tab={
            <span >
              <TeamOutlined />
              Danh sách nhân sự
            </span>
          }

          key="2"
        >
          <ListCustomer dataUsers={data} />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default TabProfileBusiness
