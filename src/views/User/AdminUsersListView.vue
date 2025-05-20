<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Clients & Experts</h4>
          </template>
          <template v-slot:body>
            <b-tabs card>
              <!-- Active Clients Tab -->
              <b-tab :title="'Clients ('+activeClientsData.total+')'"  active>
                <div class="table-responsive">
                  <b-pagination
                    v-model="activeClientsPage"
                    :total-rows="activeClientsData.total"
                    :per-page="perPage"
                    align="center"
                    class="mt-3"
                    @input="fetchActiveUsers(activeClientsPage, 'CLIENT')"
                  />
                  <b-table bordered hover :items="activeClientsData.users" :fields="clientColumns" responsive="sm">
                    <template v-slot:cell(created_at)="data">
                      {{ formatDate(data.item.created_at) }}
                    </template>
                    <template v-slot:cell(active)="data">
                      <input type="checkbox" v-model="data.item.active" class="form-check-input" :disabled="data.item.disabled" />
                    </template>
                    <template v-slot:cell(action)="data">
                      <b-button variant="primary" size="sm" class="ml" @click="data.toggleDetails">
                        {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
                      </b-button>
                    </template>
                    <template #row-details="row">
                      <b-card style="background-color: #f9f9f9;">
                        <ul>
                          <li v-for="(value, key) in filteredItem(row.item)" :key="key">
                            <span>
                              <strong>{{ formatKey(key) }}: </strong>
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
                </div>
              </b-tab>

              <!-- Active Mediators Tab -->
              <b-tab  :title="'Dispute Resolution Experts ('+activeMediatorsData.total+')'">
                <div class="table-responsive">
                  <b-pagination
                    v-model="activeMediatorsPage"
                    :total-rows="activeMediatorsData.total"
                    :per-page="perPage"
                    align="center"
                    class="mt-3"
                    @input="fetchActiveUsers(activeMediatorsPage, 'MEDIATOR')"
                  />
                  <b-table bordered hover :items="activeMediatorsData.users" :fields="mediatorColumns" responsive="sm">
                    <template v-slot:cell(created_at)="data">
                      {{ formatDate(data.item.created_at) }}
                    </template>
                    <template v-slot:cell(preferred_area_of_practice)="data">
                        <span v-if="isArrayValue(data.item.preferred_area_of_practice)">
                            {{convertToCommaSeparated(data.item.preferred_area_of_practice)}}
                        </span>
                        <span v-else>{{data.item.preferred_area_of_practice }}</span>
                    </template>
                    <template v-slot:cell(action)="data">
                      <b-button variant="primary" size="sm" class="ml" @click="data.toggleDetails">
                        {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
                      </b-button>
                    </template>
                    <template #row-details="row">
                      <b-card style="background-color: #f9f9f9;">
                        <ul>
                          <li v-for="(value, key) in filteredItem(row.item)" :key="key">
                            <span>
                              <strong>{{ formatKey(key) }}: </strong>
                              <span v-if="isURL(value)">
                                <a :href="value" target="_blank">Click here to view</a>
                              </span>
                              <span v-else-if="isArrayValue(value)">
                                {{convertToCommaSeparated(value)}}
                              </span>
                              <span v-else>{{ value }}</span>
                            </span>
                          </li>
                        </ul>
                      </b-card>
                    </template>
                  </b-table>
                </div>
              </b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { sofbox } from '../../config/pluginInit'

export default {
  name: 'UserList',
  mounted () {
    sofbox.index()
    this.fetchActiveUsers(1) // Fetch both clients and mediators for page 1 on load
  },
  data () {
    return {
      clientColumns: [
        { label: 'Name', key: 'name', class: 'text-left', sortable: true },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Case Category', key: 'category', class: 'text-left', sortable: true },
        { label: 'Created At', key: 'created_at', class: 'text-left', sortable: true },
        { label: 'Case Type', key: 'case_type', class: 'text-center', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      mediatorColumns: [
        { label: 'Name', key: 'name', class: 'text-left', sortable: true },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Phone Number', key: 'phone_number', class: 'text-left' },
        { label: 'State', key: 'state', class: 'text-left', sortable: true },
        { label: 'Preferred Area of Practice', key: 'preferred_area_of_practice', class: 'text-center', sortable: true },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      categoryOptions: [
        { value: null, text: 'Please select type' },
        { value: 'Mediation', text: 'Mediation' },
        { value: 'Arbitrator', text: 'Arbitrator' },
        { value: 'Counsellor', text: 'Counsellor' }
      ],
      activeClientsPage: 1,
      activeMediatorsPage: 1,
      perPage: 10,
      activeClientsData: { users: [], total: 0 },
      activeMediatorsData: { users: [], total: 0 }
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
    async fetchActiveUsers (page, type = null) {
      try {
        if (!type) {
          // Fetch both clients and mediators for page 1 on load
          const [clientsResponse, mediatorsResponse] = await Promise.all([
            this.$store.dispatch('getActiveUsers', { page: 1, type: 'CLIENT' }),
            this.$store.dispatch('getActiveUsers', { page: 1, type: 'MEDIATOR' })
          ])

          if (clientsResponse.success) {
            this.activeClientsData = clientsResponse
          }

          if (mediatorsResponse.success) {
            this.activeMediatorsData = mediatorsResponse
          }
        } else {
          // Fetch data for a specific user type on pagination
          const response = await this.$store.dispatch('getActiveUsers', { page, type })
          if (response.success) {
            if (type === 'CLIENT') {
              this.activeClientsData = response
              this.activeClientsPage = page
            } else if (type === 'MEDIATOR') {
              this.activeMediatorsData = response
              this.activeMediatorsPage = page
            }
          }
        }
      } catch (error) {
        console.error('Error fetching active users:', error)
      }
    },
    formatDate (dateString) {
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
      })
    },
    formatKey (key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
    },
    isURL (value) {
      const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i
      return urlPattern.test(value)
    },
    filteredItem (item) {
      const irrelevantKeys = ['_showDetails', 'case_type', 'userId', 'created_at', 'active', 'otherPartyUserId', 'caseId', 'google_token', 'user_type', 'updated_at', 'is_self_signed_up']
      return Object.fromEntries(
        Object.entries(item).filter(([key, value]) => !irrelevantKeys.includes(key) && value !== null && value !== 0)
      )
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    }
  }
}
</script>
