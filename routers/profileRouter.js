const router = require('express').Router()

const { profileController } = require('../controllers')

router.get('/profile/:id', profileController.getProfile)

module.exports = router