const router = require('express').Router()

const { orderController } = require('../controllers')

router.patch('/checkout/:on', orderController.checkOut)
router.post('/payment', orderController.payment)
router.get('/paymentMethod', orderController.paymentMethod)

module.exports = router