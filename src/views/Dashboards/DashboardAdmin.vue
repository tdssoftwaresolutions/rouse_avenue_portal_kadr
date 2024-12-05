<template>
    <b-container fluid>
        <b-row>
          <b-col sm="12">
            <iq-card body-class=" profile-page p-0">
              <template v-slot:body>
                <div class="profile-header">
                  <div class="cover-container">
                    <b-img :src="require('../../assets/images/page-img/profile-bg.jpg')" alt="profile-bg" rounded fluid style="width:100%;"/>
                    <ul class="header-nav d-flex flex-wrap justify-end p-0 m-0" style="display:none !important">
                      <li><b-link href="javascript:void();"><i class="ri-pencil-line"></i></b-link></li>
                      <li><b-link href="javascript:void();"><i class="ri-settings-4-line"></i></b-link></li>
                    </ul>
                  </div>
                  <div class="profile-info p-4">
                    <b-row>
                      <b-col md="6" sm="12" >
                        <div class="user-detail ps-5">
                          <div class="d-flex flex-wrap align-items-center">
                            <div class="profile-img pe-4">
                              <b-img :src="require('../../assets/images/user/11.png')" alt="profile-img" fluid class="avatar-130" />
                            </div>
                            <div class="profile-detail d-flex align-items-center">
                              <h3>Karan VJ</h3>
                              <p class="m-0 ps-3"> - Senior Mediator (kADR) </p>
                            </div>
                          </div>
                        </div>
                      </b-col>
                      <b-col md="6" sm="12" style="display: none;">
                        <ul class="nav nav-pills d-flex align-items-end float-right profile-feed-items p-0 m-0">
                          <li>
                            <b-link class="nav-link active" data-toggle="pill" href="#profile-feed">feed</b-link>
                          </li>
                          <li>
                            <b-link class="nav-link" data-toggle="pill" href="#profile-activity">Activity</b-link>
                          </li>
                          <li>
                            <b-link class="nav-link" data-toggle="pill" href="#profile-friends">friends</b-link>
                          </li>
                          <li>
                            <b-link class="nav-link" data-toggle="pill" href="#profile-profile">profile</b-link>
                          </li>
                        </ul>
                      </b-col>
                    </b-row>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col sm="12">
            <b-row>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
</template>
<script>

export default {
  name: 'DashboardAdmin',
  methods: {
    isSessionAvailable () {
      if (localStorage.getItem('accessToken')) {
        return true
      }
      return false
    }
  },
  data () {
    return {
    }
  }
}
</script>
