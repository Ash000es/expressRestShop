const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  product: [{ type: mongoose.Schema.Types.Mixed }],
  date: { type: Date, default: Date.now }
})
//mongoose discriminators
module.exports = mongoose.model('Order', OrderSchema)
