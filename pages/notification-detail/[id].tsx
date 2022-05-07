import { NextSeo } from 'next-seo';
import React, { FC } from 'react';
import styles from './NotificationDetail.module.scss'

const NotificationDetail: FC = () => {
  return <div className={styles.notificationDetail}>
    <NextSeo title="Thông báo" description="Chi tiết thông báo" />
    <div className={styles.main}>
      <div className={styles.wrap}>
        <div>Thông báo</div>
      </div>
    </div>
  </div>

}
export default NotificationDetail;

export async function getServerSideProps(ctx) {
  try {
    

  } catch (e) {

  } finally {

  }
  return { props: {} }
}
