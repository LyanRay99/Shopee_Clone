//* Library
import React from 'react'

//* Components
import RegisterHeader from 'src/Components/Header_Resgister'
import Footer from 'src/Components/Footer'

//* Interface
interface RegisterLayoutProps {
  children?: React.ReactNode
}

export default function RegisterLayout(props: RegisterLayoutProps) {
  const { children } = props

  return (
    <div>
      <RegisterHeader />
      <div>{children}</div>
      <Footer />
    </div>
  )
}
