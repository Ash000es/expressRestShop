const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({

  productName: String,
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product' , required: true},
  quantity:{type: Number, default: 1},
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Order', OrderSchema)
