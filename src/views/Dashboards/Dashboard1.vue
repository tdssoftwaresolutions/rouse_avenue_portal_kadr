<template>
  <div>
    <div class="dots" v-if="dashboardContent == null"> </div>
    <div v-else>
      <dashboard-client v-if="user.type == 'CLIENT'" :user="user" :content="dashboardContent"/>
      <dashboard-mediator v-else-if="user.type == 'MEDIATOR'" :user="user"  :content="dashboardContent"/>
      <dashboard-admin v-else-if="user.type == 'ADMIN'" :user="user"  :content="dashboardContent"/>
    </div>
  </div>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import DashboardMediator from './DashboardMediator'
import DashboardClient from './DashboardClient'
import DashboardAdmin from './DashboardAdmin'
import axios from 'axios'

export default {
  name: 'Dashboard',
  components: {
    DashboardMediator, DashboardClient, DashboardAdmin
  },
  props: {
    user: null
  },
  data () {
    return {
      dashboardContent: null
    }
  },
  watch: {
    user (newUser, oldUser) {
      if (newUser !== oldUser) {
        this.getDashboardContent()
      }
    }
  },
  mounted () {
    sofbox.index()
    if (!this.isSessionAvailable()) {
      this.$router.push({ path: '/auth/sign-in' })
    }
  },
  methods: {
    isSessionAvailable () {
      if (this.$cookies.get('accessToken')) {
        return true
      }
      return false
    },
    getDashboardContent () {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.$cookies.get('accessToken')}`
      }
      axios
        .get('/api/getDashboardContent', {
          headers
        })
        .then((response) => {
          if (response.data.error) {
            this.$bvToast.toast(response.data.error, {
              title: 'Error',
              variant: 'error',
              solid: true
            })
          } else {
            this.dashboardContent = response.data
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Error!')
        })
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
