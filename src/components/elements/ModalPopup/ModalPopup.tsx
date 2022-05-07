/* eslint-disable react/require-default-props */
import { Modal } from 'antd'
import React, { FC } from 'react'
import styles from "./ModalPopup.module.scss"


type TTransition = "fade" |
  "zoom" | "zoom-big" | "zoom-big-fast" |
  "zoom-up" | "zoom-down" | "zoom-left" | "zoom-right" |
  "slide-up" | "slide-down" | "slide-left" | "slide-right" |
  "move-up" | "move-down" | "move-left" | "move-right"

interface IProps {
  visible: boolean
  title?: string
  children?: JSX.Element
  closeBtn?: boolean
  width?: number

  handleCancelModal?: () => void
  handleConfirmModal?: () => void
  textCancel?: string
  textConfirm?: string

  transition?: TTransition
  isConfirmBtn?: boolean
  isCancelBtn?: boolean
  maskClosable?: boolean
  // isClickOnMask?: boolean
  iconTopRight?: JSX.Element
  positionAction?: "start" | "center" | "end"
  titleStyle?: any
  className?: string
}

// status

const ModalPopup: FC<IProps> = ({
  visible,
  handleCancelModal,
  handleConfirmModal,
  title,
  children,
  maskClosable = true,
  transition = "zoom",
  closeBtn = false,
  width = 520,
  textCancel = "Huỷ bỏ",
  textConfirm = "Đồng ý",
  isConfirmBtn = true,
  isCancelBtn = true,
  // isClickOnMask,
  iconTopRight,
  positionAction = "end",
  titleStyle = {},
  className
}) => (
  <Modal
    className={className}
    wrapClassName="modal-global"
    transitionName={`ant-${transition}`}
    closable={closeBtn}
    width={width}
    footer={null}
    visible={visible}
    maskClosable={maskClosable}
    onCancel={(e) => {
      e.stopPropagation();
      if (handleCancelModal) {
        handleCancelModal()
      }
    }
    }
  >
    <div className={styles.modal}>
      <div className={styles.modal_header}>
        <div className={styles.title} style={titleStyle}>{title}</div>
        {iconTopRight && <div className={styles.icon_right}>
          {iconTopRight}
        </div>}
      </div>
      <div className={styles.modal_content}>
        {children}
      </div>
      {
        (isCancelBtn || isConfirmBtn) &&
        <div
          className={`${styles.modal_action} justify-content-${positionAction}`}
        >
          {isCancelBtn && <button type="button"
            onClick={handleCancelModal}
            className={styles.modal_cancel}
          >
            {textCancel}
          </button>}
          {isConfirmBtn && <button type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleConfirmModal?.();
            }}
            className={`${styles.modal_confirm} ${!isCancelBtn && styles.btn_only}`}
          >
            {textConfirm}
          </button>}
        </div>
      }
     
    </div>
  </Modal>
)

export default ModalPopup