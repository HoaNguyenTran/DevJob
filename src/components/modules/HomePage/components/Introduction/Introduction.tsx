import { Col, Row } from 'antd';
import React from 'react'
import styles from "./Introduction.module.scss"

const Introduction = (): JSX.Element => (
    <div className={styles.intro}>
      <div className={styles.intro_wrap}>
        <div className={styles.intro_title}>Fjob - Nền tảng kết nối ưu việt</div>

        <Row gutter={[21, 14]} className={styles.intro_count}>
          <Col xs={24} md={8}>
            <div className={styles.count_item}>
              <img alt="" src="/assets/images/homepage/intro/2.svg" />
              <div className={styles.title}>1260+</div>
              <div className={styles.subtitle}>Nhà tuyển dụng hàng đầu</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className={styles.count_item}>
              <img alt="" src="/assets/images/homepage/intro/3.svg" />
              <div className={styles.title}>2.201.180+</div>
              <div className={styles.subtitle}>Ứng viên tiềm năng</div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className={styles.count_item}>
              <img alt="" src="/assets/images/homepage/intro/4.svg" />
              <div className={styles.title}>12.280+</div>
              <div className={styles.subtitle}>Công việc đang tuyển</div>
            </div>
          </Col>
        </Row>

        <Row gutter={[21, 21]} className={styles.intro_ee}>
          <Col xs={24} md={12} className={styles.ee_information}>
            <div className={styles.ee_title}>
              Một phút lướt ngay, job hay đầy túi
            </div>
            <div className={styles.ee_content}>
              <div className={styles.ee_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/5.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Match</div>
                  <div className={styles.subtitle}>Hệ thống tự động đề xuất công việc phù hợp.</div>
                </div>
              </div>
              <div className={styles.ee_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/10.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Call</div>
                  <div className={styles.subtitle}>Kết nối nhanh chóng với nhà tuyển dụng.</div>
                </div>
              </div>
              <div className={styles.ee_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/6.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Career</div>
                  <div className={styles.subtitle}>Định hướng nghề nghiệp, nâng cao trình độ bản thân.</div>
                </div>
              </div>
              <div className={styles.ee_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/7.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Gift</div>
                  <div className={styles.subtitle}>Vô vàn phần quà có giá trị khi sử dụng dịch vụ tại Fjob.</div>
                </div>
              </div>
              <div className={styles.ee_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/8.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Tick</div>
                  <div className={styles.subtitle}>Định hướng nghề nghiệp, nâng cao trình độ bản thân.</div>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12} className={styles.ee_image}>
            <img alt="" src="/assets/images/homepage/intro/1.png" />
          </Col>
        </Row>

        <Row gutter={[21, 21]} className={styles.intro_er}>


          <Col xs={{ order: 1 }} sm={{ order: 2 }} md={12} className={styles.er_information}>
            <div className={styles.er_title}>
              Tuyển dụng khó, có Fjob lo
            </div>
            <div className={styles.er_content}>
              <div className={styles.er_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/11.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Match</div>
                  <div className={styles.subtitle}>Hệ thống tự động đề xuất ứng viên phù hợp.</div>
                </div>
              </div>
              <div className={styles.er_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/12.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Call</div>
                  <div className={styles.subtitle}>Liên hệ ngay với ứng viên trên app Fjob.</div>
                </div>
              </div>
              <div className={styles.er_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/13.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Tick</div>
                  <div className={styles.subtitle}>Công nghệ xác thực hồ sơ ứng viên và nhà tuyển dụng, tạo ra một môi trường lành mạnh.</div>
                </div>
              </div>
              <div className={styles.er_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/14.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Manage</div>
                  <div className={styles.subtitle}>Quản lý thông tin ứng viên tiện lợi.</div>
                </div>
              </div>
              <div className={styles.er_item}>
                <div className={styles.image}>
                  <img alt="" src="/assets/images/homepage/intro/15.svg" />
                </div>
                <div>
                  <div className={styles.title}>F-Smart</div>
                  <div className={styles.subtitle}>Tuyển dụng thông minh.</div>
                </div>
              </div>
            </div>
          </Col>

          <Col xs={{ order: 2 }} sm={{ order: 1 }} md={12} className={styles.er_image}>
            <img alt="" src="/assets/images/homepage/intro/2.png" />
          </Col>
        </Row>
      </div>
    </div>
)

export default Introduction