const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const {role} = req.userData
    console.log(role,'role from requireadmin')
    try {
if(role !== 'admin')
return res.status(401).json({
    message:'Insufficent role'
})
  
    
      next()
    } catch (err) {
      console.log('failed in require admin')
      return res.status(401).json({
        message: 'Auth failed'
      })
    }
  }