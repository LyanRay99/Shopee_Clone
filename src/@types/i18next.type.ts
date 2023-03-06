import 'i18next'
// import { defaultNS, resources } from 'src/i18n/i18n'
import { resources } from 'src/i18Next/i18Next'

declare module 'i18next' {
  // Kế thừa (thêm vào type)
  interface CustomTypeOptions {
    // defaultNS: typeof defaultNS
    resources: (typeof resources)['vi']
  }
}
