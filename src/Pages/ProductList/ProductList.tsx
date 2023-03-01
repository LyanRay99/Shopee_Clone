//* Library
import { useQuery } from '@tanstack/react-query'
import { omitBy, isUndefined } from 'lodash'

//* Utils
import useQueryParams from 'src/Hooks/useQueryParams'
import { getProduct } from 'src/Api/product.api'
import { ProductListConfig } from 'src/@types/product.type'
import { getCategory } from 'src/Api/category.api'

//* Components
import AsideFilter from './Components/AsideFilter'
import SortProductList from './Components/SortProductList'
import Product from './Components/Product'
import Pagination from 'src/Components/Paginate'

//* Tạo type để lấy các type proprety của interface ProductListConfig
export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}

export default function ProductLists() {
  const queryParams: QueryConfig = useQueryParams()
  //* Ta dùng omitBy của lodash loại bỏ các query underfined (với isUnderfined)
  const queryConfig: QueryConfig = omitBy(
    {
      //* set page = 1 để khi queryParams.page là underfined thì default là page 1
      page: queryParams.page || '1',
      limit: queryParams.limit || '4',
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

  /**
   ** Ta truyền queryParams vào để khi mà nó thay đổi thì useQuery mới nhận biết
   ** Sau đó call api để get data phù hợp với query đó
   ** queryParams ở đây là đoạn sau của URL. vd: ?page=3&limit=10...
   */
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return getProduct(queryConfig as ProductListConfig)
    },
    //* keepPreviousData để giữ cho data ko bị underfined khi chuyển trang
    keepPreviousData: true
  })

  /**
   ** Tương tự như sort thì filter ta cũng dùng useQuery để get data với từng category tương ứng
   */
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return getCategory()
    },
    //* keepPreviousData để giữ cho data ko bị underfined khi chuyển trang
    keepPreviousData: true
  })

  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>Trang chủ | Shopee Clone</title>
        <meta name='description' content='Trang chủ dự án Shopee Clone' />
      </Helmet> */}
      <div className='container'>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              {/* Completed: Filter product */}
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              {/* Completed: sort product */}
              <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {/* 
                Completed: Binding data
                Data ít quá nên map 3 lần với limit = 10 để có nhiều page_size hơn.
                Nếu để mặc định limit = 30 thì page chỉ được 2 thôi
                 */}
                {productsData &&
                  productsData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                {productsData &&
                  productsData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
                {productsData &&
                  productsData.data.data.products.map((product) => (
                    <div className='col-span-1' key={product._id}>
                      <Product product={product} />
                    </div>
                  ))}
              </div>
              {/* Completed: phân trang */}
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
