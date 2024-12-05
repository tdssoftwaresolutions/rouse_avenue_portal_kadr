<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Past Mediations</h4>
          </template>
          <template v-slot:body>
            <div class="table-responsive">
              <b-table id="user-list-table" class="mt-4" striped bordered :fields="columns"  :items="items">
                <template v-slot:cell(profile)="data" >
                  <b-img rounded="circle" fluid class="avatar-40" :src="data.value" />
                </template>
                <template v-slot:cell(status)="data">
                  <b-badge pill :class="data.value.color">{{ data.value.name }}</b-badge>
                </template>
                <template v-slot:cell(action)="data1">
                  <div class="flex align-items-center list-user-action" v-html="data1.value.link">
                  </div>
                </template>
              </b-table>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import $ from 'jquery'
export default {
  name: 'UserList',
  mounted () {
    sofbox.index()
    $('#user-list-table').DataTable({
      dom: "<'row justify-content-between' <'col-6 col-12' f><'col-6 sm-12' <'user-list-files d-flex float-right' B>>> <'row table-responsive' t><'row justify-content-between mt-3'<'col-6' i><'col-6' p>>",
      buttons: {
        dom: {
          button: {
            tag: 'a',
            className: ''
          }
        }
      },
      drawCallback: function () {
        $('.dataTables_paginate > .pagination').addClass('justify-content-end mb-0')
      },
      language: {
        search: '',
        searchPlaceholder: 'Search'
      }
    })
  },
  data () {
    return {
      columns: [
        { key: 'caseId', label: 'Case Id', tdClass: '' },
        { key: 'name', label: 'Opposite Party Name', tdClass: '' },
        { key: 'contact', label: 'Opposite Party Contact', tdClass: '' },
        { key: 'email', label: 'Opposite Party Email', tdClass: '' },
        { key: 'country', label: 'Country', tdClass: '' },
        { key: 'company', label: 'Category', tdClass: '' },
        { key: 'status', label: 'Status', tdClass: '' },
        { key: 'profile', label: 'Assigned Mediator', tdClass: 'text-center' },
        { key: 'join_date', label: 'Date', tdClass: '' }
      ],
      items: [
        {
          caseId: '#KDR69472223',
          profile: require('../../assets/images/user/01.jpg'),
          name: 'Mr. RK Varma',
          contact: '(760) 756 7568',
          email: 'rkvarma@gmail.com',
          country: 'Delhi, India',
          status: { name: 'Success & Closed', color: 'iq-bg-success' },
          company: 'Payment Related',
          join_date: '2024/12/01',
          action: { link: '<a data-toggle="tooltip" data-placement="top" title="" data-original-title="Add" href="#"><i class="ri-user-add-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" href="#"><i class="ri-pencil-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#"><i class="ri-delete-bin-line"></i></a>' }
        },
        {
          caseId: '#KDR425465342432',
          profile: require('../../assets/images/user/02.jpg'),
          name: 'X & Y Insurance Pvt. Ltd',
          contact: '+62 5689 458 658',
          email: 'brocklee@gmail.com',
          country: 'Haryana',
          status: { name: 'Cancelled', color: 'iq-bg-danger' },
          company: 'Insurance',
          join_date: '2023/12/01',
          action: { link: '<a data-toggle="tooltip" data-placement="top" title="" data-original-title="Add" href="#"><i class="ri-user-add-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" href="#"><i class="ri-pencil-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#"><i class="ri-delete-bin-line"></i></a>' }
        }
      ]
    }
  }
}
</script>
