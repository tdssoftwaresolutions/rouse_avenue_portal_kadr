<template>
  <div class="form-container">
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>

    <h1 class="header">
      MEDIATION CENTRE<br />
      ROUSE AVENUE COURTS COMPLEX<br />
      NEW DELHI
    </h1>

    <b-tabs v-model="activeTab" class="mb-3">
      <b-tab title="Case Details">
        <form @submit.prevent="submitForm" class="form-section">
          <div class="form-row">
            <label>CASE ID:</label>
            <input disabled :value="`${form.caseId || uniquecaseId}`" />
            <label>Next Date of Hearing in Referral Court:</label>
            <input type="date" v-model="form.hearingDate" :min="today" :disabled="viewMode" />
          </div>

          <div class="form-row">
            <label>Name of the Referral Judge:</label>
            <input :value="userName" disabled />
          </div>

          <div class="form-row">
            <label>Suit No/Case No:</label>
            <input v-model="form.suitNo" :disabled="viewMode" />
          </div>

          <div class="form-row">
            <label>Name of the Parties:</label>
            <div class="party-input-group">
              <input v-model="form.party1" placeholder="Party 1" :disabled="viewMode" />
              <br />
              <input v-model="form.party1Email" placeholder="Party 1 Email" :disabled="viewMode" />
            </div>
            <span style="margin-left:1rem;margin-right: 1rem;">vs</span>
            <div class="party-input-group">
              <input v-model="form.party2" placeholder="Party 2" :disabled="viewMode" />
              <br />
              <input v-model="form.party2Email" placeholder="Party 2 Email" :disabled="viewMode" />
            </div>
          </div>

          <div class="form-row">
            <label>Date of Institution of Case:</label>
            <input type="date" v-model="form.institutionDate" :disabled="viewMode" />
            <label>Nature of Suit:</label>
            <input v-model="form.natureOfSuit" :disabled="viewMode" />
          </div>

          <div class="form-row">
            <label>Stage of the Case at Time of Referral:</label>
            <input v-model="form.stage" :disabled="viewMode" />
            <label>Number of Hearings at Time of Referral:</label>
            <input type="number" v-model.number="form.hearingCount" min="0" :disabled="viewMode" />
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
              <input type="datetime-local" v-model="form.mediationDateTime" class="inline-input" :min="now" :disabled="viewMode" />.
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
              <div v-if="viewMode">
                <div v-if="form.referralJudgeSignature.startsWith('data:image/')">
                  <img :src="form.referralJudgeSignature" alt="Referral Judge Signature" style="max-width: 300px; border: 1px solid #ccc;" />
                </div>
                <div v-else-if="signatureType === 'digital'" class="digital-signature-box">
                  <span class="cursive-signature">{{ userInitials }}</span>
                </div>
              </div>
              <div v-else>
                <div class="signature-type-selector" v-if="!viewMode">
                  <button
                    type="button"
                    :class="{ active: signatureType === 'digital' }"
                    @click="setSignatureType('digital')">
                    Digital Signature
                  </button>
                  <button
                    type="button"
                    :class="{ active: signatureType === 'manual' }"
                    @click="setSignatureType('manual')">
                    Sign Manually
                  </button>
                </div>
                <div v-if="signatureType === 'digital'" class="digital-signature-box">
                  <span class="cursive-signature">{{ userInitials }}</span>
                </div>
                <div v-else-if="signatureType === 'manual'" class="manual-signature">
                  <canvas ref="signaturePad" class="signature-canvas" :disabled="viewMode"></canvas>
                  <button type="button" @click="clearSignature" class="btn btn-secondary" style="margin: 0px;width: 100%;" v-if="!viewMode">
                    Clear <i class="ri-refresh-line"></i>
                  </button>
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
                <div v-if="viewMode">
                  <div v-if="form.plaintiffSignature.startsWith('data:image/')">
                    <img :src="form.plaintiffSignature" alt="Plaintiff Signature" style="max-width: 250px; height:70px; border: 1px solid #ccc;" />
                  </div>
                  <div v-else-if="signatureType === 'digital'" class="digital-signature-box">
                    <span class="cursive-signature">{{ form.plaintiffSignature }}</span>
                  </div>
                </div>
              </div>
              <label>Phone No:</label>
              <input v-model="form.plaintiffPhone" :disabled="viewMode" />
              <label>Name of Advocate:</label>
              <input v-model="form.plaintiffAdvocate" :disabled="viewMode" />
            </div>

            <div>
              <h4>Respondent/Accused</h4>
              <div class="form-row">
                <label >Signature:</label>
                <div v-if="viewMode">
                  <div v-if="form.respondentSignature.startsWith('data:image/')">
                    <img :src="form.respondentSignature" alt="Plaintiff Signature" style="max-width: 250px; height: 70px; border: 1px solid #ccc;" />
                  </div>
                  <div v-else-if="signatureType === 'digital'" class="digital-signature-box">
                    <span class="cursive-signature">{{ form.respondentSignature }}</span>
                  </div>
                </div>
              </div>
              <label>Phone No:</label>
              <input v-model="form.respondentPhone" :disabled="viewMode" />
              <label>Name of Advocate:</label>
              <input v-model="form.respondentAdvocate" :disabled="viewMode" />
            </div>
          </div>
          <div class="form-row">
            <label>Additional Document:</label>
            <div v-if="viewMode">
              <a v-if="form.document" :href="form.document" target="_blank">Click here to view the document</a>
            </div>
            <div v-else>
              <input type="file" @change="handleFileUpload"  />
            </div>
          </div>
          <button v-if="!viewMode" type="submit">Submit</button>
        </form>
      </b-tab>
      <b-tab title="Mediation">
        <div v-if="mediationData && mediationData.data">
          <div class="mediation-section">
            <h3>Mediation Summary</h3>
            <div class="mediation-row">
              <div>
                <strong>Status:</strong>
                {{ getStatusLabel(mediationData.data.status) }}
              </div>
              <div>
              </div>
            </div>

            <h4 style="margin-top: 2rem;">Mediation Meetings</h4>
            <b-table
              :items="mediationData.data.events"
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
                {{ new Date(data.item.start_datetime).toLocaleString() }}
              </template>
              <template #cell(end_datetime)="data">
                {{ new Date(data.item.end_datetime).toLocaleString() }}
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
            <div v-if="mediationData.data.agreement">
              <div class="agreement-block">
                <div class="agreement-row">
                  <div class="agreement-col">
                    <div>
                      <strong>Date:</strong>
                      <div>{{ new Date(mediationData.data.agreement.created_at).toLocaleString() }}</div>
                    </div>
                    <div>
                      <strong>Both Parties Agreed:</strong>
                      <div>
                        <span v-if="mediationData.data.agreement.both_parties_agreed">Yes</span>
                        <span v-else>No</span>
                      </div>
                    </div>
                  </div>
                  <div class="agreement-col">
                    <div>
                      <strong>Agreed Terms:</strong>
                      <div>{{ mediationData.data.agreement.agreed_terms }}</div>
                    </div>
                  </div>
                </div>
                <div class="agreement-signatures">
                  <div class="signature-col">
                    <div><strong>Mediator Signature</strong></div>
                    <div v-if="mediationData.data.agreement.signature_mediator && mediationData.data.agreement.signature_mediator.startsWith('data:image/')">
                      <img :src="mediationData.data.agreement.signature_mediator" alt="Mediator Signature" class="signature-img" />
                    </div>
                    <div v-else>
                      <span class="cursive-signature">{{ mediationData.data.agreement.signature_mediator }}</span>
                    </div>
                  </div>
                  <div class="signature-col">
                    <div><strong>First Party Signature</strong></div>
                    <div v-if="mediationData.data.agreement.first_party_signature && mediationData.data.agreement.first_party_signature.startsWith('data:image/')">
                      <img :src="mediationData.data.agreement.first_party_signature" alt="First Party Signature" class="signature-img" />
                    </div>
                    <div v-else>
                      <span class="cursive-signature">{{ mediationData.data.agreement.first_party_signature }}</span>
                    </div>
                  </div>
                  <div class="signature-col">
                    <div><strong>Second Party Signature</strong></div>
                    <div v-if="mediationData.data.agreement.second_party_signature && mediationData.data.agreement.second_party_signature.startsWith('data:image/')">
                      <img :src="mediationData.data.agreement.second_party_signature" alt="Second Party Signature" class="signature-img" />
                    </div>
                    <div v-else>
                      <span class="cursive-signature">{{ mediationData.data.agreement.second_party_signature }}</span>
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
import SignaturePad from 'signature_pad'
import Alert from '../../components/sofbox/alert/Alert.vue'

