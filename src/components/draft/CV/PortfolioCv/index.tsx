import React, { FC, useState } from 'react'

import { Image, message } from 'antd'
import { useAppSelector } from 'src/redux'
import { useRouter } from 'next/router'
import { storageConstant } from 'src/constants/storageConstant'
import defaultConstant from 'src/constants/defaultConstant'
import Academic from './Academic'
import InterestJob from './InterestJob'
import styles from './portfolio-cv.module.scss'
import Salary from './Salary'
import Skill from './Skill'
import UploadCV from './UploadCV'
import Experience from './Experience'

const PortfolioCv: FC = () => {
  const router = useRouter()


  const profile = useAppSelector(state => state.user.profile || {})

  const [flagExp, setFlagExp] = useState(false)

  const handleNextStep = () => {
    const { academicId, profSkills, expectSalaryFrom, expectSalaryTo, favCats, hasExperience } = profile

    if (!favCats?.length) return message.warning("Bạn phải thêm ngành nghề quan tâm làm việc để tiếp tục ứng tuyển!")
    if (!(expectSalaryFrom && expectSalaryTo)) return message.warning("Bạn phải thêm mức lương mong muốn để tiếp tục ứng tuyển!")
    if ((flagExp && hasExperience === 0) || typeof hasExperience !== 'number')
      return message.warning("Bạn phải thêm kinh nghiệm làm việc để tiếp tục ứng tuyển!")

    if (!academicId) return message.warning("Bạn phải thêm trình độ học vấn để tiếp tục ứng tuyển!")
    if (!profSkills?.length) return message.warning("Bạn phải thêm kỹ năng để tiếp tục ứng tuyển!")

    const slug = decodeURIComponent(router.query.next as string).split("/") || []

    localStorage.setItem(storageConstant.localStorage.flagAutoApplyJob, slug[slug.length - 1])

    if (favCats?.length && expectSalaryFrom && expectSalaryTo && academicId
      && typeof hasExperience === 'number' && profSkills?.length)  
      router.push({ pathname: decodeURIComponent(String(router.query.next)) })
  }

  return (
    <div className={`profile portfolio ${styles.main}`}>
      <div className={styles.profile}>
        <div className={styles.item}>
          <Image
            className={styles.cover}
            width={1140}
            preview={false}
            src="/assets/images/banners/cover-person.png"
          />
          <div className={styles.info}>
            <div className="d-flex flex-row w-100">
              {/* <Avatar size={120} icon={<Image preview={false} src={profile?.avatar} />} /> */}

              <div className={styles.avatar}>
                <img alt="" src={profile.avatar || defaultConstant.defaultAvatarUser} />
              </div>
              <div
                className="d-flex flex-column justify-content-center align-items-start ml-4"
              >
                <span style={{ marginTop: '20px' }} className={styles.name}>
                  {profile?.name}
                </span>
                <span style={{ marginTop: '30px' }} className={styles.email}>
                  {profile?.email}
                </span>
                {profile?.verifyKyc ? (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/isVerified.svg" />
                    &nbsp;
                    <span>Tài khoản đã được xác thực</span>
                  </div>
                ) : (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/unVerified.svg" />
                    &nbsp;
                    <span>Tài khoản chưa được xác thực</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.porfolio_main}>
        <UploadCV />
        <InterestJob />
        <Salary />
        <Experience setFlagExp={setFlagExp} />
        <Academic />
        <Skill />
      </div>

      {router.query.next &&
        <button type="button" onClick={handleNextStep} className={styles.btn_next}>Tiếp tục</button>}
    </div>
  )
}

export default PortfolioCv