/**
 * * Config Router
 * * Config Router bằng useRoutes thay vì dùng các thông thường (Router có 2 cách sử dụng)
 * * Import vào App.tsx và đặt trong Component App
 */

// **************************************************************************************

//* Library
import { useRoutes } from 'react-router-dom'

//* Components
import ProductLists from '../Pages/ProductList'
import Login from '../Pages/Login'
import Register from 'src/Pages/Register'
import RegisterLayout from 'src/Layouts/RegisterLayout'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      // element: <ProductLists />
      element: (
        <RegisterLayout>
          <Register />
        </RegisterLayout>
      )
    },
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
  ])

  return routeElements
}
