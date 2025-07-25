<template>
    <b-container fluid>
      <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
      <b-row>
        <b-col lg="3" md="12">
          <iq-card class="iq-profile-card text-center">
            <template v-slot:body>
              <div class="iq-team text-center p-0">
                <img v-if="content.user.profile_picture_url" :src="content.user.profile_picture_url" class="img-fluid mb-3 avatar-120 rounded-circle" alt="" style="object-fit: cover;"/>
                <img v-else :src="require('../../assets/images/user/1.jpg')" class="img-fluid mb-3 avatar-120 rounded-circle" alt=""/>
                <h4 class="mb-0">Welcome {{ user.name }}</h4>
                <p class="d-inline-block w-100">{{ user.email }}</p>
              </div>
            </template>
          </iq-card>
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">Today's Schedule</h4>
            </template>
            <template v-slot:body>
              <ul class="m-0 p-0 today-schedule" style="overflow-y: scroll;max-height: 300px;">
                <li class="d-flex align-items-center justify-content-between" v-for="(event, index) in content.todaysEvent" :key="index">
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
        <b-col lg="4" md="12">
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">My Notes</h4>
            </template>
            <template v-slot:headerAction>
              <a href="#" class="btn btn-primary" @click="onClickNewAdd('','')">
                  Add New
              </a>
            </template>
            <template v-slot:body>
              <div style="height: 400px;overflow-x: scroll; ">
                <div class="textarea-wrapper" v-for="(note, index) in notes" :key="index">
                  <textarea class="sticky-note" v-model="note.content" @input="onContentChange(index)" :data-index="index"></textarea>
                  <button v-if="note.isModified" class="save-btn" aria-label="Save" @click="onClickSave(index)">
                    <i class="fas fa-save"></i>
                  </button>
                  <button class="delete-btn" aria-label="Delete" @click="onClickDelete(index)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </template>
          </iq-card>
        </b-col>
        <b-col lg="5" md="12">
          <!---Feedback-->
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">Pending Meeting Feedback</h4>
            </template>
            <template v-slot:body>
              <div v-if="pendingFeedbacks.length === 0">
                <p>No pending feedbacks!</p>
              </div>
              <ul v-else class="list-group">
                <li v-for="(item, idx) in pendingFeedbacks" :key="item.event.id" class="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div>
                      <b>Case #{{ item.case.caseId || item.case.case_id }}</b>
                      <span v-if="item.case.user_cases_first_partyTouser && item.case.user_cases_second_partyTouser">
                        {{ item.case.user_cases_first_partyTouser.name }} vs {{ item.case.user_cases_second_partyTouser.name }}
                      </span>
                    </div>
                    <div>
                      <small>
                        Meeting:
                        {{
                          formatDate(item.event.start_datetime, 'display')
                        }}
                        {{
                          formatDate(item.event.start_datetime, 'display', { includeDate: false, includeTime: true })
                        }}-{{ formatDate(item.event.end_datetime, 'display', { includeDate: false, includeTime: true }) }}
                      </small>
                    </div>
                  </div>
                  <button class="btn btn-primary btn-sm" @click="openFeedbackModal(item)">Give Feedback</button>
                </li>
              </ul>
            </template>
          </iq-card>
          <!-- Feedback Modal -->
          <b-modal v-model="showFeedbackModal" title="Submit Meeting Feedback" @hide="resetFeedbackForm" hide-footer>
            <form @submit.prevent="submitFeedback">
              <div class="form-group">
                <label>First Party Present:</label>
                <b-form-checkbox v-model="feedbackForm.firstPartyPresent" switch>
                  {{ feedbackForm.firstPartyPresent ? 'Yes' : 'No' }}
                </b-form-checkbox>
              </div>
              <div class="form-group">
                <label>Second Party Present:</label>
                <b-form-checkbox v-model="feedbackForm.secondPartyPresent" switch>
                  {{ feedbackForm.secondPartyPresent ? 'Yes' : 'No' }}
                </b-form-checkbox>
              </div>
              <div class="form-group">
                <label>Summary of Meeting:</label>
                <b-form-textarea v-model="feedbackForm.summary" rows="3" required></b-form-textarea>
              </div>
              <div class="text-right" style="margin-top: 24px; display: flex; gap: 16px; justify-content: flex-end;">
                <b-button variant="secondary" @click="showFeedbackModal = false" type="button">Cancel</b-button>
                <b-button type="submit" variant="primary">Submit</b-button>
              </div>
            </form>
          </b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" md="12">
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">My Cases</h4>
            </template>
            <template v-slot:body>
              <my-cases :cases="content.myCases" :user-full-name="user.name"></my-cases>
            </template>
          </iq-card>
        </b-col>
      </b-row>
    </b-container>
</template>
<script>
import Alert from '../../components/sofbox/alert/Alert.vue'
import MyCases from './MyCases.vue'
const PERSONAL_EVENT_COLOR = 'rgb(244, 81, 30)'
const KADR_EVENT_COLOR = 'rgb(121, 134, 203)'

