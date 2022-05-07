import { NextSeo } from 'next-seo'
import React from 'react'
import Payment from 'src/components/elements/Payment/Payment'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'


export default function PaymentPage(): JSX.Element {
  return (
    <>
      <NextSeo title="Cửa hàng kim cương" description="Cửa hàng kim cương" />
      <LayoutER keyDefault={routerPathConstant.erPayment} childComp={<Payment />} />
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
