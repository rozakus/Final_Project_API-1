const router = require('express').Router()

const {adminController} = require('../controllers')

router.get('/salesreport', adminController.salesReport)
router.get('/salesreppkg', adminController.salesRepPkg)
router.patch('/approvalpayment/:on', adminController.approvalPayment)
router.patch('/cancelpayment/:on', adminController.cancelPayment)
router.get('/transhistory', adminController.transHistory)
router.patch('/restock', adminController.reStock)
router.get('/totalSalesReport', adminController.TotalSalesReport)
router.get('/highestProfit', adminController.highestProfit)
router.get('/highestPkgSold', adminController.highestPkgSold)
router.patch('/reduceStock/:on', adminController.reduceStock)

module.exports = router