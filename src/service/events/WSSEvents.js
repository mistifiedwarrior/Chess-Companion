import GameService from '../GameService.js'
import AuditService from '../AuditService.js'
import ChatService from '../ChatService.js'

const moveIfAITurn = (callback, movePiece) => ({game, player2, player1}) => {
  if (game.state !== 'END' && player2 && player2.playerId.includes('AI') && player2.isMyTurn(game.turn)) {
    const identifier = {game, playerId: player2.playerId, player: player2, player1, player2}
    return movePiece(identifier, player2.findNextMove(game), callback).catch()
  }
  return null
}

export const movePiece = (identifiers, payload, callback) => GameService.movePiece(identifiers, payload)
  .then((args) => callback(Object.assign(args, identifiers)))
  .then(moveIfAITurn(callback, movePiece))

export const getStatus = (identifiers, callback) => GameService.getStatus(identifiers)
  .then((args) => callback(Object.assign(args, {user: identifiers.player}, identifiers)))
  .then(moveIfAITurn(callback, movePiece))

export const startGame = (identifiers, callback) => GameService.startGame(identifiers).then(callback)

export const sendLogs = (identifiers, callback) => AuditService.updateLog(identifiers).then(callback)

export const communicate = (identifiers, callback) => ChatService.updateChat(identifiers).then(callback)
