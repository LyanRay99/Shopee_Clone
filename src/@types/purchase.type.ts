import http from 'src/Utils/http'
import path from 'src/Constants/path'
import { SuccessResponse } from './utils.type'
import { Purchase, PurchaseListStatus } from './../Api/purchase.api'

//* Api add product into cart
export const addToCart = (body: { product_id: string; buyCount: number }) => {
  return http.post<SuccessResponse<Purchase>>(`${path.purchase}/add-to-cart`, body)
}

//* Api get list product into cart of user
export const getPurchaseList = (params: { status: PurchaseListStatus }) => {
  return http.get<SuccessResponse<Purchase>>(path.purchase, {
    params
  })
}
