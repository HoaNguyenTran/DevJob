import React from 'react'
import JobDetailPage from 'src/components/modules/JobDetail/JobDetailPage'
import { getDetailJobSSRApi } from 'api/server/job'
import { Base64 } from 'js-base64'
import nookies from 'nookies'
import { NextSeo } from 'next-seo'
import { storageConstant } from 'src/constants/storageConstant'
import { getJobViewByIdApi } from 'api/client/other'
import defaultConstant from 'src/constants/defaultConstant'

export default function Jobs({ dataSSR }): JSX.Element {
  return (
    <>
      <NextSeo
        title={dataSSR?.title}
        description={dataSSR?.detailDesc}
        openGraph={{
          type: 'website',
          title: dataSSR?.title,
          // url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
          description: dataSSR?.detailDesc,
          images: [
            {
              url: dataSSR?.imageUrl || defaultConstant.defaultLinkAvatarUser,
              width: 1200,
              height: 630,
              alt: 'Cover image Fjob',
            },
          ],
          // site_name: 'fjob.vn',
        }}
      />
      <div className='py-5'>
        <JobDetailPage 
        dataSSR={dataSSR}
        // checkIsERManagerPost={checkIsERManagerPost}
        />
      </div>
      
    </>
  )
}

export async function getServerSideProps(ctx) {
  try {
    const cookies = nookies.get(ctx)[storageConstant.cookie.accessToken]
    const { data } = await getDetailJobSSRApi({
      token: cookies ? Base64.decode(cookies) : null,
      id: ctx.query.jobId,
    })
    getJobViewByIdApi({ id: Number(ctx.query.jobId) })
    return { props: { dataSSR: data || {} } }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}
