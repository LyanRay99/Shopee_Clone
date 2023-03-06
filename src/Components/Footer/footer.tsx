import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation('footer')

  return (
    <footer className='bg-neutral-100 py-16  text-gray-500'>
      <div className='container'>
        <div className='flex flex-wrap justify-between text-sm'>
          <div className='w-1/4 text-left'>
            <div>{t('footer.copyright')}</div>
          </div>
          <div className='w-3/4 text-right'>
            <div>{t('footer.countryAndRegion')}</div>
          </div>
        </div>
        <div className='mt-10 text-center text-sm'>
          <div>{t('footer.company')}</div>
          <div className='mt-6'>{t('footer.address')}</div>
          <div className='mt-2'>{t('footer.responsibility')}</div>
          <div className='mt-2'>{t('footer.code')}</div>
        </div>
      </div>
    </footer>
  )
}
