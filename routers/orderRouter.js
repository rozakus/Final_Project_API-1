const router = require('express').Router()
const { upload } = require('../helpers/multer')

const { orderController } = require('../controllers')

// setup uploader
const DESTINATION = './public/payment'
const uploadImage = upload(DESTINATION)

router.patch('/checkout/:on', orderController.checkOut)
router.post('/payment/:users_id/:order_number/:payment_type/:amount', uploadImage, orderController.payment)
router.post('/payment/upload/:order_number', uploadImage, orderController.paymentUpload)
router.get('/paymentMethod', orderController.paymentMethod)
router.post('/reduceStock', orderController.reduceStock)

module.exports = router