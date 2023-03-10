//* Library
import { Link, useNavigate, createSearchParams } from 'react-router-dom'
import classNames from 'classnames'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { omit } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useContext } from 'react'

//* Utils
import path from 'src/Constants/path'
import Button from 'src/Components/Button'
import InputNumber from 'src/Components/Input_Number'
import { QueryConfig } from 'src/Hooks/useQueryConfig'
import { Category } from 'src/@types/category.type'
import { schema, Schema } from 'src/Utils/ruleForm'
import { NoUndefinedField } from 'src/@types/utils.type'
import { AppContext } from 'src/Contexts/app.context'

//* Components
import RatingStars from '../RatingStar'

interface AsideFilterProps {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NoUndefinedField<Pick<Schema, 'price_max' | 'price_min'>>

/**
 ** Rule validate
 ** Nếu có price_min và price_max thì price_max >= price_min
 ** Còn không thì có price_min thì không có price_max và ngược lại
 */

const priceSchema = schema.pick(['price_max', 'price_min'])

export default function AsideFilter(props: AsideFilterProps) {
  const { isEnglish } = useContext(AppContext)

  const { queryConfig, categories } = props

  const { category } = queryConfig

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema),
    shouldFocusError: false
  })

  const navigate = useNavigate()

  //* filter by price range
  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_max: data.price_max,
        price_min: data.price_min
      }).toString()
    })
  })

  //* delete all filter property
  const handleRemoveAll = () => {
    //* điều hướng về lại page 1 và loại bỏ các filter property hiện có
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            page: '1'
          },
          ['price_min', 'price_max', 'category', 'rating_filter', 'order', 'sort_by']
        )
      ).toString()
    })

    // * reset lại price_max, price_min
    reset({
      price_max: '',
      price_min: ''
    })
  }

  //* i18Next
  const { t } = useTranslation('home')

  const changeLanguageEnglish = (category: string) => {
    if (category === 'Áo thun') {
      return 'T-Shirt'
    } else if (category === 'Đồng hồ') {
      return 'Watch'
    } else if (category === 'Điện thoại') {
      return 'Phone'
    }
  }

  return (
    <div className='py-4'>
      {/* Completed: Show all products */}
      <button
        onClick={handleRemoveAll}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <svg viewBox='0 0 12 10' className='mr-3 h-4 w-3 fill-current'>
          <g fillRule='evenodd' stroke='none' strokeWidth={1}>
            <g transform='translate(-373 -208)'>
              <g transform='translate(155 191)'>
                <g transform='translate(218 17)'>
                  <path d='m0 2h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 6h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                  <path d='m0 10h2v-2h-2zm4 0h7.1519633v-2h-7.1519633z' />
                </g>
              </g>
            </g>
          </g>
        </svg>
        {t('aside filter.all categories')}
      </button>

      <div className='my-4 h-[1px] bg-gray-300' />

      {/* Completed: Filter product by category */}
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li className='py-2 pl-2' key={categoryItem._id}>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-2', {
                  'font-semibold text-orange': isActive
                })}
              >
                {isActive && (
                  <svg viewBox='0 0 4 7' className='absolute top-1 left-[-10px] h-2 w-2 fill-orange'>
                    <polygon points='4 3.5 0 0 0 7' />
                  </svg>
                )}

                {isEnglish ? changeLanguageEnglish(categoryItem.name) : categoryItem.name}
                {/* {categoryItem.name} */}
              </Link>
            </li>
          )
        })}
      </ul>

      <Link to={path.home} className='mt-4 flex items-center font-bold'>
        <svg
          enableBackground='new 0 0 15 15'
          viewBox='0 0 15 15'
          x={0}
          y={0}
          className='mr-3 h-4 w-3 fill-current stroke-current'
        >
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
        {t('aside filter.search filter')}
      </Link>

      <div className='my-4 h-[1px] bg-gray-300' />

      {/* Completed: Filter by price range */}
      <div className='my-5'>
        <div> {t('aside filter.price range')}</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start justify-between'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder={t('aside filter.price range from')}
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />
            {/* <InputV2
          control={control}
          name='price_min'
          type='number'
          className='grow'
          placeholder='₫ TỪ'
          classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
          classNameError='hidden'
          onChange={() => {
            trigger('price_max')
          }}
        /> */}

            <div className='mx-2 mt-2 shrink-0'>-</div>

            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    placeholder={t('aside filter.price range to')}
                    classNameInput='p-1 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
                    classNameError='hidden'
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                  />
                )
              }}
            />
          </div>

          {/* show error message */}
          <div className='mt-1 min-h-[1.25rem] text-center text-sm text-red-600'>{errors.price_min?.message}</div>

          <Button className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'>
            {t('aside filter.apply')}
          </Button>
        </form>
      </div>

      <div className='my-4 h-[1px] bg-gray-300' />
      <div className='text-base'> {t('aside filter.review')}</div>
      <RatingStars queryConfig={queryConfig} />
      <div className='my-4 h-[1px] bg-gray-300' />
      <Button
        onClick={handleRemoveAll}
        className='flex w-full items-center justify-center bg-orange p-2 text-sm uppercase text-white hover:bg-orange/80'
      >
        {t('aside filter.clear all')}
      </Button>
    </div>
  )
}
