import React, { FC } from 'react'
import { firebase } from 'src/utils/firebase'

import Image from 'next/image'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useRouter } from 'next/router'
import { configConstant } from 'src/constants/configConstant'
import { firebaseAnalytics } from 'src/constants/firebaseAnalyticsConstant'
import styles from './Footer.module.scss'

const Footer = (): JSX.Element => {
  const router = useRouter()
  const redirectPage = path => {
    router.push(path)
  }

  const downloadApp = platform => {
    switch (platform) {
      case configConstant.mobileOS.android.key:
        firebase.analytics().logEvent(firebaseAnalytics.downloadAndroid)
        window.open(configConstant.mobileOS.android.linkDownload)
        break
      case configConstant.mobileOS.iOS.key:
        firebase.analytics().logEvent(firebaseAnalytics.downloadIOS)
        window.open(configConstant.mobileOS.iOS.linkDownload)
        break
      default:
        break
    }
  }
  return (
    <div className={styles.footer}>
      <div className={styles.sub}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.item}>
              <img alt="" src="/assets/icons/color/icon_checked.svg" />
              <div className={styles.title}>Trực tiếp phỏng vấn ứng viên qua ứng dụng di động.</div>
            </div>
            <div className={styles.item}>
              <img alt="" src="/assets/icons/color/icon_checked.svg" />
              <div className={styles.title}>Tăng khả năng tìm việc với khả năng quét việc làm.</div>
            </div>
            <div className={styles.item}>
              <img alt="" src="/assets/icons/color/icon_checked.svg" />
              <div className={styles.title}>
                Đề xuất chính xác công việc phù hợp trên thang điểm chi tiết.
              </div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>Tải ứng dụng Fjob ngay</div>
            <div className={styles.desc}>
              Nền tảng ưu việt kết nối nhà tuyển dụng và ứng viên xuất sắc
            </div>
            <div className={styles.action}>
              <Image
                width="200"
                height="60"
                src="/assets/images/badge/app-store.png"
                className="cursor-pointer"
                onClick={() => downloadApp(configConstant.mobileOS.iOS.key)}
                alt=""
              />
              <Image
                width="200"
                height="60"
                src="/assets/images/badge/google-play.png"
                className="cursor-pointer"
                onClick={() => downloadApp(configConstant.mobileOS.android.key)}
                alt=""
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.information}>
            <div className={styles.logo}>
              <img alt="" src="/assets/images/logo/logo.svg" />
            </div>
            <div className={styles.info}>
              <div className={styles.item}>
                <img alt="" src="/assets/images/icon/phone-secondary.svg" />
                <div className={styles.number}>
                  <a href="tel:1900 98 98 26">1900 98 98 26</a>
                </div>
              </div>
              <div className={styles.item}>
                <img alt="" src="/assets/images/icon/mail-secondary.svg" />
                <div className={styles.description}>
                  <a href="mailto:fjob.support@zetagroup.vn">fjob.support@zetagroup.vn</a>
                </div>
              </div>
              <div className={styles.item}>
                <img alt="" src="/assets/images/icon/address-secondary.svg" />
                <div className={styles.description}>Tầng 7, 188 Trường Chinh, Đống Đa, Hà Nội </div>
              </div>
            </div>
          </div>
          <div className={styles.link}>
            <div className={styles.aboutus}>
              <h3>Về Fjob</h3>
              <div className={styles.child}>
                <div className={styles.item} onClick={() => redirectPage('/about-us')}>
                  Về chúng tôi
                </div>
                <div className={styles.item} onClick={() => redirectPage('/')}>
                  Trợ giúp
                </div>
                <div className={styles.item} onClick={() => redirectPage('/')}>
                  Liên hệ
                </div>
              </div>
            </div>
            <div className={styles.help}>
              <h3>Hỗ trợ</h3>
              <div className={styles.child}>
                <div className={styles.item} onClick={() => redirectPage('/user-manual')}>
                  Hướng dẫn
                </div>
                <div
                  className={styles.item}
                  onClick={() => redirectPage(routerPathConstant.termOfService)}
                >
                  Điều khoản dịch vụ
                </div>
                <div
                  className={styles.item}
                  onClick={() => redirectPage(routerPathConstant.privacyPolicy)}
                >
                  Chính sách bảo mật
                </div>
                {/* <div
                  className={styles.item}
                  onClick={() => redirectPage('/regulations-of-the-change')}
                >
                  Quy chế sàn giao dịch
                </div> */}
              </div>
            </div>
            <div className={styles.manual}>
              <h3>Blog</h3>
              <div className={styles.child}>
                <div className={styles.item} onClick={() => redirectPage('/user-manual')}>
                  Cho ứng viên
                </div>
                <div className={styles.item} onClick={() => redirectPage('/user-manual')}>
                  Cho nhà tuyển dụng
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.brand}>
          <div className={styles.inner}>
            <div className={styles.social}>
              <img alt="" src="/assets/images/footer/facebook.svg" onClick={() => window.open("https://www.facebook.com/Fjob.platform")} />
              <img alt="" src="/assets/images/footer/youtube.svg" onClick={() => window.open("https://www.youtube.com/channel/UCEXLqpTFHIqaVvyibzhDIfg")} />
              <img alt="" src="/assets/images/footer/instagram.svg" onClick={() => window.open("https://www.linkedin.com/company/fjob-tuyen-dung/")} />
              <img alt="" src="/assets/images/footer/linkedin.svg" onClick={() => window.open("https://www.instagram.com/fjob.official/")} />
            </div>
            <div className={styles.verify}>
              <img src="/assets/images/badge/bocongthuong.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.inner}>
          <span>
          Copyright © Công ty cổ phần đầu tư và công nghệ Zeta Group
          </span>
        </div>
      </div>
    </div>
  )
}

export default Footer
