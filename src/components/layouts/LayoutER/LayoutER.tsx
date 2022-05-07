import { RightOutlined } from '@ant-design/icons'
import React, { FC, useState } from 'react'
import LinkTo from 'src/components/elements/LinkTo'
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload'
import { routerPathConstant } from 'src/constants/routerConstant'
import styles from './LayoutER.module.scss'


const arrMenuOne = [
  {
    id: routerPathConstant.erDashboard,
    icon: '/assets/icons/sidebar/dashboard.svg',
    link: routerPathConstant.erDashboard,
    text: 'Quản lý',
  },
  {
    id: routerPathConstant.erJobPost,
    icon: '/assets/icons/sidebar/job-post.svg',
    link: routerPathConstant.erJobPost,
    text: 'Quản lý tin đăng',
  },
  {
    id: routerPathConstant.erCandidate,
    icon: '/assets/icons/sidebar/candidate-manager.svg',
    link: routerPathConstant.erCandidate,
    text: 'Quản lý ứng viên',
  },
  {
    id: 'Quản lý nhân viên',
    icon: '/assets/icons/sidebar/searchEE.svg',
    link: '',
    text: 'Quản lý nhân viên',
  },
]

const arrMenuTwo = [
  {
    id: routerPathConstant.erPayment,
    icon: '/assets/icons/sidebar/recharge_diamond.svg',
    link: routerPathConstant.erPayment,
    text: 'Nạp kim cương',
  },
  {
    id: routerPathConstant.erService,
    icon: '/assets/icons/sidebar/service.svg',
    link: routerPathConstant.erService,
    text: 'Dịch vụ của tôi',
  },
  // {
  //   id: 'Kim cương của tôi',
  //   icon: '/assets/icons/sidebar/wallet.svg',
  //   link: '',
  //   text: 'Kim cương của tôi',
  // },
  {
    id: routerPathConstant.erTransaction,
    icon: '/assets/icons/sidebar/payment_history.svg',
    link: routerPathConstant.erTransaction,
    text: 'Lịch sử giao dịch',
  },
]

const arrMenuThree = [
  {
    id: routerPathConstant.referFriend,
    icon: '/assets/icons/sidebar/refer_friend.svg',
    link: routerPathConstant.referFriend,
    text: 'Giới thiệu bạn bè',
  },
  {
    id: routerPathConstant.gift,
    icon: '/assets/icons/sidebar/gift.svg',
    link: routerPathConstant.gift,
    text: 'Quà tặng',
  },
  {
    id: 'Tích điểm',
    icon: '/assets/icons/sidebar/point.svg',
    link: '',
    text: 'Tích điểm',
  },
  {
    id: 'Ưu đãi',
    icon: '/assets/icons/sidebar/promotion.svg',
    link: '',
    text: 'Ưu đãi',
  },
]

const arrMenu = [arrMenuOne, arrMenuTwo, arrMenuThree]

const LayoutER: FC<{ childComp: React.ReactNode; keyDefault: string }> = ({
  childComp,
  keyDefault,
}) => {
  // const size = useWindowDimensions()

  const [isShowModalApp, setIsShowModalApp] = useState(false)

  return (
    <div className={styles.layout}>
      <div className={styles.layout_wrap}>
        <div className={styles.layout_sidebar} >
          {arrMenu.map((arr, idx) => (
            <div key={idx} className={styles.list}>
              {arr.map(item => (
                <div
                  key={item.id}
                  className={`${keyDefault === item.id ? styles.item_active : styles.item}`}
                >
                  {item.link ? (
                    <LinkTo href={item.link}>
                      <div className={styles.text}>
                        <img alt="" src={item.icon} />
                        <span>{item.text}</span>
                      </div>
                      <RightOutlined />
                    </LinkTo>
                  ) : (
                      <div className={styles.popup} onClick={() => setIsShowModalApp(true)}>
                        <div className={styles.text}>
                          <img alt="" src={item.icon} />
                          <span>{item.text}</span>
                        </div>
                        <RightOutlined />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.layout_content}>
          <div className={styles.content_inner} id="layout-content">
            {childComp}
          </div>
        </div>

        {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
      </div>
    </div>
  )
}
export default LayoutER
