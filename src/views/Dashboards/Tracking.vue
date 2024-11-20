<template>
  <b-container fluid class="map-main-content">
    <b-row>
      <b-col lg="4">
        <iq-card>
          <template v-slot:body>
            <b-row class="align-items-center">
              <b-col class="text-center" lg="6">
                <b-img :src="require('../../assets/images/page-img/scoter.png')" fluid class="dash-tracking-icon" alt="scoter.png" />
              </b-col>
              <b-col lg="6">
                <h3 class="mb-0">Scooter<small class="d-block font-size-16 text-secondary">Total 652</small></h3>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="4">
        <iq-card>
          <template v-slot:body>
            <b-row class="align-items-center">
              <b-col class="text-center" lg="6">
                <b-img :src="require('../../assets/images/page-img/car.png')" fluid class="dash-tracking-icon" alt="car.png" />
              </b-col>
              <b-col lg="6">
                <h3 class="mb-0">Car<small class="d-block font-size-16 text-secondary">Total 129</small></h3>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="4">
        <iq-card>
          <template v-slot:body>
            <b-row class="align-items-center">
              <b-col class="text-center" lg="6">
                <b-img :src="require('../../assets/images/page-img/truck.png')" fluid class="dash-tracking-icon" alt="truck.png" />
              </b-col>
              <b-col lg="6">
                <h3 class="mb-0">Truck<small class="d-block font-size-16 text-secondary">Total 2459</small></h3>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="12">
        <Mapbox
          class="full-map"
          access-token="pk.eyJ1IjoiZ29sZGVubWFjZWRldiIsImEiOiJjazBnYnFxb3AwNWdqM2JuNWRwazZxMWY0In0._I3zpcM9QTHNqcXWjWpD6Q"
          :map-options="{
            container: 'map',
            style: 'mapbox://styles/goldenmacedev/ck49vpeap08b61cnubglcag7l',
            center: [-82.0036,43.6441],
            zoom: 4
         }"
          @map-load="loaded"
        />
      </b-col>
    </b-row>
    <b-row class="row-eq-height track-row mt-4">
      <b-col lg="12">
        <iq-card>
          <template v-slot:body>
            <b-row>
              <b-col lg="12" class="d-flex justify-content-md-between">
                <div>
                  <div class="btn-group ml-2 bg-white" role="group" aria-label="Basic example">
                  </div>
                  <b-btn-group aria-role="group">
                    <b-button variant="outline-primary" class="active px-5" type="button">All</b-button>
                    <b-button variant="outline-primary" class="px-4" type="button">On Time</b-button>
                    <b-button variant="outline-primary" class="px-4" type="button">Delayed</b-button>
                  </b-btn-group>
                </div>
                <div >
                  <input type="text" class="form-control" placeholder="Search">
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col lg="12" class="mt-4 track">
                <iq-card class="map-profile-card" v-for="(item,index) in orderList" :key="index">
                  <template v-slot:body>
                    <b-row>
                      <b-col>
                        <div class="media mb-3">
                          <img class="avatar-40 rounded-circle" :src="require('../../assets/images/user/1.jpg')" alt="">
                          <div class="media-body ml-3">
                            <h5 class="mb-0"><b>{{ item.name }}</b></h5>
                            <p class="badge badge-primary font-weight-normal mb-0" v-if="item.status">ON TIME</p>
                            <p class="badge badge-danger font-weight-normal mb-0" v-else>Delayed</p>
                          </div>
                        </div>
                        <div class="media mb-3">
                          <img class="avatar-30 align-self-start" :src="require('../../assets/images/page-img/tag_blue.svg')" alt="">
                          <div class="media-body ml-3">
                            <h6 class="mb-0">Flipkart</h6>
                            <p class="mb-0"><small>10 Items</small></p>
                          </div>
                        </div>
                        <div class="media mb-3">
                          <img class="avatar-30 align-self-start" :src="require('../../assets/images/page-img/tag_red.svg')" alt="">
                          <div class="media-body ml-3">
                            <h6 class="mb-0">Zomato</h6>
                            <p class="mb-0"><small>2 Items</small></p>
                          </div>
                        </div>
                        <div class="media mb-3">
                          <img class="avatar-30" :src="require('../../assets/images/page-img/man.svg')" alt="">
                          <div class="media-body ml-3 align-self-center">
                            <h6 class="mb-0 text-primary">Warehouse</h6>
                          </div>
                        </div>
                        <div class="media">
                          <i class="ri-time-line font-size-24" />
                          <div class="media-body ml-3 align-self-center">
                            <h6 class="mb-0">Delivered in <b class="text-danger">2HR</b></h6>
                          </div>
                        </div>
                      </b-col>
                      <b-col cols="7" class="border-left" v-if="item.isActive">
                          <h5 class="mb-0">Product delivered by John</h5>
                          <table>
                            <tr>
                              <td >
                                <div class="media mt-4">
                                  <div class="media-body">
                                    <h6 class="mb-0">Order 23578</h6>
                                    <p class="mb-0">Iphone 64GB by Amazon</p>
                                  </div>
                                </div>
                              </td>
                              <td  class="pl-3">
                                <p class="mb-0">07:55</p>
                              </td>
                              <td class="pl-3">
                                <span class="text-success">Delivared</span>
                              </td>
                            </tr>
                            <tr>
                              <td >
                                <div class="media mt-3">
                                  <div class="media-body">
                                    <h6 class="mb-0">Order 23578</h6>
                                    <p class="mb-0 line-height">Pizza hut cheese burst regular by swiggy</p>
                                  </div>
                                </div>
                              </td>
                              <td  class="pl-3">
                                <p class="mb-0">07:55</p>
                              </td>
                              <td class="pl-3">
                                <span class="text-danger">Return</span>
                              </td>
                            </tr>
                            <tr>
                              <td >
                                <div class="media mt-3">
                                  <div class="media-body">
                                    <h6 class="mb-0">Order 23578</h6>
                                    <p class="mb-0 line-height">Thunder Ice Creem by swiggy</p>
                                  </div>
                                </div>
                              </td>
                              <td  class="pl-3">
                                <p class="mb-0">07:55</p>
                              </td>
                              <td class="pl-3">
                                <span class="text-warning">Pending</span>
                              </td>
                            </tr>
                          </table>
                      </b-col>
                    </b-row>
                  </template>
                </iq-card>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="8">
        <b-row>
          <b-col md="6">
            <iq-card class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Active Users</h4>
              </template>
              <template v-slot:headerAction>
                <b-dropdown  id="dropdownMenuButton7" right variant="none p-0" data-toggle="dropdown">
                  <template v-slot:button-content>
                    <span><i class="ri-more-2-fill mr-0" /></span>
                  </template>
                  <b-dropdown-item href="#"><i class="ri-eye-fill mr-2" />View</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-delete-bin-6-fill mr-2" />Delete</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-pencil-fill mr-2" />Edit</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-printer-fill mr-2" />Print</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-file-download-fill mr-2" />Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <b-row>
                  <b-col lg="12">
                    <div class="iq-details">
                      <span class="title text-dark">New Customers</span>
                      <div class="percentage float-right text-primary">95 <span>%</span></div>
                      <div class="iq-progress-bar-linear d-inline-block w-100">
                        <b-progress :value="95" class="iq-progress-bar" variant="primary" />
                      </div>
                    </div>
                    <div class="iq-details mt-4">
                      <span class="title text-dark">New Customers</span>
                      <div class="percentage float-right text-warning">85 <span>%</span></div>
                      <div class="iq-progress-bar-linear d-inline-block w-100">
                        <b-progress :value="85" class="iq-progress-bar" variant="warning" />
                      </div>
                    </div>
                    <div class="iq-details mt-4">
                      <span class="title text-dark">New Customers</span>
                      <div class="percentage float-right text-success">65 <span>%</span></div>
                      <div class="iq-progress-bar-linear d-inline-block w-100">
                        <b-progress :value="55" class="iq-progress-bar" variant="success" />
                      </div>
                    </div>
                    <div class="iq-details mt-4">
                      <span class="title text-dark">New Customers</span>
                      <div class="percentage float-right text-danger">45 <span>%</span></div>
                      <div class="iq-progress-bar-linear d-inline-block w-100">
                        <b-progress :value="45" class="iq-progress-bar" variant="danger" />
                      </div>
                    </div>
                  </b-col>
                </b-row>
              </template>
              <ApexChart element="chart-1" :chartOption="chart1"/>
            </iq-card>
          </b-col>
          <b-col md="6">
            <iq-card class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Customer Satisfactions</h4>
              </template>
              <template v-slot:body>
                <b-row>
                  <b-col lg="12">
                    <h2>3,897
                      <span class="text-success font-size-14 ml-3 mr-3">
                    <i class="ri-arrow-up-fill mr-2"/>+3.3%
                  </span>
                      <small class="text-secondary font-size-14">Generated by clients</small>
                    </h2>
                    <b-progress>
                      <b-progress-bar :value="40" variant="success" />
                      <b-progress-bar :value="20" variant="primary" />
                      <b-progress-bar :value="10" variant="primary" />
                      <b-progress-bar :value="40" variant="info" />
                      <b-progress-bar :value="20" variant="warning" />
                      <b-progress-bar :value="10" variant="danger" />
                    </b-progress>
                    <div class="mt-4">
                      <b-table thead-class="d-none" :items="items" :fields="fields" borderless>
                        <template v-slot:cell(status)="item">
                          <div class="iq-profile-avatar status-online mt-4" v-if="item.value === 1"></div>
                          <div class="iq-profile-avatar status-away mt-4" v-else-if="item.value === 2"></div>
                          <div class="iq-profile-avatar mt-4 " v-else></div>
                        </template>
                        <template v-slot:cell(title)="item">
                          <h4>{{ item.value }}</h4>
                        </template>
                        <template v-slot:cell(count)="item">
                          <span class="text-muted">{{ item.value }}</span>
                        </template>
                      </b-table>
                    </div>
                  </b-col>
                </b-row>
              </template>
            </iq-card>
          </b-col>
          <b-col md="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Delivery History</h4>
              </template>
              <template v-slot:headerAction>
                <b-dropdown  id="dropdownMenuButton5" right variant="none" data-toggle="dropdown">
                  <template v-slot:button-content>
                    <span class="text-primary"><i class="ri-more-2-fill"></i></span>
                  </template>
                  <b-dropdown-item href="#"><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item href="#"><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <b-table responsive :items="tableItems"  class="mb-0 table-borderless">
                  <template v-slot:cell(status)="data">
                    <b-badge pill :variant="data.value.color">{{ data.value.name }}</b-badge>
                  </template>
                  <template v-slot:cell(progress)="data1">
                    <b-progress :value="data1.value.count" class="iq-progress-bar" :variant="data1.value.color"></b-progress>
                  </template>
                </b-table>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </b-col>
      <b-col md="4">
        <iq-card>
          <template v-slot:headerTitle>
            <h4>Task</h4>
          </template>
          <template v-slot:headerAction>
            <tab-nav :pills="true" id="myTab">
              <tab-nav-items :active="true" id="home-tab" ariaControls="home" role="tab" :ariaSelected="true" title="Home" />
              <tab-nav-items :active="false" id="profile-tab" ariaControls="profile" role="tab" :ariaSelected="true" title="Profile" />
              <tab-nav-items :active="false" id="contact-tab" ariaControls="contact" role="tab" :ariaSelected="true" title="Contact" />
            </tab-nav>
          </template>
          <template v-slot:body>
            <tab-content id="myTabContent">
              <tab-content-item :active="true" id="home" aria-labelled-by="home-tab">
                <template>
                  <div class="d-flex tasks-card" role="alert" v-for="(item,index) in homeTask" :key="index">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" :id="'customCheckHome'+index">
                      <label class="custom-control-label" :for="'customCheckHome'+index">{{ item.title }}</label>
                    </div>
                    <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                      <i class="ri-close-line" />
                    </button>
                  </div>
                </template>
              </tab-content-item>
              <tab-content-item :active="false" id="profile" aria-labelled-by="profile-tab">
                <template>
                  <div class="d-flex tasks-card" role="alert" v-for="(item,index) in profileTask" :key="index">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" :id="'customCheckHome'+index">
                      <label class="custom-control-label" :for="'customCheckHome'+index">{{ item.title }}</label>
                    </div>
                    <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                      <i class="ri-close-line" />
                    </button>
                  </div>
                </template>
              </tab-content-item>
              <tab-content-item :active="false" id="contact" aria-labelled-by="contact-tab">
                <template>
                  <div class="d-flex tasks-card" role="alert" v-for="(item,index) in contactTask" :key="index">
                    <div class="custom-control custom-checkbox">
                      <input type="checkbox" class="custom-control-input" :id="'customCheckHome'+index">
                      <label class="custom-control-label" :for="'customCheckHome'+index">{{ item.title }}</label>
                    </div>
                    <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                      <i class="ri-close-line" />
                    </button>
                  </div>
                </template>
              </tab-content-item>
            </tab-content>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:headerTitle>
            <h4>Recent Activities</h4>
          </template>
          <template v-slot:headerAction>
            <a href="">View All</a>
          </template>
          <template v-slot:body>
            <ul class="iq-timeline">
              <li v-for="(item,index) in recentActivity" :key="index">
                <div :class="`timeline-dots border-${item.color !== '' && item.color !== null && item.color !== undefined ? item.color : 'primary'}`"></div>
                <h6 class="float-left mb-1">{{ item.title }}</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p v-html="item.description" />
                  <div class="iq-media-group">
                    <a href="#" class="iq-media" v-for="(childItem, childIndex) in item.child" :key="childIndex">
                      <img class="img-fluid avatar-40 rounded-circle" :src="childItem.image" alt="05.jpg">
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import Mapbox from 'mapbox-gl-vue'
import mapboxgl from 'mapbox-gl'
import TabContentItem from '../../components/sofbox/tab/tab-content-item'
import OrderList from '../../FackApi/json/OrderList'
export default {
  name: 'Tracking',
  data () {
    return {
      orderList: OrderList,
      chart1: {
        chart: {
          height: 150,
          type: 'area',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          group: 'sparklines'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 3
        },
        colors: ['#00ca00'],
        series: [{
          data: [80, 90, 60, 90, 44, 50, 98, 80, 90]
        }],
        markers: {
          size: 4
        },
        yaxis: {
          max: 100
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          }
        },
        legend: {
          show: false
        }
      },
      fields: [],
      items: [
        { status: 1, title: 'Excellent', count: 2400, avg: '60%' },
        { status: 0, title: 'Very Good', count: 1200, avg: '30%' },
        { status: 0, title: 'Good', count: 240, avg: '6%' },
        { status: 0, title: 'Fair', count: 80, avg: '2%' },
        { status: 2, title: 'Poor', count: 40, avg: '1%' },
        { status: 0, title: 'Very Poor', count: 40, avg: '1%' }
      ],
      tableItems: [
        { delivery_no: '#0879985', date: '26/12/2019', delivery: '30/12/2019', status: { name: 'Moving', color: 'success' }, location: 'Victoria 8007 Australia', progress: { count: 90, color: 'success' } },
        { delivery_no: '#0879984', date: '23/12/2019', delivery: '27/12/2019', status: { name: 'pending', color: 'warning text-white' }, location: 'Athens 2745 Greece', progress: { count: 70, color: 'warning' } },
        { delivery_no: '#0879983', date: '18/12/2019', delivery: '30/12/2019', status: { name: 'Canceled', color: 'danger' }, location: 'Victoria 8007 Australia', progress: { count: 45, color: 'danger' } },
        { delivery_no: '#0879982', date: '14/12/2019', delivery: '20/12/2019', status: { name: 'Working', color: 'info' }, location: 'Delhi 0014 India', progress: { count: 90, color: 'info' } },
        { delivery_no: '#0879981', date: '10/12/2019', delivery: '18/12/2019', status: { name: 'Moving', color: 'success' }, location: 'Alabama 2741 USA', progress: { count: 45, color: 'success' } },
        { delivery_no: '#0879985', date: '26/12/2019', delivery: '30/12/2019', status: { name: 'Moving', color: 'success' }, location: 'Victoria 8007 Australia', progress: { count: 90, color: 'success' } },
        { delivery_no: '#0879984', date: '23/12/2019', delivery: '27/12/2019', status: { name: 'pending', color: 'warning text-white' }, location: 'Athens 2745 Greece', progress: { count: 70, color: 'warning' } },
        { delivery_no: '#0879983', date: '18/12/2019', delivery: '30/12/2019', status: { name: 'Canceled', color: 'danger' }, location: 'Victoria 8007 Australia', progress: { count: 45, color: 'danger' } },
        { delivery_no: '#0879982', date: '14/12/2019', delivery: '20/12/2019', status: { name: 'Working', color: 'info' }, location: 'Delhi 0014 India', progress: { count: 90, color: 'info' } },
        { delivery_no: '#0879981', date: '10/12/2019', delivery: '18/12/2019', status: { name: 'Moving', color: 'success' }, location: 'Alabama 2741 USA', progress: { count: 45, color: 'success' } }
      ],
      recentActivity: [
        {
          title: 'Client Meeting',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          date: '',
          color: 'primary',
          child: []
        },
        {
          title: 'Client Meeting',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          date: '',
          color: 'success',
          child: []
        },
        {
          title: 'Client Meeting',
          description: 'Bonbon macaroon jelly beans <a href="#">gummi bears</a>gummi bears jelly lollipop apple',
          date: '',
          color: 'danger',
          child: [
            { image: require('../../assets/images/user/05.jpg') },
            { image: require('../../assets/images/user/06.jpg') },
            { image: require('../../assets/images/user/07.jpg') },
            { image: require('../../assets/images/user/08.jpg') },
            { image: require('../../assets/images/user/09.jpg') },
            { image: require('../../assets/images/user/10.jpg') }
          ]
        },
        {
          title: 'Client Meeting',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          date: '',
          color: 'primary',
          child: []
        },
        {
          title: 'Client Meeting',
          description: 'Bonbon macaroon jelly beans gummi bears jelly lollipop apple',
          date: '',
          color: 'warning',
          child: []
        }
      ],
      homeTask: [
        { title: 'You should check in some of below.' },
        { title: 'Get the address of customer' },
        { title: 'Contact Vendor for parcel' },
        { title: 'Refule delivery truck' },
        { title: 'Pick up for order no. 334' },
        { title: 'Pay taxes for every bill' },
        { title: 'I am designers & I have no life' },
        { title: 'This is a good product. Buy it :)' }
      ],
      profileTask: [
        { title: 'Contact Vendor for parcel' },
        { title: 'Refule delivery truck' },
        { title: 'Pick up for order no. 334' },
        { title: 'This is a good product. Buy it :)' }
      ],
      contactTask: [
        { title: 'Get the address of customer' },
        { title: 'This is a good product. Buy it :)' }
      ]
    }
  },
  mounted () {
    sofbox.index()
  },
  components: {
    TabContentItem,
    Mapbox
  },
  methods: {
    loaded (map) {
      /* map.addControl(
        new MapboxDirections({
          accessToken: mapboxgl.accessToken
        }),
        'top-left'
      ) */
      map.addControl(new mapboxgl.NavigationControl())
      map.scrollZoom.disable()
    }
  }
}
</script>
