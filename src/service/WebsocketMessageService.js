import {logger} from '../logger/logger.js'
import {getStatus, movePiece, startGame} from './events/WSSEvents.js'
import {MOVE, START, STATUS} from './events/action.js'
import AuditService from './AuditService.js'

const formatMessage = (message) => {
  try {
    return {payload: JSON.parse(message)}
  } catch (error) {
    return {error: true, payload: message}
  }
}

const WebSocketMessageService = (broadcast, ws) => (message) => {
  AuditService.broadcastLog(broadcast)
  
  logger.info({
    message: 'Received new message',
    searchableFields: {playerId: ws.playerId, gameId: ws.gameId}
  })
  
  const {error, payload} = formatMessage(message)
  
  if (error) {
    logger.error(`Error on formatting message ${message}`)
    return
  }
  
  const identifiers = {gameId: ws.gameId, playerId: ws.playerId, player: ws.player}
  
  try {
    switch (payload.event) {
      case STATUS:
        getStatus(identifiers, (msg) => broadcast(STATUS, msg))
        break
      case START:
        startGame(identifiers, (msg) => broadcast(START, msg))
        break
      case MOVE:
        movePiece(identifiers, payload, (msg) => broadcast(MOVE, msg))
        break
      default:
        break
    }
  } catch (err) {
    logger.error(err)
  }
}

export default WebSocketMessageService
