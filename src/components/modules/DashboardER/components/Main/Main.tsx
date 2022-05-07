import React, { useState } from 'react'
import LinkTo from 'src/components/elements/LinkTo';
import ModalQRDownload from 'src/components/elements/Modal/ModalQRDownload';
import { routerPathConstant } from 'src/constants/routerConstant';
import styles from "./Main.module.scss"

const mainItem = [
  {
    id: 1,
    text: "Đăng tin tuyển dụng",
    icon: "/assets/icons/dashboard/main/01.svg",
    link: routerPathConstant.erPostJob
  },
  {
    id: 2,
    text: "Quản lý tin đăng",
    icon: "/assets/icons/dashboard/main/02.svg",
    link: routerPathConstant.erJobPost
  },
  {
    id: 3,
    text: "Tìm kiếm ứng viên",
    icon: "/assets/icons/dashboard/main/03.svg",
    link: routerPathConstant.erFindEE
  },
  {
    id: 4,
    text: "Quản lý ứng viên",
    icon: "/assets/icons/dashboard/main/04.svg",
    link: routerPathConstant.erCandidate
  },
  {
    id: 5,
    text: "Quản lý nhân viên",
    icon: "/assets/icons/dashboard/main/05.svg",
    link: ""
  },
  {
    id: 6,
    text: "Dịch vụ của tôi",
    icon: "/assets/icons/dashboard/main/06.svg",
    link: routerPathConstant.erService
  },
  {
    id: 7,
    text: "Kim cương của tôi",
    icon: "/assets/icons/dashboard/main/07.svg",
    link: routerPathConstant.erPayment
  },
  {
    id: 8,
    text: "Quà tặng",
    icon: "/assets/icons/dashboard/main/08.svg",
    link: ""
  },
  {
    id: 9,
    text: "Tích điểm",
    icon: "/assets/icons/dashboard/main/09.svg",
    link: ""
  },
  {
    id: 10,
    text: "Ưu đãi",
    icon: "/assets/icons/dashboard/main/10.svg",
    link: ""
  },
]

const Main = (): JSX.Element => {
  const [isShowModalApp, setIsShowModalApp] = useState(false)

  return (
    <div className={styles.main}>
      <div className={styles.main_inner}>
        <div className={styles.list}>
          {mainItem.map(menu => <div key={menu.id} className={styles.menu}>
            {menu.link ? (
              <LinkTo href={menu.link}>
                <div className={styles.img}><img alt="" src={menu.icon} /></div>
              </LinkTo>
            ) : (
              <div className={styles.popup} onClick={() => setIsShowModalApp(true)}>
                <div className={styles.img}><img alt="" src={menu.icon} /></div>
              </div>
            )}
            <div className={styles.text}>{menu.text}</div>
          </div>)}
        </div>
      </div>
      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
    </div>
  )
}

export default Main