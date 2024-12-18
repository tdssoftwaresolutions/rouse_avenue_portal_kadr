const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
const SIGN_SECRET_KEY = process.env.SIGN_SECRET_KEY
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const errorCodes = require('./errorCodes')
const axios = require('axios')
const fs = require('fs')
const path = require('path')

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

  static async addLanguagesToDatabase (languageKeys, prisma) {
    try {
      // Path to languages.json
      const filePath = path.join(__dirname, 'public', 'languages.json')

      // Read and parse the JSON file
      const languagesJson = JSON.parse(fs.readFileSync(filePath, 'utf8'))

      // Prepare the data for database insertion
      const languagesToInsert = languageKeys.map((key) => {
        if (languagesJson.languages[key]) {
          return {
            id: key,
            language: languagesJson.languages[key]
          }
        } else {
          console.warn(`Language key '${key}' not found in JSON.`)
          return null
        }
      }).filter(Boolean) // Remove nulls for missing keys

      // Insert the data into the database
      await prisma.available_languages.createMany({
        data: languagesToInsert,
        skipDuplicates: true // Prevent errors for existing keys
      })

      console.log('Languages added to database successfully!')
    } catch (error) {
      console.error('Error adding languages to database:', error)
    } finally {
      await prisma.$disconnect()
    }
  };

  static async getMediatorCasesCount (prisma, mediatorId) {
    return prisma.cases.count({
      where: {
        mediator: mediatorId,
        OR: [
          { status: 'New' },
          { status: 'In_Progress' }
        ]
      }
    })
  }

  static async getMediatorCases (prisma, mediatorId, page) {
    // const today = new Date()
    // const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    // const endOfToday = new Date(today.setHours(23, 59, 59, 999))
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage
    return prisma.cases.findMany({
      where: {
        mediator: mediatorId,
        OR: [
          { status: 'New' },
          { status: 'In_Progress' }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        description: true,
        category: true,
        case_type: true,
        caseId: true,
        evidence_document_url: true,
        status: true,
        user_cases_first_partyTouser: {
          select: {
            id: true,
            preferred_languages: true,
            name: true,
            state: true,
            city: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            state: true,
            city: true
          }
        },
        events: {
          orderBy: {
            created_at: 'desc'
          },
          select: {
            id: true,
            title: true,
            description: true,
            start_datetime: true,
            end_datetime: true,
            type: true,
            meeting_link: true
          }
        }
      }
    })
  }

  static async getInactiveUsers (prisma, page, type, relationField) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    let [inactiveUsers, totalInactiveUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          AND: [
            { active: false },
            { is_self_signed_up: true },
            { user_type: type }
          ]
        },
        orderBy: {
          created_at: 'desc'
        },
        skip, // Skip items for pagination
        take: perPage, // Limit the number of items per page
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          password_hash: true,
          created_at: true,
          updated_at: true,
          user_type: true,
          active: true,
          google_token: true,
          city: true,
          state: true,
          pincode: true,
          is_self_signed_up: true,
          llb_college: true,
          llb_university: true,
          llb_year: true,
          mediator_course_year: true,
          mcpc_certificate_url: true,
          preferred_area_of_practice: true,
          selected_hearing_types: true,
          bar_enrollment_no: true,
          preferred_languages: true,
          [relationField]: {
            select: {
              id: true,
              caseId: true,
              evidence_document_url: true,
              description: true,
              category: true,
              case_type: true,
              user_cases_second_partyTouser: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone_number: true
                }
              }
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          AND: [
            { active: false },
            { is_self_signed_up: true },
            { user_type: type }
          ]
        }
      })
    ])

    inactiveUsers = inactiveUsers.map(user => {
      const caseData = user[relationField][0] || {}
      const otherPartyDate = user[relationField][0]?.user_cases_second_partyTouser || {}
      const caseId = caseData.id
      const userId = user.id
      const otherPartyUserId = otherPartyDate.id

      const flatUser = {
        ...otherPartyDate,
        ...caseData,
        ...user,
        caseId,
        userId,
        otherPartyUserId
      }
      delete flatUser[relationField]
      delete flatUser.user_cases_second_partyTouser
      delete flatUser.id
      return flatUser
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
      req.error = { status: 401, message: errorCodes.NO_TOKEN_PROVIDED }
      return
    }

    const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7, token.length) : token

    try {
      const user = await this.verifyToken(tokenWithoutBearer, SECRET_KEY)
      req.user = user
      return null
    } catch (err) {
      return { status: 401, message: errorCodes.TOKEN_EXPIRED }
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
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type ? user.user_type : user.type, name: user.name }, SECRET_KEY, { expiresIn: '1d' })
  }

  static generateRefreshToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type ? user.user_type : user.type, name: user.name }, REFRESH_SECRET_KEY, { expiresIn: '7d' })
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
