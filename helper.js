const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
const SIGN_SECRET_KEY = process.env.SIGN_SECRET_KEY
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const errorCodes = require('./errorCodes')
const axios = require('axios')

class Helper {
  static generateRandomPassword (length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length)
      password += chars[randomIndex]
    }

    return password
  }

  static async uploadFile (fileContent, fileName) {
    try {
      const response = await axios.post(`${process.env.KADR_WEBSITE_URL}/services/upload.php`, {
        base64string: fileContent,
        filename: fileName
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    } catch (err) {
      console.error('Upload failed:', err)
      return {
        'status': 'failed',
        'message': '',
        'stored_url': ''
      }
    }
  };

  static async getInactiveUsers (prisma, page) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    let inactiveUsers = await prisma.user.findMany({
      where: {
        AND: [
          { active: false },
          { is_self_signed_up: true },
          { user_type: 'CLIENT' }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        'id': true,
        'name': true,
        'email': true,
        'phone_number': true,
        'city': true,
        'created_at': true,
        'state': true,
        'pincode': true,
        'preferred_language': true,
        'cases_cases_first_partyTouser': {
          select: {
            'id': true,
            'caseId': true,
            'evidence_document_url': true,
            'description': true,
            'category': true,
            'case_type': true
          }
        }
      }
    })
    inactiveUsers = inactiveUsers.map(user => {
      const caseData = user.cases_cases_first_partyTouser[0] || {}
      const caseId = caseData.id

      const flatUser = {
        ...caseData,
        ...user,
        caseId
      }
      delete flatUser.cases_cases_first_partyTouser
      return flatUser
    })

    // Count total inactive users for pagination
    const totalInactiveUsers = await prisma.user.count({
      where: {
        AND: [
          { active: false },
          { is_self_signed_up: true },
          { user_type: 'CLIENT' }
        ]
      }
    })

    // Send the response back to the client
    return {
      users: inactiveUsers,
      total: totalInactiveUsers,
      page,
      perPage
    }
  }

  static async hashPassword (password) {
    const saltRounds = 10 // You can adjust the number of salt rounds for more security
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  }

  static async comparePassword (enteredPassword, storedHash) {
    const isMatch = await bcrypt.compare(enteredPassword, storedHash)
    return isMatch
  }

  static verifyToken (token, secretKey) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, user) => {
        if (err) {
          reject(err)
        } else {
          resolve(user) // Resolving with the decoded user object
        }
      })
    })
  }

  static async checkTokenAndFetch (req, res) {
    const token = req.headers.authorization

    if (!token) {
      req.error = { message: 'No token provided, authorization denied' }
      return
    }

    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token

    try {
      const user = await this.verifyToken(tokenWithoutBearer, SECRET_KEY)
      req.user = user
    } catch (err) {
      req.error = errorCodes.TOKEN_EXPIRED
    }
  }

  static verifySignature (data, signature) {
    // Create a new signature based on the data and compare it with the received signature
    const newSignature = this.signResponseData(data)
    return newSignature === signature
  }

  static signResponseData (data) {
    // Convert the data to a string, then hash it with the secret key
    const dataString = JSON.stringify(data)
    const signature = crypto.createHmac('sha256', SIGN_SECRET_KEY)
      .update(dataString)
      .digest('hex')
    return signature
  }

  static generateAccessToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type, name: user.name }, SECRET_KEY, { expiresIn: '1d' })
  }

  static generateRefreshToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type, name: user.name }, REFRESH_SECRET_KEY, { expiresIn: '30d' })
  }

  static async sendEmail (emailId, htmlBody) {
    try {
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
        subject: 'Mail from kADR.live', // Subject line
        html: htmlBody
      }

      // Send the email
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent: ' + info.response)

      // Send a response to the client
      return { message: 'Email sent successfully', info: info.response }
    } catch (error) {
      return { message: 'Failed to send email', error }
    }
  }
}

module.exports = Helper
