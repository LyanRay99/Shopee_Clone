//* Library
import React, { useRef } from 'react'
import { toast } from 'react-toastify'

interface InputFileProps {
  onChange?: (file?: File) => void
}

export default function InputFile({ onChange }: InputFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxSizeUploadAvatar = 1048576 //* dung lượng max của image có thể upload

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    fileInputRef.current?.setAttribute('value', '')
    if (fileFromLocal && (fileFromLocal.size >= maxSizeUploadAvatar || !fileFromLocal.type.includes('image'))) {
      toast.error(`Dụng lượng file tối đa 1 MB. Định dạng:.JPEG, .PNG`, {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }

  //* Khi user click vào button thì input file sẽ kích hoạt
  //* Vì ta đặt input file bên cạnh và mượn event click vào button để click nó
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <React.Fragment>
      <input
        className='hidden'
        type='file'
        accept='.jpg,.jpeg,.png'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />
      <button
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        type='button'
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </React.Fragment>
  )
}
