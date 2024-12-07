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
              <b-col lg="3" class="profile-left">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">My Cases</h4>
                  </template>
                  <template v-slot:headerAction>
                    <b-link href="#"><i class="ri-more-fill"></i></b-link>
                  </template>
                  <template v-slot:body>
                    <ul class="suggestions-lists m-0 p-0">
                      <li class="d-flex mb-4 align-items-center" @click="onClickCase">
                        <div class="user-img img-fluid">
                          <b-img :src="selectedUser.image" alt="story-img" rounded="circle" class="avatar-40" />
                        </div>
                        <div class="media-support-info ms-3">
                          <h6>{{ selectedUser.name }}</h6>
                          <p class="mb-0">Case ID:{{ selectedUser.caseId }}</p>
                        </div>
                        <div class="add-suggestion"><b-link href="javascript:void();"><i class="ri-user-add-line"></i></b-link></div>
                      </li>
                      <li v-for="(item,index) in suggestions" :key="index" class="d-flex mb-4 align-items-center" @click="onClickCase">
                        <div class="user-img img-fluid">
                          <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                        </div>
                        <div class="media-support-info ms-3">
                          <h6>{{ item.name }}</h6>
                          <p class="mb-0">{{ item.mutual_friend }}</p>
                        </div>
                        <div class="add-suggestion"><b-link href="javascript:void();"><i class="ri-user-add-line"></i></b-link></div>
                      </li>
                    </ul>
                  </template>
                </iq-card>
                <b-modal v-model="isModalVisible" title="User Details"  :size="'lg'" centered>
                  <div>
                    <h5>User Details</h5>
                    <p><strong>Name:</strong> {{ selectedUser.name }}</p>
                    <p><strong>Phone:</strong> {{ selectedUser.phone }}</p>
                    <p><strong>Email:</strong> {{ selectedUser.email }}</p>
                    <hr>
                    <h5>Opponent Details</h5>
                    <p><strong>Name:</strong> {{ selectedUser.opponent.name }}</p>
                    <p><strong>Email:</strong> {{ selectedUser.opponent.email }}</p>
                    <p><strong>Phone:</strong> {{ selectedUser.opponent.phone }}</p>
                    <hr>
                    <h5>Case Details</h5>
                    <p><strong>Case ID:</strong> {{ selectedUser.caseId }}</p> <!-- Added Case ID -->
                    <p><strong>Category:</strong> {{ selectedUser.case.category }}</p>
                    <p><strong>Evidence:</strong> <a :href="selectedUser.case.evidence" target="_blank">View Evidence</a></p>
                    <hr>
                    <b-form-textarea v-model="note" placeholder="Enter your notes here..." rows="3"></b-form-textarea>
                    <b-button @click="saveNote" variant="primary" class="mt-2">Save Note</b-button>
                  </div>
                </b-modal>
              </b-col>
              <b-col lg="6" class="profile-center">
                <iq-card class-name="overflow-hidden" body-class="pb-0">
                  <template v-slot:body>
                    <div class="rounded-circle iq-card-icon iq-bg-primary"><i class="ri-exchange-dollar-fill"></i></div>
                    <span class="float-right line-height-6">Current Month's Income</span>
                    <div class="clearfix"></div>
                    <div class="text-center">
                      <h2 class="mb-0"><span class="counter">Rs.</span><span>65k</span></h2>
                      <p class="mb-0 text-secondary line-height"><i class="ri-arrow-up-line text-success ms-1"></i><span class="text-success">10%</span> Increased</p>
                    </div>
                  </template>
                  <ApexChart element="chart-1" :chartOption="chart1"/>
                </iq-card>
                <iq-card class-name="overflow-hidden" body-class="pb-0">
                  <template v-slot:body>
                    <div class="rounded-circle iq-card-icon iq-bg-danger"><i class="ri-shopping-cart-line"></i></div>
                    <span class="float-right line-height-6">Number of Cases Resolved</span>
                    <div class="clearfix"></div>
                    <div class="text-center">
                      <h2 class="mb-0"><span class="counter">30</span><span></span></h2>
                      <p class="mb-0 text-secondary line-height"><i class="ri-arrow-down-line text-danger ms-1"></i><span class="text-danger">10%</span> Increased</p>
                    </div>
                  </template>
                  <ApexChart element="chart-4" :chartOption="chart4"/>
                </iq-card>
              </b-col>
              <b-col lg="3" class="profile-right">
                <iq-card>
                  <template v-slot:headerTitle>
                    <h4 class="card-title">About</h4>
                  </template>
                  <template v-slot:body>
                    <div class="about-info m-0 p-0">
                      <b-row>
                        <b-col cols="12"><p>Lorem ipsum dolor sit amet, contur adipiscing elit.</p></b-col>
                        <b-col cols="3">Email:</b-col>
                        <b-col cols="9"><b-link href="mailto:nikjone@demoo.com"> nikjone@demoo.com </b-link></b-col>
                        <b-col cols="3">Phone:</b-col>
                        <b-col cols="9"><b-link href="tel:001 2351 256 12">001 2351 256 12</b-link></b-col>
                        <b-col cols="3">Location:</b-col>
                        <b-col cols="9">USA</b-col>
                      </b-row>
                    </div>
                  </template>
                </iq-card>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
</template>
<script>

export default {
  name: 'DashboardMediator',
  methods: {
    isSessionAvailable () {
      if (this.$cookies.get('accessToken')) {
        return true
      }
      return false
    },
    onClickCase () {
      this.note = this.$cookies.get('notes') || ''
      this.isModalVisible = true
    },
    saveNote () {
      if (this.selectedUser) {
        this.$cookies.set('notes', this.note)
        this.$bvToast.toast('Note saved!', {
          title: 'Success',
          variant: 'success',
          solid: true
        })
      }
    }
  },
  data () {
    return {
      isModalVisible: false,
      selectedUser: {
        id: 1,
        name: 'John Doe',
        phone: '123-456-7890',
        caseId: '#KDR436988',
        image: require('../../assets/images/user/03.jpg'),
        email: 'john.doe@example.com',
        opponent: { name: 'Jane Doe', phone: '987-654-3210', email: 'jane.doe@example.com' },
        case: { category: 'Dispute', evidence: 'https://example.com/evidence.pdf' }
      },
      note: '',
      suggestions: [
        { name: 'Paul Molive', mutual_friend: '#KDR124621', image: require('../../assets/images/user/01.jpg') },
        { name: 'Paige Turner', mutual_friend: '#KDR975436', image: require('../../assets/images/user/03.jpg') },
        { name: 'Barb Ackue', mutual_friend: '#KDR987474', image: require('../../assets/images/user/04.jpg') },
        { name: 'Greta Life', mutual_friend: '#KDR92375', image: require('../../assets/images/user/05.jpg') },
        { name: 'Ira Membrit', mutual_friend: '#KDR109475', image: require('../../assets/images/user/06.jpg') }
      ],
      chart1: {
        chart: {
          height: 80,
          type: 'area',
          sparkline: {
            enabled: true
          },
          group: 'sparklines'

        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0
          }
        },
        series: [{
          name: 'series1',
          data: [60, 15, 50, 30, 70]
        }],
        colors: ['#0084ff'],

        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      },
      chart4: {
        chart: {
          height: 80,
          type: 'area',
          sparkline: {
            enabled: true
          },
          group: 'sparklines'

        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 3,
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0
          }
        },
        series: [{
          name: 'series1',
          data: [75, 30, 60, 35, 60]
        }],
        colors: ['#e64141'],
        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      }
    }
  }
}
</script>
