const mongoose = require('mongoose')

const HotelBedsSchema = mongoose.Schema({
  createdBy: { type: mongoose.Types.ObjectId, required: false },
  accommodationType: { type: String, required: true },
  categoryCode: { type: String, required: false },
  categoryName: { type: String, required: false },
  contactDetails: { type: Object, required: true },
  code: { type: Number, required: false },
  name: { type: String, required: true },
  city: { type: String, required: true },
  postCode: { type: String, required: false },
  areaName: { type: String, required: false },
  address: { type: Object, required: true },
  email: { type: String, required: false },
  phones: { type: String, required: false },
  destinationCode: { type: String, required: false },
  destinationName: { type: String, required: false },
  latitude: { type: String, required: false },
  longitude: { type: String, required: false },
  images: [{ type: Object }],
  amenities: [{ type: String, required: true }],
  reviews: [{ type: Object }],
  rooms: [{ type: Object }],
  minRate: { type: String, required: false },
  maxRate: { type: String, required: false },
  currency: { type: String, required: false },
  license: { type: String, required: false },
  label: { type: String, required: false },
  Extras: [{ type: Object, required: false }],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('HotelBed', HotelBedsSchema)