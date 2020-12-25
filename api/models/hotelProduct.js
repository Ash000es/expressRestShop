const mongoose = require('mongoose')

const hotelproductSchema = mongoose.Schema({
  hotelName: { type: String, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  rooms: [{ type: Object }],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('HotelProduct', hotelproductSchema)
