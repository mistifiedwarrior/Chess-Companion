import GameService from '../GameService.js'

export const getStatus = (gameId, callback) => GameService.getStatus(gameId).then(callback)

export const startGame = (gameId, playerId, callback) => GameService.startGame(gameId, playerId).then(callback)


