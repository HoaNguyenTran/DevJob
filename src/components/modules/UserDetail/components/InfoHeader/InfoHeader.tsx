/* eslint-disable no-param-reassign */
import React from 'react'
import defaultConstant from 'src/constants/defaultConstant';
import styles from "./InfoHeader.module.scss"

const InfoHeader = ({ props }): JSX.Element => (
  <div className={styles.infoHeader}>
    <div className={styles.infoHeader_wrap}>
      <div className={styles.header_inner}>
        <div className={styles.header_title}>Hồ sơ ứng viên</div>
        <div className={styles.header_main}>
          <div>

            <div className={styles.header_avatar}>
              <img
                alt="" src={props.avatar || defaultConstant.defaultAvatarUser}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = defaultConstant.defaultAvatarUser;
                }}
              />
            </div>

            <div className={styles.info}>
              <div className={styles.name}>{props.name}</div>
              <div>
                {props.verifyKyc ? (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/isVerified.svg" />
                    &nbsp;
                    <span>Tài khoản đã được xác thực</span>
                  </div>
                ) : (
                  <div className={styles.verify}>
                    <img alt="" src="/assets/icons/color/unVerified.svg" />
                    &nbsp;
                    <span>Tài khoản chưa được xác thực</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
)

export default InfoHeader