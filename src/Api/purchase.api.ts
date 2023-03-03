import http from 'src/Utils/http'
import path from 'src/Constants/path'
import { SuccessResponse } from 'src/@types/utils.type'
import { Purchase, PurchaseListStatus } from 'src/@types/purchase.type'

//* Api add product into cart
export const addToCart = (body: { product_id: string; buy_count: number }) => {
  return http.post<SuccessResponse<Purchase>>(`${path.purchase}/add-to-cart`, body)
}

//* Api get list product into cart of user
export const getPurchaseList = (params: { status: PurchaseListStatus }) => {
  return http.get<SuccessResponse<Purchase[]>>(path.purchase, {
    params
  })
}
