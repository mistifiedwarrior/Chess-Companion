import GameService from '../GameService.js'
import AuditService from '../AuditService.js'

export const getStatus = ({gameId}, callback) => GameService.getStatus(gameId).then(callback)

export const startGame = (identifiers, callback) => GameService.startGame(identifiers).then(callback)

export const movePiece = (identifiers, payload, callback) => GameService.movePiece(identifiers, payload).then(callback)
  .then(({game: playedGame}) => {
    if (playedGame.player2.includes('AI')) {
      GameService.getStatus(playedGame.gameId)
        .then(({game, player2}) => {
          if (game.player2.toLowerCase().startsWith(game.turn) && game.state !== 'END') {
            const identifier = {gameId: game.gameId, playerId: player2.playerId, player: player2}
            movePiece(identifier, player2.findNextMove(game), callback)
          }
        })
    }
  })

export const sendLogs = (identifiers, callback) => AuditService.updateLog(identifiers).then(callback)


