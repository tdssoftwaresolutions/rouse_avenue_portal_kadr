<template>
  <div>
    <h1 class="mb-0">Get Started</h1>
    <span class="dark-color d-inline-block line-height-2">Already Have Account ? <a href="#" @click="onClickLogin">Log In</a></span>
    <form class="mt-4">
      <!-- Step 1: Personal Information -->
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
        <div class="form-group">
          <label for="address">Complete Address</label>
          <textarea class="form-control" id="address" v-model="formData.address" placeholder="Complete Address"></textarea>
        </div>
        <button type="button" class="btn btn-primary float-right" @click="nextStep">Next</button>
      </div>

      <!-- Step 2: Complaint Details -->
      <div v-if="step === 2">
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
          <input type="file" class="form-control" id="evidence" @change="onFileChange" />
        </div>
        <button type="button" class="btn btn-secondary" @click="prevStep">Previous</button>
        <button type="button" class="btn btn-primary float-right" @click="nextStep">Next</button>
      </div>

      <!-- Step 3: Opposite Party Details -->
      <div v-if="step === 3">
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
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      step: 1, // Tracks the current step in the form
      formData: {
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        pincode: '',
        address: '',
        description: '',
        category: '',
        evidence: null,
        oppositeName: '',
        oppositeEmail: '',
        oppositePhone: ''
      }
    }
  },
  methods: {
    nextStep () {
      if (this.step < 3) this.step++
    },
    prevStep () {
      if (this.step > 1) this.step--
    },
    onFileChange (event) {
      this.formData.evidence = event.target.files[0]
    },
    submitForm () {
      const submissionData = { ...this.formData }
      this.$cookies.set('SIGNUPDATA', JSON.stringify(submissionData))
      this.$cookies.set('USERSTEP', 2)
      axios
        .get('/api/sendemail/' + this.formData.oppositeEmail + '/' + this.formData.oppositeName)
        .then((response) => {
          console.log('Response:', response.data)
          alert('Account created successfully!')
          this.$router.push({ path: '/auth/sign-in' })
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Account created successfully!')
          this.$router.push({ path: '/auth/sign-in' })
        })
    },
    onClickLogin () {
      this.$router.push({ path: '/auth/sign-in' })
    }
  }
}
</script>

<style>
/* Add your styling here */
</style>
