import { EnterOutlined } from '@ant-design/icons'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { destroyCookie } from 'nookies'
import { useAppDispatch } from 'src/redux'
import { getLogoutRequest } from 'src/redux/user'
import { routerPathConstant } from 'src/constants/routerConstant'

import { storageConstant } from 'src/constants/storageConstant'
import { removeCookieCSR, removeLocalStorageWhenLogout } from 'src/utils/storage'
import styles from './Signout.module.scss'

export default function SignoutPage(): JSX.Element {
  const { t } = useTranslation()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    router.push(routerPathConstant.signIn)

    dispatch(getLogoutRequest())
    removeLocalStorageWhenLogout()
    removeCookieCSR(storageConstant.cookie.accessToken)
    removeCookieCSR(storageConstant.cookie.userRole)
    // Remove accessToken in stale version
    destroyCookie(null, 'accessToken')
  }

  return (
    <div className={styles.signout}>
      <div className={styles.main}>
        <div className={styles.text}>{t('signout.confirmLogoutText')}</div>
        <div className={styles.btn}>
          <button type="button" onClick={handleLogout}>
            {t('signout.yesBtn')}
          </button>
        </div>
        <div className={styles.subtext}>
          <div className={styles.subtext_inner} onClick={() => router.push('/')}>
            <EnterOutlined />
            {t('signout.returnHomepage')}
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  return {
    props: {},
  }
}
