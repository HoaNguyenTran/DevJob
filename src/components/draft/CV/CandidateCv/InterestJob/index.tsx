import React, { useEffect, useState } from 'react'

import { Image } from 'antd'
import { useAppSelector } from 'src/redux'

import styles from './interest-job.module.scss'

const favCatColor = ['#f0efff', '#fff5e5', '#f3f9e6', '#e9f6ff', '#e5fbfc']

const InterestJob = ({ data }) => {

  const { FjobCategory = [] } = useAppSelector(state => state.initData.data)

  const [favoriteCats, setFavoriteCats] = useState<any[]>()

  useEffect(() => {
    const fav = data.map(item => FjobCategory.find(cate => cate.id === item))
    setFavoriteCats(fav)
  }, [])

  const noData = (
    <div className={styles.no_data}>
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Không có ngành nghề quan tâm để hiển thị
      </p>
    </div>
  )

  const renderItem = favoriteCats?.map((item, index) => (
    <div
      className={styles.interest_items}
      key={item.id}
      style={{ minWidth: '150px', backgroundColor: favCatColor[index] }}
    >
      <div style={{ marginBottom: '2px' }}>
        <Image src="/assets/images/icon/icon18.png" height={30} width={30} alt="icon" />
      </div>
      <h4>{item.name}</h4>
    </div>
  ))
  return (
    <div className={styles.interest}>
      <h3 className={styles.title}>Ngành nghề quan tâm</h3>
      <div
        style={{ marginTop: '20px' }}
        className="d-flex flex-row align-items-center justify-content-start"
      >
        {data.length === 0 ? noData : renderItem}
      </div>
    </div>
  )
}
export default InterestJob
