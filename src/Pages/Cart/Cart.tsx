//* Library
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'

//* Utils
import QuantityController from 'src/Components/Quantity_Controller'
import Button from 'src/Components/Button'
import path from 'src/Constants/path'
import noproduct from '../../Assets/images/no-product.png'
import { purchase_Status } from 'src/Constants/purchase'
import { getPurchaseList, updatePurchase, buyProducts, deletePurchase } from 'src/Api/purchase.api'
import { Purchase } from 'src/@types/purchase.type'
import { generateNameId } from 'src/Utils/customUrl'
import { formatCurrency } from 'src/Utils/formatCurrency'

interface ExtendedPurchases extends Purchase {
  disabled: boolean
  checked: boolean
}

export default function Cart() {
  //* declare array of products in cart
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>([])

  //* call Api get data product list into cart
  //* refetch: dùng để call lại Api
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchase_Status.inCart }],
    queryFn: () => getPurchaseList({ status: purchase_Status.inCart })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  //* sau khi call api thì set data vào state
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id')

      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked: Boolean(extendedPurchaseObject[purchase._id]?.checked)
        })) || []
      )
    })
  }, [purchasesInCart])

  //* dùng every method để check xem tất cả product trong cart có được check chưa (chỉ cần 1 product ko checked thì nó sẽ return false)
  const isAllChecked = extendedPurchases.every((purchase) => purchase.checked)

  /*
   * checked product to pay
   * Ở đây ta dùng immer để đơn giản hóa việc onchange trên input (nếu ko ta có thể dùng map để check và setState cũng được)
   * produce của immer nhận vào 1 callback
   * parameter "draft" đại diện cho 1 object bên trong "extendedPurchasesIncart" khi map trả về
   * sau đó set lại state theo kiểu mutation bình thường mà ko cần lo gặp lỗi (vì immer cho phép ta setstate theo kiểu mutation như redux)
   */
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, productIndex: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].checked = event.target.checked
      })
    )
  }

  /*
   * handle checked add product into cart
   * set not isAllChecked
   */
  const handleCheckAll = () => {
    setExtendedPurchases((previous) =>
      previous.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  //* update amount product in cart
  const updatePurchaseMutation = useMutation({
    mutationFn: updatePurchase,
    onSuccess: () => refetch() //* call lại Api khi lấy trước đó đã call Api thành công
  })

  const handleQuantity = (productIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[productIndex]
      //* disabled input increase/decrease ko cho user click nữa vì hiện tại đang call Api
      setExtendedPurchases(
        produce((draft) => {
          draft[productIndex].disabled = true
        })
      )

      //* then call Api
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (productIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[productIndex].buy_count = value
      })
    )
  }

  //* delete product in cart
  const deletePurchaseMutation = useMutation({
    onSuccess: () => refetch(),
    mutationFn: deletePurchase
  })

  //* delete 1 item
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseID = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseID])
  }

  //* delete many items
  const checkedPurchases = extendedPurchases.filter((purchase) => purchase.checked)
  const checkedPurchasesCount = checkedPurchases.length

  const handleDeleteMany = () => {
    const purchaseIDs = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIDs)
  }

  /*
   * calculator total price of product
   * những item đã checked sẽ được filter và gán vào checkedPurchases
   * sau đó reduce để tính tổng của chúng (kết quả trước + (đơn giá sản phẩm * số lượng))
   */
  const totalCheckedPurchasePrice = checkedPurchases.reduce((result, current) => {
    return result + current.product.price * current.buy_count
  }, 0)

  //* calculator total price saving
  const totalCheckedPurchaseSaving = checkedPurchases.reduce((result, current) => {
    console.log(result)
    return result + (current.product.price_before_discount - current.product.price) * current.buy_count
  }, 0)

  //* buy product in cart
  const buyProductMutation = useMutation({
    mutationFn: buyProducts,
    onSuccess: (data) => {
      refetch(), toast.success(data.data.message)
    }
  })

  const handleBuyProduct = () => {
    //* check xem có product vào checked ko, nếu có thì mới thực hiện logic buy product
    if (checkedPurchases.length > 0) {
      //* map để lấy các property id sản phẩm và số lượng mua
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))

      //* call Api
      buyProductMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          //* check xem tất cả product trong cart có checked chưa, nếu có thì input này cũng checked luôn
                          checked={isAllChecked}
                          //* handle checked tất cả product trong cart cùng lúc
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h-5 w-5 accent-orange'
                                checked={purchase.checked}
                                onChange={(event) => handleCheck(event, index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  className='h-20 w-20 flex-shrink-0'
                                  to={`${path.home}${generateNameId({
                                    name: purchase.product.name,
                                    id: purchase.product._id
                                  })}`}
                                >
                                  <img alt={purchase.product.name} src={purchase.product.image} />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2'>
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className='line-clamp-2 text-left'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='bg-none text-black transition-colors hover:text-orange'
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    //* check xem tất cả product trong cart có checked chưa, nếu có thì input này cũng checked luôn
                    checked={isAllChecked}
                    //* handle checked tất cả product trong cart cùng lúc
                    onChange={handleCheckAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
                  Chọn tất cả ({extendedPurchases.length})
                </button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteMany}>
                  Xóa
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedPurchaseSaving)}</div>
                  </div>
                </div>
                <Button
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                  onClick={handleBuyProduct}
                  //* khi user click hệ thống sẽ thực hiện logic mua hàng bao gồm cả call Api (nếu có product checked)
                  //* lúc này buyProductMutation đang loading nên isLoading của nó sẽ = true (disabled ko cho user click nữa, tránh call api quá nhiều lần)
                  disabled={buyProductMutation.isLoading}
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <img src={noproduct} alt='no purchase' className='mx-auto h-24 w-24' />
            <div className='mt-5 font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5 text-center'>
              <Link
                to={path.home}
                className=' rounded-sm bg-orange px-10 py-2  uppercase text-white transition-all hover:bg-orange/80'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
