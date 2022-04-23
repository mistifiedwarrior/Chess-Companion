import Game from '../domain/Game.js'
import {IdGenerator, IdType} from './IdGenerator.js'
import BadDataException from '../exception/BadDataException.js'
import ChessError from '../exception/errorCodes.js'
import PlayerService from './PlayerService.js'

const GameService = () => ({
  games: [],
  initGame(values) {
    if (values.type === 'HOST') {
      const game = new Game(PlayerService.createPlayer(values.name, values.color), IdGenerator.generate(IdType.game))
      this.games.push(game)
      console.log(game)
      return [game, game.player1]
    }
    const currentGame = this.findGame(values.roomNo)
    if (currentGame.player2) {
      throw new BadDataException(ChessError.CHESS601)
    }
    const color = currentGame.getPlayer2Color()
    currentGame.addPlayer(PlayerService.createPlayer(values.name, color))
    return [currentGame, currentGame.player2]
  },
  
  findGame(gameId) {
    const currentGame = this.games.find((game) => game.gameId === gameId)
    if (!currentGame) {
      throw new BadDataException(ChessError.CHESS600)
    }
    return currentGame
  }
})

export default GameService()
