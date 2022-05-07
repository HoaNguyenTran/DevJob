import React from 'react'
import { NextSeo } from 'next-seo'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import { roleConstant } from 'src/constants/roleConstant'
import CandidateManager from 'src/components/modules/CandidateManager/CandidateManager'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { routerPathConstant } from 'src/constants/routerConstant'

export default function CandidateManagerPage(): JSX.Element {
  return (
    <>
      <NextSeo title="Quản lý ứng viên" description="Quản lý ứng viên" />
      <LayoutER keyDefault={routerPathConstant.erCandidate} childComp={<CandidateManager />} />
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
