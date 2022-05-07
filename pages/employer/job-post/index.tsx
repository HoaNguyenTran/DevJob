import React from 'react'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import { roleConstant } from 'src/constants/roleConstant'
import { NextSeo } from 'next-seo'

import JobPost from 'src/components/modules/JobPost/JobPost'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'

const JobPostPage = (): JSX.Element => (
  <>
    <NextSeo title="Quản lý tin đăng" description="Quản lý tin đăng" />
    <LayoutER keyDefault={routerPathConstant.erJobPost} childComp={<JobPost />} />
  </>
)

export default JobPostPage
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
