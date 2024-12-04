<template>
  <div class="container">
    <!-- Header: "Already Have an Account?" stays at the top -->
    <div class="header" v-if="step !== 0">
      <span class="dark-color d-inline-block line-height-2">
        Already Have an Account? <a href="#" @click="onClickLogin">Log In</a>
      </span>
    </div>

    <div class="form-container">
      <form class="mt-4">
        <!-- Step 0: Select User Type -->
        <div v-if="step === 0" class="card">
          <div class="card-body">
            <h5 class="card-title">Are you a Mediator or Client?</h5>
            <p class="card-text">Please select your role to proceed with the sign-up process.</p>
            <button type="button" class="btn btn-primary" style="margin-right:1rem" @click="selectUserType('mediator')">Sign Up as Mediator</button>
            <button type="button" class="btn btn-primary" style="margin-left:1rem" @click="selectUserType('client')">Sign Up as Client</button>
            <span class="dark-color d-inline-block line-height-2" style="margin-top: 2rem;">
              Already Have an Account? <a href="#" @click="onClickLogin">Log In</a>
            </span>
          </div>
        </div>

        <!-- Step 1: Personal Information (Client & Mediator) -->
        <div v-if="step === 1">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" class="form-control" id="name" v-model="formData.name" placeholder="Your Full Name" />
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" class="form-control" id="email" v-model="formData.email" placeholder="Enter Email" />
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" class="form-control" id="phone" v-model="formData.phone" placeholder="Phone Number" />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" class="form-control" id="city" v-model="formData.city" placeholder="City" />
          </div>
          <div class="form-group">
            <label for="state">State</label>
            <input type="text" class="form-control" id="state" v-model="formData.state" placeholder="State" />
          </div>
          <div class="form-group">
            <label for="pincode">Pin Code</label>
            <input type="text" class="form-control" id="pincode" v-model="formData.pincode" placeholder="Pin Code" />
          </div>
          <button type="button" class="btn btn-secondary" @click="prevStep">Previous</button>
          <button type="button" class="btn btn-primary float-right" @click="nextStep">Next</button>
        </div>

        <!-- Step 2: Complaint Details (Only for Client) -->
        <div v-if="step === 2 && formData.userType === 'client'">
          <div class="form-group">
            <label for="description">Complaint Description</label>
            <textarea class="form-control" id="description" v-model="formData.description" placeholder="Describe your complaint"></textarea>
          </div>
          <div class="form-group">
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
          <div class="form-group">
            <label for="evidence">Upload Evidence</label>
            <div class="file-upload">
              <input type="file" class="form-control-file" id="evidence" @change="onFileChange('evidence-client')" />
              <label for="evidence" class="custom-file-upload">
                Choose File
              </label>
              <span v-if="formData.evidence" class="file-name">{{ formData.evidence.name }}</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" @click="prevStep">Previous</button>
          <button type="button" class="btn btn-primary float-right" @click="nextStep">Next</button>
        </div>

        <!-- Step 2: Mediator-Specific (Empty for now) -->
        <div v-if="step === 2 && formData.userType === 'mediator'">
          <div class="form-group">
            <label for="evidence">Upload degree</label>
            <div class="file-upload">
              <input type="file" class="form-control-file" id="evidence" @change="onFileChange('degree-mediator')" />
              <label for="evidence" class="custom-file-upload">
                Choose File
              </label>
              <span v-if="formData.evidence" class="file-name">{{ formData.evidence.name }}</span>
            </div>
          </div>
          <div class="form-group">
            <label for="evidence">Upload license</label>
            <div class="file-upload">
              <input type="file" class="form-control-file" id="evidence" @change="onFileChange('license-mediator')" />
              <label for="evidence" class="custom-file-upload">
                Choose File
              </label>
              <span v-if="formData.evidence" class="file-name">{{ formData.evidence.name }}</span>
            </div>
          </div>
          <button type="button" class="btn btn-secondary" @click="prevStep">Previous</button>
          <button type="button" class="btn btn-primary float-right" @click="submitForm">Submit</button>
        </div>

        <!-- Step 3: Opposite Party Details (Only for Client) -->
        <div v-if="step === 3 && formData.userType === 'client'">
          <div class="form-group">
            <label for="oppositeName">Opposite Party Name</label>
            <input type="text" class="form-control" id="oppositeName" v-model="formData.oppositeName" placeholder="Name" />
          </div>
          <div class="form-group">
            <label for="oppositeEmail">Opposite Party Email</label>
            <input type="email" class="form-control" id="oppositeEmail" v-model="formData.oppositeEmail" placeholder="Email" />
          </div>
          <div class="form-group">
            <label for="oppositePhone">Opposite Party Phone</label>
            <input type="tel" class="form-control" id="oppositePhone" v-model="formData.oppositePhone" placeholder="Phone" />
          </div>
          <button type="button" class="btn btn-secondary" @click="prevStep">Previous</button>
          <button type="button" class="btn btn-success float-right" @click="submitForm">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
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
        oppositeName: '',
        oppositeEmail: '',
        oppositePhone: '',
        userType: '' // Store selected user type (mediator/client)
      }
    }
  },
  methods: {
    nextStep () {
      if (this.step < 3 && (this.formData.userType === 'client' || this.step < 2)) {
        this.step++
      }
    },
    prevStep () {
      if (this.step === 1) {
        this.step = 0 // Go back to Step 0 if user is on Step 1
      } else if (this.step > 0) {
        this.step-- // Go to the previous step if not on Step 0
      }
    },
    onFileChange (event) {
      this.formData.evidence = event.target.files[0]
    },
    submitForm () {
      const submissionData = { ...this.formData }
      this.$cookies.set('SIGNUPDATA', JSON.stringify(submissionData))
      this.$cookies.set('USERSTEP', 2)
      axios
        .post('/api/newUserSignup', this.formData)
        .then((response) => {
          if (response.data.error !== null) {
            this.$bvToast.toast(response.data.error, {
              title: 'Error',
              variant: 'error',
              solid: true
            })
          } else {
            console.log('Response:', response.data)
            alert('Account created successfully!')
            this.$router.push({ path: '/auth/sign-in' })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Account created successfully!')
          this.$router.push({ path: '/auth/sign-in' })
        })
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

</style>
