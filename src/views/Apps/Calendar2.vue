<template>
  <b-container fluid>
    <b-row>
      <b-col md='12'>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class='card-title'>Calendar</h4>
          </template>
          <template v-slot:body>
            <FullCalendar :calendarEvents="events" :eventClick="openDetailsModal" />
          </template>
        </iq-card>
      </b-col>
    </b-row>
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
                <div>{{ formatDateTime(selectedAppointment.start) }}</div>
            </div>
            <div class="col-6">
                <div class="data-title">End Time</div>
                <div> {{ formatDateTime(selectedAppointment.end) }} </div>
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
import { sofbox } from '../../config/pluginInit'
const KADR_EVENT_COLOR = 'rgb(121, 134, 203)'

export default {
  name: 'calendar',
  data () {
    return {
      selectedAppointment: null,
      events: []
    }
  },
  mounted () {
    sofbox.index()
    this.initCalendar()
  },
  methods: {
    async initCalendar () {
      this.loading = true
      const response = await this.$store.dispatch('getDashboardContent')
      if (response.errorCode) {

      } else {
        response.dashboardContent.myCases.forEach((myCase) => {
          const caseEvents = myCase.events.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start_datetime,
            end: event.end_datetime,
            color: KADR_EVENT_COLOR,
            caseId: myCase.id,
            description: event.description || 'No description provided',
            type: event.type,
            meetingLink: event.meeting_link,
            caseNumber: myCase.caseId
          }))
          this.events.push(...caseEvents)
        })
      }
      this.loading = false
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
    formatTime (dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        hour: 'numeric', // '6 PM'
        minute: 'numeric', // '52'
        hour12: true // 12-hour clock
      })
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
</style>
