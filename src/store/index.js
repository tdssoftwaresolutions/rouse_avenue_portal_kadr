import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import alert from './alertStore'
import spinner from './spinnerStore'

Vue.use(Vuex)

const LOGIN_ENDPOINT = '/login'
const RESET_PASSWORD_ENDPOINT = '/resetPassword'
const CONFIRM_PASSWORD_CHANGE_ENDPOINT = '/confirmPasswordChange'
const LOGOUT_ENDPOINT = '/logout'
const GET_USER_DATA_ENDPOINT = '/getUserData'
const VERIFY_SIGNATURE_ENDPOINT = '/verify-signature'
const REFRESH_TOKEN_ENDPOINT = '/refresh-token'
const SAVE_NOTE_ENDPOINT = '/saveNote'
const GET_DASHBOARD_CONTENT_ENDPOINT = '/getDashboardContent'
const DELETE_NOTE_ENDPOINT = '/deleteNote'
const GET_CALENDAR_INIT_ENDPOINT = '/getCalendarInit'
const NEW_CALENDAR_EVENT_ENDPOINT = '/newCalendarEvent'
const GET_MY_CASES_ENDPOINT = '/getMyCases'
const GOOGLE_AUTH_ENDPOINT = '/authenticateWithGoogle'
const NEW_CASE_ENDPOINT = '/newCase'
const SUBMIT_SIGNATURE = '/submitSignature'
const GET_SIGNATURE_REQUEST_DETAILS = '/getSignatureRequestDetails'
const GET_AVAILABLE_MEDIATORS = '/getAvailableMediators'
const ASSIGN_MEDIATOR = '/assignMediator'
const SUBMIT_EVENT_FEEDBACK = '/submitEventFeedback'
const MARK_CASE_RESOLVED = '/markCaseResolved'
const UPDATE_USER_PROFILE = '/updateUserProfile'
const GET_MEDIATION_DATA = '/getMediationData'
const GET_AGREEMENT_DETAILS_FOR_SIGNATURE = '/getAgreementDetailsForSignature'
const SUBMIT_AGREEMENT_SIGNATURE = '/submitAgreementSignature'
const LIST_ALL_MEDIATORS_WITH_CASES = '/listAllMediatorsWithCases'
const SEND_OTP = '/sendOtp'
const VERIFY_OTP = '/verifyOTP'
const debug = process.env.NODE_ENV !== 'production'
const getDefaultState = () => {
  return {
    loader: false,
    user: null,
    availableLanguages: null,
    availableStates: null,
    allLanguages: null,
    dashboardContent: null,
    userData: null,
    calendarInit: null
  }
}

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 100000
})

const plugin = (router) => (store) => {
  store.$cookies = VueCookies
  store.$router = router
}

