import GameService from '../GameService.js'
import AuditService from '../AuditService.js'

const moveIfAITurn = (callback, movePiece) => ({game: playedGame}) => {
  if (playedGame.player2.includes('AI')) {
    GameService.getStatus(playedGame.gameId)
      .then(({game, player2}) => {
        if (game.player2.toLowerCase().startsWith(game.turn) && game.state !== 'END') {
          const identifier = {gameId: game.gameId, playerId: player2.playerId, player: player2}
          movePiece(identifier, player2.findNextMove(game), callback)
        }
      })
  }
}

export const movePiece = (identifiers, payload, callback) => GameService.movePiece(identifiers, payload).then(callback)
  .then(moveIfAITurn(callback, movePiece))

export const getStatus = ({gameId, player}, callback) => GameService.getStatus(gameId)
  .then((args) => callback(Object.assign(args, {user: player})))
  .then(moveIfAITurn(callback, movePiece))

export const startGame = (identifiers, callback) => GameService.startGame(identifiers).then(callback)

export const sendLogs = (identifiers, callback) => GameService.findGame(identifiers.gameId)
  .then((game) => AuditService.updateLog(Object.assign(identifiers, {game})))
  .then(callback)
