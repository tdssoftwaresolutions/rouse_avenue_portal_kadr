<template>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Inactive Users ({{ users.length }})</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" @click="updateAll">Update All</b-button>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="12" class="table-responsive">
                <b-table bordered hover :items="users" :fields="columns" foot-clone>
                  <template v-slot:cell(active)="data">
                    <input type="checkbox" v-model="data.item.active" class="form-check-input" v-on:change="onChangeActive(data.item)"/>
                  </template>
                  <template v-slot:cell(action)="data">
                    <b-button variant=" iq-bg-success ms-1 mb-1" size="sm" @click="update(data.item)">Update</b-button>
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
import axios from 'axios'

export default {
  name: 'InactiveUsers',
  props: {
    users: null
  },
  mounted () {
    sofbox.index()
  },
  methods: {
    update (item) {
      this.updatedUsers.set(item.id, item)
      this.updateToDb()
    },
    updateAll () {
      this.updateToDb()
    },
    onChangeActive (item) {
      this.updatedUsers.set(item.id, item)
    },
    updateToDb () {
      if (this.updatedUsers.size < 1) {
        alert('No user to update')
        return
      }
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.$cookies.get('accessToken')}`
      }
      axios
        .post('/api/updateInactiveUsers', {
          data: Array.from(this.updatedUsers.values())
        }, {
          headers
        })
        .then((response) => {
          if (response.data.errorcode) {
            this.$bvToast.toast(response.data.error, {
              title: 'Error',
              variant: 'error',
              solid: true
            })
          } else {
          }
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    }
  },
  data () {
    return {
      columns: [
        { label: 'Name', key: 'name', class: 'text-left' },
        { label: 'Email', key: 'email', class: 'text-left' },
        { label: 'Phone Number', key: 'phone_number', class: 'text-left' },
        { label: 'Is Active', key: 'active', class: 'text-left' },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      updatedUsers: new Map()
    }
  }
}
</script>
