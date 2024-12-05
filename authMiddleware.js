const helper = require('./helper')

const verifyToken = async (req, res, next) => {
  await helper.checkTokenAndFetch(req, res)
  next()
}

module.exports = verifyToken
