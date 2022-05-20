import express from 'express'
import GameService from '../service/GameService.js'
import {handleError} from '../utils/errorHandlers.js'
import TokenService from '../service/TokenService.js'
import Games from '../domain/Games.js'

const gameController = express.Router()

gameController.post('/init-game', (req, res) => {
  const customError = {code: '', message: 'Failed to initialise the game'}
  GameService.initGame(req.body)
    .then(([game, player]) => {
      const token = TokenService.createToken({gameId: game.gameId, playerId: player.playerId})
      res.send({game, token, player})
    })
    .catch((error) => handleError(res, error, customError))
})

gameController.get('/status', (req, res) => {
  const customError = {code: '', message: 'Failed to get the game status'}
  const metaData = {game: req.game, player1: req.player1, player2: req.player2}
  GameService.getStatus(metaData)
    .then(({game, player1, player2}) => res.send({game, player1, player2, user: req.player}))
    .catch((error) => handleError(res, error, customError))
})

gameController.get('/status/:gameId', async (req, res) => {
  const customError = {code: '', message: 'Failed to get the game status by gameId'}

  const game = await Games.getGame(req.params.gameId)
  const metaData = {
    game,
    player1: await Games.getPlayer(game.player1),
    player2: game.player2 && await Games.getPlayer(game.player2)
  }

  GameService.getStatus(metaData)
    .then(({game, player1, player2}) => res.send({game, player1, player2}))
    .catch((error) => handleError(res, error, customError))
})

gameController.get('/possibles/:square', (req, res) => {
  try {
    const moves = GameService.getPossibleMoves(req.game, req.player, req.params.square)
    res.send(moves)
  } catch (error) {
    const customError = {code: '', message: 'Failed to get the possible moves'}
    handleError(res, error, customError)
  }
})

gameController.put('/reset-game', async (req, res) => {
  const customError = {code: '', message: 'Failed to reset the game'}
  const game = await Games.getGame(req.body.gameId)
  if (req.body.password !== 'teamcompanion') {
    return res.send({status: false})
  }
  GameService.resetGame(game)
    .then(() => res.send({status: true}))
    .catch((error) => handleError(res, error, customError))
})

export default gameController
