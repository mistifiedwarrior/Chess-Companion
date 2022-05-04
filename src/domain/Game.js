import {Chess} from 'chess.js'
import {getSquare} from "../utils/utils.js";
import {auditEvents} from "../service/AuditService.js";
import {END, MOVE, START} from '../service/events/action.js'

class Game {
  player1;
  player2
  gameId
  state = "CREATED"
  gameState = ""
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
    if (this.state === "CREATED") {
      this.state = "STARTED"
      setTimeout(() => auditEvents.emit('audit', {gameId: this.gameId, event: START}), 2000)
    }
    return this
  }
  
  movePiece(payload) {
    const move = this.chess.move(payload)
    this.state = this.chess.in_check() ? "CHECK" : "STARTED"
    this.updateGameState()
    if (move) {
      auditEvents.emit('audit', {gameId: this.gameId, move: payload, event: MOVE})
    }
    return this
  }
  
  updateGameState() {
    if (this.chess.game_over()) {
      if (this.chess.in_checkmate())
        this.gameState = "CHECKMATE"
      if (this.chess.in_stalemate())
        this.gameState = "STALEMATE"
      if (this.chess.insufficient_material())
        this.gameState = "INSUFFICIENT MATERIAL"
      if (this.chess.in_draw())
        this.gameState = "DRAW"
      if (this.state !== "END") {
        auditEvents.emit('audit', {gameId: this.gameId, event: END})
      }
      this.state = "END"
    }
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
    game.updateGameState()
    return game
  }
  
  save() {
    this.fen = this.chess.fen()
    return this
  }
}

export default Game
