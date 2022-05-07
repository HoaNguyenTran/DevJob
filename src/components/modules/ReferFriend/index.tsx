import { getInfoRedeemCode } from 'api/client/misc'
import router from 'next/router'
import React, { useEffect, useState } from 'react'
import useWindowDimensions from 'src/hooks/useWindowDimensions'
import InputCode from './components/InputCode'
import ShareFriend from './components/ShareFriend'

import styles from './ReferFriend.module.scss'

const ReferFriend = (props): JSX.Element => {
  const [tab, setTab] = useState(props.tab);
  const [campaign, setCampaign] = useState<any>({});
  const [rewards, setRewards] = useState<any>({});
  const SCREEN = useWindowDimensions();

  useEffect(() => {
    getInfoRedeem()
  }, [])

  const calcTranslateX = (width) => {
    if (width >= 1440) {
      return tab * 560
    }
    if (width >= 768) {
      return tab * (width - 224) / 2 - 10
    }
    return tab * width / 2 - 10
  }

  const calcWidthTranslateX = (width) => {
    if (width >= 1440) {
      return 560
    }
    if (width >= 768) {
      return (width - 224) / 2 - 20
    }
    return width / 2 - 20
  }

  const getInfoRedeem = async () => {
    try {
      const result = await getInfoRedeemCode()
      setCampaign(result.data.campaign)
      setRewards(result.data.rewards)
    } catch (error) {
      // handleError(error)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main_navigator}>
        <div className={styles.navigator_tab}>
          <div className={styles.navigator_overlay} style={{ transform: `translateX(${calcTranslateX(SCREEN.width)}px)`, width: `${calcWidthTranslateX(SCREEN.width)}px` }} />
          <div className={styles.tab_tab} onClick={() => { setTab(0) }}>
            <span>
              Chia sẻ bạn bè
            </span>
          </div>
          <div className={styles.tab_tab} onClick={() => { setTab(1) }}>
            <span>
              Nhập mã
            </span>
          </div>
        </div >
      </div >
      <div className={styles.service_main}>
        {tab === 0
          ? <ShareFriend
            campaign={campaign}
            rewards={rewards}
          />
          : <InputCode
            campaign={campaign}
            rewards={rewards}
            code={props.code}
          />}
      </div>
    </div>
  )
}

export default ReferFriend
