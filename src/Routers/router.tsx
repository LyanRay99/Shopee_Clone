/**
 * * Config Router
 * * Config Router bằng useRoutes thay vì dùng các thông thường (Router có 2 cách sử dụng)
 * * Import vào App.tsx và đặt trong Component App
 */

//* Library
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { useContext, lazy, Suspense } from 'react'
import { AppContext } from 'src/Contexts/app.context'

//* Utils
import path from 'src/Constants/path'

//* Components
import Login from '../Pages/Login'
import Register from 'src/Pages/Register'
import RegisterLayout from 'src/Layouts/Register_Layout'
import MainLayout from 'src/Layouts/Main_Layout'
import ProductLists from '../Pages/ProductList'
import Profile from 'src/Pages/User/Pages/Profile'
import ProductDetail from 'src/Pages/ProductDetail'
import Cart from 'src/Pages/Cart'
import CartLayout from 'src/Layouts/Cart_Layout'
import UserLayout from 'src/Layouts/User_Layout'
import HistoryPurchase from 'src/Pages/User/Pages/HistoryPurchase'
import ChangePassword from 'src/Pages/User/Pages/ChangePassword'
import NotFound from 'src/Pages/NotFound'

//* Lazy loading
// const Login = lazy(() => import('../Pages/Login'))
// const Register = lazy(() => import('../Pages/Register'))
// const ProductLists = lazy(() => import('../Pages/ProductList'))
// const ProductDetail = lazy(() => import('../Pages/ProductDetail'))
// const Cart = lazy(() => import('../Pages/Cart'))
// const Profile = lazy(() => import('../Pages/User/Pages/Profile'))
// const HistoryPurchase = lazy(() => import('../Pages/User/Pages/HistoryPurchase'))
// const ChangePassword = lazy(() => import('../Pages/User/Pages/ChangePassword'))
// const NotFound = lazy(() => import('../Pages/NotFound'))
// const RegisterLayout = lazy(() => import('../Layouts/Register_Layout'))
// const MainLayout = lazy(() => import('../Layouts/Main_Layout'))
// const CartLayout = lazy(() => import('../Layouts/Cart_Layout'))
// const UserLayout = lazy(() => import('../Layouts/User_Layout'))

//* Function này dùng để ngăn chặn user vào trang chủ khi chưa login
//* Nếu user đã login (tức isAuthenticated = true) thì sẽ được chuyển đến trang chủ (được đặt trong Outlet của React-router)
//* Nếu user chưa login thì sẽ được điều hướng (Navigate) đến trang login
function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // console.log(isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} />
}

//* Function này dùng để ngăn chặn user vào trang Register hoặc Login khi đã login rồi
//* Nếu user chưa login (tức !isAuthenticated = true) thì sẽ chuyển đến trang Login
//* Ngược lại, sẽ điều hướng đến trang Product (hoặc trang nào đó trong web)
function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  // console.log(isAuthenticated)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

//* Component used for lazy loading
const loading = <div style={{ margin: '50vh auto' }}>Loading...</div>

//* Routes of web
export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense fallback={loading}>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense fallback={loading}>
                <Register />
              </Suspense>
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
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense fallback={loading}>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.home,
          element: (
            <MainLayout>
              <Suspense fallback={loading}>
                <UserLayout />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              path: path.profile,
              element: <Profile />
            },
            {
              path: path.changePassword,
              element: <ChangePassword />
            },
            {
              path: path.historyPurchase,
              element: <HistoryPurchase />
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      index: true,
      element: (
        <MainLayout>
          <Suspense fallback={loading}>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: path.home,
      index: true,
      element: (
        <MainLayout>
          <Suspense fallback={loading}>
            <ProductLists />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense fallback={loading}>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])

  return routeElements
}
