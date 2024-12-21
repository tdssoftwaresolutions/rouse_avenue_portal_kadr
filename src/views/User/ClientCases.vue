<template>
    <b-row>
      <b-col lg="12" v-if="content.myCases.length > 1">
        <h3 style="padding-bottom: 1rem;font-weight: 200;">My Ongoing Cases</h3>
        <iq-card body-class="p-0">
          <template v-slot:body>
            <div class="iq-edit-list">
              <tab-nav :pills="true" class="iq-edit-profile d-flex">
                <tab-nav-items class="col-3 p-0" :active="index == 0 || selectedCase.id == myCase.id" v-for="(myCase, index) in content.myCases" :key="index" :clickHandler="(event) => onClickCase(myCase)" :title="myCase.caseId" />
              </tab-nav>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="12">
        <h3 style="padding-bottom: 1rem;font-weight: 200;" v-if="content.myCases.length == 1">My Case</h3>
        <div class="iq-edit-list-data">
          <tab-content>
            <tab-content-item :active="true">
              <iq-card style="background: #e7ecf4;">
                <template v-slot:body>
                  <b-row>
                    <b-col lg="3" md="12">
                      <iq-card class="iq-profile-card text-center">
                        <template v-slot:headerTitle>
                          <h4 class="card-title">Assigned Mediator</h4>
                        </template>
                        <template v-slot:body>
                          <div class="iq-team text-center p-0">
                            <img :src="require('../../assets/images/user/07.jpg')"
                                class="img-fluid mb-3 avatar-120 rounded-circle" alt="">
                            <h4 class="mb-0">Welcome {{ selectedCase.user_cases_mediatorTouser?.name }}</h4>
                          </div>
                        </template>
                      </iq-card>
                      <iq-card v-if="userStep == 2">
                        <template v-slot:headerTitle>
                          <h4 class="card-title">Payment</h4>
                          </template>
                          <template v-slot:body>
                            <p>Make a payment of Rs.1000/- to get started with your mediation</p>
                            <p>Mediator will be assigned to you post payment</p>
                            <button @click="openPaymentModal" class="btn btn-primary">Make Payment</button>
                          </template>
                      </iq-card>
                      <iq-card v-if="userStep == 5">
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
                      <iq-card v-if="userStep == 5">
                        <template v-slot:headerTitle>
                          <h4 class="card-title">Mediator</h4>
                          </template>
                          <template v-slot:body>
                            <ul class="media-story m-0 p-0">
                              <li v-for="(item,index) in story" :key="index" class="d-flex align-items-center" :class="item.isActive +' '+ item.class">
                                <b-img :src="item.image" alt="story-img" rounded="circle" fluid />
                                <div class="stories-data ms-3">
                                  <h5>{{ item.title }}</h5>
                                  <p class="mb-0">{{ item.time }}</p>
                                </div>
                              </li>
                            </ul>
                          </template>
                        </iq-card>
                        <iq-card v-if="userStep == 6">
                          <template v-slot:headerTitle>
                            <h4 class="card-title">Mediation Agreement</h4>
                          </template>
                          <template v-slot:body>
                              <div>Congratulations, we are pleased to inform you that the mediation between you and the other party has been successfully resolved. With this positive outcome, we can now proceed to the agreement signature. Once signed, the agreement will be yours to keep as a record of this successful resolution.</div>
                              <b-button name="next" @click="onClickSign" id="submit" variant="primary" class="action-button" value="Sign Agreement" style="margin-top: 1rem;">Sign Agreement</b-button>
                            </template>
                        </iq-card>
                        <iq-card v-if="userStep == 7">
                          <template v-slot:headerTitle>
                            <h4 class="card-title">Success!</h4>
                          </template>
                          <template v-slot:body>
                              <div>Congratulations, your mediation is successfully completed! Thanks for using KADR.live</div>
                            </template>
                        </iq-card>
                        <div v-if="showPaymentModal" class="modal-overlay">
                          <div class="modal-content">
                            <h2>Enter Payment Details</h2>
                            <form @submit.prevent="processPayment">
                              <div class="mb-3">
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
                              <div class="mb-3">
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
                                <div class="mb-3">
                                  <label for="expiryDate">Expiry Date</label>
                                  <input
                                    type="month"
                                    id="expiryDate"
                                    class="form-control"
                                    required
                                  />
                                </div>
                                <div class="mb-3" style="margin-left:4rem;">
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
                        <div v-if="showAadharModal" class="modal-overlay">
                          <div class="modal-content">
                            <h2 v-if="!otpRequested && !signatureStep">Aadhar Card Verification</h2>
                            <h2 v-if="otpRequested && !signatureStep">Enter Aadhar OTP</h2>
                            <h2 v-if="signatureStep">Sign the Agreement</h2>

                            <!-- Aadhaar Entry Form -->
                            <form v-if="!otpRequested && !signatureStep" @submit.prevent="requestOtp">
                              <div class="mb-3">
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
                              <div class="mb-3">
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
                    </b-col>
                    <b-col lg="5" md="12">
                      <iq-card>
                        <template v-slot:headerTitle>
                          <h4 class="card-title">Case Details</h4>
                        </template>
                        <template v-slot:body>
                          <div>
                            <div class="data-row">
                                <div class="col-6">
                                    <div class="data-title">Case ID</div>
                                    <div>{{ selectedCase.caseId }}</div>
                                </div>
                                <div class="col-6">
                                    <div class="data-title">Case Type</div>
                                    <div>{{ selectedCase.case_type }}</div>
                                </div>
                            </div>
                            <div class="data-row">
                                <div class="col-6">
                                    <div class="data-title">Case Category</div>
                                    <div>{{ selectedCase.category }}</div>
                                </div>
                                <div class="col-6">
                                    <div class="data-title">Evidence</div>
                                    <div  v-if="selectedCase.evidence_document_url"> <a :href="selectedCase.evidence_document_url" target="_blank">Link to document</a></div>
                                </div>
                            </div>
                            <div class="long-description">
                                <div class="data-title">Case Description</div>
                                <textarea rows="5" readonly :value="selectedCase.description">
                                </textarea>
                            </div>
                          </div>
                        </template>
                      </iq-card>
                      <iq-card v-if="selectedCase.user_cases_second_partyTouser">
                        <template v-slot:headerTitle>
                          <h4 class="card-title">Opposite Party Details</h4>
                        </template>
                        <template v-slot:body>
                          <div v-if="selectedCase.user_cases_first_partyTouser?.id == userid">
                            <div class="data-row">
                                <div class="col-6">
                                    <div class="data-title">Name</div>
                                    <div>{{ selectedCase.user_cases_second_partyTouser?.name }}</div>
                                </div>
                                <div class="col-6">
                                    <div class="data-title">Email</div>
                                    <div>{{ selectedCase.user_cases_second_partyTouser?.email }}</div>
                                </div>
                            </div>
                            <div class="data-row">
                                <div class="col-6">
                                    <div class="data-title">Phone</div>
                                    <div>{{ selectedCase.user_cases_second_partyTouser?.phone }}</div>
                                </div>
                            </div>
                          </div>
                          <div v-else-if="selectedCase.user_cases_second_partyTouser?.id == userid">
                            <div class="data-row">
                                <div class="col-6">
                                    <div class="data-title">Name</div>
                                    <div>{{ selectedCase.user_cases_first_partyTouser?.name }}</div>
                                </div>
                                <div class="col-6">
                                    <div class="data-title">Email</div>
                                    <div>{{ selectedCase.user_cases_first_partyTouser?.email }}</div>
                                </div>
                            </div>
                            <div class="data-row">
                                <div class="col-6">
                                    <div class="data-title">Phone</div>
                                    <div>{{ user_cases_first_partyTouser?.phone }}</div>
                                </div>
                            </div>
                          </div>
                        </template>
                      </iq-card>
                    </b-col>
                    <b-col lg="4" md="12">
                      <iq-card>
                        <template v-slot:headerTitle>
                          <h4 class="card-title">Timeline</h4>
                        </template>
                        <template v-slot:body>
                          <TimeLine :items="timelineItems" />
                        </template>
                      </iq-card>
                    </b-col>
                  </b-row>
                </template>
              </iq-card>
            </tab-content-item>
          </tab-content>
        </div>
      </b-col>
    </b-row>
