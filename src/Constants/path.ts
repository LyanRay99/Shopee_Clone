const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  uploadAvatar: '/user/upload-avatar',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  purchase: 'purchases',
  purchaseAddToCart: 'purchases/add-to-cart',
  purchaseBuyProducts: 'purchases/buy-products',
  purchaseUpdatePurchase: 'purchases/update-purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  products: '/products',
  productDetail: ':nameId',
  cart: '/cart',
  category: '/categories'
} as const

export default path
