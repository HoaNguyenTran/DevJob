import React, { FC } from 'react'

import { Image } from 'antd'
import { useAppSelector } from 'src/redux'

import styles from './experience.module.scss'

interface Props {
  data: any
}
const Experience: FC<Props> = ({ data }) => {
  const { FjobCategory: fjobCategory = [],
    FjobExperience: fjobExperience = []
  } = useAppSelector(state => state.initData.data)


  const noData = (
    <div className={styles.no_data}>
      {/* <Image preview={false} width={80} height={80} src={defaultConstant.defaultAvatarUser} /> */}
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Không có kinh nghiệm làm việc để hiển thị
      </p>
    </div>
  )

  const renderItem = data?.map(item => (
    <div key={item.id} className={styles.exp_wrap}>
      <div className={styles.exp_item}>
        {/* <Image
          preview={false}
          color="green"
          height={25}
          width={25}
          src="/assets/images/other/confirm.png"
        /> */}
        <div className={styles.img}>
          <Image
            preview={false}
            color="green"
            height={48}
            width={48}
            src="/assets/images/other/confirm.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.item}>
            Vị trí làm việc:&nbsp;
            <span>
              {fjobCategory.find(i => i.id === item.categoryId)?.name}
            </span>
          </div>
          <div className={styles.item}>
            Thời gian:&nbsp;
            <span>
              {fjobExperience.find(i => i.id === item.experienceId)?.name}
            </span>
          </div>
          {item.note && <div className={styles.item}>
            Ghi chú:&nbsp;
            <span>
              {item.note}
            </span>
          </div>}
        </div>
        {/* <div className={styles.exp_title}>
          <span>
            Vị trí làm việc :{' '}
            <span style={{ fontWeight: 'bold' }}>
              {fjobCategory.find(i => i.id === item.categoryId)?.name}
            </span>
          </span>

          <span>
            Thời gian :{' '}
            <span style={{ fontWeight: 'bold' }}>
              {fjobExperience.find(i => i.id === item.experienceId)?.name}
            </span>
          </span>
          <span>
            Ghi chú : <span style={{ fontWeight: 'bold' }}>{item.note}</span>
          </span>
        </div> */}
      </div>
    </div>
  ))
  return (
    <div className={styles.exp}>
      <div className={styles.row}>
        <h3 className={styles.title}>Kinh nghiệm làm việc</h3>
      </div>
      <div className={styles.main}>{data?.length === 0 ? noData : renderItem}</div>
    </div>
  )
}
export default Experience
