import express from 'express'
import usersRoute from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()

const PORT = 3000
databaseService.connect()

app.use(express.json())
//route localhost:3000/
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/users', usersRoute)
//localhost:3000/users/tweets
app.listen(PORT, () => {
  console.log(`Server đang chạy trên PORT ${PORT}`)
})
