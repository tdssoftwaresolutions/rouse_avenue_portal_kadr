<template>
  <b-container fluid>
    <b-row>
      <b-col md="3">
        <!--<iq-card class="calender-small">
          <template v-slot:body>
            <input type="hidden" class="displayCalendar d-none">
          </template>
        </iq-card>-->
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title ">Classification</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#"><i class="fa fa-plus  ms-0" aria-hidden="true" /></a>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 job-classification">
              <li class=""><i class="ri-check-line" :style="{ backgroundColor: personalEventColor }"/>kADR Client Meeting</li>
              <li class=""><i class="ri-check-line"  :style="{ backgroundColor: kadrEventColor }"/>Personal Client Meeting</li>
            </ul>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Today's Schedule</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 today-schedule">
              <li class="d-flex">
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-primary" /></div>
                <div class="schedule-text"> <span>Web Design</span>
                  <span>09:00 to 12:00</span></div>
              </li>
              <li class="d-flex">
                <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-success" /></div>
                <div class="schedule-text"> <span>Participate in Design</span>
                  <span>09:00 to 12:00</span></div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
      <b-col md="9">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Book Appointment</h4>
          </template>
          <template v-slot:headerAction>
            <div v-if="!isAuthenticated">
              <button @click="authenticate">Login with Google</button>
            </div>
            <a href="#" class="btn btn-primary" @click="openModal">
              <i class="ri-add-line ms-2"></i>Book Appointment
            </a>
          </template>
          <template v-slot:body>
            <FullCalendar :calendarEvents="events" :eventClick="openDetailsModal"/>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <div v-if="showBookAppointment" class="custom-modal-overlay" @click.self="closeModal">
      <div class="custom-modal">
        <div class="modal-header">
          <h3 class="modal-title">Book Appointment</h3>
          <button class="close-button" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label for="appointment-datetime" class="form-label">Select Appointment Type</label>
            <div class="radio-group">
              <div class="radio-btn-wrapper">
                <input type="radio" id="option1" name="group1" value="kadr" v-model="newAppointment.type">
                <label for="option1">
                  <span class="radio-dot"></span> kADR Client Meeting
                </label>
              </div>
              <div class="radio-btn-wrapper">
                <input type="radio" id="option2" name="group1" value="personal" v-model="newAppointment.type">
                <label for="option2">
                  <span class="radio-dot"></span> Personal Client Meeting
                </label>
              </div>
            </div>
          </div>
          <div class="form-row" v-if="newAppointment.type == 'personal'">
            <label for="title" class="form-label">Title</label>
            <b-form-input
              id="title"
              type="text"
              v-model="newAppointment.title"
              required
              class="form-input"
            />
          </div>
          <div class="form-row">
            <label for="appointment-datetime" class="form-label">Select Date and Time</label>
            <VueMaterialDateTimePicker
              id="appointment-datetime"
              v-model="newAppointment.start"
              :disabled-dates-and-times="disabledDatesAndTime"
              :is-date-only="false"
              class="form-input"
            />
          </div>
          <div class="form-row" v-if="newAppointment.type == 'kadr'">
            <label for="client-select" class="form-label">Select Client</label>
            <b-form-select
              id="client-select"
              v-model="newAppointment.user"
              :options="users"
              required
              class="form-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">Cancel</button>
          <button class="btn-save" @click="onSave">Save</button>
        </div>
      </div>
    </div>
    <div v-if="showViewAppointment" class="custom-modal-overlay" @click.self="closeViewModal">
      <div class="custom-modal">
        <div class="modal-header">
          <h3 class="modal-title">View Appointment</h3>
          <button class="close-button" @click="closeViewModal">×</button>
        </div>
        <div class="modal-body">
          <div class="appointment-details">
            <div class="form-row">
              <label class="form-label">Title</label>
              <p>{{ selectedAppointment.clientName }}</p>
            </div>

            <div class="form-row">
              <label class="form-label">Start Time</label>
              <p>{{ formatDateTime(selectedAppointment.start) }}</p>
            </div>

            <div class="form-row">
              <label class="form-label">End Time</label>
              <p>{{ formatDateTime(selectedAppointment.end) }}</p>
            </div>

            <div class="form-row">
              <label class="form-label">Zoom Link</label>
              <a :href="selectedAppointment.zoomLink" target="_blank" class="zoom-link">
                Join Zoom Meeting
              </a>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-save" @click="closeViewModal">Close</button>
        </div>
      </div>
    </div>
  </b-container>
</template>
<script>
import axios from 'axios'
import { sofbox } from '../../config/pluginInit'
import VueMaterialDateTimePicker from 'vue-material-date-time-picker'
const PERSONAL_EVENT_COLOR = 'rgb(244, 81, 30)'
const KADR_EVENT_COLOR = 'rgb(121, 134, 203)'

