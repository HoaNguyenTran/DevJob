import React, { FC } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'
import LinkTo from 'src/components/elements/LinkTo'

const ErrorWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;
`

const ErrorContainer = styled.div`
  width: 400px;
  border-radius: 8px;
  border: 1px solid #ececec;
  text-align: center;
  padding: 24px;
`

const BackButton = styled(Button)`
  width: 100%;
  height: 40px;
  margin-top: 20px;
  font-size: 1.125rem;
  color: var(--primary-color);
`

const Message = styled.span`
  font-size: 1rem;
`

interface Props {
  statusCode: number
  message: string
}

const Error: FC<Props> = ({ statusCode, message }) => {
  const { t } = useTranslation()
  return (
    <ErrorWrapper>
      <ErrorContainer>
        <h2>{statusCode}</h2>
        <h3>Opps! Page not found</h3>
        {/* <Message>{message}</Message> */}
        <BackButton type="primary">
          <LinkTo href="/"><span style={{ color: "var(--white-color)" }}>
            Trở về trang chủ
          </span>
          </LinkTo>
        </BackButton>
      </ErrorContainer>
    </ErrorWrapper>
  )
}

export default Error
