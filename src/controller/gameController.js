import express from 'express'
import GameService from '../service/GameService.js'
import {handleError} from '../utils/errorHandlers.js'
import TokenService from '../service/TokenService.js'

const gameController = express.Router()

gameController.post('/init-game', (req, res) => {
  const customError = {code: '', message: 'Failed to initialise the game'}
  GameService.initGame(req.body)
    .then(([game, player]) => {
      const token = TokenService.createToken({gameId: game.gameId, player})
      res.send({game, token, player})
    })
    .catch((error) => handleError(res, error, customError))
})

gameController.get('/status', (req, res) => {
  const customError = {code: '', message: 'Failed to get the game status'}
  GameService.getStatus(req.gameId)
    .then(({game, player1, player2}) => res.send({game, player1, player2, user: req.player}))
    .catch((error) => handleError(res, error, customError))
})

gameController.get('/:gameId/start', (req, res) => {
  try {
    const game = GameService.startGame(req.params.gameId, req.player)
    res.send({game})
  } catch (error) {
    const customError = {code: '', message: 'Failed to start game'}
    handleError(res, error, customError)
  }
})

export default gameController
