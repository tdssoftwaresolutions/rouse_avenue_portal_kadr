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
          <b-row>
            <b-col md="6">
              <iq-card>
                <template v-slot:body>
                  <b-row>
                    <b-col lg="12" class="mb-2 d-flex justify-content-between">
                      <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                        <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/call-center.gif')" alt="summary-image" />
                      </div>
                    </b-col>
                    <b-col lg="12" class="mt-3">
                      <h6 class="card-title text-uppercase text-secondary mb-0">No. of unassigned cases</h6>
                      <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{ content.stats.pendingMC }}</span>
                    </b-col>
                  </b-row>
                </template>
              </iq-card>
            </b-col>
            <b-col md="6">
              <iq-card>
                <template v-slot:body>
                  <b-row>
                    <b-col lg="12" class="mb-2 d-flex justify-content-between">
                      <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                        <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/happy.gif')" alt="summary-image" />
                      </div>
                    </b-col>
                    <b-col lg="12" class="mt-3">
                      <h6 class="card-title text-uppercase text-secondary mb-0">No. of In-progress cases</h6>
                      <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{  content.stats.totalAssigned }}</span>
                    </b-col>
                  </b-row>
                  </template>
                </iq-card>
              </b-col>
              <b-col md="6">
                <iq-card>
                  <template v-slot:body>
                    <b-row>
                      <b-col lg="12" class="mb-2 d-flex justify-content-between">
                        <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                          <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/checklist.gif')" alt="summary-image" />
                        </div>
                      </b-col>
                      <b-col lg="12" class="mt-3">
                        <h6 class="card-title text-uppercase text-secondary mb-0">No. of closed (success) cases</h6>
                        <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{  content.stats.successCases }}</span>
                      </b-col>
                    </b-row>
                  </template>
                </iq-card>
              </b-col>
              <b-col md="6">
                <iq-card>
                  <template v-slot:body>
                    <b-row>
                      <b-col lg="12" class="mb-2 d-flex justify-content-between">
                        <div class="icon iq-icon-box rounded-circle rounded-circle" data-wow-delay="0.2s">
                          <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/admin/checklist.gif')" alt="summary-image" />
                        </div>
                      </b-col>
                      <b-col lg="12" class="mt-3">
                        <h6 class="card-title text-uppercase text-secondary mb-0">No. of closed (failed) cases</h6>
                        <span class="h2 text-dark mb-0 counter d-inline-block w-100">{{ content.stats.failedCases }}</span>
                      </b-col>
                    </b-row>
                  </template>
                </iq-card>
              </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" md="12">
          <MCMyMediations :nextCaseId="content.nextCaseId" :cases="content.myCases" :user="user"/>
        </b-col>
      </b-row>
    </b-container>
</template>
<script>
import Alert from '../../components/sofbox/alert/Alert.vue'
import MCMyMediations from './MCMyMediations.vue'
const PERSONAL_EVENT_COLOR = 'rgb(244, 81, 30)'
const KADR_EVENT_COLOR = 'rgb(121, 134, 203)'

export default {
  name: 'DashboardMC',
  props: {
    user: null,
    content: null
  },
  components: {
    Alert, MCMyMediations
  },
  methods: {
    formatDate (dateString) {
      const date = new Date(dateString)
      const userLocale = navigator.language || 'en-IN'
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
      return date.toLocaleString(userLocale, {
        timeZone: userTimeZone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
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
      notes: []
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
