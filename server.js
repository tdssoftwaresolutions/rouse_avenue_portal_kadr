const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api', require('./routes/apiRoutes'))

// Serve static files from the Vue.js app (dist folder)
app.use(express.static(path.join(__dirname, 'dist')))

// Catch-all route to serve the Vue.js app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
