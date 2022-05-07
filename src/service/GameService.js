import Game from '../domain/Game.js'
import BadDataException from '../exception/BadDataException.js'
import ChessError from '../exception/errorCodes.js'
import PlayerService from './PlayerService.js'
import GameRepository from '../repository/GameRepository.js'
import {IdGenerator, IdType} from './IdGenerator.js'
import DataNotFoundException from '../exception/DataNotFoundException.js'
import {logOnError, logOnSuccess} from '../logger/logger.js'
import Games from '../domain/Games.js'

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
  
  getStatus({game, player1, player2}) {
    if (!player2 && game.player2) {
      return Games.getPlayer(game.player2)
        .then((updatedPlayer2) => ({game, player1, player2: updatedPlayer2}))
    }
    return new Promise((resolve) => {
      resolve({game, player1, player2})
    })
  },
  
  startGame({game, playerId}) {
    if (game.player1 !== playerId) {
      throw new BadDataException(ChessError.CHESS602)
    }
    game.start()
    return this.saveGame(game)
  },
  
  hostGame(values) {
    return PlayerService.createPlayer({name: values.name}, values.color)
      .then((player) => IdGenerator.generate(IdType.game)
        .then((gameId) => new GameRepository(new Game(player.playerId, gameId)).save()
          .then((savedGame) => [savedGame, player])))
      .then(logOnSuccess('Successfully created game', {values}))
      .catch(logOnError('', 'Failed to create game', {values}))
      .then(([game, player]) => {
        if (values.player === 'COMPUTER') {
          return this.joinGame(Object.assign(values, {name: 'COMPUTER', roomNo: game.gameId}))
            .then(() => Games.getGame(game.gameId, player.playerId))
            .then((gameStatus) => this.startGame({game: gameStatus, playerId: player.playerId}))
            .then((updatedGame) => [updatedGame, player])
        }
        return [game, player]
      })
  },
  
  joinGame(values) {
    return this.findGame(values.roomNo)
      .then((game) => {
        if (game.player2) {
          throw new BadDataException(ChessError.CHESS601)
        }
        return PlayerService.getOpponentColor(game.player1)
          .then((color) => PlayerService.createPlayer(values, color))
          .then((player) => {
            Games.addPlayer2(game.gameId, player.playerId).then()
            return this.saveGame(game.addPlayer(player.playerId))
              .then((updatedGame) => [updatedGame, player])
          })
          .then(logOnSuccess('Successfully joined game', {values}))
          .catch(logOnError('', 'Failed to join game', {values}))
      })
  },
  
  getPossibleMoves(game, player, square) {
    if (player.isMyTurn(game.turn)) {
      return game.chess.moves({square, verbose: true})
    }
    return []
  },
  
  movePiece({game, playerId, player}, payload) {
    if (player.isMyTurn(game.turn)) {
      return this.saveGame(game.movePiece(payload))
        .then(logOnSuccess('Successfully moved piece', {gameId: game.gameId, playerId}))
        .catch(logOnError('', 'Failed to move piece', {gameId: game.gameId, playerId}))
        .then(() => ({game, prevMove: payload}))
    }
    throw new BadDataException(ChessError.CHESS605)
  }
})

export default GameService()
