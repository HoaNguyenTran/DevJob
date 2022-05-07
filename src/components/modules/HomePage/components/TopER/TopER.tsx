import React from 'react'
import Slider from 'react-slick'
import styles from './TopER.module.scss'

const sliderSettings = {
  swipeToSlide: true,
  dots: false,
  infinite: true,
  arrows: false,
  autoplay: true,
  speed: 500,
  rows: 2,
  slidesToShow: 6,
  slidesToScroll: 6,

  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 5,
      },
    },
    // {
    //   breakpoint: 1024,
    //   settings: {
    //     slidesToShow: 5,
    //     slidesToScroll: 5,
    //   },
    // },
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
  ],
}

const TopER = (): JSX.Element => (
  <div className={styles.topER}>
    <div className={styles.topER_wrap}>
      <div className={styles.topER_title}>Nhà tuyển dụng hàng đầu</div>
      <Slider {...sliderSettings}>
        {[...Array(12).keys()].map((item) =>
          <div key={item} className={styles.brand}>
            <div className={styles.inner}>
              <img alt="" src={`/assets/images/homepage/topER/topER-${String(item + 1).padStart(2, '0')}.png`} />
            </div>
          </div>
        )}
      </Slider>
    </div>
  </div>
)

export default TopER