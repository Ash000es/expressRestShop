const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../Auth/checkAuthen')
const attachUser = require('../Auth/attachUser')
const ordersController = require('../controllers/orders')
const requireAdmin = require('../Auth/requireAdmin')


// get order route
router.get('/', checkAuth, ordersController.orders_GET_all)

// Post order route
router.post('/', ordersController.orders_POST_order)

// Get order By ID route
router.get('/:orderId', checkAuth, requireAdmin, ordersController.orders_GET_singleOrder)

// Delete order by ID route
router.delete('/:orderId', checkAuth, ordersController.orders_DELETE_singleOrder)

module.exports = router
