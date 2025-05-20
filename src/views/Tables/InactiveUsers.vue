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
            <b-table bordered hover :items="paginatedData.users" :fields="columns" responsive="sm" >
              <template v-slot:cell(case_type)="data">
                <b-form-select v-model="data.item.case_type" :options="categoryOptions" :disabled="data.item.disabled"></b-form-select>
              </template>
              <template v-slot:cell(preferred_area_of_practice)="data">
                  <span v-if="isArrayValue(data.item.preferred_area_of_practice)">
                      {{convertToCommaSeparated(data.item.preferred_area_of_practice)}}
                  </span>
                  <span v-else>{{data.item.preferred_area_of_practice }}</span>
              </template>
              <template v-slot:cell(created_at)="data">
                {{formatDate(data.item.created_at)}}
              </template>
              <template v-slot:cell(active)="data">
                <input type="checkbox" v-model="data.item.active" class="form-check-input"  :disabled="data.item.disabled"/>
              </template>
              <template v-slot:cell(action)="data">
                <b-button variant=" iq-bg-success ms-1 mb-1" size="sm" @click="update(data.item)" :disabled="data.item.disabled">Update</b-button>
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
                        <span v-else-if="isArrayValue(value)">
                          {{convertToCommaSeparated(value)}}
                        </span>
                        <span v-else>{{ capitalizeWord(value) }}</span>
                      </span>
                    </li>
                  </ul>
                </b-card>
              </template>
            </b-table>
          </b-col>
          <b-col v-else >
            <h2 style="text-align: center;">No record pending!</h2>
          </b-col>
        </b-row>
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
    },
    type: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
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
    isArrayValue (value) {
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed)
      } catch (e) {
        return false
      }
    },
    capitalizeWord (str) {
      if (!str) return ''
      if (typeof str !== 'string') return str
      // alert(typeof str)
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
    },
    convertToCommaSeparated (value) {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) {
          return parsed
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(', ')
        } else {
          return ''
        }
      } catch (e) {
        return ''
      }
    },
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
      const irrelevantKeys = ['_showDetails', 'case_type', 'userId', 'created_at', 'active', 'otherPartyUserId', 'caseId', 'updated_at', 'is_self_signed_up']
      return Object.fromEntries(
        Object.entries(item).filter(([key, value]) => !irrelevantKeys.includes(key) && value !== null && value !== 0)
      )
    },
    syncWithProp () {
      this.paginatedData = { ...this.users }
    },
    async update (item) {
      if (!item.case_type) {
        this.showAlert('Please select Case Type', 'danger')
        return
      }
      if (item.active === false) {
        this.showAlert('Please activate this user', 'danger')
        return
      }
      this.loading = true
      const response = await this.$store.dispatch('updateInactiveUsers', {
        isActive: item.active,
        caseId: item.caseId,
        userId: item.userId,
        caseType: item.case_type
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.showAlert(response.message, 'success')
        this.$set(item, 'disabled', true)
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
        page: this.currentPage,
        type: this.type
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
        { value: 'Mediation', text: 'Mediation' },
        { value: 'Arbitrator', text: 'Arbitrator' },
        { value: 'Counsellor', text: 'Counsellor' }
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
