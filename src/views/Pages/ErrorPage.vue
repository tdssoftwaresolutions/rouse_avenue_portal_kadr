<template>
  <div class="container-fluid p-0">
    <div class="row no-gutters">
      <div class="col-sm-12 text-center">
        <div class="iq-error">
          <h1>{{ this.$route.params.code }}</h1>
          <h4 class="mb-0">Oops! This Page is Not Found.</h4>
          <p>The requested page dose not exist.</p>
          <a class="btn btn-primary mt-3" href="#"><i class="ri-home-4-line"></i>Back to Home</a>
          <img :src="require('../../assets/images/error/01.png')" class="img-fluid iq-error-img" alt="error">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { sofbox } from '../../config/pluginInit'

export default {
  name: 'ErrorPage',
  mounted () {
    sofbox.index()
  }
}
</script>
