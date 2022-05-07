import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Col, message } from 'antd';
import { deleteUserAddressApi, patchUserAddressApi, postUserAddressApi } from 'api/client/address';
import React, { useState } from 'react'
import Map from 'src/components/elements/Map/Map';
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getProfileRequest } from 'src/redux/user';
import { handleError } from 'src/utils/helper';

import styles from "./Address.module.scss"


interface IProps {
  setRewardDiamond(data): void,
  setIsRewardDiamondModal(data): void
}


const Address = ({ setRewardDiamond, setIsRewardDiamondModal }: IProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const profile = useAppSelector(state => state.user.profile || {})

  const [initLocation, setInitLocation] = useState<CommonGlobal.AddressUser>({} as CommonGlobal.AddressUser)

  const [isAddAddressModal, setIsAddAddressModal] = useState(false)
  const [isEditAddressModal, setIsEditAddressModal] = useState(false)
  const [isDeleteAddressModal, setIsDeleteAddressModal] = useState(false)


  // new address
  const handlePostAddress = async reqest => {
    try {
      const { data } = await postUserAddressApi({ ...reqest, userId: profile.id })
      message.success('Thêm mới địa chỉ thành công')
      if (data.data?.user?.accountInfoRewarded) {
        setIsRewardDiamondModal(true)
        setRewardDiamond({ name: "thông tin tài khoản", diamond: data.data.user.accountInfoRewarded })
      }

      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
  }

  const handleChangeMainAddress = async data => {
    try {
      await patchUserAddressApi({ ...data, main: 1 }, initLocation.idAddress)
      message.success('Địa chỉ cập nhật thành công')
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      message.error('Địa chỉ cập nhật thất bại')
    }
  }

  const onClickEditAddress = values => {
    setInitLocation({
      isMain: !!values.main,
      idAddress: values.userAddressId,
      latitude: values.latitude,
      longitude: values.longitude,
      address: values.address,
      provinceId: values.provinceId,
      districtId: values.districtId,
      communeId: values.communeId,
    })
    setIsEditAddressModal(true)
  }

  // update address
  const handleUpdateAddress = async data => {
    try {
      await patchUserAddressApi({ ...data, main: 0 }, initLocation.idAddress)
      message.success('Cập nhật địa chỉ thành công!')
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      message.error('Cập nhật địa chỉ thất bại!')
    }
  }

  const onClickDeleteAddress = (values) => {
    if (values.main) return message.error("Bạn không thể xóa địa chỉ mặc định!")

    setInitLocation({
      isMain: !!values.main,
      idAddress: values.userAddressId,
      latitude: values.latitude,
      longitude: values.longitude,
      address: values.address,
      provinceId: values.provinceId,
      districtId: values.districtId,
      communeId: values.communeId,
    })

    setIsDeleteAddressModal(true);
  }

  const handleDeleteAddress = async () => {
    try {
      await deleteUserAddressApi(initLocation.idAddress)
      message.success('Xóa địa chỉ thành công')
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
    setIsDeleteAddressModal(false);
  }


  const renderAddress = () => profile.addresses
    ?.slice(0)
    .reverse()
    .map((address, index) => (
      <div className={styles.account_address_item} key={index}>
        <div>
          <div className={styles.text} style={{ color: address.main ? 'var(--green-color)' : 'var(--black-color)' }}>
            {index + 1}. {address.address}
            <b>{!!address.main && ' ( Địa chỉ mặc định )'}</b>
          </div>
          <div className={styles.action}>
            <DeleteOutlined onClick={() => onClickDeleteAddress(address)} />
            <EditOutlined onClick={() => onClickEditAddress(address)} />
          </div>

        </div>

      </div>
    ))


  return (
    <div>
      <Col xs={24} md={24}>
        <div className={styles.address_label}>
          <span className={styles.item_label}>Địa chỉ của bạn</span>
            <div className={styles.account_address_btn}>
              <button type="button"
                onClick={() => setIsAddAddressModal(true)}>
                <span className={styles.text}>Thêm địa chỉ</span>
              </button>
          </div>
        </div>
        {!!renderAddress()?.length && (
          <div className={styles.account_address}>{renderAddress()}</div>
        )}

      </Col>

      <ModalPopup
        visible={isAddAddressModal}
        width={800}
        title="Thêm địa chỉ"
        isConfirmBtn={false}
        isCancelBtn={false}
        closeBtn
        handleCancelModal={() => setIsAddAddressModal(false)}
      >
        <Map handlePostAddress={handlePostAddress} handleCloseModalMap={() => setIsAddAddressModal(false)} />
      </ModalPopup>

      <ModalPopup
        handleCancelModal={() => setIsEditAddressModal(false)}
        visible={isEditAddressModal}
        width={800}
        title="Chỉnh sửa địa chỉ"
        closeBtn
        isConfirmBtn={false}
        isCancelBtn={false}
      >
        <Map
          initLocation={initLocation}
          handleCloseModalMap={() => setIsEditAddressModal(false)}
          handlePostAddress={handleUpdateAddress}
          handleChangeMainAddress={handleChangeMainAddress}
        />
      </ModalPopup>

      <ModalPopup
        visible={isDeleteAddressModal}
        title="Xác nhận xóa địa chỉ?"
        handleConfirmModal={handleDeleteAddress}
        handleCancelModal={() => setIsDeleteAddressModal(false)}
        transition="move-up"
      >
        <div>
          {initLocation.address}
        </div>
      </ModalPopup>

    </div>
  )
}

export default Address