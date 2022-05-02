import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  gameId: {type: String, trim: true, required: true, unique: true},
  player1: {type: String, required: true},
  player2: {type: String},
  state: {type: String, trim: true, required: true},
  fen: {type: String, trim: true, required: true},
  gameState: {type: String, trim: true},
  createdAt: {type: Date, default: new Date()}
})

const GameRepository = mongoose.model('Game', gameSchema)
export default GameRepository
