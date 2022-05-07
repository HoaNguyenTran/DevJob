import { Card } from 'antd'
import React, { FC, useRef } from 'react'
import useElementSize from 'src/hooks/useElementSize'
import styles from './UserManual.module.scss'

const UserManualPage: FC = () => {
  const ref = useRef(null)
  const { width } = useElementSize(ref)

  return (
    <div className={styles.userManual} ref={ref}>
      {!!width && (
        <div className={styles.userManual_wrap}>
          <Card bordered={false} size={width < 576 ? 'small' : 'default'}>
            <div className={styles.userManual_card}>
              <div className={styles.userManual_title}>FJOB – HƯỚNG DẪN SỬ DỤNG</div>
              <div className={styles.userManual_hotline}>
                HOTLINE: <a href="tel:1900989826">1900 98 98 26</a>
              </div>
              <hr />
              <div className={styles.userManual_main}>
                <div className={styles.userManual_main_one}>
                  <h3>I. Sử dụng Kim cương (KC): </h3>
                  <ul>
                    <li>
                      Là đơn vị tiền được sử dụng trên Fjob dùng để đổi các dịch vụ trên nền tảng.
                    </li>
                    <li>
                      Mỗi dịch vụ khi sử dụng đều có một giá trị được tính bằng số lượng KC nhất
                      định (Bảng giá dịch vụ xin vui lòng xem tại Dịch vụ của tôi), để thực hiện
                      được dịch vụ cần có sẵn lượng KC bằng hoặc nhiều hơn số KC tương ứng của dịch
                      vụ đó trong tài khoản của người sử dụng.
                    </li>
                    <li>
                      Người dùng có thể nạp KC bằng tính năng nạp KC trên app (thanh toán trực tiếp
                      bằng thẻ tích hợp với Appstore hoặc Google play) hoặc tính năng nạp KC trên
                      web (thanh toán qua cổng thanh toán onepay bằng thẻ tín dụng hoặc thẻ ATM).
                    </li>
                    <li>
                      Người dùng có thể kiếm KC miễn phí bằng các hoạt động kiếm KC theo các chương
                      trình được triển khai trong từng giai đoạn nhất định trên nền tảng.
                    </li>
                  </ul>
                </div>
                <div className={styles.userManual_main_two}>
                  <h3>II. Chế độ Nhà tuyển dụng - Ứng viên: </h3>
                  <ul>
                    <li>
                      Dựa trên nhu cầu của người dùng, Fjob là nền tảng đầu tiên và duy nhất cho đến
                      nay cho phép người dùng có thể thực hiện nhiều vai trò khác nhau trên cùng một
                      nền tảng: Nhà tuyển dụng và Ứng viên.
                    </li>
                    <li>
                      Người dùng có thể tự động chuyển đổi vai trò của mình bằng tính năng Chuyển
                      đổi chế độ (Chế độ Ứng viên / Chế độ Nhà tuyển dụng) trong phần quản trị tài
                      khoản.
                    </li>
                  </ul>
                </div>

                <div className={styles.userManual_main_three}>
                  <h3>III. Đối với Nhà tuyển dụng: </h3>
                  <h4 style={{ fontStyle: 'italic', marginLeft: '1rem' }}>
                    1. Nhập thông tin Nhà tuyển dụng:
                  </h4>
                  <p style={{ marginLeft: '1rem', fontStyle: 'italic', fontSize: '15px' }}>
                    Fjob cho phép Người dùng là Nhà tuyển dụng được thực hiện hai vai trò: Nhà tuyển
                    dụng cá nhân và Nhà tuyển dụng Doanh nghiệp.{' '}
                  </p>
                  <ul>
                    <li>- Bước 1: Từ màn hình trang chủ nhấn vào biểu tượng Tài khoản</li>
                    <li>- Bước 2: Nhấn vào tính năng Hồ sơ Doanh nghiệp</li>
                    <li>- Bước 3: Nhấn Tạo công ty mới</li>
                    <li>- Bước 4: Nhập thông tin Doanh nghiệp theo mẫu trên nền tảng</li>
                    <li>- Bước 5: Nhấn Hoàn thành</li>
                  </ul>
                  <h4 style={{ fontStyle: 'italic', marginLeft: '1rem' }}>2. Đăng tuyển dụng:</h4>
                  <ul>
                    <li>
                      - Bước 1: Nhấn vào tính năng Đăng tin tuyển dụng trên màn hình chính hoặc dưới
                      tab menu
                    </li>
                    <li>- Bước 2: Chọn hình thức đăng tuyển</li>
                    <ul>
                      <li>
                        + Đăng tin siêu tốc: Đăng tin tuyển dụng nhanh theo ngày. (Mặc định cho một
                        số ngành nghề và vị trí công việc nhất định).
                      </li>
                      <li>+ Đăng tin tuyển dụng: Đăng tin tuyển dụng theo tuần,</li>
                    </ul>
                    <li>- Bước 3: Điền thông tin yêu cầu tuyển dụng theo mẫu</li>
                    <li>
                      - Bước 4: Nhấn nút hoàn thành để chọn các dịch vụ gia tăng nếu cần và thanh
                      toán
                    </li>
                    <li>- Bước 5: Chờ duyệt và job sẽ được tự động cập nhật trên hệ thống</li>
                  </ul>
                  <h4 style={{ fontStyle: 'italic', marginLeft: '1rem' }}>
                    3. Tìm kiếm hồ sơ ứng viên:
                  </h4>
                  <ul>
                    <li>
                      - Bước 1: Nhấn vào tính năng Tìm kiếm ứng viên trên màn hình chính hoặc dưới
                      tab menu
                    </li>
                    <li>- Bước 2: Nhập yêu cầu ứng viên cần tìm kiếm và nhấn nút tìm kiếm</li>
                    <li>- Bước 3: Chọn hồ sơ quan tâm</li>
                    <li>
                      - Bước 4: Thanh toán KC để xem từng hồ sơ hoặc mua gói xem hồ sơ ưu đãi để xem
                      được nhiều hồ sơ hơn với mức giá ưu đãi
                    </li>
                  </ul>
                </div>

                <div className={styles.userManual_main_fourth}>
                  <h3>IV. Đối với Ứng viên:</h3>
                  <h4 style={{ fontStyle: 'italic', marginLeft: '1rem' }}>
                    1. Nhập thông tin Hồ sơ cá nhân:
                  </h4>
                  <ul>
                    <li>- Bước 1: Từ màn hình trang chủ nhấn vào biểu tượng Tài khoản</li>
                    <li>- Bước 2: Nhấn chọn Hồ sơ cá nhân</li>
                    <li>- Bước 3: Điền thông tin theo form trên nền tảng</li>
                    <li>- Bước 4: Nhấn Hoàn thành</li>
                  </ul>
                  <h4 style={{ fontStyle: 'italic', marginLeft: '1rem' }}>2.Tìm việc:</h4>
                  <ul>
                    <li>- Bước 1: Từ màn hình trang chủ nhấn tính năng Tìm việc</li>
                    <li>
                      - Bước 2: Nhấn vào biểu tượng tìm kiếm hoặc biểu tượng tìm kiếm nâng cao phía
                      trên, góc phải màn hình
                    </li>
                    <li>- Bước 3: Nhập thông tin công việc cần tìm kiếm</li>
                    <li>- Bước 4: Nhấn Áp dụng</li>
                  </ul>
                  <h4 style={{ fontStyle: 'italic', marginLeft: '1rem' }}>
                    3. Ứng tuyển hoặc Liên hệ Nhà tuyển dụng:{' '}
                  </h4>
                  <p style={{ marginLeft: '1rem', fontStyle: 'italic', fontSize: '15px' }}>
                    Tính năng Liên hệ Nhà tuyển dụng là tính năng độc đáo của Fjob, cho phép Ứng
                    viên có thể liên hệ trực tiếp với Nhà tuyển dụng, giúp tiết kiệm thời gian và
                    tận dụng cơ hội sớm có công việc tốt cho Ứng viên.
                  </p>
                  <ul>
                    <li>- Bước 1: Khi tìm được công việc phù hợp, nhấn chọn công việc đó</li>
                    <li>
                      - Nhấn nút Ứng tuyển (để gửi hồ sơ cho Nhà tuyển dụng) hoặc nhấn nút Liên hệ
                      (để liên hệ trực tiếp với Nhà tuyển dụng).{' '}
                    </li>
                  </ul>
                  <p style={{ marginLeft: '1rem', fontStyle: 'italic', fontSize: '15px' }}>
                    Lưu ý, trong trường hợp Nhà tuyển dụng không cho phép Ứng viên gọi trực tiếp,
                    nút Liên hệ sẽ không hiển thị.{' '}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default UserManualPage
