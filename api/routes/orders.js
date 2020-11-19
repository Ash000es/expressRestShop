const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')

// get order route
router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')
    .populate('product')
    .exec()
    .then((docs) => {
      if (docs.length >= 0) {
        const modifiedDocs = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: 'GET',
                url: 'http://localhost:5000/orders/' + doc._id,
              },
            }
          }),
        }
        res.status(200).json(modifiedDocs)
      } else {
        res.status(404).json({
          message: 'no items found',
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err,
      })
    })
})

// Post order route
router.post('/', (req, res, next) => {
  const susu= req.body.productId
  console.log(susu,'kkk')
  Product.findById(req.body.productId)
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found',
        })
      }
      const order = new Order({
        product: req.body.productId,
        quantity: req.body.quantity,
      })
      return order.save()
    })
    .then((result) => {
      res.status(201).json({
        message: 'post order request',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/orders/' + result._id,
          },
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err,
      })
    })
})

// Get order By ID route
router.get('/:orderId', (req, res, next) => {
  const idOfOrder = req.params.orderId
  Order.findById(idOfOrder)
  .populate('product')
  .exec()
  .then(order=>{
    if(!order){
      return res.status(404).json({
        message:'Order not found'
      })
    }
    res.status(200).json({
      order: order,
      request:{
        type:'GET',
        url: 'http://localhost:5000/orders/'
      }
    })

  })
  .catch(err=>{
    res.status(500).json({
      error:err

    })
  })
  
})

// Delete order by ID route
router.delete('/:orderId', (req, res, next) => {
  const idOfOrder = req.params.orderId
  Order.remove({_id:idOfOrder})
  .exec()
  .then(result=>{
    res.status(200).json({
      message:'Order deleted'
    })

  })
  .catch(err=>{
    res.status(500).json({
      message:'deleting order failed',
      error:err
    })
  })
  res.status(200).json({
    message: 'order deleted',
    orderId: idOfOrder,
  })
})

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
