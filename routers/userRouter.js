const router = require('express').Router();
const { validator, validatePassword } = require('../helpers/validator');
const { verify, verify2 } = require('../helpers/jwt');

//import controller
const { userController } = require('../controllers');

//create router
router.get('/users', userController.getUserData);
router.post('/register', validator,userController.register);
router.post('/login', userController.login);
router.post('/keeplogin', verify, userController.keeplogin);
router.get('/verification/:token', verify2, userController.emailVerification);
router.patch('/editaddress/:id', userController.editAddress);
router.patch('/editpass/:id', validatePassword, userController.editPass);
router.get('/purchasedhistory/:id', userController.purchasedHistory);

//export router
module.exports = router;