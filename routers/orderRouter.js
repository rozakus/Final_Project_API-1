// import module router
const router = require('express').Router()

// import controllers
const { orderController } = require('../controllers')

// create router
router.post('/order', orderController.order)

// export router
module.exports = router