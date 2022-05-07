import React, { FC, useEffect, useState } from 'react'

import { Button, Spin } from 'antd'
import { getProfileApi, patchUserInfomationApi } from 'api/client/user'
import { useTranslation } from 'react-i18next'
import { configConstant } from 'src/constants/configConstant'

import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { LoadingOutlined } from '@ant-design/icons'
import { handleError } from 'src/utils/helper'
import { setUserRoleCookieCSR } from 'src/utils/storage'
import defaultConstant from 'src/constants/defaultConstant'
import styles from './step3.module.scss'

interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}

// choose role
const StepThreeSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const { t } = useTranslation()
  const [dataUser, setDataUser] = useState<any>({})
  const [loadingEE, setLoadingEE] = useState<boolean>(false)
  const [loadingER, setLoadingER] = useState<boolean>(false)
  const profile = useAppSelector(state => state.user.profile || {})

  const dispatch = useAppDispatch()
  useEffect(() => {
    const updateDataUser = async () => {
      const userCode = localStorage.getItem(storageConstant.localStorage.userCode)
      if (userCode) {
        try {
          const { data } = await getProfileApi(userCode)
          setDataUser(data.data)
        } catch (error) {
          console.error(error)
        }
      }
    }
    updateDataUser()
  }, [])

  const handleSubmit = async (role: string) => {
    if (role === roleConstant.EE.name) {
      setLoadingEE(true)
    } else {
      setLoadingER(true)
    }
    try {
      // update role user in server
      const updateData = await patchUserInfomationApi(
        {
          ...dataUser,
          // isEmployee: data.isEmployee,
          // isEmployer: data.isEmployer,
          name: 'Người dùng fjob',
          avatar: profile.avatar ?? defaultConstant.defaultAvatarUser,
          isEmployee: 1,
          isEmployer: 1,
          isPersonal: 0,
          expectSalaryFrom: 1,
          expectSalaryTo: 10,
        },
        dataUser.code,
      )
      // update info user in redux store
      dispatch(getProfileRequest({ userCode: updateData.data.data.code }))
      // save step in localstorage
      const saveLocal = {
        status: 0,
        step: 4,
        role,
        code: profile.code
      }

      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))

      setUserRoleCookieCSR({ role })
      getCurrentStep(4)
      if (role === roleConstant.EE.name) {
        setLoadingEE(false)
      } else {
        setLoadingER(false)
      }
    } catch (error) {
      handleError(error)
      if (role === roleConstant.EE.name) {
        setLoadingEE(false)
      } else {
        setLoadingER(false)
      }
    }
  }

  return (
    <div className={styles.main}>
      <p className={styles.main_title}>Xác nhận tạo tài khoản</p>
      <p className={styles.main_text}>
        Chúc mừng bạn đã tạo tài khoản thành công.
        <br /> Xin vui lòng hoàn thiện một số bước sau để bắt đầu sử dụng dịch vụ.
      </p>
      <Button
        disabled={loadingER || loadingEE}
        className={styles.btn}
        htmlType="submit"
        onClick={() => handleSubmit(roleConstant.EE.name)}
      >
        {loadingEE ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          t('Người tìm việc')
        )}
      </Button>
      <Button
        disabled={loadingER || loadingEE}
        className={styles.btn}
        htmlType="submit"
        onClick={() => handleSubmit(roleConstant.ER.name)}
      >
        {loadingER ? (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        ) : (
          t('Nhà tuyển dụng')
        )}
      </Button>
    </div>
  )
}

export default StepThreeSignUp
