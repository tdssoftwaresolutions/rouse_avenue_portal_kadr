<template>
  <b-container fluid>
    <Alert :message="alert.message" :type="alert.type" v-model="alert.visible" :timeout="alert.timeout"></Alert>
    <Spinner :isVisible="loading" />
    <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:body>
            <div class="iq-edit-list">
              <ul class="iq-edit-profile d-flex nav nav-pills mb-4">
                <li class="col-md-6 p-0">
                  <a class="nav-link" :class="{active: activeTab==='personal'}" @click="activeTab='personal'">
                    Personal Information
                  </a>
                </li>
                <li class="col-md-6 p-0">
                  <a class="nav-link" :class="{active: activeTab==='password'}" @click="activeTab='password'">
                    Change Password
                  </a>
                </li>
              </ul>
            </div>
            <div class="iq-edit-list-data">
              <div v-show="activeTab==='personal'">
                <div class="iq-card">
                  <div class="iq-card-header d-flex justify-content-between">
                    <div class="iq-header-title">
                      <h4 class="card-title">Personal Information</h4>
                    </div>
                  </div>
                  <div class="iq-card-body">
                    <b-form @submit.prevent="onSave">
                      <div class="form-group row align-items-center">
                        <div class="col-md-12">
                          <div class="profile-img-edit">
                            <img
                              class="profile-pic"
                              :src="profilePicturePreview || user.profile_picture_url || defaultProfileImage"
                              alt="profile-pic"
                              @click="triggerProfilePictureUpload"
                            >
                            <div class="p-image" @click.stop="triggerProfilePictureUpload" title="Edit profile picture">
                              <i class="ri-pencil-line upload-button"></i>
                              <input
                                ref="profilePictureInput"
                                class="file-upload"
                                type="file"
                                accept="image/*"
                                @change="onProfilePictureChange"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row align-items-center">
                        <div class="form-group col-sm-6">
                          <label for="name">Full Name:</label>
                          <b-form-input id="name" v-model="form.name" required />
                        </div>
                        <div class="form-group col-sm-6">
                          <label for="email">Email:</label>
                          <b-form-input id="email" :value="user.email" readonly />
                        </div>
                        <div class="form-group col-sm-6">
                          <label for="phone">Phone Number:</label>
                          <b-form-input id="phone" v-model="form.phone_number" />
                        </div>
                      </div>
                      <button type="submit" class="btn btn-primary mr-2">
                        <span >Save</span>
                      </button>
                    </b-form>
                  </div>
                </div>
              </div>
              <div v-show="activeTab==='password'">
                <div class="iq-card">
                  <div class="iq-card-header d-flex justify-content-between">
                    <div class="iq-header-title">
                      <h4 class="card-title">Change Password</h4>
                    </div>
                  </div>
                  <div class="iq-card-body">
                    <b-form @submit.prevent="onSavePassword">
                      <div class="form-group">
                        <label for="npass">New Password:</label>
                        <b-form-input id="npass" v-model="form.password" type="password" autocomplete="new-password" />
                      </div>
                      <div class="form-group">
                        <label for="vpass">Confirm Password:</label>
                        <b-form-input id="vpass" v-model="form.confirmPassword" type="password" autocomplete="new-password" />
                      </div>
                      <button type="submit" class="btn btn-primary mr-2">
                        <span>Change Password</span>
                      </button>
                    </b-form>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
import profile from '../../assets/images/user/1.jpeg'
import Alert from '../../components/sofbox/alert/Alert.vue'
import Spinner from '../../components/sofbox/spinner/spinner.vue'
const allowedTypes = [
  'image/jpeg',
  'image/png'
]
const maxSize = 2 * 1024 * 1024

export default {
  name: 'ProfileEdit',
  components: {
    Alert, Spinner
  },
  data () {
    return {
      defaultProfileImage: profile,
      activeTab: 'personal',
      form: {
        name: '',
        phone_number: '',
        password: '',
        confirmPassword: ''
      },
      user: {
        email: '',
        name: '',
        phone_number: '',
        profile_picture_url: '',
        url: ''
      },
      profilePictureFile: null,
      profilePicturePreview: null,
      alert: {
        visible: false,
        message: '',
        timeout: 5000,
        type: 'primary'
      },
      loading: false
    }
  },
  created () {
    // Fetch user data from store and initialize form/user
    this.initUserData()
  },
  mounted () {
    sofbox.index()
  },
  methods: {
    async initUserData () {
      const response = await this.$store.dispatch('getUserData')
      if (!response.errorCode) {
        const user = response.userData
        this.user = user
        this.form.name = user.name || ''
        this.form.phone_number = user.phone || ''
      }
    },
    triggerProfilePictureUpload () {
      this.$refs.profilePictureInput.click()
    },
    onProfilePictureChange (event) {
      const ref = this
      const file = event.target.files[0]
      if (file) {
        this.profilePictureFile = file
        const reader = new FileReader()
        reader.onload = e => {
          if (!allowedTypes.includes(ref.profilePictureFile.type)) {
            ref.showAlert('Invalid file type. Allowed types: JPEG, PNG.', 'danger')
            return
          }
          if (ref.profilePictureFile.size > maxSize) {
            ref.showAlert('Profile picture size exceeds 2MB.', 'danger')
            return
          }
          this.profilePicturePreview = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
    showAlert (message, type) {
      this.alert = {
        message,
        type,
        timeout: 5000,
        visible: true
      }
    },
    async onSave () {
      this.loading = true
      try {
        const payload = {
          name: this.form.name,
          phone_number: this.form.phone_number,
          profile_picture: this.profilePicturePreview
        }
        await this.updateUserProfile(payload)
        this.$bvToast.toast('Profile updated successfully', { variant: 'success', solid: true })
      } catch (e) {
        this.$bvToast.toast('Failed to update profile', { variant: 'danger', solid: true })
      }
      this.loading = false
    },
    async updateUserProfile (payload) {
      return await this.$store.dispatch('updateUserProfile', payload)
    },
    async onSavePassword () {
      if (this.form.password && this.form.password !== this.form.confirmPassword) {
        this.$bvToast.toast('Passwords do not match', { variant: 'danger', solid: true })
        return
      }
      this.loading = true
      try {
        const payload = {
          password: this.form.password
        }
        await this.updateUserProfile(payload)
        this.$bvToast.toast('Password updated successfully', { variant: 'success', solid: true })
      } catch (e) {
        this.$bvToast.toast('Failed to update password', { variant: 'danger', solid: true })
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.iq-edit-profile {
  margin-bottom: 0;
}
.iq-edit-profile .nav-link {
  border-radius: 0;
  border: none;
  color: #495057;
  background: #f8f9fa;
  text-align: center;
  font-weight: 500;
  font-size: 1rem;
  padding: 1rem 0;
  cursor: pointer;
}
.iq-edit-profile .nav-link.active {
  background: #007bff;
  color: #fff;
}
.profile-img-edit {
  position: relative;
  display: inline-block;
}
.profile-pic {
  width: 130px;
  height: 130px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #eee;
  display: block;
  cursor: pointer;
}
.p-image {
  position: absolute;
  bottom: 18px;
  right: 18px;
  background: #007bff;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  font-size: 18px;
  border: 1px solid #e0e0e0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.p-image i {
  color: #fff !important;
  /* filter: invert(1) brightness(2); */ /* Not needed if color is set to white */
  font-size: 20px;
  line-height: 1;
}
.p-image:hover {
  background: #0056b3;
}
.file-upload {
  display: none;
}
</style>
