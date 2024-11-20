<template>
  <b-container fluid>
    <b-row>
      <b-col md='12'>
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class='card-title'>Calendar</h4>
          </template>
          <template v-slot:body>
            <FullCalendar :calendarEvents='events' />
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal id='eventDetailsModal' title='Event Details' hide-footer>
      <div v-if='selectedEvent'>
        <p><strong>Title:</strong> {{ selectedEvent.title }}</p>
        <p><strong>Start:</strong> {{ selectedEvent.start }}</p>
        <p v-if='selectedEvent.end'><strong>End:</strong> {{ selectedEvent.end }}</p>
        <p v-if='selectedEvent.url'><strong>Link:</strong> <a :href='selectedEvent.url' target='_blank'>Open</a></p>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
export default {
  name: 'calendar',
  data () {
    return {
      selectedEvent: null, // To hold the clicked event details
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
          color: '#ffc107'
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
          color: '#27e3f4'
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
          title: 'Birthday Party',
          start: '2024-12-28T07:00:00',
          color: '#28a745'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2024-12-28'
        }
      ]
    }
  },
  methods: {
    openDetailsModal (event) {
      this.selectedEvent = event.event._def.extendedProps
      this.selectedEvent.title = event.event.title
      this.selectedEvent.start = event.event.start
      this.selectedEvent.end = event.event.end
      this.$bvModal.show('eventDetailsModal')
    }
  }
}
</script>
