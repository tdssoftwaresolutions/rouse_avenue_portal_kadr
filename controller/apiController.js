const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const helper = require('../helper')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const clientId = process.env.ZOOM_CLIENT_ID
const clientSecret = process.env.ZOOM_CLIENT_SECRET
const accountId = process.env.ZOOM_ACCOUNT_ID
const errorCodes = require('../errorCodes')

module.exports = {
  getDashboardContent: async function (req, res) {
    if (req.error) {
      res.json(req.error)
      return
    }
    const userDetails = req.user
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userDetails.id // The id to search by
        }
      })
      if (!user) {
        res.json(errorCodes.USER_NOT_FOUND)
      }

      let dashboardContent = {}

      if (user.user_type === 'ADMIN') {
        const inactiveUsers = await prisma.user.findMany({
          where: {
            active: false
          }
        })
        dashboardContent.inactive_users = inactiveUsers
      }

      console.log('Fetched user:', user)
      res.json({ success: true, dashboardContent })
    } catch (error) {
      console.error('Error fetching user:', error)
    } finally {
      await prisma.$disconnect() // Close the Prisma connection
    }
  },
  logout: function (req, res) {
    // Clear the refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true, // Make sure it's HTTP-only
      secure: process.env.NODE_ENV === 'production', // Secure cookie in production
      sameSite: 'None', // For cross-origin cookies (if needed)
      path: '/' // Ensure to clear the cookie from the same path
    })

    // Optionally send a response indicating the user has been logged out
    return res.status(200).json({ message: 'Logged out successfully' })
  },
  updateInactiveUsers: function (req, res) {
    console.log(req.body.data)
  },
  scheduleMeeting: async function (req, res) {
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
      res.status(201).json({
        error: 'User not found.'
      })
      return
    }
    if (user.active === false) {
      res.status(201).json(errorCodes.USER_NOT_ACTIVE)
      return
    }
    const isPasswordValid = await helper.comparePassword(password, user.password_hash)
    if (!isPasswordValid) {
      res.status(201).json(errorCodes.INVALID_CREDENTIALS)
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
    res.json({ accessToken })
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
