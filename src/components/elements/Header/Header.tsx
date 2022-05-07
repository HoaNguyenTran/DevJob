import { Drawer, Divider, Popover } from 'antd'
import router from 'next/router'
import React, { useState } from 'react'
import LinkTo from 'src/components/elements/LinkTo'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { useAppSelector } from 'src/redux'
import styles from './Header.module.scss'


const Header = (): JSX.Element => {
  const { width } = useWindowDimensions()
  const profile = useAppSelector(state => state?.user?.profile || {})

  const [leftDrawer, setLeftDrawer] = useState(false)
  const [rightDrawer, setRightDrawer] = useState(false)

  // useEffect(() => {
  //   if (width && width >= 1200) {
  //     setLeftDrawer(false)
  //     setRightDrawer(false)
  //   }
  // }, [width])

  const menu = [
    {
      text: 'Trang chủ',
      href: '/',
      active:
        !router.pathname.includes(routerPathConstant.aboutUs) &&
        !router.pathname.includes(routerPathConstant.blogs),
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
  ]

  const renderAuthorization = () => {
    if (!profile.code)
      return <div className={styles.header_unauth}>
        <div className={styles.employee}>
          <div className={styles.signin}>
            <LinkTo href={routerPathConstant.signIn}>
              Đăng nhập
            </LinkTo>
          </div>
          <div className={styles.line} />
          <div className={styles.signup}>
            <LinkTo href={routerPathConstant.signUp}>
              Đăng ký
            </LinkTo>
          </div>
        </div>
        <div className={styles.employer}>
          <LinkTo href={`${routerPathConstant.signIn}?type=${roleConstant.ER.name}`}>
            Nhà tuyển dụng
          </LinkTo>
        </div>
        <div className={styles.avatar}  >
          <div onClick={() => setRightDrawer(true)}>
            <img alt="avatar default" src="/assets/icons/header/avatar-unauth.svg" />
          </div>
          <Drawer
            className={styles.draw_right}
            visible={rightDrawer}
            width="75%"
            placement="right"
            key="right"
            closable={false}
            onClose={() => setRightDrawer(false)}
          >
            <div className={styles.logo}>
              <LinkTo href="/" onClick={() => setLeftDrawer(false)}>
                <img src="/assets/icons/header/logo.svg" alt="" />
              </LinkTo>
            </div>
            <div className={styles.employee}>
              <div className={styles.signin}>
                <LinkTo href={routerPathConstant.signIn}>
                  Đăng nhập
                </LinkTo>
              </div>

              <div className={styles.signup}>
                <LinkTo href={routerPathConstant.signUp}>
                  Đăng ký
                </LinkTo>
              </div>
            </div>
            <Divider />
            <div className={styles.employer}>
              <LinkTo href={routerPathConstant.signIn}>
                Nhà tuyển dụng
              </LinkTo>
            </div>
          </Drawer>
        </div>
      </div>
  }

  return (  
      <div className={styles.header}>
      <div className={styles.header_wrap}>
        <div className={styles.header_left}>
          <div className={styles.header_drawer}>
            <div className={styles.icon} onClick={() => setLeftDrawer(true)}>
              <img alt="" src="/assets/icons/header/more.svg" />
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
              <img src="/assets/icons/header/logo.svg" alt="Việc làm Fjob" title="Việc làm Fjob" />
            </LinkTo>
          </div>

            {/* <div className={styles.header_line} /> */}

          <div className={styles.header_navigator}>
            {menu.map((item, i) => (
              <div className={styles.menu} key={i}>
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
    </div>
  )
}

export default Header
