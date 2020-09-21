const router = require('express').Router()

const {adminController} = require('../controllers')

router.get('/salesreport', adminController.salesReport)
router.get('/salesreppkg', adminController.salesRepPkg)
router.patch('/approvalpayment/:on', adminController.approvalPayment)
router.patch('/cancelpayment/:on', adminController.cancelPayment)
router.patch('/transhistory', adminController.transHistory)

module.exports = router