import { SuccessResponse } from './utils.type'
import { User } from './user.type'

//* Interface của data khi ta call api cho việc register
export type Auth = SuccessResponse<{
  access_token: string
  expires: number
  refresh_token: string
  expires_refresh_token: number
  user: User
}>

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>
