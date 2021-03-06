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
              <div className={styles.title}>B???n mu???n t??m ki???m c??ng vi???c?</div>
              <div className={styles.description}>
                <ArrowLeftOutlined />
                <span className="ml-2">T??m ki???m c??ng vi???c ngay h??m nay</span>
              </div>
              <button
                type="button"
                className={styles.search_jobs}
                  onClick={() => router.push(routerPathConstant.homepage)}
              >
                T??m vi???c{' '}
              </button>
            </div>
          </Fade>
          <Fade right>
            <div className={styles.search_right}>
              <div className={styles.title}>B???n mu???n t??m ki???m ???ng vi??n?</div>
              <div className={styles.description}>
                <span>T??m ki???m ???ng vi??n ngay </span>
                <ArrowRightOutlined className="ml-2" />
              </div>
              <div className={styles.buttons}>
                <button
                  type="button"
                  className={styles.search_post_jobs}
                  onClick={() => redirectPostJob()}
                >
                  ????ng tin tuy???n d???ng
                </button>
                <button
                  type="button"
                  className={styles.search_candidates}
                  onClick={() => redirectFindEE()}
                >
                  T??m ki???m ???ng vi??n{' '}
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
                        <span style={{ fontSize: '14px' }}>????? xu???t c??ng vi???c ph?? h???p</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fcall.svg" width="125" height="108" />
                        <div className={styles.title}>F - Call</div>
                        <span style={{ fontSize: '14px' }}>Li??n h??? nhanh ch??ng</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fcareer.svg" width="125" height="108" />
                        <div className={styles.title}>F - Career</div>
                        <span style={{ fontSize: '14px' }}>?????nh h?????ng ngh??? nghi???p</span>
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
                        <span style={{ fontSize: '14px' }}>Qu???n l?? ???ng vi??n</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/fsmart.svg" width="125" height="108" />
                        <div className={styles.title}>F - Smart</div>
                        <span style={{ fontSize: '14px' }}>Tuy???n d???ng th??ng minh</span>
                      </div>
                      <div className={styles.item}>
                        <Image src="/assets/images/introduction/ftick.svg" width="125" height="108" />
                        <div className={styles.title}>F - Tick</div>
                        <span style={{ fontSize: '14px' }}>X??c th???c an to??n</span>
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
          <Zoom>Gia s??</Zoom>
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
                <div className={styles.title}>Nh?? tuy???n d???ng h??ng ?????u</div>
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
                <div className={styles.title}>???ng vi??n ti???m n??ng</div>
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
                <div className={styles.title}>C??ng vi???c ??ang tuy???n</div>
              </div>
            </Col>
          </Row>
        </div>
      </Row>
      <div className={styles.intro}>
        <div className={styles.intro_wrapper}>
          <div className={styles.intro_header}>
            M???t ph??t l?????t ngay, Job hay ?????y t??i
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
                          T??? ?????ng ????nh gi?? m???c ????? ph?? h???p c???a ???ng vi??n v???i c??ng vi???c
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
                          K???t n???i nhanh ch??ng v???i nh?? tuy???n d???ng
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
                          ?????nh h?????ng ngh??? nghi???p, n??ng cao tr??nh ????? b???n th??n
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
                          D??nh t???ng v?? v??n ph???n qu?? c?? gi?? tr??? khi s??? d???ng d???ch v??? t???i Fjob
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
                          C??ng ngh??? x??c th???c h??? s?? ???ng vi??n v?? nh?? tuy???n d???ng, t???o ra m???t m??i tr?????ng
                          l??nh m???nh
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
                  ???ng tuy???n ngay
                </button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      <div className={styles.intro_post_job}>
        <div className={styles.intro_wrapper}>
          <div className={styles.intro_header}>
            tuy???n d???ng kh?? <br className="d-lg-none d-block" /> c?? fjob lo
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
                          H??? th???ng t??? ?????ng ????? xu???t ???ng vi??n ph?? h???p
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
                          Li??n h??? ngay v???i ???ng vi??n tr??n app Fjob
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
                          ?????nh h?????ng ngh??? nghi???p, n??ng cao tr??nh ????? b???n th??n
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
                          Qu???n l?? th??ng tin ???ng vi??n ti???n l???i
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
                        <div className={styles.description}>Tuy???n d???ng th??ng minh</div>
                      </div>
                    </div>
                  </Fade>
                </div>
                <button
                  className={styles.apply_now}
                  type="button"
                  onClick={() => redirectPostJob()}
                >
                  ????ng tin tuy???n d???ng
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
