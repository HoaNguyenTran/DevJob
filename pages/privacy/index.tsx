import React from 'react'
import styles from './Privacy.module.scss'

export default function Privacy(): JSX.Element {
  return (
    <div className={styles.privacy_policy}>
      <div className={styles.container}>
        <h1>Chính sách bảo mật</h1>
        Sự riêng tư của bạn là yếu tố quan trọng đối với Fjob.vn (gọi tắt là Fjob). Vui lòng đọc kỹ
        Chính Sách Bảo Mật vì nó là một phần của Điều Khoản Sử Dụng nhằm quản lý việc sử dụng các
        Dịch vụ trên trang web Fjob. Thông Báo Chính Sách này giải thích:
        <ul className={styles.ul_raw}>
          <li>
            Loại thông tin cá nhân của bạn được Fjob xử lý khi bạn sử dụng các Dịch vụ của Fjob.
          </li>
          <li>
            Cách thức Fjob xử lý thông tin cá nhân của bạn khi bạn sử dụng các Dịch vụ của Fjob.
          </li>
          <li>Mục đích Fjob thu thập và xử lý thông tin cá nhân của bạn.</li>
          <li>Quyền truy cập và chỉnh sửa thông tin cá nhân của bạn.</li>
          <li>Các bên thứ ba mà Fjob có thể công bố thông tin cá nhân của bạn.</li>
          <li>
            Tính bắt buộc hoặc tự nguyện đối với việc cung cấp thông tin cá nhân và hậu quả khi bạn
            từ chối cung cấp thông tin cá nhân trong trường hợp bắt buộc.
          </li>
          <li>Cách thức Fjob giữ gìn sự bảo mật và an ninh về thông tin cá nhân của bạn.</li>
        </ul>
        Những thay đổi này sẽ áp dụng cho việc sử dụng các Dịch vụ của Fjob sau khi Fjob đã gửi
        thông báo cho bạn. Nếu bạn không muốn chấp nhận các Điều khoản mới, bạn không nên tiếp tục
        sử dụng các Dịch vụ của Fjob. Nếu bạn tiếp tục sử dụng Dịch vụ của Fjob sau khi các thay đổi
        có hiệu lực, bạn đã thể hiện sự đồng ý đối với các ràng buộc tại các Điều khoản mới.
        <h3>1. THU THẬP THÔNG TIN CÁ NHÂN</h3>
        <ul className={styles.ul_decimal}>
          <li>
            Khi đăng ký Dịch vụ của Fjob
            <ul className={`${styles.ul_circle} mb-3`}>
              <li>
                Khi đăng ký bất cứ Dịch vụ của Fjob, bạn sẽ được yêu cầu cung cấp một số thông tin
                cá nhân nhất định để thiết lập tài khoản của bạn, để xác thực danh tính theo quy
                định của pháp luật hiện hành.
              </li>
              <li>
                Khi đăng ký bất cứ Dịch vụ của Fjob, bạn sẽ được yêu cầu cung cấp một số thông tin
                cá nhân nhất định để thiết lập tài khoản của bạn, để xác thực danh tính theo quy
                định của pháp luật hiện hành.
              </li>
            </ul>
          </li>
          <li>
            Từ việc sử dụng các Dịch vụ của Fjob của bạn
            <ul className={`${styles.ul_circle} mb-3`}>
              <li>
                Chúng tôi thu thập thông tin cá nhân trực tiếp từ bạn khi bạn chọn lựa tham gia vào
                bất kỳ Dịch vụ nào của Fjob. Dưới đây là các ví dụ về thông tin cá nhân mà Fjob có
                thể thu thập trực tiếp từ bạn: tuổi, ngày sinh, điện thoại cố định hoặc số điện
                thoại di động, hình ảnh cá nhân, học vấn, sở thích cá nhân, kinh nghiệm làm việc,
                các thông tin khác liên quan đến Hồ sơ việc làm (CV) của bạn:
                <div className="pl-4">
                  <div>
                    + Nếu bạn lựa chọn để thêm người giới thiệu trong hồ sơ, Fjob sẽ yêu cầu tên, số
                    điện thoại, email, vị trí công việc và các thông tin cụ thể khác của những người
                    này. Thông tin này sẽ được đính kèm trong hồ sơ xin việc của bạn và nhà tuyển
                    dụng có thể liên lạc họ để lấy thông tin tham khảo cho hồ sơ xin việc của bạn.
                  </div>
                  <div>
                    + Nếu bạn muốn Fjob ngưng xử lý thông tin cá nhân của bạn, Fjob sẽ không thể
                    cung cấp các dịch vụ liên quan cho bạn.
                  </div>
                </div>
              </li>
            </ul>
          </li>
          <li>
            Khi bạn truy cập các Dịch vụ của Fjob
            <ul className={`${styles.ul_circle} mb-3`}>
              <li>
                Khi bạn truy cập bất cứ trang web nào thuộc hệ thống Fjob, máy chủ trang web của
                chúng tôi sẽ tự động thu thập thông tin truy cập của bạn tại các trang web này, bao
                gồm địa chỉ IP, thời gian, ngày và thời lượng truy cập. Địa chỉ IP của bạn là thiết
                bị định dạng duy nhất cho máy tính của bạn hoặc các thiệt bị truy cập khác.
              </li>
              <li>
                Fjob có thể theo dõi quá trình truy cập của bạn tại bất cứ trang web nào thuộc hệ
                thống Fjob, bằng cách cài đặt một “cookie” trong máy tính của bạn hoặc các thiết bị
                truy cập khác khi bạn đăng nhập. Cookies là các tập tin văn bản nhỏ được đặt trên
                máy tính của bạn hoặc thiết bị truy cập khác bởi các trang web mà bạn truy cập.
                Chúng được sử dụng rộng rãi để làm cho trang web hoạt động, hoặc hoạt động hiệu quả
                hơn, cũng như cung cấp thông tin cho chủ sở hữu của các trang web.
              </li>
              <li>
                Cookies cho phép Fjob lưu lại các trạng thái dữ liệu của bạn để bạn sẽ không phải
                đăng nhập lại trong lần truy cập sau. Cookies cũng giúp Fjob thu thập luồng dữ liệu
                truy cập ẩn danh để theo dõi xu hướng và mẫu người dùng. Fjob có thể sử dụng luồng
                dữ liệu truy cập ẩn danh để giúp các nhà quảng cáo cung cấp quảng cáo nhắm tới mục
                tiêu tốt hơn.
              </li>
              <li>
                Bạn có thể gỡ bỏ Cookies bằng cách làm theo các hướng dẫn được cung cấp trong tập
                tin “giúp đỡ” trình duyệt Internet của bạn. Bạn nên hiểu rằng một số nội dung của
                một số trang web nhất định sẽ không hiển thị nếu bạn cài đặt trình duyệt Internet
                của bạn không chấp nhập cookies.
              </li>
              <li>
                Fjob cũng sử dụng các mã ghi rõ ràng trong email định dạng HTML để xác định các
                email nào đã được mở bởi người nhận. Điều này cho phép Fjob đánh giá tính hiệu quả
                của các phương tiện truyền thông nhất định và hiệu quả của các chiến lược tiếp thị
                của công ty.
              </li>
            </ul>
          </li>
        </ul>
        <h3>2. MỤC ĐÍCH THU THẬP VÀ SỬ DỤNG THÔNG TIN CÁ NHÂN</h3>
        <ul className={styles.ul_raw}>
          <li>
            Mục đích Fjob xử lý thông tin cá nhân của bạn như sau:
            <ul className={styles.ul_circle}>
              <li>Xác định danh tính của bạn.</li>
              <li>Đánh giá và/hoặc xác định khả năng làm việc và mức độ tín nhiệm của bạn.</li>
              <li>Cung cấp một trong các Dịch vụ của Fjob mà bạn đã yêu cầu.</li>
              <li>Điều hành và quản lý các Dịch vụ của Fjob đã cung cấp cho bạn.</li>
              <li>Liên lạc với bạn các vấn đề liên quan đến việc sử dụng Dịch vụ của Fjob.</li>
              <li>
                Cải thiện các cơ hội thay đổi công việc của bạn hoặc sắp xếp các dịch vụ cụ thể cho
                bạn.
              </li>
              <li>
                Xác minh trình độ học vấn và nghề nghiệp của bạn bằng việc liên lạc trường học/cao
                đẳng/đại học/viện nghiên cứu/các cơ quan chuyên môn.
              </li>
              <li>Xử lý đơn yêu cầu trong quá trình sử dụng Dịch vụ của Fjob mà bạn đã yêu cầu.</li>
              <li>
                Điều tra và giải quyết các khiếu nại hoặc thắc mắc khác mà bạn gửi đến Fjob liên
                quan đến các Dịch vụ của Fjob.
              </li>
              <li>Giám sát và cải thiện việc thực hiện các Dịch vụ của Fjob.</li>
              <li>Duy trì và phát triển các Dịch vụ của Fjob.</li>
              <li>
                Am hiểu về các nhu cầu thông tin và liên lạc của bạn để Fjob nâng cao và điều chỉnh
                các Dịch vụ của Fjob.
              </li>
              <li>
                Tiến hành nghiên cứu và phát triển và phân tích thống kê liên quan đến các Dịch vụ
                của Fjob để xác định xu hướng và phát triển các dịch vụ mới đáp ứng ứng sự quan tâm
                của bạn.
              </li>
              <li>
                Hỗ trợ Fjob am hiểu các lựa chọn duyệt thông tin ưu tiên của bạn để Fjob có thể điều
                chỉnh nội dung phù hợp.
              </li>
              <li>Phát hiện và ngăn chặn hoạt động gian lận, lừa đảo, vi phạm pháp luật.</li>
            </ul>
          </li>
          <li>
            Bạn không thể hạn chế việc xử lý thông tin cá nhân của bạn cho các mục đích quy định tại
            Khoản 2.1 nêu trên. Nếu bạn không đồng ý để Fjob xử lý thông tin cá nhân của bạn cho các
            mục đích trên, bạn phải chấm dứt thỏa thuận liên quan của bạn với Fjob cho các Dịch vụ
            của Fjob và ngừng sử dụng các Dịch vụ do Fjob cung cấp.
          </li>
          <li>
            Fjob sẽ yêu cầu sự đồng ý của bạn trước khi xử lý thông tin cá nhân ngoài các mục quy
            định tại Khoản 2.1.
          </li>
          <li>
            Ngoài ra, Fjob có thể sử dụng thông tin cá nhân của bạn cho các mục đích sau:
            <ul className={styles.ul_circle}>
              <li>
                Thúc đẩy và giới thiệu đến bạn:
                <div className="pl-4">
                  <div>
                    - Các Dịch vụ khác của Fjob như: Giới thiệu việc làm, Giới thiệu khóa học, sự
                    kiện, tin tức, Kết nối nhà tuyển dụng,…
                  </div>
                  <div>
                    - Các dịch vụ của các bên thứ ba mà Fjob thấy phù hợp với sự quan tâm của bạn.
                  </div>
                </div>
              </li>
              <li>
                Gửi đến bạn các tin nhắn chúc mừng và/hoặc tin nhắn thông báo lỗi trên các trang Web
                Fjob và/hoặc các thông tin Dịch vụ của Fjob.
              </li>
              <li>
                Gửi đến bạn các hướng dẫn, lời khuyên và thông tin khảo sát để tối đa hóa sự phát
                triển nghề nghiệp của bạn bao gồm nhưng không giới hạn đối với việc sử dụng các Dịch
                vụ của Fjob.
              </li>
            </ul>
          </li>
        </ul>
        <h3>3. QUYỀN CỦA BẠN ĐỐI VỚI CƠ SỞ DỮ LIỆU </h3>
        <ul className={styles.ul_raw}>
          <li>
            Fjob trao cho bạn sự chọn lựa để CV của mình trong Cơ Sở Dữ Liệu Hồ Sơ Fjob. Có hai cách
            để thực hiện:
            <ul className={styles.ul_circle}>
              <li>
                Bạn có thể lưu trữ hồ sơ của bạn trong Cơ Sở Dữ Liệu Hồ Sơ Fjob, nhưng không cho
                phép hồ sơ này được tìm kiếm bởi Nhà tuyển dụng hoặc các Đơn vị quảng cáo hoặc các
                Chủ sở hữu tài khoản Fjob Partner. Không cho phép hồ sơ của bạn được tìm kiếm có
                nghĩa là bạn có thể sử dụng nó để nộp đơn xin việc trực tuyến, nhưng Nhà tuyển dụng
                hoặc các Đơn vị quảng cáo hoặc các Chủ sở hữu tài khoản Fjob Partner sẽ không có
                quyền truy cập để tìm kiếm thông qua cơ sở dữ liệu Cơ Sở Dữ Liệu Hồ Sơ Fjob.
              </li>
              <li>
                Bạn có thể cho phép hồ sơ của bạn được tìm kiếm bởi những Nhà tuyển dụng hoặc các
                Đơn vị quảng cáo hoặc các Chủ sở hữu tài khoản Fjob Partner . Khi bạn lựa chọn để hồ
                sơ của mình được tìm kiếm, toàn bộ thông tin lý lịch và thông tin cá nhân của bạn sẽ
                hiển thị đối với các Nhà tuyển dụng hoặc các Đơn vị quảng cáo hoặc các Chủ sở hữu
                tài khoản Fjob Partner khi họ tải xuống qua Cơ Sở Dữ Liệu Hồ Sơ Fjob.
              </li>
            </ul>
          </li>
          <li>
            Fjob nỗ lực hạn chế quyền truy cập vào Cơ Sở Dữ Liệu Hồ Sơ Fjob mà chỉ dành cho những
            người đã đăng ký với các Dịch vụ của Fjob, những người này có thể giữ lại một bản sao
            của hồ sơ của bạn trong các tập tin hoặc cơ sở dữ liệu riêng của họ.
          </li>
          <li>
            Fjob sẽ thực hiện các bước hợp lý để các bên chưa được đề cập ở trên sẽ không đạt được
            quyền truy cập vào Cơ Sở Dữ Liệu Hồ Sơ Fjob, khi chưa có sự đồng ý của Fjob. Tuy nhiên,
            Fjob không chịu trách nhiệm đối với việc lưu giữ, sử dụng hoặc tính bảo mật của hồ sơ
            của bất kỳ bên thứ ba nào.
          </li>
          <li>
            Mặc dù quy định tại Khoản 3.1, Fjob có quyền truy cập đầy đủ đến hồ sơ của bạn cho mục
            đích quy định tại Khoản 2.1 để thực hiện các Dịch vụ Fjob.
          </li>
        </ul>
        <h3>4. LỰA CHỌN VÀ TRUY CẬP THÔNG TIN CÁ NHÂN </h3>
        <ul className={styles.ul_raw}>
          <li>
            Bạn có thể có những quan tâm về quyền bảo mật khác nhau. Mục tiêu của Fjob là làm rõ các
            thông tin mà chúng tôi thu thập, để bạn có thể có các lựa chọn ý nghĩa về cách sử dụng.
            Ví dụ:
            <ul className={styles.ul_circle}>
              <li>Bạn có thể kiểm soát người mà bạn muốn chia sẻ thông tin cá nhân.</li>
              <li>
                Bạn có thể xem lại và kiểm soát việc đăng ký của bạn đối với các lựa chọn tiếp thị
                khác nhau, các Dịch vụ Fjob. Bạn có thể xem, chỉnh sửa hoặc xóa thông tin cá nhân và
                các mục ưa thích bất cứ lúc nào.
              </li>
              <li>Bạn có thể lựa chọn không tiếp nhận bất cứ tài liệu tiếp thị nào từ Fjob.</li>
              <li>
                Bạn cũng có thể đăng ký các Dịch vụ Fjob bổ sung bằng cách đăng nhập vào tài khoản
                của bạn trên trang chủ của chúng tôi.
              </li>
            </ul>
          </li>
          <li>
            Bạn có thể xóa tài khoản của mình bất cứ lúc nào và khi đó Fjob sẽ hủy tất cả quyền truy
            cập đến tài khoản và hồ sơ trong cơ sở dữ liệu. Việc xóa tài khoản của bạn sẽ không ảnh
            hưởng đến những hồ sơ mà bạn đã gửi đến các Nhà tuyển dụng hoặc được lưu xuống bởi các
            Nhà tuyển dụng, Chủ sở hữu tài khoản (muốn có CV).
            <div>
              Dưới đây là các bước để bạn có thể xóa tài khoản của mình khỏi hệ thống của Fjob
            </div>
            <ul className={styles.ul_circle}>
              <li>
                Gửi email về hòm mail fjob.support@zetagroup.vn với tiêu đề{' '}
                <strong>Yêu cầu xóa tài khoản</strong>
              </li>
              <li>
                Sau khi Fjob nhận được yêu cầu qua email, chúng tôi sẽ liên hệ lại để xác nhận thông
                tin
              </li>
              <li>Thực hiện xóa tài khoản khỏi hệ thống và thông báo phản hồi lại qua email</li>
            </ul>
          </li>
        </ul>
        <h3>5. LƯU TRỮ THÔNG TIN CÁ NHÂN </h3>
        <div>
          Fjob sẽ lưu trữ thông tin cá nhân của bạn trong khoảng thời gian cần thiết để đáp ứng các
          mục đích quy định tại Khoản 2 bên trên và cho bất cứ mục đích pháp lý hoặc kinh doanh nào.
        </div>
        <div>
          Sau khi chấm dứt hoặc vô hiệu hóa tài khoản của bạn, Fjob, Chi nhánh hoặc Nhà cung cấp
          dịch vụ của Fjob có thể giữ lại thông tin (bao gồm thông tin trang cá nhân của bạn) và Nội
          dung của người dùng trong khoảng thời gian hợp lý về mặt thương mại cho các mục đích sao
          lưu, lưu trữ và/hoặc kiểm tra theo quy định của pháp luật Việt Nam.
        </div>
        <h3>6. BẢO MẬT THÔNG TIN CÁ NHÂN </h3>
        <ul className={styles.ul_raw}>
          <li>
            Fjob cam kết bảo mật thông tin cá nhân của bạn. Fjob có quy trình kỹ thuật, hành chính
            và vật chất thích hợp để chống mất mát, trộm cắp và lạm dụng, cũng như chống lại việc
            truy cập trái phép, tiết lộ, thay đổi và tiêu hủy thông tin. Thông tin nhạy cảm (như là
            số thẻ ngân hàng, thẻ tín dụng) được nhập vào các dịch vụ cổng thanh toán của chúng tôi
            hoặc đối tác thanh toán sẽ được mã hóa trong quá trình truyền tải thông tin bằng cách sử
            dụng công nghệ SSL.
          </li>
          <li>
            Tuy nhiên, không có phương pháp truyền tải qua Internet hoặc phương pháp lưu trữ điện tử
            nào là an toàn 100%. Do đó, chúng tôi không thể đảm bảo bảo mật tuyệt đối. Nếu bạn có
            bất kỳ câu hỏi nào về việc bảo mật trên Fjob, bạn có thể liên hệ với chúng tôi qua email
            fjob.support@zetagroup.vn.
          </li>
        </ul>
        <h3>7. NHỮNG BÊN THỨ BA ĐƯỢC SỬ DỤNG THÔNG TIN </h3>
        <ul className={styles.ul_raw}>
          <li>
            Thông tin cá nhân đề cập ở Khoản 1 trên đây có thể được công bố/sử dụng bởi các bên thứ
            ba sau đây nhằm kết nối các Dịch vụ của Fjob và bạn đến các cơ hội phù hợp:
            <ul className={styles.ul_circle}>
              <li>Các Nhà tuyển dụng / Doanh nghiệp đang có nhu cầu tuyển dụng nhân sự</li>
              <li>
                Các bên thứ ba ký hợp đồng với Fjob để hỗ trợ Fjob thực hiện tất cả hoặc một phần
                các Dịch vụ Fjob cho bạn, bao gồm nhưng không giới hạn, các dịch vụ sau:
                <div className="pl-4">
                  <div>
                    - Dịch vụ hồ sơ/đánh giá.- Dịch vụ nghiên cứu thị trường và phân tích sử dụng
                    trang web.
                  </div>
                  <div>- Cung cấp các thông tin, khóa học, sự kiện phù hợp</div>
                </div>
              </li>
              <li>
                Các đối tác chiến lược làm việc với Fjob để cung cấp một trong các Dịch vụ của Fjob
                hoặc để hỗ trợ tiếp thị và giới thiệu tới người dùng Fjob.
              </li>
              <li>
                Trường học/cao đẳng/đại học/viện nghiên cứu mà bạn đã theo học hoặc người giới thiệu
                để xác minh trình độ học vấn của bạn.
              </li>
              <li>Các cơ quan chuyên môn nơi bạn được công nhận trình độ chuyên môn.</li>
              <li>
                Các tư vấn chuyên nghiệp của Fjob khi có nhu cầu tìm hiểu cơ bản với mục đích tư vấn
                cho Fjob.
              </li>
              <li>
                Bất cứ bên thứ ba nào sở hữu một phần hoặc tất cả tài sản hoặc việc kinh doanh của
                Fjob (bao gồm các khách hàng và các khoản phải thu thương mại) nhằm mục đích hỗ trợ
                bên thứ ba tiếp tục cung cấp một phần hoặc toàn bộ các Dịch vụ Fjob mà họ sở hữu.
              </li>
              <li>Các trường hợp khác được cho phép theo quy định pháp luật về bảo mật dữ liệu.</li>
            </ul>
          </li>
          <li>
            Ngoài những trường hợp ở trên, bạn sẽ được thông báo khi thông tin cá nhân của bạn có
            thể đi đến các bên thứ ba, và bạn sẽ có cơ hội lựa chọn không chia sẻ thông tin này.
          </li>
          <li>
            Fjob không cho phép bất kỳ bên thứ ba nào được phép chia sẻ lại thông tin đã được cung
            cấp cho một bên khác hoặc sử dụng không đúng mục đích đã được ký kết trong hợp đồng với
            Fjob.
          </li>
        </ul>
        <h3>8. NGHĨA VỤ CỦA BẠN ĐỐI VỚI THÔNG TIN CÁ NH N CỦA MÌNH </h3>
        <ul className={styles.ul_raw}>
          <li>
            Bạn có trách nhiệm cung cấp cho Fjob các thông tin của bạn và cá nhân của người nào mà
            bạn cung cấp cho chúng tôi một cách chính xác, không gây nhầm lẫn, đầy đủ và gần nhất,
            và có trách nhiệm cập nhật thông tin cá nhân này khi có sự sai lệch, nhầm lẫn, không đầy
            đủ và lỗi thời bằng cách liên lạc với Fjob qua email fjob.support@zetagroup.vn.
          </li>
          <li>
            Trong trường hợp bạn có nhu cầu cung cấp thông tin cá nhân của một người nào đó cho Fjob
            mà không phải là thông tin của bạn (ví dụ, người giới thiệu hoặc người bảo lãnh). Trong
            trường hợp này, bạn nên thông báo những người này về việc cung cấp thông tin cá nhân của
            họ cho Fjob, nhằm đảm bảo sự đồng ý của họ cho việc cung cấp thông tin và để họ biết địa
            chỉ để tìm Thông Báo Chính Sách này (tại mục Chính Sách Bảo Mật trên trang web của chúng
            tôi).
          </li>
        </ul>
        <h3>9. CHUYỂN THÔNG TIN CÁ NH N NGOÀI PHẠM VI ĐỊA PHƯƠNG CỦA BẠN </h3>
        Fjob có thể cần chuyển thông tin cá nhân của bạn ra ngoài phạm vi địa phương của bạn nếu có
        bất kỳ nhà cung cấp dịch vụ hoặc các đối tác chiến lược (“các công ty nước ngoài”) tham gia
        cung cấp một phần của một trong các Dịch vụ của Fjob.
        <h3>10. CÁC TRANG LIÊN KẾT </h3>
        <ul className={styles.ul_raw}>
          <li>
            Các trang web thuộc Fjob có thể chứa các liên kết đến các trang của bên thứ ba. Fjob
            không chịu trách nhiệm đối với các trang web của các bên thứ ba này. Bất cứ thông tin cá
            nhân nào của bạn sẵn có trên các trang đó sẽ không được hưởng lợi từ Chính Sách Bảo Mật
            này và sẽ phụ thuộc vào chính sách bảo mật của bên thứ ba liên quan (nếu có). Chúng tôi
            không chịu trách nhiệm đối với những thực tiễn được triển khai bởi bất kỳ trang web hoặc
            dịch vụ nào được liên kết đến hoặc từ Dịch vụ của chúng tôi, bao gồm thông tin hoặc nội
            dung có trong đó. Xin lưu ý rằng khi bạn sử dụng liên kết để đi từ Dịch vụ của chúng tôi
            đến trang web hoặc dịch vụ khác, Chính sách bảo mật của chúng tôi không áp dụng đối với
            những trang web hoặc dịch vụ bên thứ ba đó. Quá trình duyệt web và tương tác của bạn
            trên bất kỳ trang web hoặc dịch vụ của bên thứ ba nào, bao gồm trang web hoặc dịch vụ có
            liên kết trên trang web của chúng tôi, phải tuân theo các quy định và chính sách của
            riêng bên thứ ba đó. Ngoài ra, bạn đồng ý rằng chúng tôi không có trách nhiệm và không
            có quyền kiểm soát đối với bất kỳ bên thứ ba nào mà bạn cho phép truy cập vào Nội dung
            của người dùng của mình. Nếu bạn đang sử dụng trang web hoặc dịch vụ bên thứ ba và bạn
            cho phép trang web hoặc dịch vụ đó truy cập vào Nội dung của người dùng của mình, bạn
            phải tự chịu rủi ro khi thực hiện việc đó.
          </li>
          <li>
            Bạn có thể truy cập vào trang của chúng tôi bằng cách sử dụng dịch vụ đăng nhập như là
            Facebook Connect. Dịch vụ này sẽ xác thực danh tính của bạn và cung cấp cho bạn các tùy
            chọn để chia sẻ thông tin cá nhân nhất định với chúng tôi như tên và địa chỉ email để
            nhập trước vào mẫu đăng ký của chúng tôi. Các dịch vụ như Facebook Connect cung cấp cho
            bạn các tùy chọn để đăng thông tin về các hoạt động của bạn trên trang web này trên
            trang hồ sơ cá nhân của bạn để chia sẻ với những người khác trong mạng lưới của bạn.
          </li>
          <li>
            Trang web của chúng tôi bao gồm các Tính năng Truyền thông Xã hội, chẳng hạn như các
            widget và nút like/share/comment Facebook, hoặc các chương trình tương tác mini chạy
            trên trang web của chúng tôi. Những tính năng này có thể thu thập địa chỉ IP của bạn,
            trang mà bạn đang truy cập trên trang web của chúng tôi, và có thể cài đặt cookies để
            kích hoạt các Tính năng hoạt động tốt. Các Tính năng Truyền thông Xã hội và các widget
            được cung cấp bởi bên thứ ba hoặc cung cấp trực tiếp trên trang web của chúng tôi. Sự
            tương tác của bạn với những Tính năng này được quản lý bởi chính sách bảo mật của bên
            cung cấp.
          </li>
        </ul>
        <h3>11. SỰ ĐỒNG Ý CỦA BẠN </h3>
        <ul className={styles.ul_raw}>
          <li>
            Khi sử dụng các Dịch vụ của Fjob, bạn đồng ý với việc thu thập và sử dụng thông tin cá
            nhân của Fjob như được mô tả ở phần trên (có thể thay đổi theo thời gian) trừ khi và cho
            đến khi bạn thông báo điều ngược lại với Fjob qua email hotro@fjob.vn.
          </li>
          <li>
            Bên cạnh đó, bạn đồng ý với việc người giới thiệu, các trường học/cao đẳng/đại học/ học
            viện mà bạn đã theo học, các cơ quan chuyên môn nơi bạn được công nhận trình độ chuyên
            môn và các Nhà tuyển dụng công bố thông tin các nhân của bạn với Fjob.
          </li>
        </ul>
        <h3>12. QUYỀN RIÊNG TƯ CỦA TRẺ EM </h3>
        Fjob không chủ định thu thập hoặc yêu cầu bất kỳ thông tin nào từ bất kỳ ai dưới 13 tuổi
        hoặc không chủ ý cho phép những người đó đăng ký Dịch vụ. Dịch vụ và nội dung của Dịch vụ
        không nhắm tới trẻ em dưới 13 tuổi. Trong trường hợp chúng tôi biết rằng mình đã thu thập
        thông tin cá nhân từ trẻ em dưới 13 tuổi mà không có sự chấp thuận của cha mẹ, chúng tôi sẽ
        xóa thông tin đó nhanh nhất có thể. Nếu bạn cho rằng chúng tôi có thể có thông tin từ hoặc
        về trẻ dưới 13 tuổi, vui lòng liên hệ với chúng tôi.
        <h3>THÔNG TIN LIÊN LẠC </h3>
        Nếu bạn có câu hỏi về Thông Báo Chính Sách này, vui lòng gửi email tới địa chỉ hotro@fjob.vn
        để được giải đáp nhanh nhất.
      </div>
    </div>
  )
}
