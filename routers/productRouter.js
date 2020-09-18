const router = require('express').Router();

// import controller
const {productController} = require('../controllers')

// create router
router.get('/getAllProducts', productController.getAllProducts)
router.get('/getProduct/:id', productController.getProductById)
router.get('/getProdPriceAsc', productController.getProductPriceAsc)
router.get('/getProdPriceDesc', productController.getProductPriceDesc)
router.get('/getProdCate2/:id', productController.getProdCateLv2)
router.get('/getProdCate3/:id', productController.getProdCateLv3)
router.get('/getAllPackages', productController.getAllPackages)
router.get('/getPackage/:id', productController.getPackageById)

module.exports = router