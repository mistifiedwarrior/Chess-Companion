import {Chess} from 'chess.js'
import {getSquare} from "../utils/utils.js";

class Game {
  player1;
  player2
  gameId
  state = "CREATED"
  createdAt = new Date()
  chess
  fen
  turn
  
  constructor(playerId, gameId) {
    this.player1 = playerId
    this.gameId = gameId
    this.chess = new Chess()
    this.fen = this.chess.fen()
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
  
  movePiece(payload) {
    this.chess.move(payload)
    return this
  }
  
  static loadGame(loadGame) {
    const game = new Game()
    game.gameId = loadGame.gameId
    game.state = loadGame.state
    game.player1 = loadGame.player1
    game.player2 = loadGame.player2
    game.fen = loadGame.fen
    game.chess.load(game.fen)
    game.createdAt = loadGame.createdAt
    game.board = game.chess.board().map((row, rowNo) => row.map((col, colNo) => col ? col : {square: getSquare(rowNo, colNo)}))
    game.turn = game.chess.turn()
    return game
  }
  
  save() {
    this.fen = this.chess.fen()
    return this
  }
}

export default Game
