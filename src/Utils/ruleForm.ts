//* Completed: Using React-Hook-Form + Yup to form management
import type { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = { [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions }

//* Rule to check form register
export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  //* email rule
  email: {
    required: {
      value: true,
      message: 'Email la bat buoc'
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: 'Email ko dung dinh dang'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 5 - 160 ky tu'
    },
    minLength: {
      value: 5,
      message: 'Do dai tu 5 - 160 ky tu'
    }
  },

  //* password rule
  password: {
    required: {
      value: true,
      message: 'Password la bat buoc'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 6 - 160 ky tu'
    },
    minLength: {
      value: 6,
      message: 'Do dai tu 6 - 160 ky tu'
    }
  },

  //* confirm password rule
  confirm_password: {
    required: {
      value: true,
      message: 'Nhap lai password'
    },
    maxLength: {
      value: 160,
      message: 'Do dai tu 6 - 160 ky tu'
    },
    minLength: {
      value: 6,
      message: 'Do dai tu 6 - 160 ky tu'
    },
    validate:
      typeof getValues === 'function' ? (value) => value === getValues('password') || 'Nhap lai mat khau' : undefined
  }
})

//* function tái sử dụng để check confirm password
const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

//* function tái sử dụng để check price_max và price_min
function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as { price_min: string; price_max: string }
  if (price_min !== '' && price_max !== '') {
    return Number(price_max) >= Number(price_min)
  }
  return price_min !== '' || price_max !== ''
}

//* Check validate by yup
export const schema = yup.object({
  //* check validate login/register
  email: yup
    .string()
    .required('Email la bat buoc')
    .email('Email ko dung dinh dang')
    .max(160, 'Do dai tu 5 - 160 ky tu')
    .min(5, 'Do dai tu 5 - 160 ky tu'),
  password: yup
    .string()
    .required('Password la bat buoc')
    .max(160, 'Do dai tu 6 - 160 ky tu')
    .min(6, 'Do dai tu 6 - 160 ky tu'),
  confirm_password: handleConfirmPasswordYup('password'),

  //* check validate price (when user filter flow price)
  price_min: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),
  price_max: yup.string().test({
    name: 'price-not-allowed',
    message: 'Giá không phù hợp',
    test: testPriceMinMax
  }),

  //* rule cho feature search product
  name: yup.string().trim().required('Tên sản phẩm là bắt buộc')
})

export type Schema = yup.InferType<typeof schema>

//* Tạo rule mới kế thừa từ 1 số property từ rule "schema"
export const userSchema = yup.object({
  name: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  phone: yup.string().max(10, 'Độ dài tối đa là 10 ký tự'),
  address: yup.string().max(160, 'Độ dài tối đa là 160 ký tự'),
  avatar: yup.string().max(1000, 'Độ dài tối đa là 1000 ký tự'),
  date_of_birth: yup.date().max(new Date(), 'Hãy chọn 1 ngày trong quá khứ'),
  //* kế thừa password từ schema ở trên
  password: schema.fields['password'],
  newPassword: schema.fields['password'],
  confirm_password: handleConfirmPasswordYup('confirm_password')
})

export type UserSchema = yup.InferType<typeof userSchema>
