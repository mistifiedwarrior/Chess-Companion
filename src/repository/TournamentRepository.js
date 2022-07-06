import mongoose from 'mongoose'

const tournamentSchema = new mongoose.Schema({
  tournamentId: {type: String, trim: true, required: true, unique: true},
  tournamentName: {type: String, trim: true, required: true},
  teams: [{type: String, required: true}],
  games: [{
    name: {type: String, required: true},
    team1: {type: String, required: true},
    team2: {type: String, required: true},
    gameId: {type: String, required: true}
  }],
  scores: [{
    team: {type: String, required: true},
    win: {type: Number, required: true, default: 0},
    loss: {type: Number, required: true, default: 0},
    draw: {type: Number, required: true, default: 0},
    timeRate: {type: Number, required: true, default: 0}
  }],
  state: {type: String, trim: true, required: true, default: 'CREATED'},
  createdAt: {type: Date, default: new Date()}
})

const TournamentRepository = mongoose.model('Tournament', tournamentSchema)
export default TournamentRepository
