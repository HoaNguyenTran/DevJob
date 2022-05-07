import React, { FC } from 'react'

import {
  Avatar,
  Image,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/redux'

import { AntDesignOutlined } from '@ant-design/icons'

import styles from './pending-company.module.scss'

const PendingCompany: FC<{ data: CompanyGlobal.CompanyDetail }> = ({ data }) => {
  const { t } = useTranslation()
  const masterData = useAppSelector(state => state.initData.data)

  const industryArr = masterData.FjobIndustry?.filter(e => e.id === data.industryId)
  const industry = industryArr.length === 0 ? undefined : industryArr[0]

  return (
    <div className={styles.main}>
      <div className={styles.main_profile}>
        <div className={styles.main_profile_avt}>
          <Avatar
            size={100}
            icon={
              data.avatar !== '' ? (
                <Image preview={false} src={data.avatar} />
              ) : (
                <AntDesignOutlined />
              )
            }
          />
        </div>
        <div className={styles.main_profile_info}>
          <h3>{t('header.intro')}</h3>
          <p style={{ display: 'inline' }}>
            <span className={styles.main_profile_info_key}>{t('signup.nameCompany')} : </span>
            <span className={styles.main_profile_info_value}>{data.name ?? 'Không có'}</span>
          </p>
          <p style={{ display: 'inline' }}>
            <span className={styles.main_profile_info_key}>
              {t('signup.abbreviationsCompany')} :{' '}
            </span>
            <span className={styles.main_profile_info_value}>{data.shortName ?? 'Không có'}</span>
          </p>
          {industry && (
            <p style={{ display: 'inline' }}>
              <span className={styles.main_profile_info_key}>{t('erSearchEe.categories')} : </span>
              <span className={styles.main_profile_info_value}>{industry.name}</span>
            </p>
          )}
        </div>
        <div className={styles.main_profile_info}>
          <h3>{t('profile.ContactInfo')}</h3>
          {/* <p style={{ display: 'inline' }}>
            <span className={styles.main_profile_info_key}>{t('profile.address')} : </span>
            <span className={styles.main_profile_info_value}>
              {data.companyAddress ?? 'Không có'}
            </span>
          </p> */}
          <p style={{ display: 'inline' }}>
            <span className={styles.main_profile_info_key}>{t('profile.phoneNumber')} : </span>
            <span className={styles.main_profile_info_value}>
              {data.contactPhone ?? 'Không có'}
            </span>
          </p>
          <p style={{ display: 'inline' }}>
            <span className={styles.main_profile_info_key}>{t('signup.website')} : </span>
            <span className={styles.main_profile_info_value}>{data.website ?? 'Không có'}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
export default PendingCompany
