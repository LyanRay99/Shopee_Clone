//* Library
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

//* Components
import Input from 'src/Components/Input'
import InputNumber from 'src/Components/Input_Number'
import { FormData as FormDataProfile } from '../../Pages/Profile/Profile'

export default function UserInfo() {
  const {
    register,
    control,
    formState: { errors }
  } = useFormContext<FormDataProfile>()

  //* i18next
  const { t } = useTranslation('user')

  return (
    <React.Fragment>
      <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('profile.name')}</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Input
            classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
            register={register}
            name='name'
            placeholder={t('profile.name')}
            errorMessage={errors.name?.message}
          />
        </div>
      </div>
      <div className='mb-7 flex flex-col flex-wrap sm:flex-row'>
        <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>{t('profile.phoneNumber')}</div>
        <div className='sm:w-[80%] sm:pl-5'>
          <Controller
            control={control}
            name='phone'
            render={({ field }) => (
              <InputNumber
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                placeholder={t('profile.phoneNumber')}
                errorMessage={errors.phone?.message}
                {...field}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
