import express, { Router } from 'express'
import { register, wrap } from 'module'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controller'
import {
  accessTokenValidator,
  emailVerifyValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  verifyForgotPasswordTokenValidator
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

/*
des: resend emial verify
method: POST
headers: {Authorization, Bearer <access_token>}
*/
usersRoute.post('/resend-email-verify', accessTokenValidator, wrapAsync(resendEmailVerifyController))

/*
des: forgot password
khi người dùng quên mật khẩu, họ cung cấp email cho mình 
mình sẽ xem có user nào sở hữu emial đó k, nếu có thì mìn sẽ 
tạo 1 forgot_password_token và gửi vào email cửa user đó
method: POST
path: /user/forgot-password
body: {emial: string}
*/
usersRoute.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/*
des: verify forgot password token
người dùng sau kho báo forgot password, họ sẽ nhận được 1 emial
họ vào và click vào link trong email đó, link đó sẽ có 1 request đings kèm
forgot_password_token và gửi lên server /verify-forgot-password-token
mình sẽ verify cái token này nếu thành công thì mình sẽ cho người reset password
method: POST
path: /users/verify-forgot-password-token
body: {forgot_password_token: string}
*/
usersRoute.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)
export default usersRoute
