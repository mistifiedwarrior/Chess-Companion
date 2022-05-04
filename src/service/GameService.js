import Game from '../domain/Game.js'
import BadDataException from '../exception/BadDataException.js'
import ChessError from '../exception/errorCodes.js'
import PlayerService from './PlayerService.js'
import GameRepository from '../repository/GameRepository.js'
import {IdGenerator, IdType} from './IdGenerator.js'
import DataNotFoundException from '../exception/DataNotFoundException.js'
import {logOnError, logOnSuccess} from '../logger/logger.js'

// eslint-disable-next-line max-lines-per-function
const GameService = () => ({
  
  initGame(values) {
    return values.type === 'HOST' ? this.hostGame(values) : this.joinGame(values)
  },
  
  findGame(gameId) {
    return GameRepository.findOne({gameId})
      .then((game) => {
        if (!game) {
          throw new DataNotFoundException(ChessError.CHESS600)
        }
        return Game.loadGame(game)
      })
      .then(logOnSuccess('Successfully find game', {gameId}))
      .catch(logOnError('', 'Failed to find game', {gameId}))
  },
  
  saveGame(updatedGame) {
    return GameRepository.findOneAndUpdate({gameId: updatedGame.gameId}, updatedGame.save())
      .then(logOnSuccess('Successfully save game', {gameId: updatedGame.gameId}))
      .catch(logOnError('', 'Failed to save game', {gameId: updatedGame.gameId}))
      .then((game) => this.findGame(game.gameId))
  },
  
  getStatus(gameId) {
    return this.findGame(gameId)
      .then((game) =>
        PlayerService.findPlayer(game.player1)
          .then((player1) =>
            PlayerService.findPlayer(game.player2)
              .then((player2) => ({game, player1, player2}))
              .catch(() => ({game, player1}))))
  },
  
  startGame({gameId, playerId}) {
    return this.findGame(gameId).then((game) => {
      if (game.player1 !== playerId) {
        throw new BadDataException(ChessError.CHESS602)
      }
      game.start()
      return this.saveGame(game)
    })
  },
  
  hostGame(values) {
    return PlayerService.createPlayer(values.name, values.player === 'COMPUTER' ? 'WHITE' : values.color)
      .then((player) => IdGenerator.generate(IdType.game)
        .then((gameId) => {
          const game = new Game(player.playerId, gameId)
          if (values.player === 'COMPUTER') {
            game.addPlayer(`${player.getOpponentColor()}_AI`)
            game.start()
          }
          return new GameRepository(game).save()
            .then((savedGame) => [savedGame, player])
        }))
      .then(logOnSuccess('Successfully created game', {values}))
      .catch(logOnError('', 'Failed to create game', {values}))
  },
  
  joinGame(values) {
    return this.findGame(values.roomNo)
      .then((game) => {
        if (game.player2) {
          throw new BadDataException(ChessError.CHESS601)
        }
        return PlayerService.getOpponentColor(game.player1)
          .then((color) => PlayerService.createPlayer(values.name, color))
          .then((player) =>
            this.saveGame(game.addPlayer(player.playerId))
              .then((updatedGame) => [updatedGame, player]))
          .then(logOnSuccess('Successfully joined game', {values}))
          .catch(logOnError('', 'Failed to join game', {values}))
      })
  },
  
  getPossibleMoves(gameId, player, square) {
    return this.findGame(gameId).then((game) => {
      if (player.color.toLowerCase().startsWith(game.turn)) {
        return game.chess.moves({square, verbose: true})
      }
      return []
    })
  },
  
  findGameBy(gameId, playerId) {
    return this.findGame(gameId).then((game) => {
      if (game.player1 !== playerId && game.player2 !== playerId) {
        throw new BadDataException(ChessError.CHESS604)
      }
      return game
    })
  },
  
  movePiece({gameId, playerId, player}, payload) {
    return this.findGameBy(gameId, playerId).then((game) => {
      if (player.color.toLowerCase().startsWith(game.turn)) {
        return this.saveGame(game.movePiece(payload))
          .then(logOnSuccess('Successfully moved piece', {gameId, playerId}))
          .catch(logOnError('', 'Failed to move piece', {gameId, playerId}))
      }
      throw new BadDataException(ChessError.CHESS605)
    })
      .then((game) => ({game, prevMove: payload}))
    
  }
  
})

export default GameService()
