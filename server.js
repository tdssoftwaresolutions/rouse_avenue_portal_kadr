const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
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

// Start the server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

server.timeout = 60000 // 60,000 ms = 60 seconds
server.keepAliveTimeout = 60000 // Keep-alive timeout for connections
server.headersTimeout = 65000 // Headers timeout should be slightly higher
