const apiController = require('../controller/apiController')

module.exports = async (req, res) => {
  return await apiController.getUserData(req, res)
}
