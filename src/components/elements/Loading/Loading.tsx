import React, { FC } from 'react'
import { Spin } from 'antd'

import styles from './Loading.module.scss'

const Loading: FC = () => (
  <div className={styles.loading}>
    <div className={styles.loading_wrap}>
      <Spin />
    </div>
  </div>
)

export default Loading