</template>
<script>
import SignaturePad from 'signature_pad'
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'ProfileEdit',
  props: {
    content: {
      type: Object,
      Required: true
    },
    userid: {
      type: String,
      Required: true
    }
  },
  mounted () {
    sofbox.index()
    this.$nextTick(() => {
      const canvas = this.$refs.signaturePad
      this.adjustCanvasSize(canvas)
      this.signaturePad = new SignaturePad(canvas)
    })
    this.selectedCase = this.content.myCases[0]
    for (let i = 0; i < this.userStep; i++) {
      this.timelineItems[i].color = 'success'
    }
  },
  methods: {
    adjustCanvasSize (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      if (canvas) {
        canvas.width = canvas?.offsetWidth * ratio
        canvas.height = canvas?.offsetHeight * ratio
        canvas.getContext('2d').scale(ratio, ratio)
      }
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
      for (let i = 0; i < this.userStep; i++) {
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
    onClickCase (myCase) {
      this.selectedCase = myCase
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
    }
  },
  data () {
    return {
      showAadharModal: false,
      aadharNumber: '',
      aadharOtp: '',
      otpRequested: false,
      signatureStep: false,
      signaturePad: null,
      selectedCase: { data: true },
      showPaymentModal: false,
      transactionId: '',
      userStep: 2,
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
      ]
    }
  }
}
</script>
<style lang="css" scoped>
  .data-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f1f1;
  }

  .data-row:last-child {
    border-bottom: none;
  }

  .data-title {
    font-weight: bold;
  }

.long-description {
  padding: 10px;
}

.long-description textarea {
  width: 100%;
  resize: none;
  border: 0px;
}

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
</style>
