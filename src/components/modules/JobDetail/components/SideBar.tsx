import React, { FC } from 'react'

import { Rate } from 'antd'
import moment from 'moment'
import Slider from 'react-slick'
import { configConstant } from 'src/constants/configConstant'
import { convertObjectToArraytData } from 'src/utils/helper'

import styles from './Job.module.scss'

const SideBar: FC<any> = ({ dataSSR, jobId }) => {
  const getGenderUser = (genderKey) => convertObjectToArraytData(configConstant.gender).find(item => item.key === genderKey)?.text || ""
  const getAddressCompany = (companiesAddress = []) => {
    let text = "";
    const lengthAddress = companiesAddress.length;
    companiesAddress.forEach((element: any, i) => {
      text += `${element.shortAddress || ""}|${(lengthAddress - 1 !== i && i !== 0) ? "\n" : ""}`
    });
    return companiesAddress.length ? text : "Không có";
  }
  const { company = {}, user = {} } = dataSSR || {}
  const images = JSON.parse(company.imagesJson || "[]")
  const isCompanyCreatedJob = dataSSR.companyId;
  const imageOwnJob = isCompanyCreatedJob ? company.avatar : user.avatar;
  const nameOwnJob = isCompanyCreatedJob ? company.name : user.name;
  const addressOwnJob = getAddressCompany(company.companyAddress);
  const titleInformation = `Thông tin ${isCompanyCreatedJob ? "công ty" : "nhà tuyển dụng"}`;
  return (
    <div className={styles.detail_sub_wrap}>
      <div className={styles.detail_sub_avt}>
        <img src={imageOwnJob || configConstant.defaultAvatar} alt="" />
        <div className='content'>
          <div className={styles.title}>{nameOwnJob || ""}</div>
          <Rate disabled defaultValue={5} />
        </div>
      </div>
      <div className={styles.information_own_job}>
        <div className={styles.information_company}>
          <h3 style={{ fontSize: "16px" }} className='py-3'>{titleInformation}</h3>
          {
            isCompanyCreatedJob ?
              <>
                <div className={styles.item}><img src='/assets/icons/color/location.svg' alt='location' />
                  <span className={styles.title} style={{ whiteSpace: "pre" }}>Địa chỉ: </span>
                </div>
                <span className={styles.text}>{addressOwnJob.split("|").map((item, i) => <p key={i}>{item}</p>) || "Không có"} </span>
                <div className={styles.item}>
                  <img src='/assets/icons/color/phone.png' alt='phone' />
                  <span className={styles.title}> Điện thoại: </span>
                  {company.contactPhone || "Không có"}
                </div>
                <div className={styles.item}><img src='/assets/icons/color/website.png' alt='website' />
                  <span className={styles.title}>Website:</span>
                  {company.website || "không có"}
                </div>
              </> :
              <>
                <div className={styles.item}>
                  <img src='/assets/icons/color/year.svg' alt='location' />
                  <span className={styles.title}>Ngày sinh: </span>
                  {
                    user.birthday ? moment(user.birthday).format(configConstant.displayTime.DDMMYYY) : "Không có"
                  }
                </div>
                <div className={styles.item}>
                  <img src='/assets/icons/color/sex.svg' alt='location' />
                  <span className={styles.title}>Giới tính: </span>
                  {
                    user.gender ? getGenderUser(user.gender) : "Không có"
                  }
                </div>
                <div className={styles.item}>
                  <img src='/assets/icons/color/location.svg' alt='location' />
                  <span className={styles.title}>Email: </span >
                  {user.email || "Không có"}
                </div>
                <div className={styles.item}>
                  <img src='/assets/icons/color/location.svg' alt='location' />
                  <span className={styles.title}>Số điện thoại: </span >
                  {user.phoneNumber || "Không có"}
                </div>
              </>
          }

        </div>
        {
          !!isCompanyCreatedJob &&
          <>
            <div className={`${styles.information_scale} mt-4`}>
              <div className={styles.header}>
                Quy mô
              </div>
              <div className={styles.item}><img src='/assets/icons/color/group.png' alt='location' /><span className={styles.title}>Quy mô: </span>{company.numEmployee || 0} nhân viên</div>

            </div>
            <div className={`${styles.introduction} mt-4`}>
              <div className={`${styles.header} mb-2`}>
                Giới thiệu
              </div>
              {company.desc || ""}
            </div>
            {
              !!images.length &&
              <div className={`${styles.introduction} mt-4`}>
                <div className={`${styles.header} mb-3`}>
                  Hình ảnh liên quan
                </div>
                <Slider {...{
                  dots: true,
                  infinite: true,
                  speed: 500,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  autoplay: true,
                }}>
                  {
                    images.map((item, i) =>
                      <div key={i}>
                        <img src={item.image || configConstant.defaultPicture} alt="slider" className='w-100 object-fit-cover' />
                      </div>
                    )
                  }
                </Slider>
              </div>
            }

          </>
        }

      </div>


      {/* <div className={styles.detail_sub_content}>
        <div className={styles.detail_sub_title}>Ứng tuyển trên App Fjob để nhận nhiều lợi ích</div>
        <div className={styles.detail_sub_subtitle}>
          Bạn vui lòng tải về App Fjob và làm theo hướng dẫn
        </div>
        <ol className={styles.detail_sub_list}>
          <li>Mở màn hình &quot;Tìm việc&quot;</li>
          <li>Nhấn nút Quét mã QR</li>
          <li>Quét mã hiển thị dưới đây</li>
        </ol>
      </div>
      <div className={styles.detail_sub_qr}>
        <QRCode
          id="qrcode"
          value={`fjob${process.env.NEXT_PUBLIC_WEB_ENV !== configConstant.environment.production && "d"}://JobDetail/${jobId}`}
          size={200}
          level="H"
          includeMargin
        />
      </div>
      <Divider />
      <div className={`mt-4 ${styles.social_sharing}`}>
        <div className={styles.title}>Chia sẻ lên: </div>
        <div className={`${styles.btn_soccial}`}>
          <FacebookOutlined
            style={{ color: 'var(--primary-color)' }}
            className="cursor-pointer"
            onClick={() => sharePostFb()}
          />
        </div>
      </div> */}
    </div>
  )
}

export default SideBar
