import { message } from 'antd'
import { getCheckVerifyEmailApi } from 'api/client/user'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { handleError } from 'src/utils/helper'

const VerifyEmailPage = () => {
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await getCheckVerifyEmailApi(
          encodeURIComponent(String(router.query.email) || ''),
          String(router.query.code) || '',
        )

        message.success(resData.data.message)
      } catch (error) {
        handleError(error)
      } finally {
        setTimeout(() => {
          router.push(routerPathConstant.accInfo)
        }, 3000)
      }
    }
    fetchData()
  }, [])

  return <div style={{ minHeight: "100vh", textAlign: 'center', paddingTop: '4rem' }}>Trang xác minh email!</div>
}

export default VerifyEmailPage

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
  return { props: {} }
}
