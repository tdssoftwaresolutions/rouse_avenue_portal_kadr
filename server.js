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

app.use(express.static(path.join(__dirname, 'public/home')))
// Serve static files from the Vue.js app (dist folder)
app.use('/admin/', express.static(path.join(__dirname, 'dist')))

console.log(Helper.generateUniqueSignUpLink('1bd5ec11-bf85-11ef-a32f-c843f609474a'))

// Catch-all route to serve the Vue.js app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
