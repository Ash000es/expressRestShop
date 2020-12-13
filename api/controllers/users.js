const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwtDecode = require('jwt-decode')
// const { hashPassword, verifyPassword } = require('../../Utils')
const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err)
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err)
        }
        resolve(hash)
      })
    })
  })
}

const verifyPassword = (passwordAttempt, hashedPassword) => {
  return bcrypt.compare(passwordAttempt, hashedPassword)
}

exports.users_GET_user = (req, res, next) => {
  User.find()
    .exec()
    .then((docs) => {
      res.status(200).json(docs)
    })
}
exports.users_CREATE_user = async (req, res, next) => {
  try {
    const { username, firstName, lastName, password } = req.body
    console.log(username, firstName, lastName, password, 'hased')

    const hashedPassword = await hashPassword(password)
    console.log(hashedPassword, 'hased')

    const userData = {
      userEmail: username.toLowerCase(),
      firstName,
      lastName,
      userPassword: hashedPassword,
      role: 'admin'
    }
    console.log(userData, 'userData')

    const existingEmail = await User.findOne({
      userEmail: userData.userEmail
    }).lean()

    if (existingEmail) {
      console.log('found..')
      return res.status(400).json({ message: 'Email already exists' })
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    if (savedUser) {
      console.log('saved..')
      const token = jwt.sign(userData, process.env.JWT_KEY, {
        expiresIn: '1h'
      })
      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp

      const { firstName, lastName, userEmail, role } = savedUser

      const userInfo = {
        firstName,
        lastName,
        userEmail,
        role
      }

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt
      })
    } else {
      console.log('problem ')
      return res.status(400).json({
        message: 'There was a problem creating your account'
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: 'There was a problem creating your account'
    })
  }
}
exports.users_LOGIN_user = async (req, res, next) => {
  try {
    const userPassword = req.body.password
    const userEmail = req.body.username

    const user = await User.findOne({
      userEmail: userEmail
    }).lean()

    if (!user) {
      console.log('cant find')
      return res.status(403).json({
        message: 'Wrong email or password.'
      })
    }
    const passwordValid = await verifyPassword(userPassword, user.userPassword)

    if (passwordValid) {
      console.log('valid')
      const { userEmail, _id, role, userPassword, firstName, lastName } = user
      const userInfo = Object.assign({}, { userEmail, _id, role, firstName, lastName })

      const token = jwt.sign(
        {
          email: user.userEmail,
          userId: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        }
      )

      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      })
    } else {
      res.status(403).json({
        message: 'Wrong email or password.'
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({ message: 'Something went wrong.' })
  }
}

exports.users_DELETE_user = (req, res, next) => {
  const idOfUser = req.params.userId
  User.remove({ _id: idOfUser })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: 'User deleted'
      })
    })
    .catch((err) => {
      res.status(500).json({
        message: 'deleting user failed',
        error: err
      })
    })
}
