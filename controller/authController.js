const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const helper = require('../utils/helper')
const errorCodes = require('../utils/errors/errorCodes')
const { createError } = require('../utils/errors')
const { success } = require('../utils/responses')

module.exports = {
  login: async function (req, res, next) {
    try {
      const { username, password } = req.body
      const user = await prisma.user.findFirst({
        where: {
          email: username
        }
      })
      if (!user) throw createError(errorCodes.INVALID_CREDENTIALS)

      if (user.active === false) throw createError(errorCodes.USER_NOT_ACTIVE)

      const isPasswordValid = await helper.comparePassword(password, user.password_hash)
      if (!isPasswordValid) throw createError(errorCodes.INVALID_CREDENTIALS)

      const accessToken = helper.generateAccessToken(user)
      const refreshToken = helper.generateRefreshToken(user)
      try {
        res.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: 'None',
          path: '/'
        })
      } catch (e) {
        res.setHeader('Set-Cookie', `refresh_token=${refreshToken}; HttpOnly; Max-Age=604800000; Path=/; Secure=true`)
      }
      success(res, {
        accessToken
      })
    } catch (error) {
      next(error)
    }
  },
  logout: function (req, res, next) {
    try {
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/'
      })
    } catch (e) {
      res.setHeader('Set-Cookie', 'refresh_token=; Max-Age=0; Path=/; Secure=true; SameSite=None')
    }
    success(res, {}, 'Logged out successfully')
  },
  authenticateWithGoogle: async function (req, res, next) {
    try {
      const url = await helper.generateGoogleAuthUrl(req.user.id)
      success(res, {
        url
      })
    } catch (error) {
      next(error)
    }
  },
  googleCallback: async function (req, res, next) {
    try {
      const code = decodeURIComponent(req.query.code)
      const accessTokenStatus = await helper.getGoogleAccessToken(prisma, code)
      if (!accessTokenStatus) throw createError(errorCodes.AUTHENTICATION_FAILED)

      res.send('<html><body><h1>Your Google account is now connected. You can now close this window and return to the app.</h1></body></html>')
    } catch (error) {
      next(error)
    }
  },
  sendOtp: async function (req, res, next) {
    try {
      const { id } = req.body
      if (!id) throw createError(errorCodes.INVALID_REQUEST)

      const signatureTracking = await prisma.signature_tracking.findUnique(
        {
          where: {
            id
          },
          select: {
            case_id: true,
            user_id: true,
            case_agreement_id: true,
            cases: {
              select: {
                first_party: true,
                second_party: true,
                plaintiff_phone: true,
                respondent_phone: true
              }
            }
          }
        }
      )

      if (!signatureTracking) throw createError(errorCodes.INVALID_REQUEST)

      let phoneNumber = null

      if (signatureTracking.case_id != null) {
        if (signatureTracking.cases.first_party === signatureTracking.user_id) { phoneNumber = signatureTracking.cases.plaintiff_phone } else if (signatureTracking.cases.second_party === signatureTracking.user_id) { phoneNumber = signatureTracking.cases.respondent_phone }
      } else if (signatureTracking.case_agreement_id != null) {
        const caseRecord = await prisma.cases.findFirst({
          where: {
            case_agreement: {
              equals: signatureTracking.case_agreement_id
            }
          },
          select: {
            first_party: true,
            second_party: true,
            plaintiff_phone: true,
            respondent_phone: true
          }
        })
        if (caseRecord.first_party === signatureTracking.user_id) { phoneNumber = caseRecord.plaintiff_phone } else if (caseRecord.second_party === signatureTracking.user_id) { phoneNumber = caseRecord.respondent_phone }
      }

      if (!phoneNumber) throw createError(errorCodes.INVALID_REQUEST)

      const otp = Math.floor(100000 + Math.random() * 900000)
      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + 10 * 60000)
      const response = await prisma.otp_resets.create({
        data: {
          otp,
          created_at: createdAt,
          expires_at: expiresAt,
          type: 'MEDIATION'
        },
        select: {
          id: true
        }
      })

      await helper.sendOtpSMS(otp, phoneNumber)
      success(res, {
        requestId: response.id
      }, 'OTP sent successfully')
    } catch (error) {
      next(error)
    }
  },
  verifyOtp: async function (req, res, next) {
    try {
      const { requestId, otp } = req.body
      if (!requestId || !otp) throw createError(errorCodes.INVALID_REQUEST)

      const otpReset = await prisma.otp_resets.findUnique({
        where: {
          id: requestId
        },
        select: {
          otp: true,
          expires_at: true
        }
      })

      if (!otpReset) throw createError(errorCodes.INVALID_REQUEST)

      if (Number(otpReset.otp) !== Number(otp)) throw createError(errorCodes.INVALID_OTP)

      if (otpReset.expires_at < new Date()) throw createError(errorCodes.OTP_EXPIRED)

      await prisma.otp_resets.delete({
        where: {
          id: requestId
        }
      })

      success(res, {}, 'OTP verified successfully')
    } catch (error) {
      next(error)
    }
  },
  resetPassword: async function (req, res, next) {
    try {
      const email = req.body.emailAddress
      const user = await prisma.user.findFirst({
        where: {
          email,
          active: true,
          user_type: {
            not: 'CLIENT'
          }
        },
        select: {
          id: true
        }
      })
      if (!user) throw createError(errorCodes.INVALID_REQUEST)

      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + 10 * 60000)
      const otp = Math.floor(100000 + Math.random() * 900000)
      await prisma.otp_resets.upsert({
        where: {
          unique_email_type: {
            email,
            type: 'RESET_PASSWORD'
          }
        },
        update: {
          otp,
          created_at: createdAt,
          expires_at: expiresAt
        },
        create: {
          email,
          otp,
          created_at: createdAt,
          expires_at: expiresAt,
          type: 'RESET_PASSWORD'
        }
      })
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 6px; padding: 30px;">
            <h2 style="color: #333333; font-size: 22px; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="font-size: 16px; color: #444444; line-height: 1.5;">
              Hello,
            </p>
            <p style="font-size: 16px; color: #444444; line-height: 1.5;">
              We have received a request to reset the password for your account on <strong>Rouse Avenue Mediation Center</strong>.
            </p>
            <p style="font-size: 16px; color: #444444; line-height: 1.5;">
              To proceed, please use the following One-Time Password (OTP) on our platform to complete your password reset:
            </p>
            <div style="margin: 20px 0; padding: 12px; background-color: #f0f4ff; border-left: 4px solid #3c78d8; font-size: 18px; font-weight: bold; color: #2a2a2a;">
              ${otp}
            </div>
            <p style="font-size: 16px; color: #444444; line-height: 1.5;">
              If you did not request this password reset, please ignore this email. Your account remains secure.
            </p>
            <p style="font-size: 14px; color: #888888; margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px;">
              Regards,<br />
              Team Rouse Avenue Mediation Center
            </p>
          </div>
        </div>
      `

      await helper.sendEmail('Password Reset Request – Rouse Avenue Mediation Center', email, htmlBody)
      success(res, next)
    } catch (error) {
      next(error)
    }
  },
  confirmPasswordChange: async function (req, res, next) {
    try {
      const { emailAddress, otp, password } = req.body
      const otpReset = await prisma.otp_resets.findFirst({
        where: {
          email: emailAddress
        },
        select: {
          otp: true,
          expires_at: true
        }
      })
      if (!otpReset) throw createError(errorCodes.INVALID_REQUEST)

      if (Number(otpReset.otp) !== Number(otp)) throw createError(errorCodes.INVALID_OTP)

      if (otpReset.expires_at < new Date()) throw createError(errorCodes.OTP_EXPIRED)

      const hashPassword = await helper.hashPassword(password)
      await prisma.user.updateMany({
        where: {
          email: emailAddress
        },
        data: {
          password_hash: hashPassword
        }
      })
      await prisma.otp_resets.deleteMany({
        where: {
          email: emailAddress
        }
      })
      success(res, {}, 'Password reset successfully!')
    } catch (error) {
      next(error)
    }
  },
  refreshToken: function (req, res, next) {
    try {
      const refreshToken = req.cookies.refresh_token
      if (!refreshToken) throw createError(errorCodes.NO_REFRESH_TOKEN)

      jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
          return res.status(403).json(errorCodes.REFRESH_TOKEN_EXPIRED)
        }
        const newAccessToken = helper.generateAccessToken(user)

        res.json({ accessToken: newAccessToken })
      })
    } catch (error) {
      next(error)
    }
  }
}
