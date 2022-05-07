import React from 'react'
import { roleConstant } from 'src/constants/roleConstant'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import DashboardER from 'src/components/modules/DashboardER/DashboardER'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'

export default function DashboardERPage(): JSX.Element {
  return (
    <>
      <NextSeo title="Bảng điều khiển Nhà tuyển dụng" description="Bảng điều khiển Nhà tuyển dụng" />
      <LayoutER keyDefault={routerPathConstant.erDashboard} childComp={<DashboardER />} />
      {/* <DashboardER /> */}
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
