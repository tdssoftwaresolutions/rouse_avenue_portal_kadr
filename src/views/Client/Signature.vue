<template>
  <div class="form-container">
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>

    <h1 class="header">
      MEDIATION CENTRE<br />
      ROUSE AVENUE COURTS COMPLEX<br />
      NEW DELHI
    </h1>

    <form @submit.prevent="submitForm" class="form-section" v-if="signatureRequestDetails != null">
      <div class="form-row">
        <label>CASE ID:</label>
        <input disabled :value="signatureRequestDetails.caseId" />
        <label>Next Date of Hearing in Referral Court:</label>
        <input type="date" :value="formatDate(signatureRequestDetails.hearing_date,'date')" disabled />
      </div>

      <div class="form-row">
        <label>Name of the Referral Judge:</label>
        <input :value="signatureRequestDetails.user_cases_judgeTouser.name" disabled />
      </div>

      <div class="form-row">
        <label>Suit No/Case No:</label>
        <input :value="signatureRequestDetails.suit_no" disabled />
      </div>

      <div class="form-row">
        <label>Name of the Parties:</label>
        <div class="party-input-group">
          <input :value="signatureRequestDetails.user_cases_first_partyTouser.name" disabled />
        </div>
        <span>vs</span>
        <div class="party-input-group">
          <input :value="signatureRequestDetails.user_cases_second_partyTouser.name" disabled />
        </div>
      </div>

      <div class="form-row">
        <label>Date of Institution of Case:</label>
        <input type="date" :value="formatDate(signatureRequestDetails.institution_date,'date')" disabled />
        <label>Nature of Suit:</label>
        <input :value="signatureRequestDetails.nature_of_suit" disabled />
      </div>

      <div class="form-row">
        <label>Stage of the Case at Time of Referral:</label>
        <input :value="signatureRequestDetails.stage" disabled />
        <label>Number of Hearings at Time of Referral:</label>
        <input :value="signatureRequestDetails.hearing_count" disabled />
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
          <input type="datetime-local" :value="formatDate(signatureRequestDetails.mediation_date_time,'datetime-local')" class="inline-input" disabled />.
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
      </div>

      <!-- Signatures Section -->
      <div class="form-row signature-section">
        <div>
          <label>Your Signature:</label>
          <div class="signature-type-selector">
            <button
              type="button"
              :class="{ active: signature_type === 'digital' }"
              @click="setSignatureType('digital')">
              Digital Signature
            </button>
            <button
              type="button"
              :class="{ active: signature_type === 'manual' }"
              @click="setSignatureType('manual')">
              Sign Manually
            </button>
          </div>
          <div v-if="signature_type === 'digital'" class="digital-signature-box">
            <span class="cursive-signature">{{ userInitials }}</span>
          </div>
          <div v-else-if="signature_type === 'manual'" class="manual-signature">
            <canvas ref="signaturePad" class="signature-canvas"></canvas>
            <button type="button" @click="clearSignature('plaintiff')" class="btn btn-secondary" style="margin: 0px;width: 100%;">
              Clear <i class="ri-refresh-line"></i>
            </button>
          </div>
        </div>
      </div>
        <label>Phone No:</label>
        <input v-if="isFirstPaty" v-model="signatureRequestDetails.plaintiff_phone" disabled/>
        <input v-else v-model="signatureRequestDetails.respondent_phone" disabled/>
        <label>Name of Advocate:</label>
        <input v-if="isFirstPaty" v-model="signatureRequestDetails.plaintiff_advocate" disabled/>
        <input v-else v-model="signatureRequestDetails.respondent_advocate" disabled/>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import SignaturePad from 'signature_pad'
import Alert from '../../components/sofbox/alert/Alert.vue'

export default {
  name: 'Signature',
  components: {
    Alert
  },
  data () {
    return {
      signature_type: 'digital',
      signaturePad: null,
      userName: '',
      isFirstPaty: false,
      signatureRequestDetails: null, // Variable to store the response
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
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
    }
  },
  methods: {
    async fetchSignatureRequestDetails () {
      const requestId = this.$route.query?.requestId // Access requestId from query parameters
      if (!requestId) {
        this.showAlert('Request ID is missing in the URL.', 'danger')
        return
      }
      try {
        const response = await this.$store.dispatch('getSignatureRequestDetails', { requestId })
        console.log(response)
        if (response.response?.data?.success === false) {
          this.showAlert('Already submitted the signature, no action required!', 'success')
          return
        }

        this.signatureRequestDetails = response.caseData // Store the response in a variable
        this.userName = response.userName
        this.isFirstPaty = response.isFirstParty
      } catch (error) {
        console.log(error)
        this.showAlert('Failed to fetch signature request details.', 'danger')
      }
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    setSignatureType (type) {
      this.signature_type = type
      if (type === 'manual') {
        this.initializeSignaturePad() // Ensure this is called after the DOM is updated
      }
    },
    initializeSignaturePad () {
      this.$nextTick(() => {
        const canvas = this.$refs.signaturePad // Ensure canvas is properly referenced
        if (!canvas) {
          console.error('SignaturePad canvas element is not found.')
          return
        }
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
    formatDate (dateString, type) {
      if (!dateString) return ''
      const date = new Date(dateString)
      if (type === 'date') {
        return date.toISOString().split('T')[0] // Format as YYYY-MM-DD
      } else if (type === 'datetime-local') {
        return date.toISOString().slice(0, 16) // Format as YYYY-MM-DDTHH:mm
      }
      return dateString
    },
    clearSignature () {
      if (this.signaturePad) {
        this.signaturePad.clear()
      }
    },
    async submitForm () {
      const requestBody = {
        requestId: this.$route.query.requestId,
        signature: ''
      }
      if (this.signature_type === 'manual') {
        if (this.signaturePad && !this.signaturePad.isEmpty()) {
          requestBody.signature = this.signaturePad.toDataURL()
        }
      } else {
        requestBody.signature = this.userInitials
      }

      if (!requestBody.signature) {
        this.showAlert('Please provide signature before submitting.', 'danger')
        return
      }

      const response = await this.$store.dispatch('submitSignature', requestBody)
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.showAlert('Signature submitted successfully.', 'success')
        this.signatureRequestDetails = null
      }
    }
  },
  async created () {
    await this.fetchSignatureRequestDetails() // Fetch signature request details on load
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
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
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
  width: 100%; /* Fixed width */
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
</style>
