import GameService from '../GameService.js'
import AuditService from '../AuditService.js'

export const getStatus = ({gameId}, callback) => GameService.getStatus(gameId).then(callback)

export const startGame = (identifiers, callback) => GameService.startGame(identifiers).then(callback)

export const movePiece = (identifiers, payload, callback) => GameService.movePiece(identifiers, payload).then(callback)

export const sendLogs = (identifiers, callback) => AuditService.updateLog(identifiers).then(callback)


