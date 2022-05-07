import React, { FC } from 'react'

import { formatNumber } from 'src/utils/helper'

import styles from './salary.module.scss'

interface Data {
  from: number
  to: number
}

const Salary: FC<{ data: Data }> = ({ data }) => {
  const { from, to } = data
  return (
    <div className={styles.salary}>
      <div className={styles.row}>
        <h3 className={styles.title}>Mức lương mong muốn</h3>
      </div>
      <div className={styles.item}>
        <span>
          {formatNumber(from)} - {formatNumber(to)} VNĐ/giờ
        </span>
      </div>
    </div>
  )
}
export default Salary
