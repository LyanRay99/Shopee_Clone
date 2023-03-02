//* Library
import { Link, useNavigate, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import { omit } from 'lodash'

//* Utils
import path from 'src/Constants/path'
import { QueryConfig } from '../../ProductList'
import { sortBy, order as orderConstants } from 'src/Constants/product'
import { ProductListConfig } from 'src/@types/product.type'

interface SortProps {
  queryConfig: QueryConfig
  pageSize: number
}

export default function SortProductList(props: SortProps) {
  //* Lấy data 'queryConfig' và 'pageSize' từ props
  const { queryConfig, pageSize } = props

  //* lấy order và sort_by.createdAlt từ queryConfig
  //* sort_by được gán = sort_by.createdAt (biến mới) làm value mặc định (tức là khi user vào thì web sẽ mặc định sort theo createdAt)
  const { sort_by = sortBy.createdAt, order } = queryConfig

  //* lấy page từ queryConfig và chuyển type của nó thành Number
  const page = Number(queryConfig.page)

  const navigate = useNavigate()

  /**
   ** Function check actice style
   ** Function nhận vào tham số 'sortByValue' rồi check xem có = sort_by ko ?
   ** Nếu có thì sẽ được gán các className phù hợp và ngược lại
   ** Bên dưới sử dụng classnames package để check active
   */
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  /**
   ** Function set value sort
   ** Function nhận vào tham số 'sortByValue' rồi set lại URL của web (Làm tiền đề để useQuery nhận biết rồi get data phù hợp)
   ** navigate làm nhiệm vụ điều hướng URL
   ** omit của lodash dùng để loại bỏ đi property ko cần thiết
   ** ở đây ta bỏ qua order vì trong khi sort theo các property khác thì order (sort thấp => cao, cao => thấp) không thể sort chung (ko logic)
   */
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  /**
   ** Function sort order (thấp => cao, cao => thấp)
   ** Nguyên lý giống như sort các property khác
   ** Nhưng cần truyền vào sortBy.price vào url (vì tính năng này sort theo giá)
   */
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        {/* Completed: Sort product */}
        <div className='flex flex-wrap items-center gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 text-center text-sm capitalize ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <select
            className={classNames('h-8  px-4 text-left text-sm capitalize  outline-none ', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' disabled className='bg-white text-black'>
              Giá
            </option>
            <option value={orderConstants.asc} className='bg-white text-black'>
              Giá: Thấp đến cao
            </option>
            <option value={orderConstants.desc} className='bg-white text-black'>
              Giá: Cao đến thấp
            </option>
          </select>
        </div>

        {/* Completed: Pagination product with arrow button*/}
        <div className='flex items-center'>
          <div>
            {/* show page current/page total */}
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>

          {/* button to panigate */}
          <div className='ml-2 flex'>
            {page === 1 ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={4}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={4}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex h-8 w-9 cursor-not-allowed items-center justify-center rounded-tl-sm rounded-bl-sm bg-white/60  shadow hover:bg-slate-100'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={4}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex h-8 w-9  items-center justify-center rounded-tl-sm rounded-bl-sm bg-white  shadow hover:bg-slate-100'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={4}
                  stroke='currentColor'
                  className='h-3 w-3'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
