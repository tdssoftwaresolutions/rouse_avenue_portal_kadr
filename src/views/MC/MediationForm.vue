<template>
  <div class="form-container">

    <h1 class="header">
      MEDIATION CENTRE<br />
      ROUSE AVENUE COURTS COMPLEX<br />
      NEW DELHI
    </h1>

    <b-tabs v-model="activeTab" class="mb-3">
      <b-tab title="Case Details">
        <div class="form-row">
          <label>CASE ID:</label>
          <input disabled :value="form.caseId" />
          <label>Next Date of Hearing in Referral Court:</label>
          <input type="date" v-model="form.hearingDate" disabled/>
        </div>

        <div class="form-row">
          <label>Name of the Referral Judge:</label>
          <input :value="form.judgeName" disabled />
        </div>

        <div class="form-row">
          <label>Suit No/Case No:</label>
          <input v-model="form.suitNo" disabled />
        </div>

        <div class="form-row">
          <label>Name of the Parties:</label>
          <div class="party-input-group">
            <input v-model="form.party1" placeholder="Party 1" disabled />
            <br />
            <input v-model="form.party1Email" placeholder="Party 1 Email" disabled />
          </div>
          <span style="margin-left:1rem;margin-right: 1rem;">vs</span>
          <div class="party-input-group">
            <input v-model="form.party2" placeholder="Party 2" disabled />
            <br />
            <input v-model="form.party2Email" placeholder="Party 2 Email" disabled />
          </div>
        </div>

        <div class="form-row">
          <label>Date of Institution of Case:</label>
          <input type="date" v-model="form.institutionDate" disabled />
          <label>Nature of Suit:</label>
          <input v-model="form.natureOfSuit" disabled />
        </div>

        <div class="form-row">
          <label>Stage of the Case at Time of Referral:</label>
          <input v-model="form.stage" disabled />
          <label>Number of Hearings at Time of Referral:</label>
          <input type="number" v-model.number="form.hearingCount" min="0" disabled />
        </div>

        <!-- Mediation Referral Order Block -->
        <div class="referral-section">
          <h2>Mediation Referral Order</h2>
          <p>
            This Court, having conferred with the parties and having determined that this matter could benefit from
            mediation, and pursuant to Section 89 of the CPC, Orders that the following persons shall attend mediation as
            provided by the court at no cost to the Parties.
          </p>

          <p>
            The above parties and advocates will report at <strong>Mediation Centre, Rouse Avenue Courts Complex,
            New Delhi</strong> on:
            <input type="datetime-local" v-model="form.mediationDateTime" class="inline-input" disabled />.
            If it is not possible to mediate this case on the date fixed, the Mediation Centre will arrange a future
            date for mediation convenient to the parties.
          </p>

          <p>
            The Mediation will be conducted by a specially trained <strong>Mediator</strong>.
          </p>

          <p>
            If a settlement agreeable to the parties is reached, the terms shall be recorded by the mediator and signed
            by the parties/their counsel and returned to this Court for further appropriate orders.
          </p>

          <p>
            If no settlement is reached, neither the parties, the advocates, nor the mediator may disclose to this court
            anything that was discussed at the mediation.
          </p>

          <div class="form-row">
            <label>Signature of Referral Judge:</label>
            <div>
              <div v-if="form.referralJudgeSignature.startsWith('data:image/')">
                <img :src="form.referralJudgeSignature" alt="Referral Judge Signature" style="max-width: 300px; border: 1px solid #ccc;" />
              </div>
              <div v-else-if="signatureType === 'digital'" class="digital-signature-box">
                <span class="cursive-signature">{{ form.referralJudgeSignature }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Signatures Section -->
        <div class="form-row signature-section">
          <div>
            <h4>Plaintiff/Complainant</h4>
            <div class="form-row">
              <label >Signature:</label>
              <div>
                <div v-if="form.plaintiffSignature.startsWith('data:image/')">
                  <img :src="form.plaintiffSignature" alt="Plaintiff Signature" style="max-width: 250px; height:70px; border: 1px solid #ccc;" />
                </div>
                <div v-else-if="signatureType === 'digital'" class="digital-signature-box">
                  <span class="cursive-signature">{{ form.plaintiffSignature }}</span>
                </div>
              </div>
            </div>
            <label>Phone No:</label>
            <input v-model="form.plaintiffPhone" disabled />
            <label>Name of Advocate:</label>
            <input v-model="form.plaintiffAdvocate" disabled />
          </div>

          <div>
            <h4>Respondent/Accused</h4>
            <div class="form-row">
              <label >Signature:</label>
              <div>
                <div v-if="form.respondentSignature.startsWith('data:image/')">
                  <img :src="form.respondentSignature" alt="Plaintiff Signature" style="max-width: 250px; height: 70px; border: 1px solid #ccc;" />
                </div>
                <div v-else-if="signatureType === 'digital'" class="digital-signature-box">
                  <span class="cursive-signature">{{ form.respondentSignature }}</span>
                </div>
              </div>
            </div>
            <label>Phone No:</label>
            <input v-model="form.respondentPhone" disabled />
            <label>Name of Advocate:</label>
            <input v-model="form.respondentAdvocate" disabled />
          </div>
        </div>
        <div class="form-row">
          <label>Additional Document:</label>
          <div>
            <a v-if="form.document" :href="form.document" target="_blank">Click here to view the document</a>
          </div>
        </div>
      </b-tab>
      <b-tab title="Mediation">
        <div v-if="mediationData && mediationData">
          <div class="mediation-section">
            <h3>Mediation Summary</h3>
            <div class="mediation-row">
              <div>
                <strong>Mediator:</strong>
                {{ mediationData.mediator?.name || 'Not Assigned' }}
              </div>
              <div>
                <strong>Mediator Email:</strong>
                {{ mediationData.mediator?.email || 'Not Assigned' }}
              </div>
              <div>
                <strong>Status:</strong>
                {{ getStatusLabel(mediationData.status) }}
              </div>
              <div>
              </div>
            </div>

            <h4 style="margin-top: 2rem;">Mediation Meetings</h4>
            <b-table
              :items="mediationData.events"
              :fields="[
                { key: 'title', label: 'Title' },
                { key: 'start_datetime', label: 'Start' },
                { key: 'end_datetime', label: 'End' },
                { key: 'meeting_link', label: 'Meeting Link' },
                { key: 'feedback', label: 'Feedback' }
              ]"
              small
              responsive
              bordered
              class="mb-4"
            >
              <template #cell(start_datetime)="data">
                {{ formatDate(data.item.start_datetime,'display',{includeTime: true}) }}
              </template>
              <template #cell(end_datetime)="data">
                {{ formatDate(data.item.end_datetime,'display',{includeTime: true}) }}
              </template>
              <template #cell(meeting_link)="data">
                <a :href="data.item.meeting_link" target="_blank" v-if="data.item.meeting_link">Join</a>
              </template>
              <template #cell(feedback)="data">
                <div v-if="data.item.event_feedback_events_event_feedback_idToevent_feedback">
                  <div>
                    <span v-if="data.item.event_feedback_events_event_feedback_idToevent_feedback.first_party_present">1st Party Present</span>
                    <span v-else>1st Party Absent</span>
                  </div>
                  <div>
                    <span v-if="data.item.event_feedback_events_event_feedback_idToevent_feedback.second_party_present">2nd Party Present</span>
                    <span v-else>2nd Party Absent</span>
                  </div>
                  <div>
                    <strong>Summary:</strong>
                    {{ data.item.event_feedback_events_event_feedback_idToevent_feedback.summary_of_meeting }}
                  </div>
                </div>
                <span v-else>-</span>
              </template>
            </b-table>

            <h4>Mediation Agreement</h4>
            <div v-if="mediationData.agreement">
              <div class="agreement-block">
                <div class="agreement-row">
                  <div class="agreement-col">
                    <div>
                      <strong>Date:</strong>
                      <div>{{ formatDate(mediationData.agreement.created_at,'display')}}</div>
                    </div>
                  </div>
                  <div class="agreement-col">
                    <div>
                      <strong>Agreed Terms:</strong>
                      <div v-html="mediationData.agreement.agreed_terms"></div>
                    </div>
                  </div>
                </div>
                <div class="agreement-signatures">
                  <div class="signature-col">
                    <div><strong>Mediator Signature</strong></div>
                    <div v-if="mediationData.agreement.signature_mediator && mediationData.agreement.signature_mediator.startsWith('data:image/')">
                      <img :src="mediationData.agreement.signature_mediator" alt="Mediator Signature" class="signature-img" />
                    </div>
                    <div v-else>
                      <span class="cursive-signature">{{ mediationData.agreement.signature_mediator }}</span>
                    </div>
                  </div>
                  <div class="signature-col">
                    <div><strong>First Party Signature</strong></div>
                    <div v-if="mediationData.agreement.first_party_signature && mediationData.agreement.first_party_signature.startsWith('data:image/')">
                      <img :src="mediationData.agreement.first_party_signature" alt="First Party Signature" class="signature-img" />
                    </div>
                    <div v-else>
                      <span class="cursive-signature">{{ mediationData.agreement.first_party_signature }}</span>
                    </div>
                  </div>
                  <div class="signature-col">
                    <div><strong>Second Party Signature</strong></div>
                    <div v-if="mediationData.agreement.second_party_signature && mediationData.agreement.second_party_signature.startsWith('data:image/')">
                      <img :src="mediationData.agreement.second_party_signature" alt="Second Party Signature" class="signature-img" />
                    </div>
                    <div v-else>
                      <span class="cursive-signature">{{ mediationData.agreement.second_party_signature }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <span>No agreement available.</span>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No mediation data available.</p>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>

export default {
  name: 'MediationForm',
  props: {
    formData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      activeTab: 0,
      signatureType: 'digital',
      form: {
        id: '',
        caseId: '',
        hearingDate: '',
        suitNo: '',
        party1: '',
        party1Email: '',
        party2: '',
        party2Email: '',
        institutionDate: '',
        natureOfSuit: '',
        stage: '',
        hearingCount: 0,
        mediationDateTime: '',
        referralJudgeSignature: '',
        plaintiffSignature: '',
        plaintiffPhone: '',
        plaintiffAdvocate: '',
        respondentSignature: '',
        respondentPhone: '',
        respondentAdvocate: '',
        document: null
      },
      mediationData: null,
      statusValueMap: {
        failed: 'Failed',
        in_progress: 'In Progress',
        cancelled: 'Cancelled',
        closed_no_success: 'Closed No Success',
        closed_success: 'Closed Success',
        escalated: 'Escalated',
        new: 'New',
        on_hold: 'On Hold',
        pending: 'Pending'
      },
      subStatusValueMap: {
        mediator_assigned: 'Mediator Assigned',
        meeting_scheduled: 'Meeting Scheduled',
        pending_complainant_signature: 'Pending Complainant Signature',
        pending_respondent_signature: 'Pending Respondent Signature',
        pending_mc: 'Pending Mediation Center'
      }
    }
  },
  methods: {
    async fetchMediationData () {
      const result = await this.$store.dispatch('getMediationData', { caseId: this.form.id })
      if (result.success) this.mediationData = result.data
    },
    getStatusLabel (status) {
      if (!status) return '-'
      return this.statusValueMap[status] || this.toCamelCase(status)
    },
    getSubStatusLabel (subStatus) {
      if (!subStatus) return '-'
      return this.subStatusValueMap[subStatus] || this.toCamelCase(subStatus)
    },
    toCamelCase (str) {
      if (!str) return ''
      return str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\s+/g, ' ')
    },
    formatDate (dateString, type = 'display', options = {}) {
      if (!dateString) return ''

      const date = new Date(dateString)

      const pad = (n) => (n < 10 ? '0' + n : n)

      switch (type) {
        case 'date':
          return date.toISOString().split('T')[0]

        case 'datetime-local': {
          if (dateString.endsWith('Z')) {
            const [datePart, timePart] = dateString.split('T')
            const [hour, minute] = timePart.split(':')
            return `${datePart}T${hour}:${minute}`
          }
          const year = date.getFullYear()
          const month = pad(date.getMonth() + 1)
          const day = pad(date.getDate())
          const hours = pad(date.getHours())
          const minutes = pad(date.getMinutes())
          return `${year}-${month}-${day}T${hours}:${minutes}`
        }

        case 'display':
        default: {
          const { includeTime = false } = options

          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...(includeTime && {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })
          })
        }
      }
    }
  },
  created () {
    if (this.formData) {
      this.form = {
        id: this.formData.id || '',
        caseId: this.formData.caseId || '',
        hearingDate: this.formatDate(this.formData.hearing_date, 'date') || '',
        suitNo: this.formData.suit_no || '',
        party1: this.formData.user_cases_first_partyTouser?.name || '',
        judgeName: this.formData.user_cases_judgeTouser?.name || '',
        party1Email: this.formData.user_cases_first_partyTouser?.email || '',
        party2: this.formData.user_cases_second_partyTouser?.name || '',
        party2Email: this.formData.user_cases_second_partyTouser?.email || '',
        institutionDate: this.formatDate(this.formData.institution_date, 'date') || '',
        natureOfSuit: this.formData.nature_of_suit || '',
        stage: this.formData.stage || '',
        hearingCount: this.formData.hearing_count || 0,
        mediationDateTime: this.formatDate(this.formData.mediation_date_time, 'datetime-local') || '',
        referralJudgeSignature: this.formData.referral_judge_signature || '',
        plaintiffSignature: this.formData.plaintiff_signature || '',
        plaintiffPhone: this.formData.plaintiff_phone || '',
        plaintiffAdvocate: this.formData.plaintiff_advocate || '',
        respondentSignature: this.formData.respondent_signature || '',
        respondentPhone: this.formData.respondent_phone || '',
        respondentAdvocate: this.formData.respondent_advocate || '',
        document: this.formData.judge_document_url || null
      }
    }
  },
  watch: {
    activeTab (val) {
      if (val === 1) {
        this.fetchMediationData()
      }
    }
  }
}
</script>

