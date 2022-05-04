import Player from './Player.js'
import {Chess} from 'chess.js'

class AIPlayer extends Player {
  // eslint-disable-next-line class-methods-use-this
  findNextMove(game) {
    const chess = new Chess(game.fen)
    const moves = chess.moves({verbose: true})
    return moves[Math.floor(Math.random() * moves.length)]
  }
}

export default AIPlayer

