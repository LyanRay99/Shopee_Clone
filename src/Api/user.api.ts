import http from 'src/Utils/http'
import path from 'src/Constants/path'
import { SuccessResponse } from 'src/@types/utils.type'
import { User } from 'src/@types/user.type'
import { Omit } from 'lodash'

/*
 * khai báo lại interface dùng cho updateUser
 * kế thừa lại interface User và dùng omit loại bỏ đi một số property
 * thêm mới 2 property (password, newPassword) vào
 */
interface BodyUser extends Omit<User, '_id' | 'role' | 'email' | 'createAt' | 'updateAt'> {
  password?: string
  newPassword?: string
}

//* Api get data user
export const getProfile = () => http.get<SuccessResponse<User>>(path.user)

//* Api update data User
export const updateProfile = (body: BodyUser) => http.put<SuccessResponse<User>>(path.user, body)

//* Api upload avatar
export const uploadAvatar = (body: FormData) =>
  http.post<SuccessResponse<string>>(path.uploadAvatar, body, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
