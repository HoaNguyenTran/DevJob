export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID

declare global {
  interface Window {
    fbq: any
  }
}

export const pageview = () => window.fbq('track', 'PageView')

// https://developers.facebook.com/docs/facebook-pixel/advanced/
export const event = (name, options = {}) => window.fbq('track', name, options)
