import express, { Router } from 'express'
import { register } from 'module'
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'
const usersRoute = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
usersRoute.get('/login', loginValidator, wrapAsync(loginController))

/* 
Description: Register new user
Path: /register
Method: POST
body:{
    name: string
    email: string
    password: string
    condirm_password: string
    date_of_birth: string theo chuẩn ISO 8601
}
*/
usersRoute.post('/register', registerValidator, wrapAsync(registerController))

/*
des: đăng xuất
path: /users/logout
method: POST
headers: {Authorization: 'Bearer <access_token>'}
body:{refresg_token: string}
*/
usersRoute.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

/*
des: verify email
khi người dùng đăng kí trong email của họ sẽ có 1 link
trong link này đã setup sẵn 1 request kèm cái email_verify_token
thì verify email là cái route cho request đó
method: POST
path: /users/verify_email
body: {emial_verify_token: string}
*/
usersRoute.post('/verify-email', emailVerifyValidator, wrapAsync(emailVerifyController))
export default usersRoute
