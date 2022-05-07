import React, { FC, useEffect, useState } from 'react'
import { getHotCategoryApi } from "api/client/job"
import Slider from 'react-slick'
import LinkTo from 'src/components/elements/LinkTo'
import { handleError } from 'src/utils/helper'
import styles from "./OutstandingProfessions.module.scss"

const settingsSlider = {
  dots: false,
  arrows: true,
  infinite: true,
  // pauseOnHover: true,
  // autoplay: true,
  // speed: 1000,
  // autoplaySpeed: 3000,
  slidesToScroll: 7,
  slidesToShow: 7,
  responsive: [
    {
      breakpoint: 1300,
      settings: {
        slidesToShow: 6,
        slidesToScroll: 6,
      },
    },
    {
      breakpoint: 1150,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 4,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

interface IOutstandingProfessions{
  styled?: any
}

const OutstandingProfessions: FC<IOutstandingProfessions> = ({styled = {}}) => {

  const [hotCategory, setHotCategory] = useState<any>([])

  useEffect(() => {
    async function fetchData() {
      const { data } = await getHotCategoryApi()
      setHotCategory(data.data);
    }
    try {
      fetchData()
    } catch (error) {
      handleError(error, { isIgnoredMessage: true })
    }
  }, [])


  return (
    <div className={styles.outstanding} style={styled}>
      <div className={styles.outstanding_wrap}>
        <div className={styles.outstanding_title}>Ngành nghề nổi bật</div>
        <Slider {...settingsSlider}>
          {hotCategory.map(item => <div key={item.id} className={styles.slider}>
            <LinkTo href={`/search?cate1=${item.id}`} className={styles.slider_item}>
              <div className={styles.image}>
                <img alt="" src={item.fjobCategoryAvatar} />
              </div>
              <div className={styles.title}>{item.name}</div>
              <div className={styles.job}>{item.numJobs} việc làm</div>
            </LinkTo>
          </div>)}
        </Slider>
      </div>
    </div>
  )
}

export default OutstandingProfessions