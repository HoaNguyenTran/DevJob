import React from 'react'

import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import AccountInformation from 'src/components/modules/AccountInformation'
import { routerPathConstant } from 'src/constants/routerConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { NextSeo } from 'next-seo'

const AccountInformationPage = (): JSX.Element =>
  <>
    <NextSeo title="Thông tin tài khoản" description="Thông tin tài khoản" />
    <AccountInformation />
  </>



export default AccountInformationPage

export const getServerSideProps = async ctx => {
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: {},
    }
  }
  // setUserRoleCookieSSR({ ctx, role: roleConstant.EE.key })
  return { props: {} }
}