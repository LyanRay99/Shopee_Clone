import axios, { AxiosError } from 'axios'
import { HttpStatusCode } from 'src/Constants/httpStatusCode'

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
