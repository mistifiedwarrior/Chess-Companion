import mongoose from 'mongoose'

const playerSchema = new mongoose.Schema({
  playerId: {type: String, trim: true, required: true, unique: true},
  name: {type: String, required: true},
  color: {type: String, required: true},
  createdAt: {type: Date, default: new Date()}
})

const PlayerRepository = mongoose.model('Player', playerSchema)
export default PlayerRepository
