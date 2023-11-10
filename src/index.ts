import express, { NextFunction, Response, Request } from 'express'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()

const PORT = 4000
databaseService.connect()

app.use(express.json())
//route localhost:3000/
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRouter)
//localhost:3000/users/register

//app sử dụng một error handler tổng
app.use(defaultErrorHandler)
app.listen(PORT, () => {
  console.log(`Server đang chạy trên PORT ${PORT}`)
})
