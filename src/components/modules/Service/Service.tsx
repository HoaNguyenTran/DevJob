import React, { useState } from 'react'
import BuyService from './components/BuyService/BuyService'
import MyService from './components/MyService/MyService'
import styles from "./Service.module.scss"


const Service = (): JSX.Element => {
  const [tabService, setTabService] = useState(0)

  const [typePackageBuy, setTypePackageBuy] = useState(0)
  const [dataServiceDeatail, setDataServiceDetail] = useState<any>({})

  return (
    <div className={styles.service}>
      <div className={styles.service_navigator}>
        <div className={styles.service_navigator_inner}>
          <div className={styles.navigator_tab}>
            <div className={styles.navigator_overlay} style={{ transform: `translateX(${(tabService) * 560}px)` }} />
            <div className={styles.tab_tab} onClick={() => { setTabService(0) }}>
              <span>
                Dịch vụ của tôi
              </span>
            </div>
            <div className={styles.tab_tab} onClick={() => { setTabService(1) }}>
              <span>
                Mua dịch vụ
              </span>
            </div>
          </div>

        </div >
      </div >
      <div className={styles.service_main}>
        {tabService === 0
          ? <MyService
            setTabService={setTabService}
            typePackageBuy={typePackageBuy}
            setTypePackageBuy={setTypePackageBuy}
            dataServiceDeatail={dataServiceDeatail}
            setDataServiceDetail={setDataServiceDetail}
          />
          : <BuyService
            typePackageBuy={typePackageBuy}
            setTypePackageBuy={setTypePackageBuy}
            dataServiceDeatail={dataServiceDeatail}
            setDataServiceDetail={setDataServiceDetail}
          />}
      </div>
    </div>
  )
}

export default Service