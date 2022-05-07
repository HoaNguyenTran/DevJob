import React from 'react'
import ModalPopup from '../../ModalPopup/ModalPopup'
import styles from "./ModalRewardDiamond.module.scss"

interface IRewardDiamond {
  name: string,
  diamond: number
}

interface IProps {
  isRewardDiamondModal: boolean
  setIsRewardDiamondModal(isRewardDiamondModal): void
  rewardDiamond: IRewardDiamond
}

export default function ModalRewardDiamond({ isRewardDiamondModal, setIsRewardDiamondModal, rewardDiamond }: IProps): JSX.Element {
  return (
    <ModalPopup
      textConfirm="Đóng"
      positionAction="center"
      isCancelBtn={false}
      title=""
      transition='move-up'
      visible={isRewardDiamondModal}
      handleCancelModal={() => {
        setIsRewardDiamondModal(!isRewardDiamondModal)
      }}
      handleConfirmModal={() => {
        setIsRewardDiamondModal(!isRewardDiamondModal)
      }}
    >
      <div className={styles.modal}>
        <img alt="" src="/assets/images/modal/reward-diamond.png" />
        <div className={styles.title}>Hoàn thành {rewardDiamond.name}</div>
        <div className={styles.subtitle}>Fjob gửi tặng bạn <span>{rewardDiamond.diamond} kim cương</span></div>
      </div>
    </ModalPopup>
  )
}
