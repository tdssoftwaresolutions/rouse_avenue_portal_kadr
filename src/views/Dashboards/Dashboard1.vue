<template>
  <div>
    <b-container fluid v-if="userType == 'USER'">
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
                    <b-col md="6" sm="12">
                      <div class="user-detail pl-5">
                        <div class="d-flex flex-wrap align-items-center">
                          <div class="profile-img pr-4">
                            <b-img :src="require('../../assets/images/user/11.png')" alt="profile-img" fluid class="avatar-130" />
                          </div>
                          <div class="profile-detail d-flex align-items-center" style="display:block !important">
                            <h3>{{userData.name}}</h3>
                            <p class="m-0">{{userData.email}}</p>
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
            <b-col lg="3" class="profile-left" v-if="userStep == 2">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Payment</h4>
                  </template>
                  <template v-slot:body>
                    <p>Make a payment of Rs.1000/- to get started with your mediation</p>
                    <p>Mediator will be assigned to you post payment</p>
                    <button @click="openPaymentModal" class="btn btn-primary">Make Payment</button>
                  </template>
                </iq-card>
                <div v-if="showPaymentModal" class="modal-overlay">
                  <div class="modal-content">
                    <h2>Enter Payment Details</h2>
                    <form @submit.prevent="processPayment">
                      <div class="form-group">
                        <label for="cardNumber">Credit Card Number</label>
                        <input
                          type="text"
                          id="cardNumber"
                          class="form-control"
                          placeholder="Enter card number"
                          maxlength="16"
                          required
                        />
                      </div>
                      <div class="form-group">
                        <label for="cardHolderName">Cardholder Name</label>
                        <input
                          type="text"
                          id="cardHolderName"
                          class="form-control"
                          placeholder="Enter name on card"
                          required
                        />
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label for="expiryDate">Expiry Date</label>
                          <input
                            type="month"
                            id="expiryDate"
                            class="form-control"
                            required
                          />
                        </div>
                        <div class="form-group" style="margin-left:4rem;">
                          <label for="cvv">CVV</label>
                          <input
                            type="password"
                            id="cvv"
                            class="form-control"
                            placeholder="123"
                            maxlength="3"
                            required
                          />
                        </div>
                      </div>
                      <button type="submit" class="btn btn-success  mt-2" style="width: 100%;">Pay Rs.1000/-</button>
                    </form>
                    <button @click="closePaymentModal" class="btn btn-secondary mt-2">Cancel</button>
                  </div>
                </div>
            </b-col>
            <b-col lg="3" class="profile-left" v-if="userStep == 5">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Upcoming Meetings</h4>
                </template>
                <template v-slot:body>
                  <ul class="m-0 p-0 today-schedule">
                    <li class="d-flex">
                      <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-primary" /></div>
                      <div class="schedule-text"> <span>Mediation Call 1</span>
                        <span>25th November, 2024 (09:00AM)</span>
                        <a href="https://meet.google.com/htp-hzwh-uaz" @click="onClickMeeting" target="_blank">Link to Join Meeting</a>
                      </div>
                    </li>
                  </ul>
                </template>
              </iq-card>
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Mediator</h4>
                  </template>
                  <template v-slot:body>
                    <ul class="media-story m-0 p-0">
                      <li v-for="(item,index) in story" :key="index" class="d-flex align-items-center" :class="item.isActive +' '+ item.class">
                        <b-img :src="item.image" alt="story-img" rounded="circle" fluid />
                        <div class="stories-data ml-3">
                          <h5>{{ item.title }}</h5>
                          <p class="mb-0">{{ item.time }}</p>
                        </div>
                      </li>
                    </ul>
                  </template>
                </iq-card>
            </b-col>
            <b-col lg="3" class="profile-left" v-if="userStep == 6">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Mediation Agreement</h4>
                </template>
                <template v-slot:body>
                    <div>Congratulations, we are pleased to inform you that the mediation between you and the other party has been successfully resolved. With this positive outcome, we can now proceed to the agreement signature. Once signed, the agreement will be yours to keep as a record of this successful resolution.</div>
                    <b-button name="next" @click="onClickSign" id="submit" variant="primary" class="action-button" value="Sign Agreement" style="margin-top: 1rem;">Sign Agreement</b-button>
                  </template>
              </iq-card>
            </b-col>
            <b-col lg="3" class="profile-left" v-if="userStep == 7">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Success!</h4>
                </template>
                <template v-slot:body>
                    <div>Congratulations, your mediation is successfully completed! Thanks for using KADR.live</div>
                  </template>
              </iq-card>
            </b-col>
            <div v-if="showAadharModal" class="modal-overlay">
              <div class="modal-content">
                <h2 v-if="!otpRequested && !signatureStep">Aadhar Card Verification</h2>
                <h2 v-if="otpRequested && !signatureStep">Enter Aadhar OTP</h2>
                <h2 v-if="signatureStep">Sign the Agreement</h2>

                <!-- Aadhaar Entry Form -->
                <form v-if="!otpRequested && !signatureStep" @submit.prevent="requestOtp">
                  <div class="form-group">
                    <label for="aadharNumber">Enter Aadhar Card Number</label>
                    <input
                      type="text"
                      id="aadharNumber"
                      v-model="aadharNumber"
                      class="form-control"
                      placeholder="Enter your Aadhar number"
                      maxlength="12"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-success mt-2">Confirm My Aadhar</button>
                </form>

                <!-- OTP Entry Form -->
                <form v-if="otpRequested && !signatureStep" @submit.prevent="verifyOtp">
                  <div class="form-group">
                    <label for="aadharOtp">Enter Aadhar OTP</label>
                    <input
                      type="text"
                      id="aadharOtp"
                      v-model="aadharOtp"
                      class="form-control"
                      placeholder="Enter the OTP sent to your registered mobile"
                      maxlength="6"
                      required
                    />
                  </div>
                  <button type="submit" class="btn btn-success mt-2">Verify OTP</button>
                </form>

                <!-- Signature Pad -->
                <div v-if="signatureStep">
                  <label>Sign Below</label>
                  <VueSignaturePad width="100%" height="200px" ref="signaturePad" />
                  <button @click="clearSignature" class="btn btn-secondary mt-2">Clear</button>
                  <button @click="submitSignature" class="btn btn-success mt-2">Submit</button>
                </div>

                <!-- Cancel Button -->
                <button @click="closeAadharModal" class="btn btn-secondary mt-2">Cancel</button>
              </div>
            </div>
            <b-col lg="5" class="profile-right">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Timeline</h4>
                </template>
                <template v-slot:body>
                  <TimeLine :items="timelineItems" />
                </template>
              </iq-card>
            </b-col>
            <b-col lg="4" class="profile-center">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">About Me</h4>
                </template>
                <template v-slot:body>
                  <div class="about-info m-0 p-0">
                    <b-row>
                      <b-col cols="3">Email:</b-col>
                      <b-col cols="9"><b-link>{{ userData.email }}</b-link></b-col>
                      <b-col cols="3">Phone:</b-col>
                      <b-col cols="9"><b-link href="tel:001 2351 256 12">{{ userData.phone }}</b-link></b-col>
                      <b-col cols="3">Address:</b-col>
                      <b-col cols="9">{{ userData.address }}</b-col>
                      <b-col cols="3">City:</b-col>
                      <b-col cols="9">{{ userData.city }}</b-col>
                      <b-col cols="3">State:</b-col>
                      <b-col cols="9">{{ userData.state }}</b-col>
                      <b-col cols="3">Pincode:</b-col>
                      <b-col cols="9">{{ userData.pincode }}</b-col>
                    </b-row>
                  </div>
                </template>
              </iq-card>
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Opposite Party Details</h4>
                </template>
                <template v-slot:body>
                  <div class="about-info m-0 p-0">
                    <b-row>
                      <b-col cols="12">Opposite Party Details</b-col>
                      <b-col cols="3">Name:</b-col>
                      <b-col cols="9"><b-link>{{ userData.oppositeName }}</b-link></b-col>
                      <b-col cols="3">Email:</b-col>
                      <b-col cols="9"><b-link href="tel:001 2351 256 12">{{ userData.oppositeEmail }}</b-link></b-col>
                      <b-col cols="3">Phone:</b-col>
                    </b-row>
                  </div>
                </template>
              </iq-card>
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Case Details</h4>
                </template>
                <template v-slot:body>
                  <div class="about-info m-0 p-0">
                    <b-row>
                      <b-col cols="3">Case Id:</b-col>
                      <b-col cols="9"><b-link>#KDR3249223</b-link></b-col>
                      <b-col cols="3">Description:</b-col>
                      <b-col cols="9"><b-link href="tel:001 2351 256 12">{{ userData.description }}</b-link></b-col>
                      <b-col cols="3">Evidence:</b-col>
                      <b-col cols="9"><a :href="userData.evidence">View Evidence</a></b-col>
                      <b-col cols="3">Category:</b-col>
                      <b-col cols="9">{{ userData.category }}</b-col>
                    </b-row>
                  </div>
                </template>
              </iq-card>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid v-else>
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
                    <b-col md="6" sm="12" v-if="userStep == 3">
                      <div class="user-detail pl-5">
                        <div class="d-flex flex-wrap align-items-center">
                          <div class="profile-img pr-4">
                            <b-img :src="require('../../assets/images/user/11.png')" alt="profile-img" fluid class="avatar-130" />
                          </div>
                          <div class="profile-detail d-flex align-items-center">
                            <h3>Karan VJ</h3>
                            <p class="m-0 pl-3"> - Senior Mediator (kADR) </p>
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
                      <div class="media-support-info ml-3">
                        <h6>{{ selectedUser.name }}</h6>
                        <p class="mb-0">Case ID:{{ selectedUser.caseId }}</p>
                      </div>
                      <div class="add-suggestion"><b-link href="javascript:void();"><i class="ri-user-add-line"></i></b-link></div>
                    </li>
                    <li v-for="(item,index) in suggestions" :key="index" class="d-flex mb-4 align-items-center" @click="onClickCase">
                      <div class="user-img img-fluid">
                        <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                      </div>
                      <div class="media-support-info ml-3">
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
                    <p class="mb-0 text-secondary line-height"><i class="ri-arrow-up-line text-success mr-1"></i><span class="text-success">10%</span> Increased</p>
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
                    <p class="mb-0 text-secondary line-height"><i class="ri-arrow-down-line text-danger mr-1"></i><span class="text-danger">10%</span> Increased</p>
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
  </div>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import SignaturePad from 'signature_pad'

