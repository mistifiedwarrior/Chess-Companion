import express from 'express'
import router from './router/index.js'
import TokenService from './service/TokenService.js'
import {logger} from './logger/logger.js'
import Games from './domain/Games.js'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({limit: '1mb'}))

app.use((req, res, next) => {
  const {send} = res
  // eslint-disable-next-line func-names
  res.send = function (responseBody) {
    logger.info({method: req.method, url: req.url, status: res.statusCode})
    // eslint-disable-next-line prefer-reflect
    send.call(this, responseBody)
  }
  next()
})

app.get('/', (_req, res) => {
  res.send('You have just arrived at chess companion server')
})

app.use(async (req, res, next) => {
  try {
    const {gameId, player} = TokenService.parseToken(req.headers.authorization)
    req.gameId = gameId
    req.player = player.playerId && await Games.getPlayer(player.playerId)
    req.game = gameId && await Games.getGame(gameId)
    req.player1 = req.game.player1 && await Games.getPlayer(req.game.player1)
    req.player2 = req.game.player2 && await Games.getPlayer(req.game.player2)
  } catch (_error) {
    req.unauthorized = true
  }
  next()
})

app.use('/api', router)

export default app
