<template>
  <div class="form-container">
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
    <form @submit.prevent="openAadharModal" class="form-section" v-if="data != null">
      <div class="document-container">
        <h1>ROUSE AVENUE MEDIATION CENTER</h1>
        <h2>MEDIATION COMPLETION DOCUMENT</h2>
        <hr />

        <section>
          <h4>1. Case Information</h4>
          <p><strong>Case ID:</strong> {{ data.caseId }}</p>
          <p><strong>Case Type:</strong> {{ data.caseType }}</p>
          <p><strong>Date of Case Registration:</strong> {{ formatDateTime(data.dateOfCaseRegistration) }}</p>
          <p><strong>Mediation Completion Date:</strong> {{ formatDateTime(data.mediationCompletionDate) }}</p>
        </section>

        <section>
          <h4>2. Party Details</h4>
          <p><strong>First Party (Name):</strong> {{ data.firstPartyName }}</p>
          <p><strong>Second Party (Name):</strong> {{ data.secondPartyName }}</p>
        </section>

        <section>
          <h4>3. Mediator Details</h4>
          <p><strong>Mediator Name:</strong> {{ data.mediatorName }}</p>
          <p><strong>Number of Mediation Sessions Held:</strong> {{ data.numberOfSessions }}</p>
          <p><strong>Dates of Mediation Sessions:</strong>
            {{ formatSessionDates(data.sessionDates) }}
          </p>
        </section>

        <section>
          <h4>4. Outcome of Mediation</h4>
          <p>
            This is to certify that the mediation process initiated at
            <strong>Rouse Avenue Mediation Center</strong> has been completed
            successfully. Both parties, with the assistance of the assigned mediator,
            have mutually agreed upon the following resolution:
          </p>
          <div class="agreement-box" style="margin-bottom:1rem;">
            {{ data.outcomeOfMediation }}
          </div>
        </section>

        <section>
          <h4>5. Acknowledgement</h4>
          <p>
            By signing below, both parties confirm that they participated voluntarily
            in the mediation sessions and are in full agreement with the outcome as
            stated above.
          </p>
        </section>

        <section class="signature-block">
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
        </section>

        <p class="note">
          <strong>Note:</strong> This document serves as a formal record of the completion
          of mediation. Any further disputes regarding this agreement must be addressed as per
          the terms mentioned above or escalated as per the relevant legal procedures.
        </p>
      </div>
      <button type="submit">Submit</button>
    </form>

    <!-- Aadhar Verification Modal -->
    <b-modal v-model="showAadharModal" hide-footer title="Aadhaar Verification" @hidden="resetAadharModal">
      <div class="aadhar-modal-content">
        <div v-if="aadharStep === 1">
          <h5>Enter your Aadhaar Number</h5>
          <b-form-group>
            <b-form-input
              v-model="aadharNumber"
              maxlength="12"
              placeholder="Enter 12-digit Aadhaar Number"
              type="text"
              pattern="[0-9]{12}"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-button variant="primary" block :disabled="!isAadharValid" @click="sendOtp">Send OTP</b-button>
        </div>
        <div v-else-if="aadharStep === 2">
          <h5>OTP sent to your registered mobile</h5>
          <b-form-group>
            <b-form-input
              v-model="aadharOtp"
              maxlength="6"
              placeholder="Enter 6-digit OTP"
              type="text"
              pattern="[0-9]{6}"
              autocomplete="off"
            ></b-form-input>
          </b-form-group>
          <b-button variant="primary" block :disabled="!isOtpValid" @click="verifyOtp">Verify OTP</b-button>
        </div>
        <div v-else-if="aadharStep === 3">
          <div class="aadhar-verification-success">
            <b-icon icon="check-circle-fill" variant="success" font-scale="2"></b-icon>
            <h5>Verification Successful!</h5>
            <p>
              Name matched with Aadhaar:<br>
              <strong>{{ userInitialsName }}</strong>
            </p>
            <b-alert show variant="success" class="mt-2">Congrats! Your identity is verified via Aadhaar.</b-alert>
            <b-button variant="success" block @click="finalSubmit">Proceed</b-button>
          </div>
        </div>
      </div>
    </b-modal>
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
      data: {},
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      showAadharModal: false,
      aadharStep: 1,
      aadharNumber: '',
      aadharOtp: '',
      fakeOtp: '123456'
    }
  },
  computed: {
    userInitials () {
      return this.data?.userName?.split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    },
    isAadharValid () {
      return /^[0-9]{12}$/.test(this.aadharNumber)
    },
    isOtpValid () {
      return /^[0-9]{6}$/.test(this.aadharOtp)
    },
    userInitialsName () {
      // Show full name for verification
      return this.data?.userName
    }
  },
  methods: {
    formatDateTime (dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    async getAgreementDetailsForSignature () {
      const requestId = this.$route.query?.requestId // Access requestId from query parameters
      if (!requestId) {
        this.showAlert('Request ID is missing in the URL.', 'danger')
        return
      }
      try {
        const response = await this.$store.dispatch('getAgreementDetailsForSignature', { requestId })
        if (response.response?.data?.success === false) {
          this.showAlert('Already submitted the signature, no action required!', 'success')
          return
        }

        this.data = response.data
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
    openAadharModal () {
      // Called instead of submitForm, triggers Aadhaar modal
      this.showAadharModal = true
      this.aadharStep = 1
      this.aadharNumber = ''
      this.aadharOtp = ''
    },
    sendOtp () {
      // Simulate sending OTP
      this.aadharStep = 2
      this.aadharOtp = ''
      this.$bvToast.toast('OTP sent to your registered mobile number.', {
        title: 'Aadhaar Verification',
        variant: 'info',
        solid: true
      })
    },
    verifyOtp () {
      // Simulate OTP verification and name match
      if (this.aadharOtp === this.fakeOtp) {
        this.aadharStep = 3
      } else {
        this.$bvToast.toast('Invalid OTP. Please try again.', {
          title: 'Aadhaar Verification',
          variant: 'danger',
          solid: true
        })
      }
    },
    finalSubmit () {
      this.showAadharModal = false
      // Now call the original submitForm logic
      this.submitFormReal()
    },
    resetAadharModal () {
      this.aadharStep = 1
      this.aadharNumber = ''
      this.aadharOtp = ''
    },
    submitFormReal () {
      const requestBody = {
        requestId: this.$route.query.requestId,
        signature: ''
      }
      if (this.signature_type === 'digital') {
        // For digital signature, just send the initials
        requestBody.signature = this.userInitials
      } else if (this.signature_type === 'manual' && this.signaturePad) {
        // For manual signature, send the signature image
        requestBody.signature = this.signaturePad.toDataURL()
      }

      this.$store.dispatch('submitAgreementSignature', requestBody)
        .then(response => {
          if (response.errorCode) {
            this.showAlert(response.message, 'danger')
          } else {
            this.showAlert('Signature submitted successfully!', 'success')
            this.data = null
          }
        })
        .catch(error => {
          console.error('Error submitting signature:', error)
          this.showAlert('Failed to submit signature. Please try again.', 'danger')
        })
    },
    formatSessionDates (dates) {
      if (!dates || !Array.isArray(dates) || dates.length === 0) return '-'
      return dates
        .map(dt => {
          if (!dt) return ''
          const d = new Date(dt)
          return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })
        .join(', ')
    }
  },
  mounted () {
    this.getAgreementDetailsForSignature()
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

.aadhar-modal-content {
  padding: 20px;
}

.aadhar-verification-success {
  text-align: center;
  margin-top: 20px;
}

.aadhar-verification-success b-icon {
  font-size: 48px;
}

.aadhar-verification-success h5 {
  margin: 10px 0;
}

.aadhar-verification-success p {
  margin: 5px 0;
}
</style>
