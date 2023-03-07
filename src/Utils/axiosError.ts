import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/Constants/httpStatusCode'
import { ErrorResponse } from 'src/@types/utils.type'

//* Convert type of error => type nhất định
export const isAxiosErrors = <T>(error: unknown): error is AxiosError<T> => {
  // eslint-disable-next-line import/no-named-as-default-member
  return axios.isAxiosError(error)
}

/**
 * * check axios error
 * * Sử dụng toán tử &&
 * * Nếu gặp lỗi khi call api tức isAxiosErrors(error) = true
 * * Thì nó sẽ chạy đoạn code đằng sau để so sánh http status code có phải 422 không và trả về response thông báo lỗi
 */
export const isAxiosError_UnprocessableEntity = <FormError>(error: unknown): error is AxiosError<FormError> => {
  return isAxiosErrors(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

//* check error 401
export function isAxiosError_UnauthorizedError<UnauthorizedError>(
  error: unknown
): error is AxiosError<UnauthorizedError> {
  return isAxiosErrors(error) && error.response?.status === HttpStatusCode.Unauthorized
}

//* Error token expired
export function isAxiosExpiredTokenError<UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> {
  return (
    isAxiosError_UnprocessableEntity<ErrorResponse<{ name: string; message: string }>>(error) &&
    error.response?.data?.data?.name === 'EXPIRED_TOKEN'
  )
}
