const userRouter = require('./userRouter');
const productRouter = require('./productRouter');
const productCateRouter = require('./productCateRouter');
const cartRouter = require('./cartRouter')
const orderRouter = require('./orderRouter')
const adminRouter = require('./adminRouter')
const profileRouter = require('./profileRouter');
const packageRouter = require('./packageRouter');

module.exports = { 
    userRouter,
    productRouter,
    productCateRouter,
    cartRouter,
    orderRouter,
    adminRouter,
    profileRouter,
    packageRouter
 };