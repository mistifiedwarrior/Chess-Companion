import Player from './Player.js'
import {Chess} from 'chess.js'
import {
  bishopEvalBlack,
  bishopEvalWhite,
  evalQueen,
  kingEvalBlack,
  kingEvalWhite,
  knightEval,
  pawnEvalBlack,
  pawnEvalWhite,
  rookEvalBlack,
  rookEvalWhite
} from '../utils/tables.js'

const WHITE = 'w'

class AIPlayer extends Player {

  evaluateBoard(chess) {
    const evaluatedScore = chess.board().reduce((score, row, rowNo) => row.reduce((totalScore, piece, colNo) => totalScore + this.getPieceValue(piece, rowNo, colNo), score), 0)
    return this.isMyTurn(chess.turn) ? evaluatedScore : -evaluatedScore
  }

  findNextMove(game) {
    const chess = new Chess(game.fen)
    return this.minimaxRoot(chess, 3, true)
  }

  // eslint-disable-next-line max-params,max-statements
  minimax(chess, depth, isMax, alpha, beta) {
    if (depth === 0) {
      return -this.evaluateBoard(chess)
    }

    const moves = chess.moves({verbose: true})

    if (isMax) {
      let bestScore = -9999
      for (const move of moves) {
        chess.move(move)
        const score = this.minimax(chess, depth - 1, !isMax, alpha, beta)
        chess.undo()
        bestScore = Math.max(score, bestScore)
        // eslint-disable-next-line no-param-reassign
        alpha = Math.max(alpha, bestScore)
        if (alpha >= beta) {
          return bestScore
        }
      }
      return bestScore
    }
    let bestScore = 9999
    for (const move of moves) {
      chess.move(move)
      const score = this.minimax(chess, depth - 1, !isMax, alpha, beta)
      chess.undo()
      bestScore = Math.min(score, bestScore)
      // eslint-disable-next-line no-param-reassign
      beta = Math.min(beta, bestScore)
      if (alpha >= beta) {
        return bestScore
      }
    }
    return bestScore
  }

  // eslint-disable-next-line class-methods-use-this,max-statements
  minimaxRoot(chess, depth, isMax) {
    const moves = chess.moves({verbose: true})
    let bestScore = -9999
    let bestMove = null
    for (const move of moves) {
      chess.move(move)
      const score = this.minimax(chess, depth - 1, !isMax, -10000, 10000)
      chess.undo()
      if (score > bestScore) {
        bestMove = move
        bestScore = score
      }
    }
    return bestMove || moves[0]
  }

  // eslint-disable-next-line class-methods-use-this
  getPieceValue(piece, rowNo, colNo) {
    if (piece === null) {
      return 0
    }

    const score = this.getAbsoluteValue(piece, piece.color === WHITE, rowNo, colNo)
    return piece.color === WHITE ? score : -score
  }

  // eslint-disable-next-line class-methods-use-this,max-params
  getAbsoluteValue(piece, isWhite, rowNo, colNo) {
    if (piece.type === 'p') {
      return 10 + (isWhite ? pawnEvalWhite[colNo][rowNo] : pawnEvalBlack[colNo][rowNo])
    } else if (piece.type === 'r') {
      return 50 + (isWhite ? rookEvalWhite[colNo][rowNo] : rookEvalBlack[colNo][rowNo])
    } else if (piece.type === 'n') {
      return 30 + knightEval[colNo][rowNo]
    } else if (piece.type === 'b') {
      return 30 + (isWhite ? bishopEvalWhite[colNo][rowNo] : bishopEvalBlack[colNo][rowNo])
    } else if (piece.type === 'q') {
      return 90 + evalQueen[colNo][rowNo]
    } else if (piece.type === 'k') {
      return 900 + (isWhite ? kingEvalWhite[colNo][rowNo] : kingEvalBlack[colNo][rowNo])
    }
    return 0
  }
}

export default AIPlayer
