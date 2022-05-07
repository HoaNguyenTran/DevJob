import React, { FC, useEffect, useState } from 'react'
import { Col, Row, Space, Spin } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/router'
import CountUp from 'react-countup'
import { Fade, Zoom } from 'react-reveal'
import VisibilitySensor from 'react-visibility-sensor'
import { routerPathConstant } from 'src/constants/routerConstant'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { storageConstant } from 'src/constants/storageConstant'
import styles from './Introduction.module.scss'

const Introduction: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const checkFinishSignUp = async () => {
    const rawProcess = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (rawProcess) {
      const infoProcess = JSON.parse(rawProcess)
      if (!infoProcess.status) {
        router.replace(routerPathConstant.signUp)
      } else {
        localStorage.removeItem(storageConstant.localStorage.signupProcess)
      }
    }
    setLoading(false)
  }
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
  const redirectFindEE = () => {
    const userCode = localStorage.getItem(storageConstant.localStorage.userCode)
    if (!userCode) {
      router.push({
        pathname: routerPathConstant.signIn,
        query: { next: routerPathConstant.erSearchEmployee },
      })
    } else {
      router.push(routerPathConstant.erSearchEmployee)
    }
  }
  useEffect(() => {
    checkFinishSignUp()
  }, [])

  return loading ? (
    <Space style={{ height: '100vh', display: 'flex', justifyContent: 'center' }} size="middle">
      <Spin size="large" />
    </Space>
  ) : (
    <div className={styles.homepage}>
      <Row className={styles.homepage_main}>
        <div
          style={{
            background: "url('/assets/images/introduction/bg_banner.svg')",
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
          className={styles.wrapper_banner}
        >
          <Fade left>
            <div className={styles.search_left}>
              <div className={styles.title}>Bạn muốn tìm kiếm công việc?</div>
              <div className={styles.description}>
                <ArrowLeftOutlined />
                <span className="ml-2">Tìm kiếm công việc ngay hôm nay</span>
              </div>
              <button
                type="button"
                className={styles.search_jobs}
                  onClick={() => router.push(routerPathConstant.homepage)}
              >
                Tìm việc{' '}
              </button>
            </div>
          </Fade>
          <Fade right>
            <div className={styles.search_right}>
              <div className={styles.title}>Bạn muốn tìm kiếm ứng viên?</div>
              <div className={styles.description}>
                <span>Tìm kiếm ứng viên ngay </span>
                <ArrowRightOutlined className="ml-2" />
              </div>
              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.search_post_jobs}
                  onClick={() => redirectPostJob()}
                >
                  Đăng tin tuyển dụng
                </button>
                <button
                  type="button"
                  className={styles.search_candidates}
                  onClick={() => redirectFindEE()}
                >
                  Tìm kiếm ứng viên{' '}
                </button>
              </div>
            </div>
          </Fade>

          <div className={styles.image_center}>
            {/* <Zoom  duration={1000}> */}
            <Image src="/assets/images/introduction/person.png" width="500" height="500" />
            {/* </Zoom> */}
          </div>

          <div className={styles.feature}>
            <div className={styles.feature_wrapper}>
              <Row>
                <Col lg={11} xs={24}>
                  <div className={styles.feature_left}>
                    <div className={styles.items}>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fmatch.svg" width="125" height="108" />
                        <div className={styles.title}>F - Match</div>
                        <span style={{ fontSize: '14px' }}>Đề xuất công việc phù hợp</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fcall.svg" width="125" height="108" />
                        <div className={styles.title}>F - Call</div>
                        <span style={{ fontSize: '14px' }}>Liên hệ nhanh chóng</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fcareer.svg" width="125" height="108" />
                        <div className={styles.title}>F - Career</div>
                        <span style={{ fontSize: '14px' }}>Định hướng nghề nghiệp</span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={2} />
                <Col lg={11} xs={24}>
                  <div className={styles.feature_right}>
                    <div className={styles.items}>
                      <div className={styles.item}>
                        <Image
                          src="/assets/images/introduction/fmanager.svg"
                          width="125"
                          height="108"
                        />
                        <div className={styles.title}>F - Manage</div>
                        <span style={{ fontSize: '14px' }}>Quản lý ứng viên</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fsmart.svg" width="125" height="108" />
                        <div className={styles.title}>F - Smart</div>
                        <span style={{ fontSize: '14px' }}>Tuyển dụng thông minh</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/ftick.svg" width="125" height="108" />
                        <div className={styles.title}>F - Tick</div>
                        <span style={{ fontSize: '14px' }}>Xác thực an toàn</span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Row>
      {/* <Zoom> */}
      <Row
        className={styles.homepage_slogan}
        style={{
          background: "url('/assets/images/introduction/sologan.svg')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* </Zoom> */}

      <Row
        className={styles.homepage_guide}
        style={{
          background: "url('/assets/images/introduction/guide.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className={styles.title}>
          <Zoom>Gia sư</Zoom>
        </div>
      </Row>
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

export default Introduction
