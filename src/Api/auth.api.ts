import { Auth } from './../@types/auth.type'
import http from 'src/Utils/http'
import path from 'src/Constants/path'

/**
 ** Do ta đã config Api bằng axios rồi nên ta sẽ tại các request tại đây
 ** variable registerAccount là 1 function và function này nhận vào 1 tham số body là object
 ** Body có 2 property là email + password. cả 2 đều có type là string
 ** Return về http... để call api (truyền vào baseURL và giá trị body)
 ** Tương tự với các function sau
 */

export const registerAccount = (body: { email: string; password: string }) => http.post<Auth>(path.register, body)
export const loginAccount = (body: { email: string; password: string }) => http.post<Auth>(path.login, body)
export const logoutAccount = () => http.post(path.logout)
