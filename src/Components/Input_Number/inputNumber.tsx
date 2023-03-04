import React, { InputHTMLAttributes, forwardRef, useState } from 'react'

//* Tạo input component để tái sử dụng trong form
//* các property mà input nhận vào (được khai báo type trong interface)
//* cứ pháp "extends InputHTMLAttributes<HTMLInputElement>" để kế thừa lại các thuộc tính sẵn có của tag input trong HTML
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  classNameEye?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(props: InputNumberProps, ref) {
  const { errorMessage, classNameInput, classNameError, className, onChange, value = '', ...rest } = props

  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      // Thực thi onChange callback từ bên ngoài truyền vào props
      onChange && onChange(event)
      // Cập nhật localValue state
      setLocalValue(value)
    }
  }

  return (
    <div className={classNameInput}>
      <input
        className={`${className} w-full`}
        onChange={handleChange}
        value={value || localValue}
        ref={ref}
        {...rest}
      />

      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
