import { Divider, message } from 'antd'
import { getInfoRedeemCode, redeemCode } from 'api/client/misc'
import React, { useEffect, useState } from 'react'
import { RedeemType } from 'src/constants/configConstant'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import { handleError } from 'src/utils/helper'

import styles from './Gift.module.scss'

const ReferFriend = (): JSX.Element => {
  const [text, setText] = useState("");

  const onChangeText = (e) => {
    setText(e.target.value)
  }

  const onClick = async () => {
    try {
      await redeemCode({
        code: text.trim(),
        redeemType: RedeemType.SaleRefCode
      });
      message.success("Nhập mã giới thiệu thành công, hãy xem thông báo để nhận phần thưởng.")
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_wrap}>
        <div className={styles.main_wrap_image}>
          <img src="/assets/images/refer-friend/gift.png" alt="" />
        </div>
        <div className={styles.main_content}>
          <div className={styles.main_wrap_content}>
            <div className={styles.main_wrap_content_title}>
              Nhập mã quà tặng
            </div>
            <input className={styles.main_wrap_content_input} placeholder="Nhập mã quà tặng" onChange={onChangeText} />
          </div>
        </div>
        <Divider />
        <div className={`${!text.trim() ? styles.button_inactive : styles.button}`} onClick={onClick} >
          Nhận ngay
        </div>
      </div>
    </div>
  )
}

export default ReferFriend
