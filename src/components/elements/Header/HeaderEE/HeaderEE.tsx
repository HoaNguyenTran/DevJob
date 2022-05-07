/* eslint-disable no-nested-ternary */
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import { Drawer, Popover } from 'antd'
import router from 'next/router'
import { destroyCookie } from 'nookies'
import React, { FC, useRef, useState } from 'react'
import LinkTo from 'src/components/elements/LinkTo'
import defaultConstant from 'src/constants/defaultConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { TypeUnknownLink } from 'src/constants/statusConstant'
import { storageConstant } from 'src/constants/storageConstant'
import useOnClickOutside from 'src/hooks/useClickOutside'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getLogoutRequest } from 'src/redux/user'
import { formatDiamond } from 'src/utils/helper'
import { removeCookieCSR, removeLocalStorageWhenLogout } from 'src/utils/storage'
import ModalChangePass from '../../Modal/ModalChangePass'
import ModalQRDownload from '../../Modal/ModalQRDownload'
import Notifications from '../../Notifications'
import styles from './HeaderEE.module.scss'

const arrMenuOne = [

  {
    id: routerPathConstant.accInfo,
    src: '/assets/icons/dropdown/info_acc.svg',
    title: 'Thông tin tài khoản',
    link: routerPathConstant.accInfo,
  },
  {
    id: routerPathConstant.portfolio,
    src: '/assets/icons/dropdown/profile.svg',
    title: 'Hồ sơ cá nhân',
    link: routerPathConstant.portfolio,
  },
  {
    id: routerPathConstant.verify,
    src: '/assets/icons/dropdown/verify.svg',
    title: 'Xác thực tài khoản',
    link: routerPathConstant.verify,
  },
]

const arrMenuTwo = [
  {
    id: 1,
    src: '/assets/icons/dropdown/distance.svg',
    title: 'Việc làm gần bạn',
    link: routerPathConstant.suitableDistance,
  },
  {
    id: 2,
    src: '/assets/icons/dropdown/free_time.svg',
    title: 'Thời gian rảnh',
    link: routerPathConstant.freeTime,
  },
]

const arrMenuThree = [
  {
    id: 1,
    src: '/assets/icons/dropdown/diamond.svg',
    title: 'Nạp kim cương',
    link: routerPathConstant.erPayment,
  },
  {
    id: 2,
    src: '/assets/icons/dropdown/payment_history.svg',
    title: 'Lịch sử giao dịch',
    link: '',
    type: TypeUnknownLink.comingSoon
  },
  {
    id: 3,
    src: '/assets/icons/dropdown/intro_friend.svg',
    title: 'Giới thiệu bạn bè',
    link: routerPathConstant.referFriendEE,
  },
]

const arrMenuFour = [
  {
    id: routerPathConstant.erDashboard,
    src: '/assets/icons/default/switch_mode.svg',
    title: 'Chế độ nhà tuyển dụng',
    link: routerPathConstant.erDashboard,
  },
  // {
  //   id: routerPathConstant.forgotPass,
  //   src: '/assets/icons/dropdown/change_pass.svg',
  //   title: 'Quên mật khẩu',
  //   link: routerPathConstant.forgotPass,
  // },
  {
    id: '',
    src: '/assets/icons/dropdown/change_pass.svg',
    title: 'Thay đổi mật khẩu',
    link: '',
    type: TypeUnknownLink.changePass
  },
  {
    id: routerPathConstant.logout,
    src: '/assets/icons/color/dropdown_logout.svg',
    title: 'Đăng xuất',
    link: '',
    type: TypeUnknownLink.logout
  },
]

const arrMenu = [arrMenuOne, arrMenuTwo, arrMenuThree, arrMenuFour]

