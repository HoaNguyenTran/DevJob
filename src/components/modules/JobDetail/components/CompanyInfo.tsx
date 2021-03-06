import { Rate } from 'antd'
import React, { FC, useEffect, useState } from 'react'

import { getDetailCompanyApi } from 'api/client/company'
import Loading from 'src/components/elements/Loading/Loading'
import { handleError } from 'src/utils/helper'
import styles from './Job.module.scss'

interface Prop {
  companyId: number
}

const CompanyInfo: FC<Prop> = ({ companyId }) => {
  const [infoCompany, setInfoCompany] = useState<any>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const resData = await getDetailCompanyApi(companyId)

        const {
          avatar,
          contactPhone,
          desc,
          imagesJson,
          isVerified,
          name,
          numEmployee,
          shortName,
          website,
          companyAddress,
        } = resData.data

        setInfoCompany({
          avatar,
          phone: contactPhone,
          description: desc,
          images: imagesJson,
          isVerified,
          name,
          numEE: numEmployee,
          shortName,
          website,
          address: companyAddress,
        })
      } catch (error) {
        handleError(error, { isIgnoredMessage: true })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (!companyId) return null
  if (loading) return <Loading />

  return (
    <div className={styles.comInfo}>
      <div className={styles.comInfo_wrap}>
        <div className={styles.comInfo_header}>
          <div className={styles.comInfo_header_avatar}>
            <img
              width={64}
              height={64}
              src={infoCompany.avatar || '/assets/images/avatar/company.png'}
              alt=""
            />
          </div>
          <div className={styles.comInfo_header_info}>
            <div className={styles.comInfo_header_name}>{infoCompany.name}</div>
            {infoCompany.isVerified ? (
              <div className={styles.comInfo_header_verified}>
                <img src="/assets/icons/color/isVerified.svg" alt="" />
                <span>???? x??c th???c</span>
              </div>
            ) :
              <div className={styles.comInfo_header_verified} >
                <img alt="" src="/assets/icons/color/unVerified.svg" />
                &nbsp;
                <span>T??i kho???n ch??a ???????c x??c th???c</span>
              </div>}
            <div>
              <Rate disabled defaultValue={4} />
            </div>
          </div>
        </div>
        {/* <div className={styles.comInfo_tag}>
          <button type="button">Theo d??i</button><button type="button">Nh???n tin</button><button type="button">Vi???c kh??c</button><button type="button">Li??n h???</button>
        </div> */}
        <div className={styles.comInfo_info}>
          <div className={styles.comInfo_info_place}>
            <img src="/assets/icons/default/place.svg" alt="" />
            <div>
              {infoCompany.address?.length
                ? infoCompany.address?.map(item => <div key={item.id}>{item.shortAddress}</div>)
                : 'Ch??a c??'}
            </div>
          </div>
          <div className={styles.comInfo_info_call}>
            <img src="/assets/icons/default/call.svg" alt="" />
            <div>{infoCompany.phone}</div>
          </div>
          {infoCompany.website && (
            <div className={styles.comInfo_info_call}>
              <img src="/assets/icons/default/world.svg" alt="" />
              <div>{infoCompany.website}</div>
            </div>
          )}
        </div>
        <div className={styles.comInfo_numEE}>
          <div className={styles.comInfo_numEE_title}>Quy m??</div>
          {infoCompany.numEE} nh??n vi??n
        </div>
        {infoCompany.description && (
          <div className={styles.comInfo_intro}>
            <div className={styles.comInfo_intro_title}>Gi???i thi???u</div>
            {infoCompany.description}
          </div>
        )}
        {infoCompany.images?.length && (
          <div className={styles.comInfo_img}>
            <div className={styles.comInfo_img_title}>H??nh ???nh gi???i thi???u</div>
            <div className={styles.comInfo_img_image}>
              {infoCompany.images
                ? JSON.parse(infoCompany.images)
                    .filter(item => item.type === 2)
                    .map(img => (
                      <img key={img.id} src={img.image} height={240} width={240} alt="" />
                    ))
                : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default CompanyInfo
