<template>
  <b-row>
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
    <Spinner :isVisible="loading" />
    <b-col md="12">
      <iq-card>
        <template v-slot:headerTitle>
          <div class="d-flex justify-content-between align-items-center">
            <h4 class="card-title">All Mediators</h4>
          </div>
        </template>
        <template v-slot:body>
          <b-row>
            <b-col v-if="mediators.length > 0" md="12" class="table-responsive">
              <b-table bordered hover :items="paginatedMediators" :fields="columns" responsive="sm">
                <template v-slot:cell(total_closed_success)="data">
                  {{ getClosedSuccessCount(data.item) }}
                </template>
                <template v-slot:cell(action)="data">
                  <b-button size="sm" v-b-modal.modal-lg @click="showDetails(data.item)" class="ml-2">
                    View Details
                  </b-button>
                </template>
              </b-table>
              <b-pagination
                v-model="currentPage"
                :total-rows="mediators.length"
                :per-page="perPage"
                align="center"
                class="mt-3"
              />
            </b-col>
            <b-col v-else>
              <h2 style="text-align: center;">No record found...</h2>
            </b-col>
          </b-row>
        </template>
      </iq-card>
      <b-modal id="modal-lg" size="xl" :title="detailTitle" scrollable v-model="showDetailModal" hide-footer>
        <div v-if="selectedMediator">
          <h5>Mediator: {{ selectedMediator.name }}</h5>
          <p>Email: {{ selectedMediator.email }}</p>
          <p>Phone: {{ selectedMediator.phone_number || '-' }}</p>
          <h6 class="mt-3">Cases:</h6>
          <b-table
            bordered
            small
            :items="selectedMediator.cases_cases_mediatorTouser"
            :fields="caseFields"
            responsive="sm"
            v-if="selectedMediator.cases_cases_mediatorTouser.length > 0"
          >
            <template v-slot:cell(status)="data">
              {{ getStatusLabel(data.item.status) }}
            </template>
            <template v-slot:cell(sub_status)="data">
              {{ getSubStatusLabel(data.item.sub_status) }}
            </template>
          </b-table>
          <div v-else>
            <p>No cases assigned.</p>
          </div>
        </div>
      </b-modal>
    </b-col>
  </b-row>
</template>

<script>
import Alert from '../../components/sofbox/alert/Alert.vue'
import Spinner from '../../components/sofbox/spinner/spinner.vue'
import { sofbox } from '../../config/pluginInit'

export default {
  name: 'MCAllMediators',
  components: { Alert, Spinner },
  data () {
    return {
      mediators: [],
      loading: false,
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      columns: [
        { label: 'Mediator Name', key: 'name', class: 'text-left', sortable: true },
        { label: 'Phone', key: 'phone_number', class: 'text-left', sortable: false },
        { label: 'Email', key: 'email', class: 'text-left', sortable: false },
        { label: 'Total Closed Cases', key: 'total_closed_success', class: 'text-center' },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      caseFields: [
        { label: 'Case ID', key: 'caseId', class: 'text-left' },
        { label: 'Status', key: 'status', class: 'text-left' },
        { label: 'Sub Status', key: 'sub_status', class: 'text-left' }
      ],
      showDetailModal: false,
      selectedMediator: null,
      detailTitle: '',
      currentPage: 1,
      perPage: 10,
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
  },
  computed: {
    paginatedMediators () {
      const start = (this.currentPage - 1) * this.perPage
      return this.mediators.slice(start, start + this.perPage)
    }
  },
  mounted () {
    sofbox.index()
    this.fetchMediators()
  },
  methods: {
    async fetchMediators () {
      this.loading = true
      try {
        const response = await this.$store.dispatch('LIST_ALL_MEDIATORS_WITH_CASES')
        if (response.success) {
          this.mediators = response.mediators || []
        } else {
          this.showAlert('Failed to fetch mediators.', 'danger')
        }
      } catch (e) {
        this.showAlert('Error fetching mediators.', 'danger')
      } finally {
        this.loading = false
      }
    },
    getClosedSuccessCount (mediator) {
      if (!mediator.cases_cases_mediatorTouser) return 0
      return mediator.cases_cases_mediatorTouser.filter(c => c.status === 'closed_success').length
    },
    showDetails (mediator) {
      this.selectedMediator = mediator
      this.detailTitle = `Mediator: ${mediator.name}`
      this.showDetailModal = true
    },
    showAlert (message, type) {
      this.alert = { message, type, visible: true }
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
  }
}
</script>

<style scoped>
.ml {
  margin-left: 0.5rem;
}
.table-responsive {
  margin-bottom: 1rem;
}
</style>
