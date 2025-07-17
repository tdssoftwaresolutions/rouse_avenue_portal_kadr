<template>
    <b-row>
      <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="card-title">My Mediations</h4>
             </div>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col v-if="paginatedData.total > 0" md="12" class="table-responsive">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="paginatedData.total"
                  :per-page="perPage"
                  align="center"
                  class="mt-3"
                  @input="fetchCases"
                />
                <b-table bordered hover :items="paginatedData.casesWithEvents" :fields="columns" responsive="sm">
                 <template v-slot:cell(party)="data">
                    {{ data.item.user_cases_first_partyTouser?.name }} vs {{ data.item.user_cases_second_partyTouser?.name }}
                  </template>
                  <template v-slot:cell(mediation_date_time)="data">
                    {{ formatDate(data.item.mediation_date_time,'display', {includeTime : true}) }}
                  </template>
                  <template v-slot:cell(status)="data">
                    {{ getStatusLabel(data.item.status) }}
                  </template>
                  <template v-slot:cell(sub_status)="data">
                    {{ getSubStatusLabel(data.item.sub_status) }}
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button size="sm" v-b-modal.modal-lg @click="info(data.item)" class="ml-2">
                      View Details
                    </b-button>
                    <b-button
                      size="sm"
                      class="ml-2"
                      @click="openAssignMediatorModal(data.item)"
                      :style="{ visibility: data.item.status === 'closed_success' || data.item.sub_status === 'mediator_assigned' ? 'hidden' : 'visible' }"
                    >
                      Assign Mediator
                    </b-button>
                  </template>
                </b-table>
              </b-col>
              <b-col v-else>
                <h2 style="text-align: center;">No record found...</h2>
              </b-col>
            </b-row>
          </template>
        </iq-card>
        <b-modal id="modal-lg" size="xl" :title="caseTitle" scrollable v-model="showViewDetails" hide-footer>
          <mediation-form
            :formData="selectedCase"
          />
        </b-modal>
        <b-modal id="assign-mediator-modal" size="lg" title="Assign Mediator" scrollable v-model="showAssignMediatorModal" hide-footer>
          <div v-if="assignedMediator" class="assigned-mediator-warning">
            <p style="text-align: center;">
              <strong>Note:</strong> This case is already assigned to <strong>{{ assignedMediator.name }}</strong>.
            </p>
          </div>
          <div class="mediators-grid">
            <div
              v-for="mediator in availableMediators"
              :key="mediator.id"
              class="mediator-box"
              :class="{ selected: mediator.id === selectedMediatorId }"
              @click="selectMediator(mediator.id)"
            >
              <h5 style="font-size: 16px; margin-bottom: 5px;">{{ mediator.name }}</h5>
              <p style="font-size: 14px; margin-bottom: 5px;">{{ mediator.email }}</p>
              <p style="font-size: 14px; margin-bottom: 5px;">Phone: {{ mediator.phone_number }}</p>
              <p style="font-size: 14px; margin-bottom: 10px;">Total Cases Assigned: {{ mediator.cases_cases_mediatorTouser.length }}</p>
              <b-button size="sm" variant="primary" @click="assignMediator(mediator.id)">Assign</b-button>
            </div>
          </div>
        </b-modal>
      </b-col>
    </b-row>
</template>

<script>
import { sofbox } from '../../config/pluginInit'
import Alert from '../../components/sofbox/alert/Alert.vue'
import MediationForm from '../MC/MediationForm.vue'

