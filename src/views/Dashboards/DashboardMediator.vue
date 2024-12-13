<template>
    <b-container fluid>
      <b-modal v-model="isModalVisible" title="User Details"  :size="'lg'" centered>
        <div>
          <h5>User Details</h5>
          <p><strong>Name:</strong> {{ selectedUser.name }}</p>
          <p><strong>Phone:</strong> {{ selectedUser.phone }}</p>
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <hr>
          <h5>Opponent Details</h5>
          <p><strong>Name:</strong> {{ selectedUser.opponent.name }}</p>
          <p><strong>Email:</strong> {{ selectedUser.opponent.email }}</p>
          <p><strong>Phone:</strong> {{ selectedUser.opponent.phone }}</p>
          <hr>
          <h5>Case Details</h5>
          <p><strong>Case ID:</strong> {{ selectedUser.caseId }}</p> <!-- Added Case ID -->
          <p><strong>Category:</strong> {{ selectedUser.case.category }}</p>
          <p><strong>Evidence:</strong> <a :href="selectedUser.case.evidence" target="_blank">View Evidence</a></p>
          <hr>
          <b-form-textarea v-model="note" placeholder="Enter your notes here..." rows="3"></b-form-textarea>
          <b-button @click="saveNote" variant="primary" class="mt-2">Save Note</b-button>
        </div>
      </b-modal>
      <b-row>
        <b-col lg="3" md="12">
          <iq-card class="iq-profile-card text-center">
            <template v-slot:body>
              <div class="iq-team text-center p-0">
                <img :src="require('../../assets/images/user/1.jpg')"
                    class="img-fluid mb-3 avatar-120 rounded-circle" alt="">
                <h4 class="mb-0">Welcome {{ user.name }}</h4>
                <p class="d-inline-block w-100">{{ user.email }}</p>
              </div>
            </template>
          </iq-card>
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">Today's Schedule</h4>
            </template>
            <template v-slot:body>
              <ul class="m-0 p-0 today-schedule">
                <li class="d-flex">
                  <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-primary" /></div>
                  <div class="schedule-text"> <span>Web Design</span>
                    <span>09:00 to 12:00</span></div>
                </li>
                <li class="d-flex">
                  <div class="schedule-icon"><i class="ri-checkbox-blank-circle-fill text-success" /></div>
                  <div class="schedule-text"> <span>Participate in Design</span>
                    <span>09:00 to 12:00</span></div>
                </li>
              </ul>
            </template>
          </iq-card>
        </b-col>
        <b-col lg="4" md="12">
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">My Notes</h4>
            </template>
            <template v-slot:headerAction>
              <a href="#" class="btn btn-primary" @click="onClickNewAdd('')">
                  Add New
              </a>
            </template>
            <template v-slot:body>
              <div style="height: 400px;overflow-x: scroll; ">
                <div class="textarea-wrapper" v-for="(note, index) in notes" :key="note.id">
                  <textarea class="sticky-note" v-model="note.content" @input="onContentChange(index)" :data-index="index"></textarea>
                  <button v-if="note.isModified" class="save-btn" aria-label="Save" @click="onClickSave(index)">
                    <i class="fas fa-save"></i>
                  </button>
                  <button class="delete-btn" aria-label="Delete" @click="onClickDelete(index)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </template>
          </iq-card>
        </b-col>
        <b-col lg="5" md="12">
          <iq-card class-name="overflow-hidden" body-class="pb-0">
            <template v-slot:body>
              <div class="rounded-circle iq-card-icon iq-bg-primary"><i class="ri-exchange-dollar-fill"></i></div>
              <span class="float-right line-height-6">Current Month's Income</span>
              <div class="clearfix"></div>
              <div class="text-center">
                <h2 class="mb-0"><span class="counter">Rs.</span><span>65k</span></h2>
                <p class="mb-0 text-secondary line-height"><i class="ri-arrow-up-line text-success ms-1"></i><span class="text-success">10%</span> Increased</p>
              </div>
            </template>
            <ApexChart element="chart-1" :chartOption="chart1"/>
          </iq-card>
          <iq-card class-name="overflow-hidden" body-class="pb-0">
            <template v-slot:body>
              <div class="rounded-circle iq-card-icon iq-bg-danger"><i class="ri-shopping-cart-line"></i></div>
              <span class="float-right line-height-6">Number of Cases Resolved</span>
              <div class="clearfix"></div>
              <div class="text-center">
                <h2 class="mb-0"><span class="counter">30</span><span></span></h2>
                <p class="mb-0 text-secondary line-height"><i class="ri-arrow-down-line text-danger ms-1"></i><span class="text-danger">10%</span> Increased</p>
              </div>
            </template>
            <ApexChart element="chart-4" :chartOption="chart4"/>
          </iq-card>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="12" md="12">
          <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title">My Cases</h4>
            </template>
            <template v-slot:body>
              <ul class="suggestions-lists m-0 p-0">
                <li v-for="(item,index) in content.myCases" :key="index" class="d-flex mb-4 align-items-center" @click="onClickCase">
                  <div class="user-img img-fluid">
                    <b-img :src="item.image" alt="story-img" rounded="circle" class="avatar-40" />
                  </div>
                  <div class="media-support-info ms-3">
                    <h6>{{ item.caseId }}</h6>
                    <p class="mb-0">{{ item.case_name }}</p>
                  </div>
                  <div class="add-suggestion"><b-link href="javascript:void();"><i class="ri-user-add-line"></i></b-link></div>
                </li>
              </ul>
            </template>
          </iq-card>
        </b-col>
      </b-row>
    </b-container>
