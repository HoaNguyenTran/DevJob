// const withCSS = require('@zeit/next-css')
const withPlugins = require('next-compose-plugins')
const withAntdLess = require('next-plugin-antd-less')
const { withSentryConfig } = require("@sentry/nextjs");
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

const sentryWebpackPluginOptions = {
  silent: true,
  project: "fjob-frontend-developement",
  org: process.env.NEXT_PUBLIC_SENTRY_ORG,
  // url:process.env.NEXT_PUBLIC_SENTRY_URL,
  authToken : "15fa5ffe93c911ecb1560242ac150016",
};

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
  domains: [
    'storage.googleapis.com',
    'lh3.googleusercontent.com',
    's120-ava-talk.zadn.vn',
    'platform-lookaside.fbsbx.com',
    'media-cdn.laodong.vn',
    'zetagroup.vn',
    'scontent-sea1-1.xx.fbcdn.net',
    '*',
    ],
  },
  async rewrites() {
    return [
      {
      source: '/employer',
      destination: '/employer/dashboard',
      },
      {
      source: '/homepage',
      destination: '/',
      },
    ]
  },
}

const plugins = [
    // withCSS,
    withAntdLess({
      cssLoaderOptions: {},
      // modifyVars: { '@primary-color': 'red' }, // optional
      lessVarsFilePath: './src/styles/common/themeAntd.less',
      lessVarsFilePathAppendToEndOfContent: false, // optional

      // for Next.js ONLY
      nextjs: {
        localIdentNameFollowDev: true, // default false, for easy to debug on PROD mode
      },

      // Other Config Here...

      webpack(config) {
        return config;
      },

    }),
]
const moduleExports = withPlugins(plugins, nextConfig)
module.exports = moduleExports // withSentryConfig(moduleExports, sentryWebpackPluginOptions)