export default {
  name: 'calendar',
  components: {
    VueMaterialDateTimePicker
  },
  data () {
    return {
      incrementalId: 1,
      personalEventColor: PERSONAL_EVENT_COLOR,
      kadrEventColor: KADR_EVENT_COLOR,
      showViewAppointment: false,
      showBookAppointment: false,
      selectedAppointment: null,
      newAppointment: {
        title: '',
        start: '',
        end: '',
        link: '',
        user: '',
        type: 'kadr'
      },
      disabledDatesAndTime: {
        to: this.getYesterdayDate()
      },
      users: [
        { value: null, text: 'Select a case' },
        { value: 'user1', text: '#KDR124975' },
        { value: 'user2', text: '#KDR2193725' },
        { value: 'user3', text: '#KDR389575' }
      ],
      events: [
      ],
      isAuthenticated: false
    }
  },
  mounted () {
    sofbox.index()
  },
  computed: {
  },
  methods: {
    authenticate () {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.$cookies.get('accessToken')}`
      }
      axios
        .get('/api/authenticateWithGoogle', {
          headers
        })
        .then((response) => {
          if (response.data.errorCode) {
            this.$bvToast.toast(response.data.error, {
              title: 'Error',
              variant: 'error',
              solid: true
            })
          } else {
            const popup = window.open(response.data.url, '_blank', 'width=500,height=600')
            const checkPopupClosed = setInterval(() => {
              if (popup.closed) {
                clearInterval(checkPopupClosed)
                console.log('Popup has been closed')
                this.handlePopupClose()
              }
            }, 500)
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Error!')
        })
    },
    handlePopupClose () {
    },
    formatDateTime (dateString) {
      const date = new Date(dateString)
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
      return new Intl.DateTimeFormat('en-US', options).format(date)
    },
    getYesterdayDate () {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    },
    closeModal () {
      this.showBookAppointment = false
    },
    closeViewModal () {
      this.showViewAppointment = false
    },
    onSave () {
      const endDate = new Date(this.newAppointment.start)
      endDate.setMinutes(endDate.getMinutes() + 30)

      if (this.newAppointment.start) {
        const event = {
          id: this.incrementalId++,
          title: this.newAppointment.user ? `Client meeting with ${this.newAppointment.user}` : this.newAppointment.title,
          start: this.newAppointment.start,
          end: endDate,
          color: this.newAppointment.type === 'kadr' ? this.kadrEventColor : this.personalEventColor,
          caseId: '84e40820-b56f-11ef-a898-6a3df410730f',
          description: 'Test description',
          type: 'KADR'
        }
        this.storeNewEvent(event)
      }
    },
    storeNewEvent (event) {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.$cookies.get('accessToken')}`
      }
      axios
        .post('/api/newCalendarEvent', event, {
          headers
        })
        .then((response) => {
          if (response.data.errorCode) {
            this.$bvToast.toast(response.data.error, {
              title: 'Error',
              variant: 'error',
              solid: true
            })
          } else {
            this.events.push(event)
            this.closeModal()
            this.resetForm()
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('Error!')
        })
    },
    openDetailsModal (event) {
      console.log(JSON.stringify(event))
      this.selectedAppointment = {
        clientName: event.title,
        start: event.start,
        end: event.end,
        zoomLink: 'https://us04web.zoom.us/j/76629964865?pwd=EFAmPoVHkx9Vq5rqcaSjryJVi1I431.1',
        id: event.id
      }
      console.log(this.selectedAppointment)
      this.showViewAppointment = true
    },
    openModal () {
      this.showBookAppointment = true
    },
    resetForm () {
      this.newAppointment = {
        title: '',
        start: '',
        end: ''
      }
    }
  }
}
</script>
<style scoped>
  /* Modal Overlay */
  .custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    transition: opacity 0.3s ease;
  }

  /* Modal Box */
  .custom-modal {
    background: white;
    border-radius: 8px;
    width: 500px;
    max-width: 90%;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    animation: fadeIn 0.3s ease;
  }

  /* Header */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .modal-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }

  .close-button {
    font-size: 24px;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    padding: 0;
  }

  /* Body */
  .modal-body {
    padding: 10px 0;
    color: #666;
    font-size: 16px;
    line-height: 1.5;
  }

  /* Form Row */
  .form-row {
    margin-bottom: 20px;
  }

  /* Label */
  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 5px;
    color: #444;
    font-size: 16px;
  }

  /* Form Input */
  .form-input {
    width: 100%;
  }

  .form-input:focus {
    border-color: #007bff;
    background-color: #fff;
  }

  /* Footer */
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }

  .btn-cancel {
    background-color: #f44336;
    color: white;
  }

  .btn-save {
    background-color: #4CAF50;
    color: white;
  }

  .btn-cancel:hover {
    background-color: #d32f2f;
  }

  .btn-save:hover {
    background-color: #388e3c;
  }

  /* Fade-in Animation */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .radio-group {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }

  .radio-btn-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: 13px;
  }

  .radio-btn-wrapper input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .radio-btn-wrapper label {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    border-radius: 25px;
    background-color: #fff;
    color: #555;
    border: 2px solid #ddd;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .radio-btn-wrapper input:checked + label {
    background-color: #3498db;
    color: white;
    border-color: #3498db;
  }

  .radio-btn-wrapper input:checked + label .radio-dot {
    background-color: #fff;
    transform: scale(1.3);
  }

  .radio-btn-wrapper label .radio-dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-right: 10px;
    border-radius: 50%;
    background-color: #ddd;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }

  .radio-btn-wrapper input:focus + label {
    outline: none;
    border-color: #3498db;
  }

  .radio-btn-wrapper:hover label {
    border-color: #3498db;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
  }

  .radio-btn-wrapper input:disabled + label {
    background-color: #f5f5f5;
    color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
  }
</style>
