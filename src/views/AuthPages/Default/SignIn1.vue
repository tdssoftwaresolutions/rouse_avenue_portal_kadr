<template>
  <div>
    <h1 class="mb-0">Sign in</h1>
    <div class="mt-4">
      <div class="form-group">
        <label for="exampleInputEmail1">Username</label>
        <input v-model="emailAddress" type="email" class="form-control mb-0" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email or mobile number">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <a href="#" class="float-right">Forgot password?</a>
        <input type="password" class="form-control mb-0" id="exampleInputPassword1" placeholder="Password">
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
export default {
  name: 'SignIn',
  data () {
    return {
      emailAddress: '',
      showError: false
    }
  },
  mounted () {
    const userType = this.$cookies.get('type')
    if (userType) {
      this.$router.push({ path: '/' })
    }
  },
  methods: {
    onClickLogin () {
      if (this.emailAddress.includes('user')) {
        this.$cookies.set('type', 'USER')
        this.$cookies.set('hasSession', 'true')
        this.$router.push({ path: '/' })
      } else if (this.emailAddress.includes('mediator')) {
        this.$cookies.set('type', 'MEDIATOR')
        this.$cookies.set('hasSession', 'true')
        this.$router.push({ path: '/' })
      } else {
        this.showError = true
      }
    },
    onClickSignUp () {
      this.$router.push({ path: '/auth/sign-up' })
    }
  }
}
</script>
