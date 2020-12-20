const jwt = require('jsonwebtoken')
const {
  model
} = require('../models/user')

module.exports = (req, res, next) => {
  // console.log(req,'from auth')
  try {

    const token = req.headers.authorization.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    console.log(decoded, '.....')
    next()
  } catch (err) {
    console.log('failed here')
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}