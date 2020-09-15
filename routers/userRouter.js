const router = require('express').Router();
const { validator, validatePassword } = require('../helpers/validator');
const { verify } = require('../helpers/jwt');

//import controller
const { userController } = require('../controllers');

//create router
router.get('/users', userController.getUserData);
router.post('/register', validator,userController.register);
router.post('/login', userController.login);
router.post('/keeplogin', verify, userController.keeplogin);

//export router
module.exports = router;