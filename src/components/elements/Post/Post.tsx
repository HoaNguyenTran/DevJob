import React, { FC } from 'react'

import {
  Col,
  Dropdown,
  Menu,
  Row,
} from 'antd'
import { configConstant } from 'src/constants/configConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { useAppSelector } from 'src/redux'
import {
  convertToHumanDate,
  formatNumber,
} from 'src/utils/helper'

import styles from './Post.module.scss'

interface Iprops {
  propsData: any | undefined
  extendFunc?: any
  handleGetDetailPost?: (data) => void
  isOptions?: boolean
}

const Post: FC<Iprops> = props => {
  const { extendFunc = [], handleGetDetailPost, propsData = {}, isOptions } = props
  const masterData = useAppSelector(state => state.initData.data)
  const { company } = propsData
  const isJobCreatedByCompany = propsData.companyId;
  const displayAvatar = isJobCreatedByCompany ? company.avatar : configConstant.defaultPicture;

  const renderIcon = () => (
    <>
      {!!propsData.isUrgent && (
        <div className={styles.post_header_urgent}>
          <img src="/assets/icons/icon_urgent.png" className='object-fit-contain' alt="urgent" />
          Siêu gấp
        </div>
      )}
      {!!propsData.isHotJob && (
        <div className={styles.post_header_hot}>
          <img src="/assets/icons/icon_hot.png" alt="hot" className='object-fit-contain' />
          Siêu hot
        </div>
      )}
    </>
  )

  const menu = (
    <Menu className='px-2 py-3'>
      {extendFunc.map(item => (
        <Menu.Item key={item.key}>
          <div
            onClick={e => {
              e.stopPropagation();
              e.preventDefault()
              item.func()
            }}
            style={{ color: item.key === 5 ? 'var(--red-color)' : 'var(--black-color)' }}
          >
            {item.text}
          </div>
        </Menu.Item>
      ))}
    </Menu>
  )

  const nameOwnJob = propsData.companyId ? propsData.company.name : propsData.user.name;
  return (
    <div className={styles.post}>
      <div className={`${styles.post_inner} ${propsData.isActive ? styles.active_item : ""}`}>
        <div className={styles.post_header}>
          <div className={`${styles.post_header_left} w-100`}>
            <div className='d-flex w-100'>
              <img className={styles.avatar} src={displayAvatar || configConstant.defaultPicture} alt="avatar" />
              <div className=''>
                <div className='d-flex justify-content-space-between'>
                  <div className='information-job d-flex align-items-center'>
                    <span className={styles.post_header_id} style={{ backgroundColor: propsData.color || "var(--primary-color)" }}>
                      #{propsData.id}
                    </span>
                    <div className={styles.post_header_icon}>{renderIcon()}</div>
                  </div>

                </div>
                <a target="_blank" href={`${routerPathConstant.jobDetail.replace(":id", "")}${propsData.id}`} className={styles.link_section} rel="noreferrer">
                  <span className={styles.title}>{propsData.title}</span>
                </a>

                <div className={styles.verification}>
                  <img src='/assets/icons/color/verification_success.png' alt='verification' />
                  {nameOwnJob}
                </div>
              </div>
            </div>
          </div>

          {
            isOptions &&
            <Dropdown
              arrow
              getPopupContainer={(triggerNode: HTMLElement) =>
                (triggerNode?.parentNode as HTMLElement) || document.body
              }
              overlay={menu}
              trigger={['click']}
              placement="bottomRight"
            >
              <a
                className="ant-dropdown-link"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (handleGetDetailPost) {
                    handleGetDetailPost(propsData)
                  }
                }}
              >
                <img className={styles.post_header_options} src='/assets/icons/color/button_more.png' alt='options' />
              </a>
            </Dropdown>
          }

        </div>

        <div className={styles.post_body}>
          <div className={styles.post_body_item}>
            <img src="/assets/icons/default/time.svg" alt="" />
            {masterData.JobType?.find(item => item.id === propsData.jobType)?.name}
          </div>
          <div className={styles.post_body_item}>
            <img src="/assets/icons/default/money.svg" alt="" />
            {propsData.wageMin
              ? `${formatNumber(propsData.wageMin)} - ${formatNumber(propsData.wageMax)} VNĐ/${masterData.WageUnit?.find(item => item.id === propsData.wageUnit)?.name
              }`
              : 'Thoả thuận'}
          </div>
        </div>

        <div className={styles.post_footer}>
          <Row className='w-100'>
            <Col xs={24} md={11} className="d-flex justify-content-space-between">
              <div className={`${styles.post_footer_item}`}>
                {/* <img alt="" src="/assets/icons/default/view.svg" /> */}
                {propsData.viewCount} lượt xem
              </div>
              <div className={styles.post_footer_item}>
                {/* <img alt="" src="/assets/icons/default/profile.svg" /> */}
                {propsData.appliedCount} hồ sơ
              </div>
              <div className={styles.post_footer_item}>
                {/* <img alt="" src="/assets/icons/default/user.svg" /> */}
                {`${propsData.acceptedCount}/${propsData.hiringCount}`} đã tuyển
              </div>
            </Col>
            <Col xs={24} md={13}>
              <div className='text-md-right' style={{ color: propsData.color || "var(--primary-color)" }}>
                Hiển thị: {convertToHumanDate(propsData.startTime)} -{' '}
                {convertToHumanDate(propsData.expireTime)}
              </div>
            </Col>
          </Row>


        </div>
      </div>
    </div>
  )
}

export default Post
