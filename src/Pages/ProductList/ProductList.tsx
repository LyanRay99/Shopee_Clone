//* Library
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import useQueryParams from 'src/Hooks/useQueryParams'
import { getProduct } from 'src/Api/product.api'

//* Components
import AsideFilter from './Components/AsideFilter'
import SortProductList from './Components/SortProductList'
import Product from './Components/Product'

export default function ProductLists() {
  const queryParams = useQueryParams()

  /**
   ** Ta truyền queryParams vào để khi mà nó thay đổi thì useQuery mới nhận biết
   ** Sau đó call api để get data phù hợp với query đó
   */
  const { data } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => {
      return getProduct(queryParams)
    }
  })

  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>Trang chủ | Shopee Clone</title>
        <meta name='description' content='Trang chủ dự án Shopee Clone' />
      </Helmet> */}
      <div className='container'>
        {/* {productsData && ( */}
        <div className='grid grid-cols-12 gap-6'>
          <div className='col-span-3'>
            <AsideFilter
            // queryConfig={queryConfig} categories={categoriesData?.data.data || []}
            />
          </div>
          <div className='col-span-9'>
            {/* <SortProductList queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} /> */}
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
              {/* {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))} */}
              {data &&
                data.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
            </div>
            {/* <Pagination queryConfig={queryConfig} pageSize={productsData.data.data.pagination.page_size} /> */}
          </div>
        </div>
        {/* )} */}
      </div>
    </div>
  )
}
