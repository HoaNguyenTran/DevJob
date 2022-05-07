import React from 'react'
import { roleConstant } from 'src/constants/roleConstant'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'
import Enterprise from 'src/components/modules/Enterprise/Enterprise/Enterprise'

const EnterprisePage = (): JSX.Element => (
    <>
      <NextSeo title=" Hồ sơ doanh nghiệp" description=" Hồ sơ doanh nghiệp" />
      <Enterprise />
    </>
)

export default EnterprisePage

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
