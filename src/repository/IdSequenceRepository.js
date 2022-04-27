import mongoose from 'mongoose'

const sequenceSchema = new mongoose.Schema({
  idType: {type: String, trim: true, required: true, unique: true},
  id: {type: Number, required: true}
})

const SequenceRepository = mongoose.model('Sequence', sequenceSchema)
export default SequenceRepository
