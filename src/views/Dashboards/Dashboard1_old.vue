<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-lg-3">
        <div class="card">
          <div class="card-body">
            <div class="rounded-circle iq-card-icon"><i class="ri-message-line"></i></div>
            <span class="float-right line-height-6 text-secondary">Cash Deposits</span>
            <div class="clearfix"></div>
            <div class="pt-4 pb-0 text-center">
              <h2 class="mb-0"><span class="counter">15</span><span>M</span></h2>
              <p class="Secondary d-inline-block mb-0 line-height text-secondary"><i class="ri-funds-line text-success mr-1 float-left font-size-18"></i><span class="text-success">10%</span> Increased</p>
            </div>
          </div>
          <Chart element="chart-1" :chartOption="chart1"/>
        </div>
      </div>
      <div class="col-lg-3">
        <div class="card card-warning">
          <div class="card-body">
            <div class="rounded-circle iq-card-icon"><i class="ri-heart-line text-warning"></i></div>
            <span class="float-right line-height-6 text-secondary">Capital Gains</span>
            <div class="clearfix"></div>
            <div class="pt-4 pb-0 text-center">
              <h2 class="mb-0"><span>$</span><span class="counter">450</span></h2>
              <p class="Secondary d-inline-block mb-0 line-height text-secondary"><i class="ri-funds-line text-success mr-1 float-left font-size-18"></i><span class="text-success">20%</span> Increased</p>
            </div>
          </div>
          <Chart element="chart-2" :chartOption="chart2"/>
        </div>
      </div>

      <div class="col-lg-3">
        <div class="card card-success">
          <div class="card-body">
            <div class="rounded-circle iq-card-icon text-success"><i class="ri-group-line text-success"></i></div>
            <span class="float-right line-height-6 text-secondary">Subscribers Gained</span>
            <div class="clearfix"></div>
            <div class="pt-4 pb-0 text-center">
              <h2 class="mb-0"><span class="counter">96.6</span><span>k</span></h2>
              <p class="Secondary d-inline-block mb-0 line-height text-secondary"><i class="ri-funds-line text-success mr-1 float-left font-size-18"></i><span class="text-success">4%</span> Increased</p>
            </div>
          </div>
          <Chart element="chart-3" :chartOption="chart3"/>
        </div>
      </div>

      <div class="col-lg-3">
        <div class="card card-danger">
          <div class="card-body">
            <div class="rounded-circle iq-card-icon"><i class="ri-shopping-cart-line text-danger"></i></div>
            <span class="float-right line-height-6 text-secondary">Orders Received</span>
            <div class="clearfix"></div>
            <div class="pt-4 pb-0 text-center">
              <h2 class="mb-0"><span class="counter">15.5</span><span>K</span></h2>
              <p class="Secondary d-inline-block mb-0 line-height text-secondary"><i class="ri-funds-line text-danger mr-1 float-left font-size-18"></i><span class="text-danger">5%</span> Less</p>
            </div>
          </div>
          <Chart element="chart-4" :chartOption="chart4"/>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title mb-0">Card title</h5>
            <Chart element="chart" :chartOption="chart"/>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card card-danger">
          <div class="card-body">
            <h5>Product Orders</h5>
            <Chart element="chart-5" :chartOption="chart5"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card card-danger">
          <div class="card-body">
            <h5>Product Orders</h5>
            <Chart element="chart-6" :chartOption="chart6"/>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <div class="iq-header-title">
              <h6 class="card-title">Product Orders</h6>
            </div>
          </div>
          <div class="iq-card-body">
            <ul class="iq-timeline">
              <li>
                <div class="timeline-dots"></div>
                <h6 class="float-left mb-1">Client Meeting</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                </div>
              </li>
              <li>
                <div class="timeline-dots border-success"></div>
                <h6 class="float-left mb-1">Client Meeting</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                </div>
              </li>
              <li>
                <div class="timeline-dots border-danger"></div>
                <h6 class="float-left mb-1">Client Meeting</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p>Bonbon macaroon jelly beans <a href="#">gummi bears</a>gummi bears jelly lollipop apple</p>
                </div>
              </li>
              <li>
                <div class="timeline-dots border-primary"></div>
                <h6 class="float-left mb-1">Client Meeting</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                </div>
              </li>
              <li>
                <div class="timeline-dots border-warning"></div>
                <h6 class="float-left mb-1">Client Meeting</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                </div>
              </li>
              <li>
                <div class="timeline-dots border-info"></div>
                <h6 class="float-left mb-1">Client Meeting</h6>
                <small class="float-right mt-1">19 November 2019</small>
                <div class="d-inline-block w-100">
                  <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- <div class="col-lg-4">
         <div class="iq-card">
         <div class="iq-card-header d-flex justify-content-between">
         <div class="iq-header-title">
         <h6 class="card-title">Tasks</h6>
         </div>
         <div class="iq-card-header-toolbar d-flex align-items-center">
         <div class="dropdown">
         <span class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" >
         <i class="ri-settings-5-fill"></i>
         </span>
         <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
         <a class="dropdown-item" href="#">Action</a>
         <a class="dropdown-item" href="#">Another action</a>
         <a class="dropdown-item" href="#">Something else here</a>
         </div>
         </div>
         </div>
         </div>
         <div class="iq-card-body">
         </div>
         </div>
         </div> -->
      <div class="col-lg-4">
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <div class="iq-header-title">
              <h6 class="card-title">Projects</h6>
            </div>
            <div class="iq-card-header-toolbar d-flex align-items-center">
              <div class="dropdown">
                              <span class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" >
                              View all
                              </span>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
          </div>
          <div class="iq-card-body">
            <div class="media mb-3">
              <img src="https://dummyimage.com/80x60/000/fff" class="align-self-center mr-3" alt="#">
              <div class="media-body">
                <h6 class="mt-2 mb-0 font-size-14">Center-aligned media</h6>
                <small>Updated 5hr ago</small>
              </div>
            </div>
            <div class="media mb-3">
              <img src="https://dummyimage.com/80x60/000/fff" class="align-self-center mr-3" alt="#">
              <div class="media-body">
                <h6 class="mt-2 mb-0 font-size-14">Center-aligned media</h6>
                <small>Updated 5hr ago</small>
              </div>
            </div>
            <div class="media mb-3">
              <img src="https://dummyimage.com/80x60/000/fff" class="align-self-center mr-3" alt="#">
              <div class="media-body">
                <h6 class="mt-2 mb-0 font-size-14">Center-aligned media</h6>
                <small>Updated 5hr ago</small>
              </div>
            </div>
            <div class="media">
              <img src="https://dummyimage.com/80x60/000/fff" class="align-self-center mr-3" alt="#">
              <div class="media-body">
                <h6 class="mt-2 mb-0 font-size-14">Center-aligned media</h6>
                <small>Updated 5hr ago</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <div class="iq-header-title">
              <h6 class="card-title">Support Tickets</h6>
            </div>
            <div class="iq-card-header-toolbar d-flex align-items-center">
              <div class="dropdown">
                              <span class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" >
                              <i class="ri-more-2-fill"></i>
                              </span>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <a class="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
          </div>
          <div class="iq-card-body">
            <div class="media-support">
              <div class="media-support-header mb-2">
                <div class="media-support-user-img mr-3">
                  <img class="rounded-circle" src="https://dummyimage.com/60x60/ccc/fff" alt="">
                </div>
                <div class="media-support-info mt-2">
                  <h6 class="mb-0"><a href="#" class="">Nik Joder</a></h6>
                  <small>2 day ago</small>
                </div>
                <div class="mt-3">
                  <span class="badge badge-success">Pending</span>
                </div>
              </div>
              <div class="media-support-body">
                <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <hr class="mt-4 mb-4">
            <div class="media-support">
              <div class="media-support-header mb-2">
                <div class="media-support-user-img mr-3">
                  <img class="rounded-circle" src="https://dummyimage.com/60x60/ccc/fff" alt="">
                </div>
                <div class="media-support-info mt-2">
                  <h6 class="mb-0"><a href="#" class="">Nik Joder</a></h6>
                  <small>2 day ago</small>
                </div>
                <div class="mt-3">
                  <span class="badge badge-primary">Open</span>
                </div>
              </div>
              <div class="media-support-body">
                <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
            <hr class="mt-4 mb-4">
            <div class="media-support">
              <div class="media-support-header mb-2">
                <div class="media-support-user-img mr-3">
                  <img class="rounded-circle" src="https://dummyimage.com/60x60/ccc/fff" alt="">
                </div>
                <div class="media-support-info mt-2">
                  <h6 class="mb-0"><a href="#" class="">Nik Joder</a></h6>
                  <small>2 day ago</small>
                </div>
                <div class="mt-3">
                  <span class="badge badge-danger">Closed</span>
                </div>
              </div>
              <div class="media-support-body">
                <p class="mb-0">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="iq-card">
          <div class="iq-card-header d-flex justify-content-between">
            <div class="iq-header-title">
              <h6 class="card-title">Tasks</h6>
            </div>
            <div class="iq-card-header-toolbar d-flex align-items-center">
              <ul class="nav nav-pills" id="myTab" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="iq-card-body">
            <div class="tab-content" id="myTabContent">
              <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>
              <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>
              <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
                <div class="d-flex tasks-card" role="alert">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="customCheck1">
                    <label class="custom-control-label" for="customCheck1">You should check in on some of  below.</label>
                  </div>
                  <button type="button" class="close ml-auto" data-dismiss="alert" aria-label="Close">
                    <i class="ri-close-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Chart from '../../components/sofbox/charts/ApexChart'
