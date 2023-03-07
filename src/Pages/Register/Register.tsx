//* Library
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useContext } from 'react'
import { AppContext } from 'src/Contexts/app.context'
import { useTranslation } from 'react-i18next'

//* Utils
import { schema, Schema } from 'src/Utils/ruleForm'
import { ErrorResponse } from 'src/@types/utils.type'
import { isAxiosError_UnprocessableEntity } from 'src/Utils/axiosError'
import Input from 'src/Components/Input'
import Button from 'src/Components/Button'
import path from 'src/Constants/path'

//* Api
import { registerAccount } from 'src/Api/auth.api'

//* Type
type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])

//* Component
export default function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })

  //* Lấy setIsAuthenticated ra từ AppContext
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  //* onSubmit form sẽ nhận được data => gán vào body và dùng omit để loại bỏ đi "confirm_password"
  const onSubmit = handleSubmit((data) => {
    const body = omit(data, ['confirm_password'])

    registerAccountMutation.mutate(body, {
      //* Xử lý logic khi register thành công
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },

      //* Xử lý logic khi register thất bại
      onError: (error) => {
        if (isAxiosError_UnprocessableEntity<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data

          //* Cách 1
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof Omit<FormData, 'confirm_password'>, {
                message: formError[key as keyof Omit<FormData, 'confirm_password'>],
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

  //* i18next
  const { t } = useTranslation()

  return (
    <div className='bg-orange'>
      {/* <title>Đăng ký | Shopee Clone</title> */}

      <div className='container'>
        <div className='grid grid-cols-1 py-12 lg:grid-cols-5 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='rounded bg-white p-10 shadow-sm' noValidate onSubmit={onSubmit}>
              <div className='text-2xl'>{t('authen.register')}</div>
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
                errorMessage={errors.password?.message}
              />

              <Input
                name='confirm_password'
                type='password'
                className='mt-2'
                // classNameEye='absolute right-[5px] h-5 w-5 cursor-pointer top-[12px]'
                placeholder='Confirm Password'
                register={register}
                errorMessage={errors.confirm_password?.message}
              />

              <div className='mt-2'>
                <Button
                  className='flex w-full items-center justify-center bg-red-500 py-4 px-2 text-sm uppercase text-white hover:bg-red-600'
                  isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading}
                >
                  {t('authen.register')}
                </Button>
              </div>
              <div className='mt-8 flex items-center justify-center'>
                <span className='text-gray-400'>{t('authen.You are have account')}</span>
                <Link className='ml-1 text-red-400' to={path.login}>
                  {t('authen.login')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
