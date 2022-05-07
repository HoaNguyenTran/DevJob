import React from 'react'
import LinkTo from 'src/components/elements/LinkTo'
import styles from "./ViewCv.module.scss"

const ViewCv = ({ propsData }) => (
  <div className={styles.viewCv}>
    <div className={styles.viewCv_wrap}>
      <div className={styles.title}>
        <LinkTo href={propsData} target="_blank">
          Xem chi tiết CV
        </LinkTo>
      </div>
     
    </div>
  </div>
)

export default ViewCv