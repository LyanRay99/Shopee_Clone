import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

//* Tạo input component để tái sử dụng trong form
//* các property mà input nhận vào (được khai báo type trong interface)
interface InputProps {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  rules?: RegisterOptions
}

export default function Input(props: InputProps) {
  const { type, errorMessage, placeholder, className, name, register, rules } = props

  return (
    <div className='w-full rounded-sm border border-gray-300 p-3 outline-none focus:border-gray-500 focus:shadow-sm'>
      <input
        type={type}
        className={className}
        // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
        placeholder={placeholder}
        autoComplete='on'
        {...register(name, rules)}
      />

      <div>{errorMessage}</div>
    </div>
  )
}
