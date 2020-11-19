const express = require('express')
const router = express.Router()
const multer = require('multer')
const checkAuth = require('../Auth/checkAuthen')
const productsController = require('../controllers/products')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname)
  },
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
})

// GET all products route
router.get('/', productsController.products_GET_all)

// POST new product route
router.post('/', checkAuth, upload.single('productNewImage'))

// GET Product by ID route
router.get('/:productId', productsController.products_GET_singleProduct)

// UPDATE product  by ID route
router.patch('/:productId', checkAuth, productsController.products_PATCH_product)
// DELETE product by ID route
router.delete('/:productId', checkAuth, productsController.products_DELETE_product)

module.exports = router
