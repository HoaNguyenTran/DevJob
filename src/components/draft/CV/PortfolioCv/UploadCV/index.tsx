import React, { FC, useState } from 'react'
import { configConstant } from 'src/constants/configConstant'
import { Button, message, Upload } from 'antd'
import { UploadFileStatus } from 'antd/lib/upload/interface'
import axios from 'axios'
import { getTokenUser, handleError } from 'src/utils/helper'
import { useAppDispatch, useAppSelector } from 'src/redux'

import { patchUpdateUserApi } from 'api/client/user'
import { DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { getProfileRequest } from 'src/redux/user'
import styles from './UploadFile.module.scss'

interface FileImg {
  name: string
  uid: string
  status?: UploadFileStatus | undefined
  url: string
}

const UploadFile: FC<any> = ({ getAvatar, data, handleSetValue }) => {
  const profile = useAppSelector(state => state.user.profile || {})
  const dispatch = useAppDispatch()


  const removeLinkCV = async () => {
    try {
      await patchUpdateUserApi(profile.code, { cvLink: "" })
      message.success("Xoá CV thành công!")
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
  }

  const props = {
    name: 'file',
    multiple: false,
    accept: ".pdf",
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    //   'Authorization': `Bearer ${getTokenUser()}`,
    // },
    onRemove: file => {
      // getAvatar('')
    },
    customRequest: async (options: any) => {
      const fmData = new FormData()
      fmData.append('file', options.file)
      const config = {
        'headers': {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${getTokenUser()}`,
        },
      }
      try {
        const result = await axios.post(options.action, fmData, config)
        options.onSuccess(null, options.file)
        await patchUpdateUserApi(profile.code, {
          cvLink: result.data.linkUrl
        })
        message.success("Tải CV thành công!")
        dispatch(getProfileRequest({ userCode: profile.code }))
      } catch (error) {
        options.onError()
        message.error('Có lỗi xảy ra trong quá trình tải ảnh lên')
      }
    },
  }

  const handleDomainPostImg = () => {
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development)
      return configConstant.domainStagingEnv
    return process.env.NEXT_PUBLIC_API_URL
  }

  return (
    <div className={styles.manageCV}>
      <h3 className={styles.title}>CV</h3>
        <div className={styles.content}>
        {profile.cvLink && <div className={styles.linkCV}>
          <span onClick={() => window.open(profile.cvLink)}>Xem chi tiết CV của bạn tại đây!</span>
          <DeleteOutlined onClick={removeLinkCV} style={{ color: 'var(--red-color)' }} />
        </div>}
        <div className={styles.uploadBtn}>
            <div>
              <Upload
                {...props}
                action={`${handleDomainPostImg()}/upload/v1.0/upload`}
                // onChange={onChange}
                multiple={false}
                className={styles.avatar}
              >
                {/* {fileList.length < 1 && '+ Tải ảnh'} */}
                <Button icon={<UploadOutlined />}>Tải CV của bạn</Button>
              </Upload>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UploadFile
