import {logger} from '../logger/logger.js'
import {getStatus, startGame} from './events/WSSEvents.js'
import {START, STATUS} from './events/action.js'

const formatMessage = (message) => {
  try {
    return {payload: JSON.parse(message)}
  } catch (error) {
    return {error: true, payload: message}
  }
}

const WebSocketMessageService = (broadcast, ws) => (message) => {
  logger.info({
    message: 'Received new message',
    data: message,
    searchableFields: {playerId: ws.playerId, gameId: ws.gameId}
  })
  
  const {error, payload} = formatMessage(message)
  
  if (error) {
    logger.error(`Error on formatting message ${message}`)
    return
  }
  
  switch (payload.event) {
    case STATUS:
      getStatus(ws.gameId, (msg) => broadcast(STATUS, msg))
      break
    case START:
      startGame(ws.gameId, ws.playerId, (msg) => broadcast(START, msg))
      break
    default:
      break
  }
}

export default WebSocketMessageService
