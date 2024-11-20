const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000
const nodemailer = require('nodemailer')
require('dotenv').config()

// API route
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the API!' })
})

app.get('/api/sendemail/:email/:name', async (req, res) => {
  try {
    const emailId = req.params.email
    const name = req.params.name
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com', // Replace with your SMTP server
      port: 465, // Use 587 for TLS or 465 for SSL
      secure: true, // True for SSL, false for TLS
      auth: {
        user: process.env.EMAIL_USER, // Your full email address
        pass: process.env.EMAIL_PASSWORD // Your email password
      }
    })
    // Email details
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to: emailId, // Recipient's email address
      subject: 'Mediation Request Initiated', // Subject line
      html: `
        <p>Hi ${name}, Someone has initiated a mediation request with you.</p>
        <p>To go ahead with this, please click on the link below to get started with your account:</p>
        <p><a href="https://www.kadr.live/get-started" target="_blank">Get Started</a></p>
      `
    }

    // Send the email
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent: ' + info.response)

    // Send a response to the client
    res.status(200).json({ message: 'Email sent successfully', info: info.response })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Failed to send email', error })
  }
})

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
