import React, { FC } from 'react'

import { Image } from 'antd'
import { format } from 'date-fns'
import { configConstant } from 'src/constants/configConstant'

import defaultConstant from 'src/constants/defaultConstant'
import styles from './academic.module.scss'

interface Props {
  data: any
}
const Academic: FC<Props> = ({ data }) => {
  const noData = (
    <div className={styles.no_data}>
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Không có học vấn để hiển thị
      </p>
    </div>
  )

  const renderItem = data?.map(item => {
    const timeStart = format(new Date(item.startDate * 1000), 'dd/MM/yyyy')
    const timeEnd = format(new Date(item.endDate * 1000), 'dd/MM/yyyy')

    return (
      <div key={item.id} className={styles.academic_wrap}>
        <div className={styles.academic_item}>
          <img
            src={item.certificateImg || defaultConstant.defaultAvatarUser}
            alt=""
            width={64}
            height={64}
          />
          <div
            className="d-flex flex-row justify-content-center align-items-start"
            style={{ width: '100%' }}
          >
            <div className={styles.academic_text}>
              <p className={styles.academic_text_title}>{item.name}</p>
              <p className={styles.academic_text_score}>Bằng cấp : {item.major}</p>
              <p
                style={{
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: 'grey',
                  marginBottom: '5px',
                }}
              >
                {timeStart}-{timeEnd}
              </p>
            </div>
            <div className={styles.academic_text}>

              {!!item.grade && <p className={styles.academic_text_score}>Điểm học tập (GPA) : {item.grade}</p>}
              {item.otherDesc && <p className={styles.academic_text_score}>Ghi chú : {item.otherDesc}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  })
  return (
    <div className={styles.academic}>
      <div className={styles.row}>
        <h3 className={styles.title}>Học vấn</h3>
      </div>
      <div className={styles.content}>{data?.length === 0 ? noData : renderItem}</div>
    </div>
  )
}
export default Academic
