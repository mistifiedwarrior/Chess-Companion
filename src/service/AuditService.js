import {EventEmitter} from 'events'
import {logOnError, logOnSuccess} from '../logger/logger.js'
import AuditRepository from '../repository/AuditRepository.js'
import Audit from '../domain/Audit.js'
import {LOG} from './events/action.js'
import Games from '../domain/Games.js'

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
    return Games.getAudit(game.gameId)
      .then((audit) => audit.addLog({event, move, game}))
      .then((audits) => AuditRepository.findOneAndUpdate({gameId: game.gameId}, {$set: audits})
        .then(() => this.broadcast(LOG, audits)))
  },

  broadcastLog(broadcast) {
    this.broadcast = broadcast
  }
})

const auditService = AuditService()
const auditEvents = new EventEmitter()

auditEvents.on('audit', (args) => auditService.updateLog(args).catch())

export {auditEvents}
export default auditService
