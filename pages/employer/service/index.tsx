import { NextSeo } from 'next-seo'
import React from 'react'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import Service from 'src/components/modules/Service/Service'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'

export default function ServicePage(): JSX.Element {
  return (
    <>
      <NextSeo title="Dịch vụ của tôi" description="Dịch vụ của tôi" />
      <LayoutER keyDefault={routerPathConstant.erService} childComp={<Service />} />
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