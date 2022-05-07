import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { storageConstant } from 'src/constants/storageConstant'
import detector from 'i18next-browser-languagedetector'
import vi from './locales/vi_VN.json'
import en from './locales/en_US.json'

i18n
  // .use(detector)
  .use(initReactI18next)
  .init({
    lng: 'vi',
    // fallbackLng: 'vi',
    resources: {
      vi: {
        translation: vi,
      },
      en: {
        translation: en,
      },
    },
    initImmediate : false,
    debug: false,
    detection: {
      // lookupQuerystring: 'lang',
      // lookupLocalStorage: storageConstant.localStorage.lang,
      checkWhitelist: true,
    },
    // supportedLngs: ['vi', 'en'],
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
