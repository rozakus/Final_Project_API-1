const router = require('express').Router()
const { upload } = require('../helpers/multer')

const {packageController} = require('../controllers')

// setup uploader
const DESTINATION = './public/package'
const uploadImage = upload(DESTINATION)

router.post('/addNewPackage', packageController.addPackage)
router.post('/postImgPkg/:id', uploadImage, packageController.uploadImgPkg)

module.exports = router