export default {
  name: 'DashboardMediator',
  props: {
    user: null,
    content: null
  },
  components: {
    Alert, MyCases
  },
  methods: {
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
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    async onClickDelete (index) {
      if (confirm('Are you sure you want to delete this note?')) {
        const noteToDelete = this.notes[index]
        if (noteToDelete.id !== '') {
          const response = await this.$store.dispatch('deleteNote', {
            id: noteToDelete.id
          })
          if (response.success) {
            this.notes.splice(index, 1)
            this.showAlert(response.message, 'success')
          }
        }
      }
    },
    onContentChange (index) {
      this.$set(this.notes[index], 'isModified', true)
    },
    onClickNewAdd (content, id) {
      this.notes.push({
        id,
        content
      })
    },
    async onClickSave (index) {
      const note = this.notes[index]
      if (note.isModified === true) {
        const response = await this.$store.dispatch('saveNote', {
          content: note.content,
          id: note.id
        })
        if (response.success) {
          if (response.data && response.data.noteId) {
            this.$set(this.notes[index], 'id', response.data.noteId)
          }
          this.showAlert(response.message, 'success')
          this.$set(note, 'isModified', false)
        }
      }
    },
    openFeedbackModal (item) {
      this.feedbackTarget = item
      this.feedbackForm = {
        firstPartyPresent: false,
        secondPartyPresent: false,
        summary: ''
      }
      this.showFeedbackModal = true
    },
    resetFeedbackForm () {
      this.feedbackForm = {
        firstPartyPresent: false,
        secondPartyPresent: false,
        summary: ''
      }
      this.feedbackTarget = null
    },
    async submitFeedback () {
      if (!this.feedbackForm.summary.trim()) {
        this.showAlert('Please enter a summary of the meeting.', 'danger')
        return
      }
      const payload = {
        event_feedback: {
          first_party_present: this.feedbackForm.firstPartyPresent,
          second_party_present: this.feedbackForm.secondPartyPresent,
          summary: this.feedbackForm.summary
        },
        case_id: this.feedbackTarget.case.id,
        event_id: this.feedbackTarget.event.id
      }
      const response = await this.$store.dispatch('submitEventFeedback', payload)
      if (response.success) {
        this.showAlert(response.message, 'success')
        this.showFeedbackModal = false
        if (this.content && this.content.myCases && Array.isArray(this.content.myCases.casesWithEvents)) {
          const caseIdx = this.content.myCases.casesWithEvents.findIndex(
            c => c.id === this.feedbackTarget.case.id
          )
          if (caseIdx !== -1) {
            const eventsArr = this.content.myCases.casesWithEvents[caseIdx].events
            if (Array.isArray(eventsArr)) {
              const eventIdx = eventsArr.findIndex(
                e => e.id === this.feedbackTarget.event.id
              )
              if (eventIdx !== -1) {
                this.$delete(eventsArr, eventIdx)
              }
            }
          }
        }
        this.resetFeedbackForm()
      }
    }
  },
  mounted () {
    for (let i = 0; i < this.content.notes.length; i++) {
      const note = this.content.notes[i]
      this.onClickNewAdd(note.note_text, note.id)
    }
    const ref = this
    document.addEventListener('keydown', function (event) {
      const activeElement = document.activeElement
      if (activeElement.tagName === 'TEXTAREA') {
        if ((event.metaKey || event.ctrlKey) && event.key === 's') {
          event.preventDefault()
          const noteIndex = activeElement.dataset.index
          if (noteIndex !== undefined) {
            ref.onClickSave(Number(noteIndex))
          } else {
            console.error('Could not find associated note for saving.')
          }
        }
      }
    })
  },
  data () {
    return {
      personalEventColor: PERSONAL_EVENT_COLOR,
      kadrEventColor: KADR_EVENT_COLOR,
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      notes: [],
      showFeedbackModal: false,
      feedbackForm: {
        firstPartyPresent: false,
        secondPartyPresent: false,
        summary: ''
      },
      feedbackTarget: null // { case, event }
    }
  },
  computed: {
    pendingFeedbacks () {
      // Flatten all events from all cases, filter for past events with no feedback
      const now = new Date()
      const result = []
      if (
        this.content &&
        this.content.myCases &&
        Array.isArray(this.content.myCases.casesWithEvents)
      ) {
        this.content.myCases.casesWithEvents.forEach(caseObj => {
          if (Array.isArray(caseObj.events)) {
            caseObj.events.forEach(event => {
              const end = new Date(event.end_datetime)
              if (
                end < now &&
                (!event.event_feedback_id || event.event_feedback_id === null)
              ) {
                result.push({ case: caseObj, event })
              }
            })
          }
        })
      }
      return result
    }
  }
}
</script>
<style scoped>
.textarea-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.delete-btn, .save-btn {
  position: absolute;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 24px; /* Icon size */
  color: #f00; /* Red color for delete button */
  cursor: pointer;
  padding: 8px;
  border-radius: 50%; /* Round button for a circular appearance */
  transition: background 0.3s ease;
}

.delete-btn {
  top: 5px; /* Position delete button at the top right */
}

.save-btn {
  top: 40px; /* Position save button below the delete button */
  color: #4CAF50; /* Green color for the save button */
}

textarea {
  font: 17px 'Gloria Hallelujah', cursive;
  line-height: 1.5;
  border: 0;
  border-radius: 3px;
  background: linear-gradient(#F9EFAF, #F7E98D);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: auto;
  transition: box-shadow 0.5s ease;
  max-width: 520px;
  max-height: 250px;
  width: 100%;
  height: 150px;
  padding-right: 2rem;
  padding-left: 0.5rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
}
</style>
