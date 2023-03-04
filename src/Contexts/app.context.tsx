import React, { useState } from 'react'
import { createContext } from 'react'
import { GetAccessToken, SetProfile } from 'src/Utils/auth'
import { GetProfile } from 'src/Utils/auth'
import { User } from 'src/@types/user.type'
import { ExtendedPurchases } from 'src/@types/purchase.type'

//* khai báo interface
interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchases: ExtendedPurchases[]
  setExtendedPurchases: React.Dispatch<React.SetStateAction<ExtendedPurchases[]>>
  reset: () => void
}

//* giá trị khởi tạo context
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(GetAccessToken()),
  setIsAuthenticated: () => null,
  profile: GetProfile(),
  setProfile: () => null,
  extendedPurchases: [],
  setExtendedPurchases: () => null,
  reset: () => null
}

//* AppContext chứa các giá trị state mà ta có thê lấy ra
export const AppContext = createContext<AppContextInterface>(initialAppContext)

//* ta sẽ dùng AppProvider để bao bọc các vùng cần dùng state
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)

  //* declare array of products in cart
  const [extendedPurchases, setExtendedPurchases] = useState<ExtendedPurchases[]>(initialAppContext.extendedPurchases)

  //* set state 'isAuthenticated' và 'extendedPurchases' when token expired
  const reset = () => {
    setIsAuthenticated(false)
    setExtendedPurchases([])
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchases,
        setExtendedPurchases,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
