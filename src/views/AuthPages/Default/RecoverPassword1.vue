<template>
  <div>
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" ></Alert>
    <Spinner :isVisible="loading" />
    <h1 class="mb-0">Reset Password</h1>
    <p v-if="otpOption == false">Enter your email address and we'll send you an email with OTP (One Time Password) to reset your password.</p>
    <form v-if="otpOption == false" class="mt-4">
      <div class="mb-3">
        <label for="exampleInputEmail1">Email address</label>
        <input v-model="emailAddress" type="email" class="form-control mb-0" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
      </div>

      <div class="d-inline-block w-100">
        <button type="button" class="btn btn-secondary" @click="onClickBack">Back</button>
        <button type="button" class="btn btn-primary float-right ml" @click="onClickResetPassword">Reset Password</button>
      </div>
    </form>
    <form v-else class="mt-4">
      <div class="mb-3">
        <label for="exampleInputEmail1">OTP</label>
        <input v-model="otp" type="text" class="form-control mb-0" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter OTP from email">
      </div>
      <div class="mb-3 position-relative">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control mb-0" id="exampleInputPassword1" placeholder="Password">
        <i class="ri-eye-line password-toggle-icon" @click="togglePasswordVisibility" :class="{'ri-eye-off-line': !showPassword, 'ri-eye-line': showPassword}"></i>
      </div>
      <div class="mb-3 position-relative">
        <label for="exampleInputPassword1">Confirm Password</label>
        <input v-model="confirmPassword" :type="showPassword ? 'text' : 'password'" class="form-control mb-0" id="exampleInputPassword1" placeholder="Confirm Password">
        <i class="ri-eye-line password-toggle-icon" @click="togglePasswordVisibility" :class="{'ri-eye-off-line': !showPassword, 'ri-eye-line': showPassword}"></i>
      </div>
      <div class="d-inline-block w-100">
        <button type="button" class="btn btn-secondary" @click="onClickBackOTP">Back</button>
        <button type="button" class="btn btn-primary float-right ml" @click="onClickConfirmPassword">Reset Password</button>
      </div>
    </form>
  </div>
</template>
<script>
import Alert from '../../../components/sofbox/alert/Alert.vue'
import Spinner from '../../../components/sofbox/spinner/spinner.vue'

export default {
  name: 'RecoverPassword',
  components: {
    Alert, Spinner
  },
  mounted () {
  },
  data () {
    return {
      showPassword: false,
      emailAddress: '',
      otp: '',
      password: '',
      confirmPassword: '',
      otpOption: false,
      alert: {
        visible: false,
        message: '',
        type: 'primary'
      },
      loading: false
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
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    },
    onClickBackOTP () {
      this.otpOption = false
    },
    async onClickResetPassword () {
      if (this.emailAddress.trim() === '') {
        this.showAlert('Enter email address', 'danger')
        return
      }
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailPattern.test(this.emailAddress)) {
        this.showAlert('Invalid email address', 'danger')
        return
      }

      this.loading = true
      const response = await this.$store.dispatch('resetPassword', {
        emailAddress: this.emailAddress
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.showAlert('If the email address exists on our platform, you will receive an email with an OTP to reset your password', 'success')
        this.otpOption = true
      }
      this.loading = false
    },
    validatePassword (password) {
      if (password.length < 7) {
        return {
          error: true,
          message: 'Password must be at least 7 characters long.'
        }
      }

      const hasNumber = /[0-9]/
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/
      const hasAlphabet = /[a-zA-Z]/
      const hasUpperCase = /[A-Z]/

      if (!hasNumber.test(password)) {
        return {
          error: true,
          message: 'Password must include at least one numeric character.'
        }
      }

      if (!hasSpecialChar.test(password)) {
        return {
          error: true,
          message: 'Password must include at least one special character.'
        }
      }

      if (!hasAlphabet.test(password)) {
        return {
          error: true,
          message: 'Password must include at least one alphabetic character.'
        }
      }

      if (!hasUpperCase.test(password)) {
        return {
          error: true,
          message: 'Password must include at least one uppercase letter.'
        }
      }

      return {
        error: false,
        message: 'Password is valid.'
      }
    },
    async onClickConfirmPassword () {
      if (this.otp.trim() === '') {
        this.showAlert('Enter OTP', 'danger')
        return
      }
      if (this.password.trim() === '') {
        this.showAlert('Enter passowrd', 'danger')
        return
      }
      const passwordValidation = this.validatePassword(this.password)
      if (passwordValidation.error) {
        this.showAlert(passwordValidation.message, 'danger')
        return
      }
      if (this.confirmPassword.trim() === '') {
        this.showAlert('Enter confirm password', 'danger')
        return
      }
      if (this.password !== this.confirmPassword) {
        this.showAlert('Password and confirm password didn\'t match', 'danger')
        return
      }
      this.loading = true
      const response = await this.$store.dispatch('confirmPasswordChange', {
        emailAddress: this.emailAddress,
        otp: this.otp,
        password: this.password
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
        if (response.errorCode === 'E306') {
          this.otpOption = false
        }
      } else {
        this.showAlert(response.message, 'success')
        setTimeout(() => {
          this.onClickBack()
        }, 1000)
      }
      this.loading = false
    },
    onClickBack () {
      this.$router.push({ path: '/auth/sign-in' })
    }
  }
}
</script>
<style>
  .ml {
    margin-left: 0.5rem;
  }
</style>
