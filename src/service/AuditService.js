import {EventEmitter} from 'events'
import {logOnError, logOnSuccess} from '../logger/logger.js'
import AuditRepository from '../repository/AuditRepository.js'
import Audit from '../domain/Audit.js'
import GameService from './GameService.js'
import {LOG} from './events/action.js'

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
  
  updateLog({gameId, event, move}) {
    return GameService.getStatus(gameId)
      .then(({game, player1, player2}) => this.findAudit(gameId)
        .then((audit) => {
          const audits = audit.addLog({event, move, game, player1, player2})
          AuditRepository.findOneAndUpdate({gameId}, {$set: audits})
            .then(() => setTimeout(this.broadcast, 100, LOG, audits))
        }))
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
