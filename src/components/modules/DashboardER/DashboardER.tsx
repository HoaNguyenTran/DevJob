import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import HeaderInfo from './components/HeaderInfo/HeaderInfo'
import Main from './components/Main/Main'
import Notify from './components/Notify/Notify'
import Report from './components/Report/Report'



import styles from './DashboardER.module.scss'

const Preferential = dynamic(() => import('./components/Preferential/Preferential'))
const Blog = dynamic(() => import('./components/Blog/Blog'))

const DashboardER = (): JSX.Element => {

  const router = useRouter()
  const profile = useAppSelector(state => state.user.profile || {})

  const checkFinishSignUp = async () => {
    const rawProcess = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (rawProcess) {
      const infoProcess = JSON.parse(rawProcess)
      if (!infoProcess.status && infoProcess.code === profile.code) {
        router.replace(routerPathConstant.signUp)
      } else {
        localStorage.removeItem(storageConstant.localStorage.signupProcess)
      }
    }
  }

  useEffect(() => {
    checkFinishSignUp()
  }, [])

  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboard_wrap}>
        <HeaderInfo />
        <div className={styles.dashboard_information}>
          <div className={styles.info_report}>
            <Report />
          </div>
          <div className={styles.info_notify}>
            <Notify />
          </div>
        </div>

        <Main />
        <Blog />
        <Preferential />
      </div>
    </div>
  )
}


export default DashboardER
