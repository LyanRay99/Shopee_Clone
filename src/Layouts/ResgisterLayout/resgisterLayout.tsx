//* Library
import React from 'react'

//* Interface
interface ResgisterLayoutProps {
  children?: React.ReactNode
}

export default function ResgisterLayout(props: ResgisterLayoutProps) {
  const { children } = props

  return <div>resgisterLayout {children}</div>
}
