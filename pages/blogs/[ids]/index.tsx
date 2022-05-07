/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'

import { Divider, Image, message, Spin } from 'antd'
import parse from 'html-react-parser'
import { useRouter } from 'next/router'
import { handleError, isServer, newWindowPopupCenter } from 'src/utils/helper'

import { ClockCircleOutlined, FacebookOutlined } from '@ant-design/icons'
import Slider from '@ant-design/react-slick'

import { NextSeo } from 'next-seo'
import { configConstant } from 'src/constants/configConstant'
import moment from 'moment'
import { getBlogApi, getBlogBySlugApi, getListCategory } from 'api/client/blog'
import { GetServerSideProps } from 'next'
import defaultConstant from 'src/constants/defaultConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { roleConstant } from 'src/constants/roleConstant'
import styles from './item-blog.module.scss'

const sliderSettings = {
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

enum TypeCategory {
  ER = 1,
  EE = 2,
  ALL = 3
}


const ItemBlog = (data: { data: BlogGlobal.Blog }): JSX.Element => {
  const blogs = data.data

  const router = useRouter()
  const [newsData, setNewsData] = useState<BlogGlobal.Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [listCategory, setListCategory] = useState<BlogGlobal.CategoryBlog[]>([])

  const type = String(router.query.type)
  const category = Number(router.query.category)
  const typeBlog = type === roleConstant.EE.name ? TypeCategory.EE : roleConstant.ER.name === type ? TypeCategory.ER : TypeCategory.ALL as number

  useEffect(() => {
    getListCategoryBlog()
  }, [])

  const getListCategoryBlog = async () => {
    try {
      const result = await getListCategory(typeBlog);
      setListCategory(result.data);
    } catch (error) {
      handleError(error)
    }
  }

  const handleNews = async () => {
    try {
      const params = category ? {
        limit: 6,
        fjobNewCategoryId: category || 0,
      } : {
        limit: 6,
        type: typeBlog
      }
      const fnews = await getBlogApi(params)
      setNewsData(fnews.data.data)
      setLoading(false)
    } catch (error) {
      handleError(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    handleNews()
  }, [])

  const onClickItem = (slug) => {
    const query = {
      type: router.query.type,
      category: router.query.category
    }
    router.push({ pathname: `${routerPathConstant.blogs}/${slug}`, query })
  }


  const renderItemsBestBlogs = newsData.map(item => (
    <div
      key={item.id}
      className={styles.item}
      onClick={() => onClickItem(item.slug)}
    >
      <div>
        <Image
          preview={false}
          src={item.imageUrl}
          style={{ borderRadius: '6px' }}
          width={160}
          height={90}
        />
      </div>
      <div className={styles.item_content}>
        <p className={styles.item_content_title}>{item.title}</p>
        <div className={styles.item_category}>
          {listCategory.find(i => i.id === item.fjobNewCategoryId)?.name || "Fjob"}
        </div>
        <div>
          <ClockCircleOutlined style={{ color: '#838383' }} />
          <span className={styles.item_time}>{moment(item.startTime).format(configConstant.displayTime.DDMMYYY)}</span>
        </div>
      </div>
    </div>
  ))

  const renderItemsInterestBlogs = newsData.map(item => (
    <div key={item.id}>
      <div
        className={styles.news}
        onClick={() => onClickItem(item.slug)}
      >
        <div className={styles.new_image}>
          <Image
            preview={false}
            style={{ borderRadius: '6px' }}
            src={
              item.imageUrl ?? defaultConstant.defaultLinkAvatarUser
            }
            className={styles.image}
          />
        </div>
        <div className={styles.news_content}>
          <p className={styles.item_content_title}>{item.title}</p>
          <div className={styles.category_box}>
            <div className={styles.category_title}>
              <span className={styles.start_time}>{listCategory.find(i => i.id === item.fjobNewCategoryId)?.name || "Fjob"} - </span>{moment(item.startTime).format(configConstant.displayTime.DDMMYYY)}
            </div>
          </div>
          <span className={styles.news_summary}>{item.summary}</span>
        </div>
      </div>
    </div>
  ))

  const sharePostFb = () => {
    newWindowPopupCenter({
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
        typeof window !== 'undefined' ? window.location.href : '',
      )}`,
      title: 'Facebook Dialog',
      w: 500,
      h: 500,
    })
  }

  const onClickBlog = () => {
    const query = {
      type: router.query.type,
      category: router.query.category
    }
    router.push({ pathname: `${routerPathConstant.blogs}`, query })
  }

  const getThumbnailUrl = () => {
    let url = blogs.imageUrl || defaultConstant.defaultLinkAvatarUser
    if ((router.query?.type as string)?.toLowerCase() === 'numerology' && router.query?.number) {
      switch (Number(router.query.number)) {
        case 2:
          url = configConstant.numerology.two
          break
        case 3:
          url = configConstant.numerology.three
          break
        case 4:
          url = configConstant.numerology.four
          break
        case 5:
          url = configConstant.numerology.five
          break
        case 6:
          url = configConstant.numerology.six
          break
        case 7:
          url = configConstant.numerology.seven
          break
        case 8:
          url = configConstant.numerology.eight
          break
        case 9:
          url = configConstant.numerology.nine
          break
        case 10:
          url = configConstant.numerology.ten
          break
        case 11:
          url = configConstant.numerology.eleven
          break
        default:
          break
      }
    }
    return url
  }
  return (
    <>
      <NextSeo
        title={blogs.title}
        description={blogs.summary}
        openGraph={{
          type: 'website',
          title: blogs.title,
          description: blogs.summary,
          images: [
            {
              url: getThumbnailUrl(),
              width: 1200,
              height: 630,
              alt: 'Cover image Fjob',
            },
          ],
        }}
      />
      <div className={styles.main}>
        {loading && !isServer() ? (
          <div className="d-flex justify-content-center align-items-center vh-100 vw-100 ">
            <Spin />
          </div>
        ) : (
          <div className={styles.main_wrap}>
            <Image
              preview={false}
              src="/assets/images/banners/BannerDetail.png"
            />
            <div className={styles.breadcrumb}>
              <div onClick={() => router.push("/")}>
                <img alt="" src="/assets/icons/default/home.svg" width={20} height={20} />
              </div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>
                <img alt="" src="/assets/icons/default/arow-button-small.svg" />
              </div>
              <div style={{ fontWeight: "bold", cursor: "pointer" }} onClick={onClickBlog}>
                Blog
              </div>
              <div style={{ paddingLeft: 5, paddingRight: 5 }}>
                <img alt="" src="/assets/icons/default/arow-button-small.svg" />
              </div>
              <div style={{ cursor: "pointer" }}>
                {blogs.title}
              </div>
            </div>
            <div className={styles.main_wrap_body}>
              <div className={styles.main_wrap_body_content}>
                <p className={styles.main_wrap_body_content_title}>{blogs.title}</p>
                <p className={styles.main_wrap_body_content_summary}>{blogs.summary}</p>
                <Divider />
                <div>
                  <ClockCircleOutlined style={{ color: '#838383' }} />
                  <span className={styles.main_wrap_body_content_time}>{moment(blogs.startTime).format("dddd DD-MM-YYYY")}</span>
                </div>
                <div className={styles.main_wrap_body_content_detail}>
                  <div className={styles.main_wrap_body_content_detail_img}>
                    <Image preview={false} src={blogs.imageUrl} />
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <span className={styles.main_wrap_body_content_detail_text}>
                      {!!blogs.content && parse(blogs.content)}
                    </span>
                  </div>
                </div>
                <Divider />
                <div className={`mt-4 ${styles.social_sharing}`}>
                  <div className={styles.title}>Chia sẻ bài viết </div>
                  <div className={`${styles.btn_soccial}`}>
                    <FacebookOutlined
                      style={{ color: 'var(--primary-color)', fontSize: 40 }}
                      className="cursor-pointer"
                      onClick={() => sharePostFb()}
                    />
                  </div>
                </div>
                {
                  blogs?.newTag?.length > 0 ? (
                    <>
                      <Divider />
                      <div className={styles.tags}>
                        {(blogs?.newTag || []).map((item, index) => (
                          <div key={index} className={styles.tags_item}>
                            {`#${item.title}`}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : null
                }

              </div>
              <div className={styles.main_wrap_body_relative}>
                <span className={styles.main_wrap_body_relative_title}>Xem nhiều nhất</span>
                <Divider />
                {renderItemsBestBlogs}
              </div>
            </div>
            <div className={styles.main_wrap_another}>
              <span className={styles.main_wrap_another_title}>Bài viết liên quan</span>
              <Slider {...sliderSettings}>{renderItemsInterestBlogs}</Slider>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    if (typeof ctx.query.ids === "string") {
      const { data } = await getBlogBySlugApi(ctx.query.ids)

      return {
        props: { data },
      }
    }
    return { notFound: true }
  } catch (error) {
    return {
      notFound: true
    }
  }
}
export default ItemBlog
