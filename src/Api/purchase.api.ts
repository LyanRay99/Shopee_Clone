import http from 'src/Utils/http'
import path from 'src/Constants/path'
import { SuccessResponse } from 'src/@types/utils.type'
import { Purchase, PurchaseListStatus, DeletePurchase } from 'src/@types/purchase.type'

//* Api add product into cart
export const addToCart = (body: { product_id: string; buy_count: number }) => {
  return http.post<SuccessResponse<Purchase>>(path.purchaseAddToCart, body)
}

//* Api get list product into cart of user
export const getPurchaseList = (params: { status: PurchaseListStatus }) => {
  return http.get<SuccessResponse<Purchase[]>>(path.purchase, {
    params
  })
}

//* Api buy product
export const buyProducts = (body: { product_id: string; buy_count: number }[]) => {
  return http.post<SuccessResponse<Purchase[]>>(path.purchaseBuyProducts, body)
}

//* Api update working purchase products
export const updatePurchase = (body: { product_id: string; buy_count: number }) => {
  return http.put<SuccessResponse<Purchase>>(path.purchaseUpdatePurchase, body)
}

//* Api delete product into cart
export const deletePurchase = (purchaseID: string[]) => {
  return http.delete<SuccessResponse<DeletePurchase>>(path.purchase, { data: purchaseID })
}
