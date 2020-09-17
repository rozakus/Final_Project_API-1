// import module router
const router = require('express').Router()

// import controllers
const { orderController } = require('../controllers')

// create router
router.post('/order/pcs', orderController.orderPcs)

// export router
module.exports = router