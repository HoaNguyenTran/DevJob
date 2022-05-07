import React from 'react'
import { roleConstant } from 'src/constants/roleConstant'
import ReferFriendComponent from 'src/components/modules/ReferFriend'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'

export default function ReferFriend(): JSX.Element {
  return (
    <>
      <NextSeo title="Giới thiệu bạn bè" description="Giới thiệu bạn bè" />
      <ReferFriendComponent />
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
  setUserRoleCookieSSR({ ctx, role: roleConstant.EE.key })
  return { props: {} }
}
