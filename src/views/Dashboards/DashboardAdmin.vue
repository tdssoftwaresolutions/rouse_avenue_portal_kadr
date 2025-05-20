<template>
  <b-container fluid>
    <b-row>
      <b-col lg="3" md="12">
        <iq-card class="iq-profile-card text-center">
          <template v-slot:body>
            <div class="iq-team text-center p-0">
              <img :src="require('../../assets/images/user/1.jpg')"
                  class="img-fluid mb-3 avatar-120 rounded-circle" alt="">
              <h4 class="mb-0">{{ user.name }}</h4>
              <p class="d-inline-block w-100">{{ user.email }}</p>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="9" md="12">
        <b-row>
          <b-col md="4">
            <iq-card>
              <template v-slot:body>
                <b-row>
                  <b-col lg="12" class="mb-2 d-flex justify-content-between">
                    <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                      <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/call-center.gif')" alt="summary-image" />
                    </div>
                  </b-col>
                  <b-col lg="12" class="mt-3">
                    <h6 class="card-title text-uppercase text-secondary mb-0">No. of registered Mediators</h6>
                    <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{content.count.mediators}}</span>
                  </b-col>
                </b-row>
              </template>
            </iq-card>
          </b-col>
          <b-col md="4">
            <iq-card>
              <template v-slot:body>
                <b-row>
                  <b-col lg="12" class="mb-2 d-flex justify-content-between">
                    <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                      <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/happy.gif')" alt="summary-image" />
                    </div>
                  </b-col>
                  <b-col lg="12" class="mt-3">
                    <h6 class="card-title text-uppercase text-secondary mb-0">No. of registered Clients</h6>
                    <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{content.count.clients}}</span>
                  </b-col>
                </b-row>
                </template>
              </iq-card>
            </b-col>
            <b-col md="4">
              <iq-card>
                <template v-slot:body>
                  <b-row>
                    <b-col lg="12" class="mb-2 d-flex justify-content-between">
                      <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                        <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/checklist.gif')" alt="summary-image" />
                      </div>
                    </b-col>
                    <b-col lg="12" class="mt-3">
                      <h6 class="card-title text-uppercase text-secondary mb-0">No. of cases</h6>
                      <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{content.count.cases}}</span>
                    </b-col>
                  </b-row>
                </template>
              </iq-card>
            </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-card no-body>
          <b-tabs card>
            <b-tab :title="'New Clients ('+content.inactive_users.total+')'" active><p>
              <inactive-users :users="content.inactive_users" type="CLIENT" :columns="clientColumns"></inactive-users>
            </p></b-tab>
            <b-tab :title="'New Dispute Resolution Experts ('+content.inactive_mediators.total+')'"><p>
              <inactive-users :users="content.inactive_mediators" type="MEDIATOR" :columns="mediatorColumns"></inactive-users>
            </p></b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import InactiveUsers from '../Tables/InactiveUsers.vue'

export default {
  name: 'DashboardAdmin',
  props: {
    user: null,
    content: null
  },
  components: {
    InactiveUsers
  },
  data () {
    return {
      clientColumns: [
        { label: 'Name', key: 'name', class: 'text-left', sortable: true },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Case Category', key: 'category', class: 'text-left', sortable: true },
        { label: 'Case Type', key: 'case_type', class: 'text-center', sortable: true },
        { label: 'Is Active', key: 'active', class: 'text-center' },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      mediatorColumns: [
        { label: 'Name', key: 'name', class: 'text-left', sortable: true },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Phone Number', key: 'phone_number', class: 'text-left' },
        { label: 'State', key: 'state', class: 'text-left', sortable: true },
        { label: 'Preferred Area of Practice', key: 'preferred_area_of_practice', class: 'text-center', sortable: true },
        { label: 'Is Active', key: 'active', class: 'text-center' },
        { label: 'Action', key: 'action', class: 'text-center' }
      ]
    }
  }
}
</script>
<style>
img.summary-image-top {
    width: 50px;
}
</style>
