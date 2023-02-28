import { useSearchParams } from 'react-router-dom'

//* function này để lấy các query params trên url xuống
//* vd: ...?page=1&limit=10&order=asc&sort_by=sold
export default function useQueryParams() {
  const [searchParams] = useSearchParams()
  return Object.fromEntries([...searchParams])
}

