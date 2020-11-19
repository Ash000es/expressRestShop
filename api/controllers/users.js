const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

exports.users_GET_user = (req, res, next) => {
  User.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs)
    })
}
exports.users_CREATE_user = (req, res, next) => {
  User.find({ userEmail: req.body.userEmail })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: 'User already exxist',
        })
      } else {
        bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
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
                  user: user,
                })
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                  message: 'user creation failed',
                })
              })
          }
        })
      }
    })
}
exports.users_LOGIN_user = (req, res, next) => {
  const userPassword = req.body.userPassword

  User.find({ userEmail: req.body.userEmail })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        })
      }
      bcrypt.compare(userPassword, user[0].userPassword, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          })
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].userEmail,
              userId: user[0]._id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: '1h',
            }
          )
          return res.status(200).json({
            message: 'Auth sucessful',
            token: token,
          })
        }
        res.status(401).json({
          message: 'Auth failed',
        })
      })
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: 'I dont know',
      })
    })
}

exports.users_DELETE_user = (req, res, next) => {
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
}
