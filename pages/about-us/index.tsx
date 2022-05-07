import React from 'react'
import { CheckOutlined } from '@ant-design/icons'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { NextSeo } from 'next-seo'
import { setUserRoleCookieSSR } from 'src/utils/storage'
import { roleConstant } from 'src/constants/roleConstant'
import styles from './AboutUs.module.scss'

export default function AboutUs(): JSX.Element {

  const { width } = useWindowDimensions()

  return (
    <div className={styles.aboutus}>
      <NextSeo title="Về chúng tôi" description="Về chúng tôi" />
      <div className={styles.about}>
        <div className={styles.inner}>
          <div className={styles.main}>
            <div className={styles.title}>Về chúng tôi</div>
            <div className={styles.content}>
              <div className={styles.info}>
                Nhu cầu tuyển dụng ngày càng tăng cao. Chính vì vậy, bài toán kết nối doanh nghiệp
                với người phù hợp trở nên khó khăn hơn bao giờ hết.
              </div>
              <div className={styles.info1}>
                Với mong muốn “đưa đúng người vào đúng vị trí”, nền tảng công nghệ FJob ra đời nhằm
                mục đích hỗ trợ nhà tuyển dụng và ứng viên với những ưu điểm sau:
              </div>
              <div>
                <img alt="" src="/assets/images/about-us/icon.svg" />
                <span>Fjob</span> là nền tảng công nghệ hiện đại nhằm kết nối ứng viên và nhà tuyển
                dụng với mức độ chính xác, phù hợp với nhu cầu của cả 2 bên.
              </div>
              <div>
                <img alt="" src="/assets/images/about-us/icon.svg" />
                <span>Fjob</span> cung cấp thông tin công việc, thông tin ứng viên được xác thực và
                làm mới hàng ngày, tạo môi trường tìm việc mở để nhà tuyển dụng và ứng viên chủ động
                liên hệ với nhau ngay trên ứng dụng.
              </div>
              <div className={styles.info2} >
                Mỗi ngày, <span>Fjob</span> kết nối hàng trăm người với những cơ hội việc làm mới từ
                các doanh nghiệp uy tín, đem lại hiệu quả cao cho ứng viên và nhà tuyển dụng.
              </div>
            </div>
          </div>
          <div className={styles.image}>
            <img src="/assets/images/about-us/img-1.png" alt="" />
          </div>
        </div>
      </div>
      <div className={styles.employer}>
        <div className={styles.inner}>
          <div className={styles.image}>
            <img src="/assets/images/about-us/img-2.png" alt="" />
          </div>
          <div className={styles.main}>
            <div className={styles.title}>Dành cho nhà tuyển dụng</div>
            <div className={styles.content}>
              <div>
                Với hơn 90 triệu dân và dân số trẻ chiếm hơn 50%, Việt Nam đang trong thời kỳ vàng
                về nguồn lao động. Tuy nhiên để nhà tuyển dụng tìm kiếm được ứng viên đáp ứng được
                yêu cầu công việc là rất khó khăn. Hiện tại có rất nhiều nguồn cung cấp thông tin
                ứng viên, nhưng nhà tuyển dụng lại khó lựa chọn được nguồn tuyển dụng nào là đảm
                bảo, đáp ứng đúng yêu cầu đưa ra mà không tốn nhiều thời gian và chi phí.
              </div>
              <div className={styles.subtitle}>
                <span>Fjob</span> - Sự lựa chọn nhanh chóng, tiện lợi cho nhà tuyển dụng:
              </div>
              <div className={styles.list}>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Đăng tin tuyển dụng nhanh chóng, lựa chọn ứng viên phù hợp nhất với yêu cầu của
                  nhà tuyển dụng
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Quản lý hồ sơ ứng viên một cách khoa học
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Liên hệ với ứng viên dễ dàng
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.employee}>
        <div className={styles.inner}>
          <div className={styles.main}>
            <div className={styles.title}>Dành cho ứng viên</div>
            <div className={styles.content}>
              <div className={styles.info4}>
                Với <span>Fjob</span>, ứng viên có thể tìm việc làm thêm ở bất kỳ ngành nghề, vào
                bất kỳ thời gian bạn mong muốn với các tính năng:
              </div>
              <div className={styles.list}>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Cung cấp kho thông tin việc làm thêm tất cả các lĩnh vực được kiểm duyệt và cập
                  nhật hàng ngày
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Tính năng tìm việc nâng cao giúp bạn tìm việc chính xác theo các yêu cầu cá nhân:
                  thời gian, địa điểm, mức lương, công việc, vị trí tuyển dụng...
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Tìm việc hoàn toàn miễn phí
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Ứng tuyển ngay nhận phỏng vấn trực tiếp trên ứng dụng, không cần tạo CV phức tạp
                </div>
                <div className={styles.item}>
                  <img alt="" src="/assets/images/about-us/icon.svg" />
                  Xem đánh giá công ty trước khi nhận việc.
                </div>
              </div>
            </div>
          </div>
          <div className={styles.image}>
            <img src="/assets/images/about-us/img-3.png" alt="" />
          </div>
        </div>
      </div>
      <div className={styles.roadmap}>
          <div className={styles.title}>Chặng đường hình thành Fjob</div>
        <div className={width && width > 756 ? styles.inner : styles.inner_mb} />
      </div>
      <div className={styles.vision}>
        <div className={styles.inner}>
          <div className={styles.title}>Tầm nhìn & sứ mệnh</div>
          <div id="vision" className={styles.main}>
            <div className={styles.left}>
              <img src="/assets/images/about-us/vision-left.png" alt="" />
              <div className={styles.title}>Tầm nhìn</div>
              <div>
                Trở thành nền tảng kết nối nhà tuyển dụng - ứng viên uy tín, nền tảng việc làm sinh
                viên và giới trẻ hàng đầu tại Việt Nam
              </div>
            </div>
            <div className={styles.center}>
              <img src="/assets/images/about-us/img-4.png" alt="" />
            </div>
            <div className={styles.right}>
              <img src="/assets/images/about-us/vision-right.png" alt="" />
              <div className={styles.title}>Sứ mệnh</div>
              <div>Nâng cao chất lượng nguồn nhân lực cho thế hệ lao động mới tại Việt Nam</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export const getServerSideProps = async ctx => ({ props: {} })