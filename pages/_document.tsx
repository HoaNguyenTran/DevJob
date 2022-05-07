import React from 'react'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { configConstant } from 'src/constants/configConstant'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      const initialProps = await Document.getInitialProps(ctx)

      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="vi">
        <Head>
          <link rel="shortcut icon" href="/favicon.ico" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />


          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          {process.env.NEXT_PUBLIC_WEB_ENV === configConstant.environment.production
            ? (<>
              <meta name="facebook-domain-verification" content="acoq4u6v14y3j4iumrd3gmrru3g7qm" />
              <meta name="google-site-verification" content="iRhtw36NgMa48ODGxGIjEA7V96PWPhEt7R8saTn47Nk" />
            </>)
            : <meta name="google-signin-client_id" content="314221037305-8raoij089kjeq2ifnq7kf91dbafcq18p.apps.googleusercontent.com" />
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
