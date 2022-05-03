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
      auditEvents.emit('audit', {gameId: this.gameId, event: START})
    }
    return this
  }
  
  movePiece(payload) {
    const move = this.chess.move(payload)
    this.updateGameState()
    if (move) {
      auditEvents.emit('audit', {gameId: this.gameId, move: payload, event: MOVE})
    }
    return this
  }
  
  updateGameState() {
    this.state = this.chess.in_check() ? "CHECK" : "STARTED"
    if (this.chess.game_over()) {
      this.state = "END"
      if (this.chess.in_checkmate())
        this.gameState = "CHECKMATE"
      if (this.chess.in_stalemate())
        this.gameState = "STALEMATE"
      if (this.chess.insufficient_material())
        this.gameState = "INSUFFICIENT MATERIAL"
      if (this.chess.in_draw())
        this.gameState = "DRAW"
      auditEvents.emit('audit', {gameId: this.gameId, event: END})
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
