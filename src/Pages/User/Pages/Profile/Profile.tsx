//* Library
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { useEffect } from 'react'

//* Utils
import { getProfile, updateProfile } from 'src/Api/user.api'
import { UserSchema, userSchema } from 'src/Utils/ruleForm'

//* Components
import Button from 'src/Components/Button'
import Input from 'src/Components/Input'
import DateSelect from '../../Components/DateSelect'

//* Type
type FormData = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>

//* schema dùng cho yup resolver
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

export default function Profile() {
  //* Call Api get data of profile
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile()
  })

  const profile = profileData?.data.data
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors }
  } = useForm<FormData>({
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

  const onSubmit = handleSubmit(async (data) => {
    try {
      // let avatarName = avatar
      // if (file) {
      //   const form = new FormData()
      //   form.append('image', file)
      //   const uploadRes = await uploadAvatarMutaion.mutateAsync(form)
      //   avatarName = uploadRes.data.data
      //   setValue('avatar', avatarName)
      // }
      // const res = await updateProfileMutation.mutateAsync({
      //   ...data,
      //   date_of_birth: data.date_of_birth?.toISOString(),
      //   avatar: avatarName
      // })
      // setProfile(res.data.data)
      // setProfileToLS(res.data.data)
      // refetch()
      // toast.success(res.data.message)
    } catch (error) {
      // if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
      //   const formError = error.response?.data.data
      //   if (formError) {
      //     Object.keys(formError).forEach((key) => {
      //       setError(key as keyof FormDataError, {
      //         message: formError[key as keyof FormDataError],
      //         type: 'Server'
      //       })
      //     })
      //   }
      // }
    }
  })

  return (
    <div className='rounded-sm bg-white px-2 pb-10 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      {/* <FormProvider {...methods}> */}
      <form className='mt-8 flex flex-col-reverse md:flex-row md:items-start' onSubmit={onSubmit}>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Email</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700'>{profile?.email}</div>
            </div>
          </div>
          {/* <Info /> */}
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />
            )}
          />
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                className='flex h-9 items-center rounded-sm bg-orange px-5 text-center text-sm text-white hover:bg-orange/80'
                type='submit'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                // src={previewImage || getAvatarUrl(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            {/* <InputFile onChange={handleChangeFile} /> */}
            <div className='mt-3 text-gray-400'>
              <div>Dụng lượng file tối đa 1 MB</div>
              <div>Định dạng:.JPEG, .PNG</div>
            </div>
          </div>
        </div>
      </form>
      {/* </FormProvider> */}
    </div>
  )
}
