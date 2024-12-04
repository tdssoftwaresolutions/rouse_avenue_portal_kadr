const express = require('express')
const router = express.Router()
const apiController = require('../controller/apiController')

// V1 APIs
router.post('/sendemail/:email/:name', apiController.sendEmail)
router.post('/newUserSignup', apiController.newUserSignup)
router.post('/login', apiController.login)
router.post('/refresh-token', apiController.refreshToken)
router.get('/getUserData', apiController.getUserData)
router.post('/verify-signature', apiController.verifySignature)
router.get('/generatePassword', apiController.generatePassword)
router.get('/scheduleMeeting', apiController.scheduleMeeting)
module.exports = router
