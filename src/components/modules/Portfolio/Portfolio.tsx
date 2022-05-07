import { message } from 'antd';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { storageConstant } from 'src/constants/storageConstant';
import { useAppSelector } from 'src/redux';
import useWindowDimensions from 'src/hooks/useWindowDimensions';
import { calcTranslateX, calcWidthTranslateX } from 'src/utils/helper';
import styles from "./Portfolio.module.scss"
import CV from './components/CV/CV';
import OccupationInterest from './components/OccupationInterest/OccupationInterest';
import ExpectSalary from './components/ExpectSalary/ExpectSalary';
import WorkExperience from './components/WorkExperience/WorkExperience';
import AcademicLevel from './components/AcademicLevel/AcademicLevel';
import Academic from './components/Academic/Academic';
import MainSkill from './components/MainSkill/MainSkill';
import InfoHeader from './components/InfoHeader/InfoHeader';

const PortfolioCpn = ({ setFlagExp }) =>
  <div>
    <OccupationInterest />
    <ExpectSalary />
    <WorkExperience setFlagExp={setFlagExp} />
    <AcademicLevel />
    <Academic />
    <MainSkill />
  </div>

const CVCpn = () => <div>
  <CV />
</div>

const Portfolio = (): JSX.Element => {
  const router = useRouter()
  const profile = useAppSelector(state => state.user.profile || {})

  const [tabInfo, setTabInfo] = useState(0)
  const [flagExp, setFlagExp] = useState(false)

  const SCREEN = useWindowDimensions();

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
      router.push(decodeURIComponent(router.query.next as string))
  }

  return (
    <div className={`portfolio ${styles.portfolio}`}>
      <InfoHeader setTabInfo={setTabInfo} />
      <div className={styles.portfolio_tab}>
        <div className={styles.portfolio_overlay}
          style={{
            transform: `translateX(${calcTranslateX(SCREEN.width, tabInfo)}px)`,
            width: `${calcWidthTranslateX(SCREEN.width) - 10}px`
          }}
        />
        <div className={styles.tab_tab} onClick={() => { setTabInfo(0) }}>
          <span>
            Hồ sơ cá nhân
          </span>
        </div>
        <div className={styles.tab_tab} onClick={() => { setTabInfo(1) }}>
          <span>
            CV
          </span>
        </div>
      </div>
      {!tabInfo ? <PortfolioCpn setFlagExp={setFlagExp} /> : <CVCpn />}

      {router.query.next &&
        <div className={styles.btn_next} >
          <button type="button" onClick={handleNextStep}>Tiếp tục</button>
        </div>
      }
    </div>
  )
}

export default Portfolio