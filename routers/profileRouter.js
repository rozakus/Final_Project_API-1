const router = require('express').Router()
const { upload } = require('../helpers/multer')

const { profileController } = require('../controllers')

// setup uploader
const DESTINATION = './public/profile'
const uploadImage = upload(DESTINATION)

router.get('/profile/:id', profileController.getProfile)
router.post('/profile/upload/:id', uploadImage, profileController.uploadProfile)

module.exports = router