const Header: FC = () => {
  const ref = useRef(null)
  const profile = useAppSelector(state => state.user.profile || {})

  const [dropdown, setDropdown] = useState(false)
  const [leftDrawer, setLeftDrawer] = useState(false)
  const [rightAuthDrawer, setRightAuthDrawer] = useState(false)

  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const [isShowModalChangePass, setIsShowModalChangePass] = useState(false)
  const dispatch = useAppDispatch()

  useOnClickOutside(ref, () => setDropdown(false))


  const menu = [
    {
      text: 'Về chúng tôi',
      href: routerPathConstant.aboutUs,
      active: router.pathname.includes(routerPathConstant.aboutUs),
    },
    {
      text: 'Blog',
      href: routerPathConstant.blogs,
      active: router.pathname.includes(routerPathConstant.blogs),
      children: [{
        text: "Cho nhà tuyển dụng",
        href: `${routerPathConstant.blogs}?type=employer`
      }, {
        text: "Cho ứng viên",
        href: `${routerPathConstant.blogs}?type=employee`
      }]
    },
    {
      text: 'Liên hệ',
      href: routerPathConstant.contact,
      active: router.pathname.includes(routerPathConstant.contact),
    },
  ]

  const handleLogout = () => {
    router.push(routerPathConstant.signIn)

    dispatch(getLogoutRequest())
    removeLocalStorageWhenLogout()
    removeCookieCSR(storageConstant.cookie.accessToken)
    removeCookieCSR(storageConstant.cookie.userRole)
    // Remove accessToken in stale version
    destroyCookie(null, 'accessToken')
  }

  const onClickLink = (link, type) => {
    if (link) {
      router.push(link)
      return;
    }
    switch (type) {
      case TypeUnknownLink.comingSoon:
        setIsShowModalApp(true)
        break;
      case TypeUnknownLink.changePass:
        setIsShowModalChangePass(true)
        break;
      case TypeUnknownLink.logout:
        handleLogout()
        break;
      default:
        break;
    }
  }

  const renderAuthorization = () =>
    <div className={styles.header_auth}>
      <div className={styles.action}>
        <LinkTo href={routerPathConstant.myJob}>
          <div className={styles.manage}>Quản lý việc làm</div>
        </LinkTo>
      </div>
      <div className={styles.noti}>
        <Notifications />
      </div>

      <div className={styles.employee} ref={ref} >
        <div className={styles.information_inner} onClick={() => setDropdown(!dropdown)}>
          <div className={styles.avatar}>
            <img
              src={profile.avatar || defaultConstant.defaultAvatarUser}
              alt="" width="40" height="40" />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{profile.name}</div>
            <div className={styles.role}>Ứng viên</div>
          </div>
          <DownOutlined style={{ color: 'var(--white-color)', paddingRight: '.5rem' }} />
        </div>

        <div className={styles.information_avatar} >
          <div onClick={() => setRightAuthDrawer(!rightAuthDrawer)}>
            <img
              src={profile.avatar || defaultConstant.defaultAvatarUser}
              alt="" width="40" height="40" />
          </div>

          <Drawer
            className={styles.draw_auth_right}
            visible={rightAuthDrawer}
            width="75%"
            placement="right"
            key="right"
            closable={false}
            onClose={() => setRightAuthDrawer(false)}
          >
            <div className={styles.information_dropdown}>
              <div className={styles.information}>
                <div className={styles.img}>
                  <img alt="" src={profile.avatar || defaultConstant.defaultAvatarUser} />
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{profile.name}</div>
                  {profile.verifyKyc ? (
                    <div className={styles.verify}>
                      <img alt="" src="/assets/icons/color/isVerified.svg" />
                      &nbsp;
                      <span>Tài khoản đã được xác thực</span>
                    </div>
                  ) : (
                    <div className={styles.verify}>
                      <img alt="" src="/assets/icons/color/unVerified.svg" />
                      &nbsp;
                      <span>Tài khoản chưa được xác thực</span>
                    </div>
                  )}
                  <div className={styles.diamond}>
                    <span>{formatDiamond(profile.walletValue)}</span>
                    &nbsp;
                    <img src="/assets/icons/color/diamond.svg" alt="" />
                  </div>
                </div>
              </div>

              {arrMenu.map((arr, idx) => (
                <div key={idx} className={styles.list}>
                  {arr.map(item => (
                    <div
                      key={item.id}
                      className={styles.item}
                      onClick={() => setDropdown(false)}
                    >
                      <div className={styles.popup} onClick={() => onClickLink(item.link, item.type)}>
                        <div className={styles.text}>
                          <img alt="" src={item.src} />
                          <span>{item.title}</span>
                        </div>
                        <RightOutlined />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Drawer>
        </div>

        {dropdown && (
          <div className={styles.information_dropdown}>
            <div className={styles.information}>
              <div className={styles.img}>
                <img alt="" src={profile.avatar || defaultConstant.defaultAvatarUser} />
              </div>
              <div className={styles.info}>
                <div className={styles.name}>{profile.name}</div>
                {profile.verifyKyc ? (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/isVerified.svg" />
                    &nbsp;
                    <span>Tài khoản đã được xác thực</span>
                  </div>
                ) : (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/unVerified.svg" />
                    &nbsp;
                    <span>Tài khoản chưa được xác thực</span>
                  </div>
                )}
                <div className={styles.diamond}>
                  <span>{formatDiamond(profile.walletValue)}</span>
                  &nbsp;
                  <img src="/assets/icons/color/diamond.svg" alt="" />
                </div>
              </div>
            </div>

            {arrMenu.map((arr, idx) => (
              <div key={idx} className={styles.list}>
                {arr.map(item => (
                  <div
                    key={item.id}
                    className={styles.item}
                    onClick={() => setDropdown(false)}
                  >
                    <div className={styles.popup} onClick={() => onClickLink(item.link, item.type)}>
                      <div className={styles.text}>
                        <img alt="" src={item.src} />
                        <span>{item.title}</span>
                      </div>
                      <RightOutlined />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  return (
    <div className={`header ${styles.header}`}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left}>
          <div className={styles.header_drawer}>
            <div className={styles.icon} onClick={() => setLeftDrawer(true)}>
              <img alt="" src="/assets/icons/header/more-white.svg" />
            </div>
            <Drawer
              className={styles.draw_left}
              visible={leftDrawer}
              width="75%"
              placement="left"
              key="left"
              closable={false}
              onClose={() => setLeftDrawer(false)}
            >
              <div className={styles.logo}>
                <LinkTo href="/" onClick={() => setLeftDrawer(false)}>
                  <img src="/assets/icons/header/logo.svg" alt="" />
                </LinkTo>
              </div>
              <div className={styles.navigator}>
                {menu.map((item, i) => (
                  <div className={styles.menu} key={i}>
                    <LinkTo href="/">{item.text}</LinkTo>
                  </div>
                ))}
              </div>
            </Drawer>

          </div>

          <div className={styles.header_logo}>
            <LinkTo href="/">
              <img src="/assets/icons/header/logo-auth.svg" alt="Việc làm Fjob" title="Việc làm Fjob" />
            </LinkTo>
          </div>

          {/* <div className={styles.header_line} /> */}

          <div className={styles.header_navigator}>
            {menu.map((item, i) => (
              <div className={styles.menu} key={i} >
                {
                  !item.children ? (
                    <LinkTo href={item.href} className={styles.link}>{item.text}</LinkTo>
                  ) : (
                    <Popover
                      placement="bottom"
                      content={
                        <div>
                          <div className={styles.link_popover}>
                            <a href="/blogs?type=employer">Cho nhà tuyển dụng</a>
                          </div>
                          <div className={styles.link_popover}>
                            <a href="/blogs?type=employee">Cho ứng viên</a>
                          </div>
                        </div>
                      }>
                      <div className={styles.link}>
                        <a>{item.text}</a>
                      </div>
                    </Popover>
                  )
                }
              </div>
            ))}
          </div>
        </div>

        <div className={styles.header_right}>
          {renderAuthorization()}
        </div>
      </div>
      {isShowModalApp && <ModalQRDownload callbackCloseModalApp={() => setIsShowModalApp(false)} />}
      {isShowModalChangePass && <ModalChangePass callbackCloseModalApp={() => setIsShowModalChangePass(false)} />}
    </div>
  )
}

export default Header
