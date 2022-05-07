import React from 'react'
import { NextSeo } from 'next-seo'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import Transaction from 'src/components/modules/Transaction/Transaction'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { roleConstant } from 'src/constants/roleConstant'

const TransactionPage = (): JSX.Element => (
  <>
    <NextSeo title="Lịch sử giao dịch" description="Lịch sử giao dịch" />
    <LayoutER keyDefault={routerPathConstant.erTransaction} childComp={<Transaction />} />
  </>
)

export default TransactionPage

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
