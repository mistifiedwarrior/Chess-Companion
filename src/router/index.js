import express from 'express'
import gameController from '../controller/gameController.js'

const router = express.Router()
router.use('/games', gameController)

export default router
