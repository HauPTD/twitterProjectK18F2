import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, LogoutReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User // lấy user từ req
  const user_id = user._id as ObjectId // lấy _id từ user
  const result = await userService.login(user_id.toString())
  //login nhận vào user_id:string, nhưng user_id ta có
  //là objectid trên mongodb, nên phải toString()
  //trả ra kết quả, thiếu cái này là sending hoài luôn
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result: result
  })
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  //tạo 1 user mới và bỏ vào collection users trong database
  const result = await userService.register(req.body)
  return res.status(201).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  //logout sẽ nhận vào refresh_token để tìm và xóa
  const result = await userService.logout(refresh_token)
  res.json(result)
}
