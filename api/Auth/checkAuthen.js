const jwt = require('jsonwebtoken')
const { model } = require('../models/user')

module.exports = (req, res, next) => {
  try {
    // const token = req.headers.authorization.split(' ')[1]
    const token = req.cookies.token
    console.log(token, 'token in checkauth')
    const decoded = jwt.verify(token, process.env.JWT_KEY)
    req.userData = decoded
    next()
  } catch (err) {
    console.log('failed here')
    return res.status(401).json({
      message: 'Auth failed'
    })
  }
}
