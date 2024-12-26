const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const Helper = require('./helper')
require('dotenv').config()

app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', require('./routes/apiRoutes'))

// Serve static files from the 'public/home' directory (Static website at kadr.live)
app.use(express.static(path.join(__dirname, 'public/home')))

// Serve the Vue.js-based admin app from the 'dist' directory (Dynamic site at kadr.live/admin)
app.use('/admin', express.static(path.join(__dirname, 'dist')))

// Fallback for all other routes (useful for client-side routing in Vue.js)
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Catch-all route for static content (homepage)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', req.url))
})

console.log(Helper.generateUniqueSignUpLink('1bd5ec11-bf85-11ef-a32f-c843f609474a'))

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
