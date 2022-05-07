
import React, { FC } from 'react'
import Image from 'next/image'

import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'
import { Fade } from 'react-reveal'
import VisibilitySensor from 'react-visibility-sensor'
import { routerPathConstant } from 'src/constants/routerConstant'

import { storageConstant } from 'src/constants/storageConstant'

import styles from "./Intro.module.scss"

const Intro: FC = () => {
  const router = useRouter()
  const redirectPostJob = () => {
    const userCode = localStorage.getItem(storageConstant.localStorage.userCode)
    if (!userCode) {
      router.push({
        pathname: routerPathConstant.signIn,
        query: { next: routerPathConstant.erPostJob },
      })
    } else {
      router.push(routerPathConstant.erPostJob)
    }
  }
  return (
    <div className={styles.introduction}>
      <Row className={styles.homepage_count_section}>
        <div className={`${styles.container_count_section} d-flex w-100`}>
          <Row className="w-100">
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.number}>
                  <CountUp start={0} end={1260} duration={2.75} separator=".">
                    {({ countUpRef, start }) => (
                      <VisibilitySensor onChange={start} delayedCall>
                        {({ isVisible }) => (
                          <>
                            <span ref={countUpRef} />+
                          </>
                        )}
                      </VisibilitySensor>
                    )}
                  </CountUp>
                </div>
                <div className={styles.title}>Nhà tuyển dụng hàng đầu</div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.number}>
                  <CountUp start={0} end={2201180} duration={2.75} separator=".">
                    {({ countUpRef, start }) => (
                      <VisibilitySensor onChange={start} delayedCall>
                        {({ isVisible }) => (
                          <>
                            <span ref={countUpRef} />+
                          </>
                        )}
                      </VisibilitySensor>
                    )}
                  </CountUp>
                </div>
                <div className={styles.title}>Ứng viên tiềm năng</div>
              </div>
            </Col>
            <Col span={8}>
              <div className={styles.item}>
                <div className={styles.number}>
                  <CountUp start={0} end={12280} duration={2.75} separator=".">
                    {({ countUpRef, start }) => (
                      <VisibilitySensor onChange={start} delayedCall>
                        {({ isVisible }) => (
                          <>
                            <span ref={countUpRef} />+
                          </>
                        )}
                      </VisibilitySensor>
                    )}
                  </CountUp>
                </div>
                <div className={styles.title}>Công việc đang tuyển</div>
              </div>
            </Col>
          </Row>
        </div>
      </Row>
      <div className={styles.intro}>
        <div className={styles.intro_wrapper}>
          <div className={styles.intro_header}>
            Một phút lướt ngay, Job hay đầy túi
            <div className={styles.under_line} />
          </div>
          <div className={styles.intro_content}>
            <Row>
              <Col xs={24} lg={12}>
                <Image src="/assets/images/introduction/mockupUT.png" width="624" height="708" />
              </Col>
              <Col xs={24} lg={12}>
                <div className={styles.items}>
                  <Fade right duration={1000}>
                    <div className={styles.item}>
                      <Image src="/assets/images/introduction/fmatch_icon.svg" width="62" height="62" />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Match</div>
                        <div className={styles.description}>
                          Tự động đánh giá mức độ phù hợp của ứng viên với công việc
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade right duration={1500}>
                    <div className={styles.item}>
                      <Image src="/assets/images/introduction/fcall_icon.svg" width="62" height="62" />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Call</div>
                        <div className={styles.description}>
                          Kết nối nhanh chóng với nhà tuyển dụng
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade right duration={2000}>
                    <div className={styles.item}>
                      <Image
                        src="/assets/images/introduction/fcareer_icon.svg"
                        width="62"
                        height="62"
                      />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Career</div>
                        <div className={styles.description}>
                          Định hướng nghề nghiệp, nâng cao trình độ bản thân
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade right duration={2500}>
                    <div className={styles.item}>
                      <Image src="/assets/images/introduction/fgift_icon.svg" width="62" height="62" />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Gift</div>
                        <div className={styles.description}>
                          Dành tặng vô vàn phần quà có giá trị khi sử dụng dịch vụ tại Fjob
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade right duration={3000}>
                    <div className={styles.item}>
                      <Image src="/assets/images/introduction/ftick_icon.svg" width="62" height="62" />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Tick</div>
                        <div className={styles.description}>
                          Công nghệ xác thực hồ sơ ứng viên và nhà tuyển dụng, tạo ra một môi trường
                          lành mạnh
                        </div>
                      </div>
                    </div>
                  </Fade>
                </div>
                <button
                  className={styles.apply_now}
                  type="button"
                  onClick={() => router.push(routerPathConstant.homepage)}
                >
                  Ứng tuyển ngay
                </button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className={styles.intro_post_job}>
        <div className={styles.intro_wrapper}>
          <div className={styles.intro_header}>
            tuyển dụng khó <br className="d-lg-none d-block" /> có fjob lo
            <div className={styles.under_line} />
          </div>
          <div className={styles.intro_content}>
            <Row>
              <Col xs={24} lg={12}>
                <div className={styles.items}>
                  <Fade left duration={1000}>
                    <div className={styles.item}>
                      <Image
                        src="/assets/images/introduction/fmatch_white.svg"
                        width="62"
                        height="62"
                      />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Match</div>
                        <div className={styles.description}>
                          Hệ thống tự động đề xuất ứng viên phù hợp
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade left duration={1500}>
                    <div className={styles.item}>
                      <Image src="/assets/images/introduction/fcall_white.svg" width="62" height="62" />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Call</div>
                        <div className={styles.description}>
                          Liên hệ ngay với ứng viên trên app Fjob
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade left duration={2000}>
                    <div className={styles.item}>
                      <Image src="/assets/images/introduction/ftick_white.svg" width="62" height="62" />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Tick</div>
                        <div className={styles.description}>
                          Định hướng nghề nghiệp, nâng cao trình độ bản thân
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade left duration={2500}>
                    <div className={styles.item}>
                      <Image
                        src="/assets/images/introduction/fmanager_white.svg"
                        width="62"
                        height="62"
                      />
                      <div className={styles.content}>
                        <div className={styles.title}>F - Manage</div>
                        <div className={styles.description}>
                          Quản lý thông tin ứng viên tiện lợi
                        </div>
                      </div>
                    </div>
                  </Fade>
                  <Fade left duration={3000}>
                    <div className={styles.item}>
                      <Image
                        src="/assets/images/introduction/fsmart_white.svg"
                        width="62"
                        height="62"
                      />
                      <div className={styles.content}>
                        <div className={styles.title}>F - smart</div>
                        <div className={styles.description}>Tuyển dụng thông minh</div>
                      </div>
                    </div>
                  </Fade>
                </div>
                <button
                  className={styles.apply_now}
                  type="button"
                  onClick={() => redirectPostJob()}
                >
                  Đăng tin tuyển dụng
                </button>
              </Col>
              <Col xs={24} lg={12} className="mt-4 mt-lg-0">
                <Image src="/assets/images/introduction/MockupTD.png" width="624" height="708" />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intro