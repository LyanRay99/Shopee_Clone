//* Library
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { HttpStatusCode } from 'src/Constants/httpStatusCode'
import { toast } from 'react-toastify'

//* Config Axios
class Http {
  instance: AxiosInstance

  constructor() {
    //* config axios instance
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      headers: {
        'Content-Type': 'application/json' //* dùng headers/Content-Type này vì ta đang dùng kiểu json để trả về server)
      }
    })

    //* add interceptors
    this.instance.interceptors.response.use(
      function (response: AxiosResponse) {
        const message = response.data.message
        // console.log(response.data.message)
        toast.success(message, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light'
        })
        return Promise.resolve(response)
      },
      function (error: AxiosError) {
        // console.log(error.response?.status)
        if (error.response?.status === HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data
          const message = data.data.password || error.message
          // console.log(error.response.data)
          toast.error(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light'
          })
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance

export default http
