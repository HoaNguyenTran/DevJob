import { NextSeo } from 'next-seo'
import React from 'react'
import HomePage from 'src/components/modules/HomePage/HomePage'
import { roleConstant } from 'src/constants/roleConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'

const Home = (): JSX.Element => (
  <>
    <NextSeo title="Trang chủ" description="Trang chủ" />
    <HomePage />
  </>
)

export default Home

export const getServerSideProps = async ctx => {
  setUserRoleCookieSSR({ ctx, role: roleConstant.EE.key })
  return { props: {} }
}