export default {
  name: 'Dashbaord',
  components: {
    Chart
  },
  mounted () {
  },
  data () {
    return {
      chart: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        series: [{
          name: 'Desktops',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Product Trends by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
        }
      },
      chart1: {
        chart: {
          height: 80,
          type: 'area',
          sparkline: {
            enabled: true
          },
          group: 'sparklines'

        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        series: [{
          name: 'series1',
          data: [3, 30, 15, 25, 35]
        }],
        colors: ['#6f32ff'],

        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      },
      chart2: {
        chart: {
          height: 80,
          type: 'area',
          sparkline: {
            enabled: true
          },
          group: 'sparklines'

        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        series: [{
          name: 'series1',
          data: [30, 5, 15, 25, 35]
        }],
        colors: ['#ffc107'],

        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      },
      chart3: {
        chart: {
          height: 80,
          type: 'area',
          sparkline: {
            enabled: true
          },
          group: 'sparklines'

        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        series: [{
          name: 'series1',
          data: [1, 30, 15, 25, 35]
        }],
        colors: ['#28a745'],

        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      },
      chart4: {
        chart: {
          height: 80,
          type: 'area',
          sparkline: {
            enabled: true
          },
          group: 'sparklines'

        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        series: [{
          name: 'series1',
          data: [1, 30, 15, 25, 35]
        }],
        colors: ['#dc3545'],

        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      },
      chart5: {
        chart: {
          height: 350,
          type: 'radialBar'
        },
        plotOptions: {
          radialBar: {
            dataLabels: {
              name: {
                fontSize: '22px'
              },
              value: {
                fontSize: '16px'
              },
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                  return 249
                }
              }
            }
          }
        },
        series: [44, 55, 67, 83],
        labels: ['Apples', 'Oranges', 'Bananas', 'Berries']

      },
      chart6: {
        chart: {
          height: 350,
          type: 'radar'
        },
        series: [{
          name: 'Series 1',
          data: [80, 50, 30, 40, 100, 20]
        }],
        title: {
          text: 'Basic Radar Chart'
        },
        labels: ['January', 'February', 'March', 'April', 'May', 'June']
      }
    }
  }
}
</script>