<style scoped>
.form-container {
  max-width: 1200px;
  margin: auto;
  font-family: Arial, sans-serif;
  padding: 25px;
  background-color: #f9f9f9;
  border: 1px solid #aaa;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  font-size: 20px;
  background-color: #e6e6e6;
  padding: 12px;
  font-weight: bold;
  margin-bottom: 30px;
  border: 1px solid #ccc;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 0px !important;
}

label {
  min-width: 200px;
  font-weight: bold;
}

input {
  padding: 6px;
  min-width: 180px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.inline-input {
  display: inline;
  width: auto;
  margin-left: 10px;
  vertical-align: middle;
}

.referral-section {
  background-color: #fff;
  padding: 15px;
  border: 1px solid #ccc;
  margin-top: 15px;
}

.referral-section h2 {
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 15px;
  font-size: 18px;
}

.referral-section p {
  margin: 10px 0;
  line-height: 1.5;
}

.signature-section {
  justify-content: space-between;
  margin-top: 20px;
}

.signature-section > div {
  flex: 1;
  min-width: 350px;
}

button {
  width: 150px;
  margin: 30px auto 0 auto;
  padding: 10px;
  background-color: #2c6faf;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
}

.party-input-group  {
  width: 30%; /* Adjust width to take full available space */
}

.party-input-group input {
  width: 100%; /* Adjust width to take full available space */
}

.signature-type-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.signature-type-selector button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
  color: black; /* Default text color for non-selected buttons */
}

