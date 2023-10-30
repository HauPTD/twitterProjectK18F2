//file này dùng để địng nghĩa lại request truyền lên
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: User //trong 1 request có thể có hoặc không có user
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
  }
}
