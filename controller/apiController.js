const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const helper = require('../helper')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const clientId = process.env.ZOOM_CLIENT_ID
const clientSecret = process.env.ZOOM_CLIENT_SECRET
const accountId = process.env.ZOOM_ACCOUNT_ID
const errorCodes = require('../errorCodes')
const { google } = require('googleapis')
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

module.exports = {
  getDashboardContent: async function (req, res) {
    if (req.error) {
      res.json(req.error)
      return
    }
    try {
      const userDetails = req.user
      let dashboardContent = {}
      const user = await prisma.user.findUnique({
        where: {
          id: userDetails.id
        }
      })
      if (!user) {
        res.json(errorCodes.USER_NOT_FOUND)
      }

      if (user.user_type === 'ADMIN') {
        const inactiveUsers = await prisma.user.findMany({
          where: {
            active: false
          }
        })
        const counts = await prisma.$transaction([
          prisma.cases.count(),
          prisma.user.count({
            where: {
              user_type: 'CLIENT'
            }
          }),
          prisma.user.count({
            where: {
              user_type: 'MEDIATOR'
            }
          })
        ])
        const totalCases = counts[0]
        const clientUsers = counts[1]
        const mediatorUsers = counts[2]
        dashboardContent.inactive_users = inactiveUsers
        dashboardContent.count = {
          cases: totalCases,
          clients: clientUsers,
          mediators: mediatorUsers
        }
      }

      if (user.user_type === 'MEDIATOR') {
        const cases = await prisma.cases.findMany({
          where: {
            mediator: userDetails.id
          },
          select: {
            id: true
          }
        })
        if (cases.length === 0) {
          return res.json(errorCodes.CASES_NOT_FOUND)
        }
        const casesWithEvents = await prisma.cases.findMany({
          where: {
            mediator: userDetails.id
          },
          include: {
            events: {
              where: {
                case_id: {
                  in: cases.map(c => c.id)
                }
              }
            }
          }
        })
        dashboardContent.myCases = casesWithEvents
      }

      if (user.user_type === 'CLIENT') {
        const cases = await prisma.cases.findMany({
          where: {
            OR: [
              { first_party: userDetails.id },
              { second_party: userDetails.id }
            ]
          },
          select: {
            id: true
          }
        })
        if (cases.length === 0) {
          return res.json(errorCodes.CASES_NOT_FOUND)
        }
        const casesWithEvents = await prisma.cases.findMany({
          where: {
            mediator: userDetails.id
          },
          include: {
            events: {
              where: {
                case_id: {
                  in: cases.map(c => c.id)
                }
              }
            }
          }
        })
        dashboardContent.myCases = casesWithEvents

        dashboardContent.cases = cases
      }

      res.json({ success: true, dashboardContent })
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      await prisma.$disconnect()
    }
  },
  logout: function (req, res) {
    // Clear the refresh token cookie
    try {
      res.clearCookie('refresh_token', {
        httpOnly: true, // Make sure it's HTTP-only
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        sameSite: 'None', // For cross-origin cookies (if needed)
        path: '/' // Ensure to clear the cookie from the same path
      })
    } catch (e) {
      console.log('Cookie couldn\'t be cleared, trying with Set-Cookie header for serverless')
      // Set-Cookie header to expire the refresh_token cookie
      const expiredCookie = `refresh_token=; Max-Age=0; Path=/; Secure=${process.env.NODE_ENV === 'production' ? 'true' : 'false'}; SameSite=None`
      res.setHeader('Set-Cookie', expiredCookie)
    }

    // Optionally send a response indicating the user has been logged out
    return res.status(200).json({ message: 'Logged out successfully' })
  },
  updateInactiveUsers: function (req, res) {
    console.log(req.body.data)
  },
  scheduleMeeting: async function (req, res) {
    if (req.error) {
      res.json(req.error)
      return
    }
    try {
      const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`
      const response = await axios.post(
        tokenUrl, '',
        {
          headers: {
            'Authorization': `Basic ${Buffer.from(clientId + ':' + clientSecret).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      const accessToken = response.data.access_token
      const meetingData = {
        topic: 'Team Sync Meeting',
        type: 2,
        start_time: '2024-12-10T10:00:00Z',
        duration: 30,
        timezone: 'UTC',
        contact_email: 'tarandeep.s.saini@gmail.com',
        meeting_invitees: [
          {
            'email': 'tarandeep.s.saini@gmail.com'
          }
        ],
        attendees: [
          {
            'email': 'tarandeep.s.saini@gmail.com'
          }
        ],
        agenda: 'Discuss team updates and project milestones',
        settings: {
          host_video: true,
          participant_video: true,
          audio: 'voip',
          auto_recording: 'none',
          alternative_hosts: '',
          send_notification: true
        }
      }
      const response1 = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        meetingData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
      const meetingLink = response1.data.join_url
      res.json({
        message: 'Meeting created successfully!',
        meetingLink,
        meetingId: response1.data.id
      })
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message)
    }
  },
  googleCallback: async function (req, res) {
    const code = decodeURIComponent(req.query.code)
    const state = req.query.state
    try {
      const { tokens } = await oauth2Client.getToken(code)
      console.log(tokens)
      await prisma.user.update({
        where: {
          id: state
        },
        data: {
          google_token: JSON.stringify(tokens)
        }
      })
      res.send('<html><body><h1>Your Google account is now connected. You can now close this window and return to the app.</h1></body></html>')
    } catch (e) {
      console.error('Error retrieving access token', e)
      res.status(500).send('Authentication failed')
    }
  },
  confirmPasswordChange: async function (req, res) {
    const { emailAddress, otp, password } = req.body
    const otpReset = await prisma.otp_resets.findUnique({
      where: {
        email: emailAddress
      },
      select: {
        otp: true,
        expires_at: true
      }
    })
    if (otpReset) {
      if (otpReset.otp !== otp) {
        res.status(401).json(errorCodes.INVALID_OTP)
        return
      }
      if (otpReset.expires_at < new Date()) {
        res.status(401).json(errorCodes.OTP_EXPIRED)
        return
      }
      const hashPassword = await helper.hashPassword(password)
      await prisma.user.update({
        where: {
          email: emailAddress
        },
        data: {
          password_hash: hashPassword
        }
      })
      await prisma.otp_resets.delete({
        where: {
          email: emailAddress
        }
      })
      res.status(201).json({ success: true, message: 'Password reset successfully.' })
    } else {
      res.status(401).json(errorCodes.INVALID_REQUEST)
    }
  },
  resetPassword: async function (req, res) {
    const email = req.body.emailAddress
    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        id: true
      }
    })
    if (user) {
      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + 10 * 60000)
      const otp = Math.floor(100000 + Math.random() * 900000)
      await prisma.otp_resets.upsert({
        where: {
          email // Check if OTP already exists for this email
        },
        update: {
          otp, // Update OTP
          created_at: createdAt, // Update created time
          expires_at: expiresAt // Update expiration time
        },
        create: {
          email, // Insert the email if doesn't exist
          otp, // Insert the OTP
          created_at: createdAt, // Insert created time
          expires_at: expiresAt // Insert expiration time
        }
      })
      const htmlBody = `
                    <p>Hi, we have recieved your request to reset password for your account on kADR.live.</p>
                    <p>To go ahead with this, please enter OTP: ${otp} on our platform to reset the password</p>
                  `
      await helper.sendEmail(email, htmlBody)
    }
    res.json({ success: true })
  },
  newCalendarEvent: async function (req, res) {
    if (req.error) {
      res.json(req.error)
      return
    }
    try {
      const { id, title, description, start, end, type, caseId } = req.body
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          google_token: true
        }
      })
      oauth2Client.setCredentials(JSON.parse(user.google_token))
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const event = {
        summary: title,
        description,
        start: { dateTime: start, timeZone: 'Asia/Kolkata' },
        end: { dateTime: end, timeZone: 'Asia/Kolkata' },
        attendees: [
          { email: 'tarandeepsync@gmail.com' },
          { email: 'mebonixservices@gmail.com' },
          { email: 'support@mebonix.in' }
        ],
        conferenceData: {
          createRequest: {
            requestId: id,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      }
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      })
      await prisma.events.create({
        data: {
          title: 'Event Title',
          description: 'Event Description',
          start_datetime: start,
          end_datetime: end,
          type,
          meeting_link: response.data.conferenceData.entryPoints[0].uri,
          google_calendar_link: response.data.htmlLink,
          created_by: req.user.id,
          case_id: caseId
        }
      })
      res.send({
        message: 'Event created successfully',
        eventLink: response.data.htmlLink,
        meetLink: response.data.conferenceData.entryPoints[0].uri
      })
    } catch (err) {
      console.error('Error retrieving access token', err)
      res.status(500).send('Authentication failed')
    }
  },
  authenticateWithGoogle: async function (req, res) {
    if (req.error) {
      res.json(req.error)
      return
    }
    const oauth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    )

    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: req.user.id
    })

    res.json({ success: true, url })
  },
  generatePassword: async function (req, res) {
    const generatedPassword = helper.generateRandomPassword()
    console.log(generatedPassword)
    const hashPassword = await helper.hashPassword(generatedPassword)
    console.log(hashPassword)
    res.json({ success: true })
  },
  sendEmail: async function (req, res) {
    const htmlBody = `
                <p>Hi ${req.params.name}, Someone has initiated a mediation request with you.</p>
                <p>To go ahead with this, please click on the link below to get started with your account:</p>
                <p><a href="https://www.kadr.live/get-started" target="_blank">Get Started</a></p>
              `
    await helper.sendEmail(req.params.email, htmlBody)
  },
  newUserSignup: async function (req, res) {
    try {
      const { name, email, phone, city, state, pincode, description, category, evidence, oppositeName, oppositeEmail, oppositePhone, userType } = req.body
      console.log(city + ' ' + state + ' ' + pincode + ' ' + description + ' ' + category + ' ' + evidence)
      const generatedPassword = helper.generateRandomPassword()
      const htmlBody = `
                <p>Hi ${name}, thanks for registering on KADR.live.</p>
                <p>To login use below credentials:</p> <br/>
                <p>Username : ${email} OR ${phone}</p> <br/>
                <p>Password : ${generatedPassword} <p>
              `
      await helper.sendEmail(email, htmlBody)
      const hashPassword = await helper.hashPassword(generatedPassword)
      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone_number: phone,
          password_hash: hashPassword,
          user_type: userType.toUpperCase(),
          active: false
        }
      })
      if (userType.toUpperCase() === 'CLIENT') {
        const oppositePartyUser = await prisma.user.create({
          data: {
            name: oppositeName,
            email: oppositeEmail,
            phone_number: oppositePhone,
            password_hash: '',
            user_type: userType.toUpperCase(),
            active: false
          }
        })
        const tracker = await prisma.caseIdTracker.findFirst()
        let newCaseId = 1
        if (tracker) {
          newCaseId = tracker.lastCaseId + 1 // Increment the last caseId
        }

        const newCase = await prisma.cases.create({
          data: {
            case_name: 'Test Case',
            first_party: user.id,
            second_party: oppositePartyUser.id,
            caseId: `KDR-${newCaseId}`
          }
        })
        console.log(newCase)
        await prisma.caseIdTracker.upsert({
          where: { id: 1 }, // Assuming there's only one row in the tracker
          update: { lastCaseId: newCaseId },
          create: { lastCaseId: newCaseId }
        })
      }
      res.status(201).json({
        message: 'User created successfully',
        user
      })
    } catch (error) {
      console.log(error)
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        res.status(201).json({
          error: 'Email already exists. Please log in instead.'
        })
      } else {
        res.status(500).json({
          error: 'Something went wrong. Please try again later.'
        })
      }
    }
  },
  login: async function (req, res) {
    const { username, password } = req.body
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: username },
          { phone_number: username }
        ]
      }
    })
    if (!user) {
      res.status(401).json(errorCodes.INVALID_CREDENTIALS)
      return
    }
    if (user.active === false) {
      res.status(403).json(errorCodes.USER_NOT_ACTIVE)
      return
    }
    const isPasswordValid = await helper.comparePassword(password, user.password_hash)
    if (!isPasswordValid) {
      res.status(401).json(errorCodes.INVALID_CREDENTIALS)
      return
    }

    const accessToken = helper.generateAccessToken(user)
    const refreshToken = helper.generateRefreshToken(user)
    try {
      res.cookie('refresh_token', refreshToken, {
        httpOnly: true, // Cookie is inaccessible to JavaScript on the client-side
        secure: process.env.NODE_ENV === 'production', // Ensure the cookie is secure in production
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: 'None', // Allow cross-origin cookies (if necessary)
        path: '/'
      })
    } catch (e) {
      console.log('Cookied couldnt set, trying with setHeader')
      res.setHeader('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Max-Age=2592000000; Path=/; Secure=${process.env.NODE_ENV === 'production'}`)
    }
    res.status(201).json({ accessToken })
  },
  getUserData: async function (req, res) {
    if (req.error) {
      res.json(req.error)
      return
    }
    const userData = {
      'id': req.user.id,
      'type': req.user.type,
      'name': req.user.name,
      'email': req.user.email
    }
    const signature = helper.signResponseData(userData)
    res.json({
      userData,
      signature
    })
  },
  verifySignature: function (req, res) {
    const { userData, signature } = req.body
    if (helper.verifySignature(userData, signature)) {
      res.json({ valid: true })
    } else {
      res.json({ valid: false })
    }
  },
  refreshToken: function (req, res) {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(401).json({ message: 'No refresh token' })
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid refresh token' })
      }

      const newAccessToken = helper.generateAccessToken(user)

      res.json({ accessToken: newAccessToken })
    })
  }
}
