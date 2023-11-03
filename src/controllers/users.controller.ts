import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  EmialVerifyReqBody,
  ForgotpasswordReqBody,
  LoginReqBody,
  LogoutReqBody,
  RegisterReqBody,
  RequestPasswordReqBody,
  TokenPayload
} from '~/models/requests/User.requests'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'

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

export const emailVerifyController = async (req: Request<ParamsDictionary, any, EmialVerifyReqBody>, res: Response) => {
  //khi mà req vào được đây nghĩa là emial_verify_token đã valid
  //đồng thời trong req sẽ có decoded_email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  //tìm xem có user nào có mã này không
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu có user đó thì mình sẽ kiểm tra xem user đó có lưu emial_verify_token không?
  if (user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu xuống được đây nghĩa là user này tồn tại, và chưa verify
  //verifyEmial(id) là tìm user đó bằng user_id
  //và update lại email_verify_token thành '' và verify: 1
  const result = await userService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  //nếu qua được hàm này tức là đã qua được accessTokenValidator
  //req đã có decoded_authorization
  const { user_id } = req.decoded_authorization as TokenPayload
  //tìm user có user_id này
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  //nếu k có user thì res lỗi
  if (user === null) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu có thì xem thử nó đã verify chưa
  if (user.verify == UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu xuống được đây nghĩa là user này chưa verify, và bị mất email_verify_token
  //tiến hành tọa mới emial_verify_token và lưu database
  const result = await userService.resendEmailVerify(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotpasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  //middleware forgotPasswordValidator đã chạy rồi, nên ta có thể lấy _id từ user đã tìm đc bằng email
  const { _id } = req.user as User
  //cái _id này là objectid, nên ta phải chuyển nó về string
  //chứ không truyền trực tiếp vào hàm forgotPassword
  const result = await userService.forgotPassword((_id as ObjectId).toString())
  return res.json(result)
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, RequestPasswordReqBody>,
  res: Response
) => {
  //muốn đổi mk thì cần user_id và password mới
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  //cập nhật
  const result = await userService.reserPassword({ user_id, password })
  return res.json(result)
}
