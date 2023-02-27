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

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

//* Check validate by yup
export const schema = yup.object({
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
  confirm_password: handleConfirmPasswordYup('password')
})

export type Schema = yup.InferType<typeof schema>
