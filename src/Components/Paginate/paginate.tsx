//* Library
import React from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'

//* Utils
import path from 'src/Constants/path'
import { QueryConfig } from 'src/Hooks/useQueryConfig'

interface PaginateProps {
  queryConfig: QueryConfig
  pageSize: number
}

/**
** Thuật toán tạo Pagination
** Với range = 2 áp dụng cho khoảng cách đầu, cuối và xung quanh current_page
** TH1: dấu ... nằm phía sau page
* [1] 2 3 ... 19 20
* 1 [2] 3 4 ... 19 20 
* 1 2 [3] 4 5 ... 19 20
* 1 2 3 [4] 5 6 ... 19 20
* 1 2 3 4 [5] 6 7 ... 19 20

** TH2: dấu ... nằm 2 bên page
* 1 2 ... 4 5 [6] 8 9 ... 19 20
* 1 2 ...13 14 [15] 16 17 ... 19 20

** TH3: dấu ... nằm phía trước page
* 1 2 ... 14 15 [16] 17 18 19 20
* 1 2 ... 15 16 [17] 18 19 20
* 1 2 ... 18 19 [20]
* 1 2 ... 16 17 [18] 19 20
* 1 2 ... 17 18 [19] 20
 */

//* Số lượng button nằm xung quanh button đang active
const RANGE = 1

export default function Pagination(props: PaginateProps) {
  const { queryConfig, pageSize } = props
  const page = Number(queryConfig.page)

  const renderPagination = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <span className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm' key={index}>
            ...
          </span>
        )
      }
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <span className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm' key={index}>
            ...
          </span>
        )
      }
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1

        if (page <= RANGE * 2 + 1 && pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
          if (pageNumber < page - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > page + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (page >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < page - RANGE) {
          return renderDotBefore(index)
        }

        return (
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            key={index}
            className={classNames('mx-2 cursor-pointer rounded border bg-white px-3 py-2 shadow-sm', {
              'border-cyan-500': pageNumber === page,
              'border-transparent': pageNumber !== page
            })}
          >
            {pageNumber}
          </Link>
        )
      })
  }

  return (
    <div className='mt-6 flex flex-wrap justify-center'>
      {page === 1 ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Prev</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page - 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Prev
        </Link>
      )}

      {renderPagination()}
      {page === pageSize ? (
        <span className='mx-2 cursor-not-allowed rounded border bg-white/60 px-3 py-2  shadow-sm'>Next</span>
      ) : (
        <Link
          to={{
            pathname: path.home,
            search: createSearchParams({
              ...queryConfig,
              page: (page + 1).toString()
            }).toString()
          }}
          className='mx-2 cursor-pointer rounded border bg-white px-3 py-2  shadow-sm'
        >
          Next
        </Link>
      )}
    </div>
  )
}
