const express = require('express')
const router = express.Router()
const csrf = require('csurf')
const csrfProtection = csrf({
  cookie: true
})
// app.use(csrfProtection)

router.get('/', (req, res) => {
  console.log('csrf token route')
  res.json({ csrfToken: req.csrfToken() })
})
module.exports = router
