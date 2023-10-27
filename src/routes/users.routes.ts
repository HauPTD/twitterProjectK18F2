import express, { Router } from 'express'
import { register } from 'module'
import { loginController, registerController } from '~/controllers/users.controller'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
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

export default usersRoute
