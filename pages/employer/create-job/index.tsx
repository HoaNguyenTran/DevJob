import React from 'react'
import { useRouter } from 'next/router'
import { routerPathConstant } from 'src/constants/routerConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { GetServerSideProps } from 'next'
import styles from './CreateJob.module.scss'


const PostJobPage = (): JSX.Element => {
  const router = useRouter()

  return (
    <div className={styles.postjob}>
      <div className={styles.postjob_inner}>

        <div className={styles.banner}>
          <img alt="" src="/assets/images/post-job/banner.png" />
        </div>

        <div className={styles.main}>
          <div
            className={styles.urgent}
            onClick={() => {
              router.push(routerPathConstant.erPostJobUrgentHiring)
            }}
          >
            <div className={styles.image}>
              <img src="/assets/images/post-job/recruitment24h.svg" alt="" />
            </div>
            <div className={styles.title}>Đăng tin Siêu tốc</div>
            <div className={styles.subtitle}>
              <p>- Tin được hiển thị trên website + app dưới dạng cơ bản: thông tin đầy đủ dạng text + video giới thiệu.</p>
              <p>- Tin đăng tuyển được hiển thị trong trang ngành và trang địa điểm.</p>
              <p>- Tin sau khi đăng sẽ được duyệt tự động hiển thị ngay.</p>
            </div>
          </div>
          <div
            className={styles.normal}
            onClick={() => {
              router.push(routerPathConstant.erPostJobHiring)
            }}
          >
            <div className={styles.image}>
              <img src="/assets/images/post-job/recruitment.svg" alt="" />
            </div>
            <div className={styles.title}>Đăng tin Tuyển dụng</div>
            <div className={styles.subtitle}>
              <p>- Tin được hiển thị trên website + app dưới dạng cơ bản: thông tin đầy đủ dạng text.</p>
              <p>- Tin đăng tuyển được hiển thị trong trang ngành và trang địa điểm.</p>
              <p>- Tin sau khi đăng sẽ được gửi về hệ thống chờ admin xét duyệt.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostJobPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  if (ctx.req.url && !ctx.req.cookies[storageConstant.cookie.accessToken]) {
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
