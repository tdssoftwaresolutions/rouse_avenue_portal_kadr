const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const helper = require('../utils/helper')
const errorCodes = require('../utils/errors/errorCodes')
const { createError } = require('../utils/errors')
const { CaseSubTypes, CaseTypes } = require('../utils/caseConstants')
const { success } = require('../utils/responses')

module.exports = {
  assignMediator: async function (req, res, next) {
    try {
      const { caseId, mediatorId } = req.body

      if (!caseId || !mediatorId) throw createError(errorCodes.MISSING_REQUIRED_DETAIL)

      const mediator = await prisma.user.findUnique({
        where: { id: mediatorId },
        select: { id: true, user_type: true, email: true, google_token: true }
      })

      if (!mediator || mediator.user_type !== 'MEDIATOR') throw createError(errorCodes.NOT_FOUND)

      await prisma.cases.update({
        where: { id: caseId },
        data: { mediator: mediatorId, status: CaseTypes.IN_PROGRESS, sub_status: CaseSubTypes.MEDIATOR_ASSIGNED }
      })

      const caseDetails = await prisma.cases.findUnique({
        where: { id: caseId },
        select: {
          caseId: true,
          mediation_date_time: true,
          user_cases_first_partyTouser: { select: { email: true, name: true } },
          user_cases_second_partyTouser: { select: { email: true, name: true } }
        }
      })

      if (!mediator.google_token) throw createError(errorCodes.GOOGLE_CALENDAR_NOT_CONNECTED)

      const oauth2Client = await helper.getValidAccessToken(prisma, JSON.parse(mediator.google_token).credentials)

      const title = 'First mediation meeting'
      const description = `First mediation meeting for case ${caseDetails.caseId} between ${caseDetails.user_cases_first_partyTouser.name} and ${caseDetails.user_cases_second_partyTouser.name}.`
      const start = new Date(caseDetails.mediation_date_time)
      const end = new Date(start.getTime() + 30 * 60000)
      const attendees = [
        { email: mediator.email },
        { email: caseDetails.user_cases_first_partyTouser.email },
        { email: caseDetails.user_cases_second_partyTouser.email }
      ]

      const googleEventResponse = await helper.createGoogleEvent(title, description, start, end, attendees, caseId + '-' + mediatorId, oauth2Client)

      await prisma.events.create({
        data: {
          title,
          description,
          start_datetime: start,
          end_datetime: end,
          type: 'ROUSE',
          meeting_link: googleEventResponse.data.conferenceData.entryPoints[0].uri,
          google_calendar_link: googleEventResponse.data.htmlLink,
          created_by: mediatorId,
          case_id: caseId
        }
      })

      success(res, {}, 'Mediator assigned and first meeting initiated successfully')
    } catch (error) {
      next(error)
    }
  },
  getAvailableMediators: async function (req, res, next) {
    try {
      const { caseId } = req.query

      if (!caseId) throw createError(errorCodes.MISSING_REQUIRED_DETAIL)

      const caseRecord = await prisma.cases.findUnique({
        where: { id: caseId },
        select: {
          mediation_date_time: true,
          user_cases_mediatorTouser: {
            select: {
              id: true,
              name: true,
              email: true,
              phone_number: true
            }
          }
        }
      })

      if (!caseRecord || !caseRecord.mediation_date_time) throw createError(errorCodes.NO_RECORD_FOUND)

      const mediationDate = new Date(caseRecord.mediation_date_time)
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const mediationDay = daysOfWeek[mediationDate.getDay()]

      const mediators = await prisma.user.findMany({
        where: {
          user_type: 'MEDIATOR',
          working_day_of_week: {
            equals: mediationDay
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone_number: true,
          cases_cases_mediatorTouser: {
            select: {
              id: true,
              caseId: true,
              nature_of_suit: true,
              stage: true,
              status: true
            }
          }
        }
      })

      if (mediators.length === 0) throw createError(errorCodes.NO_RECORD_FOUND)

      success(res, {
        mediators,
        assignedMediator: caseRecord.user_cases_mediatorTouser || null
      })
    } catch (error) {
      next(error)
    }
  },
  listAllMediatorsWithCases: async function (req, res, next) {
    try {
      const mediators = await prisma.user.findMany({
        where: { user_type: 'MEDIATOR' },
        select: {
          id: true,
          name: true,
          phone_number: true,
          email: true,
          cases_cases_mediatorTouser: {
            select: {
              id: true,
              caseId: true,
              status: true,
              sub_status: true
            }
          }
        }
      })
      success(res, { mediators })
    } catch (error) {
      next(error)
    }
  }
}
