/*
 * hook này tái sử dụng cho input tại product list và cart
 */
import { createSearchParams, useNavigate } from 'react-router-dom'
import path from 'src/Constants/path'
import { omit } from 'lodash'
import useQueryConfig from './useQueryConfig'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Schema, schema } from 'src/Utils/ruleForm'

//* type
type FormData = Pick<Schema, 'name'>

const nameSchema = schema.pick(['name'])

export default function useSearchProducts() {
  const queryConfig = useQueryConfig()
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: ''
    },
    resolver: yupResolver(nameSchema)
  })

  const navigate = useNavigate()

  const onSubmitSearch = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            name: data.name
          },
          ['order', 'sort_by', 'price_max', 'price_min', 'rating_filter', 'category']
        )
      ).toString()
    })
  })

  return { register, onSubmitSearch }
}

