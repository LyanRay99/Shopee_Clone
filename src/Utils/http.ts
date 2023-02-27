//* Completed: Config Axios
import axios, { AxiosInstance } from 'axios'

//* Tạo trước class để sử dụng
class Http {
  instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      headers: {
        'Content-Type': 'application/json' //* dùng headers/Content-Type này vì ta đang dùng kiểu json để trả về server)
      }
    })
  }
}

const http = new Http().instance

export default http
