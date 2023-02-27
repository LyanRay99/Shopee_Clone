/**
 * * Config Router
 * * Config Router bằng useRoutes thay vì dùng các thông thường (Router có 2 cách sử dụng)
 * * Import vào App.tsx và đặt trong Component App
 */
// **************************************************************************************

//* Library
import { Navigate, Outlet, useRoutes } from 'react-router-dom'

//* Components

import Login from '../Pages/Login'
import Register from 'src/Pages/Register'
import RegisterLayout from 'src/Layouts/Register_Layout'
import MainLayout from 'src/Layouts/Main_layout'
import ProductLists from '../Pages/ProductList'
import Profile from 'src/Pages/Profile'

//* Function này dùng để ngăn chặn user vào trang chủ khi chưa login
//* Nếu user đã login (tức isAuthenticated = true) thì sẽ được chuyển đến trang chủ (được đặt trong Outlet của React-router)
//* Nếu user chưa login thì sẽ được điều hướng (Navigate) đến trang login
const isAuthenticated = false
function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

//* Function này dùng để ngăn chặn user vào trang Register hoặc Login khi đã login rồi
//* Nếu user chưa login (tức !isAuthenticated = true) thì sẽ chuyển đến trang Login
//* Ngược lại, sẽ điều hướng đến trang Product (hoặc trang nào đó trong web)
function RejectedRoute() {
  // const isAuthenticated = false
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

//* Routes of web
export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '/login',
          element: (
            <RegisterLayout>
              <Login />
            </RegisterLayout>
          )
        },
        {
          path: '/register',
          element: (
            <RegisterLayout>
              <Register />
            </RegisterLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: '/user/profile',
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
    },
    {
      path: '/',
      index: true,
      element: (
        <MainLayout>
          <ProductLists />
        </MainLayout>
      )
    }
  ])

  return routeElements
}
