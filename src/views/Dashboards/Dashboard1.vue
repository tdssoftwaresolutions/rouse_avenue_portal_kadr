<template>
  <div>
    <div class="dots" v-if="userType == ''"> </div>
    <div v-else>
      <dashboard-client v-if="userType == 'CLIENT'" />
      <dashboard-mediator v-else-if="userType == 'MEDIATOR'"/>
      <dashboard-admin v-else-if="userType == 'ADMIN'"/>
    </div>
  </div>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import DashboardMediator from './DashboardMediator'
import DashboardClient from './DashboardClient'
import DashboardAdmin from './DashboardAdmin'
export default {
  name: 'Dashboard',
  components: {
    DashboardMediator, DashboardClient, DashboardAdmin
  },
  props: {
    userType: String
  },
  mounted () {
    sofbox.index()
    if (!this.isSessionAvailable()) {
      this.$router.push({ path: '/auth/sign-in' })
    }
  },
  methods: {
    isSessionAvailable () {
      if (localStorage.getItem('accessToken')) {
        return true
      }
      return false
    }
  }
}
</script>

<style>
.dots {
   width: 56px;
   height: 26.9px;
   background: radial-gradient(circle closest-side,#474bff 90%,#0000) 0%   50%,
          radial-gradient(circle closest-side,#474bff 90%,#0000) 50%  50%,
          radial-gradient(circle closest-side,#474bff 90%,#0000) 100% 50%;
   background-size: calc(100%/3) 13.4px;
   background-repeat: no-repeat;
   animation: dots-7ar3yq 1s infinite linear;
   margin-left: auto;
   margin-top: 20%;
   margin-right: auto;
}

@keyframes dots-7ar3yq {
   20% {
      background-position: 0%   0%, 50%  50%,100%  50%;
   }

   40% {
      background-position: 0% 100%, 50%   0%,100%  50%;
   }

   60% {
      background-position: 0%  50%, 50% 100%,100%   0%;
   }

   80% {
      background-position: 0%  50%, 50%  50%,100% 100%;
   }
}
</style>
