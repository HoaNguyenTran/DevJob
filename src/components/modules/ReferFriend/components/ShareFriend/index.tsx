import { Divider, message } from 'antd'
import { getInfoRedeemCode } from 'api/client/misc'
import moment from 'moment'
import { NextSeo } from 'next-seo'
import React, { useEffect, useState } from 'react'
import { configConstant } from 'src/constants/configConstant'
import { useAppSelector } from 'src/redux'
import { handleError, newWindowPopupCenter } from 'src/utils/helper'


import styles from './ShareFriend.module.scss'

const ShareFriend = ({campaign, rewards}): JSX.Element => {
  const profile = useAppSelector(state => state.user.profile || {});

  const onClickCopy = () => {
    navigator.clipboard.writeText(profile.code)
    message.success("Copy thành công")
  }

  const onClickShare = () => {
    if (!campaign?.id) {
      return;
    }
    newWindowPopupCenter({
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURI(
        typeof window !== 'undefined' ? `${window.location.href}?tab=1&code=${profile.code}` : '',
      )}`,
      title: 'Facebook Dialog',
      w: 500,
      h: 500,
    })
  }

  return (
    <div className={styles.main}>
      <NextSeo
        title="Nhập mã giới thiệu"
        description={`Hãy chia sẻ mã: "${profile.code}" cho các bạn của bạn để cùng nhận thưởng`}
        openGraph={{
          type: 'website',
          images: [
            {
              url: 'https://storage.googleapis.com/fjob-dev/04-2022/8e5145c0-bfcb-11ec-82fb-2bc380367d27.png',
              width: 1200,
              height: 630,
              alt: 'Cover image Fjob',
            },
          ],
        }}
      />
      <div className={styles.main_wrap}>
        <div className={styles.main_wrap_image}>
          <img src="/assets/images/refer-friend/banner.png" alt="" />
        </div>
        <div className={styles.main_content}>
          <div className={styles.main_wrap_content}>
            <div className={styles.main_wrap_content_title}>
              Mã giới thiệu của bạn là:
            </div>
            <div className={styles.main_wrap_content_input}>
              {profile.code}
            </div>
            <div className={styles.main_wrap_content_copy} onClick={onClickCopy}>
              Sao chép
            </div>
            {
              campaign.id ? (
                <>
                  <div className={styles.main_wrap_content_desc}>
                    Nhận ngay <span className={styles.main_wrap_content_desc_wallet}>{rewards?.[0]?.rewardCount} Kim cương</span> cho mỗi lần giới thiệu.
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
          </div>
        </div>
        <Divider />
        <div className={`${campaign?.id ? styles.button : styles.button_inactive}`} onClick={onClickShare}>
          Chia sẻ ngay
        </div>
      </div>
    </div>
  )
}

export default ShareFriend;