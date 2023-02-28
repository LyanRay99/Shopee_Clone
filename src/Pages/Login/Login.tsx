//* Library
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { AppContext } from 'src/Contexts/app.context'

//* Utils
import { schema, Schema } from 'src/Utils/ruleForm'
import { ErrorResponse } from 'src/@types/utils.type'
import { isAxiosError_UnprocessableEntity } from 'src/Utils/axiosError'
import Input from 'src/Components/Input'
import Button from 'src/Components/Button'

//* Api
import { loginAccount } from 'src/Api/auth.api'

//* Type
type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  //* Lấy setIsAuthenticated ra từ AppContext
  const { setIsAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()

  const loginAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => loginAccount(body)
  })

  //* onSubmit form sẽ nhận được data => gán vào body và dùng omit để loại bỏ đi "confirm_password"
  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      /**
       ** login thành công:
       ** + set isAuthenticated = true
       ** + điều hướng nó đến trang listProduct bằng useNavigate
       */
      onSuccess: (data) => {
        setIsAuthenticated(true)
        navigate('/')
      },

      //* Xử lý logic khi login thất bại
      onError: (error) => {
        if (isAxiosError_UnprocessableEntity<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data

          //* Cách 1
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }

          //* Cách 2
          // if (formError?.email) {
          //   setError('email', {
          //     message: formError.email,
          //     type: 'Server'
          //   })
          // }
          // if (formError?.password) {
          //   setError('password', {
          //     message: formError.password,
          //     type: 'Server'
          //   })
          // }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <title>Đăng nhập | Shopee Clone</title>

      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' noValidate onSubmit={onSubmit}>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                name='email'
                type='email'
                className='mt-8'
                placeholder='Email'
                register={register}
                errorMessage={errors.email?.message}
              />
              <Input
                name='password'
                type='password'
                className='mt-2'
                // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                placeholder='Password'
                register={register}
                errorMessage={errors.email?.message}
                // autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  className='flex  w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={loginAccountMutation.isLoading}
                  disabled={loginAccountMutation.isLoading}
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>Bạn chưa có tài khoản?</span>
                <Link className='ml-1 text-red-400' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
