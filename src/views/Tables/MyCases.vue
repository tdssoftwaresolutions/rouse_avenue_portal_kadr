<template>
    <b-row>
      <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
      <Spinner :isVisible="loading" />
      <b-col md="12">
        <b-row>
          <b-col v-if="paginatedData.total > 0" md="12" class="table-responsive">
            <b-pagination
              v-model="currentPage"
              :total-rows="paginatedData.total"
              :per-page="perPage"
              align="center"
              class="mt-3"
              @input="fetchUsers"
            />
            <b-table bordered hover :items="paginatedData.casesWithEvents" :fields="columns" responsive="sm" >
              <template v-slot:cell(client)="data">
                {{ data.item.user_cases_first_partyTouser?.name }} vs {{ data.item.user_cases_second_partyTouser?.name }}
              </template>
              <template v-slot:cell(hearing_date)="data">
                {{ data.item.hearing_date ? new Date(data.item.hearing_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '' }}
              </template>
              <template v-slot:cell(mediation_date_time)="data">
                {{ data.item.mediation_date_time ? new Date(data.item.mediation_date_time).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '' }}
              </template>
              <template v-slot:cell(action)="data"><b-button size="sm" v-b-modal.modal-lg @click="info(data.item)" class="ml-2">
                  View Details
                </b-button>
                <b-button variant=" iq-bg-success ms-1" size="sm" @click="openResolveModal(data.item)">Mark as Resolved</b-button>
              </template>
            </b-table>
          </b-col>
          <b-col v-else >
            <h2 style="text-align: center;">No record pending!</h2>
          </b-col>
        </b-row>
      </b-col>
      <b-modal id="modal-lg" size="xl" :title="caseTitle" scrollable>
        <view-case-details :caseObject="selectedUser"></view-case-details>
      </b-modal>
      <b-modal id="resolve-modal" v-model="showResolveModal" title="Mark Case as Resolved" hide-footer>
        <form @submit.prevent="submitResolve">
          <div class="form-group mb-3">
            <b-form-checkbox v-model="resolveForm.bothAgreed">
              Both parties agreed mutually
            </b-form-checkbox>
          </div>
          <div class="form-group mb-3">
            <label>Agreed terms</label>
            <b-form-textarea v-model="resolveForm.agreementText" rows="3" required></b-form-textarea>
          </div>
          <div class="form-group mb-3">
            <label>Signature:</label>
            <div class="signature-type-selector">
              <button
                type="button"
                :class="{ active: signatureType === 'digital' }"
                @click="setSignatureType('digital')">
                Digital Signature
              </button>
              <button
                type="button"
                :class="{ active: signatureType === 'manual' }"
                @click="setSignatureType('manual')">
                Sign Manually
              </button>
            </div>
            <div v-if="signatureType === 'digital'" class="digital-signature-box full-width">
              <span class="cursive-signature">{{ resolveUserInitials }}</span>
            </div>
            <div v-else-if="signatureType === 'manual'" class="manual-signature">
              <canvas ref="signaturePad" class="signature-canvas"></canvas>
              <button type="button" @click="clearResolveSignature" class="btn btn-secondary" style="margin: 0px;width: 100%;">
                Clear <i class="ri-refresh-line"></i>
              </button>
            </div>
          </div>
          <div class="text-right" style="margin-top: 24px; display: flex; gap: 16px; justify-content: flex-end;">
            <b-button variant="secondary" @click="showResolveModal = false" type="button">Cancel</b-button>
            <b-button type="submit" variant="primary">Save</b-button>
          </div>
        </form>
      </b-modal>
    </b-row>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import Alert from '../../components/sofbox/alert/Alert.vue'
import Spinner from '../../components/sofbox/spinner/spinner.vue'
import ViewCaseDetails from '../Apps/ViewCaseDetail.vue'
import SignaturePad from 'signature_pad'

export default {
  name: 'MyCases',
  components: {
    Alert, Spinner, ViewCaseDetails
  },
  props: {
    cases: {
      type: Object,
      required: true
    },
    userFullName: {
      type: String,
      default: ''
    }
  },
  mounted () {
    sofbox.index()
    this.syncWithProp()
    this.casesCache[1] = this.cases
  },
  watch: {
    cases: {
      immediate: true,
      handler () {
        this.syncWithProp()
      }
    }
  },
  computed: {
    paginatedItems () {
      const start = (this.currentPage - 1) * this.perPage
      return this.paginatedData.casesWithEvents.slice(start, start + this.perPage)
    },
    resolveUserInitials () {
      // Use the mediator's name or fallback
      return (this.userFullName)
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    }
  },
  methods: {
    getStatus (item) {
      const startDateTime = new Date(item.start_datetime)
      const currentDateTime = new Date()
      if (startDateTime.getTime() === currentDateTime.getTime()) {
        return 'Today'
      } else if (startDateTime.getTime() < currentDateTime.getTime()) {
        return 'Past'
      } else {
        return 'Upcoming'
      }
    },
    getVariant (status) {
      switch (status) {
        case 'Today':
          return 'success'
        case 'Past':
          return 'secondary'
        case 'Upcoming':
          return 'primary'
      }
    },
    info (item) {
      this.caseTitle = `Case #${item.caseId}`
      this.selectedUser = item
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        visible: true
      }
    },
    syncWithProp () {
      this.paginatedData = { ...this.cases }
    },
    async scheduleMeeting (item) {
      this.loading = true
      window.open('/admin/app/calendar', '_self')
      this.loading = false
    },
    async fetchUsers (newPage) {
      this.currentPage = newPage
      if (this.casesCache[this.currentPage]) {
        this.paginatedData = this.casesCache[this.currentPage]
        return
      }
      const response = await this.$store.dispatch('getMyCases', {
        page: this.currentPage
      })
      if (response.errorCode) {
        this.showAlert(response.message, 'danger')
      } else {
        this.casesCache[this.currentPage] = response
        this.paginatedData = response
      }
    },
    setSignatureType (type) {
      this.signatureType = type
      if (type === 'manual') {
        this.$nextTick(() => {
          this.initializeSignaturePad()
        })
      }
    },
    initializeSignaturePad () {
      this.$nextTick(() => {
        const canvas = this.$refs.signaturePad // Use 'signaturePad' as ref name, like MediationForm
        if (!canvas) return
        this.adjustCanvasSize(canvas)
        this.signaturePad = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255, 255, 255)',
          penColor: 'rgb(0, 0, 0)'
        })
      })
    },
    adjustCanvasSize (canvas) {
      if (!canvas) return
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      if (canvas.offsetWidth && canvas.offsetHeight) {
        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio
        canvas.getContext('2d').scale(ratio, ratio)
      }
    },
    openResolveModal (item) {
      this.resolveForm = {
        bothAgreed: true,
        agreementText: '',
        signature: '',
        caseId: item.id
      }
      this.signatureType = 'digital' // Reset to digital on open, like MediationForm
      this.showResolveModal = true
      this.$nextTick(() => {
        if (this.signatureType === 'manual') {
          this.initializeSignaturePad()
        }
      })
    },
    clearResolveSignature () {
      if (this.signaturePad) {
        this.signaturePad.clear()
      }
    },
    async submitResolve () {
      // Get signature value
      if (this.signatureType === 'manual') {
        if (this.signaturePad && !this.signaturePad.isEmpty()) {
          this.resolveForm.signature = this.signaturePad.toDataURL()
        } else {
          this.showAlert('Please provide a manual signature.', 'danger')
          return
        }
      } else {
        this.resolveForm.signature = this.resolveUserInitials
      }
      if (!this.resolveForm.agreementText.trim()) {
        this.showAlert('Please enter what both parties agreed.', 'danger')
        return
      }
      // Prepare payload
      const payload = {
        caseId: this.resolveForm.caseId,
        bothAgreed: this.resolveForm.bothAgreed,
        agreementText: this.resolveForm.agreementText,
        signature: this.resolveForm.signature
      }
      await this.$store.dispatch('markCaseResolved', payload)
      this.showAlert('Case marked as resolved!', 'success')
      this.showResolveModal = false
    }
  },
  data () {
    return {
      selectedUser: null,
      currentPage: 1,
      perPage: 10,
      caseTitle: '',
      signatureType: 'digital',
      paginatedData: {},
      columns: [
        { label: 'Case Number', key: 'caseId', class: 'text-left', sortable: true },
        { label: 'Client', key: 'client', class: 'text-left', sortable: false },
        { label: 'Suit No', key: 'suit_no', class: 'text-left', sortable: false },
        { label: 'Nature of Suit', key: 'nature_of_suit', class: 'text-left', sortable: false },
        { label: 'Stage', key: 'stage', class: 'text-left', sortable: false },
        { label: 'Case Type', key: 'case_type', class: 'text-left', sortable: false },
        { label: 'Hearing Date', key: 'hearing_date', class: 'text-left', sortable: false },
        { label: 'Mediation Date', key: 'mediation_date_time', class: 'text-left', sortable: false },
        { label: 'Action', key: 'action', class: 'text-center' }
      ],
      casesCache: {},
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      loading: false,
      showResolveModal: false,
      resolveForm: {
        bothAgreed: true,
        agreementText: '',
        signature: '',
        caseId: null
      },
      resolveSignaturePad: null
    }
  }
}
</script>
<style scoped>
.ml {
    margin-left: 0.5rem;
}
/* Add space between key and value */
ul li span {
  display: flex;
  align-items: center;
}

ul li span strong {
  margin-right: 8px; /* Add space between key (bold) and value */
}
.signature-type-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.signature-type-selector button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
  color: black; /* Default text color for non-selected buttons */
}

.signature-type-selector button.active {
  background-color: #2c6faf;
  color: white;
  border-color: #2c6faf;
}

.signature-type-selector button:hover {
  background-color: #d9e6f2;
}
.signature-btn {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
  color: black;
}
.signature-btn.active {
  background-color: #2c6faf;
  color: white;
  border-color: #2c6faf;
}
.signature-btn:hover {
  background-color: #d9e6f2;
}
.digital-signature-box {
  border: 1px solid #ccc;
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  text-align: center;
}
.digital-signature-box.full-width {
  width: 100%;
}
.cursive-signature {
  font-family: Cursive;
  font-size: 24px;
  color: #2c6faf;
}
.manual-signature {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.signature-canvas {
  border: 1px solid #ccc;
  width: 100%;
  height: 150px;
  margin-top: 10px;
  cursor: crosshair;
}
</style>
