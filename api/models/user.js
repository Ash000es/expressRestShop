const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
  
  userEmail: { type: String, 
    required: true,
     unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
  userPassword: { type: String, required: true },
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)
