import express from 'express'
import gameController from '../controller/gameController.js'
import tournamentController from '../controller/tournamentController.js'

const router = express.Router()
router.use('/games', gameController)
router.use('/tournament', tournamentController)

export default router
