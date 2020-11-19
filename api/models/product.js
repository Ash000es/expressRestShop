const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  productInventory: { type: Number, required: true },
  productDescription: { type: String, required: true },
  productImage: Array,
  productNewImage:String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', productSchema)
