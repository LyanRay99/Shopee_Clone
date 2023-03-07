//* Library
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import React, { useEffect, useMemo, useState, useContext } from 'react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'

//* Utils
import { getProfile, updateProfile, uploadAvatar } from 'src/Api/user.api'
import { UserSchema, userSchema } from 'src/Utils/ruleForm'
import { SetProfile } from 'src/Utils/auth'
import { AppContext } from 'src/Contexts/app.context'
import { getAvatarUrl } from 'src/Utils/customUrl'
import { isAxiosError_UnprocessableEntity } from 'src/Utils/axiosError'

//* Components
import Button from 'src/Components/Button'
import Input from 'src/Components/Input'
import DateSelect from '../../Components/DateSelect'
import InputFile from 'src/Components/Input_File'
import UserInfo from '../../Components/UserInfo'
import { ErrorResponse } from 'src/@types/utils.type'

//* Type
export type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

//* schema dùng cho yup resolver
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  const { setProfile: setProfile_ContextAPI } = useContext(AppContext)

  //* Call Api get data of profile
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile()
  })

  const profile = profileData?.data.data
  const methods = useForm<FormData>({
    //* khởi tại default value
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },

    resolver: yupResolver(profileSchema)
  })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    setError,
    formState: { errors }
  } = methods

  //* set lại value khi đã get data profile
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name),
        setValue('phone', profile.phone),
        setValue('address', profile.address),
        setValue('avatar', profile.avatar),
        setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const updateProfileMutation = useMutation(updateProfile)
  const uploadAvatarMutation = useMutation(uploadAvatar)

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)

    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }

      const res = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })

      setProfile_ContextAPI(res.data.data)
      SetProfile(res.data.data)
      refetch()
      toast.success(res.data.message)
    } catch (error) {
      if (isAxiosError_UnprocessableEntity<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  //* handle upload avatar
  const [file, setFile] = useState<File>()
  const previewImage = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  const avatar = watch('avatar')

  const handleChangeFile = (file?: File) => {
    setFile(file)
  }

  //* i18next
  const { t } = useTranslation('user')

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <Helmet>
        <title>Hồ Sơ | Shopee Clone</title>
        <meta name='description' content='Hồ sơ của bạn' />
      </Helmet>

      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>{t('profile.myProfile')}</h1>
        <div className='mt-1 text-sm text-gray-700'>{t('profile.manage and protect your account')}</div>
      </div>
      <FormProvider {...methods}>
        <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
          <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
            <div className='flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <div className='pt-3 text-gray-700'>{profile?.email}</div>
              </div>
            </div>
            <UserInfo />
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('profile.address')}</div>
              <div className='sm:w-[80%] sm:pl-5'>
                <Input
                  classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                  register={register}
                  name='address'
                  placeholder={t('profile.address')}
                  errorMessage={errors.address?.message}
                />
              </div>
            </div>

            {/* Completed: Handle date of birth */}
            <Controller
              control={control}
              name='date_of_birth'
              render={({ field }) => (
                <DateSelect
                  errorMessage={errors.date_of_birth?.message}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
              <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
              <div className='sm:w-[80%] sm:pl-5'>
                <Button
                  className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                  type='submit'
                >
                  {t('changePassword.save')}
                </Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
            <div className='flex flex-col items-center'>
              <div className='my-5 h-24 w-24'>
                <img
                  src={previewImage || getAvatarUrl(avatar)}
                  alt=''
                  className='h-full w-full rounded-full object-cover'
                />
              </div>

              {/* Completed: Upload avatar */}
              <InputFile onChange={handleChangeFile} />
              <div className='mt-3 text-gray-400'>
                <div>{t('profile.fileSize')}</div>
                <div>{t('profile.fileType')}</div>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}
