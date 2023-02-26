import type { UseFormRegister, RegisterOptions } from 'react-hook-form'

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
    <>
      <input
        type={type}
        className={className}
        // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
        placeholder={placeholder}
        autoComplete='on'
        {...register(name, rules)}
      />

      <div>{errorMessage}</div>
    </>
  )
}
