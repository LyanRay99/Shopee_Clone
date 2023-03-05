import { User } from 'src/@types/user.type'

//* Create event target
export const LocalStorageEventTarget = new EventTarget()

//* lưu access token vào localStorage
export const SetAccessToken = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

//* xóa access token và profile từ localStorage
export const ClearData = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')

  //* tạo Event để truyền vào (nó sẽ được lắng nghe ở App.tsx)
  const clearLSEvent = new Event('clearLS')
  LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

//* lấy access token từ localStorage
export const GetAccessToken = () => localStorage.getItem('access_token') || ''

//* lấy data profile từ localStorage
export const GetProfile = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

//* lưu data profile vào localStorage
export const SetProfile = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
