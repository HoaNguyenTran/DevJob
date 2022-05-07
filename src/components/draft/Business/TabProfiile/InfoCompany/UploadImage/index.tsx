import 'antd/dist/antd.css'

import React, { FC, useEffect, useState } from 'react'

import { message, Upload } from 'antd'
import ImgCrop from 'antd-img-crop'
import { UploadFileStatus } from 'antd/lib/upload/interface'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { getTokenUser } from 'src/utils/helper'
import { configConstant } from 'src/constants/configConstant'

interface FileImg {
  name: string
  uid: string
  status?: UploadFileStatus | undefined
  url: string
}

interface ImageData {
  uid: string
  image: string
  type: number
}

interface UploadProp {
  imagesData: ImageData[]
  getImageUpload: (value: ImageData[], type: number) => void
  type: number
}

const UploadImage: FC<UploadProp> = ({ imagesData, getImageUpload, type }) => {
  const { t } = useTranslation()
  const data: FileImg[] = Array.from(
    imagesData.map(
      (item, index): FileImg => ({
        url: item.image,
        name: index.toString(),
        uid: index.toString(),
      }),
    ),
  )

  const imgs: ImageData[] = Array.from(
    imagesData.map(
      (item, index): ImageData => ({
        image: item.image,
        type,
        uid: index.toString(),
      }),
    ),
  )

  const [imageUrlChange, setImageUrlChange] = useState<ImageData[]>(imgs)

  const [fileList, setFileList] = useState<FileImg[]>(data ?? [])
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
      const removeImage = imageUrlChange.filter(item => item.uid !== file.uid)
      setImageUrlChange(removeImage)
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
        if (result.status === 201) {
          options.onSuccess(null, options.file)
          const oldData = imageUrlChange
          const newImageUpload = [
            ...oldData,
            {
              type,
              image: result.data.linkUrl,
              uid: fileList[fileList.length - 1].uid,
            },
          ]
          setImageUrlChange(newImageUpload)
        }
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


  useEffect(() => {
    getImageUpload(imageUrlChange, type)
  }, [imageUrlChange])

  return (
    <ImgCrop rotate>
      <Upload
        {...props}
        action={`${handleDomainPostImg()}/upload/v1.0/upload`}
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        multiple
      >
        {fileList.length < 5 && '+ Upload'}
      </Upload>
    </ImgCrop>
  )
}

export default UploadImage