.signature-type-selector button.active {
  background-color: #2c6faf;
  color: white;
  border-color: #2c6faf;
}

.signature-type-selector button:hover {
  background-color: #d9e6f2;
}

.digital-signature-box {
  border: 1px solid #ccc; /* Changed to solid border */
  width: 300px; /* Fixed width */
  height: 150px; /* Fixed height */
  display: flex; /* Center align content */
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  text-align: center;
}

.cursive-signature {
  font-family: Cursive; /* Added cursive font family */
  font-size: 24px; /* Added font size 24 */
  color: #2c6faf;
}

.manual-signature {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.signature-canvas {
  border: 1px solid #ccc;
  width: 100%;
  height: 150px; /* Reduced height */
  margin-top: 10px;
  cursor: crosshair;
}

.btn-icon {
  padding: 5px;
  font-size: 16px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.mediation-section {
  background: #f8fafd;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 24px;
  margin-top: 16px;
}
.mediation-row {
  display: flex;
  gap: 32px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.mediation-section h3 {
  margin-bottom: 12px;
  color: #2c6faf;
}
.mediation-section h4 {
  margin-top: 24px;
  margin-bottom: 10px;
  color: #2c6faf;
}
.agreement-block {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 18px 20px;
  margin-bottom: 18px;
  margin-top: 10px;
  max-width: 700px;
}
.agreement-row {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.agreement-col {
  flex: 1 1 0;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.agreement-signatures {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 32px;
  gap: 16px;
}
.signature-col {
  flex: 1 1 0;
  min-width: 180px;
  text-align: center;
}
.signature-img {
  max-width: 180px;
  max-height: 70px;
  border: 1px solid #ccc;
  margin: 0 auto;
  display: block;
  background: #fafbfc;
}
.cursive-signature {
  font-family: Cursive;
  font-size: 24px;
  color: #2c6faf;
  display: inline-block;
  margin-top: 10px;
}
</style>
