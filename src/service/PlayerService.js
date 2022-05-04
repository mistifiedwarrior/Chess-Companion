import {IdGenerator, IdType} from './IdGenerator.js'
import Player from '../domain/Player.js'
import PlayerRepository from '../repository/PlayerRepository.js'
import ChessError from '../exception/errorCodes.js'
import DataNotFoundException from '../exception/DataNotFoundException.js'
import {logOnError, logOnSuccess} from '../logger/logger.js'
import AIPlayer from '../domain/AIPlayer.js'

const PlayerService = () => ({
  createPlayer(name, color) {
    return IdGenerator.generate(IdType.player)
      .then((playerId) => new Player(name, color, playerId))
      .then((player) => new PlayerRepository(player).save())
      .then((player) => this.findPlayer(player.playerId))
      .then(logOnSuccess('Successfully created player', {name}))
      .catch(logOnError('', 'Failed to create player', {name}))
  },
  
  getOpponentColor(playerId) {
    return this.findPlayer(playerId).then((player) => player.getOpponentColor())
      .then(logOnSuccess('Successfully find opponent color', {playerId}))
      .catch(logOnError('', 'Failed to find opponent color', {playerId}))
  },
  
  findPlayer(playerId) {
    if (playerId.includes('AI')) {
      return new Promise((resolve) => {
        resolve(new AIPlayer('COMPUTER', playerId.split('_')[0], playerId))
      })
    }
    return PlayerRepository.findOne({playerId})
      .then((player) => {
        if (!player) {
          throw new DataNotFoundException(ChessError.CHESS603)
        }
        return Player.load(player)
      })
      .then(logOnSuccess('Successfully find player', {playerId}))
      .catch(logOnError('', 'Failed to find player', {playerId}))
  }
})

export default PlayerService()
