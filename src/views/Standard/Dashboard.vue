<template>
  <div>
    <div class="dots" v-if="dashboardContent == null"> </div>
    <div v-else>
      <dashboard-mediator v-if="user.type == 'MEDIATOR'" :user="user"  :content="dashboardContent"/>
      <dashboard-judge v-else-if="user.type == 'JUDGE'" :user="user"  :content="dashboardContent"/>
      <dashboard-m-c v-else-if="user.type == 'MC'" :user="user"  :content="dashboardContent"/>
    </div>
  </div>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import DashboardMediator from '../Mediator/DashboardMediator.vue'
import DashboardJudge from '../Judge/DashboardJudge.vue'
import DashboardMC from '../MC/DashboardMC.vue'

export default {
  name: 'Dashboard',
  components: {
    DashboardMediator, DashboardJudge, DashboardMC
  },
  props: {
    user: null
  },
  data () {
    return {
      dashboardContent: null
    }
  },
  mounted () {
    sofbox.index()
    if (!this.isSessionAvailable()) {
      this.$router.push({ path: '/auth/sign-in' })
    } else {
      this.getDashboardContent()
    }
  },
  methods: {
    isSessionAvailable () {
      if (this.$cookies.get('accessToken')) {
        return true
      }
      return false
    },
    async getDashboardContent () {
      const response = await this.$store.dispatch('getDashboardContent')
      if (response.success) {
        this.dashboardContent = response.data.dashboardContent
      }
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
