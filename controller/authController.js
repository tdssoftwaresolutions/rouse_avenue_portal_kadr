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
  resetPassword: async function (req, res, next) {
    try {
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
      if (!user) throw createError(errorCodes.INVALID_REQUEST)

      const createdAt = new Date()
      const expiresAt = new Date(createdAt.getTime() + 10 * 60000)
      const otp = Math.floor(100000 + Math.random() * 900000)
      await prisma.otp_resets.upsert({
        where: {
          email
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
          expires_at: expiresAt
        }
      })
      const htmlBody = `
                        <p>Hi, we have recieved your request to reset password for your account on Rouse Avenue Mediation Center.</p>
                        <p>To go ahead with this, please enter OTP: ${otp} on our platform to reset the password</p>
                      `
      await helper.sendEmail(email, htmlBody)
      success(res, next)
    } catch (error) {
      next(error)
    }
  },
  confirmPasswordChange: async function (req, res, next) {
    try {
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
      if (!otpReset) throw createError(errorCodes.INVALID_REQUEST)

      if (Number(otpReset.otp) !== Number(otp)) throw createError(errorCodes.INVALID_OTP)

      if (otpReset.expires_at < new Date()) throw createError(errorCodes.OTP_EXPIRED)

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
