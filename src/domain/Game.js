import {Chess} from 'chess.js'

class Game {
  player1;
  player2
  gameId
  state = "CREATED"
  createdAt = new Date()
  chess
  
  constructor(playerId, gameId) {
    this.player1 = playerId
    this.gameId = gameId
    this.chess = new Chess()
  }
  
  addPlayer(player) {
    this.player2 = player
    return this
  }
  
  start() {
    if (this.state === "CREATED")
      this.state = "STARTED"
    return this
  }
  
  static loadGame(loadGame) {
    const game = new Game()
    game.gameId = loadGame.gameId
    game.state = loadGame.state
    game.player1 = loadGame.player1
    game.player2 = loadGame.player2
    game.createdAt = loadGame.createdAt
    game.board = game.chess.board()
    return game
  }
}

export default Game
