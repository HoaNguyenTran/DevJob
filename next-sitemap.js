const policies = [
  {
    userAgent: '*',
    allow: '/',
  },
]

// only allow crawlers on main production site
// if (
//   (process.env.NEXT_PUBLIC_SITE_URL !== 'https://api.fjob.com.vn/') !==
//   'https://api.dev.fjob.com.vn/'
// )

// if ((process.env.NEXT_PUBLIC_WEB_ENV !== 'production') !== 'staging') {
//   policies = [
//     {
//       userAgent: '*',
//       disallow: '/',
//     },
//   ]
// }

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://fjob.vn',
  generateRobotsTxt: true,
  changefreq: 'daily',
  exclude: ['/auth/*'],

  robotsTxtOptions: {
    policies,
  },
}
