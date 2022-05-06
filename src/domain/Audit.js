import {END, MOVE, START} from "../service/events/action.js";
import Games from "./Games.js";

const pieces = {
  p: 'PAWN',
  q: 'QUEEN',
  k: 'KING',
  r: 'ROOK',
  b: 'BISHOP',
  n: 'KNIGHT'
}

const getState = (game, player1, player2) => {
  const currentPlayer = player1.color.toLowerCase().startsWith(game.turn) ? player1 : player2
  const opponent = currentPlayer === player1 ? player2 : player1
  switch (game.state) {
    case 'CHECKMATE':
      return `${currentPlayer.name} has Won the game!!!`
    case 'STALEMATE':
      return `${opponent.name} has Won the game!!!`
    case  'INSUFFICIENT MATERIAL':
    case 'DRAW' :
      return 'Game Draw'
    default:
      return ''
  }
}

class Audit {
  gameId;
  logs
  
  constructor(gameId, logs = []) {
    this.gameId = gameId
    this.logs = logs
  }
  
  static load(audit) {
    return new Audit(audit.gameId, audit.logs)
  }
  
  async addLog({game, event, move}) {
    const player1 = await Games.getPlayer(game.player1)
    const player2 = await Games.getPlayer(game.player2)
    switch (event) {
      case START:
        this.logs = [...this.logs, `Game has started`]
        break
      case END:
        this.logs = [...this.logs, `Game has ended with ${game.gameState}. ${getState(game, player1, player2)}`]
        break
      case MOVE:
        const player = player1.isMyTurn(move.color) ? player1 : player2
        this.logs = [...this.logs, `${player.name}(${player.color}) has moved ${pieces[move.piece]} from ${move.from} to ${move.to}.${move.captured ? ` Captured ${pieces[move.captured]}.` : ""}${move.promotion ? ` Promoted to ${pieces[move.promotion]}.` : ""}`]
        break
      default:
        break
    }
    return this
  }
}

export default Audit
