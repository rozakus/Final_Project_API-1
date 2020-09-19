const router = require('express').Router()

const { orderController } = require('../controllers')

router.post('/addtocartpcs', orderController.addToCartPcs)

module.exports = router