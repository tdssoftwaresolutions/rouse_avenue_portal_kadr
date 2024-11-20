<template>
  <b-container fluid>
    <RightSideBarStyle1>
      <iq-card class="shadow-none">
        <template v-slot:headerTitle>
          <h6 class="card-title">Active Users</h6>
        </template>
        <template v-slot:headerAction>
          <b-dropdown id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
            <template v-slot:button-content>
              <span><i class="ri-more-2-fill"></i></span>
            </template>
            <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
            <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
            <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
            <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
            <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
          </b-dropdown>
        </template>
        <template v-slot:body>
          <div class="media align-items-center mb-4" v-for="(item,index) in usersList" :key="index">
            <div :class="`iq-profile-avatar ${item.isActive ? `status-online` : 'status-away'}`">
              <img class="rounded-circle avatar-60" :src="item.image" :alt="item.name">
            </div>
            <div class="media-body ml-3">
              <h6 class="mb-0"><a href="#">{{ item.name }}</a></h6>
              <p class="mb-0">{{ item.role }}</p>
            </div>
          </div>
        </template>
      </iq-card>
    </RightSideBarStyle1>
    <b-row class="row-eq-height">
      <b-col lg="8" md="12">
        <iq-card class="bg-primary sb-top-banner-card" bodyClass="pb-5 pt-5">
          <template v-slot:body>
            <b-row class="row">
              <b-col md="6" class="align-self-center">
                <h2 class="text-white">Congratulations Nik</h2>
                <p class="text-white">Lorem Ipsum is simply dummy text of the printing and typesetting industry. remaining essentially unchanged.</p>
                <b-button class="iq-bg-primary" variant=" ">Read More</b-button>
              </b-col>
              <b-col md="6" class="position-relative">
                <div class="an-img-two">
                  <lottie :option="require('../../assets/images/small/data1')" />
                </div>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="4" md="12">
        <iq-card>
          <template v-slot:body>
            <b-row>
              <b-col lg="12">
                <span class="text-success float-right">+3.3%<i class="ri-arrow-up-fill"></i></span>
                <span class="font-size-14">New Signups</span>
                <h3>3,897</h3>
                <div class="iq-progress-bar-linear d-inline-block w-100 float-left mt-3">
                  <b-progress :value="90" class="iq-progress-bar" variant="primary"></b-progress>
                </div>
              </b-col>
            </b-row>
          </template>
        </iq-card>
        <iq-card>
          <template v-slot:body>
            <b-row>
              <b-col lg="12">
                <span class="text-danger float-right">+3.3%<i class="ri-arrow-down-fill"></i></span>
                <span class="font-size-14">Weekly Production</span>
                <h3>3,897</h3>
                <div class="iq-progress-bar-linear d-inline-block w-100 float-left mt-3">
                  <b-progress :value="90" class="iq-progress-bar" variant="danger"></b-progress>
                </div>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
      <b-col md="12">
        <b-row>
          <b-col lg="4" md="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Payment Options</h4>
              </template>
              <template v-slot:headerAction>
                <b-dropdown id="dropdownMenuButton2" right variant=" iq-bg-success" data-toggle="dropdown">
                  <template v-slot:button-content>
                      View All<i class="ri-arrow-down-s-line ml-1 text-success"></i>
                  </template>
                  <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <div class="owl-carousel"  data-autoplay="true" data-loop="true" data-nav="false" data-dots="true" data-items="1" data-items-laptop="1" data-items-tab="1" data-items-mobile="1" data-items-mobile-sm="1" data-margin="30">
                  <div class="item">
                    <img :src="require('../../assets/images/booking/03.png')" class="img-fluid" alt="pay-image">
                  </div>
                  <div class="item">
                    <img :src="require('../../assets/images/booking/03.png')" class="img-fluid" alt="pay-image">
                  </div>
                  <div class="item">
                    <img :src="require('../../assets/images/booking/03.png')" class="img-fluid" alt="pay-image">
                  </div>
                </div>
                <div class="pay-options">
                  <h4 class="mb-3">Enabled Payment Options</h4>
                  <div class="d-flex tasks-card" role="alert">
                    <b-form-checkbox
                      id="checkbox-1"
                      name="checkbox-1"
                      value="accepted"
                      unchecked-value="not_accepted"
                    >
                      Debit Card & Credit Card.
                    </b-form-checkbox>
                  </div>
                  <div class="d-flex tasks-card border-bottom-0 mb-0 pb-0" role="alert">
                    <b-form-checkbox
                      id="checkbox-2"
                      name="checkbox-2"
                      value="accepted"
                      unchecked-value="not_accepted"
                    >
                      Rayzer Pay & Paypal
                    </b-form-checkbox>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="8" md="12">
            <iq-card class="" body-class="p-0">
              <template v-slot:headerTitle>
                <h4 class="card-title">Overall Performance</h4>
              </template>
              <template v-slot:headerAction>
                <ul class="nav nav-pills">
                  <li class="nav-item">
                    <a href="#" class="nav-link active">All Time</a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">This Year</a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">This Week</a>
                  </li>
                  <li class="nav-item">
                    <a href="#" class="nav-link">Today</a>
                  </li>
                </ul>
              </template>
              <template v-slot:body>
                <ApexChart element="chart-11" :chartOption="chart11"/>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4" md="12">
            <b-row>
              <b-col md="12">
                <iq-card body-class="p-0">
                  <template v-slot:body>
                    <b-row>
                      <b-col lg="4">
                        <div class="p-3">
                          <span class="text-secondary font-size-16">Servers</span>
                          <h3>1,125</h3>
                          <span class="text-success mt-3 d-inline-block w-100"><i class="ri-arrow-up-fill mr-1"></i>+3.3%</span>
                        </div>
                      </b-col>
                      <b-col lg="8" class="align-items-center">
                        <ApexChart element="chart-7" :chartOption="chart1"/>
                      </b-col>
                    </b-row>
                  </template>
                </iq-card>
                <iq-card body-class="p-0">
                  <template v-slot:body>
                    <b-row>
                      <b-col lg="4">
                        <div class="p-3">
                          <span class="text-secondary font-size-16">Utilization</span>
                          <h3>3,897</h3>
                          <span class="text-danger mt-3 d-inline-block w-100"><i class="ri-arrow-down-fill mr-1"></i>+10%</span>
                        </div>
                      </b-col>
                      <b-col lg="8" class="align-self-center">
                        <ApexChart element="chart-8" :chartOption="chart2"/>
                      </b-col>
                    </b-row>
                  </template>
                </iq-card>
              </b-col>
            </b-row>
          </b-col>
          <b-col lg="4" md="6">
            <iq-card class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Load Distribution</h4>
              </template>
              <template v-slot:headerAction>
                <b-dropdown id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
                  <template v-slot:button-content>
                    <i class="ri-more-2-fill"></i>
                  </template>
                  <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <ApexChart element="Dash1DonetChart" :chartOption="donutChart"/>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="4" md="6">
            <iq-card class=" overflow-hidden" bodyClass="p-0">
              <template v-slot:headerTitle>
                <h4 class="card-title">Daily Update Level</h4>
              </template>
              <template v-slot:headerAction>
                <b-dropdown id="dropdownMenuButton1" right variant=" iq-bg-secondary" data-toggle="dropdown">
                  <template v-slot:button-content>
                    See all <i class="ri-arrow-down-s-line ml-1 text-secondary"></i>
                  </template>
                  <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <ApexChart element="Dash1MultiBarChart" :chartOption="multiBarChart"/>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="3" md="6">
            <iq-card class-name="dash-hover-gradient1" header-bg-color="transparent" header-class="d-flex justify-content-between border-0">
              <template v-slot:headerTitle>
                <div class="mb-0 font-size-32 text-dark"><i class="ri-home-4-line font-weight-light"></i></div>
              </template>
              <template v-slot:headerAction>
                <b-dropdown id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
                  <template v-slot:button-content>
                    <span><i class="ri-more-2-fill"></i></span>
                  </template>
                  <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <h3>Sales</h3>
                <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </template>
              <div class="card-action font-size-14 p-3">
                <span class="float-right">Tommorow</span>
                <i class="ri-timer-2-line"></i> 2:30pm
              </div>
            </iq-card>
          </b-col>
          <b-col lg="3" md="6">
            <iq-card class-name="dash-hover-gradient1" header-bg-color="transparent" header-class="d-flex justify-content-between border-0">
              <template v-slot:headerTitle>
                <div class="mb-0 font-size-32 text-dark"><i class="ri-timer-line font-weight-light"></i></div>
              </template>
              <template v-slot:headerAction>
                <b-dropdown id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
                  <template v-slot:button-content>
                    <span><i class="ri-more-2-fill"></i></span>
                  </template>
                  <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <h3>Support</h3>
                <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </template>
              <div class="card-action font-size-14 p-3">
                <span class="float-right">Tommorow</span>
                <i class="ri-timer-2-line"></i> 2:30pm
              </div>
            </iq-card>
          </b-col>
          <b-col lg="3" md="6">
            <iq-card class-name="dash-hover-gradient1" header-bg-color="transparent" header-class="d-flex justify-content-between border-0">
              <template v-slot:headerTitle>
                <div class="mb-0 font-size-32 text-dark"><i class="ri-account-box-line font-weight-light"></i></div>
              </template>
              <template v-slot:headerAction>
                <b-dropdown id="dropdownMenuButton1" right variant="none" data-toggle="dropdown">
                  <template v-slot:button-content>
                    <span><i class="ri-more-2-fill"></i></span>
                  </template>
                  <b-dropdown-item><i class="ri-eye-fill mr-2"></i>View</b-dropdown-item>
                  <b-dropdown-item><i class="ri-delete-bin-6-fill mr-2"></i>Delete</b-dropdown-item>
                  <b-dropdown-item><i class="ri-pencil-fill mr-2"></i>Edit</b-dropdown-item>
                  <b-dropdown-item><i class="ri-printer-fill mr-2"></i>Print</b-dropdown-item>
                  <b-dropdown-item><i class="ri-file-download-fill mr-2"></i>Download</b-dropdown-item>
                </b-dropdown>
              </template>
              <template v-slot:body>
                <h3>Account</h3>
                <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </template>
              <div class="card-action font-size-14 p-3">
                <span class="float-right">Tommorow</span>
                <i class="ri-timer-2-line"></i> 2:30pm
              </div>
            </iq-card>
          </b-col>
          <b-col lg="3" md="6">
            <iq-card class-name="dash-hover-blank d-flex align-items-center" body-class="text-center">
              <template v-slot:body>
                <h5>Add New Project</h5>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Server History</h4>
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
                <b-table responsive :items="items"  class="mb-0 table-borderless">
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
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'dashboard2',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      items: [
        { package_no: '#0879985', date: '26/12/2019', delivery: '30/12/2019', status: { name: 'Running', color: 'success' }, location: 'Victoria 8007 Australia', progress: { count: 90, color: 'success' } },
        { package_no: '#0879984', date: '23/12/2019', delivery: '27/12/2019', status: { name: 'Starting', color: 'warning text-white' }, location: 'Athens 2745 Greece', progress: { count: 70, color: 'warning' } },
        { package_no: '#0879983', date: '18/12/2019', delivery: '30/12/2019', status: { name: 'Stopped', color: 'danger' }, location: 'Victoria 8007 Australia', progress: { count: 45, color: 'danger' } },
        { package_no: '#0879982', date: '14/12/2019', delivery: '20/12/2019', status: { name: 'Maintenance', color: 'info' }, location: 'Delhi 0014 India', progress: { count: 90, color: 'info' } },
        { package_no: '#0879981', date: '10/12/2019', delivery: '18/12/2019', status: { name: 'Running', color: 'success' }, location: 'Alabama 2741 USA', progress: { count: 45, color: 'success' } }
      ],
      multiBarChart: {
        chart: {
          height: 268,
          type: 'area',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          group: 'sparklines'
        },
        // eslint-disable-next-line standard/array-bracket-even-spacing
        colors: ['#0084ff', '#00ca00', '#ffd400' ],
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [3, 2, 3],
          curve: 'straight'
        },
        series: [{
          name: 'Session Duration',
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        },
        {
          name: 'Page Views',
          data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
          name: 'Total Visits',
          data: [87, 57, 74, 30, 75, 38, 62, 47, 82, 56, 45, 47]
        }
        ],
        legend: {
          show: false
        },
        markers: {
          size: 0,

          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
            '10 Jan', '11 Jan', '12 Jan'
          ],
          labels: {
            show: false
          }
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          y: [{
            title: {
              formatter: function (val) {
                return val + ' (mins)'
              }
            }
          }, {
            title: {
              formatter: function (val) {
                return val + ' per session'
              }
            }
          }, {
            title: {
              formatter: function (val) {
                return val
              }
            }
          }]
        },
        grid: {
          borderColor: '#f1f1f1'
        }
      },
      donutChart: {
        chart: {
          height: 235,
          type: 'donut'
        },
        plotOptions: {
          pie: {
            donut: {
              size: '55%'
            }
          }
        },
        series: [44, 55, 41],
        colors: ['#00ca00', '#e64141', '#0084ff'],
        labels: ['Server1', 'Server2', 'Server3'],
        legend: {
          position: 'bottom'
        }
      },
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
      chart2: {
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
        colors: ['#00ca00'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          width: 3
        },
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
      chart11: {
        chart: {
          height: 407,
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [5, 7, 5],
          curve: 'straight',
          dashArray: [0, 8, 5]
        },
        series: [{
          name: 'Session Duration',
          data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10]
        },
        {
          name: 'Page Views',
          data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
        },
        {
          name: 'Total Visits',
          data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47]
        }
        ],
        legend: {
          show: false
        },
        markers: {
          size: 0,

          hover: {
            sizeOffset: 6
          }
        },
        xaxis: {
          categories: ['01 Jan', '02 Jan', '03 Jan', '04 Jan', '05 Jan', '06 Jan', '07 Jan', '08 Jan', '09 Jan',
            '10 Jan', '11 Jan', '12 Jan'
          ]
        },
        yaxis: {
          labels: {
            show: false
          }
        },
        tooltip: {
          y: [{
            title: {
              formatter: function (val) {
                return val + ' (mins)'
              }
            }
          }, {
            title: {
              formatter: function (val) {
                return val + ' per session'
              }
            }
          }, {
            title: {
              formatter: function (val) {
                return val
              }
            }
          }]
        },
        grid: {
          borderColor: '#f1f1f1'
        }
      },
      usersList: [
        { name: 'Anna Sthesia', role: 'Admin', image: require('../../assets/images/user/01.jpg'), link: '', isActive: true },
        { name: 'Paul Molive', role: 'User', image: require('../../assets/images/user/02.jpg'), link: '', isActive: false },
        { name: 'Bob Frapples', role: 'Auther', image: require('../../assets/images/user/03.jpg'), link: '', isActive: true },
        { name: 'Barb Ackue', role: 'Editor', image: require('../../assets/images/user/04.jpg'), link: '', isActive: true },
        { name: 'Greta Life', role: 'User', image: require('../../assets/images/user/05.jpg'), link: '', isActive: false },
        { name: 'Ira Membrit', role: 'User', image: require('../../assets/images/user/06.jpg'), link: '', isActive: true },
        { name: 'Pete Sariya', role: 'Editor', image: require('../../assets/images/user/07.jpg'), link: '', isActive: false },
        { name: 'Anna Sthesia', role: 'Editor', image: require('../../assets/images/user/08.jpg'), link: '', isActive: true },
        { name: 'Paul Molive', role: 'Author', image: require('../../assets/images/user/09.jpg'), link: '', isActive: false },
        { name: 'Bob Frapples', role: 'User', image: require('../../assets/images/user/10.jpg'), link: '', isActive: true },
        { name: 'Anna Sthesia', role: 'Admin', image: require('../../assets/images/user/01.jpg'), link: '', isActive: true },
        { name: 'Paul Molive', role: 'User', image: require('../../assets/images/user/02.jpg'), link: '', isActive: false },
        { name: 'Bob Frapples', role: 'Auther', image: require('../../assets/images/user/03.jpg'), link: '', isActive: false },
        { name: 'Barb Ackue', role: 'Editor', image: require('../../assets/images/user/04.jpg'), link: '', isActive: true },
        { name: 'Greta Life', role: 'User', image: require('../../assets/images/user/05.jpg'), link: '', isActive: true }
      ]
    }
  }
}
</script>

<style>
.iq-card-body{
  flex: unset;
}
</style>
