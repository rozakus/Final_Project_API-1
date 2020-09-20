const router = require('express').Router()

const { orderController } = require('../controllers')

router.post('/addtocartpcs', orderController.addToCartPcs)
router.post('/addtocartpkg', orderController.addToCartPkg)

module.exports = router