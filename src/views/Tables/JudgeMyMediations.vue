<template>
    <b-row>
      <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
      <Spinner :isVisible="loading" />
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <div class="d-flex justify-content-between align-items-center">
              <h4 class="card-title">My Mediations</h4>
              <b-button variant="primary" @click="openNewCaseForm" style="margin-left: 2rem;">New Mediation</b-button>
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
                  <template v-slot:cell(hearing_date)="data">
                    {{ formatDate(data.item.hearing_date) }}
                  </template>
                  <template v-slot:cell(mediation_date_time)="data">
                    {{ formatDate(data.item.mediation_date_time) }}
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button size="sm" v-b-modal.modal-lg @click="info(data.item)" class="ml-2">
                      View Details
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
            :viewMode="true"
            :userName="user.name"
            @close="closeViewDetails"
          />
        </b-modal>
        <b-modal id="new-case-modal" size="xl" title="New Mediation" v-model="showNewCaseForm" hide-footer>
          <mediation-form :nextCaseId="localNextCaseId"  @close="onCloseNewMediationForm" :userName="user.name"/>
        </b-modal>
      </b-col>
    </b-row>
</template>

<script>
import { sofbox } from '../../config/pluginInit'
import Alert from '../../components/sofbox/alert/Alert.vue'
import Spinner from '../../components/sofbox/spinner/spinner.vue'
import MediationForm from '../Judge/MediationForm.vue'

export default {
  name: 'MyCases',
  components: {
    Alert,
    Spinner,
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
    formatDate (dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    },
    async onCloseNewMediationForm (formData) {
      formData.judgeId = this.user.id // Add judgeId to formData
      this.loading = true
      const response = await this.$store.dispatch('createNewCase', {
        caseData: formData
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.showNewCaseForm = false
        this.showAlert('Successfully initiated the request!', 'success')

        const newCase = {
          caseId: `ROUSE-MED-${this.localNextCaseId}`,
          hearing_date: formData.hearingDate || '',
          suit_no: formData.suitNo || '',
          user_cases_first_partyTouser: {
            ...formData.user_cases_first_partyTouser,
            name: formData.party1 || '',
            email: formData.party1Email || ''
          },
          user_cases_second_partyTouser: {
            ...formData.user_cases_second_partyTouser,
            name: formData.party2 || '',
            email: formData.party2Email || ''
          },
          institution_date: formData.institutionDate || '',
          nature_of_suit: formData.natureOfSuit || '',
          stage: formData.stage || '',
          hearing_count: formData.hearingCount || 0,
          mediation_date_time: formData.mediationDateTime || '',
          referral_judge_signature: formData.referralJudgeSignature || '',
          plaintiff_signature: formData.plaintiffSignature || '',
          plaintiff_phone: formData.plaintiffPhone || '',
          plaintiff_advocate: formData.plaintiffAdvocate || '',
          respondent_signature: formData.respondentSignature || '',
          respondent_phone: formData.respondentPhone || '',
          respondent_advocate: formData.respondentAdvocate || '',
          judge_document_url: formData.document || null
        }

        this.localNextCaseId += 1

        // Add newCase to the first position in paginatedData.casesWithEvents
        this.paginatedData.casesWithEvents = [newCase, ...this.paginatedData.casesWithEvents]
        this.paginatedData.total += 1 // Increment total count
        this.currentPage = 1 // Reset to the first page
      }
      this.loading = false
    },
    openNewCaseForm () {
      this.showNewCaseForm = true
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
      this.selectedCase = item || null // Ensure selectedCase is properly set
      this.showViewDetails = true // Open the modal for viewing details
    },
    closeViewDetails () {
      this.showViewDetails = false // Close the modal
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    syncWithProp () {
      // Create a deep copy of the cases prop to avoid mutating it
      this.paginatedData = JSON.parse(JSON.stringify(this.cases))
    },
    async scheduleMeeting (item) {
      this.loading = true

      this.loading = false
    },
    async fetchCases (newPage) {
      this.currentPage = newPage
      this.loading = true
      if (this.casesCache[this.currentPage]) {
        this.paginatedData = this.casesCache[this.currentPage]
        this.loading = false
        return
      }
      const response = await this.$store.dispatch('getMyCases', {
        page: this.currentPage
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.casesCache[this.currentPage] = response
        this.paginatedData = response
      }
      this.loading = false
    }
  },
  data () {
    return {
      selectedCase: null, // Ensure selectedCase is initialized to null
      showViewDetails: false, // Track the visibility of the view details modal
      currentPage: 1,
      perPage: 10,
      caseTitle: '',
      paginatedData: {},
      showNewCaseForm: false,
      localNextCaseId: this.nextCaseId, // Initialize local property with prop value
      columns: [
        { label: 'Case Number', key: 'caseId', class: 'text-left', sortable: true },
        { label: 'Party', key: 'party', class: 'text-left', sortable: true },
        { label: 'Hearing Date', key: 'hearing_date', class: 'text-left', sortable: true },
        { label: 'Mediation Date', key: 'mediation_date_time', class: 'text-left', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      casesCache: {},
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      loading: false
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
</style>
