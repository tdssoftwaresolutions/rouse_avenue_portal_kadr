const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const helper = require('../helper')
const axios = require('axios')
const jwt = require('jsonwebtoken')
const clientId = process.env.ZOOM_CLIENT_ID
const clientSecret = process.env.ZOOM_CLIENT_SECRET
const accountId = process.env.ZOOM_ACCOUNT_ID
const errorCodes = require('../errorCodes')
const { v4: uuidv4 } = require('uuid')
const striptags = require('striptags')
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const os = require('os')
const CaseSubTypes = Object.freeze({
  MEDIATOR_ASSIGNED: 'mediator_assigned',
  MEETING_SCHEDULED: 'meeting_scheduled',
  PENDING_COMPLAINANT_SIGNATURE: 'pending_complainant_signature',
  PENDING_RESPONDENT_SIGNATURE: 'pending_respondent_signature',
  PENDING_MEDIATION_CENTER: 'pending_mc'
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

module.exports = {
  updateUserProfile: async function (req, res) {
    const userDetails = req.user
    const { name, phone_number, profile_picture, password } = req.body
    let uploadedProfilePictureResponse = null
    if (profile_picture) { uploadedProfilePictureResponse = await helper.deployToS3Bucket(profile_picture, `profile-picture-${uuidv4()}`) }
    console.log(uploadedProfilePictureResponse)
    try {
      await prisma.user.update({
        where: {
          id: userDetails.id
        },
        data: {
          name,
          phone_number,
          ...(uploadedProfilePictureResponse && { profile_picture_url: uploadedProfilePictureResponse }),
          ...(password && { password_hash: await helper.hashPassword(password) })
        }
      })
      res.json({ success: true })
    } catch (error) {
      console.error('Error updating user profile:', error)
      res.json(errorCodes.INVALID_REQUEST)
    } finally {
      await prisma.$disconnect()
    }
  },
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
          phone_number: true,
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
      } else if (user.user_type === 'JUDGE') {
        const [notes, casesWithEvents, casesCount, tracker, judgeStats] = await Promise.all([
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
          helper.getJudgeCases(prisma, userDetails.id, 1),
          helper.getJudgeCasesCount(prisma, userDetails.id),
          prisma.caseIdTracker.findFirst(),
          // Judge statistics
          (async () => {
            const totalCases = await prisma.cases.count({
              where: { judge: userDetails.id }
            })
            const inProgressCases = await prisma.cases.count({
              where: {
                judge: userDetails.id,
                status: { in: [CaseTypes.NEW, CaseTypes.IN_PROGRESS] }
              }
            })
            const failedCases = await prisma.cases.count({
              where: {
                judge: userDetails.id,
                status: CaseTypes.CLOSED_NO_SUCCESS
              }
            })
            const successCases = await prisma.cases.count({
              where: {
                judge: userDetails.id,
                status: CaseTypes.CLOSED_SUCCESS
              }
            })
            return {
              totalCases,
              inProgressCases,
              failedCases,
              successCases
            }
          })()
        ])
        dashboardContent.myCases = {
          casesWithEvents,
          total: casesCount,
          page: 1,
          perPage: 10
        }
        dashboardContent.notes = notes
        dashboardContent.user = user
        let newCaseId = 1
        if (tracker) { newCaseId = tracker.lastCaseId + 1 }
        dashboardContent.nextCaseId = newCaseId
        dashboardContent.stats = judgeStats
      } else if (user.user_type === 'MC') {
        const [notes, casesWithEvents, casesCount, mcStats] = await Promise.all([
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
          helper.getMediationCenterCases(prisma, 1),
          helper.getMediationCenterCasesCount(prisma),
          // MC statistics
          (async () => {
            const totalAssigned = await prisma.cases.count({
              where: {
                mediator: { not: null },
                NOT: {
                  status: {
                    in: [CaseTypes.CLOSED_SUCCESS, CaseTypes.CLOSED_NO_SUCCESS]
                  }
                }
              }
            })
            const successCases = await prisma.cases.count({
              where: { status: CaseTypes.CLOSED_SUCCESS }
            })
            const failedCases = await prisma.cases.count({
              where: { status: CaseTypes.CLOSED_NO_SUCCESS }
            })
            const pendingMC = await prisma.cases.count({
              where: { sub_status: CaseSubTypes.PENDING_MEDIATION_CENTER }
            })
            return {
              totalAssigned,
              successCases,
              failedCases,
              pendingMC
            }
          })()
        ])
        dashboardContent.myCases = {
          casesWithEvents,
          total: casesCount,
          page: 1,
          perPage: 10
        }
        dashboardContent.notes = notes
        dashboardContent.user = user
        dashboardContent.stats = mcStats
      }

      res.json({ success: true, dashboardContent })
    } catch (error) {
      res.json(errorCodes.INVALID_REQUEST)
      console.error('Error fetching user:', error)
    } finally {
      await prisma.$disconnect()
    }
  },
  newCase: async function (req, res) {
    const {
      hearingDate,
      suitNo,
      party1,
      party1Email,
      party2,
      party2Email,
      institutionDate,
      natureOfSuit,
      stage,
      hearingCount,
      mediationDateTime,
      referralJudgeSignature,
      plaintiffPhone,
      plaintiffAdvocate,
      respondentPhone,
      respondentAdvocate,
      document,
      judgeId
    } = req.body.caseData

    // Helper function to get or create a user
    async function getOrCreateUser (email, name) {
      let user = await prisma.user.findUnique({
        where: {
          email
        },
        select: {
          id: true
        }
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            user_type: 'CLIENT',
            active: true
          },
          select: {
            id: true
          }
        })
      }

      return user.id
    }

    // Get or create users for party1 and party2
    const firstPartyId = await getOrCreateUser(party1Email, party1)
    const secondPartyId = await getOrCreateUser(party2Email, party2)

    let uploadedDocumentResponse = null
    if (document) { uploadedDocumentResponse = await helper.deployToS3Bucket(document, `case-reference-document-${uuidv4()}`) }

    const tracker = await prisma.caseIdTracker.findFirst()
    let newCaseId = 1
    if (tracker) {
      newCaseId = tracker.lastCaseId + 1
    }

    const newCaseRecord = await prisma.cases.create({
      data: {
        first_party: firstPartyId,
        second_party: secondPartyId,
        judge_document_url: uploadedDocumentResponse,
        nature_of_suit: natureOfSuit,
        stage,
        status: CaseTypes.NEW,
        sub_status: CaseSubTypes.PENDING_COMPLAINANT_SIGNATURE,
        caseId: `ROUSE-MED-${newCaseId}`,
        suit_no: suitNo,
        hearing_count: hearingCount,
        hearing_date: new Date(hearingDate),
        institution_date: new Date(institutionDate),
        mediation_date_time: new Date(mediationDateTime),
        referral_judge_signature: referralJudgeSignature,
        plaintiff_phone: plaintiffPhone,
        plaintiff_advocate: plaintiffAdvocate,
        respondent_phone: respondentPhone,
        judge: judgeId,
        respondent_advocate: respondentAdvocate
      }
    })

    await prisma.caseIdTracker.upsert({
      where: { id: 1 },
      update: { lastCaseId: newCaseId },
      create: { lastCaseId: newCaseId }
    })

    const newSignatureRecord = await helper.createSignatureTrackingRecord(prisma, firstPartyId, newCaseRecord.id, null)

    const htmlBody = `
    <p>Hi ${party1}, <br/> A mediation request has been initiated by Rouse Avenue Court.<br/>You are identified as the first party in this mediation case. To proceed further with the case, we require your signature verification. <br/> Please click the link below to review and provide your signature:</p>
    <p><br/> Link to register - ${process.env.BASE_URL}/admin/signature?requestId=${newSignatureRecord.id}</p>`
    await helper.sendEmail('Signature Required: Mediation Request from Rouse Avenue Court', party1Email, htmlBody)

    res.json({ success: true, message: 'New case created successfully.' })
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
    <p>Hi ${caseDetails.user_cases_second_partyTouser.name}, we have recieved a mediation request from ${caseDetails.user_cases_first_partyTouser.name} on Rouse Avenue Mediation Center.</p>
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
              <p>Hi ${updatedUser.name}, thanks for registering on Rouse Avenue Mediation Center. Your account is now active.</p>
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
    const accessTokenStatus = await helper.getGoogleAccessToken(prisma, code)
    if (accessTokenStatus) {
      res.send('<html><body><h1>Your Google account is now connected. You can now close this window and return to the app.</h1></body></html>')
    } else {
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
                    <p>Hi, we have recieved your request to reset password for your account on Rouse Avenue Mediation Center.</p>
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

      // Set mediator's Google credentials
      if (!user.google_token) {
        return res.status(400).json({ success: false, message: 'Google Calendar not connected.' })
      }
      const oauth2Client = await helper.getValidAccessToken(prisma, JSON.parse(user.google_token).credentials)

      let attendees = [{ email: req.user.email }]
      if (lCase.user_cases_first_partyTouser) { attendees.push({ email: lCase?.user_cases_first_partyTouser?.email }) }
      if (lCase.user_cases_second_partyTouser) { attendees.push({ email: lCase?.user_cases_second_partyTouser?.email }) }

      const googleEventResponse = await helper.createGoogleEvent(title, description, start, end, attendees, id, oauth2Client)

      await prisma.events.create({
        data: {
          title,
          description,
          start_datetime: start,
          end_datetime: end,
          type: type.toUpperCase(),
          meeting_link: googleEventResponse.data.conferenceData.entryPoints[0].uri,
          google_calendar_link: googleEventResponse.data.htmlLink,
          created_by: req.user.id,
          case_id: caseId
        }
      })
      res.send({
        message: 'Event created successfully',
        eventLink: googleEventResponse.data.htmlLink,
        meetLink: googleEventResponse.data.conferenceData.entryPoints[0].uri
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
    const url = await helper.generateGoogleAuthUrl(req.user.id)
    res.json({ success: true, url })
  },
  generatePassword: async function (req, res) {
    const generatedPassword = helper.generateRandomPassword()
    console.log(generatedPassword)
    const hashPassword = await helper.hashPassword(generatedPassword)
    console.log(hashPassword)
    console.log(helper.generateGoogleAuthUrl('1'))
    res.json({ success: true })
  },
  sendEmail: async function (req, res) {
    const htmlBody = `
                <p>Hi ${req.params.name}, Someone has initiated a mediation request with you.</p>
                <p>To go ahead and this, please click on the link below to get started with your account:</p>
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
            caseId: `ROUSE-MED-${newCaseId}`
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
      'email': req.user.email
    }
    const user = await prisma.user.findFirst({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        profile_picture_url: true,
        phone_number: true,
        name: true
      }
    })
    userData.photo = user.profile_picture_url || ''
    userData.phone = user.phone_number || ''
    userData.name = user.name || ''

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
  getMediationData: async function (req, res) {
    try {
      const { caseId } = req.query
      if (!caseId) {
        return res.status(400).json({ success: false, message: 'Case ID is required.' })
      }

      // Fetch the case record with status, sub_status, and agreement tracking
      const caseRecord = await prisma.cases.findUnique({
        where: { id: caseId },
        select: {
          caseId: true,
          mediator: true,
          status: true,
          sub_status: true,
          case_agreement: true,
          user_cases_mediatorTouser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })
      if (!caseRecord) {
        return res.status(404).json({ success: false, message: 'Case not found.' })
      }

      // Fetch all events for this case, including related event_feedback
      const events = await prisma.events.findMany({
        where: { case_id: caseId },
        select: {
          id: true,
          title: true,
          description: true,
          start_datetime: true,
          end_datetime: true,
          type: true,
          meeting_link: true,
          google_calendar_link: true,
          event_feedback_id: true,
          event_feedback_events_event_feedback_idToevent_feedback: {
            select: {
              id: true,
              first_party_present: true,
              second_party_present: true,
              summary_of_meeting: true,
              created_at: true,
              updated_at: true
            }
          }
        }
      })

      let agreement = null
      if (caseRecord.case_agreement) {
        // Fetch all case_agreement_tracking records for this case
        agreement = await prisma.case_agreement_tracking.findUnique({
          where: {
            id: caseRecord.case_agreement
          },
          select: {
            id: true,
            agreed_terms: true,
            signature_mediator: true,
            first_party_signature: true,
            second_party_signature: true,
            created_at: true,
            updated_at: true
          }
        })
      }

      res.json({
        success: true,
        data: {
          caseId,
          status: caseRecord.status,
          sub_status: caseRecord.sub_status,
          mediator: caseRecord.user_cases_mediatorTouser,
          events,
          agreement
        }
      })
    } catch (error) {
      console.error('Error fetching mediation data:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  markCaseResolved: async function (req, res) {
    try {
      const { caseId, resolveStatus, agreementText, signature } = req.body
      if (!caseId || !resolveStatus || !agreementText || !signature) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' })
      }

      const caseRecord = await prisma.cases.findUnique({
        where: { id: caseId },
        select: {
          id: true,
          user_cases_first_partyTouser: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      })
      if (!caseRecord) {
        return res.status(404).json({ success: false, message: 'Case not found.' })
      }

      // Ensure correct model name: case_agreement_tracking (all lowercase)
      const agreementRecord = await prisma.case_agreement_tracking.create({
        data: {
          agreed_terms: agreementText,
          signature_mediator: signature
        }
      })

      await prisma.cases.update({
        where: { id: caseId },
        data: {
          case_agreement: agreementRecord.id,
          status: resolveStatus,
          sub_status: null
        }
      })

      const newSignatureRecord = await helper.createSignatureTrackingRecord(prisma, caseRecord.user_cases_first_partyTouser.id, null, agreementRecord.id)

      const htmlBody = `
     <p>Hi ${caseRecord.user_cases_first_partyTouser.name}, <br/> Congratulations, the mediation Rouse Avenue Court is now resolved.<br/>You are the first party in this mediation case. To proceed with the final agreement, we require your signature verification. <br/> Please click the link below to review and provide your signature:</p>
     <p><br/> Link to register - ${process.env.BASE_URL}/admin/agreement-signature?requestId=${newSignatureRecord.id}</p>`

      await helper.sendEmail('Signature Required: Mediation Agreement from Rouse Avenue Court', caseRecord.user_cases_first_partyTouser.email, htmlBody)

      res.json({ success: true, message: 'Case marked as resolved.' })
    } catch (error) {
      console.error('Error marking case as resolved:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  getAgreementDetailsForSignature: async function (req, res) {
    try {
      const { id } = req.query // id is signature_tracking id
      if (!id) {
        return res.status(400).json({ success: false, message: 'Signature tracking ID is required.' })
      }

      // Fetch signature_tracking record to get case_agreement_id
      const signatureTracking = await prisma.signature_tracking.findUnique({
        where: { id },
        select: {
          signed: true,
          case_agreement_id: true,
          user_id: true,
          case_agreement_tracking: {
            select: {
              id: true,
              created_at: true,
              agreed_terms: true
            }
          }
        }
      })
      if (!signatureTracking || signatureTracking.signed) {
        return res.status(404).json({ success: false, message: 'Signature tracking record not found.' })
      }

      // Find the case that references this agreement id
      let caseRecord = null
      if (signatureTracking.case_agreement_id) {
        caseRecord = await prisma.cases.findFirst({
          where: { case_agreement: signatureTracking.case_agreement_id },
          select: {
            id: true,
            caseId: true,
            nature_of_suit: true,
            created_at: true,
            case_agreement: true,
            user_cases_mediatorTouser: {
              select: {
                name: true
              }
            },
            user_cases_first_partyTouser: {
              select: {
                id: true,
                name: true
              }
            },
            user_cases_second_partyTouser: {
              select: {
                id: true,
                name: true
              }
            }
          }
        })
      }
      if (!caseRecord || !caseRecord.case_agreement) {
        return res.status(404).json({ success: false, message: 'Case or agreement not found.' })
      }

      let mediationCompletionDate = null
      let outcomeOfMediation = null
      const agreement = signatureTracking.case_agreement_tracking
      if (agreement) {
        mediationCompletionDate = agreement.created_at
        outcomeOfMediation = agreement.agreed_terms
      }

      // Fetch events for this case
      const events = await prisma.events.findMany({
        where: { case_id: caseRecord.id },
        select: {
          id: true,
          start_datetime: true
        }
      })

      // Prepare session dates (array of ISO date strings)
      const sessionDates = events.map(e => e.start_datetime)
      const numberOfSessions = events.length

      let userName = ''
      let isFirstPaty = false
      if (caseRecord.user_cases_first_partyTouser.id === signatureTracking.user_id) {
        userName = caseRecord.user_cases_first_partyTouser.name
        isFirstPaty = true
      } else if (caseRecord.user_cases_second_partyTouser.id === signatureTracking.user_id) {
        userName = caseRecord.user_cases_second_partyTouser.name
        isFirstPaty = false
      }

      res.json({
        success: true,
        data: {
          caseId: caseRecord.caseId,
          caseType: caseRecord.nature_of_suit,
          dateOfCaseRegistration: caseRecord.created_at,
          mediationCompletionDate,
          mediatorName: caseRecord.user_cases_mediatorTouser?.name || null,
          numberOfSessions,
          sessionDates,
          outcomeOfMediation,
          userName,
          firstPartyName: caseRecord.user_cases_first_partyTouser.name,
          secondPartyName: caseRecord.user_cases_second_partyTouser.name,
          isFirstPaty
        }
      })
    } catch (error) {
      console.error('Error fetching agreement details for signature:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  submitEventFeedback: async function (req, res) {
    try {
      const { event_feedback, event_id } = req.body
      if (!event_feedback || !event_id) {
        return res.status(400).json({ success: false, message: 'Missing event_feedback or event_id.' })
      }

      // Create event_feedback record
      const feedbackRecord = await prisma.event_feedback.create({
        data: {
          first_party_present: event_feedback.first_party_present,
          second_party_present: event_feedback.second_party_present,
          summary_of_meeting: event_feedback.summary
        }
      })

      // Update event with event_feedback_id
      await prisma.events.update({
        where: { id: event_id },
        data: { event_feedback_id: feedbackRecord.id }
      })

      res.json({ success: true, message: 'Event feedback submitted successfully.' })
    } catch (error) {
      console.error('Error submitting event feedback:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  assignMediator: async function (req, res) {
    try {
      const { caseId, mediatorId } = req.body // Read caseId and mediatorId from request body

      if (!caseId || !mediatorId) {
        return res.status(400).json({ success: false, message: 'Case ID and Mediator ID are required.' })
      }

      // Verify mediatorId is valid and user_type is 'MEDIATOR'
      const mediator = await prisma.user.findUnique({
        where: { id: mediatorId },
        select: { id: true, user_type: true, email: true, google_token: true }
      })

      if (!mediator || mediator.user_type !== 'MEDIATOR') {
        return res.status(400).json({ success: false, message: 'Invalid mediator ID or user is not a mediator.' })
      }

      // Update the case with the mediatorId
      await prisma.cases.update({
        where: { id: caseId },
        data: { mediator: mediatorId, status: CaseTypes.IN_PROGRESS, sub_status: CaseSubTypes.MEDIATOR_ASSIGNED }
      })

      // Fetch case details for event creation
      const caseDetails = await prisma.cases.findUnique({
        where: { id: caseId },
        select: {
          caseId: true,
          mediation_date_time: true,
          user_cases_first_partyTouser: { select: { email: true, name: true } },
          user_cases_second_partyTouser: { select: { email: true, name: true } }
        }
      })

      // Set mediator's Google credentials
      if (!mediator.google_token) {
        return res.status(400).json({ success: false, message: 'Google Calendar not connected.' })
      }
      const oauth2Client = await helper.getValidAccessToken(prisma, JSON.parse(mediator.google_token).credentials)

      const title = 'First mediation meeting'
      const description = `First mediation meeting for case ${caseDetails.caseId} between ${caseDetails.user_cases_first_partyTouser.name} and ${caseDetails.user_cases_second_partyTouser.name}.`
      const start = new Date(caseDetails.mediation_date_time)
      const end = new Date(start.getTime() + 30 * 60000) // 30 minutes later
      const attendees = [
        { email: mediator.email },
        { email: caseDetails.user_cases_first_partyTouser.email },
        { email: caseDetails.user_cases_second_partyTouser.email }
      ]

      const googleEventResponse = await helper.createGoogleEvent(title, description, start, end, attendees, caseId + '-' + mediatorId, oauth2Client)

      // Save event in DB
      await prisma.events.create({
        data: {
          title,
          description,
          start_datetime: start,
          end_datetime: end,
          type: 'ROUSE',
          meeting_link: googleEventResponse.data.conferenceData.entryPoints[0].uri,
          google_calendar_link: googleEventResponse.data.htmlLink,
          created_by: mediatorId,
          case_id: caseId
        }
      })

      res.json({ success: true, message: 'Mediator assigned and event created successfully.' })
    } catch (error) {
      console.error('Error assigning mediator:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  getAvailableMediators: async function (req, res) {
    try {
      const { caseId } = req.query // Read caseId from URL parameters

      if (!caseId) {
        return res.status(400).json({ success: false, message: 'Case ID is required.' })
      }

      // Fetch the case to get mediation_date_time
      const caseRecord = await prisma.cases.findUnique({
        where: { id: caseId },
        select: {
          mediation_date_time: true,
          user_cases_mediatorTouser: {
            select: {
              id: true,
              name: true,
              email: true,
              phone_number: true
            }
          }
        }
      })

      if (!caseRecord || !caseRecord.mediation_date_time) {
        return res.status(404).json({ success: false, message: 'Case or mediation date not found.' })
      }

      // Get the day of week from mediation_date_time
      const mediationDate = new Date(caseRecord.mediation_date_time)
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const mediationDay = daysOfWeek[mediationDate.getDay()]

      // Query the user table for mediators available on mediationDay
      const mediators = await prisma.user.findMany({
        where: {
          user_type: 'MEDIATOR',
          working_day_of_week: {
            equals: mediationDay // Use mediation day of week
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          cases_cases_mediatorTouser: {
            select: {
              id: true,
              caseId: true,
              nature_of_suit: true,
              stage: true,
              status: true
            }
          }
        }
      })

      if (mediators.length === 0) {
        return res.status(404).json({ success: false, message: 'No mediators available for the mediation date.' })
      }

      res.json({
        success: true,
        mediators,
        assignedMediator: caseRecord.user_cases_mediatorTouser || null
      })
    } catch (error) {
      console.error('Error fetching available mediators:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  submitAgreementSignature: async function (req, res) {
    try {
      const { requestId, signature } = req.body // Read requestId and signature from request body

      if (!requestId || !signature) {
        return res.status(400).json({ success: false, message: 'Request ID and signature are required.' })
      }

      // Query the signature_tracking record by requestId
      const signatureTracking = await prisma.signature_tracking.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          signed: true,
          user_id: true,
          case_agreement_id: true
        }
      })

      if (!signatureTracking) {
        return res.status(404).json({ success: false, message: 'No valid signature tracking record found.' })
      }

      // Mark the signature_tracking record as signed
      await prisma.signature_tracking.update({
        where: { id: requestId },
        data: { signed: true }
      })

      let caseRecord = null

      if (signatureTracking.case_agreement_id) {
        caseRecord = await prisma.cases.findFirst({
          where: { case_agreement: signatureTracking.case_agreement_id },
          select: {
            id: true,
            caseId: true,
            nature_of_suit: true,
            created_at: true,
            first_party: true,
            second_party: true,
            case_agreement: true,
            user_cases_mediatorTouser: {
              select: {
                name: true,
                email: true
              }
            },
            user_cases_first_partyTouser: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            user_cases_second_partyTouser: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            user_cases_judgeTouser: {
              select: {
                name: true,
                email: true,
                id: true
              }
            }
          }
        })
      }

      let sendRequestToSecondParty = false
      let generateAgeement = false
      // Update the case record based on the userId
      const updateData = {}
      if (signatureTracking.user_id === caseRecord.first_party) {
        updateData.first_party_signature = signature
        sendRequestToSecondParty = true
        generateAgeement = false
      } else if (signatureTracking.user_id === caseRecord.second_party) {
        updateData.second_party_signature = signature
        generateAgeement = true
        sendRequestToSecondParty = false
      } else {
        return res.status(400).json({ success: false, message: 'User ID does not match any party in the case.' })
      }

      if (sendRequestToSecondParty === true) {
        const newSignatureRecord = await helper.createSignatureTrackingRecord(prisma, caseRecord.second_party, null, signatureTracking.case_agreement_id)

        const htmlBody = `
        <p>Hi ${caseRecord.user_cases_second_partyTouser.name}, <br/> Congratulations, the medidation Rouse Avenue Court is now resolved.<br/>You are the second party in this mediation case. To proceed with the final agreement, we require your signature verification. <br/> Please click the link below to review and provide your signature:</p>
        <p><br/> Link to register - ${process.env.BASE_URL}/admin/agreement-signature?requestId=${newSignatureRecord.id}</p>`

        await helper.sendEmail('Signature Required: Mediation Request from Rouse Avenue Court', caseRecord.user_cases_second_partyTouser.email, htmlBody)
      }

      if (generateAgeement === true) {
        // Generate agreement document
        const agreement = await prisma.case_agreement_tracking.findUnique({
          where: { id: signatureTracking.case_agreement_id },
          select: {
            id: true,
            created_at: true,
            agreed_terms: true,
            first_party_signature: true,
            second_party_signature: true,
            signature_mediator: true
          }
        })

        const mediationData = {
          caseId: caseRecord.caseId,
          mediationCompletionDate: agreement?.created_at || null,
          mediatorName: caseRecord.user_cases_mediatorTouser?.name || null,
          mutualAgreement: agreement?.agreed_terms || null,
          firstPartyName: caseRecord.user_cases_first_partyTouser?.name || '',
          secondPartyName: caseRecord.user_cases_second_partyTouser?.name || '',
          firstPartySignatureImage: agreement?.first_party_signature || '',
          secondPartySignatureImage: agreement?.second_party_signature || updateData.second_party_signature || '',
          mediatorSignatureImage: agreement?.signature_mediator || '',
          judgeName: caseRecord.user_cases_judgeTouser?.name || ''
        }

        const html = helper.generateMediationHTML(mediationData)

        const tempDir = os.tmpdir()
        const tempPdfPath = path.join(tempDir, `mediation_document_${uuidv4()}.pdf`)
        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: 'networkidle0' })
        await page.pdf({
          path: tempPdfPath,
          format: 'A4',
          printBackground: true,
          margin: { top: '5mm', bottom: '5mm' }
        })
        await browser.close()

        // Read PDF as base64
        const pdfBuffer = fs.readFileSync(tempPdfPath)
        const pdfBase64 = pdfBuffer.toString('base64')

        updateData.mediation_agreement_link = await helper.deployToS3Bucket(pdfBase64, `case-agreement-${uuidv4()}`)
        fs.unlinkSync(tempPdfPath)
        const htmlBody = `
        <p>Hi, <br/> Please find below the link to signed agreement for your reference</p>
        <p><br/> Link: ${updateData.mediation_agreement_link}</p>`

        await helper.sendEmail('Mediation Agreement Copy', caseRecord.user_cases_second_partyTouser.email, htmlBody)
        await helper.sendEmail('Mediation Agreement Copy', caseRecord.user_cases_first_partyTouser.email, htmlBody)
        await helper.sendEmail('Mediation Agreement Copy', caseRecord.user_cases_mediatorTouser.email, htmlBody)
      }

      await prisma.case_agreement_tracking.update({
        where: { id: signatureTracking.case_agreement_id },
        data: updateData
      })

      res.json({ success: true, message: 'Signature submitted successfully.' })
    } catch (error) {
      console.error('Error submitting signature:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  submitSignature: async function (req, res) {
    try {
      const { requestId, signature } = req.body // Read requestId and signature from request body

      if (!requestId || !signature) {
        return res.status(400).json({ success: false, message: 'Request ID and signature are required.' })
      }

      // Query the signature_tracking record by requestId
      const signatureTracking = await prisma.signature_tracking.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          signed: true,
          case_id: true,
          user_id: true
        }
      })

      if (!signatureTracking) {
        return res.status(404).json({ success: false, message: 'No valid signature tracking record found.' })
      }

      // Mark the signature_tracking record as signed
      await prisma.signature_tracking.update({
        where: { id: requestId },
        data: { signed: true }
      })

      // Query the case record using case_id
      const caseRecord = await prisma.cases.findUnique({
        where: { id: signatureTracking.case_id },
        select: {
          id: true,
          first_party: true,
          second_party: true,
          user_cases_second_partyTouser: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      })

      if (!caseRecord) {
        return res.status(404).json({ success: false, message: 'No valid case record found.' })
      }

      let sendRequestToSecondParty = false
      // Update the case record based on the userId
      const updateData = {}
      if (signatureTracking.user_id === caseRecord.first_party) {
        updateData.plaintiff_signature = signature // Update plaintiff_signature
        updateData.status = CaseTypes.NEW
        updateData.sub_status = CaseSubTypes.PENDING_SECOND_PARTY_SIGNATURE // Set sub_status to pending second party signatur
        sendRequestToSecondParty = true
      } else if (signatureTracking.user_id === caseRecord.second_party) {
        updateData.respondent_signature = signature // Update respondent_signature
        updateData.status = CaseTypes.NEW
        updateData.sub_status = CaseSubTypes.PENDING_MEDIATION_CENTER
      } else {
        return res.status(400).json({ success: false, message: 'User ID does not match any party in the case.' })
      }

      if (sendRequestToSecondParty === true) {
        const newSignatureRecord = await helper.createSignatureTrackingRecord(prisma, caseRecord.second_party, caseRecord.id, null)

        const htmlBody = `
          <p>Hi ${caseRecord.user_cases_second_partyTouser.name}, <br/> A mediation request has been initiated by Rouse Avenue Court.<br/>You are identified as the second party in this mediation case. To proceed further with the case, we require your signature verification. <br/> Please click the link below to review and provide your signature:</p>
          <p><br/> Link to register - ${process.env.BASE_URL}/admin/signature?requestId=${newSignatureRecord.id}</p>`
        await helper.sendEmail('Signature Required: Mediation Request from Rouse Avenue Court', caseRecord.user_cases_second_partyTouser.email, htmlBody)
      }

      await prisma.cases.update({
        where: { id: caseRecord.id },
        data: updateData
      })

      res.json({ success: true, message: 'Signature submitted successfully.' })
    } catch (error) {
      console.error('Error submitting signature:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  },
  getSignatureRequestDetails: async function (req, res) {
    try {
      const { requestId } = req.query // Read requestId from URL parameters

      if (!requestId) {
        return res.status(400).json({ success: false, message: 'Request ID is required.' })
      }

      // Query the signature_tracking table
      const signatureTracking = await prisma.signature_tracking.findFirst({
        where: {
          id: requestId,
          signed: false
        },
        include: {
          user: true,
          cases: true // Pull related case table data using case_id
        }
      })

      if (!signatureTracking) {
        return res.status(404).json({ success: false, message: 'No valid signature request found.' })
      }

      // Query the case table for detailed case data
      const caseData = await prisma.cases.findUnique({
        where: { id: signatureTracking.case_id },
        select: {
          id: true,
          created_at: true,
          updated_at: true,
          mediator: true,
          caseId: true,
          judge_document_url: true,
          nature_of_suit: true,
          stage: true,
          case_type: true,
          status: true,
          sub_status: true,
          hearing_date: true,
          institution_date: true,
          mediation_date_time: true,
          referral_judge_signature: true,
          plaintiff_signature: true,
          plaintiff_phone: true,
          plaintiff_advocate: true,
          respondent_signature: true,
          respondent_phone: true,
          respondent_advocate: true,
          judge: true,
          suit_no: true,
          hearing_count: true,
          user_cases_first_partyTouser: {
            select: {
              id: true,
              name: true
            }
          },
          user_cases_second_partyTouser: {
            select: {
              id: true,
              name: true
            }
          },
          user_cases_judgeTouser: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })

      if (!caseData) {
        return res.status(404).json({ success: false, message: 'No case data found for the provided request.' })
      }

      let userName = ''
      let isFirstPaty = false
      if (caseData.user_cases_first_partyTouser.id === signatureTracking.user_id) {
        userName = caseData.user_cases_first_partyTouser.name
        isFirstPaty = true
      } else if (caseData.user_cases_second_partyTouser.id === signatureTracking.user_id) {
        userName = caseData.user_cases_second_partyTouser.name
        isFirstPaty = false
      }

      res.json({ success: true, caseData, userName, isFirstPaty })
    } catch (error) {
      console.error('Error fetching signature request details:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
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
  },
  listAllMediatorsWithCases: async function (req, res) {
    try {
      const mediators = await prisma.user.findMany({
        where: { user_type: 'MEDIATOR' },
        select: {
          id: true,
          name: true,
          phone_number: true,
          email: true,
          cases_cases_mediatorTouser: {
            select: {
              id: true,
              caseId: true,
              status: true,
              sub_status: true
            }
          }
        }
      })
      res.json({ success: true, mediators })
    } catch (error) {
      console.error('Error listing mediators with cases:', error)
      res.status(500).json({ success: false, message: 'Internal server error.' })
    }
  }
}
