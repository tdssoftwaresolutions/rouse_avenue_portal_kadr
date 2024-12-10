<template>
  <div class="container">
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
    <Spinner :isVisible="loading" />
    <div class="form-container">
      <form class="mt-4">
        <!-- Step 0: Select User Type -->
        <div v-if="step === 0" class="card">
          <div class="card-body">
            <h5 class="card-title">Are you a Mediator or Client?</h5>
            <p class="card-text">Please select your role to proceed with the sign-up process.</p>
            <button type="button" class="btn btn-primary" style="margin-right:1rem" @click="selectUserType('mediator')">Sign Up as Dispute Resolution Expert</button>
            <button type="button" class="btn btn-primary" style="margin-left:1rem" @click="selectUserType('client')">Sign Up as Client</button>
            <span class="dark-color d-inline-block line-height-2" style="margin-top: 2rem;">
              Already Have an Account? <a href="#" @click="onClickLogin">Log In</a>
            </span>
          </div>
        </div>

        <!-- Step 1: Personal Information (Client & Mediator) -->
        <div v-if="step === 1">
          <div class="mb-3">
            <label for="name">Full Name</label>
            <input type="text" class="form-control capitalize-first-word" id="name" v-model="formData.name" placeholder="Your Full Name" />
          </div>
          <div class="mb-3">
            <label for="email">Email Address</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Enter Email" />
          </div>
          <div class="mb-3">
            <label for="phone">Phone Number</label>
            <input type="tel" class="form-control" id="phone" v-model="formData.phone" placeholder="Phone Number" />
          </div>
          <div class="mb-3">
            <label for="language">Preferred Language</label>
            <select id="language" v-model="formData.preferredLanguage" class="form-control">
              <option value="">Select Language</option>
              <option v-for="(item, index) in availableLanguges" :key="index" :value="item.id">
                {{ item.language }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="state">State</label>
            <select id="state" v-model="formData.state" class="form-control">
              <option value="">Select State</option>
              <option v-for="(item, index) in states" :key="index" :value="item">
                {{ item }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="city">City</label>
            <input type="text" class="form-control capitalize-first-word" id="city" v-model="formData.city" placeholder="City" />
          </div>
          <div class="mb-3">
            <label for="pincode">Pin Code</label>
            <input type="text" class="form-control" id="pincode" v-model="formData.pincode" placeholder="Pin Code" />
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <button type="button" class="btn btn-secondary" @click="prevStep(1)">Previous</button>
              <button type="button" class="btn btn-primary ml" @click="nextStep(1)">Next</button>
            </div>
            <div class="align-self-center">
              <span class="dark-color d-inline-block line-height-2">
                Already Have an Account? <a href="#" @click="onClickLogin">Log In</a>
              </span>
            </div>
          </div>
        </div>
        <!-- Step 2: Complaint Details (Only for Client) -->
        <div v-if="step === 2 && formData.userType === 'client'">
          <div class="mb-3">
            <label for="description">Complaint Description</label>
            <textarea class="form-control" id="description" v-model="formData.description" placeholder="Describe your complaint" style="height:150px"></textarea>
          </div>
          <div class="mb-3">
            <label for="category">Complaint Category</label>
            <select class="form-control" id="category" v-model="formData.category">
              <option value="" disabled>Select Category</option>
              <option value="Payment related">Payment Related</option>
              <option value="Family related">Family Related</option>
              <option value="E-commerce">E-Commerce</option>
              <option value="Insurance">Insurance</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="evidence">Upload Evidence</label>
            <div class="file-upload">
              <input type="file" class="form-control-file" id="evidence" @change="onEvidenceChange" />
              <label for="evidence" class="custom-file-upload">
                Choose File
              </label>
              <span v-if="formData.evidence" class="file-name">{{ formData.evidence.name }}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <div>
              <button type="button" class="btn btn-secondary" @click="prevStep(2)">Previous</button>
              <button type="button" class="btn btn-primary float-right ml" @click="nextStep(2)">Next</button>
            </div>
            <div class="align-self-center">
              <span class="dark-color d-inline-block line-height-2">
                Already Have an Account? <a href="#" @click="onClickLogin">Log In</a>
              </span>
            </div>
          </div>

        </div>

        <!-- Step 2: Mediator-Specific (Empty for now) -->
        <div v-if="step === 2 && formData.userType === 'mediator'">
          <div class="mb-3">
            <label for="evidence">Upload degree</label>
            <div class="file-upload">
              <input type="file" class="form-control-file" id="evidence" @change="onFileChange('degree-mediator')" />
              <label for="evidence" class="custom-file-upload">
                Choose File
              </label>
              <span v-if="formData.evidence" class="file-name">{{ formData.evidence.name }}</span>
            </div>
          </div>
          <div class="mb-3">
            <label for="evidence">Upload license</label>
            <div class="file-upload">
              <input type="file" class="form-control-file" id="evidence" @change="onFileChange('license-mediator')" />
              <label for="evidence" class="custom-file-upload">
                Choose File
              </label>
              <span v-if="formData.evidence" class="file-name">{{ formData.evidence.name }}</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" @click="prevStep(3)">Previous</button>
          <button type="button" class="btn btn-primary float-right ml" @click="submitClientForm()">Submit</button>
        </div>

        <!-- Step 3: Opposite Party Details (Only for Client) -->
        <div v-if="step === 3 && formData.userType === 'client'">
          <div class="mb-3">
            <label for="oppositeName">Opposite Party Name</label>
            <input type="text" class="form-control" id="oppositeName" v-model="formData.oppositeName" placeholder="Name" />
          </div>
          <div class="mb-3">
            <label for="oppositeEmail">Opposite Party Email</label>
            <input type="email" class="form-control" id="oppositeEmail" v-model="formData.oppositeEmail" placeholder="Email" />
          </div>
          <div class="mb-3">
            <label for="oppositePhone">Opposite Party Phone</label>
            <input type="tel" class="form-control" id="oppositePhone" v-model="formData.oppositePhone" placeholder="Phone" />
          </div>
          <button type="button" class="btn btn-secondary" @click="prevStep(3)">Previous</button>
          <button type="button" class="btn btn-success float-right ml" @click="submitClientForm">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Alert from '../../../components/sofbox/alert/Alert.vue'
import Spinner from '../../../components/sofbox/spinner/spinner.vue'

export default {
  name: 'SignUp',
  components: {
    Alert, Spinner
  },
  data () {
    return {
      states: [],
      step: 0, // Start at Step 0
      formData: {
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        pincode: '',
        description: '',
        category: '',
        evidence: null,
        evidenceContent: null,
        oppositeName: '',
        oppositeEmail: '',
        preferredLanguage: '',
        oppositePhone: '',
        userType: '' // Store selected user type (mediator/client)
      },
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      loading: false,
      availableLanguges: {}
    }
  },
  mounted () {
    this.loadStates()
    this.loadAvailableLanguages()
  },
  methods: {
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        timeout: 5000,
        visible: true
      }
    },
    showAlertWithTimeout (message, type, timeout) {
      this.alert = {
        message,
        type,
        visible: true,
        timeout
      }
    },
    async loadStates () {
      const response = await this.$store.dispatch('getStates')
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.states = response
      }
    },
    async loadAvailableLanguages () {
      const response = await this.$store.dispatch('getAvailableLanguages')
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.availableLanguges = response
      }
    },
    async nextStep (currentStep) {
      if (currentStep === 1) {
        if (this.formData.name.trim() === '') {
          this.showAlert('Enter your full name', 'danger')
          return
        }
        if (this.formData.email.trim() === '') {
          this.showAlert('Enter email address', 'danger')
          return
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailPattern.test(this.formData.email)) {
          this.showAlert('Invalid email address', 'danger')
          return
        }
        if (this.formData.phone.trim() === '') {
          this.showAlert('Enter phone number', 'danger')
          return
        }
        const phonePattern = /^(?:\+91|0)?[789]\d{9}$/
        if (!phonePattern.test(this.formData.phone)) {
          this.showAlert('Enter valid phone number', 'danger')
          return
        }
        if (this.formData.preferredLanguage.trim() === '') {
          this.showAlert('Select your preferred language', 'danger')
          return
        }
        if (this.formData.state.trim() === '') {
          this.showAlert('Select state', 'danger')
          return
        }
        if (this.formData.city.trim() === '') {
          this.showAlert('Enter city', 'danger')
          return
        }
        if (this.formData.pincode.trim() === '') {
          this.showAlert('Enter pincode', 'danger')
          return
        }
        const pinCodePattern = /^[1-9][0-9]{5}$/
        if (!pinCodePattern.test(this.formData.pincode)) {
          this.showAlert('Enter valid pincode', 'danger')
          return
        }
        this.loading = true
        const response = await this.$store.dispatch('isEmailExist', {
          emailAddress: this.formData.email
        })
        this.loading = false
        if (response.success) {
          this.showAlert('Email address already exist, please login instead.', 'danger')
          return
        }
      } else if (currentStep === 2) {
        if (this.formData.description.trim() === '') {
          this.showAlert('Enter complaint description', 'danger')
          return
        }
        if (this.formData.category.trim() === '') {
          this.showAlert('Enter complaint category', 'danger')
          return
        }
        if (this.formData.evidence) {
          const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
          ]
          const maxSize = 2 * 1024 * 1024

          if (!allowedTypes.includes(this.formData.evidence.type)) {
            this.showAlert('Invalid file type. Allowed types: PDF, DOC, DOCX, JPEG, PNG.', 'danger')
            return
          }
          if (this.formData.evidence.size > maxSize) {
            this.showAlert('File size exceeds 2MB.', 'danger')
            return
          }
        }
      }
      if (this.step < 3 && (this.formData.userType === 'client' || this.step < 2)) {
        this.step++
      }
    },
    prevStep (currentStep) {
      if (currentStep === 1) {
        this.step = 0 // Go back to Step 0 if user is on Step 1
      } else if (currentStep > 0) {
        this.step-- // Go to the previous step if not on Step 0
      }
    },
    onEvidenceChange (event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          this.formData.evidenceContent = reader.result
        }
        reader.onerror = (error) => {
          console.error('Error reading file:', error)
        }
        reader.readAsDataURL(file)
        this.formData.evidence = file
      }
    },
    async submitClientForm () {
      if (this.formData.oppositeName.trim() === '') {
        this.showAlert('Enter opposite party name', 'danger')
        return
      }
      if (this.formData.oppositeEmail.trim() === '') {
        this.showAlert('Enter opposite party email', 'danger')
        return
      }
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailPattern.test(this.formData.oppositeEmail)) {
        this.showAlert('Invalid email address', 'danger')
        return
      }
      if (this.formData.oppositePhone.trim() === '') {
        this.showAlert('Enter opposite party phone', 'danger')
        return
      }
      const phonePattern = /^(?:\+91|0)?[789]\d{9}$/
      if (!phonePattern.test(this.formData.oppositePhone)) {
        this.showAlert('Enter valid phone number', 'danger')
        return
      }

      this.loading = true
      const response = await this.$store.dispatch('newUserSignup', {
        userDetails: this.formData
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.showAlertWithTimeout(response.message, 'success', 7000)
        setTimeout(() => {
          this.onClickLogin()
        }, 1500)
      }
      this.loading = false
    },
    onClickLogin () {
      this.$router.push({ path: '/auth/sign-in' })
    },
    selectUserType (type) {
      this.formData.userType = type // Store selected user type
      this.step = 1 // Move to the next step (Step 1)
    }
  }
}
</script>

