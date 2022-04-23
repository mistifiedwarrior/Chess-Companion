import express from 'express'
import GameService from '../service/GameService.js'
import {handleError} from '../utils/errorHandlers.js'
import TokenService from '../service/TokenService.js'

const gameController = express.Router()

gameController.post('/init-game', (req, res) => {
  try {
    const [game, player] = GameService.initGame(req.body)
    const token = TokenService.createToken({gameId: game.gameId, player})
    res.send({game, token})
  } catch (error) {
    const customError = {code: '', message: 'Failed to initialise the game'}
    handleError(res, error, customError)
  }
})

export default gameController
