import { SuccessResponse } from './utils.type'
import { User } from './user.type'

//* Interface của data khi ta call api cho việc register
export type Auth = SuccessResponse<{
  access_token: string
  expires: string
  user: User
}>
