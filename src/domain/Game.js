const WHITE = "WHITE"
const BLACK = "BLACK"


class Game {
  player1;
  player2;
  gameId;
  state;
  
  constructor(player, gameId) {
    this.player1 = player
    this.gameId = gameId
    this.state = "CREATED"
  }
  
  addPlayer(player) {
    this.player2 = player
    return this
  }
  
  getPlayer2Color() {
    return this.player1.color === WHITE ? BLACK : WHITE
  }
  
  start() {
    if (this.state === "CREATED")
      this.state = "STARTED"
    return this
  }
}

export default Game