<style scoped>
/* Full Height and Centering */
body, html {
  height: 100%;
  margin: 0;
}

/* Main container that takes full screen height */
.container {
  display: flex;
  justify-content: center; /* Horizontally center */
  align-items: center; /* Vertically center */
  height: 100vh; /* Full height of the viewport */
}

/* Form container (including Step 0) */
.form-container {
  max-width: 600px;
  width: 100%;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card {
  margin-bottom: 20px;
}

/* Empty step placeholders */
.empty-step {
  height: 200px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  margin: 10px 0;
}

/* Ensuring the header stays at the top, regardless of the screen size */
.header {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  text-align: center;
}

/* Style for the file upload container */
.file-upload {
  position: relative;
  display: inline-block;
  width: 100%;
}

/* Hide the default file input button */
.file-upload input[type="file"] {
  display: none;
}

/* Style the custom file upload label button */
.custom-file-upload {
  display: inline-block;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  background-color: #007bff;
  color: #fff;
  border: 1px solid #007bff;
  border-radius: 4px;
  text-align: center;
  width: auto;
  margin-top: 5px;
}

/* Hover effect for the custom button */
.custom-file-upload:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

/* Style for the file name to appear once a file is selected */
.file-name {
  display: inline-block;
  margin-top: 5px;
  color: #555;
  font-size: 14px;
  font-weight: 600;
}

/* Optional: Styling for focus or when the file is selected */
.file-upload input[type="file"]:focus + .custom-file-upload,
.file-upload input[type="file"]:active + .custom-file-upload {
  border-color: #0056b3;
  background-color: #e6f0ff;
}
.toast.toast-error {
  background-color: #dc3545; /* Red background */
  color: white;              /* White text */
}

.b-toaster-slot{
  margin-left: auto;
  margin-right: auto;
}
.ml {
    margin-left: 0.5rem;
}
.capitalize-first-word {
  text-transform: capitalize;
}
</style>