export default {
  name: 'MediationForm',
  components: {
    Alert
  },
  props: {
    nextCaseId: {
      type: Number,
      default: 1
    },
    userName: {
      type: String,
      default: ''
    },
    viewMode: {
      type: Boolean,
      default: false
    },
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
      signaturePad: null,
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      today: new Date().toISOString().split('T')[0],
      now: new Date().toISOString().slice(0, 16),
      mediationData: null, // Store fetched mediation data
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
  computed: {
    userInitials () {
      return this.userName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    },
    uniquecaseId () {
      return `ROUSE-MED-${this.nextCaseId}`
    }
  },
  methods: {
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    setSignatureType (type) {
      this.signatureType = type
      if (type === 'manual') {
        this.initializeSignaturePad()
      }
    },
    initializeSignaturePad () {
      this.$nextTick(() => {
        const canvas = this.$refs.signaturePad
        this.adjustCanvasSize(canvas)
        this.signaturePad = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)'
        })
      })
    },
    adjustCanvasSize (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d').scale(ratio, ratio)
    },
    clearSignature () {
      if (this.signaturePad) {
        this.signaturePad.clear()
      }
    },
    validateForm () {
      if (this.viewMode) return true // Skip validation in view mode
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      if (!this.form.hearingDate) {
        this.showAlert('Please enter the next date of hearing in referral court.', 'danger')
        return false
      }
      if (!this.form.suitNo) {
        this.showAlert('Please enter the suit number or case number.', 'danger')
        return false
      }
      if (!this.form.party1) {
        this.showAlert('Please enter the name of Party 1.', 'danger')
        return false
      }
      if (!this.form.party1Email) {
        this.showAlert('Please enter the email of Party 1.', 'danger')
        return false
      }
      if (!emailRegex.test(this.form.party1Email)) {
        this.showAlert('Please enter a valid email for Party 1.', 'danger')
        return false
      }
      if (!this.form.party2) {
        this.showAlert('Please enter the name of Party 2.', 'danger')
        return false
      }
      if (!this.form.party2Email) {
        this.showAlert('Please enter the email of Party 2.', 'danger')
        return false
      }
      if (!emailRegex.test(this.form.party2Email)) {
        this.showAlert('Please enter a valid email for Party 2.', 'danger')
        return false
      }
      if (!this.form.institutionDate) {
        this.showAlert('Please enter the date of institution of the case.', 'danger')
        return false
      }
      if (!this.form.natureOfSuit) {
        this.showAlert('Please enter the nature of the suit.', 'danger')
        return false
      }
      if (!this.form.stage) {
        this.showAlert('Please enter the stage of the case at the time of referral.', 'danger')
        return false
      }
      if (!this.form.hearingCount) {
        this.showAlert('Please enter the number of hearings at the time of referral.', 'danger')
        return false
      }
      if (!this.form.mediationDateTime) {
        this.showAlert('Please enter the mediation date and time.', 'danger')
        return false
      }
      if (!this.form.referralJudgeSignature) {
        this.showAlert('Please provide the signature of the referral judge.', 'danger')
        return false
      }
      return true
    },
    async fetchMediationData () {
      // Replace with your actual Vuex action or API call
      try {
        const caseId = this.form.id
        // Example: fetch mediation data for this caseId
        const result = await this.$store.dispatch('getMediationData', { caseId })
        this.mediationData = result
      } catch (e) {
        this.showAlert('Failed to fetch mediation data.', 'danger')
      }
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
    submitForm () {
      if (this.viewMode) {
        this.closeForm()
        return
      }
      if (this.signatureType === 'manual') {
        if (this.signaturePad && !this.signaturePad.isEmpty()) {
          this.form.referralJudgeSignature = this.signaturePad.toDataURL()
        }
      } else {
        this.form.referralJudgeSignature = this.userInitials
      }
      if (!this.validateForm()) {
        return
      }
      console.log('Form submitted:', this.form)
      this.$emit('close', this.form)
    },
    handleFileUpload (event) {
      const file = event.target.files[0]
      if (file) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/gif']
        const maxFileSize = 5 * 1024 * 1024 // 5MB

        if (!allowedTypes.includes(file.type)) {
          this.showAlert('Invalid file type. Only PDF, DOC, DOCX, and image files are allowed.', 'danger')
          return
        }

        if (file.size > maxFileSize) {
          this.showAlert('File size exceeds the maximum limit of 5MB.', 'danger')
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          this.form.document = e.target.result // Store Base64 string in form.document
        }
        reader.readAsDataURL(file) // Convert file to Base64
      }
    },
    closeForm () {
      this.$emit('close')
    },
    formatDate (dateString, type) {
      if (!dateString) return ''
      const date = new Date(dateString)
      if (type === 'date') {
        return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      } else if (type === 'datetime-local') {
        return date.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:mm
      }
      return dateString
    }
  },
  created () {
    if (this.viewMode && this.formData) {
      this.form = {
        id: this.formData.id || '',
        caseId: this.formData.caseId || '',
        hearingDate: this.formatDate(this.formData.hearing_date, 'date') || '',
        suitNo: this.formData.suit_no || '',
        party1: this.formData.user_cases_first_partyTouser?.name || '',
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
