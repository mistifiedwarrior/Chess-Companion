import {EventEmitter} from 'events'
import {logOnError, logOnSuccess} from '../logger/logger.js'
import AuditRepository from '../repository/AuditRepository.js'
import Audit from '../domain/Audit.js'
import {LOG} from './events/action.js'
import PlayerService from './PlayerService.js'

const AuditService = () => ({
  broadcast: () => ({}),
  findAudit(gameId) {
    return AuditRepository.findOne({gameId})
      .then((audit) => {
        if (!audit) {
          return new AuditRepository(new Audit(gameId)).save()
            .then((logs) => Audit.load(logs))
        }
        return Audit.load(audit)
      })
      .then(logOnSuccess('Successfully find audit', {gameId}))
      .catch(logOnError('', 'Failed to find audit', {gameId}))
  },
  
  save(audit) {
    return new AuditRepository(audit).save()
  },
  
  updateLog({game, event, move}) {
    return PlayerService.findPlayer(game.player1)
      .then((player1) => PlayerService.findPlayer(game.player2)
        .then((player2) =>
          game.state !== 'END' && this.findAudit(game.gameId)
            .then((audit) => {
              const audits = audit.addLog({event, move, game, player1, player2})
              AuditRepository.findOneAndUpdate({gameId: game.gameId}, {$set: audits})
                .then(() => setTimeout(this.broadcast, 100, LOG, audits))
            })))
  },
  
  broadcastLog(broadcast) {
    this.broadcast = broadcast
  }
})

const auditService = AuditService()
const auditEvents = new EventEmitter()

auditEvents.on('audit', (args) => auditService.updateLog(args))

export {auditEvents}
export default auditService
