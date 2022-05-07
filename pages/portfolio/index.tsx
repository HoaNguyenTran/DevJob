import { NextSeo } from 'next-seo'
import React from 'react'
import Portfolio from 'src/components/modules/Portfolio/Portfolio'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'

const PortfolioCvPage = (): JSX.Element =>
  <>
    <NextSeo
      title="Hồ sơ cá nhân"
      description="Hồ sơ cá nhân"
    />
    <Portfolio />
  </>

export default PortfolioCvPage

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