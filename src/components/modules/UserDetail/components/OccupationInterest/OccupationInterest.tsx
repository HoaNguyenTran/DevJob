import React from 'react'
import { useAppSelector } from 'src/redux'
import styles from './OccupationInterest.module.scss'


const OccupationInterest = ({ propsData }): JSX.Element => {
  const { FjobCategory: categoryList = [] } = useAppSelector(state => state.initData.data)

  const formatFavCat = () => {
    const obj: any = []
    propsData.favCats?.forEach(favCat => { obj.push(categoryList.find(cate => cate.id === favCat)) })
    return obj
  }

  const renderItem = (formatFavCat() || []).map((item) => (
    <div className={styles.interest_item} key={item}>
      <img alt="" src={categoryList.find(cate => cate.id === item.parentId)?.avatar || '/assets/images/portfolio/default-cate.svg'} />
      <h4 className={styles.name}>{item.name}</h4>
    </div>
  ))

  return (
    <div className={styles.interest}>
      <div className={styles.interest_header}>
        <div className={styles.interest_title}>
          <div className={styles.title}>Ngành nghề quan tâm
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
      </div>

      <div className={styles.interest_content}>
        {!!propsData.favCats?.length &&
          <div>
            <div className={styles.interest_list}>
              {renderItem}
            </div>
          </div>
        }
      </div>

    </div>
  )
}
export default OccupationInterest
