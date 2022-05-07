
import { getBlogApi } from 'api/client/blog';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react'
import Slider from 'react-slick';
import { routerPathConstant } from 'src/constants/routerConstant';
import { useAppSelector } from 'src/redux';
import { formatNumber } from 'src/utils/helper';
import styles from "./Blog.module.scss"

const settingsSlider = {
  dots: true,
  infinite: true,
  arrows: true,
  speed: 500,
  fade: true,
  swipeToSlide: true,
  // slidesToShow: 3,
  // slidesToScroll: 3,
  rows: 3,
  slidesPerRow: 3,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        // slidesToScroll: 2,
        slidesPerRow: 2,
      },
    },
    {
      breakpoint: 576,
      settings: {
        // slidesToScroll: 1,
        slidesPerRow: 1,
        dots: false
      },
    },
  ],
}


const Blog = (): JSX.Element => {
  const [blogs, setBlos] = useState<BlogGlobal.Blog[]>([])
  const router = useRouter()
  const { FjobNewCategory: blogCategoryList = [] } = useAppSelector(state => state.initData.data)

  useEffect(() => {
    async function fetchData() {
      const { data } = await getBlogApi({ page: 1, limit: 24, type: 1 })
      setBlos(data.data)
    }
    fetchData()
  }, [])

  const onClickBlog = (item) => {
    router.push({
      pathname: `${routerPathConstant.blogs}/${item.slug}`,
      query: {
        type: "employee",
      }
    })
  }

  return (
    <div className={styles.blog}>
      <div className={styles.blog_wrap}>
        <div className={styles.blog_title}>Chuyên mục Blog</div>
        <div className={styles.blog_slider}>
          <Slider {...settingsSlider}>
            {blogs.map(item => <div key={item.id}>
              <div className={styles.slider}>
                <div className={styles.slider_inner}>
                  <div className={styles.image} onClick={() => onClickBlog(item)}>

                    <img alt="" src={item.imageUrl} />
                  </div>
                  <div className={styles.title} onClick={() => onClickBlog(item)}>{item.title}</div>
                  <div className={styles.info}>
                    <div className={styles.left}>
                      <div className={styles.cate}>{blogCategoryList.find(i => i.id === item.fjobNewCategoryId)?.name || "Fjob"} -&nbsp;</div>
                      <div className={styles.date}>{item.startTime.slice(0, 10).split("-").reverse().join("/")}</div>
                    </div>
                    <div className={styles.view}>{formatNumber(item.view)} lượt xem</div>
                  </div>
                  <div className={styles.subtitle}>{item.summary}</div>
                </div>
              </div>
            </div>
            )}
          </Slider>

        </div>
      </div>
    </div>
  )
}

export default Blog