const express = require('express')
const router = express.Router()
const checkAuth = require('../Auth/checkAuthen')
const userController = require('../controllers/users')
const isNotverified = require('../Auth/isNotVerified')

// get user route
router.get('/', userController.users_GET_user)

// Sign up route
router.post('/signup', userController.users_CREATE_user)

// LOGIN route
router.post('/login', isNotverified, userController.users_LOGIN_user)
// verify email
router.get('/verify-email', userController.users_Verify_user)

// Delete USER by ID route
router.delete('/:userId', checkAuth, userController.users_DELETE_user)

module.exports = router
