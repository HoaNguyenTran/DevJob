import React from 'react'
import { roleConstant } from 'src/constants/roleConstant'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import GiftComponent from 'src/components/modules/Gift'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'

export default function Gift(): JSX.Element {
  return (
    <>
      <NextSeo title="Bảng điều khiển Nhà tuyển dụng" description="Bảng điều khiển Nhà tuyển dụng" />
      <LayoutER keyDefault={routerPathConstant.gift} childComp={<GiftComponent />} />
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
