const userController = require('./userController');
const productController = require('./productController')
const productCateController = require('./produkCateController')
const cartController = require('./cartController')
const orderController = require('./orderController')
const adminController = require('./adminController')

//export all controllers
module.exports = {
    userController,
    productController,
    productCateController,
    cartController,
    orderController,
    adminController
}