import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueCookies from 'vue-cookies'
Vue.use(Vuex)

const LOGIN_ENDPOINT = '/login'
const REGISTER_ENDPOINT = '/register'
const RESET_PASSWORD_ENDPOINT = '/resetPassword'
const CONFIRM_PASSWORD_CHANGE_ENDPOINT = '/confirmPasswordChange'

const debug = process.env.NODE_ENV !== 'production'
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5000
})

const plugin = (router) => (store) => {
  store.$cookies = VueCookies
  store.$router = router
}

apiClient.interceptors.request.use((config) => {
  const excludedEndpoints = [LOGIN_ENDPOINT, REGISTER_ENDPOINT, RESET_PASSWORD_ENDPOINT]
  const isExcluded = excludedEndpoints.some((endpoint) =>
    config.url.includes(endpoint)
  )
  if (!isExcluded) {
    const token = VueCookies.get('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error)
  }
)

export default (router) => {
  const store = new Vuex.Store({
    state: {
      loader: false,
      user: null
    },
    mutations: {
      commitLoader (state, data) {
        state.loader = data
      },
      setUser (state, user) {
        state.user = user
      }
    },
    actions: {
      updateLoader (context, payload) {
        context.commit('commitLoader', payload)
      },
      async login ({ commit }, { username, password }) {
        try {
          const { data } = await apiClient.post(LOGIN_ENDPOINT, { username, password })
          store.$cookies.set('accessToken', data.accessToken, '1d', '/', '', true, 'None')
          store.$router.push({ name: 'dashboard1.home' })
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async resetPassword ({ commit }, { emailAddress }) {
        try {
          const { data } = await apiClient.post(RESET_PASSWORD_ENDPOINT, { emailAddress })
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async confirmPasswordChange ({ commit }, { emailAddress, otp, password }) {
        try {
          const { data } = await apiClient.post(CONFIRM_PASSWORD_CHANGE_ENDPOINT, { emailAddress, otp, password })
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async refreshTokens () {
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          const { data } = await apiClient.post('/refresh-token', { refreshToken })
          localStorage.setItem('accessToken', data.accessToken)
          return data
        } catch (error) {
          console.error('Refreshing tokens failed:', error)
          throw error
        }
      }
    },
    getters: {
      loader: state => state.loader,
      user: (state) => state.user
    },
    strict: debug,
    plugins: [plugin(router)]
  })
  return store
}
