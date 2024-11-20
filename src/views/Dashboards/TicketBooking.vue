<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <div class="iq-booking-index">
              <div class="iq-booking-offer iq-bg-primary">
                <div class="row justify-content-between">
                  <div class="col-lg-6 position-relative">
                    <div class="offer-an-img">
                      <lottie :option="require('../../assets/images/small/data2.json')"></lottie>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <h2>30% Discount For 5 Tickets!</h2>
                    <p class="text-secondary">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, type and it to make a type specimen book.</p>
                    <a href="#" class="btn btn-primary mt-3">Learn more<i class="ri-arrow-right-line ml-2"></i></a>
                  </div>
                </div>
              </div>
              <div class="pt-4">
                <Slick :option="sliderOption">
                  <div v-for="(item,index) in days" :key="index" :class="item.active">
                    <a href="javascript:void(0)" class="iq-booking-date">
                      <div class="iq-booking-dot"></div>
                      <h3>{{ item.date }}<small class="d-inline-block w-100">{{ item.day }}</small></h3>
                    </a>
                  </div>
                </Slick>
              </div>
              <div class="iq-booking-screen">
                <div class="text-center">
                  <img :src="require('../../assets/images/screen.png')" class="w-100" alt="">
                  <span>All eyes this way please!</span>
                </div>
                <div class="row">
                  <div class="col-sm-12">
                    <div class="row mt-5 pt-3 seat-booking">
                      <div class="col-lg-1 col-md-1 col-sm-1 text-right">
                        <ul class="list-unstyled iq-booking-ab">
                          <li class="friest-booking-blank"></li>
                          <li>A</li>
                          <li>B</li>
                          <li>C</li>
                          <li class="secondary-booking-blank"></li>
                          <li>D</li>
                          <li>E</li>
                          <li>F</li>
                          <li class="three-booking-blank"></li>
                          <li>G</li>
                          <li>H</li>
                        </ul>
                      </div>
                      <div class="col-lg-10 col-md-10 col-sm-10 text-center">
                        <span class="d-inline-block w-100 pb-3">Recliner.  $150.00</span>
                        <ul :class="'list-inline iq-booking-no '+boxItem.className" v-for="(boxItem,boxIndex) in boxSeats" :key="'boxSeat'+boxIndex">
                          <li class="list-inline-item mr-1" v-for="(item,index) in boxItem.items" :key="index" :class="(item.seat === false ? 'li-blank' : '')">
                            <a href="javascript:void(0)" @click="updateSeat(item)" class="iq-seat" v-if="item.seat" v-show="item.available" :class="item.active ? 'active' : ''">
                              <img :src="require('../../assets/images/small/04.svg')" alt="" class="default">
                              <img :src="require('../../assets/images/small/05.svg')" alt="" class="active-seat">
                            </a>
                            <span class="iq-seat bg-secondary" v-if="item.seat" v-show="!item.available">
                              <img :src="require('../../assets/images/small/04.svg')" alt="" class="default">
                              <img :src="require('../../assets/images/small/05.svg')" alt="" class="active-seat">
                            </span>
                          </li>
                        </ul>
                        <span class="border-top d-inline-block w-100 mt-4 pt-1 pb-3">Recliner.  $250.00</span>
                        <ul :class="'list-inline iq-booking-no '+goldItem.className" v-for="(goldItem,goldIndex) in goldSeats" :key="'goldSeat'+goldIndex">
                          <li class="list-inline-item mr-1" v-for="(item,index) in goldItem.items" :key="index" :class="(item.seat === false ? 'li-blank' : '')">
                            <a href="javascript:void(0)" @click="updateSeat(item)" class="iq-seat" v-if="item.seat" v-show="item.available" :class="item.active ? 'active' : ''">
                              <img :src="require('../../assets/images/small/04.svg')" alt="" class="default">
                              <img :src="require('../../assets/images/small/05.svg')" alt="" class="active-seat">
                            </a>
                            <span class="iq-seat bg-secondary" v-if="item.seat" v-show="!item.available">
                              <img :src="require('../../assets/images/small/04.svg')" alt="" class="default">
                              <img :src="require('../../assets/images/small/05.svg')" alt="" class="active-seat">
                            </span>
                          </li>
                        </ul>
                        <span class="border-top d-inline-block w-100 mt-4 pt-1 pb-3">Recliner.  $350.00</span>
                        <ul :class="'list-inline iq-booking-no '+silverItem.className" v-for="(silverItem,silverIndex) in sliverSeats" :key="'silverSeat'+silverIndex">
                          <li class="list-inline-item mr-1" v-for="(item,index) in silverItem.items" :key="index" :class="(item.seat === false ? 'li-blank' : '')">
                            <a href="javascript:void(0)" @click="updateSeat(item)" class="iq-seat" v-if="item.seat" v-show="item.available" :class="item.active ? 'active' : ''">
                              <img :src="require('../../assets/images/small/04.svg')" alt="" class="default">
                              <img :src="require('../../assets/images/small/05.svg')" alt="" class="active-seat">
                            </a>
                            <span class="iq-seat bg-secondary" v-if="item.seat" v-show="!item.available">
                              <img :src="require('../../assets/images/small/04.svg')" alt="" class="default">
                              <img :src="require('../../assets/images/small/05.svg')" alt="" class="active-seat">
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div class="col-lg-1 col-md-1 col-sm-1 text-left">
                        <ul class="list-unstyled iq-booking-ab">
                          <li class="friest-booking-blank"></li>
                          <li>A</li>
                          <li>B</li>
                          <li>C</li>
                          <li class="secondary-booking-blank"></li>
                          <li>D</li>
                          <li>E</li>
                          <li>F</li>
                          <li class="three-booking-blank"></li>
                          <li>G</li>
                          <li>H</li>
                        </ul>
                      </div>
                      <div class="col-lg-12 col-md-10 col-sm-10 text-center mt-3">
                        <div class="iq-booking-status">
                          <span class="bg-success"></span>Selected
                        </div>
                        <div class="iq-booking-status">
                          <span class=""></span>Available
                        </div>
                        <div class="iq-booking-status mr-0">
                          <span class="bg-secondary"></span>Sold
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <div class="iq-sidebar-right-menu hide" :class="sidebarTicket ? 'film-side' : ''">
      <div id="right-sidebar-scrollbar">
        <div class="iq-sidebar-booking bg-primary">
          <h4 class="text-white d-inline-block mb-4">Booking Summary</h4>
          <a href="javascript:void(0)" class="float-right text-white font-size-18" @click="hideSidebar"><i class="ri-close-circle-line" /></a>
          <div class="iq-booking-ticket">
            <dl class="row line-height-4">
              <dt class="col-sm-4 font-weight-normal font-size-16 text-dark">Nioking</dt>
              <dd class="col-sm-8 mb-0">20th jan, 20:00</dd>
              <dt class="col-sm-4 font-weight-normal text-dark">Avengers</dt>
              <dd class="col-sm-8 mb-0">HK5894J</dd>
              <dt class="col-sm-4 font-weight-normal text-dark">SCREEN2</dt>
              <dd class="col-sm-8 mb-0">D17, D18, D19 (3 Tickets)</dd>
            </dl>
            <hr class="mt-4 d-inline-block w-100">
            <img :src="require('../../assets/images/booking/02.jpg')" class="w-100" alt="">
          </div>
          <span class="font-size-12 text-white mt-2 d-inline-block w-100">Your current state is Maharashtra</span>
        </div>
        <div class="iq-sidebar-payment">
          <h4 class="mb-4">Payment Method</h4>
          <img :src="require('../../assets/images/booking/03.png')" class="w-100" alt="">
          <div class="custom-control custom-checkbox mt-4 ml-1">
            <input type="checkbox" class="custom-control-input" id="customCheck1">
            <label class="custom-control-label" for="customCheck1">Pay With Cash</label>
          </div>
          <div class="mb-5 d-inline-block w-100">
            <a class="btn btn-primary btn-lg btn-block mt-3 mb-5" href="#" role="button">Checkout</a>
          </div>
        </div>
      </div>
    </div>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import { mapGetters } from 'vuex'
