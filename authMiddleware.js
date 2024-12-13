const errorCodes = require('./errorCodes')
const helper = require('./helper')

const verifyToken = async (req, res, next) => {
  try {
    const error = await helper.checkTokenAndFetch(req, res)
    if (error) {
      return res.status(error.status || 401).json(error.message)
    }
    next()
  } catch (err) {
    res.status(500).json(errorCodes.INTERNAL_SERVER_ERROR)
  }
}

module.exports = verifyToken
