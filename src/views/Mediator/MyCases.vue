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
                {{ formatDate(data.item.hearing_date,'display')}}
              </template>
              <template v-slot:cell(mediation_date_time)="data">
                {{ formatDate(data.item.mediation_date_time, 'display', { includeTime: true }) }}
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
      <b-modal size="xl" id="resolve-modal" v-model="showResolveModal" title="Mark Case as Resolved" hide-footer>
        <form @submit.prevent="submitResolve">
          <div class="form-group mb-3">
            <label>Status</label>
            <div class="resolve-status-selector">
              <button
                type="button"
                :class="['resolve-status-btn', { active: resolveStatus === 'closed_success', success: resolveStatus === 'closed_success' }]"
                @click="setResolveStatus('closed_success')"
              >
                Success
              </button>
              <button
                type="button"
                :class="['resolve-status-btn', { active: resolveStatus === 'closed_no_success', failed: resolveStatus === 'closed_no_success' }]"
                @click="setResolveStatus('closed_no_success')"
              >
                Failed
              </button>
            </div>
          </div>
          <div class="form-group mb-3">
            <label>Agreed terms</label>
            <vue2-tinymce-editor v-model="resolveForm.agreementText" :options="options"></vue2-tinymce-editor>
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
import ViewCaseDetails from './ViewCaseDetail.vue'
import SignaturePad from 'signature_pad'
import { Vue2TinymceEditor } from 'vue2-tinymce-editor'

export default {
  name: 'MyCases',
  components: {
    Alert, Spinner, ViewCaseDetails, Vue2TinymceEditor
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
    formatDate (dateString, type = 'display', options = {}) {
      if (!dateString) return ''

      const date = new Date(dateString)

      const pad = (n) => (n < 10 ? '0' + n : n)

      switch (type) {
        case 'date':
          return date.toISOString().split('T')[0]

        case 'datetime-local': {
          const year = date.getFullYear()
          const month = pad(date.getMonth() + 1)
          const day = pad(date.getDate())
          const hours = pad(date.getHours())
          const minutes = pad(date.getMinutes())
          return `${year}-${month}-${day}T${hours}:${minutes}`
        }

        case 'display':
        default: {
          const { includeTime = false } = options

          return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...(includeTime && {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            })
          })
        }
      }
    },
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
      window.open('/admin/app/calendar', '_self')
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
      if (response.success) {
        this.casesCache[this.currentPage] = response.data
        this.paginatedData = response.data
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
        const canvas = this.$refs.signaturePad
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
    setResolveStatus (status) {
      this.resolveStatus = status
    },
    openResolveModal (item) {
      this.resolveForm = {
        bothAgreed: true,
        agreementText: '',
        signature: '',
        caseId: item.id
      }
      this.signatureType = 'digital'
      this.resolveStatus = 'closed_success'
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
      if (this.signatureType === 'manual') {
        if (this.signaturePad && !this.signaturePad.isEmpty()) this.resolveForm.signature = this.signaturePad.toDataURL()
        else return this.showAlert('Please provide a manual signature.', 'danger')
      } else this.resolveForm.signature = this.resolveUserInitials
      if (!this.resolveForm.agreementText.trim()) return this.showAlert('Please enter what both parties agreed.', 'danger')
      const payload = {
        caseId: this.resolveForm.caseId,
        resolveStatus: this.resolveStatus,
        agreementText: this.resolveForm.agreementText,
        signature: this.resolveForm.signature
      }
      const response = await this.$store.dispatch('markCaseResolved', payload)
      if (response.success) {
        this.showAlert(response.message, 'success')
        this.showResolveModal = false
        if (this.paginatedData && this.paginatedData.casesWithEvents) {
          this.paginatedData.casesWithEvents = this.paginatedData.casesWithEvents.filter(
            c => c.id !== this.resolveForm.caseId
          )
          if (typeof this.paginatedData.total === 'number') this.paginatedData.total = Math.max(0, this.paginatedData.total - 1)
        }
      }
    }
  },
  data () {
    return {
      options: {
        height: 400,
        plugins: [
          'autosave lists link image table media fullscreen color preview',
          'paste charmap hr anchor insertdatetime wordcount'
        ],
        toolbar: [
          'undo redo | formatselect | fontselect fontsizeselect | bold italic underline strikethrough |',
          'forecolor backcolor | alignleft aligncenter alignright alignjustify |',
          'bullist numlist outdent indent | table | link image media | fullscreen preview | restoredraft'
        ].join(' '),
        menubar: 'file edit view insert format tools table help',
        branding: false,
        image_title: true,
        automatic_uploads: true,
        autosave_interval: '20s',
        autosave_retention: '30m',
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          const ref = this
          if (meta.filetype === 'image') {
            ref.loading = true
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.onchange = function () {
              const file = input.files[0]
              const maxFileSizeMB = 1
              const maxFileSizeBytes = maxFileSizeMB * 1024 * 1024
              if (file.size > maxFileSizeBytes) {
                ref.showAlert(`The file size exceeds the ${maxFileSizeMB} MB limit.`, 'danger')
                ref.loading = false
                return
              }
              const reader = new FileReader()
              reader.onload = function (e) {
                callback(e.target.result, { alt: file.name })
                ref.loading = false
              }
              reader.onerror = function () {
                ref.showAlert('Failed to load the file. Please try again.', 'danger')
                ref.loading = false
              }
              reader.readAsDataURL(file)
            }
            input.click()
          }
        },
        media_live_embeds: true,
        setup: function (editor) {
          editor.addShortcut('ctrl+s', 'Save', function () {
            console.log('Saved!')
          })
        },
        image_caption: true,
        image_dimensions: true,
        media_alt_source: true,
        media_poster: true,
        spellchecker_dialog: true,
        browser_spellcheck: true,
        contextmenu: false,
        content_style: `
          body {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 14px;
            line-height: 1.6;
          }
        `,
        wordcount_countregex: /[\w\u2019\x27-]+/g,
        wordcount_cleanregex: /<\/?[a-z][^>]*>/g
      },
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
      resolveStatus: 'closed_success',
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
.resolve-status-selector {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.resolve-status-btn {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
  color: black;
}
.resolve-status-btn.active.success {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}
.resolve-status-btn.active.failed {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}
.resolve-status-btn:hover {
  background-color: #d9e6f2;
}
</style>
