import React, { useState } from 'react'
import ModalPopup from '../../ModalPopup/ModalPopup'

interface IProps {
  callbackCloseModalApp(): void
}

export default function ModalQRDownload({ callbackCloseModalApp }: IProps): JSX.Element {
  const [isSuggestAppModal, setIsSuggestAppModal] = useState(true)

  return (
    <ModalPopup
      textConfirm="Đóng"
      positionAction="center"
      isCancelBtn={false}
      title="Vui lòng tải app để sử dụng tính năng này"
      transition='move-up'
      visible={isSuggestAppModal}
      handleCancelModal={() => {
        setIsSuggestAppModal(!isSuggestAppModal)
        callbackCloseModalApp()
      }}
      handleConfirmModal={() => {
        setIsSuggestAppModal(!isSuggestAppModal)
        callbackCloseModalApp()
      }}
      closeBtn
    >
      <div>
        <div className='text-center mb-3'>Quét mã QR tại đây!</div>
        <img
          src="/assets/images/qr/download_app.svg"
          alt="QR Fjob download"
          width="100%"
          height="196px"
        />
      </div>
    </ModalPopup>
  )
}
