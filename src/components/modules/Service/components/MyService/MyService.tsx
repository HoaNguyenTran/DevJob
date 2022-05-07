import React from 'react'
import { serviceConstant } from 'src/constants/serviceConstant'
import { useAppSelector } from 'src/redux'
import styles from "./MyService.module.scss"

const serviceBasic = [serviceConstant.basic.code, serviceConstant.urgent.code]

const MyService = ({ setTabService, typePackageBuy, setTypePackageBuy, dataServiceDeatail, setDataServiceDetail }): JSX.Element => {
  const { FjobService: serviceList = [] } = useAppSelector(state => state.initData.data)

  const profile = useAppSelector(state => state.user.profile || {})


  const renderMySerBasic = () => {
    const servicePostJob = serviceList.filter(item => serviceBasic.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: (profile.userServices || []).find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map(mySer => (
      <div key={mySer.id} className={styles.serpro_useSer_item}>
        <div className={styles.serpro_useSer_item_info}>
          <div className={styles.name}>
            {mySer.name}
          </div>
          <div className={styles.wallet}>
            (Bạn còn:&nbsp;<div className={styles.serpro_useSer_item_number}>{mySer.quantity} gói</div>)
          </div>
        </div>
        <div className={styles.serpro_useSer_item_action}>
          <button type="button" onClick={() => {
            setTabService(1)
            setTypePackageBuy(1)
            setDataServiceDetail(mySer)
          }}>Mua ngay</button>
        </div>
      </div>
    ))
  }


  const renderMySerOther = () => {
    const servicePostJob = serviceList.filter(item => !serviceBasic.includes(item.code))

    const newArr: any = []
    servicePostJob.forEach(servicePost =>
      newArr.push({
        ...servicePost,
        quantity: (profile.userServices || []).find(item => item.serviceCode === servicePost.code)?.quantity || 0
      }))

    return newArr.map(mySer => (
      <div key={mySer.id} className={styles.serpro_useSer_item}>
        <div className={styles.serpro_useSer_item_info}>
          <div className={styles.name}>
            {mySer.name}
          </div>
          <div className={styles.wallet}>
            (Bạn còn:&nbsp;<div className={styles.serpro_useSer_item_number}>{mySer.quantity} gói</div>)
          </div>
        </div>
        <div className={styles.serpro_useSer_item_action}>
          <button type="button" onClick={() => {
            setTabService(1)
            setTypePackageBuy(1)
            setDataServiceDetail(mySer)
          }}>Mua ngay</button>
        </div>

      </div>
    ))
  }

  return (
    <div className={styles.serpro}>
      <div className={styles.serpro_inner}>

        <div className={styles.serpro_useSer}>
          <div className={styles.serpro_useSer_title}>
            Dịch vụ đăng tuyển
          </div>
          <div className={styles.serpro_useSer_list}>{renderMySerBasic()}</div>
        </div>

        <div className={styles.serpro_useSer}>
          <div className={styles.serpro_useSer_title}>
            <span>Gói dịch vụ khác</span>
          </div>
          <div className={styles.serpro_useSer_list}>{renderMySerOther()}</div>
        </div>
      </div>
    </div>
  )
}

export default MyService