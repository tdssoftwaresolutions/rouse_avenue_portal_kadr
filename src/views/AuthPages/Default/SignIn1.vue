<template>
  <div>
    <h1 class="mb-0">Sign in</h1>
    <div class="mt-4">
      <div class="form-group">
        <label for="exampleInputEmail1">Username</label>
        <input v-model="emailAddress" type="email" class="form-control mb-0" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email or mobile number">
      </div>
      <div class="form-group  position-relative">
        <label for="exampleInputPassword1">Password</label>
        <a href="#" class="float-right">Forgot password?</a>
        <input v-model="password" :type="showPassword ? 'text' : 'password'" class="form-control mb-0" id="exampleInputPassword1" placeholder="Password">
        <i class="ri-eye-line password-toggle-icon" @click="togglePasswordVisibility" :class="{'ri-eye-off-line': !showPassword, 'ri-eye-line': showPassword}"></i>
      </div>
      <div class="d-inline-block w-100" style="display:none;">
        <div class="custom-control custom-checkbox d-inline-block mt-2 pt-1">
          <input type="checkbox" class="custom-control-input" id="customCheck1">
          <label class="custom-control-label" for="customCheck1">Remember Me</label>
        </div>
        <button class="btn btn-primary float-right" @click="onClickLogin">Sign in</button>
      </div>
      <div class="sign-info">
        <span class="dark-color d-inline-block line-height-2">Don't have an account? <a href="#" @click="onClickSignUp">Sign up</a></span>
        <ul class="iq-social-media"  style="display:none;">
          <li><a href="#"><i class="ri-facebook-box-line"></i></a></li>
          <li><a href="#"><i class="ri-twitter-line"></i></a></li>
          <li><a href="#"><i class="ri-instagram-line"></i></a></li>
        </ul>
      </div>
    </div>
    <b-alert :show="showError" variant="danger" class="text-white bg-danger" style="left: 50%;position: fixed;transform: translate(-50%, 0px);z-index: 9999;top: 5%;">
      <div class="iq-alert-icon">
        <i class="ri-alert-line"></i>
      </div>
      <div class="iq-alert-text">Invalid Username/Password</div>
    </b-alert>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  name: 'SignIn',
  data () {
    return {
      emailAddress: '',
      password: '',
      showError: false,
      showPassword: false
    }
  },
  mounted () {
    if (this.isSessionAvailable()) {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    isSessionAvailable () {
      if (localStorage.getItem('accessToken')) {
        return true
      }
      return false
    },
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    },
    onClickLogin () {
      axios
        .post('/api/login', {
          username: this.emailAddress,
          password: this.password
        })
        .then((response) => {
          if (response.data.error) {
            this.$bvToast.toast(response.data.error, {
              title: 'Error',
              variant: 'error',
              solid: true
            })
          } else {
            console.log('Response:', response.data)
            localStorage.setItem('accessToken', response.data.accessToken)
            this.$router.push({ path: '/' })
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Error!')
        })
    },
    onClickSignUp () {
      this.$router.push({ path: '/auth/sign-up' })
    }
  }
}
</script>
<style>
.password-toggle-icon {
  position: absolute;
  right: 10px;
  top: 70%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
}

.form-group {
  position: relative;
}
</style>
