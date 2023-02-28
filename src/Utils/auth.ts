//* lưu access token vào local storage
export const SaveAccessToken = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken)
}

//* xóa access token từ local storage
export const ClearAccessToken = () => {
  localStorage.removeItem('access_token')
}

//* lấy access token từ local storage
export const GetAccessToken = () => localStorage.getItem('access_token') || ''
