const { body } = require('express-validator')

const validator = [
    body('username')
    .notEmpty()
    .withMessage('username is required.')
    .isLength({ min : 6 })
    .withMessage('username must have min 6 characters.'),
    body('email')
    .notEmpty()
    .withMessage('email is required.')
    .isEmail()
    .withMessage('email doesn\'t valid'),
    body('password')
    .notEmpty()
    .withMessage('password is required.')
    .matches(/[!@#$%^&*;]/)
    .withMessage('password must include special characters.')
    .matches(/[0-9]/)
    .withMessage('password must include number.')
    .isLength({ min : 6 })
    .withMessage('password must have min 6 characters.')
]

const validatePassword = [
    body('oldpass')
    .notEmpty()
    .withMessage('old password is required.'),
    body('newpass')
    .notEmpty()
    .withMessage('new password is required.')
    .matches(/[!@#$%^&*;]/)
    .withMessage('password must include special characters.')
    .matches(/[0-9]/)
    .withMessage('password must include number.')
    .isLength({ min : 6 })
    .withMessage('password must have min 6 characters.'),
    body('confpass')
    .notEmpty()
    .withMessage('new conf password is required.')
]

module.exports = { validator, validatePassword }