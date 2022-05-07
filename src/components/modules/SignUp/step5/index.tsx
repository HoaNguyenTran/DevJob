import React, { FC, useEffect, useState } from 'react'

import { Button, Cascader, message, Spin } from 'antd'
import { getProfileApi, postFavCatsApi } from 'api/client/user'
import { useTranslation } from 'react-i18next'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { createCategories, handleError } from 'src/utils/helper'

import styles from './step5.module.scss'

interface GetCurrentStep {
  getCurrentStep: (step: number) => void
}
const StepFiveSignUp: FC<GetCurrentStep> = ({ getCurrentStep }) => {
  const { t } = useTranslation()
  const [dataUser, setDataUser] = useState<any>({})
  const [userFavouriteJob, setUserFavouriteJob] = useState<number[]>([])

  const masterData = useAppSelector(state => state.initData.data)
  const profile = useAppSelector(state => state.user.profile || {})

  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const [cascaderValues, setCascaderValues] = useState<any>()
  const [userRole, setUserRole] = useState(roleConstant.EE.name)
  
  useEffect(() => {
    const userRoleRaw = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (userRoleRaw) {
      setUserRole(JSON.parse(userRoleRaw).role)
    }
  }, [])
  const categoryList = createCategories(masterData.FjobCategory)

  const onFavouriteJobChange = (value) => {
    if (value?.length > 5) {
      message.error('Chỉ được chọn tối đa 5 ngành/nghề')
      value.pop()
    }
    setUserFavouriteJob(value)
  }

  useEffect(() => {
    const updateDataUser = async () => {
      if (profile !== null) {
        setDataUser(profile)
      } else {
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
    }
    updateDataUser()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    const userId = dataUser.id
    const userCode = dataUser.code
    const catIds = userFavouriteJob
    const payload: Auth.UserMultipleFavouriteJobPayload = { userId, catIds }
    try {
      await postFavCatsApi(payload)
      dispatch(getProfileRequest({ userCode }))
      const saveLocal = {
        status: 1,
        step: 6,
        role: userRole,
        code: profile.code
      }
      localStorage.setItem(storageConstant.localStorage.signupProcess, JSON.stringify(saveLocal))
      getCurrentStep(6)
      setLoading(false)
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.main}>
      {/* <p className="signup-label">{t('signup.titleFavCats')}</p> */}
      <p>
        {t('Vui lòng chọn ngành nghề quan tâm')}
      </p>
      {/* {userRole === 'EE' && ( */}
      <Cascader
        size="large"
        className={styles.main_cascader}
        multiple
        allowClear
        options={categoryList}
        placeholder="Chọn ngành nghề"
        showSearch
        value={cascaderValues}
        onChange={(value: any) => {
          if ((value.length > 0 && value[value.length - 1].length === 2) || value.length === 0) {
            onFavouriteJobChange(Array.from(value.map(item => item[item.length - 1])))
            setCascaderValues(value)
          }

          if (value.length > 5) {
            value.pop()
          }
        }}
      />
      <Button
        disabled={loading}
        className={styles.btn}
        htmlType="submit"
        onClick={() => handleSubmit()}
      >
        {loading ? <Spin style={{ color: 'white' }} /> : t('Tiếp tục')}
      </Button>
    </div>
  )
}
export default StepFiveSignUp
