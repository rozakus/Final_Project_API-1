const router = require('express').Router()

const { cartController } = require('../controllers')

router.get('/getusercart/:id', cartController.getCart)
router.post('/addtocartpcs', cartController.addToCartPcs)
router.post('/addtocartpkg', cartController.addToCartPkg)
router.patch('/editqtypcs', cartController.editQtyPcs)
router.delete('/deletepcs/:order_number/:product_id', cartController.deletePcs)
router.delete('/deletepkg/:order_number/:package_id/:package_no', cartController.deletePkg)

module.exports = router