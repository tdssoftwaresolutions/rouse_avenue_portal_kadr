<template>
    <b-row>
      <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
      <Spinner :isVisible="loading" />
      <b-col md="12">
        <b-row>
          <b-col v-if="paginatedData.total > 0" md="12" class="table-responsive">
            <b-pagination
              v-model="currentPage"
              :total-rows="paginatedData.total"
              :per-page="perPage"
              align="center"
              class="mt-3"
              @input="fetchUsers"
            />
            <b-table bordered hover :items="paginatedData.casesWithEvents" :fields="columns" responsive="sm" >
             <template v-slot:cell(party)="data">
                {{data.item.user_cases_first_partyTouser?.name}} vs {{data.item.user_cases_second_partyTouser?.name}}
              </template>
              <template v-slot:cell(action)="data">
                <b-button variant=" iq-bg-success ms-1" size="sm" @click="scheduleMeeting(data.item)" >Schedule Meeting</b-button>
                <b-button size="sm" v-b-modal.modal-lg @click="info(data.item)" class="ml-2">
                  View Details
                </b-button>
              </template>
            </b-table>
          </b-col>
          <b-col v-else >
            <h2 style="text-align: center;">No record pending!</h2>
          </b-col>
        </b-row>
      </b-col>
      <b-modal id="modal-lg" size="lg" :title="caseTitle" scrollable>
        <view-case-details :caseObject="selectedUser"></view-case-details>
      </b-modal>
    </b-row>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import Alert from '../../components/sofbox/alert/Alert.vue'
import Spinner from '../../components/sofbox/spinner/spinner.vue'
import ViewCaseDetails from '../Apps/ViewCaseDetail.vue'

export default {
  name: 'MyCases',
  components: {
    Alert, Spinner, ViewCaseDetails
  },
  props: {
    cases: {
      type: Object,
      required: true
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
  computed: {
    paginatedItems () {
      const start = (this.currentPage - 1) * this.perPage
      return this.paginatedData.casesWithEvents.slice(start, start + this.perPage)
    }
  },
  methods: {
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
      this.selectedUser = item
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    syncWithProp () {
      this.paginatedData = { ...this.cases }
    },
    async scheduleMeeting (item) {
      this.loading = true

      this.loading = false
    },
    async fetchUsers (newPage) {
      this.currentPage = newPage
      if (this.casesCache[this.currentPage]) {
        this.paginatedData = this.casesCache[this.currentPage]
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
    }
  },
  data () {
    return {
      selectedUser: null,
      currentPage: 1,
      perPage: 10,
      caseTitle: '',
      paginatedData: {},
      columns: [
        { label: 'Case Number', key: 'caseId', class: 'text-left', sortable: true },
        { label: 'Party', key: 'party', class: 'text-left', sortable: true },
        { label: 'Case Type', key: 'case_type', class: 'text-left', sortable: true },
        { label: 'Case Category', key: 'category', class: 'text-left', sortable: true },
        { label: 'Status', key: 'status', class: 'text-center', sortable: true },
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
