//* Library
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import React, { useRef } from 'react'

//* Utils
import { getProductDetail } from 'src/Api/product.api'
import { getProduct } from 'src/Api/product.api'
import { formatNumberToSocialStyle } from 'src/Utils/formatCurrency'
import { formatCurrency } from 'src/Utils/formatCurrency'
import { rateSale } from 'src/Utils/discount'
import { Product as ProductType } from 'src/@types/product.type'
import { getIdFromNameId } from 'src/Utils/customUrl'
import { ProductListConfig } from 'src/@types/product.type'

//* Components
import ProductRating from 'src/Components/Product_Rating'
import Product from '../ProductList/Components/Product'

export default function ProductDetail() {
  //* lấy nameId từ useParams
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)

  //* Call API
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(id as string),
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })
  //* tạo biến product để lấy data product mà server trả về
  const product = productDetailData?.data.data

  //* đặt query để show ra product đề suất bên dưới product detail
  const queryConfig = {
    limit: '6',
    page: '1',
    category: product?.category._id
  }

  //* call API lấy các product liên quan để show bên dưới
  const { data: productData } = useQuery({
    queryKey: ['product', queryConfig],
    queryFn: () => getProduct(queryConfig as ProductListConfig),
    //* enabled: truyền vào nó product type boolean để check xem product có ko. Nếu có thì mới gọi API chỗ này (để show ra các product đề suất)
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  /*
   * lấy ra 5 image detail của product đẻ show slider
   * dùng useMemo để tối ưu hiệu suất (nó không thực hiện tạo biến và gán lại khi không cần thiết)
   * truyền vào useMemo 1 callback
   * nếu dependency là product hoặc currentIndexImages thay đổi => useMemo sẽ chạy lại callback bên trong nó
   * trong callback: nếu product = true (tức là có data) => set currentImages là mảng 5 ảnh đầu tiên
   * ngược lại, set nó thành mảng trống
   * */
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  //* image được active khi user hover vào
  const [activeImage, setActiveImage] = useState('')
  const imageRef = useRef<HTMLImageElement>(null)

  //* Declare activeImage value.
  //* Nếu product = true và số lượng ảnh của product đó < 0 => set initial value cho activeImage là ảnh đầu tiên trong mảng các ảnh của product
  //* ở đây có 1 tham số dependency là product. Khi product thay đổi thì useEffect sẽ chạy để set lại activeImage
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  //* set image current when user hover into one of images
  const chooseActive = (img: string) => {
    setActiveImage(img)
  }

  /*
   * next image
   * mảng currentIndexImages là mảng chứa 5 image để show slider (ban đầu là [0,5])
   * nếu currentIndexImages[1] (tức là 5) < số lượng ảnh mà product đó có => set lại mảng currentIndexImages
   * set 0 => 1 và 5 => 6 (currentIndexImages tại thời điểm này là [1,6])
   * các lần nhấn next sau tương tự như vậy.
   * nếu index 1 của currentIndexImages là image cuối cùng thì nó sẽ ko thể next được nữa
   **/
  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  //* previous image
  //* tương tự như next
  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  //* zoom image when user hover into it
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //* lấy các property của image hiện tại trong dom (ta đã dùng useRef để lưu giữ giá trị của nó)
    const image = imageRef.current as HTMLImageElement

    //* lấy size nguyên gốc của image ra
    const { naturalWidth, naturalHeight } = image

    //* lấy width và height của image
    const rect = event.currentTarget.getBoundingClientRect()

    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    //* set size of image when user hover mouse
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  //* Reset image when mouse leave
  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  //* check product is null? if product is null, it will return null
  if (!product) return null
  //* reverse will binding data
  return (
    <div className='bg-gray-200 py-6'>
      {/* <Helmet>
        <title>{product.name} | Shopee Clone</title>
        <meta
          name='description'
          content={convert(product.description, {
            limits: {
              maxInputLength: 150
            }
          })}
        />
      </Helmet> */}
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                //* event move con trỏ trên element
                onMouseMove={handleZoom}
                //* event con trỏ rời khỏi element
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className=' absolute top-0 left-0 h-full w-full bg-white object-cover'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                {/* previous button */}
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={prev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5L8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full cursor-pointer bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                {/* next button */}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName='fill-orange text-orange h-4 w-4'
                    nonActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                {/* <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                /> */}
                <div className='ml-6 text-sm text-gray-500'>{/* {product.quantity} {t('product:available')} */}</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  //   onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    enableBackground='new 0 0 15 15'
                    viewBox='0 0 15 15'
                    x={0}
                    y={0}
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <g>
                      <g>
                        <polyline
                          fill='none'
                          points='.5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeMiterlimit={10}
                        />
                        <circle cx={6} cy='13.5' r={1} stroke='none' />
                        <circle cx='11.5' cy='13.5' r={1} stroke='none' />
                      </g>
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1='7.5' x2='10.5' y1={7} y2={7} />
                      <line fill='none' strokeLinecap='round' strokeMiterlimit={10} x1={9} x2={9} y1='8.5' y2='5.5' />
                    </g>
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button
                  //   onClick={buyNow}
                  className='fkex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {productData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
