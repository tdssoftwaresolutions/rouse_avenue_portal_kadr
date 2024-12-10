import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueCookies from 'vue-cookies'
Vue.use(Vuex)

const LOGIN_ENDPOINT = '/login'
const REGISTER_ENDPOINT = '/register'
const RESET_PASSWORD_ENDPOINT = '/resetPassword'
const CONFIRM_PASSWORD_CHANGE_ENDPOINT = '/confirmPasswordChange'
const NEW_USER_SIGNUP_ENDPOINT = '/newUserSignup'
const IS_EMAIL_EXIST_ENDPOINT = '/isEmailExist'
const AVAILABLE_LANGUAGES_ENDPOINT = '/getAvailableLanguages'
const GET_INACTIVE_USERS_ENDPOINT = '/getInactiveUsers'
const UPDATE_INACTIVE_USER_ENDPOINT = '/updateInactiveUser'
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
      user: null,
      availableLanguages: null,
      availableStates: null
    },
    mutations: {
      commitLoader (state, data) {
        state.loader = data
      },
      setUser (state, user) {
        state.user = user
      },
      setAvailableLanguages (state, data) {
        state.availableLanguages = data
      },
      setAvailableStates (state, data) {
        state.availableStates = data
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
      async newUserSignup ({ commit }, { userDetails }) {
        try {
          const { data } = await apiClient.post(NEW_USER_SIGNUP_ENDPOINT, { userDetails })
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async updateInactiveUsers ({ commit }, { isActive, caseId, userId, caseType }) {
        try {
          const { data } = await apiClient.post(UPDATE_INACTIVE_USER_ENDPOINT, { isActive, caseId, userId, caseType })
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async isEmailExist ({ commit }, { emailAddress }) {
        try {
          const { data } = await apiClient.get(`${IS_EMAIL_EXIST_ENDPOINT}?email=${encodeURIComponent(emailAddress)}`)
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async getInactiveUsers ({ commit }, { page }) {
        try {
          const { data } = await apiClient.get(`${GET_INACTIVE_USERS_ENDPOINT}?page=${encodeURIComponent(page)}`)
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async getAvailableLanguages ({ state, commit }) {
        try {
          if (state.availableLanguages) {
            return state.availableLanguages
          }

          const { data } = await apiClient.get(AVAILABLE_LANGUAGES_ENDPOINT)
          commit('setAvailableLanguages', data)
          return data
        } catch (error) {
          return error.response.data
        }
      },
      async getStates ({ state, commit }) {
        try {
          if (state.availableStates) {
            return state.availableStates
          }
          const response = await fetch('/states.json')
          if (!response.ok) {
            return {
              'errorCode': 'E256',
              'message': 'Network response was not ok'
            }
          }
          const jsonData = await response.json()
          commit('setAvailableStates', jsonData)
          return jsonData
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
      user: (state) => state.user,
      availableLanguages: (state) => state.availableLanguages,
      availableStates: (state) => state.availableStates
    },
    strict: debug,
    plugins: [plugin(router)]
  })
  return store
}
