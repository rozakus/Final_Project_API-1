const router = require('express').Router()

const { cartController } = require('../controllers')

router.get('/getusercart/:id', cartController.getCart)
router.post('/addtocartpcs', cartController.addToCartPcs)
router.post('/addtocartpkg', cartController.addToCartPkg)
router.patch('/editqtypcs', cartController.editQtyPcs)

module.exports = router