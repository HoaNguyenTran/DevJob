import { message, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import axios from 'axios';
import React, { useState } from 'react'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup';
import { configConstant } from 'src/constants/configConstant';
import { getTokenUser } from 'src/utils/helper';
import styles from "./UploadAvatar.module.scss"

interface IProps {
  avatar: string
  setAvatar(data): void
}

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const UploadAvatar = ({ avatar, setAvatar }: IProps): JSX.Element => {


  const [previewModal, setPreviewModal] = useState(false)

  const props = {
    name: 'file',
    multiple: true,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${getTokenUser()}`,
    },
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
        // getAvatar(result.data.linkUrl)
        setAvatar(result.data.linkUrl)
      } catch (error) {
        options.onError()
        message.error('Có lỗi xảy ra trong quá trình upload ảnh')
      }
    },
  }

  const onChange = info => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, imgUrl =>
        setAvatar(imgUrl)
      );
    }
    setPreviewModal(false)
  };

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

  const handleDomainPostImg = () => {
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development) return configConstant.domainStagingEnv
    return process.env.NEXT_PUBLIC_API_URL
  }

  return (
    <div className={styles.avatar}>
      <div onClick={() => setPreviewModal(true)} className={styles.image}>
        <img src={avatar} alt="" style={{ width: '100%' }} />
      </div>

      <ModalPopup
        title="Ảnh đại diện"
        visible={previewModal}
        handleCancelModal={() => setPreviewModal(false)}
        isConfirmBtn={false}
        isCancelBtn={false}
        closeBtn
      >
        <div className={styles.modal_avatar}>
          <img src={avatar} alt="" />
          <ImgCrop rotate>
            <Upload
              {...props}
              name="avatar"
              listType="text"
              showUploadList={false}
              action={`${handleDomainPostImg()}/upload/v1.0/upload`}
              beforeUpload={beforeUpload}
              onChange={onChange}
              onPreview={onPreview}
              multiple={false}
              className={styles.upload}
            >
              <button type="button">+ Tải ảnh lên</button>
            </Upload>
          </ImgCrop>
        </div>

      </ModalPopup >
    </div >
  )
}

export default UploadAvatar