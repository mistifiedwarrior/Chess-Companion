import Player from './Player.js'

const WHITE = "WHITE"
const BLACK = "BLACK"


class Game {
  player1;
  player2;
  gameId;
  
  constructor(player, gameId) {
    this.player1 = player
    this.gameId = gameId
  }
  
  addPlayer(name) {
    this.player2 = new Player(name,)
    return this
  }
  
  getPlayer2Color() {
    return this.player1.color === WHITE ? BLACK : WHITE
  }
}

export default Game
