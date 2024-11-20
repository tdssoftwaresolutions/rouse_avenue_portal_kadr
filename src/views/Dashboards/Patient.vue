<template>
  <b-container fluid>
    <b-row>
      <b-col lg="3" md="12">
        <iq-card class="iq-profile-card text-center">
          <template v-slot:body>
            <div class="iq-team text-center p-0">
              <img :src="require('../../assets/images/user/1.jpg')"
                   class="img-fluid mb-3 avatar-120 rounded-circle" alt="">
              <h4 class="mb-0">Nik Jordan</h4>
              <a href="#" class="d-inline-block w-100">nik@sofboxadmin.com</a>
              <p class="mt-1">1234 North Avenue Luke Lane, South Bend, IN 360001</p>
              <hr>
              <ul class="list-inline mb-0 d-flex justify-content-between">
                <li class="list-inline-item">
                  <h5>Blood</h5>
                  <p class="text-success">AB+</p>
                </li>
                <li class="list-inline-item">
                  <h5>Height</h5>
                  <p class="text-success">161cm</p>
                </li>
                <li class="list-inline-item">
                  <h5>Weight</h5>
                  <p class="text-success">64kg</p>
                </li>
              </ul>
            </div>
          </template>
        </iq-card>
        <iq-card class="">
          <template v-slot:headerTitle>
            <h4 class="card-title">Notifications</h4>
          </template>
          <template v-slot:headerAction>
            <a href="#" class="">See all</a>
          </template>
          <template v-slot:body>
            <div class="media">
              <img class="mr-3 rounded-circle" :src="require('../../assets/images/user/01.jpg')"
                   alt="Generic placeholder image">
              <div class="media-body">
                <h5 class="mt-0 mb-0">Dr. Jay
                  <small class="text-muted font-size-12">Yesterday</small>
                </h5>
                <i class="ri-close-line float-right"></i>
                <p>Lorem Ipsum is simply dummy text.</p>
              </div>
            </div>
            <hr>
            <div class="media">
              <img class="mr-3 rounded-circle" :src="require('../../assets/images/user/02.jpg')"
                   alt="Generic placeholder image">
              <div class="media-body">
                <h5 class="mt-0 mb-0">Dr. Lilly
                  <small class="text-muted font-size-12">Yesterday</small>
                </h5>
                <i class="ri-close-line float-right"></i>
                <p>Lorem Ipsum is simply dummy text.</p>
              </div>
            </div>
            <hr>
            <div class="media">
              <img class="mr-3 rounded-circle" :src="require('../../assets/images/user/03.jpg')"
                   alt="Generic placeholder image">
              <div class="media-body">
                <h5 class="mt-0 mb-0">Dr. Steve
                  <small class="text-muted font-size-12">Yesterday</small>
                </h5>
                <i class="ri-close-line float-right"></i>
                <p>Lorem Ipsum is simply dummy text.</p>
              </div>
            </div>
            <hr>
            <div class="media">
              <img class="mr-3 rounded-circle" :src="require('../../assets/images/user/04.jpg')"
                   alt="Generic placeholder image">
              <div class="media-body">
                <h5 class="mt-0 mb-0">Dr. Mia
                  <small class="text-muted font-size-12">Yesterday</small>
                </h5>
                <i class="ri-close-line float-right"></i>
                <p>Lorem Ipsum is simply dummy text.</p>
              </div>
            </div>
          </template>
        </iq-card>
        <iq-card body-class="text-center">
          <template v-slot:body>
            <span class="font-size-20 font-weight-bold text-uppercase">Pro</span>
            <h2 class="mb-4 display-3 font-weight-bolder"><small
              class="font-size-16 align-text-top">$ </small>19<small
              class="font-size-14 text-muted">USD / month</small></h2>
            <ul class="list-unstyled line-height-4 mb-0">
              <li>Lorem ipsum dolor sit amet</li>
              <li>Consectetur adipiscing elit</li>
              <li>Integer molestie lorem at massa</li>
              <li>Facilisis in pretium nisl aliquet</li>
              <li>Nulla volutpat aliquam velit</li>
            </ul>
            <a href="#" class="btn btn-primary mt-5">Start Starter</a>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="9" md="12">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Summary</h4>
              </template>
              <template v-slot:headerAction>
                <a href="">View All</a>
              </template>
              <template v-slot:body>
                <b-row>
                  <b-col md="4">
                    <iq-card class="shadow-none mb-0" body-class="p-1">
                      <template v-slot:body>
                        <span class="text-dark float-right"><i class="ri-arrow-up-fill mr-1" />+30%</span>
                        <span class="font-size-14">Blood pressure</span>
                        <h2>75
                          <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/page-img/04.png')" alt="summary-image" />
                        </h2>
                        <div class="iq-progress-bar-linear d-inline-block w-100 mt-3">
                          <b-progress :value="90" class="iq-progress-bar" variant="primary" />
                        </div>
                      </template>
                    </iq-card>
                  </b-col>
                  <b-col md="4">
                    <iq-card class="shadow-none mb-0" body-class="p-1">
                      <template v-slot:body>
                        <span class="text-dark float-right"><i class="ri-arrow-up-fill mr-1" />+30%</span>
                        <span class="font-size-14">Temperature</span>
                        <h2>28.6
                          <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/page-img/06.png')" alt="summary-image" />
                        </h2>
                        <div class="iq-progress-bar-linear d-inline-block w-100 mt-3">
                          <b-progress :value="90" class="iq-progress-bar" variant="success" />
                        </div>
                      </template>
                    </iq-card>
                  </b-col>
                  <b-col md="4">
                    <iq-card class="shadow-none mb-0" body-class="p-1">
                      <template v-slot:body>
                        <span class="text-dark float-right"><i class="ri-arrow-up-fill mr-1" />+30%</span>
                        <span class="font-size-14">Heart Rate</span>
                        <h2>60
                          <img class="float-right summary-image-top mt-1" :src="require('../../assets/images/page-img/05.png')" alt="summary-image" />
                        </h2>
                        <div class="iq-progress-bar-linear d-inline-block w-100 mt-3">
                          <b-progress :value="90" class="iq-progress-bar" variant="danger" />
                        </div>
                      </template>
                    </iq-card>
                  </b-col>
                </b-row>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="8">
            <iq-card class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Statistics</h4>
              </template>
              <template v-slot:headerAction>
                <a href="">26 Aug 2019</a>
              </template>
              <ApexChart element="chart-20" :chartOption="chart20"/>
            </iq-card>
          </b-col>
          <b-col lg="4">
            <iq-card class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Diet Plan</h4>
              </template>
              <template v-slot:headerAction>
                <a href="#">See All</a>
              </template>
              <template v-slot:body>
                <div class="owl-carousel" data-autoplay="true" data-loop="true" data-nav="false"
                     data-dots="true" data-items="1" data-items-laptop="1" data-items-tab="1"
                     data-items-mobile="1" data-items-mobile-sm="1" data-margin="30">
                  <div class="item">
                    <div class="">
                      <a class="mb-3 d-block font-size-16" href="#"><i class="ri-pencil-ruler-2-line mr-1" />Breakfast</a>
                      <h5 class="mb-2">Meal plan is for a person aged 19-50 years.</h5>
                      <p>
                        Wholegrain toast with polyunsaturated margarine
                        2 slices toast.
                        2 teaspoon margarine.
                        20g cheese2 teaspoon margarine.
                        1 cup mixed salad vegetables.Unsalted nuts 30g 1 meat.</p>
                      <button type="button" class="btn btn-primary mt-3">Read More</button>
                    </div>
                  </div>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="12">
            <iq-card class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Appointments</h4>
              </template>
              <template v-slot:headerAction>
                <a href="#" class="dropdown-bg"><i class="ri-add-line mr-2"></i>Book Appointment</a>
              </template>
              <template v-slot:body>
                <FullCalendar :calendarEvents="events"/>
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
  name: 'patient',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      chart20: {
        chart: {
          height: 387,
          type: 'line',
          stacked: false,
          toolbar: {
            show: false
          },
          sparkline: {
            enabled: true
          },
          group: 'sparklines'
        },
        stroke: {
          width: [2, 3],
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            columnWidth: '20%'
          }
        },
        colors: ['#00ca00', '#0084ff'],
        series: [ {
          name: 'Vine',
          type: 'area',
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
        }, {
          name: 'Dribbble',
          type: 'line',
          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
        }],
        fill: {
          opacity: [0.25, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: 'vertical',
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003', '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'],
        xaxis: {
          type: 'datetime',
          labels: {
            show: false
          }
        },
        yaxis: {
          min: 0,
          labels: {
            show: false
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if (typeof y !== 'undefined') {
                return y.toFixed(0) + ' views'
              }
              return y
            }
          }
        },
        legend: {
          show: false
        }
      },
      events: [
        {
          title: 'All Day Event',
          start: '2019-12-01'
        },
        {
          title: 'Long Event',
          start: '2019-12-07',
          end: '2019-12-10',
          color: 'purple' // override!
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2019-12-09T16:00:00'
        },
        {
          groupId: '999',
          title: 'Repeating Event',
          start: '2019-12-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2019-12-11',
          end: '2019-12-13',
          color: 'purple' // override!
        },
        {
          title: 'Meeting',
          start: '2019-12-12T10:30:00',
          end: '2019-12-12T12:30:00',
          color: 'red'
        },
        {
          title: 'Lunch',
          start: '2019-12-12T12:00:00',
          color: 'green'
        },
        {
          title: 'Meeting',
          start: '2019-12-12T14:30:00'
        },
        {
          title: 'Birthday Party',
          start: '2020-01-02T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2020-01-15'
        }
      ]
    }
  }
}
</script>
