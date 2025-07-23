const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const errorCodes = require('./errors/errorCodes')
const { google } = require('googleapis')
const { CaseSubTypes, CaseTypes } = require('../utils/caseConstants')
const qs = require('qs')
const axios = require('axios')

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/googleCallback`
)

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

  static async getMediatorCasesCount (prisma, mediatorId) {
    return prisma.cases.count({
      where: {
        mediator: mediatorId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      }
    })
  }

  static getTodaysEvents (casesWithEvents, personalEvents) {
    const caseEvents = casesWithEvents.flatMap(caseItem => {
      return (caseItem.events)
        .filter(event => {
          const date = new Date()
          return new Date(event.start_datetime).toISOString().split('T')[0] === new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
        })
        .map(event => ({
          type: 'ROUSE',
          caseNumber: caseItem?.caseId,
          startDate: event.start_datetime,
          endDate: event.end_datetime,
          firstPartyName: caseItem?.user_cases_first_partyTouser?.name || 'N/A',
          secondPartyName: caseItem?.user_cases_second_partyTouser?.name || 'N/A',
          meetingLink: event.meeting_link
        }))
    })
    const pEvents = personalEvents.filter(event => {
      const date = new Date()
      return new Date(event.start_datetime).toISOString().split('T')[0] === new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0]
    })
      .map(event => ({
        type: 'PERSONAL',
        caseNumber: '',
        startDate: event.start_datetime,
        endDate: event.end_datetime,
        firstPartyName: '',
        secondPartyName: '',
        meetingLink: event.meeting_link,
        title: event.title,
        description: event.description
      }))

    return caseEvents.concat(pEvents).sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }

  static async getTodaysPersonalMeetings (prisma, mediatorId) {
    const today = new Date()
    const startOfToday = new Date(today.setHours(0, 0, 0, 0))
    const endOfToday = new Date(today.setHours(23, 59, 59, 999))
    return prisma.events.findMany({
      where: {
        created_by: mediatorId,
        type: 'PERSONAL',
        start_datetime: {
          gte: startOfToday, // Greater than or equal to the start of today
          lte: endOfToday // Less than or equal to the end of today
        }
      },
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
    })
  }

  static async getJudgeCasesCount (prisma, judgeId) {
    return prisma.cases.count({
      where: {
        judge: judgeId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      }
    })
  }

  static async getMediationCenterCasesCount (prisma) {
    return prisma.cases.count({
      where: {
        OR: [
          {
            AND: [
              {
                OR: [
                  { sub_status: CaseSubTypes.PENDING_MEDIATION_CENTER },
                  { sub_status: CaseSubTypes.MEDIATOR_ASSIGNED }
                ]
              },
              {
                OR: [
                  { status: CaseTypes.NEW },
                  { status: CaseTypes.IN_PROGRESS }
                ]
              }
            ]
          },
          {
            status: CaseTypes.CLOSED_SUCCESS,
            sub_status: null
          }
        ]
      }
    })
  }

  static async getMediationCenterCases (prisma, page) {
    const perPage = 10
    const skip = (page - 1) * perPage

    return prisma.cases.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                OR: [
                  { sub_status: CaseSubTypes.PENDING_MEDIATION_CENTER },
                  { sub_status: CaseSubTypes.MEDIATOR_ASSIGNED }
                ]
              },
              {
                OR: [
                  { status: CaseTypes.NEW },
                  { status: CaseTypes.IN_PROGRESS }
                ]
              }
            ]
          },
          {
            status: CaseTypes.CLOSED_SUCCESS,
            sub_status: null
          }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: perPage,
      select: {
        id: true,
        mediator: true,
        first_party: true,
        second_party: true,
        caseId: true,
        judge_document_url: true,
        nature_of_suit: true,
        stage: true,
        suit_no: true,
        status: true,
        hearing_count: true,
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
        user_cases_first_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_mediatorTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user_cases_judgeTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  static async getJudgeCases (prisma, judgeId, page) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    return prisma.cases.findMany({
      where: {
        judge: judgeId,
        OR: [
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        mediator: true,
        first_party: true,
        second_party: true,
        caseId: true,
        judge_document_url: true,
        nature_of_suit: true,
        stage: true,
        suit_no: true,
        status: true,
        hearing_count: true,
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
        user_cases_first_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_mediatorTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
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
          { status: CaseTypes.NEW },
          { status: CaseTypes.IN_PROGRESS }
        ]
      },
      orderBy: {
        created_at: 'desc'
      },
      skip, // Skip items for pagination
      take: perPage, // Limit the number of items per page
      select: {
        id: true,
        mediator: true,
        first_party: true,
        second_party: true,
        judge: true,
        caseId: true,
        judge_document_url: true,
        nature_of_suit: true,
        stage: true,
        suit_no: true,
        status: true,
        hearing_count: true,
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
        user_cases_first_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_second_partyTouser: {
          select: {
            id: true,
            name: true,
            email: true,
            phone_number: true,
            city: true,
            state: true
          }
        },
        user_cases_mediatorTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        user_cases_judgeTouser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        events: {
          orderBy: {
            start_datetime: 'desc'
          },
          select: {
            id: true,
            title: true,
            description: true,
            start_datetime: true,
            end_datetime: true,
            type: true,
            event_feedback_id: true,
            meeting_link: true
          }
        }
      }
    })
  }

  static async deployToS3Bucket (base64Content, fileName) {
    try {
      const s3 = new S3Client({
        region: 'eu-north-1',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        }
      })
      // Extract file extension from base64 string
      let mimeType, fileBuffer, extension, fullFileName

      const matches = base64Content.match(/^data:(.+);base64,(.+)$/)
      if (matches && matches.length === 3) {
        // Data URI format
        mimeType = matches[1]
        fileBuffer = Buffer.from(matches[2], 'base64')
        extension = mimeType.split('/')[1]
        fullFileName = `${fileName}.${extension}`
      } else {
        // Raw base64 (assume PDF)
        mimeType = 'application/pdf'
        fileBuffer = Buffer.from(base64Content, 'base64')
        extension = 'pdf'
        fullFileName = `${fileName}.${extension}`
      }

      // Upload to S3
      const params = {
        Bucket: 'kadr-files',
        Key: fullFileName,
        Body: fileBuffer,
        ContentType: mimeType
      }

      const command = new PutObjectCommand(params)
      await s3.send(command)

      return `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
    } catch (error) {
      console.error('Error uploading to S3:', error)
      throw error
    }
  }

  static async getUsers (isActive, prisma, page, type, relationField) {
    const perPage = 10

    // Calculate the number of items to skip
    const skip = (page - 1) * perPage

    let [inactiveUsers, totalInactiveUsers] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          AND: [
            { active: isActive },
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
          created_at: true,
          updated_at: true,
          user_type: true,
          active: true,
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
          llb_certificate_url: true,
          profile_picture_url: true,
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
            { active: isActive },
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

  static async getGoogleAccessToken (prisma, code) {
    try {
      const { tokens } = await oauth2Client.getToken(code)
      await prisma.user.updateMany({
        where: {
          OR: [
            { user_type: 'MEDIATOR' },
            { user_type: 'MC' }
          ]
        },
        data: {
          google_token: JSON.stringify(tokens)
        }
      })
      return true
    } catch (e) {
      console.error('Error retrieving access token', e)
      return false
    }
  }

  static async generateGoogleAuthUrl (userId) {
    const scopes = [
      'https://www.googleapis.com/auth/calendar.events',
      'https://www.googleapis.com/auth/calendar'
    ]

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      state: userId
    })
    return url
  }

  static isAccessTokenExpired (googleToken) {
    return Date.now() >= googleToken.expiry_date
  }

  static async getValidAccessToken (prisma, googleToken) {
    oauth2Client.setCredentials({
      access_token: googleToken.access_token,
      refresh_token: googleToken.refresh_token,
      expiry_date: googleToken.expiry_date
    })

    // Auto-refresh if expired
    if (this.isAccessTokenExpired(googleToken)) {
      const tokens = await oauth2Client.refreshAccessToken()
      const newTokens = tokens.credentials

      // Update user record in DB
      await prisma.user.updateMany({
        where: {
          OR: [
            { user_type: 'MEDIATOR' },
            { user_type: 'MC' }
          ]
        },
        data: {
          google_token: JSON.stringify(tokens)
        }
      })

      oauth2Client.setCredentials(newTokens)
    }

    return oauth2Client
  }

  static async createGoogleEvent (title, description, startDateTime, endDateTime, attendees, requestId, oauth2Client) {
    try {
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

      // Create Google Calendar event
      const event = {
        summary: title,
        description,
        start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
        end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
        attendees,
        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        },
        guestsCanInviteOthers: true,
        guestsCanModify: false,
        guestsCanSeeOtherGuests: true,
        anyoneCanAddSelf: true
      }

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      })

      return response
    } catch (error) {
      console.error('Error creating Google event:', error)
      throw error
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

  static verifyToken (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
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
      const user = await this.verifyToken(tokenWithoutBearer)
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
    const signature = crypto.createHmac('sha256', process.env.SIGN_SECRET_KEY)
      .update(dataString)
      .digest('hex')
    return signature
  }

  static generateAccessToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type ? user.user_type : user.type, name: user.name }, process.env.SECRET_KEY, { expiresIn: '1d' })
  }

  static generateRefreshToken (user) {
    return jwt.sign({ id: user.id, email: user.email, type: user.user_type ? user.user_type : user.type, name: user.name }, process.env.REFRESH_SECRET_KEY, { expiresIn: '7d' })
  }

  static async sendOtpSMS (otp, toNumber) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN

    const data = qs.stringify({
      To: `+91${toNumber}`,
      From: process.env.TWILIO_SENDER_NUMBER,
      Body: `Your OTP for identity verification on RAMC is ${otp}. Please enter this code to continue. Do not share it with anyone.`
    })

    try {
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
        data,
        {
          auth: {
            username: accountSid,
            password: authToken
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      )
      console.log('Message sent successfully:', response.data)
    } catch (error) {
      console.error('Error sending SMS:', error.response?.data || error.message)
    }
  }

  static async sendEmail (subject = 'Mail from Rouse Avenue Mediaton Center', emailId, htmlBody) {
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
        subject, // Subject line
        html: htmlBody
      }

      // Send the email
      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent to : ' + emailId + ' -- ' + info.response)

      // Send a response to the client
      return { message: 'Email sent successfully', info: info.response }
    } catch (error) {
      console.error('Error sending email:', error)
      return { message: 'Failed to send email', error }
    }
  }

  static async createSignatureTrackingRecord (prisma, userId, caseId, caseAgreementId) {
    try {
      const signatureExpiry = new Date()
      signatureExpiry.setHours(signatureExpiry.getHours() + 24) // Set expiry to 24 hours from now

      const record = await prisma.signature_tracking.create({
        data: {
          user_id: userId,
          case_id: caseId,
          signed: false,
          case_agreement_id: caseAgreementId,
          signature_expiry: signatureExpiry
        }
      })

      return record
    } catch (error) {
      console.error('Error creating signature tracking record:', error)
      throw error
    }
  }

  static renderSignature (signature, altText) {
    if (signature?.startsWith('data:')) {
      return `<img src="${signature}" alt="${altText}" />`
    } else {
      return `<div style="margin-top:40px;border-bottom:1px solid #000;display:inline-block;padding:4px 20px">${signature}</div>`
    }
  }

  static generateMediationHTML (data) {
    const {
      caseId,
      mediationCompletionDate,
      firstPartyName,
      secondPartyName,
      mediatorName,
      mutualAgreement,
      firstPartySignatureImage,
      secondPartySignatureImage,
      mediatorSignatureImage,
      judgeName
    } = data

    // Format mediationCompletionDate as DD.MM.YYYY
    let formattedCompletionDate = ''
    if (mediationCompletionDate) {
      const d = new Date(mediationCompletionDate)
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      formattedCompletionDate = `${day}.${month}.${year}`
    }

    return `
    <html>
       <head>
       <title> Mediaton ${firstPartyName} vs ${secondPartyName}</title> 
        <style>
          body {
            padding: 20px;
          }
  
          hr {
            margin: 20px 0;
            border: none;
            border-top: 2px solid #aaa;
          }
  
          .signature-block {
            margin-top: 30px;
          }
  
          .signature-row {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
          }
  
          .signature-col {
            width: 50%;
            text-align: center;
          }
  
          .signature-col img {
            max-width: 100%;
            height: auto;
            border-bottom: 1px solid #000;
          }
        </style>
      </head>
      <body>
        <div>
          <h3 style="text-align:center;width:100%;text-decoration:underline">IN THE DELHI MEDIATION CENTRE, ROHINI DISTRICT COURTS, DELHI</h3>

          <p style="text-decoration:underline"><strong>In the matter of:</p>
          <p><strong>Ct. Cases No.:</strong> ${caseId} </p>
          <p><strong>Case Title:</strong> ${firstPartyName} Vs. ${secondPartyName}</p>
          <p style="text-decoration:underline"><strong>Complaint Case:</strong> U/s. 138 N.I. Act</p>
          <p  style="text-decoration:underline><strong>Case received from the Court of:</strong></p>
          <p> ${judgeName}, North District, Rohini Courts, Delhi</p>

          <h3 style="text-align:center;text-decoration:underline;width:100%">Settlement / Agreement</h3>

          ${formattedCompletionDate}
          <p><strong>Present:</strong></p>
          <ul>
            <li>${firstPartyName}</li>
            <li>${secondPartyName}</li>
          </ul>

          <p>The present case has been received from the court of ${judgeName}, North District, Rohini Courts, Delhi and assigned to me for mediation.</p>

          ${mutualAgreement}

          <p>The parties have entered into the present scttlement/agreement without any prcssure, coercion, fear or undue influence from any side. Thepartics shall remain bound by the terms of present settlement, and that the parties shall co-operate for performance of the same.</p>

          <div class="section signature-block">
            <div class="signature-row">
              <div class="signature-col">
                <p><strong>${firstPartyName}</strong></p>
                ${this.renderSignature(firstPartySignatureImage, 'First Party Signature')}
              </div>
              <div class="signature-col">
                <p><strong>${secondPartyName}</strong></p>
                ${this.renderSignature(secondPartySignatureImage, 'Second Party Signature')}
              </div>
            </div>
          </div>
          <div class="section signature-block">
            <div class="signature-row">
              <div class="signature-col">
                <p><strong>${mediatorName}</strong></p>
                ${this.renderSignature(mediatorSignatureImage, 'Mediator Signature')}
              </div>
              <div class="signature-col">
              </div>
            </div>
          </div>

          <p>The contents of the settlement have been explained to the parties in Hindi and they have understood the same and have admitted the same to be correct. The setlement proceedings be sent to the Ld. Referral Court.</p>
        </div>
      </body>
    </html>
    `
  }
}

module.exports = Helper
