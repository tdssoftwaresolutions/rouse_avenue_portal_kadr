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
const { v4: uuidv4 } = require('uuid')
const striptags = require('striptags')
const CaseSubTypes = Object.freeze({
  MEDIATOR_ASSIGNED: 'mediator_assigned',
  MEETING_SCHEDULED: 'meeting_scheduled',
  NOTICE_SENT_TO_OPPOSITE_PARTY: 'notice_sent_to_opposite_party',
  PENDING_MEDIATION_AGREEMENT_SIGN: 'pending_mediation_agreement_sign',
  PENDING_MEDIATION_PAYMENT: 'pending_mediation_payment',
  PENDING_NOTICE_PAYMENT: 'pending_notice_payment'
})
const CaseTypes = Object.freeze({
  FAILED: 'failed',
  IN_PROGRESS: 'in_progress',
  CANCELLED: 'cancelled',
  CLOSED_NO_SUCCESS: 'closed_no_success',
  CLOSED_SUCCESS: 'closed_success',
  ESCALATED: 'escalated',
  NEW: 'new',
  ON_HOLD: 'on_hold',
  PENDING: 'pending'
})
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/googleCallback`
)

module.exports = {
  getDashboardContent: async function (req, res) {
    try {
      const userDetails = req.user
      let dashboardContent = {}
      const user = await prisma.user.findUnique({
        where: {
          id: userDetails.id
        },
        select: {
          id: true,
          email: true,
          user_type: true,
          profile_picture_url: true
        }
      })
      if (!user) {
        res.json(errorCodes.USER_NOT_FOUND)
      }

      if (user.user_type === 'ADMIN') {
        const inactiveUsers = await helper.getUsers(false, prisma, 1, 'CLIENT', 'cases_cases_first_partyTouser')
        const inactiveMediators = await helper.getUsers(false, prisma, 1, 'MEDIATOR', 'cases_cases_mediatorTouser')
        const counts = await prisma.$transaction([
          prisma.cases.count(),
          prisma.user.count({
            where: {
              user_type: 'CLIENT',
              active: true
            }
          }),
          prisma.user.count({
            where: {
              user_type: 'MEDIATOR',
              active: true

            }
          })
        ])
        const totalCases = counts[0]
        const clientUsers = counts[1]
        const mediatorUsers = counts[2]
        dashboardContent.inactive_users = inactiveUsers
        dashboardContent.inactive_mediators = inactiveMediators
        dashboardContent.count = {
          cases: totalCases,
          clients: clientUsers,
          mediators: mediatorUsers
        }
      } else if (user.user_type === 'MEDIATOR') {
        const [notes, casesWithEvents, casesCount, todaysPersonalMeetings] = await Promise.all([
          prisma.notes.findMany({
            where: {
              user_id: userDetails.id
            },
            select: {
              id: true,
              note_text: true
            },
            orderBy: {
              created: 'desc'
            }
          }),
          helper.getMediatorCases(prisma, userDetails.id, 1),
          helper.getMediatorCasesCount(prisma, userDetails.id),
          helper.getTodaysPersonalMeetings(prisma, userDetails.id)
        ])
        dashboardContent.myCases = {
          casesWithEvents,
          total: casesCount,
          page: 1,
          perPage: 10
        }
        dashboardContent.notes = notes
        dashboardContent.todaysEvent = helper.getTodaysEvents(casesWithEvents, todaysPersonalMeetings)
        dashboardContent.user = user
      } else if (user.user_type === 'CLIENT') {
        const [casesWithEvents, clientNotifications, caseEvents] = await Promise.all([
          helper.getClientCases(prisma, userDetails.id, 1),
          helper.getClientNotifications(prisma, userDetails.id),
          helper.getCaseEvents(prisma)
        ])

        dashboardContent.myCases = helper.mergeCaseHistory(casesWithEvents, caseEvents)
        dashboardContent.notifications = clientNotifications
        dashboardContent.todaysEvent = helper.getEventsForToday(casesWithEvents)
        dashboardContent.user = user
      }

      res.json({ success: true, dashboardContent })
    } catch (error) {
      res.json(errorCodes.INVALID_REQUEST)
      console.error('Error fetching user:', error)
    } finally {
      await prisma.$disconnect()
    }
  },
  getInactiveUsers: async function (req, res) {
    const type = req.query.type
    const relationField = type === 'CLIENT' ? 'cases_cases_first_partyTouser' : 'cases_cases_mediatorTouser'
    const inactiveUsers = await helper.getUsers(false, prisma, req.query.page, type, relationField)
    res.json({ success: true, inactiveUsers })
  },
  getMyCases: async function (req, res) {
    const [casesWithEvents, casesCount] = await Promise.all([
      helper.getMediatorCases(prisma, req.user.id, req.query.page),
      helper.getMediatorCasesCount(prisma, req.user.id)
    ])
    res.json({ success: true, casesWithEvents, total: casesCount, page: 1, perPage: 10 })
  },
  saveBlog: async function (req, res) {
    const { blog, status } = req.body
    const { id } = req.user
    console.log(blog)
    console.log(status)
    console.log(id)
    helper.saveBlog(prisma, blog, id, status)
    res.json({ success: true })
  },
  getBlog: async function (req, res) {
    const [blog, top3LatestBlog] = await Promise.all([
      helper.getBlog(prisma, req.query.id),
      helper.getTop3LatestBlogs(prisma)
    ])
    const formattedBlog = {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author_id: blog.user.id,
      author_name: blog.user.name,
      created_at: blog.created_at,
      categories: blog.blog_categories.map((bt) => ({
        id: bt.categories.id,
        name: bt.categories.name
      })),
      tags: blog.blog_tags.map((bt) => ({
        id: bt.tags.id,
        name: bt.tags.name
      }))
    }
    res.json({ blog: formattedBlog, top3LatestBlog })
  },
  geAllBlogs: async function (req, res) {
    const { page, search, category, author, tag } = req.query
    const [allBlogs, blogsCount] = await Promise.all([
      helper.getAllBlogs(prisma, page, search, category, author, tag),
      helper.getAllBlogsCount(prisma, search, category, author, tag)
    ])
    const formattedBlogs = allBlogs.map((blog) => {
      const strippedContent = striptags(blog.content) // Remove HTML tags
      const lines = strippedContent.split('\n') // Split into lines
      const limitedContent = lines.slice(0, 5).join('') + '....' // Limit to first 5 lin
      return {
        id: blog.id,
        title: blog.title,
        content: limitedContent,
        author_id: blog.user.id,
        author_name: blog.user.name,
        created_at: blog.created_at,
        categories: blog.blog_categories.map((bt) => ({
          id: bt.categories.id,
          name: bt.categories.name
        })),
        tags: blog.blog_tags.map((bt) => ({
          id: bt.tags.id,
          name: bt.tags.name
        }))
      }
    })
    res.json({ blogs: formattedBlogs, total: blogsCount, page: 1, perPage: 10 })
  },
  getMyBlogs: async function (req, res) {
    const [myBlogs, blogsCount] = await Promise.all([
      helper.getMyBlogs(prisma, req.user.id, req.query.page),
      helper.getBlogsCount(prisma, req.user.id)
    ])
    const formattedBlogs = myBlogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author_id: blog.authorId,
      status: blog.status,
      created_at: blog.created_at,
      updated_at: blog.updated_at,
      categories: blog.blog_categories.map((bt) => ({
        id: bt.categories.id,
        name: bt.categories.name
      })),
      tags: blog.blog_tags.map((bt) => ({
        id: bt.tags.id,
        name: bt.tags.name
      }))
    }))
    res.json({ success: true, formattedBlogs, total: blogsCount, page: 1, perPage: 10 })
  },
  getPublicBlogAssets: async function (req, res) {
    const [blogCountPerCategory] = await Promise.all([
      helper.getBlogCountPerCategory(prisma)
    ])
    res.json({ blogCountPerCategory })
  },
  getBlogAssets: async function (req, res) {
    const [blogCategories, blogTags] = await Promise.all([
      helper.getBlogCategories(prisma),
      helper.getBlogTags(prisma)
    ])
    res.json({ success: true, blogCategories, blogTags })
  },
  getExistingUser: async function (req, res) {
    const token = req.headers.authorization
    const decryptedContent = await helper.verifyToken(token)
    const user = await prisma.user.findUnique({
      where: {
        id: decryptedContent.id
      },
      select: {
        id: true,
        email: true,
        phone_number: true,
        name: true
      }
    })
    console.log(user)
    res.json({ ...user })
  },
  setClientPayment: async function (req, res) {
    const { paymentId, clientId, caseId, success, amount, currency, reason, paymentMethod, referenceId } = req.body
    await prisma.transactions.create({
      data: {
        payment_id: paymentId,
        client_id: clientId,
        case_id: caseId,
        success,
        amount,
        currency: currency || 'INR', // Defaults to USD if not provided
        reason,
        payment_method: paymentMethod,
        reference_id: referenceId,
        transaction_date: new Date()
      }
    })

    const caseDetails = await prisma.cases.findUnique({
      where: {
        id: caseId
      },
      select: {
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user_cases_first_partyTouser: {
          select: {
            name: true
          }
        }
      }
    })

    const uniqueSignUpLink = helper.generateUniqueSignUpLink(caseDetails.user_cases_second_partyTouser.id)

    const htmlBody = `
    <p>Hi ${caseDetails.user_cases_second_partyTouser.name}, we have recieved a mediation request from ${caseDetails.user_cases_first_partyTouser.name} on kADR.live.</p>
    <p>To go ahead and start the mediation, please click on below links <br/> Link to register - ${uniqueSignUpLink}</p>`
    await helper.sendEmail(caseDetails.user_cases_second_partyTouser.email, htmlBody)

    /** await prisma.cases.update({
      where: {
        id: caseId
      },
      data: {
        sub_status: CaseSubTypes.NOTICE_SENT_TO_OPPOSITE_PARTY
      }
    }) */
    res.json({ success: true })
  },
  getCalendarInit: async function (req, res) {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        google_token: true
      }
    })
    if (user) {
      if (user.google_token == null) {
        return res.json(errorCodes.GOOGLE_ACCOUNT_NOT_CONFIGURED)
      } else {
        const events = await prisma.events.findMany({
          where: {
            created_by: user.id
          },
          select: {
            id: true,
            title: true,
            description: true,
            start_datetime: true,
            end_datetime: true,
            type: true,
            meeting_link: true,
            cases: {
              select: {
                id: true,
                caseId: true
              }
            }
          }
        })
        return res.json({
          events,
          googleToken: user.google_token
        })
      }
    } else {
      return res.json(errorCodes.NOT_FOUND)
    }
  },
  deleteNote: async function (req, res) {
    await prisma.notes.delete({
      where: {
        id: req.body.id
      }
    })
    res.status(201).json({ succes: true })
  },
  saveNote: async function (req, res) {
    const { content, id } = req.body
    const user = req.user
    await prisma.notes.upsert({
      where: {
        id
      },
      update: {
        note_text: content
      },
      create: {
        note_text: content,
        user_id: user.id
      }
    })
    res.status(201).json({ success: true })
  },
  logout: function (req, res) {
    // Clear the refresh token cookie
    try {
      res.clearCookie('refresh_token', {
        httpOnly: true, // Make sure it's HTTP-only
        secure: true, // Secure cookie in production
        sameSite: 'None', // For cross-origin cookies (if needed)
        path: '/' // Ensure to clear the cookie from the same path
      })
    } catch (e) {
      console.log('Cookie couldn\'t be cleared, trying with Set-Cookie header for serverless')
      // Set-Cookie header to expire the refresh_token cookie
      res.setHeader('Set-Cookie', 'refresh_token=; Max-Age=0; Path=/; Secure=true; SameSite=None')
    }

    // Optionally send a response indicating the user has been logged out
    return res.status(200).json({ message: 'Logged out successfully' })
  },
  updateInactiveUser: async function (req, res) {
    const { isActive, caseId, userId, caseType } = req.body
    const generatedPassword = helper.generateRandomPassword()
    const hashPassword = await helper.hashPassword(generatedPassword)
    const updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        active: isActive,
        password_hash: hashPassword
      },
      select: {
        name: true,
        email: true,
        phone_number: true
      }
    })
    if (caseId) {
      let caseSubStatus = ''
      switch (caseType) {
        case 'Mediation':
          caseSubStatus = CaseSubTypes.PENDING_MEDIATION_PAYMENT
          break
        case 'Arbitrator':
          caseSubStatus = CaseSubTypes.PENDING_MEDIATION_PAYMENT
          break
        case 'Counsellor':
          caseSubStatus = CaseSubTypes.PENDING_MEDIATION_PAYMENT
          break
      }
      const newCase = await prisma.cases.update({
        where: {
          id: caseId
        },
        data: {
          case_type: caseType,
          status: CaseTypes.IN_PROGRESS,
          sub_status: caseSubStatus
        }
      })

      const caseEvent = await prisma.case_events.findFirst({
        where: {
          status_id: newCase.status,
          sub_status_id: newCase.sub_status
        }
      })

      await prisma.case_history.create({
        data: {
          case_id: newCase.id,
          case_event_id: caseEvent.id
        }
      })
    }
    const htmlBody = `
              <p>Hi ${updatedUser.name}, thanks for registering on KADR.live. Your account is now active.</p>
              <p>To login, use below credentials:</p> <br/>
              <p>Username : ${updatedUser.email}</p> <br/>
              <p>Password : ${generatedPassword} <p>`
    await helper.sendEmail(updatedUser.email, htmlBody)
    res.json({ success: true, message: 'User updated successfully.' })
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
  isEmailExist: async function (req, res) {
    const user = await prisma.user.findUnique({
      where: {
        email: req.query.email
      }
    })
    if (user) {
      res.json({ success: true })
    } else {
      res.json(errorCodes.NOT_FOUND)
    }
  },
  getAvailableLanguages: async function (req, res) {
    const availableLanguages = await prisma.available_languages.findMany()
    res.json(availableLanguages)
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
      if (Number(otpReset.otp) !== Number(otp)) {
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
        email,
        active: true
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
    try {
      const { id, title, description, start, end, type, caseId } = req.body
      const [user, lCase] = await Promise.all([
        prisma.user.findUnique({
          where: {
            id: req.user.id
          },
          select: {
            google_token: true
          }
        }),
        caseId == null
          ? {}
          : prisma.cases.findUnique({
            where: {
              id: caseId
            },
            select: {
              user_cases_first_partyTouser: {
                select: {
                  email: true
                }
              },
              user_cases_second_partyTouser: {
                select: {
                  email: true
                }
              }
            }
          })
      ])
      let attendees = [{ email: req.user.email }]
      if (lCase.user_cases_first_partyTouser) { attendees.push({ email: lCase?.user_cases_first_partyTouser?.email }) }
      if (lCase.user_cases_second_partyTouser) { attendees.push({ email: lCase?.user_cases_second_partyTouser?.email }) }

      oauth2Client.setCredentials(JSON.parse(user.google_token))
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
      const event = {
        summary: title,
        description,
        start: { dateTime: start, timeZone: 'Asia/Kolkata' },
        end: { dateTime: end, timeZone: 'Asia/Kolkata' },
        attendees,
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
          title,
          description,
          start_datetime: start,
          end_datetime: end,
          type: type.toUpperCase(),
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

  acceptMediationRequest: async function (req, res) {
    const { caseId } = req.body
    const { id } = req.user
    const caseRecord = await prisma.cases.findUnique({
      where: { id: caseId }, select: { second_party: true, first_party: true }
    })
    if (caseRecord.second_party !== id) {
      res.json({ success: false, message: 'Invalid Request' })
    }

    await prisma.cases.update({
      where: {
        id: caseId
      },
      data: {
        status: CaseTypes.IN_PROGRESS,
        sub_status: CaseSubTypes.PENDING_MEDIATION_PAYMENT
      }
    })

    await prisma.notifications.create({
      data: {
        user_id: caseRecord.first_party,
        title: 'Opposite party has accepted the mediation request',
        description: 'Opposite party has accepted the mediation request, please go ahead and make the payment to start the mediation'
      }
    })

    await prisma.notifications.create({
      data: {
        user_id: caseRecord.second_party,
        title: 'Opposite party has accepted the mediation request',
        description: 'Opposite party has accepted the mediation request, please go ahead and make the payment to start the mediation'
      }
    })

    res.jsong({ success: true })
  },
  authenticateWithGoogle: async function (req, res) {
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
      const { name, email, phone, city, state, pincode, description, category, preferredLanguage, evidenceContent, profilePictureContent, oppositeName, oppositeEmail, oppositePhone, existingUser } = req.body
      let uploadedProfilePictureResponse = null
      if (profilePictureContent) { uploadedProfilePictureResponse = await helper.deployToS3Bucket(profilePictureContent, `profile-picture-${uuidv4()}`) }
      const userRequestData = {
        name,
        email,
        phone_number: phone,
        password_hash: '',
        user_type: 'CLIENT',
        active: false,
        city,
        state,
        preferred_languages: JSON.stringify([preferredLanguage]),
        profile_picture_url: uploadedProfilePictureResponse || '',
        pincode,
        is_self_signed_up: true
      }
      if (existingUser === true) {
        const generatedPassword = helper.generateRandomPassword()
        const hashPassword = await helper.hashPassword(generatedPassword)
        userRequestData.is_self_signed_up = true
        userRequestData.active = true
        userRequestData.password_hash = hashPassword
        await prisma.user.update({
          where: {
            email
          },
          data: userRequestData
        })
        const htmlBody = `
              <p>Hi ${name}, thanks for registering on KADR.live. Your account is now active.</p>
              <p>To login, use below credentials:</p> <br/>
              <p>Username : ${email}</p> <br/>
              <p>Password : ${generatedPassword} <p>`
        await helper.sendEmail(email, htmlBody)
        res.status(201).json({
          message: 'You are all set! Please check your email for the next steps.'
        })
      } else {
        let uploadedFileResponse = null
        if (evidenceContent) uploadedFileResponse = await helper.deployToS3Bucket(evidenceContent, `evidence-${uuidv4()}`)
        const user = await prisma.user.create({
          data: userRequestData
        })
        const oppositePartyUser = await prisma.user.upsert({
          where: {
            email: oppositeEmail
          },
          update: {

          },
          create: {
            name: oppositeName,
            email: oppositeEmail,
            phone_number: oppositePhone,
            password_hash: '',
            is_self_signed_up: false,
            user_type: 'CLIENT',
            active: false
          }
        })

        const tracker = await prisma.caseIdTracker.findFirst()
        let newCaseId = 1
        if (tracker) {
          newCaseId = tracker.lastCaseId + 1
        }

        await prisma.cases.create({
          data: {
            first_party: user.id,
            second_party: oppositePartyUser.id,
            evidence_document_url: uploadedFileResponse || '',
            description,
            category,
            status: CaseTypes.NEW,
            caseId: `KDR-${newCaseId}`
          }
        })

        await prisma.caseIdTracker.upsert({
          where: { id: 1 },
          update: { lastCaseId: newCaseId },
          create: { lastCaseId: newCaseId }
        })
        const htmlBody = `<p>Hi ${name}, thanks for registering on KADR.live. Your account is under review, and you'll be notified once approved by the KADR team.</p>`
        await helper.sendEmail(email, htmlBody)

        res.status(201).json({
          message: 'User created successfully! Your account is under review, and you\'ll be notified once approved by the KADR team.'
        })
      }
    } catch (error) {
      console.log(error)
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        res.status(201).json(errorCodes.YOU_USER_ALREADY_EXISTS)
      } else {
        res.status(500).json(errorCodes.INVALID_REQUEST)
      }
    }
  },
  newMediatorSignup: async function (req, res) {
    try {
      const { name, email, phone, city, state, pincode, preferredLanguages, llbCollege, llbUniversity, llbYear, profilePictureContent, mediatorCourseYear, mcpcCertificateContent, llbCertificateContent, preferredAreaOfPractice, selectedHearingTypes, barEnrollmentNo } = req.body.userDetails

      let uploadedMCPCFileResponse = null; let uploadedLLbFileResponse = null; let uploadedProfilePictureResponse = null
      if (mcpcCertificateContent) { uploadedMCPCFileResponse = await helper.deployToS3Bucket(mcpcCertificateContent, `mcpc-certificate-${uuidv4()}`) }
      if (llbCertificateContent) { uploadedLLbFileResponse = await helper.deployToS3Bucket(llbCertificateContent, `llb-certificate-${uuidv4()}`) }
      if (profilePictureContent) { uploadedProfilePictureResponse = await helper.deployToS3Bucket(profilePictureContent, `profile-picture-${uuidv4()}`) }

      await prisma.user.create({
        data: {
          name,
          email,
          phone_number: phone,
          password_hash: '',
          user_type: 'MEDIATOR',
          active: false,
          city,
          state,
          preferred_languages: JSON.stringify(preferredLanguages),
          pincode,
          is_self_signed_up: true,
          llb_college: llbCollege,
          llb_university: llbUniversity,
          llb_year: llbYear,
          mediator_course_year: mediatorCourseYear,
          mcpc_certificate_url: uploadedMCPCFileResponse || '',
          llb_certificate_url: uploadedLLbFileResponse || '',
          profile_picture_url: uploadedProfilePictureResponse || '',
          preferred_area_of_practice: JSON.stringify(preferredAreaOfPractice),
          selected_hearing_types: JSON.stringify(selectedHearingTypes),
          bar_enrollment_no: barEnrollmentNo
        }
      })

      await helper.addLanguagesToDatabase(preferredLanguages, prisma)

      const htmlBody = `<p>Hi ${name}, thanks for registering on KADR.live. Your account is under review, and you'll be notified once approved by the KADR team.</p>`
      await helper.sendEmail(email, htmlBody)

      res.status(201).json({
        message: 'User created successfully! Your account is under review, and you\'ll be notified once approved by the KADR team.'
      })
    } catch (error) {
      console.log(error)
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        res.status(201).json(errorCodes.YOU_USER_ALREADY_EXISTS)
      } else {
        res.status(500).json(errorCodes.INVALID_REQUEST)
      }
    }
  },
  login: async function (req, res) {
    const { username, password } = req.body
    const user = await prisma.user.findFirst({
      where: {
        email: username
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
        secure: true, // Ensure the cookie is secure in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'None', // Allow cross-origin cookies (if necessary)
        path: '/'
      })
    } catch (e) {
      console.log('Cookie couldnt set, trying with setHeader')
      res.setHeader('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Max-Age=604800000; Path=/; Secure=true`)
    }
    res.status(201).json({ accessToken })
  },
  getUserData: async function (req, res) {
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
      res.status(401).json(errorCodes.UNAUTHORIZED)
    }
  },
  refreshToken: function (req, res) {
    const refreshToken = req.cookies.refresh_token
    if (!refreshToken) {
      return res.status(401).json(errorCodes.NO_REFRESH_TOKEN)
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json(errorCodes.REFRESH_TOKEN_EXPIRED)
      }
      const newAccessToken = helper.generateAccessToken(user)

      res.json({ accessToken: newAccessToken })
    })
  },
  getActiveUsers: async function (req, res) {
    try {
      const { page = 1, type } = req.query

      if (type) {
        // Fetch data for a specific user type
        const relationField = type === 'CLIENT' ? 'cases_cases_first_partyTouser' : 'cases_cases_mediatorTouser'
        const activeUsers = await helper.getUsers(true, prisma, page, type, relationField)
        res.json({ success: true, users: activeUsers.users, total: activeUsers.total })
      } else {
        // Fetch both clients and mediators
        const [activeClients, activeMediators] = await Promise.all([
          helper.getUsers(true, prisma, page, 'CLIENT', 'cases_cases_first_partyTouser'),
          helper.getUsers(true, prisma, page, 'MEDIATOR', 'cases_cases_mediatorTouser')
        ])

        const combinedUsers = [...activeClients.users, ...activeMediators.users]
        res.json({ success: true, users: combinedUsers, total: combinedUsers.length })
      }
    } catch (error) {
      console.error('Error fetching active users:', error)
      res.status(500).json({ success: false, message: 'Failed to fetch active users' })
    }
  }
}
