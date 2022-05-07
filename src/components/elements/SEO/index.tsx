import { NextSeo } from 'next-seo'
import React, { FC } from 'react'

export default function SEO(){
  return (
    <NextSeo
      title="Fjob | Nền tảng tìm việc làm dành cho giới trẻ"
      titleTemplate="%s | Fjob"
      defaultTitle="Fjob | Nền tảng tìm việc làm dành cho giới trẻ"
      description="Fjob là nền tảng tuyển dụng hiện đại, áp dụng công nghệ F-Matching, tự động tối ưu đề xuất nhiều công việc đa dạng phù hợp với ứng viên.
       Fjob tạo cơ hội để nhà tuyển dụng và ứng viên chủ động liên hệ ngay trên ứng dụng."
      // canonical={process.env.NEXT_PUBLIC_SITE_URL}
      facebook={{
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      }}
      openGraph={{
        type: 'website',
        // url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
        title: 'Fjob | Nền tảng tìm việc làm dành cho giới trẻ',
        description:
          'Fjob là nền tảng tuyển dụng hiện đại, áp dụng công nghệ F-Matching, tự động tối ưu đề xuất nhiều công việc đa dạng phù hợp với ứng viên. Fjob tạo cơ hội để nhà tuyển dụng và ứng viên chủ động liên hệ ngay trên ứng dụng.',

        images: [
          {
            url: 'https://dev.fjob.com.vn/_next/image?url=%2Fassets%2Fimages%2FEEdashboard%2Fbanner.png&w=1200&q=75',
            width: 1200,
            height: 630,
            alt: 'Cover image Fjob',
          },
        ],
        // site_name: 'fjob.vn',
      }}
      additionalMetaTags={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
      ]}
    />
  )
}
