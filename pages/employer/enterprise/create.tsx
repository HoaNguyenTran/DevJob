import { NextSeo } from 'next-seo';
import React from 'react'
import CreateEnterprise from 'src/components/modules/Enterprise/CreateEnterprise/CreateEnterprise';
import { roleConstant } from 'src/constants/roleConstant';
import { routerPathConstant } from 'src/constants/routerConstant';
import { storageConstant } from 'src/constants/storageConstant';
import { setUserRoleCookieSSR } from 'src/utils/storage';

const CreateEnterprisePage = (): JSX.Element => (
    <>
      <NextSeo title="Tạo mới doanh nghiệp" description="Tạo mới doanh nghiệp" />
      <CreateEnterprise />
    </>
)

export default CreateEnterprisePage

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
