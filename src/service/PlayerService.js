import {IdGenerator, IdType} from './IdGenerator.js'
import Player from '../domain/Player.js'

const PlayerService = () => ({
  createPlayer(name, color) {
    return new Player(name, color, IdGenerator.generate(IdType.player))
  }
})

export default PlayerService()
