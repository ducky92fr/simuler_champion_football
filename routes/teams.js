const express = require ('express')
const router = express.Router()
const teamsController = require('../controller/teamsController')

router.post('/create',teamsController.generateTeam)

module.exports = router