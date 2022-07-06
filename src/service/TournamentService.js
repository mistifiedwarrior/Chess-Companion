import axios from 'axios'
import {logOnError, logOnSuccess} from '../logger/logger.js'
import TournamentRepository from '../repository/TournamentRepository.js'
import Tournament from '../domain/Tournament.js'
import {IdGenerator, IdType} from './IdGenerator.js'

const clientID = 'e9f84b255e58a48cdf94'
const clientSecret = '4e023a76b4556aae0b07b613490cab288bad2685'


const createGames = async (teams) => {
  const games = []
  for (let i = 0; i < teams.length; i += 2) {
    games.push({
      name: `Game ${games.length + 1}`,
      team1: teams[i],
      team2: teams[i + 1] || teams[0],
      gameId: await IdGenerator.generate(IdType.game)
    })
  }
  for (let i = 1; i < teams.length; i += 2) {
    games.push({
      name: `Game ${games.length + 1}`,
      team1: teams[i],
      team2: teams[i + 1] || teams[0],
      gameId: await IdGenerator.generate(IdType.game)
    })
  }
  const otherGames = ['Qualifier 1', 'Eliminator', 'Qualifier 2', 'Final']
  for (let i = 0; i < otherGames.length; i++) {
    games.push({
      name: otherGames[i],
      team1: 'TBD',
      team2: 'TBD',
      gameId: await IdGenerator.generate(IdType.game)
    })
  }
  return games
}


// eslint-disable-next-line max-lines-per-function
const TournamentService = () => ({
  login({code}) {
    return axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${code}`,
      headers: {accept: 'application/json'}
    }).then((response) => {
      const accessToken = response.data.access_token
      return axios('https://api.github.com/user', {headers: {Authorization: `token ${accessToken}`}})
        .then(({data}) => data)
    })
  },

  findTournament(tournamentId) {
    return TournamentRepository.findOne({tournamentId})
      .then(Tournament.load)
      .then(logOnSuccess('Successfully find tournament', {tournamentId}))
      .catch(logOnError('', 'Failed to find tournament', {tournamentId}))
  },

  create({tournamentName, teams}) {
    return IdGenerator.generate(IdType.tournament)
      .then((tournamentId) => new TournamentRepository(new Tournament(tournamentId, tournamentName, teams)).save())
      .then(logOnSuccess('Successfully created tournament', {tournamentName}))
      .catch(logOnError('', 'Failed to create tournament', {tournamentName}))
  },

  start(tournamentId) {
    return this.findTournament(tournamentId)
      .then((tournament) => {
        const games = createGames(tournament.teams)
        tournament.start()
        return this.saveTournament(tournament.updateGames(games))
      })
  },

  saveTournament(tournament) {
    return TournamentRepository.findOneAndUpdate({tournamentId: tournament.tournamentId}, tournament)
  },
  getAllTournaments() {
    return TournamentRepository.find({})
  }
})

export default TournamentService()
