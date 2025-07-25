<template>
  <b-container fluid>
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
    <b-modal no-close-on-backdrop hide-header-close ref="my-modal" hide-footer>
      <template #modal-title>
        Google Authentication
      </template>
      <div class="d-block text-center">
        <p>{{ googleAuthError }}</p>
        <button class="gsi-material-button" @click="authenticate">
          <div class="gsi-material-button-state"></div>
          <div class="gsi-material-button-content-wrapper">
            <div class="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span class="gsi-material-button-contents">Sign in with Google</span>
            <span style="display: none;">Sign in with Google</span>
          </div>
        </button>
      </div>
    </b-modal>
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
          <template v-slot:body>
            <ul class="m-0 p-0 job-classification">
              <li class=""><i class="ri-checkbox-blank-circle-fill" :style="{ color: kadrEventColor }"/>ROUSE Client Meeting</li>
              <li class=""><i class="ri-checkbox-blank-circle-fill"  :style="{ color: personalEventColor }"/>Personal Client Meeting</li>
            </ul>
          </template>
        </iq-card>
        <iq-card v-if="dashboardContent != null">
          <template v-slot:headerTitle>
            <h4 class="card-title">Today's Schedule</h4>
          </template>
          <template v-slot:body>
            <ul class="m-0 p-0 today-schedule"  style="overflow-y: scroll;max-height: 700px;">
              <li class="d-flex align-items-center justify-content-between" v-for="(event, index) in dashboardContent.todaysEvent" :key="index">
                <div class="d-flex align-items-center">
                  <div class="schedule-icon">
                    <i class="ri-checkbox-blank-circle-fill" :style="{ color: kadrEventColor }" v-if="event.type == 'ROUSE'"></i>
                    <i class="ri-checkbox-blank-circle-fill" :style="{ color: personalEventColor }" v-else></i>
                  </div>
                  <div class="schedule-text" v-if="event.type == 'ROUSE'">
                    <span  style="font-weight: bold">Case #{{ event.caseNumber }}</span>
                    <span>{{ event.firstPartyName }} vs {{ event.secondPartyName }}</span>
                    <span>
                      {{ formatDate(event.startDate, 'display', {includeDate: false, includeTime: true} ) }} to {{ formatDate(event.endDate,'display', {includeDate: false, includeTime: true} ) }}
                    </span>
                  </div>
                  <div class="schedule-text" v-else>
                    <span  style="font-weight: bold">{{ event.title }}</span>
                    <span>
                      {{ formatDate(event.startDate,'display', {includeDate: false, includeTime: true} ) }} to {{ formatDate(event.endDate, 'display', {includeDate: false, includeTime: true} ) }}
                    </span>
                  </div>
                </div>
                <a v-if="event.meetingLink != ''" :href="event.meetingLink"
                  target="_blank"
                  class="btn btn-primary btn-sm" >
                  Join Meeting
              </a>
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
            <FullCalendar :calendarEvents="events" :eventClick="openDetailsModal" :dateClick="onDateClick"/>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id="new-appointment-modal-id" ref="new-appointment-modal" size="lg" title="Book Appointment" @ok="onSave" scrollable>
      <div class="radio-row">
          <div class="data-title">Select Appointment Type</div>
          <div class="radio-group">
            <div class="radio-btn-wrapper" @click="onClickAppointmentType">
              <input type="radio" id="option1" name="group1" value="ROUSE" v-model="newAppointment.type">
              <label for="option1">
                <i class="ri-checkbox-blank-circle-fill" :style="{ color: kadrEventColor, marginRight: '0.5rem' }"></i> Rouse Medation Center Meeting
              </label>
            </div>
            <div class="radio-btn-wrapper"  @click="onClickAppointmentType">
              <input type="radio" id="option2" name="group1" value="personal" v-model="newAppointment.type">
              <label for="option2">
                <i class="ri-checkbox-blank-circle-fill" :style="{ color: personalEventColor,marginRight: '0.5rem' }"></i> Personal Client Meeting
              </label>
            </div>
          </div>
      </div>
      <div class="data-row" v-if="newAppointment.type == 'personal'">
          <div class="col-12">
              <div class="data-title">Title</div>
              <b-form-input
                id="title"
                type="text"
                v-model="newAppointment.title"
                required
                style="background: white;border: 1px solid black;"
                class="form-input"
              />
          </div>
      </div>
      <div class="data-row" v-if="newAppointment.type == 'personal'">
          <div class="col-12">
              <div class="data-title">Description</div>
              <b-form-textarea
                id="textarea"
                v-model="newAppointment.description"
                placeholder="Enter description.."
                rows="3"
                style="background: white;border: 1px solid black;"
                max-rows="6"
              ></b-form-textarea>
          </div>
      </div>
      <div class="data-row" v-else>
        <div class="col-12" v-if="dashboardContent != null">
            <div class="data-title">Select Client</div>
            <div class="cases-horizontal-scroll" ref="casesHorizontalScroll">
              <button @click="scrollLeft" class="scroll-btn left">‹</button>
              <div class="case-card" v-for="(myCase,index) in dashboardContent.myCases.casesWithEvents" :key="myCase.id"
              :class="{ selected: newAppointment.caseId === myCase.id }"
              @click="onClickCase(myCase.id, index)">
                <span  style="font-weight: bold">Case #{{ myCase.caseId }}</span>
                <p>{{ myCase.user_cases_first_partyTouser?.name }} vs {{ myCase.user_cases_second_partyTouser?.name }}</p>
              </div>
              <button @click="scrollRight" class="scroll-btn right">›</button>
            </div>
        </div>
      </div>
      <div class="data-row">
        <div class="col-12">
            <div class="data-title">Select Date and Time</div>
            <VueMaterialDateTimePicker
              id="appointment-datetime"
              v-model="newAppointment.start"
              :disabled-dates-and-times="disabledDatesAndTime"
              :is-date-only="false"
              class="form-input"
            />
        </div>
      </div>
    </b-modal>
    <b-modal id="view-appointment-modal-id" cancel-disabled ref="view-appointment-modal" size="lg" title="View Appointment" scrollable hide-footer>
      <div class="appointment-details" v-if="selectedAppointment != null">
        <div class="data-row">
            <div class="col-6">
                <div class="data-title">Title</div>
                <div>{{ selectedAppointment.title }}</div>
            </div>
            <div class="col-6">
                <div class="data-title">Meeting link</div>
                <div> <a :href="selectedAppointment.meetingLink" target="_blank">Join</a></div>
            </div>
        </div>
        <div class="data-row">
            <div class="col-6">
                <div class="data-title">Start Time</div>
                <div>{{ formatDate(selectedAppointment.start,'display',{includeTime : true}) }}</div>
            </div>
            <div class="col-6">
                <div class="data-title">End Time</div>
                <div> {{ formatDate(selectedAppointment.end, 'display', {includeTime : true}) }} </div>
            </div>
        </div>

        <div class="data-row" v-if="selectedAppointment.caseNumber">
            <div class="col-6">
                <div class="data-title">Case Id</div>
                <div>#{{ selectedAppointment.caseNumber }}</div>
            </div>
            <div class="col-6">

            </div>
        </div>
        <div class="long-description">
            <div class="data-title">Description</div>
            <textarea rows="5" readonly :value="selectedAppointment.description">
            </textarea>
        </div>
        <b-button class="btn btn-primary" style="float:right;margin-top: 1rem;background: #0084ff;" @click="$bvModal.hide('view-appointment-modal-id')">Close</b-button>
      </div>
    </b-modal>
  </b-container>
