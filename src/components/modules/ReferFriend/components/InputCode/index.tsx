import { Divider, message } from 'antd'
import { getInfoRedeemCode, redeemCode } from 'api/client/misc'
import moment from 'moment'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import { configConstant, RedeemType } from 'src/constants/configConstant'
import { useAppSelector } from 'src/redux'
import { handleError, newWindowPopupCenter } from 'src/utils/helper'

import styles from './InputCode.module.scss'


const InputCode = (props): JSX.Element => {
  const { campaign, rewards } = props
  const [code, setCode] = useState(props.code);

  const onClick = async () => {
    if (!code || !campaign?.id) {
      return;
    }
    try {
      const result = await redeemCode({ code: code.trim(), redeemType: RedeemType.UserCode })
      message.success(result.data.message || "Nhập mã giới thiệu thành công, hãy xem thông báo để nhận phần thưởng.")
    } catch (error) {
      handleError(error)
    }
  }

  const onChangeText = (e) => {
    setCode(e.target.value)
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_wrap}>
        <div className={styles.main_wrap_image}>
          <img src="/assets/images/refer-friend/banner.png" alt="" />
        </div>
        <div className={styles.main_content}>
          <div className={styles.main_wrap_content}>
            <div className={styles.main_wrap_content_title}>
              Nhập mã giới thiệu
            </div>
            {
              campaign.id ? (
                <>
                  <div className={styles.main_wrap_content_desc}>
                    Nhận ngay <span className={styles.main_wrap_content_desc_wallet}>{rewards?.[0]?.rewardCount} Kim cương</span> cho mỗi lần nhập mã.
                  </div>
                  {
                    campaign.endTime ? (
                      <div className={styles.main_wrap_content_desc}>
                        Chương trình áp dụng đến hết {moment.unix(campaign.endTime).format(configConstant.displayTime.DDMMYYY)}.
                      </div>
                    ) : null
                  }
                </>
              ) : null
            }
            {
              campaign?.id ? (
                <input className={styles.main_wrap_content_input} placeholder="Nhập mã quà tặng" onChange={onChangeText} />
              ) : (
                <div className={styles.main_wrap_content_desc}>
                  Chương trình chưa diễn ra
                </div>
              )
            }
          </div>
        </div>
        {
          campaign?.id ? (
            <>
              <Divider />
              <div className={`${campaign?.id ? styles.button : styles.button_inactive}`} onClick={onClick}>
                Nhận ngay
              </div>
            </>
          ) : null
        }
      </div>
    </div>
  )
}

export default InputCode;