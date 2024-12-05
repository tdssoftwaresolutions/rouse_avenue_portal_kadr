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
              <li class=""><i class="ri-check-line bg-danger" />Meeting</li>
              <li class=""><i class="ri-check-line bg-success" />Business travel</li>
              <li class=""><i class="ri-check-line bg-warning" />Personal Work</li>
              <li class=""><i class="ri-check-line bg-info" />Team Project</li>
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
    <b-modal
    id="appointmentModal"
    title="Create New Appointment"
    @hide="resetForm"
    hide-footer
  >
    <b-form @submit.prevent="submitAppointment">
      <b-form-group label="Title" label-for="appointment-title">
        <b-form-input
          id="appointment-title"
          v-model="newAppointment.title"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Google Meet Link" label-for="google-meet-link">
        <b-form-input
          id="google-meet-link"
          v-model="newAppointment.link"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Start Date and Time" label-for="start-datetime">
        <b-form-input
          id="start-datetime"
          type="datetime-local"
          v-model="newAppointment.start"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group label="End Date and Time" label-for="end-datetime">
        <b-form-input
          id="end-datetime"
          type="datetime-local"
          v-model="newAppointment.end"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group label="Select Case" label-for="user-select">
      <b-form-select
        id="user-select"
        v-model="newAppointment.user"
        :options="users"
        required
      ></b-form-select>
    </b-form-group>
      <b-button type="submit" variant="primary">Save Appointment</b-button>
      <b-button @click="$bvModal.hide('appointmentModal')" variant="secondary" style="margin-left:1rem">Cancel</b-button>
    </b-form>
  </b-modal>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'calendar',
  data () {
    return {
      newAppointment: {
        title: '',
        start: '',
        end: '',
        link: '',
        user: ''
      },
      users: [
        { value: null, text: 'Select a case' },
        { value: 'user1', text: '#KDR124975' },
        { value: 'user2', text: '#KDR2193725' },
        { value: 'user3', text: '#KDR389575' }
      ],
      events: [
        {
          title: 'All Day Event',
          start: '2024-12-01',
          color: '#fc9919'
        },
        {
          title: 'Long Event',
          start: '2024-12-07',
          end: '2024-12-10',
          color: '#ffc107' // override!
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2024-12-09T16:00:00',
          color: '#17a2b8'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2024-12-16T16:00:00',
          color: '#17a2b8'
        },
        {
          title: 'Conference',
          start: '2024-12-11',
          end: '2024-12-13',
          color: '#27e3f4' // override!
        },
        {
          title: 'Meeting',
          start: '2024-12-12T10:30:00',
          end: '2024-12-12T12:30:00',
          color: '#0084ff'
        },
        {
          title: 'Lunch',
          start: '2024-12-12T12:00:00',
          color: '#777D74'
        },
        {
          title: 'Meeting',
          start: '2024-12-12T14:30:00',
          color: '#0084ff'
        },
        {
          title: 'Birthday Party',
          start: '2024-12-28T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Meeting',
          start: '2020-01-12T14:30:00',
          color: '#0084ff'
        },
        {
          title: 'Birthday Party',
          start: '2020-01-02T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2020-01-25'
        },
        {
          title: 'Birthday Party',
          start: '2020-01-13T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2024-12-28'
        },
        {
          title: 'Meeting',
          start: '2020-01-12T14:30:00',
          color: '#0084ff'
        },
        {
          title: 'Birthday Party',
          start: '2020-01-13T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2020-01-28'
        },
        {
          title: 'All Day Event',
          start: '2020-02-01',
          color: '#fc9919'
        },
        {
          title: 'Long Event',
          start: '2020-02-07',
          end: '2020-02-10',
          color: '#ffc107' // override!
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2020-02-09T16:00:00',
          color: '#17a2b8'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2020-02-16T16:00:00',
          color: '#17a2b8'
        }
      ]
    }
  },
  mounted () {
    sofbox.index()
  },
  computed: {
  },
  methods: {
    openDetailsModal (event) {
      alert('dsd')
      this.newAppointment.title = event.title
      this.newAppointment.start = event.start
      this.newAppointment.end = event.end
      this.$bvModal.show('appointmentModal')
    },
    openModal () {
      this.$bvModal.show('appointmentModal')
    },
    resetForm () {
      this.newAppointment = {
        title: '',
        start: '',
        end: ''
      }
    },
    submitAppointment () {
      if (this.newAppointment.title && this.newAppointment.start && this.newAppointment.end) {
        this.events.push({
          title: this.newAppointment.title,
          start: this.newAppointment.start,
          end: this.newAppointment.end,
          color: '#0084ff' // Example color, you can change it
        })
        this.$bvModal.hide('appointmentModal')
        this.resetForm()
      }
    }
  }
}
</script>
