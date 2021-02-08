const User = require('../models/user')
module.exports = async (req, res, next) => {
  const { username: userEmail } = req.body
  try {
    const user = await User.findOne({ userEmail: userEmail })
    if (user.isVerified) {
      return next()
    } else {
      res.status(202).json({
        message: 'your email has not been verified, please check your email for verification'
      })
    }
  } catch (error) {
    console.log(err)
    return res.status(400).json({
      message: 'Something went wrong.'
    })
  }
}
