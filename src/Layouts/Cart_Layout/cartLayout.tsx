import React from 'react'
import CartHeader from 'src/Components/Cart_Header'
import Footer from 'src/Components/Footer'

interface CartLayoutProps {
  children?: React.ReactNode
}

export default function CartLayout({ children }: CartLayoutProps) {
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}
