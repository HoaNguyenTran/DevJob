import React from 'react'
import { roleConstant } from 'src/constants/roleConstant'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import ReferFriendComponent from 'src/components/modules/ReferFriend'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'

export default function ReferFriend(props): JSX.Element {
  return (
    <>
      <NextSeo title="Bảng điều khiển Nhà tuyển dụng" description="Bảng điều khiển Nhà tuyển dụng" />
      <LayoutER keyDefault={routerPathConstant.referFriend} childComp={<ReferFriendComponent tab={props.tab} code={props.code} />} />
      {/* <DashboardER /> */}
    </>
  )
}

export async function getServerSideProps(ctx) {
  const tab = ctx.query?.tab || 0
  const code = ctx.query?.code || ""
  
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: { tab, code },
    }
  }
  setUserRoleCookieSSR({ ctx, role: roleConstant.ER.key })
  return { props: { tab, code } }
}
