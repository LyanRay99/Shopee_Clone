//* Library
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

//* Utils
import path from 'src/Constants/path'
import { Product as ProductType } from 'src/@types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from 'src/Utils/formatCurrency'
import { generateNameId } from 'src/Utils/customUrl'

//* Components
import ProductRating from 'src/Components/Product_Rating'

interface ProductProps {
  product: ProductType
}

export default function Product(props: ProductProps) {
  const { product } = props

  //* i18next
  const { t } = useTranslation('product')

  return (
    <Link to={`${path.home}${generateNameId({ name: product.name, id: product._id })}`}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative h-3/4 w-full pt-[100%]'>
          <img
            src={product.image}
            alt={product.name}
            className='absolute top-0 left-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div
            className='line-clamp-2 max-h-[2rem] min-h-[2rem] overflow-hidden text-xs'
            style={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical'
            }}
          >
            {product.name}
          </div>
          <div className='mt-3 flex items-center'>
            <div className='max-w-[50%] truncate text-gray-500 line-through'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price_before_discount)}</span>
            </div>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-end'>
            <bdo dir='rtl'>
              <ProductRating rating={product.rating} />
            </bdo>
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1'>{t('detail.sold')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
