import React, { FC } from 'react'

import { Image } from 'antd'
import { configConstant } from 'src/constants/configConstant'
import { useAppSelector } from 'src/redux'

import defaultConstant from 'src/constants/defaultConstant'
import styles from './skill.module.scss'

interface Props {
  data: any
}
const Skill: FC<Props> = ({ data }) => {

  const { FjobProfSkill: fjobProfSkill = [],
    FjobExperience: fjobExperience = []
  } = useAppSelector(state => state.initData.data)

  const noData = (
    <div className={styles.no_data}>
      <Image preview={false} width={80} height={80} src={defaultConstant.defaultAvatarUser} />
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Không có kỹ năng để hiển thị
      </p>
    </div>
  )

  const renderRating = [1, 2, 3, 4, 5].map(item => (
    <span style={{ marginRight: '5px' }} key={item}>
      <Image preview={false} height={20} width={20} src="/assets/images/icon/icon21.png" />
    </span>
  ))

  const renderItem = data?.map(item => (
    <div key={item.id} className={styles.skill_wrap}>
      <div className={styles.skill_item}>
        <p className={styles.skill_item_title}>
          {fjobProfSkill.find(i => i.id === item.profSkillId)?.name}
        </p>
        <div className="d-flex flex-row" style={{ marginBottom: '15px' }}>
          {renderRating}
        </div>
        <p className={styles.skill_item_time}>
          {fjobExperience.find(i => i.id === item.experience)?.name}
        </p>
        <p style={{ fontStyle: 'italic', color: 'grey' }}>{item.note}</p>
      </div>
    </div>
  ))
  return (
    <div className={styles.skill}>
      <div className={styles.row}>
        <h3 className={styles.title}>Kỹ năng</h3>
      </div>
      <div className={styles.content}>{data.length === 0 ? noData : renderItem}</div>
    </div>
  )
}
export default Skill
