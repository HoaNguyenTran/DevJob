import { getSearchAroundJobsByLocationApi } from 'api/client/job'
import React, { useEffect, useState } from 'react'
import JobSlider from 'src/components/elements/JobSlider/JobSlider'
import LinkTo from 'src/components/elements/LinkTo'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { handleError } from 'src/utils/helper'
import styles from "./AroundJob.module.scss"

const AroundJob = (): JSX.Element => {

  const [aroundJobs, setAroundJobs] = useState<JobGlobal.Job[]>([])

  const profile = useAppSelector(state => state?.user?.profile || {})
  const { latitude, longitude } = (profile.addresses || []).find(address => address.main === 1) || {}

  // useEffect(() => {
  //   let geolocation = {
  //     latitude,
  //     longitude
  //   }
  //   navigator.geolocation.watchPosition(
  //     position => {
  //       // console.log("i'm tracking you!", position)
  //       geolocation = {
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       }
  //     },
  //     error => {
  //       // if (error.code === error.PERMISSION_DENIED) console.log('you denied me :-(')
  //     },
  //   )
  //   localStorage.setItem(storageConstant.localStorage.geolocation, JSON.stringify(geolocation))
  // }, [])




  useEffect(() => {
    if (latitude && longitude) {
      const fetchData = async () => {
        try {
          const { data } = await getSearchAroundJobsByLocationApi({ lat: latitude || 0, lng: longitude || 0, distance: 10000 })
          setAroundJobs(data.data)
        }
        catch (error) {
          handleError(error)
        }
      }
      fetchData()
    }
  }, [])

  if (!latitude || !longitude) return <></>

  return <div className={styles.aroundJob}>
    {aroundJobs.length > 0 && (
      <div className={styles.aroundJob_wrap}>
        <div>
          <div className={styles.header}>
            <div className={styles.title}>
              {/* <img src="/assets/icons/color/hot-job.svg" alt="" /> */}
              <span>Việc làm Gần Bạn</span>
            </div>
            <div className={styles.link}>
              <LinkTo href={`${routerPathConstant.suitableDistance}`} target="_blank">
                <span>Xem tất cả</span>
                <img alt="" src="/assets/icons/color/arrow-right.svg" />
              </LinkTo>
            </div>
          </div>
          <JobSlider flag="aroundJob" data={aroundJobs} row={4} />
        </div>
      </div>
    )
    }
  </div>

}

export default AroundJob