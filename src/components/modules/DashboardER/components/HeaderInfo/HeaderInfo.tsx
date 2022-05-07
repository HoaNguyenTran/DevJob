import React from 'react'
import defaultConstant from 'src/constants/defaultConstant'
import { useAppSelector } from 'src/redux'
import { formatDiamond } from 'src/utils/helper'
import styles from "./HeaderInfo.module.scss"

const HeaderInfo = (): JSX.Element => {
  const profile = useAppSelector(state => state.user.profile || {})

  const renderSubTitle = () => {
    // if (!infoCompany.website) return <div className={styles.subInfo}>{infoCompany.website}</div>
    if (profile.verifyKyc) return <div className={styles.verify}>
      <img alt="" src="/assets/icons/color/isVerified.svg" />
      &nbsp;
      <span>Tài khoản đã được xác thực</span>
    </div>
    return <div className={styles.verify}>
      <img alt="" src="/assets/icons/color/unVerified.svg" />
      &nbsp;
      <span>Tài khoản chưa được xác thực</span>
    </div>
  }

  return (
    <div className={styles.header}>
      <div className={styles.header_inner}>
        <div className={styles.header_left}>
          <div className={styles.avatar}>
            <img alt="" src={profile.avatar || defaultConstant.defaultAvatarUser} />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>
              {profile.name}
            </div>
            {renderSubTitle()}
          </div>
        </div>
        <div className={styles.header_right}>
          <div className={styles.rank}>
            <div className={styles.title}>Hạng</div>
            <div className={styles.value}>
              thường
            </div>
          </div>
          <div className={styles.wallet}>
            <div className={styles.title}>Ví của tôi</div>
            <div className={styles.value}>
              {formatDiamond(profile.walletValue)}
              <img alt="" src="/assets/icons/color/diamond.svg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderInfo