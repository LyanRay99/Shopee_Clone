import http from 'src/Utils/http'
import { ProductListConfig, ProductList, Product } from 'src/@types/product.type'
import { SuccessResponse } from 'src/@types/utils.type'
import path from 'src/Constants/path'

//* Call API Product flow Params
//* Vẫn dùng lại Type 'SuccessResponse' vì trong này đẫ khai báo type của các Property được trả về là "message" và "data"
//* Type 'ProductList' được truyền vào đối số data'SuccessResponse' và được gán cho property Data mà API trả về
export const getProduct = (params: ProductListConfig) =>
  http.get<SuccessResponse<ProductList>>(path.products, {
    params
  })

//* Call API Product flow id
export const getProductDetail = (id: string) => http.get<SuccessResponse<Product>>(`${path.products}/${id}`)
