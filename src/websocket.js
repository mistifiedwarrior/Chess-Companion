import url from 'url'
import * as WebSocket from 'ws'
import {logger} from './logger/logger.js'
import WebSocketMessageService from './service/WebsocketMessageService.js'
import TokenService from './service/TokenService.js'
import {STATUS} from './service/events/action.js'
import ClientService from './service/ClientService.js'

const addClient = (ws) => {
  logger.info({message: 'New connection established', gameId: ws.gameId, player: ws.playerId})
  ClientService.addClient(ws)
}

const broadcast = (gameId) => (event, message) => {
  ClientService.clients
    .filter((client) => client.gameId === gameId)
    .forEach((client) => client.send(JSON.stringify({event, message})))
  logger.info({message: 'Successfully broadcast message via websocket', searchableFields: {event, gameId}})
}

const webSocketController = () => {
  const wss = new WebSocket.WebSocketServer({
    noServer: true,
    path: '/websockets'
  })
  
  wss.on('connection', (ws, req) => {
    const parameters = url.parse(req.url, true)
    const {gameId, player} = TokenService.parseToken(parameters.query.token)
    ws.gameId = gameId
    ws.playerId = player.playerId
    addClient(ws)
    ws.on('message', WebSocketMessageService(broadcast(gameId), ws))
    ws.on('close', () => ClientService.removeClient(player.playerId))
    ws.emit('message', JSON.stringify({event: STATUS}))
  })
  
  wss.onUpgrade = (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit('connection', websocket, request)
    })
  }
  
  return wss
}

export default webSocketController()