import { calendar } from '../../config/days'
export default {
  name: 'TicketBooking',
  mounted () {
    sofbox.index()
    this.$store.dispatch('TicketBooking/displayNavTicket', true)
  },
  destroyed () {
    this.$store.dispatch('TicketBooking/displayNavTicket', false)
    this.$store.dispatch('TicketBooking/displaySidebarTicket', false)
    this.$store.dispatch('TicketBooking/resetTicket', false)
  },
  computed: {
    ...mapGetters({
      numberOfTicket: 'TicketBooking/numberOfTicket',
      sidebarTicket: 'TicketBooking/sidebarTicket'
    })
  },
  data () {
    return {
      days: calendar,
      boxSeats: [
        {
          className: '',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            }
          ]
        },
        {
          className: 'mt-3',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            }
          ]
        },
        {
          className: 'mt-3',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            }
          ]
        }
      ],
      goldSeats: [
        {
          className: '',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            }
          ]
        },
        {
          className: 'mt-3',
          items: [
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            }
          ]
        },
        {
          className: 'mt-3',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            }
          ]
        }
      ],
      sliverSeats: [
        {
          className: 'mt-3',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            }
          ]
        },
        {
          className: 'mt-3',
          items: [
            {
              available: true,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: false,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            },
            {
              available: false,
              seat: true,
              active: false
            }
          ]
        }
      ],
      sliderOption: {
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 9,
        slidesToScroll: 1,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 992,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '30',
            slidesToShow: 3
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '15',
            slidesToShow: 1
          }
        }],
        nextArrow: '<a href="#" class="ri-arrow-left-s-line left"></a>',
        prevArrow: '<a href="#" class="ri-arrow-right-s-line right"></a>'
      }
    }
  },
  methods: {
    updateSeat (seat) {
      if (seat.active) {
        seat.active = false
        this.$store.dispatch('TicketBooking/removeTicket', this.numberOfTicket)
      } else {
        seat.active = true
        this.$store.dispatch('TicketBooking/addTicket', this.numberOfTicket)
      }
    },
    hideSidebar () {
      this.$store.dispatch('TicketBooking/displaySidebarTicket', false)
    }
  }
}
</script>
