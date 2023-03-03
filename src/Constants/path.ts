const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  purchase: 'purchases',
  login: '/login',
  register: '/register',
  logout: '/logout',
  products: '/products',
  productDetail: ':nameId',
  cart: '/cart',
  category: '/categories'
} as const

export default path
