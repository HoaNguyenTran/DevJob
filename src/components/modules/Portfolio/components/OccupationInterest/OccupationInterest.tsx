import React, { useState } from 'react'

import { Cascader, message } from 'antd'
import { postFavCatsApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { CloseCircleFilled, EditOutlined } from '@ant-design/icons'

import ModalRewardDiamond from 'src/components/elements/Modal/ModalRewardDiamond/ModalRewardDiamond'
import { createCategories, handleError } from 'src/utils/helper'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import styles from './OccupationInterest.module.scss'

interface IRewardDiamond {
  name: string,
  diamond: number
}

const OccupationInterest = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { FjobCategory: categoryList = [] } = useAppSelector(state => state.initData.data)
  const profile = useAppSelector(state => state.user.profile || {})

  const [cascaderValues, setCascaderValues] = useState(
    (profile.favCats || []).map(i => [categoryList.find(item => item.id === i)?.parentId || 0, i]))

  const [isOccupationInterestModal, setIsOccupationInterestModal] = useState(false)

  const [rewardDiamond, setRewardDiamond] = useState<IRewardDiamond>({} as IRewardDiamond)
  const [isRewardDiamondModal, setIsRewardDiamondModal] = useState(false)



  const formatFavCat = () => {
    const obj: any = []
    profile.favCats?.forEach(favCat => { obj.push(categoryList.find(cate => cate.id === favCat)) })
    return obj
  }


  const onChangeOccupationInterestModal = value => {
    if ((value.length > 0 && value[value.length - 1].length === 2) || value.length === 0) {
      setCascaderValues(value)
    }

    if (value.length > 5) {
      value.pop()
      message.warning('Chỉ được chọn tối đa 5 ngành nghề quan tâm!')
    }
  }

  const onConfirmOccupationInterestModal = async () => {
    const fav = cascaderValues.map(i => i[1])

    try {
      const { data } = await postFavCatsApi({ catIds: fav, userId: profile.id })

      if (data.profileRewarded) {
        setIsRewardDiamondModal(true)
        setRewardDiamond({ name: "hồ sơ cá nhân", diamond: data.profileRewarded })
      }
      dispatch(getProfileRequest({ userCode: profile.code }));
    } catch (err) {
      if ((err as ErrorMsg).response.data.errorCode === 9001) {
        message.error((err as ErrorMsg).response.data.message)
      }
    }
    setIsOccupationInterestModal(false)
  }

  const removeItemOccupationInterest = async (id) => {
    const fav = cascaderValues.map(item => item[1]).filter(item => item !== id)
    try {
      await postFavCatsApi({ catIds: fav, userId: profile.id })
      setCascaderValues(fav.map(i => [categoryList.find(item => item.id === i)?.parentId || 0, i]))
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
  }


  const renderItem = (formatFavCat() || []).map((item) => (
    <div className={styles.interest_item} key={item}>
      <div className={styles.cancel} onClick={() => {
        removeItemOccupationInterest(item.id)
      }}>
        <CloseCircleFilled style={{ color: "#B5B5B5", fontSize: "20px" }} />
      </div>
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
        <div
          className={styles.interest_edit}
          onClick={() => {
            setIsOccupationInterestModal(true)
            setCascaderValues((profile.favCats || []).map(i => [categoryList.find(item => item.id === i)?.parentId || 0, i]))
          }}
        >
          <EditOutlined style={{ marginRight: '.25rem' }} /> Chỉnh sửa
        </div>
      </div>

      <div className={styles.interest_content}>
        {profile.favCats?.length === 0 ?
          <div className={styles.interest_empty}>Giúp bạn tiến gần hơn với công việc mơ ước, giúp nhà tuyển dụng tìm kiểm công việc phù hợp
            với sở ngành nghề bạn quan tâm của bạn.</div> :
          <div>
            <div className={styles.interest_desc}>Bạn có thể thêm tối đa 5 ngành nghề mà bạn quan tâm</div>
            <div className={styles.interest_list}>
              {renderItem}
            </div>
          </div>
        }
      </div>


      <ModalPopup
        visible={isOccupationInterestModal}
        handleCancelModal={() => setIsOccupationInterestModal(false)}
        handleConfirmModal={onConfirmOccupationInterestModal}
        title="Chọn ngành nghề quan tâm"
      >
        <Cascader
          size="large"
          options={createCategories(categoryList)}
          onChange={onChangeOccupationInterestModal}
          multiple
          placeholder="Chọn tối đa 5 ngành nghề quan tâm"
          value={cascaderValues}
          style={{ width: '100%' }}
        />
      </ModalPopup>

      <ModalRewardDiamond
        isRewardDiamondModal={isRewardDiamondModal}
        setIsRewardDiamondModal={setIsRewardDiamondModal}
        rewardDiamond={rewardDiamond}
      />
    </div>
  )
}
export default OccupationInterest
