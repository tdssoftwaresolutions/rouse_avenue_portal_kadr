<template>
  <div>
    <Loader/>
    <vue-scroll-progress-bar @complete="handleComplete" height="0.2rem" backgroundColor="linear-gradient(to right, #067bfe, #0885ff)" style="z-index: 10000" />
    <div class="wrapper">
      <!-- Sidebar  -->
      <SideBarStyle1 :items="sidebar" :logo="logo" />
      <!-- TOP Nav Bar -->
      <NavBarStyle1 title="Dashboard" :homeURL="{ name: 'dashboard1.home' }" :logo="logo">
        <template slot="responsiveRight">
          <ul class="navbar-nav ms-auto navbar-list">
            <li class="nav-item iq-full-screen"><a href="#" class="iq-waves-effect" id="btnFullscreen"><i class="ri-fullscreen-line"></i></a></li>
          </ul>
        </template>
        <template slot="right">
          <ul class="navbar-list">
            <li :class="profileClass">
              <a href="#" @click="onClickProfile" class="search-toggle iq-waves-effect bg-primary text-white">
                <img :src="userProfile" class="img-fluid rounded" alt="user">
              </a>
              <div class="iq-sub-dropdown iq-user-dropdown">
                <div class="iq-card shadow-none m-0">
                  <div class="iq-card-body p-0 ">
                    <div class="bg-primary p-3">
                      <h5 class="mb-0 text-white line-height">Hello {{ user.name }}</h5>
                    </div>
                    <div class="d-inline-block w-100 text-center p-3">
                      <a class="iq-bg-danger iq-sign-btn" v-on:click="onClickSignOut" role="button">Sign out<i class="ri-login-box-line ms-2"></i></a>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </NavBarStyle1>
      <!-- TOP Nav Bar END -->
      <div id="content-page" class="content-page">
        <transition name="router-anim">
          <router-view :user="user"/>
        </transition>
      </div>
    </div>
    <FooterStyle1>
      <template v-slot:left>
        <li class="list-inline-item"><a href="#">Privacy Policy</a></li>
        <li class="list-inline-item"><a href="#">Terms of Use</a></li>
      </template>
      <template v-slot:right>
        Copyright 2020 <a href="#">KADR.live</a> All Rights Reserved.
      </template>
    </FooterStyle1>
  </div>
</template>
<script>
import Loader from '../components/sofbox/loader/Loader'
import SideBarStyle1 from '../components/sofbox/sidebars/SideBarStyle1'
import NavBarStyle1 from '../components/sofbox/navbars/NavBarStyle1'
import SideBarItems from '../FackApi/json/SideBar'
import SideBarItemsMediator from '../FackApi/json/SideBarMediator'
import SideBarItemAdmin from '../FackApi/json/SideBarAdmin'
import profile from '../assets/images/user/1.jpeg'
import logo from '../assets/images/logo.png'
import { sofbox } from '../config/pluginInit'
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  name: 'Layout1 Component',
  components: {
    Loader, SideBarStyle1, NavBarStyle1
  },
  created () {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.$cookies.get('accessToken')}`
    }
    axios
      .get('/api/getUserData', {
        headers
      })
      .then((response) => {
        console.log(response.data)
        if (response.data.errorCode) {
          alert(response.data.message)
          this.$bvToast.toast(response.data.message, {
            title: 'Error',
            variant: 'error',
            solid: true
          })
        } else {
          this.validateData(headers, response.data)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  },
  mounted () {
    sofbox.mainIndex()
  },
  computed: {
    ...mapGetters({
      showNavTicket: 'TicketBooking/navTicket',
      numberOfTicket: 'TicketBooking/numberOfTicket'
    })
  },
  watch: {
  },
  data () {
    return {
      sidebar: SideBarItems,
      userProfile: profile,
      logo,
      user: '',
      profileClass: ''
    }
  },
  methods: {
    onClickProfile () {
      this.profileClass = this.profileClass === '' ? 'iq-show' : ''
    },
    validateData (headers, data) {
      axios
        .post('/api/verify-signature', data, {
          headers
        })
        .then((response) => {
          if (response.data.valid === true) {
            const userType = data.userData.type
            if (userType === 'MEDIATOR') {
              this.sidebar = SideBarItemsMediator
            } else if (userType === 'CLIENT') {
              this.sidebar = SideBarItems
            } else if (userType === 'ADMIN') {
              this.sidebar = SideBarItemAdmin
            }
            this.user = data.userData
          } else {
            this.onClickSignOut()
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    },
    handleComplete () {},
    onClickSignOut () {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.$cookies.get('accessToken')}`
      }
      axios
        .get('/api/logout', {
          headers
        })
        .then((response) => {
          this.$cookies.remove('accessToken')
          this.$router.push({ path: '/auth/sign-in' })
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  }
}
</script>
<style>
  @import url("../assets/css/custom.css");
</style>
