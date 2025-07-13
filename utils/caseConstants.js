const CaseSubTypes = Object.freeze({
  MEDIATOR_ASSIGNED: 'mediator_assigned',
  MEETING_SCHEDULED: 'meeting_scheduled',
  PENDING_COMPLAINANT_SIGNATURE: 'pending_complainant_signature',
  PENDING_RESPONDENT_SIGNATURE: 'pending_respondent_signature',
  PENDING_MEDIATION_CENTER: 'pending_mc'
})

const CaseTypes = Object.freeze({
  FAILED: 'failed',
  IN_PROGRESS: 'in_progress',
  CANCELLED: 'cancelled',
  CLOSED_NO_SUCCESS: 'closed_no_success',
  CLOSED_SUCCESS: 'closed_success',
  ESCALATED: 'escalated',
  NEW: 'new',
  ON_HOLD: 'on_hold',
  PENDING: 'pending'
})

module.exports = {
  CaseSubTypes,
  CaseTypes
}
