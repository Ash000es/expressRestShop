const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const bodyParser = require('body-parser')

const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const usersRoutes = require('./api/routes/users')
const mongoose = require('mongoose')

// connection
mongoose.connect(
  'mongodb+srv://AshrafAdminUser:' +
    process.env.MONGO_ATLAS_PW +
    '@expressshop.rmlsq.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }, ()=> console.log('connected to db')
)
mongoose.Promise = global.Promise;
// middlewear
app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Headers', 'PUT, POST, PATCH, DELETE,GET')
    return res.status(200).json({})
  }
  next()
})

// routes
app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)
app.use('/users', usersRoutes)

app.use((req, res, next) => {
  const error = new Error('new error')
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
