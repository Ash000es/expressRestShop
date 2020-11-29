const mongoose = require('mongoose')

const HotelBedsSchema = mongoose.Schema({
  
  name: {type: Object },
  images:[{type: Object }],

  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('HotelBed', HotelBedsSchema)