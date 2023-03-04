import React from 'react'
import Header from 'src/Components/Header'
import Footer from 'src/Components/Footer'

interface MainLayoutProps {
  children?: React.ReactNode
}

export default function MainLayout(props: MainLayoutProps) {
  const { children } = props

  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
