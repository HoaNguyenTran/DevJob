import React from 'react'
import { formatNumber } from 'src/utils/helper'
import styles from './ExpectSalary.module.scss'

const ExpectSalary = ({ propsData }): JSX.Element => (
    <div className={styles.salary}>
      <div className={styles.salary_header}>
        <div className={styles.salary_title}>
          <div className={styles.title}>Mức lương mong muốn
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
      </div>
      </div>
      <div className={styles.salary_content}>
        <span>
        {formatNumber(propsData.expectSalaryFrom)} - {formatNumber(propsData.expectSalaryTo)} VNĐ/giờ
        </span>
    </div>
    </div>
)
export default ExpectSalary
