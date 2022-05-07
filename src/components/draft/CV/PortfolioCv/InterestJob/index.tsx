import React, { useState } from 'react'

import { Cascader, Divider, Image, message, Modal } from 'antd'
import { postFavCatsApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { EditOutlined } from '@ant-design/icons'

import ModalRewardDiamond from 'src/components/elements/Modal/ModalRewardDiamond/ModalRewardDiamond'
import styles from './interest-job.module.scss'

const favCatColor = ['#f0efff', '#fff5e5', '#f3f9e6', '#e9f6ff', '#e5fbfc']

interface IRewardDiamond {
  name: string,
  diamond: number
}

const InterestJob = (): JSX.Element => {
  const dispatch = useAppDispatch()
  const { FjobCategory = [] } = useAppSelector(state => state.initData.data)
  const { favCats, code, id } = useAppSelector(state => state.user.profile || {})


  const [cascaderValues, setCascaderValues] = useState(
    (favCats || []).map(i => [FjobCategory.find(item => item.id === i)?.parentId || 0, i]))

  const [isModal, setIsModal] = useState(false)

  const [rewardDiamond, setRewardDiamond] = useState<IRewardDiamond>({} as IRewardDiamond)
  const [isRewardDiamondModal, setIsRewardDiamondModal] = useState(false)

  const noData = <div className={styles.no_data}>
    <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
      Giúp bạn tiến gần hơn với công việc mơ ước, giúp nhà tuyển dụng tìm kiểm công việc phù hợp
      với sở ngành nghề bạn quan tâm của bạn.
    </p>
  </div>


  const renderItem = favCats?.map((item, index) => (
    <div
      className={styles.interest_items}
      key={item}
      style={{ minWidth: '150px', backgroundColor: favCatColor[index] }}
    >
      <div style={{ marginBottom: '2px' }}>
        <Image
          preview={false}
          src="/assets/images/icon/icon18.png"
          height={30}
          width={30}
          alt="icon"
        />
      </div>
      <h4 className={styles.text}>{FjobCategory.find(i => i.id === item)?.name}</h4>
    </div>
  ))

  const onChange = value => {
    if ((value.length > 0 && value[value.length - 1].length === 2) || value.length === 0) {
      setCascaderValues(value)
    }

    if (value.length > 5) {
      value.pop()
      message.error('Chọn tối đa 5 ngành nghề')
    }
  }

  const handlerOkModal = async () => {
    const fav = cascaderValues.map(i => i[1])

    try {
      const { data } = await postFavCatsApi({ catIds: fav, userId: id })
      if (data.profileRewarded) {
        setIsRewardDiamondModal(true)
        setRewardDiamond({ name: "hồ sơ cá nhân", diamond: data.profileRewarded })
      }
      dispatch(getProfileRequest({ userCode: code }));
    } catch (err) {
      if ((err as ErrorMsg).response.data.errorCode === 9001) {
        message.error((err as ErrorMsg).response.data.message)
      }
    }
    setIsModal(false)
  }

  const handleCancelModal = () => {
    setIsModal(false)
  }

  const options = FjobCategory.filter(i => i.parentId === 0).map(i => ({
    value: i.id,
    label: i.name,
    children: FjobCategory.filter(it => it.parentId === i.id).map(item => ({
      value: item.id,
      label: item.name,
    })),
  }))


  return (
    <div className={styles.interest}>
      <div className={styles.row}>
        <h3 className={styles.title}> Ngành nghề quan tâm<span> (*)</span></h3>
        <div
          className={styles.edit}
          onClick={() => {
            setIsModal(true)
            setCascaderValues((favCats || []).map(i => [FjobCategory.find(item => item.id === i)?.parentId || 0, i]))
          }}
        >
          <EditOutlined style={{ marginRight: '10px' }} /> Chỉnh sửa
        </div>
      </div>

      <div
        style={{ marginTop: '20px' }}
        className="d-flex flex-row align-items-center justify-content-start"
      >
        {favCats?.length === 0 ? noData : renderItem}
      </div>

      {isModal && <Modal
        visible={isModal}
        onOk={handlerOkModal}
        onCancel={handleCancelModal}
        wrapClassName="modal-global"
      >
        <div className="modal-title">Chọn ngành nghề quan tâm</div>
        <Divider />
        <Cascader
          size="large"
          options={options}
          onChange={onChange}
          multiple
          placeholder="Chọn tối đa 5 ngành nghề quan tâm"
          value={cascaderValues}
          style={{ width: '100%' }}
        />
      </Modal>}
      <ModalRewardDiamond
        isRewardDiamondModal={isRewardDiamondModal}
        setIsRewardDiamondModal={setIsRewardDiamondModal}
        rewardDiamond={rewardDiamond}
      />
    </div>
  )
}
export default InterestJob
