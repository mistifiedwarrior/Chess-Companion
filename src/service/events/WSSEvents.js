import GameService from '../GameService.js'

export const getStatus = ({gameId}, callback) => GameService.getStatus(gameId).then(callback)

export const startGame = (identifiers, callback) => GameService.startGame(identifiers).then(callback)

export const movePiece = (identifiers, payload, callback) => GameService.movePiece(identifiers, payload).then(callback)


