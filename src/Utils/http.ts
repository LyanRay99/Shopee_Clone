//* Library
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import { toast, ToastPosition, Theme } from 'react-toastify'

//* Utils
import { HttpStatusCode } from 'src/Constants/httpStatusCode'
import { Auth, RefreshTokenReponse } from './../@types/auth.type'
import { SetAccessToken, SetProfile, ClearData, GetAccessToken, GetRefreshToken, SetRefreshToken } from './auth'
import path from 'src/Constants/path'
import { ErrorResponse } from 'src/@types/utils.type'
import { isAxiosError_UnprocessableEntity, isAxiosExpiredTokenError } from './axiosError'

//* custom notify
const customNotify: {
  position: ToastPosition
  autoClose: number
  hideProgressBar: boolean
  closeOnClick: boolean
  pauseOnHover: boolean
  draggable: boolean
  progress: string | number | undefined
  theme: Theme
} = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light'
}

//* Config Axios
class Http {
  instance: AxiosInstance
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = GetAccessToken()
    this.refreshToken = GetRefreshToken()
    this.refreshTokenRequest = null

    //* config axios instance
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com/',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json', //* dùng headers/Content-Type này vì ta đang dùng kiểu json để trả về server)
        'expire-access-token': 109999,
        'expire-refresh-token': 60 * 60 * 999
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
      //* thực hiện khi call api thành công
      (response: AxiosResponse) => {
        //* lấy url ra từ response.config
        const { url } = response.config
        // console.log(url)
        //* check xem user đang login/register hay logout để lưu/xóa token và profile vào localStorage
        //* set lại this.accessToken và this.refreshToken
        if (url === path.login || url === path.register) {
          const data = response.data as Auth
          this.accessToken = data.data.access_token
          this.refreshToken = data.data.refresh_token

          //* handle save access_token, refresh_token, profile into localStorage
          SetAccessToken(this.accessToken)
          SetRefreshToken(this.refreshToken)
          SetProfile(data.data.user)

          //* show notify
          toast.success(response.data.message, customNotify)
        } else if (url === path.logout) {
          this.accessToken = ''
          this.refreshToken = ''
          ClearData()
        }

        return Promise.resolve(response)
      },

      //* thực hiện khi call api thất bại
      (error: AxiosError) => {
        //* Chỉ toast lỗi không phải 422 và 401
        if (
          ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        ) {
          const data: any | undefined = error.response?.data
          const message = data.data.password || error.message
          // console.log(error.response.data)
          toast.error(message, customNotify)
        }

        /*
         * delete data when error 401
         * Lỗi Unauthorized (401) có rất nhiều trường hợp
         * - Token không đúng
         * - Không truyền token
         * - Token hết hạn
         */

        // Nếu là lỗi 401
        if (isAxiosError_UnprocessableEntity<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || {}
          // const { url } = config
          const url = error.response?.config.url

          // console.log(error.response?.config)

          // Trường hợp Token hết hạn và request đó không phải là request của refresh token
          // thì chúng ta mới tiến hành gọi refresh token
          console.log(config)
          if (isAxiosExpiredTokenError(error) && url !== 'refresh-access-token') {
            // Hạn chế gọi 2 lần handleRefreshToken
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((access_token) => {
              // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
              const headers = error.response?.config.headers
              return this.instance({ ...config, headers: { ...headers, authorization: access_token } })
              // return this.instance({ ...config, headers: { ...config.headers, authorization: access_token } })
            })
          }

          /*
           * Còn những trường hợp như token không đúng
           * không truyền token,
           * token hết hạn nhưng gọi refresh token bị fail
           * thì tiến hành xóa local storage và toast message
           */

          ClearData()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenReponse>('refresh-access-token', {
        refresh_token: this.refreshToken
      })
      .then((res) => {
        const { access_token } = res.data.data
        SetAccessToken(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        ClearData()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance

export default http