</template>
<script>

export default {
  name: 'DashboardMediator',
  props: {
    user: null,
    content: null
  },
  methods: {
    onClickDelete (index) {
      this.notes.splice(index, 1)
    },
    isSessionAvailable () {
      if (this.$cookies.get('accessToken')) {
        return true
      }
      return false
    },
    onClickCase () {
      this.note = this.$cookies.get('notes') || ''
      this.isModalVisible = true
    },
    onContentChange (index) {
      this.notes[index].isModified = true
    },
    saveNote () {
      if (this.selectedUser) {
        this.$cookies.set('notes', this.note)
        this.$bvToast.toast('Note saved!', {
          title: 'Success',
          variant: 'success',
          solid: true
        })
      }
    },
    onClickNewAdd (content) {
      this.notes.push({
        id: this.newNoteId++,
        content
      })
    },
    onClickSave (index) {
      alert('saved' + index)
    }
  },
  mounted () {
    for (let i = 0; i < this.content.notes.length; i++) {
      this.onClickNewAdd(this.content.notes[i].note_text)
    }
    const ref = this
    document.addEventListener('keydown', function (event) {
      const activeElement = document.activeElement
      if (activeElement.tagName === 'TEXTAREA') {
        if ((event.metaKey || event.ctrlKey) && event.key === 's') {
          event.preventDefault()
          const noteIndex = activeElement.dataset.index
          if (noteIndex !== undefined) {
            ref.onClickSave(Number(noteIndex))
          } else {
            console.error('Could not find associated note for saving.')
          }
        }
      }
    })
  },
  data () {
    return {
      newNoteId: 1,
      notes: [],
      isModalVisible: false,
      selectedUser: {
        id: 1,
        name: 'John Doe',
        phone: '123-456-7890',
        caseId: '#KDR436988',
        image: require('../../assets/images/user/03.jpg'),
        email: 'john.doe@example.com',
        opponent: { name: 'Jane Doe', phone: '987-654-3210', email: 'jane.doe@example.com' },
        case: { category: 'Dispute', evidence: 'https://example.com/evidence.pdf' }
      },
      note: '',
      suggestions: [
        { name: 'Paul Molive', mutual_friend: '#KDR124621', image: require('../../assets/images/user/01.jpg') },
        { name: 'Paige Turner', mutual_friend: '#KDR975436', image: require('../../assets/images/user/03.jpg') },
        { name: 'Barb Ackue', mutual_friend: '#KDR987474', image: require('../../assets/images/user/04.jpg') },
        { name: 'Greta Life', mutual_friend: '#KDR92375', image: require('../../assets/images/user/05.jpg') },
        { name: 'Ira Membrit', mutual_friend: '#KDR109475', image: require('../../assets/images/user/06.jpg') }
      ],
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
          width: 3,
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0
          }
        },
        series: [{
          name: 'series1',
          data: [60, 15, 50, 30, 70]
        }],
        colors: ['#0084ff'],

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
          width: 3,
          curve: 'smooth'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.5,
            opacityTo: 0
          }
        },
        series: [{
          name: 'series1',
          data: [75, 30, 60, 35, 60]
        }],
        colors: ['#e64141'],
        xaxis: {
          type: 'datetime',
          categories: ['2018-08-19T00:00:00', '2018-09-19T01:30:00', '2018-10-19T02:30:00', '2018-11-19T01:30:00', '2018-12-19T01:30:00']
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        }
      }
    }
  }
}
</script>
<style scoped>
  .textarea-wrapper {
  position: relative;
  display: inline-block;
  width: 100%;
}

.delete-btn, .save-btn {
  position: absolute;
  right: 5px;
  background: transparent;
  border: none;
  font-size: 24px; /* Icon size */
  color: #f00; /* Red color for delete button */
  cursor: pointer;
  padding: 8px;
  border-radius: 50%; /* Round button for a circular appearance */
  transition: background 0.3s ease;
}

.delete-btn {
  top: 5px; /* Position delete button at the top right */
}

.save-btn {
  top: 40px; /* Position save button below the delete button */
  color: #4CAF50; /* Green color for the save button */
}

textarea {
  font: 17px 'Gloria Hallelujah', cursive;
  line-height: 1.5;
  border: 0;
  border-radius: 3px;
  background: linear-gradient(#F9EFAF, #F7E98D);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  overflow-y: auto;
  transition: box-shadow 0.5s ease;
  max-width: 520px;
  max-height: 250px;
  width: 100%;
  height: 150px;
  padding-right: 2rem;
  padding-left: 0.5rem;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
}

</style>
