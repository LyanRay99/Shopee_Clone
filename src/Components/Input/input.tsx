import { InputHTMLAttributes } from 'react'
import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

//* Tạo input component để tái sử dụng trong form
//* các property mà input nhận vào (được khai báo type trong interface)
//* cứ pháp extends... để kế thừa lại các thuộc tính sẵn có của tag input trong HTML
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  classNameInput?: string
  classNameError?: string
  classNameEye?: string
}

export default function Input(props: InputProps) {
  const {
    type,
    errorMessage,
    register,
    rules,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    classNameEye = 'absolute top-[8px] right-[5px] h-5 w-5 cursor-pointer',
    placeholder,
    className,
    name,
    ...rest
  } = props

  const registerResult = register && name ? register(name, rules) : {}

  return (
    <div className={classNameInput}>
      <input
        type={type}
        className={className}
        // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
        placeholder={placeholder}
        autoComplete='on'
        {...registerResult}
      />

      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
