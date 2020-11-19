const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

// get order route
router.get('/', (req, res, next) => {
    User.find()
    .exec()
    .then(docs =>{
        res.status(200).json(docs)
    })
})

// Post order route
router.post('/signup', (req, res, next) => {
  User.find({ userEmail: req.body.userEmail })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User already exxist',
          
        })
      } else {
        bcrypt.hash(req.body.userPassword, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({
              error: err,
            })
          } else {
            const user = new User({
              userEmail: req.body.userEmail,
              userPassword: hash,
            })

            user
              .save()
              .then((result) => {
                console.log(result, '123')
                res.status(201).json({
                  message: 'User created',
                  user:user
                })
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  message:'user creation failed'
                })
              })
          }
        })
      }
    })
})

// Get order By ID route
router.get('/:orderId', (req, res, next) => {
 
})

// Delete order by ID route
router.delete('/:userId', (req, res, next) => {
  const idOfUser = req.params.userId
  User.remove({ _id: idOfUser })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'User deleted',
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'deleting user failed',
        error: err,
      })
    })

})

module.exports = router
