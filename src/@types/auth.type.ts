import { ResponseAPI } from './utils.type'
import { User } from './user.type'

//* Interface của data khi ta call api cho việc register
export type Auth = ResponseAPI<{
  access_token: string
  expires: string
  user: User
}>
