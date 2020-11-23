const mongoose = require('mongoose')

const hotelproductSchema = mongoose.Schema({
    
           hotelName:{type:String, required: true},
           location:{type:String, required: true},
           productInventory: { type: Number, required: true },
           date: { type: Date, default: Date.now }
          
        
        
})

module.exports = mongoose.model('HotelProduct', hotelproductSchema)