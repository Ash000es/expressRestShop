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
}
exports.orders_POST_order = async (req, res, next) => {
  // const susu = req.body.productId
  // console.log(susu, 'kkk')
  try{

    const productIds = req.body.productIds
    // ['5fb407579f0d0bd5aafacb1d', '5fb4401e6376cdea60abf212']
    
    const promises = productIds.map(productId => {
      console.log(productId)
     const found1 = Product.findOne({_id: mongoose.Types.ObjectId(productId),productInventory:{$gt:0}}).orFail().exec()
    
    //  const found2 = HotelProduct.findOne({_id: mongoose.Types.ObjectId(productId),productInventory:{$gt:0}}).orFail().exec()
   
     return found1
      
     
    });
    console.log(promises,'ppp')
    const products=  await Promise.all(promises)
    
    const newOrder = new Order({
      product:products,
    })

   await newOrder.save()


    res.json(newOrder);
  }catch(err) {

 res.status(404).json({
  //  error:err,
   filter:err.filter
  })

  }
  // Product.findById(req.body.productId)
  //   .then((product) => {
  //     if (!product) {
  //       return res.status(404).json({
  //         message: 'Product not found',
  //       })
  //     }
  //     const order = new Order({
  //       product: req.body.productId,
  //       quantity: req.body.quantity,
  //     })
  //     return order.save()
  //   })
  //   .then((result) => {
  //     res.status(201).json({
  //       message: 'post order request',
  //       createdOrder: {
  //         _id: result._id,
  //         product: result.product,
  //         quantity: result.quantity,
  //         request: {
  //           type: 'GET',
  //           url: 'http://localhost:5000/orders/' + result._id,
  //         },
  //       },
  //     })
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //     res.status(500).json({
  //       message: err,
  //     })
  //   })
}

exports.orders_GET_singleOrder = (req, res, next) => {
  const idOfOrder = req.params.orderId
  Order.findById(idOfOrder)
    .populate('product')
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found',
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http://localhost:5000/orders/',
        },
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      })
    })
}
exports.orders_DELETE_singleOrder = (req, res, next) => {
  const idOfOrder = req.params.orderId
  Order.remove({ _id: idOfOrder })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'Order deleted',
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'deleting order failed',
        error: err,
      })
    })
  res.status(200).json({
    message: 'order deleted',
    orderId: idOfOrder,
  })
}
