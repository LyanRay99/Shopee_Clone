//* Library
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { HttpStatusCode } from 'src/Constants/httpStatusCode'
import { toast } from 'react-toastify'
import { Auth } from './../@types/auth.type'
import { SaveAccessToken } from './auth'
import { ClearAccessToken } from './auth'
import { GetAccessToken } from './auth'
import path from 'src/Constants/path'

//* Config Axios
class Http {
  instance: AxiosInstance
  private accessToken: string

  constructor() {
    this.accessToken = GetAccessToken()
    //* config axios instance
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      headers: {
        'Content-Type': 'application/json' //* dùng headers/Content-Type này vì ta đang dùng kiểu json để trả về server)
      }
    })

    //* interceptor này để gửi header kèm theo
    //* Đối với các route cần xác thực => Gửi token lên bằng headers với key là `authorization`. Token phải bắt đầu bằng 'Bearer'
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }

        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    //* add interceptors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        //* lấy url ra từ response.config
        const { url } = response.config
        // console.log(url)
        //* check xem user đang login/register hay logout để lưu/xóa token vào localStorage và set lại this.accessToken
        if (url === path.login || url === path.register) {
          this.accessToken = (response.data as Auth).data.access_token
          SaveAccessToken(this.accessToken)
        } else if (url === path.logout) {
          this.accessToken = ''
          ClearAccessToken()
        }

        // toast.success(message, {
        //   position: 'top-right',
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: 'light'
        // })
        return Promise.resolve(response)
      },
      (error: AxiosError) => {
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
