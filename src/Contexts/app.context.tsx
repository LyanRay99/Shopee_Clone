import React, { useState } from 'react'
import { createContext } from 'react'
import { GetAccessToken } from 'src/Utils/auth'

//* khai báo interface
interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

//* giá trị khởi tạo context
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(GetAccessToken()),
  setIsAuthenticated: () => null
}

//* AppContext chứa các giá trị state mà ta có thê lấy ra
export const AppContext = createContext<AppContextInterface>(initialAppContext)

//* ta sẽ dùng AppProvider để bao bọc các vùng cần dùng state
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)

  return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AppContext.Provider>
}
