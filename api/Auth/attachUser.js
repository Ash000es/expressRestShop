const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const {model} = require('../models/user')
const User = require('../models/user')

module.exports =(req,res,next)=>{
    const token= req.headers.authorization 
    
    if(!token){
      return res.status(401).json({message:'Authentication invalid'})
    }
    const decodedToken=jwtDecode(token.slice(7))
    console.log(decodedToken)
    if(!decodedToken){
      return res.status(401).json({message:'There was a problem in authentication'})
    } else{
      req.user= decodedToken;
      next()
    }
  }