import express from 'express'
import cors from 'cors'
import router from './router/index.js'

const app = express()
app.use(express.json({limit: '1mb'}))
app.use(cors())

app.get('/', (_req, res) => {
  res.send('You have just arrived at chess companion server')
})

app.use('/api', router)

export default app
