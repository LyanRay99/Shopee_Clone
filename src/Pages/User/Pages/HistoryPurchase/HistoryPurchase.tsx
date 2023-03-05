//* Library
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { createSearchParams } from 'react-router-dom'

//* Utils
import { formatCurrency } from 'src/Utils/formatCurrency'
import { generateNameId } from 'src/Utils/customUrl'
import { purchase_Status } from 'src/Constants/purchase'
import useQueryParams from 'src/Hooks/useQueryParams'
import { getPurchaseList } from 'src/Api/purchase.api'
import { PurchaseListStatus } from 'src/@types/purchase.type'
import path from 'src/Constants/path'

//* Status of purchase
const purchaseTabs = [
  { status: purchase_Status.all, name: 'Tất cả' },
  { status: purchase_Status.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchase_Status.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchase_Status.inProgress, name: 'Đang giao' },
  { status: purchase_Status.delivered, name: 'Đã giao' },
  { status: purchase_Status.cancelled, name: 'Đã hủy' }
]

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchase_Status.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => getPurchaseList({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div>
            {purchasesInCart?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                <Link
                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img className='h-20 w-20 object-cover' src={purchase.product.image} alt={purchase.product.name} />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tổng giá tiền</span>
                    <span className='ml-4 text-xl text-orange'>
                      ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
