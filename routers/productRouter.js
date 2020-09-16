const router = require('express').Router();

// import controller
const {productController} = require('../controllers')

// create router
router.get('/getAllProducts', productController.getAllProducts)
router.get('/getProduct/:id', productController.getDetailProduct)
router.get('/getAllPackages', productController.getAllPackages)
router.get('/getPackage/:id', productController.getDetailPackage)

module.exports = router