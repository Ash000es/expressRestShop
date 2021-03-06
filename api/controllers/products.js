const mongoose = require('mongoose')
const Product = require('../models/product')

exports.products_GET_all = (req, res, next) => {
  Product.find()
    .select(
      'productName productPrice productInventory productDescription productImage _id productNewImage'
    )
    .exec()
    .then((docs) => {
      if (docs.length >= 0) {
        const modifiedDocs = {
          count: docs.length,
          products: docs.map((doc) => {
            return {
              productName: doc.productName,
              productPrice: doc.productPrice,
              productInventory: doc.productInventory,
              productDescription: doc.productDescription,
              productImage: doc.productImage,
              _id: doc._id,
              productNewImage: doc.productNewImage,
              request: {
                type: 'GET',
                url: 'http://localhost:5000/products/' + doc._id,
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

exports.products_GET_singleProduct = (req, res, next) => {
  const id = req.params.productId
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log(doc, 'doc')
      if (doc) {
        res.status(200).json(doc)
      } else {
        res.status(404).json({
          message: 'item not found',
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

exports.products_POST_product = (req, res, next) => {
  const {_id: userId} = req.userData
  const convertedPrice = Number(req.body.productPrice)
  const convertedInventory = Number(req.body.productInventory)
  console.log(userId)

  const product = new Product({
    createdBy:userId,
    productName: req.body.productName,
    productPrice: convertedPrice,
    productInventory: convertedInventory,
    productDescription: req.body.productDescription,
    productImage: req.body.productImage,
    productNewImage: req.file.path
  })
  product
    .save()
    .then((result) => {
      res.status(201).json({
        message: 'handeling post product request',
        createdProduct: {
          newProduct: result,
          request: {
            type: 'GET',
            url: 'http://localhost:5000/product/' + result._id,
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
}
exports.products_PATCH_product = (req, res, next) => {
  const id = req.params.productId

  // to set it the update dynamically you need to convert the req object at the client to an []
  // example [{propsName: productName, value: 'go pro3'}]
  const updateElment = {}
  for (const elmen of req.body) {
    updateElment[elmen.propsName] = elmen.value
  }
  Product.update({ _id: id }, { $set: updateElment })
    .exec()
    .then((result) => {
      console.log(result, 'resy')
      res.status(200).json({
        message: 'product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:5000/products/' + id,
        },
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err,
      })
    })
}

exports.products_DELETE_product = (req, res, next) => {
  const id = req.params.productId
  Product.remove({
    _id: id,
  })
    .exec()
    .then((result) => {
      res.status(200).json(result)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({
        message: err,
      })
    })
}
