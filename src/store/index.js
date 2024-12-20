import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueCookies from 'vue-cookies'
Vue.use(Vuex)

const LOGIN_ENDPOINT = '/login'
const RESET_PASSWORD_ENDPOINT = '/resetPassword'
const CONFIRM_PASSWORD_CHANGE_ENDPOINT = '/confirmPasswordChange'
const NEW_USER_SIGNUP_ENDPOINT = '/newUserSignup'
const NEW_MEDIATOR_SIGNUP_ENDPOINT = '/newMediatorSignup'
const IS_EMAIL_EXIST_ENDPOINT = '/isEmailExist'
const LOGOUT_ENDPOINT = '/logout'
const GET_USER_DATA_ENDPOINT = '/getUserData'
const VERIFY_SIGNATURE_ENDPOINT = '/verify-signature'
const AVAILABLE_LANGUAGES_ENDPOINT = '/getAvailableLanguages'
const GET_INACTIVE_USERS_ENDPOINT = '/getInactiveUsers'
const UPDATE_INACTIVE_USER_ENDPOINT = '/updateInactiveUser'
const REFRESH_TOKEN_ENDPOINT = '/refresh-token'
const SAVE_NOTE_ENDPOINT = '/saveNote'
const GET_DASHBOARD_CONTENT_ENDPOINT = '/getDashboardContent'
const DELETE_NOTE_ENDPOINT = '/deleteNote'
const GET_CALENDAR_INIT_ENDPOINT = '/getCalendarInit'
const NEW_CALENDAR_EVENT_ENDPOINT = '/newCalendarEvent'
const GET_MY_CASES_ENDPOINT = '/getMyCases'
const GOOGLE_AUTH_ENDPOINT = '/authenticateWithGoogle'
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
  const excludedEndpoints = [LOGIN_ENDPOINT, RESET_PASSWORD_ENDPOINT, CONFIRM_PASSWORD_CHANGE_ENDPOINT, NEW_USER_SIGNUP_ENDPOINT, NEW_MEDIATOR_SIGNUP_ENDPOINT, IS_EMAIL_EXIST_ENDPOINT]
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
    if (error.response.data.errorCode === 'E102') {
      try {
        const { data } = await apiClient.post(REFRESH_TOKEN_ENDPOINT)
        VueCookies.set('accessToken', data.accessToken, '1d', '/', '', true, 'None')
        const originalRequest = error.config
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return apiClient(originalRequest) // Retry the request
      } catch (error) {
        console.error('Refreshing tokens failed:', error)
        throw error
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default (router) => {
  const store = new Vuex.Store({
    state: {
      loader: false,
      user: null,
      availableLanguages: null,
      availableStates: null,
      allLanguages: null,
      dashboardContent: null,
      calendarInit: null
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
      },
      setAllLanguages (state, data) {
        state.allLanguages = data
      },
      setDashboardContent (state, data) {
        state.dashboardContent = data
      },
      setCalendarInit (state, data) {
        state.calendarInit = data
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
          return { error }
        }
      },
      async resetPassword ({ commit }, { emailAddress }) {
        try {
          const { data } = await apiClient.post(RESET_PASSWORD_ENDPOINT, { emailAddress })
          return data
        } catch (error) {
          return { error }
        }
      },
      async logout ({ commit }) {
        try {
          const { data } = await apiClient.get(LOGOUT_ENDPOINT)
          return data
        } catch (error) {
          return { error }
        }
      },
      async confirmPasswordChange ({ commit }, { emailAddress, otp, password }) {
        try {
          const { data } = await apiClient.post(CONFIRM_PASSWORD_CHANGE_ENDPOINT, { emailAddress, otp, password })
          return data
        } catch (error) {
          return { error }
        }
      },
      async verifySignature ({ commit }, { signature, userData }) {
        try {
          const { data } = await apiClient.post(VERIFY_SIGNATURE_ENDPOINT, { signature, userData })
          return data
        } catch (error) {
          return { error }
        }
      },
      async newUserSignup ({ commit }, { userDetails }) {
        try {
          const { data } = await apiClient.post(NEW_USER_SIGNUP_ENDPOINT, { userDetails })
          return data
        } catch (error) {
          return { error }
        }
      },
      async newMediatorSignup ({ commit }, { userDetails }) {
        try {
          const { data } = await apiClient.post(NEW_MEDIATOR_SIGNUP_ENDPOINT, { userDetails })
          return data
        } catch (error) {
          return { error }
        }
      },
      async saveNote ({ commit }, { content, id }) {
        try {
          const { data } = await apiClient.post(SAVE_NOTE_ENDPOINT, { content, id })
          return data
        } catch (error) {
          return { error }
        }
      },
      async googleAuth ({ commit }) {
        try {
          const { data } = await apiClient.get(GOOGLE_AUTH_ENDPOINT)
          return data
        } catch (error) {
          return { error }
        }
      },
      async newCalendarEvent ({ commit }, { event }) {
        try {
          const { data } = await apiClient.post(NEW_CALENDAR_EVENT_ENDPOINT, { ...event })
          return data
        } catch (error) {
          return { error }
        }
      },

      async getUserData ({ commit }) {
        try {
          const { data } = await apiClient.get(GET_USER_DATA_ENDPOINT)
          return data
        } catch (error) {
          return { error }
        }
      },
      async getDashboardContent ({ state, commit }) {
        try {
          if (state.dashboardContent) {
            return state.dashboardContent
          }
          const { data } = await apiClient.get(GET_DASHBOARD_CONTENT_ENDPOINT)
          commit('setDashboardContent', data)
          return data
        } catch (error) {
          return { error }
        }
      },
      async deleteNote ({ commit }, { id }) {
        try {
          const { data } = await apiClient.post(DELETE_NOTE_ENDPOINT, { id })
          return data
        } catch (error) {
          return { error }
        }
      },
      async updateInactiveUsers ({ commit }, { isActive, caseId, userId, caseType }) {
        try {
          const { data } = await apiClient.post(UPDATE_INACTIVE_USER_ENDPOINT, { isActive, caseId, userId, caseType })
          return data
        } catch (error) {
          return { error }
        }
      },
      async isEmailExist ({ commit }, { emailAddress }) {
        try {
          const { data } = await apiClient.get(`${IS_EMAIL_EXIST_ENDPOINT}?email=${encodeURIComponent(emailAddress)}`)
          return data
        } catch (error) {
          return { error }
        }
      },
      async getCalendarInit ({ commit, state }) {
        try {
          if (state.calendarInit) {
            return state.calendarInit
          }
          const { data } = await apiClient.get(`${GET_CALENDAR_INIT_ENDPOINT}`)
          commit('setCalendarInit', data)
          return data
        } catch (error) {
          return { error }
        }
      },
      async getInactiveUsers ({ commit }, { page, type }) {
        try {
          const { data } = await apiClient.get(`${GET_INACTIVE_USERS_ENDPOINT}?page=${encodeURIComponent(page)}&type=${encodeURIComponent(type)}`)
          return data
        } catch (error) {
          return { error }
        }
      },
      async getMyCases ({ commit }, { page }) {
        try {
          const { data } = await apiClient.get(`${GET_MY_CASES_ENDPOINT}?page=${encodeURIComponent(page)}`)
          return data
        } catch (error) {
          return { error }
        }
      },
      async getAllLanguages ({ state, commit }) {
        try {
          if (state.allLanguages) {
            return state.allLanguages
          }
          const response = await fetch('/languages.json')
          if (!response.ok) {
            return {
              'errorCode': 'E256',
              'message': 'Network response was not ok'
            }
          }
          const jsonData = await response.json()
          commit('setAllLanguages', jsonData)
          return jsonData
        } catch (error) {
          return { error }
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
          return { error }
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
          return { error }
        }
      }
    },
    getters: {
      loader: state => state.loader,
      user: (state) => state.user,
      availableLanguages: (state) => state.availableLanguages,
      availableStates: (state) => state.availableStates,
      allLanguages: (state) => state.allLanguages,
      dashboardContent: (state) => state.dashboardContent,
      calendarInit: (state) => state.calendarInit
    },
    strict: debug,
    plugins: [plugin(router)]
  })
  return store
}
