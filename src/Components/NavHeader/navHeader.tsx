//* Library
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

//* Ultis
import { AppContext } from 'src/Contexts/app.context'
import path from 'src/Constants/path'
import { logoutAccount } from 'src/Api/auth.api'
import { purchase_Status } from 'src/Constants/purchase'
import { getAvatarUrl } from 'src/Utils/customUrl'
import { locales } from 'src/i18n/i18Next'

//* Components
import Popover from '../Popover'

export default function NavHeader() {
  //* lấy isAuthenticated từ AppContext (check xem user đã đăng nhập chưa để show data bên dưới hoặc thưc hiện logout)
  const { isAuthenticated, setIsAuthenticated, profile, setProfile, isEnglish, setIsEnglish } = useContext(AppContext)

  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: logoutAccount,
    //* Khi logout thành công sẽ set isAuthenticated = false để nhận biết user đã logout
    //* Sau đó, sẽ xóa data profile của user ở localStorage
    onSuccess: (data) => {
      setIsAuthenticated(false)
      setProfile(null)
      //* xóa data cart khi logout
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchase_Status.inCart }] })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  //* i18Next
  const { i18n, t } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)

    //* Vì 1 số test được show bằng data Api chỉ có vi nên ta dùng useState để config chúng
    setIsEnglish(!isEnglish)
  }

  return (
    <div className='flex justify-end'>
      <Popover
        className='flex cursor-pointer items-center py-1 hover:text-white/70'
        renderPopover={
          <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
            <div className='flex flex-col py-2 pr-28 pl-3'>
              <button className='py-2 px-3 text-left hover:text-orange' onClick={() => changeLanguage('vi')}>
                Tiếng Việt
              </button>
              <button className='mt-2 py-2 px-3 text-left hover:text-orange' onClick={() => changeLanguage('en')}>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
          />
        </svg>
        <span className='mx-1'>{currentLanguage}</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>
      {/* show UI này khi user đã login */}
      {isAuthenticated && (
        <Popover
          className='ml-6 flex cursor-pointer items-center py-1 hover:text-white/70'
          renderPopover={
            <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
              <Link
                to={path.profile}
                className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                {t('navHeader.my profile')}
              </Link>
              <Link
                to={path.historyPurchase}
                className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                {t('navHeader.my purchase')}
              </Link>
              <button
                onClick={handleLogout}
                className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
              >
                {t('authen.logout')}
              </button>
            </div>
          }
        >
          <div className='mr-2 h-6 w-6 flex-shrink-0'>
            <img src={getAvatarUrl(profile?.avatar)} alt='avatar' className='h-full w-full rounded-full object-cover' />
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}
      {/* Show UI này khi user chưa login */}
      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.register} className='mx-3 capitalize hover:text-white/70'>
            {t('authen.register')}
          </Link>
          <div className='h-4 border-r-[1px] border-r-white/40' />
          <Link to={path.login} className='mx-3 capitalize hover:text-white/70'>
            {t('authen.login')}
          </Link>
        </div>
      )}
    </div>
  )
}
