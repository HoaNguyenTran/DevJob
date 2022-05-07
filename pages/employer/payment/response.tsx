import { postPaymentFjobApi } from 'api/client/payment'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import LayoutER from 'src/components/layouts/LayoutER/LayoutER'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppDispatch } from 'src/redux'
import { getNotificationRequest } from 'src/redux/noti'
import { setUserRoleCookieSSR } from 'src/utils/storage'


const ResponsePaymentPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleStatusTransaction = async () => {

    if (router.query.vpc_TransactionNo) {
      try {
        const { data } = await postPaymentFjobApi(router.query)
        // console.log(data);
        dispatch(getNotificationRequest({ data: "Nạp kim cương hành công!", type: "success" }))
      } catch (error) {
        dispatch(getNotificationRequest({ data: "Nạp kim cương thất bại!", type: "error" }))
      } finally {
        // window.close()
        window.location.href = routerPathConstant.erPayment
      }
    }
  }

  useEffect(() => {
    handleStatusTransaction()
  }, [])


  return <div className="text-center mt-2">Bạn vui lòng chờ trong giây lát!</div>
}

export default function PaymentPage(): JSX.Element {
  return (
    <>
      <NextSeo title="Cửa hàng kim cương" description="Cửa hàng kim cương" />
      <LayoutER keyDefault={routerPathConstant.erPayment} childComp={<ResponsePaymentPage />} />
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
