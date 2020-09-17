const router = require('express').Router()

const {productCateController} = require('../controllers')

router.get('/getLvl2Cate', productCateController.getLv2Cate)
router.get('/getLvl3Cate', productCateController.getLv3Cate)
router.get('/getProdLvl2Cate/:id', productCateController.getProductByLv2Cate)
router.get('/getProdLvl3Cate/:id', productCateController.getProductByLv3Cate)

module.exports = router