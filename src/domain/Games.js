import GameService from "../service/GameService.js";
import AIPlayer from "./AIPlayer.js";
import PlayerService from "../service/PlayerService.js";
import AuditService from "../service/AuditService.js";

class Games {
  games;
  players
  audits
  
  constructor() {
    this.games = []
    this.players = []
    this.audits = []
  }
  
  async getAudit(gameId) {
    const audit = this.audits.find((p) => p.gameId === gameId)
    if (!audit) {
      const newAudit = await AuditService.findAudit(gameId).catch()
      this.audits.push(newAudit)
      return newAudit
    }
    return audit
  }
  
  async getPlayer(playerId) {
    if (playerId.includes('AI')) {
      return new AIPlayer('COMPUTER', playerId.split('_')[0], playerId)
    }
    const player = this.players.find((p) => p.playerId === playerId)
    if (!player) {
      const newPlayer = await PlayerService.findPlayer(playerId).catch()
      this.players.push(newPlayer)
      return newPlayer
    }
    return player
  }
  
  async getGame(gameId) {
    const game = this.games.find((gameStatus) => gameStatus.gameId === gameId)
    if (!game || !game.player1 || !game.player2) {
      const newGame = await GameService.findGame(gameId).catch()
      this.games = this.games.filter(({gameId: id}) => gameId !== id)
      this.games.push(newGame)
      return newGame
    }
    return game
  }
  
  async addPlayer2(gameId, playerId) {
    const game = await this.getGame(gameId)
    game.addPlayer(playerId)
  }
}

class Singleton {
  singleton;
  
  get() {
    if (!this.singleton) {
      this.singleton = new Games()
    }
    return this.singleton
  }
}

export default new Singleton().get()
