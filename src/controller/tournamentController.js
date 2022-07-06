import express from 'express'
import {handleError} from '../utils/errorHandlers.js'
import TokenService from '../service/TokenService.js'
import TournamentService from '../service/TournamentService.js'

const adminRoles = ['shiviraj', 'mistifiedwarrior']

const tournamentController = express.Router()

tournamentController.post('/login', (req, res) => {
  const customError = {code: '', message: 'Failed to login'}
  TournamentService.login(req.body)
    .then((data) => {
      const user = {...data, role: adminRoles.includes(data.login) ? 'ADMIN' : 'USER'}
      const token = TokenService.createToken(user)
      res.send({user, token})
    })
    .catch((error) => handleError(res, error, customError))
})

tournamentController.use((req, res, next) => {
  try {
    req.tournamentUser = TokenService.parseToken(req.headers.tournamentauth)
    next()
  } catch (error) {
    res.sendStatus(401)
  }
})

tournamentController.get('/validate', (req, res) => {
  res.send(req.tournamentUser)
})

tournamentController.post('', (req, res) => {
  if (req.tournamentUser.role !== 'ADMIN') {
    const customError = {code: '', message: 'User is not authorized to create tournament'}
    return handleError(res, undefined, customError)
  }
  const customError = {code: '', message: 'Failed to create tournament'}
  TournamentService.create(req.body)
    .then((data) => res.send(data))
    .catch((error) => handleError(res, error, customError))
})

tournamentController.get('', (req, res) => {
  const customError = {code: '', message: 'Failed to fetch tournaments'}
  TournamentService.getAllTournaments()
    .then((data) => res.send(data))
    .catch((error) => handleError(res, error, customError))
})

export default tournamentController
