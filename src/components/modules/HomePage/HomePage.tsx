
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { routerPathConstant } from 'src/constants/routerConstant';
import { storageConstant } from 'src/constants/storageConstant';
import useWindowDimensions from 'src/hooks/useWindowDimensions';
import { useAppSelector } from 'src/redux';
import Banner from './components/Banner/Banner';
import Introduction from './components/Introduction/Introduction';
import styles from "./HomePage.module.scss"



// const Banner = dynamic(() => import('./components/Banner/Banner'))
const HotJob = dynamic(() => import('./components/HotJob/HotJob'))
const UrgentJob = dynamic(() => import('./components/UrgentJob/UrgentJob'))
const NewJob = dynamic(() => import('./components/NewJob/NewJob'))
const AroundJob = dynamic(() => import('./components/AroundJob/AroundJob'))
const TopER = dynamic(() => import('./components/TopER/TopER'))
const SliderSmall = dynamic(() => import('./components/SliderSmall/SliderSmall'))
const Blog = dynamic(() => import('./components/Blog/Blog'))
// const Intro = dynamic(() => import('./components/Intro/Intro'))
const OutstandingProfessions = dynamic(() => import('./components/OutstandingProfessions/OutstandingProfessions'))
const SuitableJob = dynamic(() => import('./components/SuitableJob/SuitableJob'))



const HomePage = (): JSX.Element => {
  const router = useRouter()

  const { width } = useWindowDimensions()

  const profile = useAppSelector(state => state.user.profile || {})

  const checkFinishSignUp = async () => {
    const rawProcess = localStorage.getItem(storageConstant.localStorage.signupProcess)
    if (rawProcess) {
      const infoProcess = JSON.parse(rawProcess)
      if (!infoProcess.status && infoProcess.code === profile.code) {
        router.replace(routerPathConstant.signUp)
      } else {
        localStorage.removeItem(storageConstant.localStorage.signupProcess)
      }
    }
  }

  useEffect(() => {
    checkFinishSignUp()
  }, [])

  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_wrap}>
        <Banner />
        <TopER />
        <HotJob />
        <SliderSmall />
        <UrgentJob />
        <div className={styles.homepage_slider}>
          <div className={styles.slider_wrap}>
            <img alt="" src={`/assets/images/homepage/slider-large/slider-0${width && width < 675 ? "2" : "1"}.png`} />
          </div>
        </div>
        <NewJob />
        <SuitableJob />
        <AroundJob />
        <OutstandingProfessions />
        <Blog />
        <Introduction />
        {/* <Intro /> */}
      </div >
    </div >
  )
}

export default HomePage
