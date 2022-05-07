import { CloseCircleFilled, UploadOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import { patchUpdateUserApi } from 'api/client/user';
import axios from 'axios';
import router from 'next/router';
import React, { useState } from 'react'
import LinkTo from 'src/components/elements/LinkTo';
import { configConstant } from 'src/constants/configConstant';
import { useAppDispatch, useAppSelector } from 'src/redux';
import { getProfileRequest } from 'src/redux/user';
import { getTokenUser, handleError } from 'src/utils/helper';
import styles from "./CV.module.scss"



const CV = (): JSX.Element => {
  const profile = useAppSelector(state => state.user.profile || {})
  const dispatch = useAppDispatch()

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'application/pdf';
    if (!isJpgOrPng) {
      message.error('Bạn chỉ có thể upload file pdf!');
    }
    const isLt2M = file.size / 1024 / 1024 / 1024 / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
    }
    return isJpgOrPng && isLt2M;
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
        const { data } = await patchUpdateUserApi(profile.code, {
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

  const removeLinkCV = async (e) => {
    e.preventDefault()
    try {
      await patchUpdateUserApi(profile.code, { cvLink: "" })
      message.success("Xoá CV thành công!")
      dispatch(getProfileRequest({ userCode: profile.code }))
    } catch (error) {
      handleError(error)
    }
  }




  return (
    <div className={styles.cv}>
      <div className={styles.cv_header}>
        <div className={styles.cv_title}>
          <div className={styles.title}>CV
          </div>
          <img alt="" src="/assets/icons/color/icon_check.svg" />
        </div>


        {profile.cvLink ? <div className={styles.cv_action}>
          <div className={styles.cv_view} onClick={() => window.open(profile.cvLink)}>

            <img alt="" src="/assets/images/portfolio/icon/1.svg" />
            Xem
          </div>

          <div className={styles.cv_edit}>

            <Upload
              {...props}
              action={`${handleDomainPostImg()}/upload/v1.0/upload`}
              multiple={false}
              beforeUpload={beforeUpload}
              className={styles.avatar}
            >
              <img alt="" src="/assets/images/portfolio/icon/3.svg" />
              <span>
                Chỉnh sửa
              </span>
            </Upload>
          </div>

          <div className={styles.cv_remove} onClick={removeLinkCV}>
            <img alt="" src="/assets/images/portfolio/icon/4.svg" />
            Xóa
          </div>
        </div>
          :
          <div className={styles.cv_upload}>
            <Upload
              {...props}
              action={`${handleDomainPostImg()}/upload/v1.0/upload`}
              multiple={false}
              beforeUpload={beforeUpload}
              className={styles.avatar}
            >
              <img alt="" src="/assets/images/portfolio/icon/5.svg" />
              Tải lên CV
            </Upload>
          </div>

        }
      </div>
      <div className={styles.cv_main}>
        {/* <div className={styles.cv_text}> */}
        {profile.cvLink
          ?
          <div className={styles.cv_link} >
            <img src="/assets/images/portfolio/cv.png" alt="" />
          </div>
          : <div className={styles.cv_empty}>
            <div className={styles.title}>
              Chưa có CV</div>
            <div className={styles.subtitle}>
              (Định dạng file .pdf có dung lượng <span>&#8804;</span> 5MB)
            </div>
          </div>
        }
      </div>
      {/* </div> */}
    </div>

  )
}

export default CV