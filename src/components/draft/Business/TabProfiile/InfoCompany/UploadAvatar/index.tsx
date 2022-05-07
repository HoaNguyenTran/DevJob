import React, { FC, useState } from 'react'

import { message, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { UploadFileStatus } from 'antd/lib/upload/interface'
import axios from 'axios'
import { getTokenUser } from 'src/utils/helper'

import { configConstant } from 'src/constants/configConstant'
import styles from './UploadAvatar.module.scss'

interface FileImg {
  name: string
  uid: string
  status?: UploadFileStatus | undefined
  url: string
}
const UploadAvatar: FC<{ avatar: string; getAvatar: (url: string) => void }> = ({
  avatar,
  getAvatar,
}) => {
  const [fileList, setFileList] = useState<FileImg[]>([
    {
      name: 'avatar',
      uid: 'avatar',
      url: avatar,
    },
  ])
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const onPreview = async file => {
    let src = file.url
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    if (imgWindow) {
      imgWindow.document.write(image.outerHTML)
    }
  }

  const props = {
    name: 'file',
    multiple: true,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${getTokenUser()}`,
    },
    onRemove: file => {
      getAvatar('')
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
        getAvatar(result.data.linkUrl)
      } catch (error) {
        options.onError()
        message.error('Có lỗi xảy ra trong quá trình upload ảnh')
      }
    },
  }

  const handleDomainPostImg = () => {
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development) return configConstant.domainStagingEnv
    return process.env.NEXT_PUBLIC_API_URL
  }

  return (
    <div className={styles.avatar}>
      <ImgCrop rotate>
        <Upload
          {...props}
          action={`${handleDomainPostImg()}/upload/v1.0/upload`}
          listType="picture-card"
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          multiple={false}
          className={styles.avatar}
        >
          {fileList.length < 1 && '+ Tải ảnh lên'}
        </Upload>
      </ImgCrop>
    </div>
  )
}
export default UploadAvatar
