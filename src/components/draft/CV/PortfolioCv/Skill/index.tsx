import React, { FC, useState } from 'react'

import { Button, Divider, Form, Image, Input, message, Modal, Radio, Select } from 'antd'
import { deleteUserProSkillApi, patchSaveUserExperienceApi } from 'api/client/user'
import { useAppDispatch, useAppSelector } from 'src/redux'
import { getProfileRequest } from 'src/redux/user'
import { filterSelectOption, handleError } from 'src/utils/helper'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'

import ModalRewardDiamond from 'src/components/elements/Modal/ModalRewardDiamond/ModalRewardDiamond'
import styles from './skill.module.scss'

interface IRewardDiamond {
  name: string,
  diamond: number
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}

const Skill: FC = () => {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()

  const profile = useAppSelector(state => state.user.profile || {})

  const {
    FjobProfSkill: fjobProfSkill = [],
    FjobExperience: fjobExperience = []
  } = useAppSelector(state => state.initData.data)


  const [confirmLoading, setConfirmLoading] = React.useState(false)
  const [currentId, setCurrentId] = useState<number>()

  const [isRemoveSkillModal, setIsRemoveSkillModal] = React.useState(false)
  const [isAddSkillModal, setIsAddSkillModal] = useState(false)

  const [rewardDiamond, setRewardDiamond] = useState<IRewardDiamond>({} as IRewardDiamond)
  const [isRewardDiamondModal, setIsRewardDiamondModal] = useState(false)


  const handleConfirmRemoveSkillModal = async () => {
    setConfirmLoading(true)
    try {
      await deleteUserProSkillApi(currentId)
      dispatch(getProfileRequest({ userCode: profile.code }))
      message.success('Xóa thành công')
      setIsRemoveSkillModal(false)
      setConfirmLoading(false)
    } catch (error) {
      handleError(error)
      setIsRemoveSkillModal(false)
      setConfirmLoading(false)
    }
  }

  const noData = (
    <div className={styles.no_data}>
      <p style={{ fontStyle: 'italic', color: 'grey', marginTop: '20px' }}>
        Đừng bỏ lỡ mục này, vì nó khiến bạn mất đi một cơ hội để chứng tỏ cho nhà tuyển dụng thấy
        được khả năng của mình!
      </p>
    </div>
  )

  const renderRating = [1, 2, 3, 4, 5].map(item => (
    <span style={{ marginRight: '5px' }} key={item}>
      <Image preview={false} height={20} width={20} src="/assets/images/icon/icon21.png" />
    </span>
  ))

  const onChangeProSkill = item => {
    form.setFieldsValue({ 'id': item.id })
    form.setFieldsValue({ 'profSkillId': item.profSkillId })
    form.setFieldsValue({ 'experience': item.experience })
    form.setFieldsValue({ 'note': item.note })
    setIsAddSkillModal(true)
  }

  const renderSkill = (profile.profSkills || []).map(item => (
    <div key={item.id} className={styles.skill_wrap}>
      <div className={styles.skill_item}>
        <p className={styles.skill_item_title}>
          {fjobProfSkill.find(i => i.id === item.profSkillId)?.name}
        </p>
        <div className={styles.rate}>
          <div>Đánh giá:</div>
          {renderRating}
        </div>
        {!!item.experience && <p className={styles.skill_item_time}>
          <div>Thời gian:</div>
          <span>
            {fjobExperience.find(i => i.id === item.experience)?.name}
          </span>
        </p>}
        {item.note &&
          <div className={styles.note}>
            Ghi chú:&nbsp;
            <span style={{ fontStyle: 'italic', color: 'grey' }}>&nbsp;{item.note}</span>
          </div>
        }
      </div>
      <div className={styles.option}>
        <EditOutlined
          onClick={() => onChangeProSkill(item)}
          style={{ fontSize: '20px', cursor: 'pointer', color: '#b5b5b5', margin: '10px 0' }}
        />
        <DeleteOutlined
          onClick={() => {
            setCurrentId(item.id)
            setIsRemoveSkillModal(true)
          }}
          style={{ fontSize: '20px', cursor: 'pointer', color: '#b5b5b5' }}
        />
      </div>
    </div>
  ))



  const handleConfirmAddModal = async () => {
    try {
      const formData = { ...form.getFieldsValue(), userId: profile.id }
      if (!formData.id) {
        delete formData.id
      }
      const { data } = await patchSaveUserExperienceApi(formData)

      if (data.profileRewarded) {
        setIsRewardDiamondModal(true)
        setRewardDiamond({ name: "hồ sơ cá nhân", diamond: data.profileRewarded })
      }

      dispatch(getProfileRequest({ userCode: profile.code }))
      if (!formData.id) {
        message.success('Thêm mới thành công')
      } else {
        message.success('Cập nhật thành công')
      }
    } catch (error) {
      handleError(error)
    }
    setIsAddSkillModal(false)
  }


  return (
    <div className={styles.skill}>
      <div className={styles.row}>
        <h3 className={styles.title}>Kỹ năng<span> (*)</span></h3>
        {/* {profile.hasExperience ? null : <Radio.Group
          defaultValue={profile.hasExperience}
        >
          <Radio value={skillConstants.noRequire.key}>{skillConstants.noRequire.name}</Radio>
          <Radio value={skillConstants.chooseSkill.key}
            onClick={() => {
              setIsAddSkillModal(true);
              form.resetFields()
            }}>
            {skillConstants.chooseSkill.name}</Radio>
        </Radio.Group>} */}
        <div
          className={styles.edit}
          onClick={() => {
            setIsAddSkillModal(true)
            form.resetFields()
          }}
        >
          <PlusOutlined style={{ marginRight: '10px' }} /> Thêm kỹ năng
        </div>
      </div>

      <div className={styles.content}>{profile.profSkills?.length === 0 ? noData : renderSkill}</div>

      <Modal
        wrapClassName="modal-global portfolio"
        visible={isRemoveSkillModal}
        onOk={handleConfirmRemoveSkillModal}
        confirmLoading={confirmLoading}
        onCancel={() => setIsRemoveSkillModal(false)}
        cancelText="Hủy"
        okText="Xóa"
      >
        <div className="modal-body">
          <div className="modal-title">Bạn muốn xóa kỹ năng ?</div>
        </div>
      </Modal>

      <Modal
        wrapClassName="modal-global portfolio"
        visible={isAddSkillModal}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setIsAddSkillModal(false)}
        cancelText="Hủy"
        okText="Hoàn thành"
      >
        <div className="modal-body">
          <div className="modal-title">Kỹ năng cá nhân</div>
          <Divider />
          <Form
            {...formItemLayout}
            onFinish={handleConfirmAddModal}
            form={form}
            initialValues={{}}
            scrollToFirstError
          >
            <Form.Item name="id" hidden />
            <span className="fieldLabel">
              Kỹ năng cá nhân <span className="field-required">*</span>
            </span>
            <Form.Item
              name="profSkillId"
              rules={[
                {
                  required: true,
                  message: 'Kỹ năng không được để trống!',
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
                placeholder="Kỹ năng cá nhân"
              >
                {fjobProfSkill.map(item => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {/* <span className="fieldLabel">
              Thời gian làm việc <span className="field-required">*</span>
            </span>
            <Form.Item
              name="experience"
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
                {fjobExperience.map((item: any) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item> */}
            <span className="fieldLabel">Ghi chú</span>
            <Form.Item
              name="note"
              initialValue=""
              rules={[
                {
                  max: 500,
                  message: 'Tối đa 500 kí tự!',
                },
              ]}
            >
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

export default Skill
