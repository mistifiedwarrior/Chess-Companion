import {logger} from '../logger/logger.js'
import {communicate, getStatus, movePiece, sendLogs, startGame} from './events/WSSEvents.js'
import {CHAT, LOG, MOVE, START, STATUS} from './events/action.js'
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

  const identifiers = {
    game: ws.game,
    gameId: ws.gameId,
    playerId: ws.playerId,
    player: ws.player,
    player1: ws.player1,
    player2: ws.player2
  }

  switch (payload.event) {
    case STATUS:
      getStatus(identifiers, (msg) => broadcast(STATUS, msg)).catch()
      break
    case START:
      startGame(identifiers, (msg) => broadcast(START, msg)).catch()
      break
    case MOVE:
      movePiece(identifiers, payload, (msg) => broadcast(MOVE, msg)).catch()
      break
    case LOG:
      sendLogs(Object.assign(identifiers, payload), (msg) => broadcast(LOG, msg)).catch()
      break
    case CHAT:
      communicate(Object.assign(identifiers, payload), (msg) => broadcast(CHAT, msg)).catch()
      break
    default:
      break
  }
}

export default WebSocketMessageService