</template>
<script>
import Alert from '../../components/sofbox/alert/Alert.vue'
import { sofbox } from '../../config/pluginInit'
import VueMaterialDateTimePicker from 'vue-material-date-time-picker'
const PERSONAL_EVENT_COLOR = 'rgb(244, 81, 30)'
const KADR_EVENT_COLOR = 'rgb(121, 134, 203)'

export default {
  name: 'calendar',
  components: {
    VueMaterialDateTimePicker, Alert
  },
  data () {
    return {
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      dashboardContent: null,
      googleAuthError: '',
      incrementalId: 1,
      personalEventColor: PERSONAL_EVENT_COLOR,
      kadrEventColor: KADR_EVENT_COLOR,
      selectedAppointment: null,
      newAppointment: {
        title: '',
        start: '',
        caseNumber: '',
        end: '',
        link: '',
        user: '',
        caseId: '',
        type: 'ROUSE'
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
  async mounted () {
    sofbox.index()
    this.initCalendar(false)
  },
  watch: {
    'newAppointment.start' (newVal, oldVal) {
      return this.validateTimeRange(newVal)
    }
  },
  methods: {
    validateTimeRange (appointmentDateTime) {
      const dt = new Date(appointmentDateTime)

      if (dt.getDay() === 0) {
        this.showAlert('Sundays are not allowed, please select another day.', 'danger')
        this.newAppointment.start = ''
        return
      }

      const totalMinutes = dt.getHours() * 60 + dt.getMinutes()

      if (totalMinutes < (11 * 60) || totalMinutes > (16 * 60 + 30)) {
        this.showAlert('Please select a time between 11:00 AM and 4:30 PM.', 'danger')
        this.newAppointment.start = ''
      }
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    onClickCase (id, index) {
      const lCase = this.dashboardContent.myCases.casesWithEvents[index]
      this.newAppointment.title = `Mediation Meeting for Case ${lCase.caseId}`
      this.newAppointment.description = `Parties Involved: ${lCase.user_cases_first_partyTouser?.name}, ${lCase.user_cases_second_partyTouser?.name}

This meeting has been scheduled to discuss the details of case ${lCase.caseId} between the involved parties.
    
📌 Purpose:    
To review the case, facilitate open communication, and work towards a mutual resolution.

📅 Please Note:
1. Be prepared with all relevant documents and information.
2. Join the meeting on time to ensure a smooth and productive session.

Issued by: Rouse Avenue Mediation Court`
      this.newAppointment.caseId = id
      this.newAppointment.caseNumber = lCase.caseId
    },
    async authenticate () {
      const response = await this.$store.dispatch('googleAuth')
      if (response.success) {
        const ref = this
        const popup = window.open(response.data.url, '_blank', 'width=500,height=600')
        const checkPopupClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopupClosed)
            ref.initCalendar(true)
          }
        }, 500)
      }
    },
    async initCalendar (skipCache) {
      const response = await this.$store.dispatch('getCalendarInit', { skipCache })
      if (response.success) {
        this.$refs['my-modal'].hide()
        for (let i = 0; i < response.data.events.length; i++) {
          const event = response.data.events[i]
          this.events.push({
            id: event.id,
            title: event.title,
            start: event.start_datetime,
            end: event.end_datetime,
            color: event.type === 'ROUSE' ? this.kadrEventColor : this.personalEventColor,
            caseId: event.cases ? event.cases.id : null,
            description: event.description || 'No description provided',
            type: event.type,
            meetingLink: event.meeting_link,
            caseNumber: event.cases ? event.cases.caseId : null
          })
        }
        if (this.dashboardContent == null) {
          const response = await this.$store.dispatch('getDashboardContent')
          if (response.success) this.dashboardContent = JSON.parse(JSON.stringify(response.data.dashboardContent))
        }
      }
    },
    scrollLeft () {
      const container = this.$refs.casesHorizontalScroll
      container.scrollBy({ left: -300, behavior: 'smooth' })
    },
    scrollRight () {
      const container = this.$refs.casesHorizontalScroll
      container.scrollBy({ left: 300, behavior: 'smooth' })
    },
    formatDate (dateString, type = 'display', options = {}) {
      if (!dateString) return ''

      const date = new Date(dateString)

      const userLocale = navigator.language || 'en-IN'
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      switch (type) {
        case 'date': {
          const year = date.getFullYear()
          const month = `${date.getMonth() + 1}`.padStart(2, '0')
          const day = `${date.getDate()}`.padStart(2, '0')
          return `${year}-${month}-${day}`
        }
        case 'datetime-local': {
          const year = date.getFullYear()
          const month = `${date.getMonth() + 1}`.padStart(2, '0')
          const day = `${date.getDate()}`.padStart(2, '0')
          const hour = `${date.getHours()}`.padStart(2, '0')
          const minute = `${date.getMinutes()}`.padStart(2, '0')
          return `${year}-${month}-${day}T${hour}:${minute}`
        }

        case 'display':
        default: {
          const { includeDate = true, includeTime = false } = options
          const formatOptions = {}
          if (includeDate) {
            Object.assign(formatOptions, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            })
          }

          if (includeTime) {
            Object.assign(formatOptions, {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })
          }

          let method = 'toLocaleString'
          if (includeDate && !includeTime) method = 'toLocaleDateString'
          else if (!includeDate && includeTime) method = 'toLocaleTimeString'

          return date[method](userLocale, {
            ...formatOptions,
            timeZone: userTimeZone
          })
        }
      }
    },
    getYesterdayDate () {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    },
    closeModal () {
      this.$refs['new-appointment-modal'].hide()
    },
    closeViewModal () {
      this.$refs['view-appointment-modal'].hide()
    },
    onSave (evt) {
      if (this.newAppointment.type === 'ROUSE') {
        if (!this.newAppointment.caseId) {
          this.showAlert('Please select a case before saving the appointment.', 'danger')
          evt.preventDefault()
          return
        }
      } else if (this.newAppointment.type === 'personal') {
        if (!this.newAppointment.title) {
          this.showAlert('Please enter the title before saving the appointment.', 'danger')
          evt.preventDefault()
          return
        }
      }

      if (!this.newAppointment.start) {
        evt.preventDefault()
        this.showAlert('Please select a date and time for the appointment.', 'danger')
        return
      }

      const endDate = new Date(this.newAppointment.start)
      endDate.setMinutes(endDate.getMinutes() + 30)
      if (this.newAppointment.start) {
        this.storeNewEvent({
          id: this.incrementalId++,
          title: this.newAppointment.title,
          start: this.newAppointment.start,
          end: endDate,
          color: this.newAppointment.type === 'ROUSE' ? this.kadrEventColor : this.personalEventColor,
          caseId: this.newAppointment.caseId,
          description: this.newAppointment.description,
          type: this.newAppointment.type,
          caseNumber: this.newAppointment.caseNumber
        })
      }
    },
    toUTCISOString (localDateTimeStr) {
      if (!localDateTimeStr) return null
      const localDate = new Date(localDateTimeStr)
      return localDate.toISOString()
    },
    async storeNewEvent (event) {
      event.start = this.toUTCISOString(event.start)
      event.end = this.toUTCISOString(event.end)
      const response = await this.$store.dispatch('newCalendarEvent', { event })
      if (response.success) {
        event.meetingLink = response.data.meetLink
        this.events.push(event)
        this.closeModal()
        this.resetForm()
      }
      if (new Date(event.start).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]) {
        this.dashboardContent.todaysEvent.push({
          caseNumber: event.caseNumber,
          endDate: event.end,
          firstPartyName: 'Tear',
          meetingLink: event.meetingLink,
          secondPartyName: 'dsd',
          startDate: event.start,
          type: event.type.toUpperCase()
        })
      }
    },
    openDetailsModal (event) {
      this.selectedAppointment = {
        title: event.title,
        start: event.start,
        end: event.end,
        link: '',
        user: '',
        caseId: event.extendedProps.caseId,
        type: event.extendedProps.type,
        id: event.id,
        meetingLink: event.extendedProps.meetingLink,
        description: event.extendedProps.description,
        caseNumber: event.extendedProps.caseNumber
      }
      this.$refs['view-appointment-modal'].show()
    },
    openModal () {
      this.resetForm()
      this.$refs['new-appointment-modal'].show()
    },
    onDateClick (selectedInfo) {
      this.newAppointment.start = new Date()
      this.resetForm()
      this.$refs['new-appointment-modal'].show()
    },
    onClickAppointmentType () {
      this.resetForm()
    },
    resetForm () {
      this.newAppointment = {
        title: '',
        start: '',
        end: '',
        link: '',
        caseNumber: '',
        user: '',
        caseId: null,
        type: 'ROUSE'
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
  .long-description textarea {
  width: 100%;
  resize: none;
  border: 0px;
}
  .cases-scroll-container {
  position: relative;
  display: flex;
  align-items: center;
}

.scroll-btn {
  position: absolute;
  top: 58%;
  transform: translateY(-50%);
  display: flex; /* Enable flexbox for centering */
  align-items: center; /* Vertical alignment */
  justify-content: center; /* Horizontal alignment */
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 40px;
  cursor: pointer;
  z-index: 1;
  font-size: 16px; /* Adjust font size if needed */
  line-height: 1; /* Ensures no extra spacing around the text */
}

.scroll-btn.left {
  left: 10px;
}

.scroll-btn.right {
  right: 10px;
}

.scroll-btn:hover {
  background-color: rgba(0, 0, 0, 0.8);
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

.long-description {
  padding: 10px;
}

  .cases-horizontal-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 10px;
  border-radius: 8px;
  scroll-behavior: smooth; /* Smooth scrolling for a better experience */
}

.case-card {
  flex: 0 0 300px; /* Fixed width for each card */
  border: 1px solid #ccc;
  cursor: pointer;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.case-card:hover {
  transform: scale(1.02);
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2);
}

.case-card.selected {
  border-color: #007bff; /* Highlight color */
  background-color: #e6f2ff; /* Light blue background */
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
  transform: scale(1.02); /* Slightly enlarged */
  color: #007bff;
}

.case-card h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.case-card p {
  margin: 4px 0;
  color: #555;
  font-size: 14px;
}

.cases-horizontal-scroll::-webkit-scrollbar {
  height: 8px;
}

.cases-horizontal-scroll::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.cases-horizontal-scroll::-webkit-scrollbar-thumb:hover {
  background: #999;
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
    color: black;
    border-color: #007bff; /* Highlight color */
    background-color: #e6f2ff; /* Light blue background */
    transform: scale(1.02); /* Slightly enlarged */
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
    border-color: #007bff;
  }

  .radio-btn-wrapper:hover label {
    color: black;
    border-color: #007bff; /* Highlight color */
    background-color: #e6f2ff; /* Light blue background */
    transform: scale(1.02); /* Slightly enlarged */
  }

  .radio-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .radio-btn-wrapper input:disabled + label {
    background-color: #f5f5f5;
    color: #ccc;
    border-color: #ccc;
    cursor: not-allowed;
  }
  .gsi-material-button {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    -webkit-appearance: none;
    background-color: WHITE;
    background-image: none;
    border: 1px solid #747775;
    -webkit-border-radius: 20px;
    border-radius: 20px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #1f1f1f;
    cursor: pointer;
    font-family: 'Roboto', arial, sans-serif;
    font-size: 14px;
    height: 40px;
    letter-spacing: 0.25px;
    outline: none;
    overflow: hidden;
    padding: 0 12px;
    position: relative;
    text-align: center;
    -webkit-transition: background-color .218s, border-color .218s, box-shadow .218s;
    transition: background-color .218s, border-color .218s, box-shadow .218s;
    vertical-align: middle;
    white-space: nowrap;
    width: auto;
    max-width: 400px;
    min-width: min-content;
  }

  .gsi-material-button .gsi-material-button-icon {
    height: 20px;
    margin-right: 12px;
    min-width: 20px;
    width: 20px;
  }

  .gsi-material-button .gsi-material-button-content-wrapper {
    -webkit-align-items: center;
    align-items: center;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-flex-wrap: nowrap;
    flex-wrap: nowrap;
    height: 100%;
    justify-content: space-between;
    position: relative;
    width: 100%;
  }

  .gsi-material-button .gsi-material-button-contents {
    -webkit-flex-grow: 1;
    flex-grow: 1;
    font-family: 'Roboto', arial, sans-serif;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: top;
  }

  .gsi-material-button .gsi-material-button-state {
    -webkit-transition: opacity .218s;
    transition: opacity .218s;
    bottom: 0;
    left: 0;
    opacity: 0;
    position: absolute;
    right: 0;
    top: 0;
  }

  .gsi-material-button:disabled {
    cursor: default;
    background-color: #ffffff61;
    border-color: #1f1f1f1f;
  }

  .gsi-material-button:disabled .gsi-material-button-contents {
    opacity: 38%;
  }

  .gsi-material-button:disabled .gsi-material-button-icon {
    opacity: 38%;
  }

  .gsi-material-button:not(:disabled):active .gsi-material-button-state,
  .gsi-material-button:not(:disabled):focus .gsi-material-button-state {
    background-color: #303030;
    opacity: 12%;
  }

  .gsi-material-button:not(:disabled):hover {
    -webkit-box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);
  }

  .gsi-material-button:not(:disabled):hover .gsi-material-button-state {
    background-color: #303030;
    opacity: 8%;
  }
</style>
