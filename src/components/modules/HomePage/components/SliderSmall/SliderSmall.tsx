import { Image } from "antd"
import { getBannersByTypeApi } from "api/client/other"
import router from "next/router"
import React, { FC, useEffect, useState } from 'react'
import Slider from "react-slick"
import { handleError } from "src/utils/helper"
import styles from "./SliderSmall.module.scss"

const settingsSlider = {
  dots: false,
  arrows: false,
  infinite: true,
  pauseOnHover: true,
  autoplay: true,
  speed: 1000,
  autoplaySpeed: 3000,
  slidesToScroll: 3,
  slidesToShow: 3,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

const SliderSmall: FC = () => {
  
  const [banners,setBanners] = useState<BannerDto.Banner[]>()

  const handleData = async () => {
    try {
      const { data } = await getBannersByTypeApi(1)
      setBanners(data.data)
    } catch (error) {
      handleError(error)
      }
  }

  useEffect(() => {
    handleData()
  },[])

  return (
    <div className={styles.slider}>
      <div className={styles.slider_wrap}>
        <Slider {...settingsSlider}>
          {banners && banners.map((item) => <div key={item.id} className={styles.slider}>
            <div className={styles.item} onClick={()=>router.push(item.bannerLink)}>
              <Image preview={false} style={{borderRadius:"15px"}} alt="" src={item.bannerUrl} />
            </div>
          </div>)}
        </Slider>
      </div>
    </div>
)
}

export default SliderSmall