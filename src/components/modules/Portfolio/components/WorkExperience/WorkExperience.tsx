import React, { useEffect, useState } from 'react'

import { Form, Input, message, Radio, Select } from 'antd'
import { deleteUserExperienceApi, postSaveUserExperienceApi, patchUserExperienceApi, patchUpdateUserApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { filterSelectOption, filterSortSelectOption, handleError } from 'src/utils/helper'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import ModalRewardDiamond from 'src/components/elements/Modal/ModalRewardDiamond/ModalRewardDiamond'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import styles from './WorkExperience.module.scss'


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


const WorkExperience = ({ setFlagExp }): JSX.Element => {
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()

  const profile = useAppSelector(state => state.user.profile || {})

  const {
    FjobCategory: categoryList = [],
    FjobExperience: experienceList = []
  } = useAppSelector(state => state.initData.data)

  const [categoryChildList, setCategoryChildList] = useState<any>([])

  const [statusAction, setStatusAction] = useState("")
  const [currentExpId, setCurrentExpId] = useState<number>()


  const [isAddExpBtn, setIsAddExpBtn] = useState(false)

  const [isExperienceModal, setIsExperienceModal] = useState(false)
  const [isRemoveExpModal, setIsRemoveExpModal] = useState(false)

  const [rewardDiamond, setRewardDiamond] = useState<IRewardDiamond>({} as IRewardDiamond)
  const [isRewardDiamondModal, setIsRewardDiamondModal] = useState(false)

  const handleConfirmRemoveExpModal = async () => {
    try {
      await deleteUserExperienceApi(currentExpId)
      dispatch(getProfileRequest({ userCode: profile.code }))
      message.success('Xóa thành công')
      if (profile.experiences.length === 1) {
        setFlagExp(false)
      }
    } catch (error) {
      handleError(error)
    } finally {
      setIsRemoveExpModal(false)
    }
  }

  const handleConfirmExpModal = async () => {
    const { categoryId, experienceId, mainCategoryId, note } = form.getFieldsValue()

    if (categoryId && mainCategoryId && experienceId) {
      try {
        const formData = { ...form.getFieldsValue(), userId: profile.id }
        delete formData.mainCategoryId

        if (statusAction === "Thêm") {
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
        setIsExperienceModal(false)
        message.success(`${statusAction === "Thêm" ? "Thêm mới thành công!" : "Cập nhật thành công!"}`)
      } catch (error) {
        handleError(error)
      }
    }
  }

  const onChangeCategory = value => {
    form.setFieldsValue({ 'categoryId': null })
    setCategoryChildList(categoryList.filter(item => item.parentId === value))
  }

  const renderExp = (profile?.experiences || []).map(exp => (
    <div key={exp.id} className={styles.experience_item}>
      <div className={styles.img}>
        <img alt="" src={categoryList.find(item => item.id === categoryList.find(cate => cate.id === 1009)?.parentId)?.avatar} />
      </div>

      <div className={styles.content}>
        <div className={styles.item}>
          Vị trí làm việc:&nbsp;
          <span>
            {categoryList.find(i => i.id === exp.categoryId)?.name}
          </span>
        </div>
        <div className={styles.item}>
          Thời gian:&nbsp;
          <span>
            {experienceList.find(i => i.id === exp.experienceId)?.name}
          </span>
        </div>
        {exp.note && <div className={styles.item}>
          Ghi chú:&nbsp;
          <span>
            {exp.note}
          </span>
        </div>}
      </div>

      <div className={styles.option}>
        <div>
          <EditOutlined
            onClick={() => {
              setValueToForm(exp)
              setStatusAction("Cập nhật")
            }}
            className={styles.icon}
          />
        </div>
        <div>
          <DeleteOutlined
            onClick={() => {
              setCurrentExpId(exp.id)
              setIsRemoveExpModal(true)
            }}
            className={styles.icon}
          />
        </div>
      </div>
    </div>
  ))

  const setValueToForm = item => {
    const mainCategoryId = categoryList.find(i => i.id === item.categoryId)?.parentId
    setCategoryChildList(categoryList.filter(i => i.parentId === mainCategoryId))

    form.setFieldsValue({ 'mainCategoryId': mainCategoryId })
    form.setFieldsValue({ 'categoryId': item.categoryId })
    form.setFieldsValue({ 'experienceId': item.experienceId })
    form.setFieldsValue({ 'note': item.note })
    form.setFieldsValue({ 'id': item.id })

    setIsExperienceModal(true)
  }

  useEffect(() => {
    setIsAddExpBtn(profile.hasExperience === expConstants.chooseSkill.key)
  }, [profile.hasExperience])


  return (
    <div className={styles.experience}>
      <div className={styles.experience_header}>
        <div className={styles.experience_title}>
          <div className={styles.title}>Kinh nghiệm làm việc
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>
        {((profile.hasExperience === expConstants.chooseSkill.key) || isAddExpBtn) && <div
          className={styles.experience_add}
          onClick={() => {
            form.resetFields()
            setIsExperienceModal(true)
            setStatusAction("Thêm")
          }}
        >
          <PlusOutlined style={{ marginRight: '.25rem' }} /> Thêm mới
        </div>}
      </div>
      <div className={styles.experience_status}>
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
                  setIsExperienceModal(true)
                  setStatusAction("Thêm")
                  setFlagExp(true)
                }}>
                {expConstants.chooseSkill.name}</Radio>
            </Radio.Group>
          }
        </div>

      </div>

      <div className={styles.experience_content}>{renderExp}</div>

      <ModalPopup
        visible={isRemoveExpModal}
        handleConfirmModal={handleConfirmRemoveExpModal}
        handleCancelModal={() => setIsRemoveExpModal(false)}
        title="Xác nhận xoá kinh nghiệm"
        textConfirm='Xóa'
      >
        <div>
          Bạn chắc chắn muốn xoá kinh nghiệm đã chọn?
        </div>
      </ModalPopup>

      <ModalPopup
        width={800}
        visible={isExperienceModal}
        handleCancelModal={() => setIsExperienceModal(false)}
        handleConfirmModal={handleConfirmExpModal}
        title={`${statusAction} kinh nghiệm làm việc`}
        textConfirm={`${statusAction} kinh nghiệm`}
      >
        <div className="portfolio">
          <Form
            {...formItemLayout}
            form={form}
            scrollToFirstError
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
                onChange={onChangeCategory}
              >
                {categoryList.filter(category => category.parentId === 0).map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <span className="fieldLabel">
              Lĩnh vực <span className="field-required">*</span>
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
                style={{ borderRadius: '7px' }}
                size="large"
                allowClear
                showSearch
                disabled={!categoryChildList.length}
                optionFilterProp="children"
                filterOption={filterSelectOption}
                filterSort={filterSortSelectOption}
                placeholder="Chọn lĩnh vực"
              >
                {categoryChildList.map((item: any) => (
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
                size="large"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={filterSelectOption}
                placeholder="Thời gian làm việc"
              >
                {experienceList.map((item) => (
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
              <Input.TextArea style={{ borderRadius: '.5rem' }} autoSize={{ minRows: 4 }} placeholder="Ghi chú" />
            </Form.Item>
          </Form>

        </div>
      </ModalPopup >

      <ModalRewardDiamond
        isRewardDiamondModal={isRewardDiamondModal}
        setIsRewardDiamondModal={setIsRewardDiamondModal}
        rewardDiamond={rewardDiamond}
      />

    </div >
  )
}
export default WorkExperience
