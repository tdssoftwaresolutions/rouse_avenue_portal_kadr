const express = require('express')
const router = express.Router()
const generalController = require('../controller/generalController')
const mediatorController = require('../controller/mediatorController')
const signatureController = require('../controller/signatureController')
const authController = require('../controller/authController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/login', authController.login)
router.post('/refresh-token', authController.refreshToken)
router.get('/logout', authController.logout)
router.get('/authenticateWithGoogle', authMiddleware, authController.authenticateWithGoogle)
router.get('/googleCallback', authController.googleCallback)
router.post('/resetPassword', authController.resetPassword)
router.post('/confirmPasswordChange', authController.confirmPasswordChange)
router.post('/sendOtp', authController.sendOtp)
router.post('/verifyOTP', authController.verifyOtp)

router.get('/getUserData', authMiddleware, generalController.getUserData)
router.post('/verify-signature', authMiddleware, generalController.verifySignature)
router.get('/getDashboardContent', authMiddleware, generalController.getDashboardContent)
router.post('/newCalendarEvent', authMiddleware, generalController.newCalendarEvent)
router.post('/saveNote', authMiddleware, generalController.saveNote)
router.post('/deleteNote', authMiddleware, generalController.deleteNote)
router.get('/getCalendarInit', authMiddleware, generalController.getCalendarInit)
router.get('/getMyCases', authMiddleware, generalController.getMyCases)
router.post('/newCase', authMiddleware, generalController.newCase)
router.post('/submitEventFeedback', authMiddleware, generalController.submitEventFeedback)
router.post('/markCaseResolved', authMiddleware, generalController.markCaseResolved)
router.get('/getMediationData', authMiddleware, generalController.getMediationData)
router.post('/updateUserProfile', authMiddleware, generalController.updateUserProfile)

router.get('/getAvailableMediators', authMiddleware, mediatorController.getAvailableMediators)
router.post('/assignMediator', authMiddleware, mediatorController.assignMediator)
router.get('/listAllMediatorsWithCases', authMiddleware, mediatorController.listAllMediatorsWithCases)

router.get('/getSignatureRequestDetails', signatureController.getSignatureRequestDetails)
router.post('/submitSignature', signatureController.submitSignature)
router.get('/getAgreementDetailsForSignature', signatureController.getAgreementDetailsForSignature)
router.post('/submitAgreementSignature', signatureController.submitAgreementSignature)

module.exports = router
