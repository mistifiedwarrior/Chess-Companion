const WHITE = 'WHITE'
const BLACK = 'BLACK'

class Player {
  constructor(player, color, playerId) {
    this.name = player
    this.color = color
    this.playerId = playerId
  }
  
  static load(loadPlayer) {
    const player = new Player()
    player.name = loadPlayer.name
    player.color = loadPlayer.color
    player.playerId = loadPlayer.playerId
    return player
  }
  
  getOpponentColor() {
    return this.color === WHITE ? BLACK : WHITE
  }
}

export default Player