export default {
  name: 'Profile',
  mounted () {
    sofbox.index()
    this.userType = this.$cookies.get('type')
    this.userData = this.$cookies.get('SIGNUPDATA')
    this.userStep = this.$cookies.get('USERSTEP')
    if (!this.userType) {
      this.$router.push({ path: '/auth/sign-in' })
    }
    for (var i = 0; i < this.userStep; i++) {
      this.timelineItems[i].color = 'success'
    }
    this.$nextTick(() => {
      const canvas = this.$refs.signaturePad
      this.adjustCanvasSize(canvas)
      this.signaturePad = new SignaturePad(canvas)
    })
  },
  methods: {
    adjustCanvasSize (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d').scale(ratio, ratio)
    },
    clearSignature () {
      this.$refs.signaturePad.undoSignature()
    },
    openPaymentModal () {
      this.transactionId = `TXN${Math.floor(Math.random() * 1000000)}`
      this.showPaymentModal = true
    },
    closePaymentModal () {
      this.showPaymentModal = false
    },
    processPayment () {
      alert(
        `Payment Successful! Transaction ID: ${this.transactionId}`
      )
      this.userStep = 5
      this.$cookies.set('USERSTEP', 5)
      for (var i = 0; i < this.userStep; i++) {
        this.timelineItems[i].color = 'success'
      }
      this.closePaymentModal()
    },
    onClickMeeting () {
      this.userStep = 6
      this.$cookies.set('USERSTEP', 6)
    },
    onClickSign () {
      this.showAadharModal = true
    },
    closeAadharModal () {
      this.showAadharModal = false
      this.resetModal()
    },
    resetModal () {
      this.aadharNumber = ''
      this.aadharOtp = ''
      this.otpRequested = false
      this.signatureStep = false
    },
    requestOtp () {
      // Mock OTP request API call
      if (this.aadharNumber.length === 12) {
        this.otpRequested = true
      } else {
        alert('Invalid Aadhar Number')
      }
    },
    verifyOtp () {
      // Mock OTP verification
      if (this.aadharOtp.length === 6) {
        this.signatureStep = true
        this.initializeSignaturePad()
      } else {
        alert('Invalid OTP')
      }
    },
    initializeSignaturePad () {
      const canvas = this.$refs.signaturePad
      this.signaturePad = new SignaturePad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)'
      })
    },
    submitSignature () {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      console.log(isEmpty)
      console.log(data)
      alert('Signature submitted successfully!')
      this.closeAadharModal()
      this.userStep = 7
      this.$cookies.set('USERSTEP', 7)
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
      isModalVisible: false,
      note: '',
      showAadharModal: false,
      aadharNumber: '',
      aadharOtp: '',
      otpRequested: false,
      signatureStep: false,
      signaturePad: null,
      showPaymentModal: false,
      transactionId: '',
      userStep: 2,
      userData: {},
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
      },
      userType: '',
      galary: [
        { image: require('../../assets/images/page-img/g1.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g2.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g3.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g4.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g5.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g6.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g7.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g8.jpg'), href: 'javascript:void();' },
        { image: require('../../assets/images/page-img/g9.jpg'), href: 'javascript:void();' }
      ],
      timelineItems: [
        {
          color: '',
          title: 'Registration',
          right: '16 September 2024',
          description: 'Registration on our portal kADR.live',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: '',
          title: 'Other party details',
          right: '20 October 2024',
          description: 'Notice for mediation to another party through email',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: '',
          title: 'Payment',
          right: '22 October 2024',
          description: 'Payment to initiate mediation',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: '',
          title: 'Mediator Assignment',
          right: '22 October 2024',
          description: 'Assignment of Mediator',
          child: {
            type: 'img',
            items: [
              require('../../assets/images/user/05.jpg')
            ]
          }
        },
        {
          color: '',
          title: 'Client Call Scheduled',
          right: '19 November 2019',
          description: 'Call scheduled with you and customer',
          child: {
            type: 'img',
            items: [
            ]
          }
        },
        {
          color: '',
          title: 'Mediation Agreement',
          right: '15 November 2019',
          description: 'Mediation agreement signed between both parties',
          child: {
            type: 'img',
            items: [
            ]
          }
        }
      ],
      friends: [
        { name: 'Paul Molive', role: 'Web Designer', image: require('../../assets/images/user/01.jpg') },
        { name: 'Paul Molive', role: 'trainee', image: require('../../assets/images/user/01.jpg') },
        { name: 'Anna Mull', role: 'Web Developer', image: require('../../assets/images/user/02.jpg') },
        { name: 'Paige Turner', role: 'trainee', image: require('../../assets/images/user/03.jpg') },
        { name: 'Barb Ackue', role: 'Web Designer', image: require('../../assets/images/user/04.jpg') },
        { name: 'Greta Life', role: 'Tester', image: require('../../assets/images/user/05.jpg') },
        { name: 'Ira Membrit', role: 'Android Developer', image: require('../../assets/images/user/06.jpg') },
        { name: 'Pete Sariya', role: 'Web Designer', image: require('../../assets/images/user/07.jpg') }
      ],
      userBio: [
        { title: 'Joined', description: 'November 15, 2012' },
        { title: 'Lives', description: 'United States of America' },
        { title: 'Email', description: '<a href="mailto:nikjone@gmail.com"> nikjone@gmail.com</a>' },
        { title: 'Url', description: '<a href="https://getbootstrap.com/docs/4.0/getting-started/introduction/" target="_blank"> www.bootstrap.com </a>' },
        { title: 'Contact', description: '<a href="tel:001 4544 565 456">(001) 4544 565 456</a>' }
      ],
      story: [
        { title: 'Karan VJ', time: 'Senior Mediator (kADR)', image: require('../../assets/images/user/05.jpg'), class: 'mb-4', isActive: 'active' }
      ],
      suggestions: [
        { name: 'Paul Molive', mutual_friend: '#KDR124621', image: require('../../assets/images/user/01.jpg') },
        { name: 'Paige Turner', mutual_friend: '#KDR975436', image: require('../../assets/images/user/03.jpg') },
        { name: 'Barb Ackue', mutual_friend: '#KDR987474', image: require('../../assets/images/user/04.jpg') },
        { name: 'Greta Life', mutual_friend: '#KDR92375', image: require('../../assets/images/user/05.jpg') },
        { name: 'Ira Membrit', mutual_friend: '#KDR109475', image: require('../../assets/images/user/06.jpg') }
      ],
      news: [
        { description: 'there is a meetup in your city on friday at 19:00.<a href="#">see details</a>' },
        { description: '20% off coupon on selected items at pharmaprix' }
      ],
      twitterFeed: [
        {
          image: require('../../assets/images/user/01.jpg'),
          name: 'Anna Sthesia',
          username: '@anna59',
          isVerify: true,
          tags: [
            {
              link: '#',
              text: 'Html'
            },
            {
              link: '#',
              text: 'Bootstrap'
            }
          ],
          date: '07 Jan 2020',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        },
        {
          image: require('../../assets/images/user/02.jpg'),
          name: 'Paige Turner',
          username: '@paige30',
          isVerify: true,
          tags: [
            {
              link: '#',
              text: 'Js'
            },
            {
              link: '#',
              text: 'Bootstrap'
            }
          ],
          date: '07 Jan 2020',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        },
        {
          image: require('../../assets/images/user/03.jpg'),
          name: 'Greta Life',
          username: '@greta07',
          isVerify: false,
          tags: [
            {
              link: '#',
              text: 'Html'
            },
            {
              link: '#',
              text: 'CSS'
            }
          ],
          date: '07 Jan 2020',
          description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        }
      ]
    }
  }
}
</script>
<style>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Modal Content */
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width:500px;
}

.modal-content h2 {
  margin-bottom: 15px;
}

.modal-content p {
  margin: 10px 0;
}

.modal-content .btn {
  margin-top: 15px;
}
.signature-pad {
  border: 1px solid #ccc;
  width: 100%;
  height: 200px;
  margin: 20px 0;
}
</style>
