import React, { FC, useEffect, useState } from 'react'

import { Button, Divider, Form, Image, Input, message, Modal, Radio, Select } from 'antd'
import { deleteUserExperienceApi, postSaveUserExperienceApi, patchUserExperienceApi, patchUpdateUserApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { filterSelectOption, filterSortSelectOption, handleError } from 'src/utils/helper'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import ModalRewardDiamond from 'src/components/elements/Modal/ModalRewardDiamond/ModalRewardDiamond'
import styles from './experience.module.scss'


interface IRewardDiamond {
  name: string,
  diamond: number
}

const expConstants = {
  noRequire: {
    key: 0,
    name: "Không có kinh nghiệm"
  },
  chooseSkill: {
    key: 1,
    name: "Đã có kinh nghiệm"
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}




const Experience: FC<any> = ({ setFlagExp }) => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const profile = useAppSelector(state => state.user.profile || {})

  const {
    FjobCategory: fjobCategory = [],
    FjobExperience: fjobExperience = []
  } = useAppSelector(state => state.initData.data)

  const [fjobCategoryChild, setFjobCategoryChild] = useState<any>([])
  const [isNew, setNew] = useState<boolean>(true)

  const [confirmLoading, setConfirmLoading] = useState(false)
  const [currentId, setCurrentId] = useState<number>()


  const [isAddExpBtn, setIsAddExpBtn] = useState(false)

  const [isAddExpModal, setIsAddExpModal] = useState(false)
  const [isRemoveExpModal, setIsRemoveExpModal] = useState(false)

  const [rewardDiamond, setRewardDiamond] = useState<IRewardDiamond>({} as IRewardDiamond)
  const [isRewardDiamondModal, setIsRewardDiamondModal] = useState(false)

  const handleConfirmRemoveExpModal = async () => {
    setConfirmLoading(true)
    try {
      await deleteUserExperienceApi(currentId)
      dispatch(getProfileRequest({ userCode: profile.code }))
      message.success('Xóa thành công')
      setIsRemoveExpModal(false)
      setConfirmLoading(false)

      if (profile.experiences.length === 1) {
        setFlagExp(false)
      }
    } catch (error) {
      handleError(error)
      setIsRemoveExpModal(false)
      setConfirmLoading(false)
    }
  }

  const handleConfirmAddExpModal = async () => {
    const { categoryId, experienceId, mainCategoryId, note } = form.getFieldsValue()

    if (categoryId && mainCategoryId && experienceId) {
      try {
        const formData = { ...form.getFieldsValue(), userId: profile?.id }
        delete formData.mainCategoryId

        if (isNew) {
          delete formData.id
          const { data } = await postSaveUserExperienceApi(formData)

          if (data.profileRewarded) {
            setIsRewardDiamondModal(true)
            setRewardDiamond({ name: "hồ sơ cá nhân", diamond: data.profileRewarded })
          }
        } else {
          await patchUserExperienceApi(formData, formData.id)
        }
        dispatch(getProfileRequest({ userCode: profile.code }))
        setIsAddExpModal(false)
        message.success(`${isNew ? "Thêm mới thành công!" : "Cập nhật thành công!"}`)
      } catch (error) {
        handleError(error)
      }
    }
  }

  const onChange = value => {
    form.setFieldsValue({ 'categoryId': null })
    setFjobCategoryChild(fjobCategory.filter(item => item.parentId === value))
  }


  const renderExp = (profile?.experiences || []).map(item => (
    <div key={item.id} className={styles.exp_item}>
      <div className={styles.img}>
        <Image
          preview={false}
          color="green"
          height={48}
          width={48}
          src="/assets/images/other/confirm.png"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.item}>
          Vị trí làm việc:&nbsp;
          <span>
            {fjobCategory.find(i => i.id === item.categoryId)?.name}
          </span>
        </div>
        <div className={styles.item}>
          Thời gian:&nbsp;
          <span>
            {fjobExperience.find(i => i.id === item.experienceId)?.name}
          </span>
        </div>
        {item.note && <div className={styles.item}>
          Ghi chú:&nbsp;
          <span>
            {item.note}
          </span>
        </div>}
      </div>

      <div className={styles.option}>
        <div>
          <EditOutlined
            onClick={() => {
              setValueToForm(item)
              setNew(false)
            }}
            style={{ fontSize: '20px', cursor: 'pointer', color: '#b5b5b5', margin: '10px 0' }}
          />
        </div>
        <div>
          <DeleteOutlined
            onClick={() => {
              setCurrentId(item.id)
              setIsRemoveExpModal(true)
            }}
            style={{ fontSize: '20px', cursor: 'pointer', color: '#b5b5b5' }}
          />
        </div>
      </div>
    </div>
  ))

  const setValueToForm = item => {
    const mainCategoryId = fjobCategory.find(i => i.id === item.categoryId)?.parentId
    setFjobCategoryChild(fjobCategory.filter(i => i.parentId === mainCategoryId))

    form.setFieldsValue({ 'mainCategoryId': mainCategoryId })
    form.setFieldsValue({ 'categoryId': item.categoryId })
    form.setFieldsValue({ 'experienceId': item.experienceId })
    form.setFieldsValue({ 'note': item.note })
    form.setFieldsValue({ 'id': item.id })

    setIsAddExpModal(true)
  }

  useEffect(() => {
    setIsAddExpBtn(profile.hasExperience === expConstants.chooseSkill.key)
  }, [profile.hasExperience])


  return (
    <div className={styles.exp}>
      <h3 className={styles.exp_title}>Kinh nghiệm làm việc<span> (*)</span></h3>
      <div className={styles.status}>
        <div className={styles.radio}>
          {profile.hasExperience !== expConstants.chooseSkill.key &&
            <Radio.Group defaultValue={profile.hasExperience}>
              <Radio value={expConstants.noRequire.key}
                onClick={async () => {
                  setIsAddExpBtn(false)
                  setFlagExp(false)
                  await patchUpdateUserApi(profile.code, { hasExperience: expConstants.noRequire.key })
                  dispatch(getProfileRequest({ userCode: profile.code }))

                }}>
                {expConstants.noRequire.name}
              </Radio>
              <Radio value={expConstants.chooseSkill.key}
                onClick={() => {
                  form.resetFields()
                  setIsAddExpBtn(true)
                  setNew(true)
                  setFlagExp(true)
                }}>
                {expConstants.chooseSkill.name}</Radio>
            </Radio.Group>
          }
        </div>
        <div className={styles.add}>
          {((profile.hasExperience === expConstants.chooseSkill.key) || isAddExpBtn) && <div
            onClick={() => {
              form.resetFields()
              setIsAddExpModal(true)
              setNew(true)
            }}
          >
            <PlusOutlined /> Thêm kinh nghiệm
          </div>}
        </div>

      </div>

      <div className={styles.main}>{renderExp}</div>

      <Modal
        visible={isRemoveExpModal}
        onOk={handleConfirmRemoveExpModal}
        confirmLoading={confirmLoading}
        onCancel={() => setIsRemoveExpModal(false)}
        cancelText="Hủy"
        okText="Xóa"
        wrapClassName="modal-global"
      >
        <div className="modal-title">Bạn muốn xoá kinh nghiệm?</div>
      </Modal>

      <Modal
        width={1000}
        visible={isAddExpModal}
        onCancel={() => { setIsAddExpModal(false) }}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        wrapClassName="modal-global portfolio"
        cancelText="Hủy"
        okText="Hoàn thành"
      >
        <div className="modal-body">
          <div className="modal-title">Kinh nghiệm làm việc</div>
          <Divider />
          <Form
            {...formItemLayout}
            form={form}
            initialValues={{}}
            scrollToFirstError
            onFinish={handleConfirmAddExpModal}
          >
            <Form.Item name="id" hidden />
            <span className="fieldLabel">
              Ngành nghề có kinh nghiệm <span className="field-required">*</span>
            </span>
            <Form.Item
              name="mainCategoryId"
              rules={[
                {
                  required: true,
                  message: 'Ngành nghề có kinh nghiệm không được để trống!',
                },
              ]}
              labelAlign="left"
            >
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                size="large"
                allowClear
                showSearch
                placeholder="Chọn ngành nghề"
                filterOption={filterSelectOption}
                filterSort={filterSortSelectOption}
                optionFilterProp="children"
                onChange={onChange}
              >
                {fjobCategory.filter(category => category.parentId === 0).map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className="fieldLabel">
              Chọn lĩnh vực <span className="field-required">*</span>
            </span>
            <Form.Item
              labelAlign="left"
              name="categoryId"
              rules={[
                {
                  required: true,
                  message: 'Lĩnh vực không được để trống!',
                },
              ]}
            >
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                style={{ borderRadius: '6px' }}
                size="large"
                allowClear
                showSearch
                disabled={!fjobCategoryChild.length}
                optionFilterProp="children"
                filterOption={filterSelectOption}
                filterSort={filterSortSelectOption}
                placeholder="Chọn lĩnh vực"
              >
                {fjobCategoryChild.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className="fieldLabel">
              Thời gian làm việc <span className="field-required">*</span>
            </span>

            <Form.Item
              labelAlign="left"
              name="experienceId"
              rules={[
                {
                  required: true,
                  message: 'Thời gian làm việc không được để trống!',
                },
              ]}
            >
              <Select
                getPopupContainer={trigger => trigger.parentNode}
                style={{ borderRadius: '6px' }}
                size="large"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={filterSelectOption}
                // filterSort={filterSortSelectOption}
                placeholder="Thời gian làm việc"
              >
                {fjobExperience.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className="fieldLabel">Ghi chú</span>
            <Form.Item labelAlign="left" name="note" initialValue=""
              rules={[
                {
                  max: 500,
                  message: 'Tối đa 500 kí tự!',
                },
              ]}>
              <Input style={{ borderRadius: '6px', height: '40px' }} placeholder="Ghi chú" />
            </Form.Item>
            <Button
              style={{ borderRadius: '10px', width: '100%' }}
              type="primary"
              htmlType="submit"
            >
              Hoàn thành
            </Button>
          </Form>
        </div>
      </Modal>

      <ModalRewardDiamond
        isRewardDiamondModal={isRewardDiamondModal}
        setIsRewardDiamondModal={setIsRewardDiamondModal}
        rewardDiamond={rewardDiamond}
      />

    </div>
  )
}
export default Experience
