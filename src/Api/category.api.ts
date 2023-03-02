import http from 'src/Utils/http'
import path from 'src/Constants/path'
import { SuccessResponse } from 'src/@types/utils.type'
import { Category } from 'src/@types/category.type'

//* Call API Product flow Params (category)
//* Nguyên lý tương tự với khi get data product
export const getCategory = () => http.get<SuccessResponse<Category[]>>(path.category)
