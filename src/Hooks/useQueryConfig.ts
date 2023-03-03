import useQueryParams from './useQueryParams'
import { ProductListConfig } from 'src/@types/product.type'
import { omitBy, isUndefined } from 'lodash'

//* Tạo type để lấy các type proprety của interface ProductListConfig
export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  //* Ta dùng omitBy của lodash loại bỏ các query underfined (với isUnderfined)
  const queryConfig: QueryConfig = omitBy(
    {
      //* set page = 1 để khi queryParams.page là underfined thì default là page 1
      page: queryParams.page || '1',
      limit: queryParams.limit || '6',
      order: queryParams.order,
      sort_by: queryParams.sort_by,
      category: queryParams.category,
      exclude: queryParams.exclude,
      rating_filter: queryParams.rating_filter,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      name: queryParams.name
    },
    isUndefined
  )

  return queryConfig
}
