const mongoose = require('mongoose')

const OrderSchema = mongoose.Schema({
  product: [
    {type:mongoose.Schema.Types.Mixed}
    //{type: mongoose.Schema.Types.ObjectId, ref: 'Product' },{type: mongoose.Schema.Types.ObjectId, ref: 'HotelProduct' }
  ],                                          
  date: { type: Date, default: Date.now }
}) 
//mongoose discriminators
module.exports = mongoose.model('Order', OrderSchema)
