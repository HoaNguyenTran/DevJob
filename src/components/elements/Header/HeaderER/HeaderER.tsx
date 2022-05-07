/* eslint-disable no-nested-ternary */
import { DownOutlined, RightOutlined } from '@ant-design/icons'
import { Collapse, Drawer, Popover } from 'antd'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'
import React, { useRef, useState } from 'react'
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
import styles from './HeaderER.module.scss'

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
    type: TypeUnknownLink.comingSoon
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
  {
    id: 'Kim cương của tôi',
    icon: '/assets/icons/sidebar/wallet.svg',
    link: '',
    text: 'Kim cương của tôi',
    type: TypeUnknownLink.comingSoon
  },
  {
    id: 'Lịch sử giao dịch',
    icon: '/assets/icons/sidebar/payment_history.svg',
    link: '',
    text: 'Lịch sử giao dịch',
    type: TypeUnknownLink.comingSoon
  },
]

const arrMenuThree = [
  {
    id: 'Giới thiệu bạn bè',
    icon: '/assets/icons/sidebar/refer_friend.svg',
    link: routerPathConstant.referFriend,
    text: 'Giới thiệu bạn bè',
  },
  {
    id: 'Quà tặng',
    icon: '/assets/icons/sidebar/gift.svg',
    link: routerPathConstant.gift,
    text: 'Quà tặng',
  },
  {
    id: 'Tích điểm',
    icon: '/assets/icons/sidebar/point.svg',
    link: '',
    text: 'Tích điểm',
    type: TypeUnknownLink.comingSoon
  },
  {
    id: 'Ưu đãi',
    icon: '/assets/icons/sidebar/promotion.svg',
    link: '',
    text: 'Ưu đãi',
    type: TypeUnknownLink.comingSoon
  },
]

const arrMenu = [arrMenuOne, arrMenuTwo, arrMenuThree]


const arrDropdownOne = [

  {
    id: routerPathConstant.accInfo,
    src: '/assets/icons/dropdown/info_acc.svg',
    title: 'Thông tin tài khoản',
    link: routerPathConstant.accInfo,
  },
  {
    id: routerPathConstant.erEnterprise,
    src: '/assets/icons/dropdown/intro_friend.svg',
    title: 'Hồ sơ doanh nghiệp',
    link: routerPathConstant.erEnterprise,
  },
  {
    id: 3,
    src: '/assets/icons/dropdown/verify.svg',
    title: 'Xác thực tài khoản',
    link: routerPathConstant.verify,
  },
]
const arrDropdownTwo = [
  {
    id: routerPathConstant.homepage,
    src: '/assets/icons/default/switch_mode.svg',
    title: 'Chế độ ứng viên',
    link: routerPathConstant.homepage,
  },
  // {
  //   id: routerPathConstant.forgotPass,
  //   src: '/assets/icons/dropdown/change_pass.svg',
  //   title: 'Quên mật khẩu',
  //   link: routerPathConstant.forgotPass,
  // },
  {
    id: 'Thay đổi mật khẩu',
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

const arrDropdown = [arrDropdownOne, arrDropdownTwo];


const HeaderER = (): JSX.Element => {
  const ref = useRef(null);
  const router = useRouter()

  const profile = useAppSelector(state => state.user.profile || {})

  const [leftDrawer, setLeftDrawer] = useState(false)
  const [rightAuthDrawer, setRightAuthDrawer] = useState(false)
  const [dropdown, setDropdown] = useState(false);

  const [isShowModalApp, setIsShowModalApp] = useState(false)
  const [isShowModalChangePass, setIsShowModalChangePass] = useState(false)


  // const { width } = useWindowDimensions()
  useOnClickOutside(ref, () => setDropdown(false))
  const dispatch = useAppDispatch()


  const menu = [
    {
      text: 'Trang quản lý',
      href: routerPathConstant.erDashboard,
      active: router.pathname.includes(routerPathConstant.erDashboard)
    },
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


  const renderAuthorization = () => <div className={styles.header_auth}>
    <div className={styles.action}>
      <LinkTo href={routerPathConstant.erPostJob}>
        <div className={styles.postjob}>Đăng tin tuyển dụng</div>
      </LinkTo>
      <LinkTo href={routerPathConstant.erFindEE} >
        <div className={styles.searchEE}>Tìm kiếm ứng viên</div>
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
          <div className={styles.role}>Nhà tuyển dụng</div>
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
          <div className={`header_draw ${styles.information_dropdown}`}>
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

            <Collapse>
              <Collapse.Panel header={<div className={styles.header1}>Tài khoản</div>} key="1">
                {arrDropdown.map((arr, idx) => (
                  <div key={idx} className={styles.list}>
                    {arr.map((item: any) => (
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
              </Collapse.Panel>

              <Collapse.Panel header="Quản lý" key="2">
                <div className={styles.layout_sidebar} >
                  {arrMenu.map((arr, idx) => (
                    <div key={idx} className={styles.list}>
                      {arr.map(item => (
                        <div
                          key={item.id}
                          // className={`${keyDefault === item.id ? styles.item_active : styles.item}`}
                          className={styles.item}
                          onClick={() => setDropdown(false)}
                        >
                          <div className={styles.popup} onClick={() => onClickLink(item.link, item.type)}>
                            <div className={styles.text}>
                              <img alt="" src={item.icon} />
                              <span>{item.text}</span>
                            </div>
                            <RightOutlined />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Collapse.Panel>
            </Collapse>

            <LinkTo href={routerPathConstant.erPostJob}>
              <div className={styles.draw_postjob}>Đăng tin tuyển dụng</div>
            </LinkTo>
            <LinkTo href={routerPathConstant.erFindEE} >
              <div className={styles.draw_searchEE}>Tìm kiếm ứng viên</div>
            </LinkTo>

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

          {arrDropdown.map((arr: any, idx) => (
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
                  <img src="/assets/icons/header/logo.svg" alt="Việc làm Fjob" />
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
            <LinkTo href={routerPathConstant.erDashboard}>
              <img src="/assets/icons/header/logo-auth.svg" alt="Việc làm Fjob" title="Việc làm Fjob" />
            </LinkTo>
          </div>


          <div className={styles.header_navigator}>
            {menu.map((item, i) => (
              <div
                className={styles.menu
                  // + (item.active ? ' color-primary' : '')
                }
                key={i}
              >
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

export default HeaderER
