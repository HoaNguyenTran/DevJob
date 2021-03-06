/* eslint-disable no-nested-ternary */
import { Form, Input, message, Upload } from 'antd'
import { getAccountVerificationApi, accountVerificationAPI } from 'api/client/user'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import ModalPopup from 'src/components/elements/ModalPopup/ModalPopup'
import { configConstant } from 'src/constants/configConstant'
import { roleConstant } from 'src/constants/roleConstant'
import { routerPathConstant } from 'src/constants/routerConstant'
import { storageConstant } from 'src/constants/storageConstant'
import { useAppSelector } from 'src/redux'
import { getTokenUser, handleError } from 'src/utils/helper'
import { getUserRoleCookieCSR } from 'src/utils/storage'
import styles from './Verify.module.scss'


enum ImageType {
  front = 0,
  back = 1,
  selfie = 2
}

enum VerifyType {
  pending = 0,
  verify = 1,
  reject = 2
}

const index = () => {
  const profile = useAppSelector(state => state.user.profile || {});
  const [frontDocument, setFrontDocument] = useState("");
  const [backDocument, setBackDocument] = useState("");
  const [selfie, setSelfie] = useState("");
  const [verify, setVerify] = useState<number | undefined>(undefined)
  const [isSuccessModal, setIsSuccessModal] = useState(false);
  const router = useRouter()

  const frontDocumentRef = useRef<any>();
  const backDocumentRef = useRef<any>();
  const selfieRef = useRef<any>();

  useEffect(() => {
    getAccountVerification()
  }, [])

  const getAccountVerification = async () => {
    try {
      const resData = await getAccountVerificationApi({ userId: profile.id })
      setFrontDocument(resData?.data?.frontDocument);
      setBackDocument(resData?.data?.backDocument);
      setSelfie(resData?.data?.selfieImage);
      setVerify(resData.data?.status)
      if (resData.data?.status === VerifyType.reject) {
        setFrontDocument("");
        setBackDocument("");
        setSelfie("");
      } else {
        setFrontDocument(resData?.data?.frontDocument);
        setBackDocument(resData?.data?.backDocument);
        setSelfie(resData?.data?.selfieImage);
      }
    } catch (error) {
      handleError(error)
    }
  }

  const onChange = (e, type) => {
    getBase64(e.file.originFileObj, imageUrl => {
      switch (type) {
        case ImageType.front:
          setFrontDocument(imageUrl)
          frontDocumentRef.current = e.file.originFileObj;
          break;
        case ImageType.back:
          setBackDocument(imageUrl)
          backDocumentRef.current = e.file.originFileObj;
          break;
        case ImageType.selfie:
          setSelfie(imageUrl)
          selfieRef.current = e.file.originFileObj;
          break;
        default:
          break;
      }
    });
  }

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleDomainPostImg = () => {
    if (process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.development) return "https://api.dev.fjob.com.vn"
    return process.env.NEXT_PUBLIC_API_URL
  }

  const backToHome = () => {
    const isEE = getUserRoleCookieCSR() === roleConstant.EE.name
    if (isEE) {
      router.push(routerPathConstant.homepage)
    } else {
      router.push(routerPathConstant.erDashboard)
    }
  }

  const onConfirm = async () => {
    if (!frontDocument || !backDocument || !selfie) {
      return;
    }
    const config = {
      'headers': {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getTokenUser()}`,
      },
    }
    const form = new FormData()
    form.append("files", frontDocumentRef.current)
    form.append("files", backDocumentRef.current)
    form.append("files", selfieRef.current)
    try {
      const resData = await axios.post(`${handleDomainPostImg()}/upload/v1.0/upload/multi-files`, form, config)
      const verifyUser = await accountVerificationAPI({
        userId: profile.id,
        identificationType: 1,
        selfieImage: resData.data[2].linkUrl,
        frontDocument: resData.data[0].linkUrl,
        backDocument: resData.data[1].linkUrl,
      })
      setIsSuccessModal(true);
      setVerify(VerifyType.pending)
    } catch (error) {
      handleError(error)
    }
  }
  
  return (
    <div className={`verify ${styles.verify}`}>
      <div className={styles.verify_wrap}>
        <div className={styles.wrap_title}>
          X??c th???c t??i kho???n
        </div>
        <div className={styles.wrap_content_header}>
          <div className={styles.image}>
            {
              verify === VerifyType.verify ? (
                <img src="/assets/icons/color/active.svg" alt="" />
              ) : verify === VerifyType.reject ? (
                <img src="/assets/icons/color/warning.svg" alt="" />
              ) : (
                <img src="/assets/icons/color/lock.svg" alt="" />
              )
            }
          </div>
          {
            verify === VerifyType.verify ? (
              <div className={styles.title} style={{ color: "#06983C" }}>
                ???? x??c th???c
              </div>
            ) : verify === VerifyType.reject ? (
              <div className={styles.title} style={{ color: "#FF8500" }}>
                T??i kho???n b??? t??? ch???i
              </div>
            ) : (
              <div className={styles.title}>
                X??c th???c t??i kho???n
              </div>
            )
          }
          <div className={styles.text}>
            X??c th???c t??i kho???n gi??p b???n b???o v??? t??i kho???n m???t c??ch an to??n h??n.
          </div>
          <div className={styles.text}>
            V?? gi??p ch??ng t??i c?? th??? d??? d??ng tr??? gi??p b???n khi c?? v???n ????? x???y ra v???i t??i kho???n c???a b???n
          </div>
        </div>
        <div className={styles.wrap_content}>
          <div className={styles.box} >
            {
              !frontDocument ? (
                <Upload
                  name="frontDocument"
                  listType="text"
                  showUploadList={false}
                  onChange={(e) => onChange(e, ImageType.front)}
                  multiple={false}
                >
                  <div className={styles.image_upload} >
                    <img src={frontDocument} alt="" />
                  </div>
                </Upload>
              ) : (
                <div className={styles.content_box}>
                  <div className={styles.title_box}>
                    Upload m???t tr?????c CMND/CCCD
                  </div>
                  <div className={styles.desc_box}>
                    (????ng file h??nh ???nh .png, .jpg r?? n??t.
                    Dung l?????ng file kh??ng v?????t qu?? 300KB)
                  </div>
                  <Upload
                    name="frontDocument"
                    listType="text"
                    showUploadList={false}
                    onChange={(e) => onChange(e, ImageType.front)}
                    multiple={false}
                  >
                    <div className={styles.button}>
                      <div className={styles.txt_button}>
                        T???i l??n
                      </div>
                      <div>
                        <img src="/assets/icons/color/ic_file_upload.svg" alt="" />
                      </div>
                    </div>
                  </Upload>
                </div>
              )
            }
          </div>
          <div className={styles.box} >
            {
              !backDocument ? (
                <Upload
                  name="backDocument"
                  listType="text"
                  showUploadList={false}
                  onChange={(e) => onChange(e, ImageType.back)}
                  multiple={false}
                >
                  <div className={styles.image_upload} >
                    <img src={backDocument} alt="" />
                  </div>
                </Upload>
              ) : (
                <div className={styles.content_box}>
                  <div className={styles.title_box}>
                    Upload m???t sau CMND/CCCD
                  </div>
                  <div className={styles.desc_box}>
                    (????ng file h??nh ???nh .png, .jpg r?? n??t.
                    Dung l?????ng file kh??ng v?????t qu?? 300KB)
                  </div>
                  <Upload
                    name="backDocument"
                    listType="text"
                    showUploadList={false}
                    onChange={(e) => onChange(e, ImageType.back)}
                    multiple={false}
                  >
                    <div className={styles.button}>
                      <div className={styles.txt_button}>
                        T???i l??n
                      </div>
                      <div>
                        <img src="/assets/icons/color/ic_file_upload.svg" alt="" />
                      </div>
                    </div>
                  </Upload>
                </div>
              )
            }
          </div>
          <div className={styles.box} >
            {
              !selfie ? (
                <Upload
                  name="selfie"
                  listType="text"
                  showUploadList={false}
                  onChange={(e) => onChange(e, ImageType.selfie)}
                  multiple={false}
                >
                  <div className={styles.image_upload} >
                    <img id="selfieId" src={selfie} alt="" />
                  </div>
                </Upload>
              ) : (
                <div className={styles.content_box}>
                  <div className={styles.title_box}>
                    Upload ch??n dung c???a b???n
                  </div>
                  <div className={styles.desc_box}>
                    (????ng file h??nh ???nh .png, .jpg r?? n??t.
                    Dung l?????ng file kh??ng v?????t qu?? 300KB)
                  </div>
                  <Upload
                    name="selfie"
                    listType="text"
                    showUploadList={false}
                    onChange={(e) => onChange(e, ImageType.selfie)}
                    multiple={false}
                  >
                    <div className={styles.button}>
                      <div className={styles.txt_button}>
                        T???i l??n
                      </div>
                      <div>
                        <img src="/assets/icons/color/ic_file_upload.svg" alt="" />
                      </div>
                    </div>
                  </Upload>
                </div>
              )
            }
          </div>
        </div>
        {
          verify === VerifyType.verify ? (
            <div className={styles.btn_confirm} onClick={backToHome}>
              V??? trang ch???
            </div>
          ) : null
        }
        {
          verify === VerifyType.reject ? (
            <div className={styles.btn_confirm} onClick={onConfirm}>
              X??c th???c l???i
            </div>
          ) : null
        }
        {
          verify === undefined ? (
            <div className={styles.btn_confirm} onClick={onConfirm}>
              G???i
            </div>
          ) : null
        }
      </div >
      <ModalPopup
        textConfirm="????ng"
        isCancelBtn={false}
        transition='move-up'
        visible={isSuccessModal}
        handleCancelModal={() => {
          setIsSuccessModal(!isSuccessModal)
        }}
        handleConfirmModal={() => {
          setIsSuccessModal(!isSuccessModal)
        }}
      >
        <div className={styles.modal}>
          <div className={styles.image_modal}>
            <img alt="" src="/assets/icons/color/verify_success.svg" />
          </div>
          <div className={styles.title}>Th??ng b??o</div>
          <div className={styles.subtitle}>B???n ???? g???i y??u c???u x??c th???c</div>
          <div className={styles.subtitle}>Ch??ng t??i s??? th???c hi???n x??c th???c t??i kho???n trong th???i gian s???m nh???t</div>
        </div>
      </ModalPopup>
    </div >
  )
}
export default index

export async function getServerSideProps(ctx) {
  if (!ctx.req.cookies[storageConstant.cookie.accessToken]) {
    return {
      redirect: {
        destination: `${routerPathConstant.signIn}?next=${encodeURIComponent(ctx.req.url)}`,
        permanent: false,
      },
      props: {},
    }
  }
  return { props: {} }
}