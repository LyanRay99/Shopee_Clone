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
import Resgister from 'src/Pages/Resgister'
import ResgisterLayout from 'src/Layouts/ResgisterLayout'

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '/',
      element: <ProductLists />
    },
    {
      path: '/login',
      element: (
        <ResgisterLayout>
          <Login />
        </ResgisterLayout>
      )
    },
    {
      path: '/resgister',
      element: (
        <ResgisterLayout>
          <Resgister />
        </ResgisterLayout>
      )
    }
  ])

  return routeElements
}
