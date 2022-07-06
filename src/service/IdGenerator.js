import SequenceRepository from '../repository/IdSequenceRepository.js'
import {logOnError, logOnSuccess} from '../logger/logger.js'

const IdGenerator = {
  generate(idType) {
    return SequenceRepository.findOne({idType: idType.name})
      .then((sequence) => {
        if (!sequence) {
          const newSequence = new SequenceRepository({idType: idType.name, id: 1})
          return newSequence.save()
        }
        return SequenceRepository.findOneAndUpdate({idType: idType.name}, {id: sequence.id + 1})
      })
      .then((sequence) => sequence.id.toString().padStart(idType.length, '0'))
      .then(logOnSuccess('Successfully created new id', {idType}))
      .catch(logOnError('', 'Failed to create new id', {idType}))
  }
}

const IdType = {
  game: {length: 4, name: 'game'},
  player: {length: 6, name: 'player'},
  user: {length: 12, name: 'user'},
  tournament: {length: 8, name: 'tournament'}
}

export {IdType, IdGenerator}
