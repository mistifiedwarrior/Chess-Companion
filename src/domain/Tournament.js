const createScores = (teams) => teams.map(team => ({team}))

class Tournament {
  tournamentId
  state = 'CREATED'
  tournamentName
  scores
  games
  teams

  constructor(tournamentId, tournamentName, teams) {
    this.tournamentId = tournamentId
    this.tournamentName = tournamentName
    this.teams = teams.slice()
    this.games = []
    this.scores = createScores(teams)
  }

  start() {
    if (this.state === 'CREATED') {
      this.state = 'STARTED'
    }
    return this
  }

  updateGames(games) {
    this.games = games
    return this
  }

  static load(loadTournament) {
    const tournament = new Tournament()
    tournament.tournamentName = loadTournament.tournamentName
    tournament.state = loadTournament.state
    tournament.teams = loadTournament.teams
    tournament.scores = loadTournament.scores
    tournament.games = loadTournament.games
    return tournament
  }
}

export default Tournament
