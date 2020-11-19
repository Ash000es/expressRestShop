const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const checkAuth = require('../Auth/checkAuthen')
const ordersController = require('../controllers/orders')

// get order route
router.get('/', checkAuth, ordersController.orders_GET_all)

// Post order route
router.post('/', checkAuth, ordersController.orders_POST_order)

// Get order By ID route
router.get('/:orderId', checkAuth, ordersController.orders_GET_singleOrder)

// Delete order by ID route
router.delete('/:orderId', checkAuth, ordersController.orders_DELETE_singleOrder)

module.exports = router

// const orderHotel={
//     orderId:,
//     adults: ,
//     children:,
//     boardCode: ,
//     boardName: ,
//     cancellationPolicies:,
//     checkinDate:,
//     checkoutDate:,
//     dailyRates:,
//     hotelName:,
//     mySellingRate:,
//     net:,
//     taxes:,
//     rateClass:,
//     rateCommentsId:,
//     rateKey:,
//     rateType:,
//     roomNumber:,
//     roomType:,
//     packaging;,
//     paymentType:,
// }

// const orderExtra={
//     orderId:,
//     extraName:,
//     extraPrice:,
//     extraSelectionNum:,
//     roomName:

// }
