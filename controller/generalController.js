const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const helper = require('../utils/helper')
const errorCodes = require('../utils/errors/errorCodes')
const { v4: uuidv4 } = require('uuid')
const { createError } = require('../utils/errors')
const { success } = require('../utils/responses')
const { CaseSubTypes, CaseTypes } = require('../utils/caseConstants')

module.exports = {
  updateUserProfile: async function (req, res, next) {
    try {
      const userDetails = req.user
      const { name, phone_number, profile_picture, password } = req.body
      let uploadedProfilePictureResponse = null
      if (profile_picture) { uploadedProfilePictureResponse = await helper.deployToS3Bucket(profile_picture, `profile-picture-${uuidv4()}`) }
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
      success(res, {}, 'User profile updated successfully!')
    } catch (error) {
      next(error)
    }
  },
  getDashboardContent: async function (req, res, next) {
    try {
      const { id, type } = req.user
      const dashboardContent = {}

      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          user_type: true,
          phone_number: true,
          profile_picture_url: true
        }
      })

      if (!user) throw createError(errorCodes.USER_NOT_FOUND)

      const getUserNotes = () =>
        prisma.notes.findMany({
          where: { user_id: id },
          select: { id: true, note_text: true },
          orderBy: { created: 'desc' }
        })

      switch (type) {
        case 'MEDIATOR': {
          const [notes, casesWithEvents, total, todaysPersonalMeetings] = await Promise.all([
            getUserNotes(),
            helper.getMediatorCases(prisma, id, 1),
            helper.getMediatorCasesCount(prisma, id),
            helper.getTodaysPersonalMeetings(prisma, id)
          ])

          dashboardContent.notes = notes
          dashboardContent.myCases = { casesWithEvents, total, page: 1, perPage: 10 }
          dashboardContent.todaysEvent = helper.getTodaysEvents(casesWithEvents, todaysPersonalMeetings)
          dashboardContent.user = user
          break
        }

        case 'JUDGE': {
          const [notes, casesWithEvents, total, tracker, stats] = await Promise.all([
            getUserNotes(),
            helper.getJudgeCases(prisma, id, 1),
            helper.getJudgeCasesCount(prisma, id),
            prisma.caseIdTracker.findFirst(),
            (async () => {
              const [totalCases, inProgressCases, failedCases, successCases] = await Promise.all([
                prisma.cases.count({ where: { judge: id } }),
                prisma.cases.count({ where: { judge: id, status: { in: [CaseTypes.NEW, CaseTypes.IN_PROGRESS] } } }),
                prisma.cases.count({ where: { judge: id, status: CaseTypes.CLOSED_NO_SUCCESS } }),
                prisma.cases.count({ where: { judge: id, status: CaseTypes.CLOSED_SUCCESS } })
              ])
              return { totalCases, inProgressCases, failedCases, successCases }
            })()
          ])

          dashboardContent.notes = notes
          dashboardContent.myCases = { casesWithEvents, total, page: 1, perPage: 10 }
          dashboardContent.user = user
          dashboardContent.nextCaseId = tracker ? tracker.lastCaseId + 1 : 1
          dashboardContent.stats = stats
          break
        }

        case 'MC': {
          const [notes, casesWithEvents, total, stats] = await Promise.all([
            getUserNotes(),
            helper.getMediationCenterCases(prisma, 1),
            helper.getMediationCenterCasesCount(prisma),
            (async () => {
              const [totalAssigned, successCases, failedCases, pendingMC] = await Promise.all([
                prisma.cases.count({
                  where: {
                    mediator: { not: null },
                    NOT: { status: { in: [CaseTypes.CLOSED_SUCCESS, CaseTypes.CLOSED_NO_SUCCESS] } }
                  }
                }),
                prisma.cases.count({ where: { status: CaseTypes.CLOSED_SUCCESS } }),
                prisma.cases.count({ where: { status: CaseTypes.CLOSED_NO_SUCCESS } }),
                prisma.cases.count({ where: { sub_status: helper.CaseSubTypes.PENDING_MEDIATION_CENTER } })
              ])
              return { totalAssigned, successCases, failedCases, pendingMC }
            })()
          ])

          dashboardContent.notes = notes
          dashboardContent.myCases = { casesWithEvents, total, page: 1, perPage: 10 }
          dashboardContent.user = user
          dashboardContent.stats = stats
          break
        }
      }

      success(res, { dashboardContent })
    } catch (error) {
      next(error)
    }
  },
  newCase: async function (req, res, next) {
    try {
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

      success(res, {}, 'New case created successfully!')
    } catch (error) {
      next(error)
    }
  },
  getInactiveUsers: async function (req, res, next) {
    try {
      const type = req.query.type
      const relationField = type === 'CLIENT' ? 'cases_cases_first_partyTouser' : 'cases_cases_mediatorTouser'
      const inactiveUsers = await helper.getUsers(false, prisma, req.query.page, type, relationField)
      success(res, inactiveUsers)
    } catch (error) {
      next(error)
    }
  },
  getMyCases: async function (req, res, next) {
    try {
      const [casesWithEvents, casesCount] = await Promise.all([
        helper.getMediatorCases(prisma, req.user.id, req.query.page),
        helper.getMediatorCasesCount(prisma, req.user.id)
      ])
      success(res, {
        casesWithEvents, total: casesCount, page: 1, perPage: 10
      })
    } catch (error) {
      next(error)
    }
  },
  getCalendarInit: async function (req, res, next) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id
        },
        select: {
          id: true,
          google_token: true
        }
      })
      if (!user) throw createError(errorCodes.NOT_FOUND)

      if (user.google_token == null) throw createError(errorCodes.GOOGLE_ACCOUNT_NOT_CONFIGURED)

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
      success(res, {
        events,
        googleToken: user.google_token
      })
    } catch (error) {
      next(error)
    }
  },
  deleteNote: async function (req, res, next) {
    try {
      await prisma.notes.delete({
        where: {
          id: req.body.id
        }
      })
      success(res, {}, 'Your note has been deleted successfully!')
    } catch (error) {
      next(error)
    }
  },
  saveNote: async function (req, res, next) {
    try {
      const { content, id } = req.body
      const user = req.user
      const response = await prisma.notes.upsert({
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
      success(res, {
        noteId: response.id
      }, 'Your note has been successfully saved!')
    } catch (error) {
      next(error)
    }
  },
  newCalendarEvent: async function (req, res, next) {
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
      if (!user.google_token) throw createError(errorCodes.GOOGLE_CALENDAR_NOT_CONNECTED)

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

      success(res, {
        eventLink: googleEventResponse.data.htmlLink,
        meetLink: googleEventResponse.data.conferenceData.entryPoints[0].uri
      }, 'Event created successfully')
    } catch (err) {
      next(err)
    }
  },
  getUserData: async function (req, res, next) {
    try {
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

      success(res, {
        userData,
        signature
      })
    } catch (error) {
      next(error)
    }
  },
  verifySignature: function (req, res, next) {
    try {
      const { userData, signature } = req.body
      if (!helper.verifySignature(userData, signature)) throw createError(errorCodes.UNAUTHORIZED)

      success(res, { valid: true })
    } catch (error) {
      next(error)
    }
  },
  getMediationData: async function (req, res, next) {
    try {
      const { caseId } = req.query
      if (!caseId) throw createError(errorCodes.REQUIRED_CASE_ID)

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
      if (!caseRecord) throw createError(errorCodes.CASE_NOT_FOUND)

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

      success(res, {
        caseId,
        status: caseRecord.status,
        sub_status: caseRecord.sub_status,
        mediator: caseRecord.user_cases_mediatorTouser,
        events,
        agreement
      })
    } catch (error) {
      next(error)
    }
  },
  markCaseResolved: async function (req, res, next) {
    try {
      const { caseId, resolveStatus, agreementText, signature } = req.body
      if (!caseId || !resolveStatus || !agreementText || !signature) throw createError(errorCodes.MISSING_REQUIRED_DETAIL)

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
      if (!caseRecord) throw createError(errorCodes.CASE_NOT_FOUND)

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

      success(res, {}, 'Case marked as resolved')
    } catch (error) {
      next(error)
    }
  },
  submitEventFeedback: async function (req, res, next) {
    try {
      const { event_feedback, event_id } = req.body
      if (!event_feedback || !event_id) throw createError(errorCodes.MISSING_REQUIRED_DETAIL)

      const feedbackRecord = await prisma.event_feedback.create({
        data: {
          first_party_present: event_feedback.first_party_present,
          second_party_present: event_feedback.second_party_present,
          summary_of_meeting: event_feedback.summary
        }
      })

      await prisma.events.update({
        where: { id: event_id },
        data: { event_feedback_id: feedbackRecord.id }
      })

      success(res, {}, 'Event feedback submitted successfully')
    } catch (error) {
      next(error)
    }
  }
}