export default {
  name: 'MyCases',
  components: {
    Alert,
    MediationForm
  },
  props: {
    cases: {
      type: Object,
      required: true
    },
    nextCaseId: {
      type: Number,
      default: 1
    },
    user: {
      type: Object,
      default: () => ({})
    }
  },
  mounted () {
    sofbox.index()
    this.syncWithProp()
    this.casesCache[1] = this.cases
  },
  watch: {
    cases: {
      immediate: true,
      handler () {
        this.syncWithProp()
      }
    }
  },
  methods: {
    formatDate (dateString, type = 'display', options = {}) {
      if (!dateString) return ''

      const date = new Date(dateString)

      // Helper to pad single digits with a leading zero
      const pad = (n) => (n < 10 ? '0' + n : n)

      switch (type) {
        case 'date':
          // For <input type="date"> – UTC is fine
          return date.toISOString().split('T')[0]

        case 'datetime-local': {
          // Build local date-time string manually
          const year = date.getFullYear()
          const month = pad(date.getMonth() + 1)
          const day = pad(date.getDate())
          const hours = pad(date.getHours())
          const minutes = pad(date.getMinutes())
          return `${year}-${month}-${day}T${hours}:${minutes}`
        }

        case 'display':
        default: {
          const { includeTime = false } = options

          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...(includeTime && {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })
          })
        }
      }
    },
    getStatus (item) {
      const startDateTime = new Date(item.start_datetime)
      const currentDateTime = new Date()
      if (startDateTime.getTime() === currentDateTime.getTime()) {
        return 'Today'
      } else if (startDateTime.getTime() < currentDateTime.getTime()) {
        return 'Past'
      } else {
        return 'Upcoming'
      }
    },
    getVariant (status) {
      switch (status) {
        case 'Today':
          return 'success'
        case 'Past':
          return 'secondary'
        case 'Upcoming':
          return 'primary'
      }
    },
    info (item) {
      this.caseTitle = `Case #${item.caseId}`
      this.selectedCase = item || null
      this.showViewDetails = true
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    syncWithProp () {
      this.paginatedData = JSON.parse(JSON.stringify(this.cases))
    },
    async fetchCases (newPage) {
      this.currentPage = newPage
      if (this.casesCache[this.currentPage]) {
        this.paginatedData = this.casesCache[this.currentPage]
        return
      }
      const response = await this.$store.dispatch('getMyCases', {
        page: this.currentPage
      })
      if (response.success) {
        this.casesCache[this.currentPage] = response.data
        this.paginatedData = response.data
      }
    },
    async openAssignMediatorModal (caseItem) {
      this.selectedCaseId = caseItem.id
      const response = await this.$store.dispatch('getAvailableMediators', { caseId: this.selectedCaseId })
      if (response.success) {
        this.availableMediators = response.data.mediators || []
        this.assignedMediator = response.data.assignedMediator || null
        this.selectedMediatorId = this.availableMediators.reduce((prev, curr) =>
          curr.cases_cases_mediatorTouser.length < prev.cases_cases_mediatorTouser.length ? curr : prev
        ).id
        this.showAssignMediatorModal = true
      }
    },
    selectMediator (mediatorId) {
      this.selectedMediatorId = mediatorId
    },
    async assignMediator (mediatorId) {
      const response = await this.$store.dispatch('assignMediator', { caseId: this.selectedCaseId, mediatorId })
      if (response.success) {
        this.showAssignMediatorModal = false
        this.showAlert(response.message, 'success')
        window.location.reload()
      }
    },
    getStatusLabel (status) {
      if (!status) return '-'
      return this.statusValueMap[status] || this.toCamelCase(status)
    },
    getSubStatusLabel (subStatus) {
      if (!subStatus) return '-'
      return this.subStatusValueMap[subStatus] || this.toCamelCase(subStatus)
    },
    toCamelCase (str) {
      if (!str) return ''
      return str
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\s+/g, ' ')
    }
  },
  data () {
    return {
      selectedCase: null,
      showViewDetails: false,
      currentPage: 1,
      perPage: 10,
      caseTitle: '',
      paginatedData: {},
      showNewCaseForm: false,
      localNextCaseId: this.nextCaseId,
      columns: [
        { label: 'Case Number', key: 'caseId', class: 'text-left', sortable: true },
        { label: 'Party', key: 'party', class: 'text-left', sortable: true },
        { label: 'Mediation Date', key: 'mediation_date_time', class: 'text-left', sortable: true },
        { label: 'Status', key: 'status', class: 'text-left', sortable: true },
        { label: 'Sub Status', key: 'sub_status', class: 'text-left', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      casesCache: {},
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      assignedMediator: null,
      showAssignMediatorModal: false,
      availableMediators: [],
      selectedCaseId: null,
      selectedMediatorId: null, // Track the selected mediator ID
      defaultProfilePicture: '',
      statusValueMap: {
        failed: 'Failed',
        in_progress: 'In Progress',
        cancelled: 'Cancelled',
        closed_no_success: 'Closed No Success',
        closed_success: 'Closed Success',
        escalated: 'Escalated',
        new: 'New',
        on_hold: 'On Hold',
        pending: 'Pending'
      },
      subStatusValueMap: {
        mediator_assigned: 'Mediator Assigned',
        meeting_scheduled: 'Meeting Scheduled',
        pending_complainant_signature: 'Pending Complainant Signature',
        pending_respondent_signature: 'Pending Respondent Signature',
        pending_mc: 'Pending Mediation Center'
      }
    }
  }
}
</script>

<style scoped>
.ml {
  margin-left: 0.5rem;
}
/* Add space between key and value */
ul li span {
  display: flex;
  align-items: center;
}

ul li span strong {
  margin-right: 8px; /* Add space between key (bold) and value */
}

.mediators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Use auto-fill to ensure items wrap properly */
  gap: 20px;
  padding: 20px;
}

@media (min-width: 1200px) {
  .mediators-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* Adjust column size for large screens */
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .mediators-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Adjust column size for medium screens */
  }
}

@media (max-width: 767px) {
  .mediators-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); /* Adjust column size for small screens */
  }
}

.mediator-box {
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}

.mediator-box.selected {
  background-color: #d9e6f2;
  border-color: #2c6faf;
}

.assigned-mediator-warning {
  background-color: #fff3cd;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  border: 1px solid #ffeeba;
}

.b-modal {
  max-height: 90vh; /* Ensure modal height adjusts dynamically */
  overflow-y: auto; /* Allow vertical scrolling if content exceeds modal height */
}
</style>
