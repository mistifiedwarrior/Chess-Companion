import mongoose from 'mongoose'

const auditSchema = new mongoose.Schema({
  gameId: {type: String, trim: true, required: true, unique: true},
  logs: [{type: String}]
})

const AuditRepository = mongoose.model('Audit', auditSchema)
export default AuditRepository
