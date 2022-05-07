import { ArrowLeftOutlined, EnterOutlined, LeftOutlined } from '@ant-design/icons';
import React from 'react'
import LinkTo from 'src/components/elements/LinkTo'
import { routerPathConstant } from 'src/constants/routerConstant'

const Error404Page = (): JSX.Element => {
  console.log("");

  return (<div style={{
    minHeight: "calc(100vh - 5rem)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}>
    <div
      style={{
        background: 'white',
        display: "flex",
        padding: "8rem",
        borderRadius: "var(--border-radius)"
      }}>
      <img alt="" src="/assets/images/404/logo.svg"
        style={{ marginRight: "3rem" }}
      />
      <div style={{
        borderLeft: "1px solid var(--border-color)",
        paddingLeft: "3rem"
      }}>
        <div style={{
          color: "var(--secondary-color)",
          fontSize: "3.5rem",
        }}>
          404 ! Oops...
        </div>
        <div style={{
          fontSize: "1.5rem",
        }} >
          Rất tiếc trang này không tồn tại.
        </div>
        <div style={{ marginTop: "2.5rem", fontSize: "1.5rem" }}>
          <LinkTo href={routerPathConstant.homepage}>
            {/* <ArrowLeftOutlined /> */}
            Quay lại trang chủ
          </LinkTo>
        </div>
      </div>
    </div>
  </div>)
}

export default Error404Page
