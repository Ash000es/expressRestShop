const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwtDecode = require('jwt-decode')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const crypto = require('crypto')

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
    console.log('one')
    let { username, firstName, lastName, password } = req.body

    username = req.sanitize(username)
    firstName = req.sanitize(firstName)
    lastName = req.sanitize(lastName)
    password = req.sanitize(password)
    const hashedPassword = await hashPassword(password)

    const userData = {
      userEmail: username.toLowerCase(),
      firstName,
      lastName,
      userPassword: hashedPassword,
      emailToken: crypto.randomBytes(64).toString('hex'),
      isVerified: false,
      role: 'admin'
    }

    const existingEmail = await User.findOne({
      userEmail: userData.userEmail
    }).lean()

    if (existingEmail) {
      console.log('found..')
      return res.status(400).json({
        message: 'Email already exists'
      })
    }
    const msg = {
      to: username.toLowerCase(),
      from: 'ashrafsaad000@gmail.com', // Use the email address or domain you verified above
      subject: 'Ladybirdy - please verify your email address',
      text: `Hello, Thank you for registering on our site.
    Please copy and paste the address below to verify your account.
    http://${req.headers.host}/verify-email?token=${userData.emailToken}`,
      html: `
        <h2>Hello, Thank you for registering on our site.</h2>
        <p>Please copy and paste the address below to verify your account.</p>
    <a href='http://${req.headers.host}/users/verify-email?token=${userData.emailToken}'>Verify your account</a> 
        `
    }
    console.log('three')
    await sgMail.send(msg)
    console.log('four')

    // return res.redirect('/')

    const newUser = new User(userData)
    const savedUser = await newUser.save()
    return res.status(200).json({
      message: 'Thank you for registering, please check your email for verification link'
    })
    // if (savedUser) {
    //   console.log('saved..')
    //   const token = jwt.sign(userData, process.env.JWT_KEY, {
    //     expiresIn: '1h'
    //   })
    //   const decodedToken = jwtDecode(token)
    //   const expiresAt = decodedToken.exp
    //   const { firstName, lastName, userEmail, role } = savedUser
    //   const userInfo = {
    //     firstName,
    //     lastName,
    //     userEmail,
    //     role
    //   }
    //   res.cookie('token', token, {
    //     httpOnly: true
    //   })
    //   return res.json({
    //     message: 'User created!',
    //     token,
    //     userInfo,
    //     expiresAt
    //   })
    // } else {
    //   console.log('problem ')
    //   return res.status(400).json({
    //     message: 'There was a problem creating your account'
    //   })
    // }
  } catch (err) {
    console.log('ppp error')
    return res.status(400).json({
      message: 'There was a problem creating your account 121'
    })
  }
}
exports.users_Verify_user = async (req, res, next) => {
  console.log('123456789')
  const token = req.query.token

  try {
    const user = await User.findOne({ emailToken: token })
    console.log(user, 'iam user')
    if (!user) {
      return res.status(400).json({
        message: 'There was a problem with your token'
      })
    } else {
      user.emailToken = null
      user.isVerified = true
      await user.save()

      res.status(200).json({
        message: 'allgood here'
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong in the verify step.'
    })
  }
}

exports.users_LOGIN_user = async (req, res, next) => {
  console.log('login')
  try {
    const { password: userPassword, username: userEmail } = req.body
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
      console.log('one in user')
      const userInfo = Object.assign(
        {},
        {
          userEmail,
          _id,
          role,
          firstName,
          lastName
        }
      )
      const token = jwt.sign(userInfo, process.env.JWT_KEY, {
        expiresIn: '1h'
      })
      console.log(token, 'token in user')
      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp
      res.cookie('token', token, {
        httpOnly: true
      })

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
    return res.status(400).json({
      message: 'Something went wrong.'
    })
  }
}

exports.users_DELETE_user = (req, res, next) => {
  const idOfUser = req.params.userId
  User.remove({
    _id: idOfUser
  })
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
