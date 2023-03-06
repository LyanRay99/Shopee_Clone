import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HOME_EN from 'src/locales/en/home.json'
import PRODUCT_EN from 'src/locales/en/product.json'
import HOME_VI from 'src/locales/vi/home.json'
import PRODUCT_VI from 'src/locales/vi/product.json'
import FOOTER_VI from 'src/locales/vi/footer.json'
import FOOTER_EN from 'src/locales/en/footer.json'
import USER_VI from 'src/locales/vi/user.json'
import USER_EN from 'src/locales/en/user.json'

export const locales = {
  en: 'English',
  vi: 'Tiếng Việt'
} as const

export const resources = {
  en: {
    home: HOME_EN,
    product: PRODUCT_EN,
    user: USER_EN,
    footer: FOOTER_EN
  },
  vi: {
    home: HOME_VI,
    product: PRODUCT_VI,
    user: USER_VI,
    footer: FOOTER_VI
  }
} as const

// export const defaultNS = 'product'

i18n.use(initReactI18next).init({
  resources,
  lng: 'vi',
  fallbackLng: 'vi',
  ns: ['home', 'product', 'user', 'footer'],
  //   defaultNS,
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
