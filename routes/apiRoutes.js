const express = require('express')
const router = express.Router()
const apiController = require('../controller/apiController')
const authMiddleware = require('../authMiddleware')

// V1 APIs
router.post('/newUserSignup', apiController.newUserSignup)
router.post('/newMediatorSignup', apiController.newMediatorSignup)
router.post('/login', apiController.login)
router.post('/refresh-token', apiController.refreshToken)
router.get('/getUserData', authMiddleware, apiController.getUserData)
router.post('/verify-signature', authMiddleware, apiController.verifySignature)
router.get('/scheduleMeeting', authMiddleware, apiController.scheduleMeeting)
router.get('/getDashboardContent', authMiddleware, apiController.getDashboardContent)
router.get('/logout', apiController.logout)
router.post('/updateInactiveUser', apiController.updateInactiveUser)
router.get('/authenticateWithGoogle', authMiddleware, apiController.authenticateWithGoogle)
router.get('/googleCallback', apiController.googleCallback)
router.post('/newCalendarEvent', authMiddleware, apiController.newCalendarEvent)
router.post('/resetPassword', apiController.resetPassword)
router.post('/confirmPasswordChange', apiController.confirmPasswordChange)
router.get('/getAvailableLanguages', apiController.getAvailableLanguages)
router.get('/isEmailExist', apiController.isEmailExist)
router.get('/getInactiveUsers', authMiddleware, apiController.getInactiveUsers)

// Temperory APIs
router.post('/sendemail/:email/:name', apiController.sendEmail)
router.get('/generatePassword', apiController.generatePassword)

module.exports = router
