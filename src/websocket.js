import url from 'url'
import * as WebSocket from 'ws'
import {logger} from './logger/logger.js'
import WebSocketMessageService from './service/WebsocketMessageService.js'
import TokenService from './service/TokenService.js'
import ClientService from './service/ClientService.js'
import {IdGenerator, IdType} from './service/IdGenerator.js'
import {LOG} from './service/events/action.js'

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
  
  wss.on('connection', async (ws, req) => {
    try {
      const parameters = url.parse(req.url, true)
      let {gameId} = parameters.query
      if (gameId && gameId !== 'undefined') {
        ws.gameId = gameId
        ws.playerId = await IdGenerator.generate(IdType.user)
      } else {
        const {gameId: id, player} = TokenService.parseToken(parameters.query.token)
        ws.gameId = id
        ws.player = player
        ws.playerId = player.playerId
      }
      addClient(ws)
      ws.on('message', WebSocketMessageService(broadcast(ws.gameId), ws))
      ws.on('close', () => ClientService.removeClient(ws.playerId))
      ws.emit('message', JSON.stringify({event: LOG}))
    } catch (err) {
      logger.error(err)
    }
  })
  
  wss.onUpgrade = (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (websocket) => {
      wss.emit('connection', websocket, request)
    })
  }
  
  return wss
}

export default webSocketController()
