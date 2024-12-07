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
              <li class=""><i class="ri-check-line bg-danger" />kADR Client Meeting</li>
              <li class=""><i class="ri-check-line bg-success" />Personal Client Meeting</li>
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
            <label for="appointment-datetime" class="form-label">Select Date and Time</label>
            <VueMaterialDateTimePicker
              id="appointment-datetime"
              v-model="newAppointment.start"
              :disabled-dates-and-times="disabledDatesAndTime"
              :is-date-only="false"
              class="form-input"
            />
          </div>
          <div class="form-row">
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
              <label class="form-label">Client Name</label>
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
import { sofbox } from '../../config/pluginInit'
import VueMaterialDateTimePicker from 'vue-material-date-time-picker'

export default {
  name: 'calendar',
  components: {
    VueMaterialDateTimePicker
  },
  data () {
    return {
      showViewAppointment: false,
      showBookAppointment: false,
      selectedAppointment: null,
      newAppointment: {
        title: '',
        start: '',
        end: '',
        link: '',
        user: ''
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
      ]
    }
  },
  mounted () {
    sofbox.index()
  },
  computed: {
  },
  methods: {
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
      console.log(typeof this.newAppointment.start)
      const endDate = new Date(this.newAppointment.start)
      endDate.setMinutes(endDate.getMinutes() + 30)

      if (this.newAppointment.start && this.newAppointment.user) {
        this.events.push({
          id: 'gfgfgd3',
          title: `Meeting with ${this.newAppointment.user}`,
          start: this.newAppointment.start,
          end: endDate,
          color: '#0084ff' // Example color, you can change it
        })
        this.closeModal()
        this.resetForm()
      }
    },
    openDetailsModal (event) {
      console.log(JSON.stringify(event))
      this.selectedAppointment = {
        clientName: event.title,
        start: event.start,
        end: event.end,
        zoomLink: 'http://test.com',
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
</style>
