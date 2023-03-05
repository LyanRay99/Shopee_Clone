//* Library
import useRouteElements from './Routers/router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useContext } from 'react'

//* Utils
import { LocalStorageEventTarget } from './Utils/auth'
import { AppContext } from './Contexts/app.context'

function App() {
  const routeElements = useRouteElements()
  const { reset } = useContext(AppContext)

  // useEffect(() => {
  //   LocalStorageEventTarget.addEventListener('clearLS', () => reset())

  //   //* clear event khi components unmout và ko cần dùng đến nữa
  //   return () => {
  //     LocalStorageEventTarget.removeEventListener('clearLS', () => reset())
  //   }
  // }, [reset])

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
