<template>
    <b-row>
      <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
      <Spinner :isVisible="loading" />
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">New Clients ({{ paginatedData.total }})</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <b-pagination
                  v-model="currentPage"
                  :total-rows="paginatedData.total"
                  :per-page="perPage"
                  align="center"
                  class="mt-3"
                  @input="fetchUsers"
                />
                <b-table bordered hover :items="paginatedData.users" :fields="columns" foot-clone >
                  <template v-slot:cell(case_type)="data">
                    <b-form-select v-model="data.item.case_type" :options="categoryOptions"></b-form-select>
                  </template>
                  <template v-slot:cell(created_at)="data">
                    {{formatDate(data.item.created_at)}}
                  </template>
                  <template v-slot:cell(active)="data">
                    <input type="checkbox" v-model="data.item.active" class="form-check-input"/>
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button variant=" iq-bg-success ms-1 mb-1" size="sm" @click="update(data.item)">Update</b-button>
                    <b-button variant="primary" size="sm" class="ml" @click="data.toggleDetails">
                      {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
                    </b-button>
                  </template>
                  <template #row-details="row">
                    <b-card style="background-color: #f9f9f9;">
                      <ul>
                        <li v-for="(value, key) in filteredItem(row.item)" :key="key">
                          <span>
                            <strong>{{ formatKey(key) }}:    </strong>
                            <span v-if="isURL(value)">
                              <a :href="value" target="_blank">Click here to view</a>
                            </span>
                            <span v-else>{{ value }}</span>
                          </span>
                        </li>
                      </ul>
                    </b-card>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import Alert from '../../components/sofbox/alert/Alert.vue'
import Spinner from '../../components/sofbox/spinner/spinner.vue'

export default {
  name: 'InactiveUsers',
  components: {
    Alert, Spinner
  },
  props: {
    users: {
      type: Object,
      required: true
    }
  },
  mounted () {
    sofbox.index()
    this.syncWithProp()
    this.usersCache[1] = this.users
  },
  watch: {
    users: {
      immediate: true,
      handler () {
        this.syncWithProp()
      }
    }
  },
  computed: {
    paginatedItems () {
      const start = (this.currentPage - 1) * this.perPage
      return this.paginatedData.users.slice(start, start + this.perPage)
    }
  },
  methods: {
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    formatDate (dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        weekday: 'long', // 'Monday'
        year: 'numeric', // '2024'
        month: 'long', // 'December'
        day: 'numeric', // '10'
        hour: 'numeric', // '6 PM'
        minute: 'numeric', // '52'
        second: 'numeric', // '47'
        hour12: true // 12-hour clock
      })
    },
    formatKey (key) {
      return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    },
    isURL (value) {
      const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i
      return urlPattern.test(value)
    },
    filteredItem (item) {
      const irrelevantKeys = ['_showDetails', 'case_type', 'id', 'created_at', 'active']
      return Object.fromEntries(
        Object.entries(item).filter(([key]) => !irrelevantKeys.includes(key))
      )
    },
    syncWithProp () {
      this.paginatedData = { ...this.users }
    },
    async update (item) {
      this.loading = true
      const response = await this.$store.dispatch('updateInactiveUsers', {
        isActive: item.active,
        caseId: item.caseId,
        userId: item.id,
        caseType: item.case_type
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.showAlert(response.message, 'success')
      }
      this.loading = false
    },
    async fetchUsers (newPage) {
      this.currentPage = newPage
      if (this.usersCache[this.currentPage]) {
        this.paginatedData = this.usersCache[this.currentPage]
        return
      }
      const response = await this.$store.dispatch('getInactiveUsers', {
        page: this.currentPage
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      }
      this.usersCache[this.currentPage] = response.inactiveUsers
      this.paginatedData = response.inactiveUsers
    }
  },
  data () {
    return {
      categoryOptions: [
        { value: null, text: 'Please select type' },
        { value: 'mediation', text: 'Mediation' },
        { value: 'arbitrator', text: 'Arbitrator' },
        { value: 'counsellor', text: 'Counsellor' }
      ],
      columns: [
        { label: 'Name', key: 'name', class: 'text-left' },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Case Category', key: 'category', class: 'text-left' },
        { label: 'Created At', key: 'created_at', class: 'text-left' },
        { label: 'Case Type', key: 'case_type', class: 'text-center' },
        { label: 'Is Active', key: 'active', class: 'text-center' },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      currentPage: 1,
      perPage: 10,
      paginatedData: {},
      usersCache: {},
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
<style>
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
