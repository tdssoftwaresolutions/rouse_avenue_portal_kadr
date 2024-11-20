import Vue from 'vue'
import Vuex from 'vuex'
import TicketBooking from './TicketBooking/index'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    loader: false
  },
  mutations: {
    commitLoader (state, data) {
      state.loader = data
    }
  },
  actions: {
    updateLoader (context, payload) {
      context.commit('commitLoader', payload)
    }
  },
  getters: {
    loader: state => state.loader
  },
  modules: {
    TicketBooking
  },
  strict: debug
})
