const mongoose = require('mongoose')
const Order = require('../models/order')
const Product = require('../models/product')
const HotelProduct = require('../models/hotelProduct')
exports.orders_GET_all = (req, res, next) => {
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
                url: 'http://localhost:5000/orders/' + doc._id
              }
            }
          })
        }
        res.status(200).json(modifiedDocs)
      } else {
        res.status(404).json({
          message: 'no items found'
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err
      })
    })
}
exports.orders_POST_order = async (req, res, next) => {
  try {
    const productIds = req.body.productIds
    const hotelProductIds = req.body.hotelProductIds
    // ['5fb407579f0d0bd5aafacb1d', '5fb4401e6376cdea60abf212']

    const productpromises = []
    const hotelpromises = []
    productpromises.push(
      ...productIds.map((productId) => {
        console.log(productId)
        const found1 = Product.findOne({
          _id: mongoose.Types.ObjectId(productId),
          productInventory: { $gt: 0 }
        })
          .orFail()
          .exec()

        //  const found2 = HotelProduct.findOne({_id: mongoose.Types.ObjectId(productId),productInventory:{$gt:0}}).orFail().exec()

        return found1
      })
    )
    hotelpromises.push(
      ...hotelProductIds.map((productId) => {
        console.log(productId)
        const found1 = HotelProduct.findOne({
          _id: mongoose.Types.ObjectId(productId),
          productInventory: { $gt: 0 }
        })
          .orFail()
          .exec()

        //  const found2 = HotelProduct.findOne({_id: mongoose.Types.ObjectId(productId),productInventory:{$gt:0}}).orFail().exec()

        return found1
      })
    )

    const products = await Promise.all(productpromises)
    const hotels = await Promise.all(hotelpromises)

    const newOrder = new Order({
      product: [...products, ...hotels]
    })

    await newOrder.save()

    res.json(newOrder)
  } catch (err) {
    res.status(404).json({
      error: err,
      filter: err.filter
    })
  }
}

exports.orders_GET_singleOrder = (req, res, next) => {
  const idOfOrder = req.params.orderId
  console.log(idOfOrder, 'id')
  Order.findById(idOfOrder)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        })
      }

      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:5000/orders/'
        }
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      })
    })
}
exports.orders_DELETE_singleOrder = (req, res, next) => {
  const idOfOrder = req.params.orderId
  Order.remove({ _id: idOfOrder })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted'
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'deleting order failed',
        error: err
      })
    })

  res.status(200).json({
    message: 'order deleted',
    orderId: idOfOrder
  })
}
