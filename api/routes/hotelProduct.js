const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer')
const HotelProduct = require('../models/hotelProduct')

router.get('/', (req,res,next)=>{
  HotelProduct.find()
  .exec()
  .then(results=>{
    res.status(200).json(results)
  })

})

router.post('/',(req, res, next) => {
    
    const convertedInventory = Number(req.body.productInventory)
  
    const hotelproduct = new HotelProduct({
        hotelName:req.body.hotelName,
        location:req.body.location,
        productInventory: convertedInventory
    })
    hotelproduct
      .save()
      .then((result) => {
        res.status(201).json({
          message: 'handeling post hotel product request',
          createdProduct: {
            newProduct: result,
            request: {
              type: 'GET',
              url: 'http://localhost:5000/hotelProduct/' + result._id,
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


)
module.exports = router