apiClient.interceptors.request.use((config) => {
  const excludedEndpoints = [LOGIN_ENDPOINT, RESET_PASSWORD_ENDPOINT, CONFIRM_PASSWORD_CHANGE_ENDPOINT ]
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
    modules: {
      alert, spinner
    },
    state: getDefaultState(),
    mutations: {
      RESET_STATE (state) {
        Object.assign(state, getDefaultState())
      },
      commitLoader (state, data) {
        state.loader = data
      },
      setUser (state, user) {
        state.user = user
      },
      setDashboardContent (state, data) {
        state.dashboardContent = data
      },
      setUserData (state, data) {
        state.userData = data
      },
      setCalendarInit (state, data) {
        state.calendarInit = data
      }
    },
    actions: {
      resetState ({ commit }) {
        commit('RESET_STATE')
      },
      updateLoader (context, payload) {
        context.commit('commitLoader', payload)
      },
      async login ({ commit, dispatch }, { username, password }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(LOGIN_ENDPOINT, { username, password })
          if (!data.success) throw new Error(data.error.message)
          store.$cookies.set('accessToken', data.data.accessToken, '1d', '/', '', true, 'None')
          store.$router.push({ name: 'dashboard.home' })
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async sendOtp ({ commit, dispatch }, { recordId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(SEND_OTP, { id: recordId })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async verifyOtp ({ commit, dispatch }, { requestId, otp }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(VERIFY_OTP, { requestId, otp })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async resetPassword ({ commit, dispatch }, { emailAddress }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(RESET_PASSWORD_ENDPOINT, { emailAddress })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async updateUserProfile ({ commit, dispatch }, { name, phone_number, profile_picture, password }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(UPDATE_USER_PROFILE, { name, phone_number, profile_picture, password })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getAgreementDetailsForSignature ({ commit, dispatch }, { requestId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(`${GET_AGREEMENT_DETAILS_FOR_SIGNATURE}?id=${encodeURIComponent(requestId)}`)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async logout ({ commit, dispatch }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(LOGOUT_ENDPOINT)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async listAllMediatorsWithCases ({ commit, dispatch }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(LIST_ALL_MEDIATORS_WITH_CASES)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async confirmPasswordChange ({ commit, dispatch }, { emailAddress, otp, password }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(CONFIRM_PASSWORD_CHANGE_ENDPOINT, { emailAddress, otp, password })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async markCaseResolved ({ commit, dispatch }, { caseId, resolveStatus, agreementText, signature }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(MARK_CASE_RESOLVED, { caseId, resolveStatus, agreementText, signature })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getMediationData ({ commit, dispatch }, { caseId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(`${GET_MEDIATION_DATA}?caseId=${encodeURIComponent(caseId)}`)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async submitAgreementSignature ({ commit, dispatch }, { signature, requestId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(SUBMIT_AGREEMENT_SIGNATURE, { signature, requestId })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async submitSignature ({ commit, dispatch }, { signature, requestId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(SUBMIT_SIGNATURE, { signature, requestId })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async submitEventFeedback ({ commit, dispatch }, { event_feedback, case_id, event_id }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(SUBMIT_EVENT_FEEDBACK, { event_feedback, case_id, event_id })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getSignatureRequestDetails ({ commit, dispatch }, { requestId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(`${GET_SIGNATURE_REQUEST_DETAILS}?requestId=${encodeURIComponent(requestId)}`)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async verifySignature ({ commit, dispatch }, { signature, userData }) {
        try {
          const { data } = await apiClient.post(VERIFY_SIGNATURE_ENDPOINT, { signature, userData })
          if (!data.success || !data.data.valid) return dispatch('logout')
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        }
      },
      async createNewCase ({ commit, dispatch }, { caseData, userId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(NEW_CASE_ENDPOINT, { caseData, userId })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async saveNote ({ commit, dispatch }, { content, id }) {
        try {
          dispatch('spinner/showSpinner')

          const { data } = await apiClient.post(SAVE_NOTE_ENDPOINT, { content, id })
          if (!data.success) throw new Error(data.error.message)

          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async assignMediator ({ commit, dispatch }, { caseId, mediatorId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(ASSIGN_MEDIATOR, { caseId, mediatorId })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getAvailableMediators ({ commit, dispatch }, { caseId }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(`${GET_AVAILABLE_MEDIATORS}?caseId=${encodeURIComponent(caseId)}`)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async googleAuth ({ commit, dispatch }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(GOOGLE_AUTH_ENDPOINT)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async newCalendarEvent ({ commit, dispatch }, { event }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(NEW_CALENDAR_EVENT_ENDPOINT, { ...event })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },

      async getUserData ({ state, commit, dispatch }) {
        try {
          dispatch('spinner/showSpinner')
          if (state.userData) return state.userData
          const { data } = await apiClient.get(GET_USER_DATA_ENDPOINT)
          if (!data.success) return dispatch('logout')
          commit('setUserData', data)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getDashboardContent ({ state, commit, dispatch }) {
        try {
          dispatch('spinner/showSpinner')
          if (state.dashboardContent) return state.dashboardContent
          const { data } = await apiClient.get(GET_DASHBOARD_CONTENT_ENDPOINT)
          if (!data.success) throw new Error(data.error.message)
          commit('setDashboardContent', data)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async deleteNote ({ commit, dispatch }, { id }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.post(DELETE_NOTE_ENDPOINT, { id })
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getCalendarInit ({ commit, state, dispatch }, { skipCache }) {
        try {
          dispatch('spinner/showSpinner')
          if (!skipCache && state.calendarInit) return state.calendarInit
          const { data } = await apiClient.get(`${GET_CALENDAR_INIT_ENDPOINT}`)
          if (!data.success) throw new Error(data.error.message)
          commit('setCalendarInit', data)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      },
      async getMyCases ({ commit, dispatch }, { page }) {
        try {
          dispatch('spinner/showSpinner')
          const { data } = await apiClient.get(`${GET_MY_CASES_ENDPOINT}?page=${encodeURIComponent(page)}`)
          if (!data.success) throw new Error(data.error.message)
          return data
        } catch (error) {
          const msg = error.response?.data?.error?.message || error.message || 'Something went wrong'
          dispatch('alert/showAlert', { message: msg, type: 'danger' }, { root: true })
          return {
            success: false,
            error
          }
        } finally {
          dispatch('spinner/hideSpinner')
        }
      }
    },
    getters: {
      loader: state => state.loader,
      user: (state) => state.user,
      dashboardContent: (state) => state.dashboardContent,
      calendarInit: (state) => state.calendarInit
    },
    strict: debug,
    plugins: [plugin(router)]
  })
  return store
}
