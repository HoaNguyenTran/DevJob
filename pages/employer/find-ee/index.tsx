import React, { useState } from 'react'
import FindEE from 'src/components/modules/FindEE/FindEE'
import { calcTranslateX, calcWidthTranslateX } from 'src/utils/helper'
import { roleConstant } from 'src/constants/roleConstant'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import Group from 'src/components/modules/FindEE/components/Group'
import styles from "./FindEE.module.scss";


export default function FindEEPage(): JSX.Element {
  const [tab, setTab] = useState(0)
  const SCREEN = useWindowDimensions();
  
  return (
    <>
      <NextSeo title="Tìm kiếm ứng viên" description="Tìm kiếm ứng viên" />
      <div className={styles.main}>
        <div className={styles.main_navigator}>
          <div className={styles.navigator_tab}>
            <div className={styles.navigator_overlay}
              style={{
                transform: `translateX(${calcTranslateX(SCREEN.width, tab)}px)`,
                width: `${calcWidthTranslateX(SCREEN.width)}px`
              }} />
            <div className={styles.tab_tab} onClick={() => { setTab(0) }}>
              <span>
                Tìm kiếm ứng viên
              </span>
            </div>
            <div className={styles.tab_tab} onClick={() => { setTab(1) }}>
              <span>
                Danh sách ứng viên đã lưu
              </span>
            </div>
          </div >
        </div >
        <div className={styles.service_main}>
          {tab === 0
            ? <FindEE />
            : <Group />}
        </div>
      </div>

    </>
  )
}

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: {},
    }
  }

  setUserRoleCookieSSR({ ctx, role: roleConstant.ER.key })
  return { props: {} }
}
