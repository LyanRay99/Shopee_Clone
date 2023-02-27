//* Library
import useRouteElements from './Routers/router'

function App() {
  const routeElements = useRouteElements()

  return <div>{routeElements}</div>
}

export default App
