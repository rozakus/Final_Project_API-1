const router = require('express').Router()

const { cartController } = require('../controllers')

router.get('/getusercart/:id', cartController.getCart)
router.post('/addtocartpcs', cartController.addToCartPcs)
router.post('/addtocartpkg', cartController.addToCartPkg)
router.patch('/editqtypcs', cartController.editQtyPcs)
router.delete('/deletepcs', cartController.deletePcs)
router.delete('/deletepkg', cartController.deletePkg)

module.exports = router