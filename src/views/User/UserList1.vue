<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Billing</h4>
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
      dom: "<'row justify-content-between' <'col-md-6 col-sm-12' f><'col-md-6 sm-12' <'user-list-files d-flex float-right' B>>> <'row table-responsive' t><'row justify-content-between mt-3'<'col-md-6' i><'col-md-6' p>>",
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
        { key: 'name', label: 'Customer Name', tdClass: '' },
        { key: 'contact', label: 'Payment Received', tdClass: '' },
        { key: 'status', label: 'Case Type', tdClass: '' },
        { key: 'join_date', label: 'Date', tdClass: '' }
      ],
      items: [
        {
          caseId: '#KDR69472223',
          name: 'Mr. RK Varma',
          contact: 'Rs. 500/-',
          status: { name: 'kADR', color: 'iq-bg-success' },
          join_date: '2024/12/01',
          action: { link: '<a data-toggle="tooltip" data-placement="top" title="" data-original-title="Add" href="#"><i class="ri-user-add-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" href="#"><i class="ri-pencil-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#"><i class="ri-delete-bin-line"></i></a>' }
        },
        {
          caseId: '',
          name: 'Mr. Rahul',
          contact: 'Rs. 1500/-',
          status: { name: 'Personal', color: 'iq-bg-success' },
          join_date: '2024/10/22',
          action: { link: '<a data-toggle="tooltip" data-placement="top" title="" data-original-title="Add" href="#"><i class="ri-user-add-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit" href="#"><i class="ri-pencil-line"></i></a><a data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#"><i class="ri-delete-bin-line"></i></a>' }
        }
      ]
    }
  }
}
</script>
