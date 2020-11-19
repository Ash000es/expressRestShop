const express = require('express')
const router = express.Router()
const checkAuth = require('../Auth/checkAuthen')
const userController = require('../controllers/users')

// get user route
router.get('/', userController.users_GET_user)

// Post user route
router.post('/signup', userController.users_CREATE_user)

// Get order By ID route
router.post('/login', userController.users_LOGIN_user)

// Delete order by ID route
router.delete('/:userId',checkAuth, userController.users_DELETE_user)

module.exports = router
