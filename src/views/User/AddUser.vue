<template>
  <b-container fluid>
    <b-row>
      <b-col lg="3">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Add New User</h4>
          </template>
          <template v-slot:body>
            <b-form>
              <b-form-group>
                <div class="add-img-user profile-img-edit">
                  <b-img class="profile-pic" fluid :src="require('../../assets/images/user/11.png')" alt="profile-pic" />
                  <div class="p-image">
                    <b-button href="javascript:void();" variant="none" class="upload-button iq-bg-primary">File Upload</b-button>
                    <b-form-file class="file-upload" accept="image/*" ></b-form-file>
                  </div>
                </div>
                <div class="img-extension mt-3">
                  <div class="d-inline-block align-items-center">
                    <span>Only</span>
                    <b-link href="javascript:void();">.jpg</b-link>
                    <b-link href="javascript:void();">.png</b-link>
                    <b-link href="javascript:void();">.jpeg</b-link>
                    <span>allowed</span>
                  </div>
                </div>
              </b-form-group>
              <b-form-group
                label="User Role:"
                label-for="selectuserrole"
              >
                <b-form-select plain v-model="selectedrole" :options="options1" id="selectuserrole">
                  <template v-slot:first>
                    <b-form-select-option :value="null">Select</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form-group>
              <b-form-group
                label="Facebook Url:"
                label-for="furl"
              >
                <b-form-input id="furl" name="furl" placeholder="Facebook Url"></b-form-input>
              </b-form-group>
              <b-form-group
                label="Twitter Url:"
                label-for="turl"
              >
                <b-form-input id="turl" name="turl" placeholder="Twitter Url"></b-form-input>
              </b-form-group>
              <b-form-group
                label="Instagram Url:"
                label-for="turl"
              >
                <b-form-input id="instaurl" name="instaurl" placeholder="Instagram Url"></b-form-input>
              </b-form-group>
              <b-form-group
                label="Linkedin Url:"
                label-for="lurl"
              >
                <b-form-input id="lurl" placeholder="Linkedin Url"></b-form-input>
              </b-form-group>
            </b-form>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="9">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">New User Information</h4>
          </template>
          <template v-slot:body>
            <div class="new-user-info">
              <b-form>
                <b-row>
                  <b-form-group class="col-md-6"
                    label="First Name:"
                    label-for="fname"
                  >
                    <b-form-input id="fname" name="fname" placeholder="First Name"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Last Name:"
                    label-for="lname"
                  >
                    <b-form-input id="lname" name="lname" placeholder="Last Name"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Street Address 1:"
                    label-for="add1"
                  >
                    <b-form-input type="text" name="add1" id="add1" placeholder="Street Address 1"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Street Address 2:"
                    label-for="add2"
                  >
                    <b-form-input type="text" name="add2" id="add2" placeholder="Street Address 2"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-12"
                    label="Company Name:"
                    label-for="cname"
                  >
                    <b-form-input type="text" name="cname" id="cname" placeholder="Company Name"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-sm-12"
                    label-for="selectcountry"
                    label="Country:">
                    <b-form-select plain v-model="selectedCountry" :options="options2" id="selectcountry">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Select Country</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Mobile Number:"
                    label-for="mobno"
                  >
                    <b-form-input type="text" name="mobno" id="mobno" placeholder="Mobile Number"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Alternate Contact:"
                    label-for="altconno"
                  >
                    <b-form-input type="text" name="altconno" id="altconno" placeholder="Alternate Contact"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Email:"
                    label-for="email"
                  >
                    <b-form-input type="text" name="email" id="email" placeholder="Email"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Pin Code:"
                    label-for="pno"
                  >
                    <b-form-input type="text" name="pno" id="pno" placeholder="Pin Code"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Town/City:"
                    label-for="city"
                  >
                    <b-form-input type="text" name="city" id="city" placeholder="Town/City"></b-form-input>
                  </b-form-group>
                </b-row>
                <hr>
                <h5 class="mb-3">Security</h5>
                <b-row>
                  <b-form-group class="col-md-12"
                    label="User Name:"
                    label-for="uname"
                  >
                    <b-form-input type="text" name="uname" id="uname" placeholder="User Name"></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6"
                    label="Password:"
                    label-for="pass"
                  >
                    <b-form-input type="text" name="pass" id="pass" placeholder="Password"></b-form-input>
                  </b-form-group>
                    <b-form-group class="col-md-6"
                    label="Repeat Password:"
                    label-for="rpass"
                  >
                    <b-form-input type="text" name="rpass" id="rpass" placeholder="Repeat Password"></b-form-input>
                  </b-form-group>
                </b-row>
                <div class="checkbox">
                  <label><input class="mr-2" type="checkbox">Enable Two-Factor-Authentication</label>
                </div>
                <b-button variant="primary" type="submit">Add New User</b-button>
              </b-form>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'AddUser',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      selectedrole: null,
      selectedCountry: null,
      options1: [
        { text: 'Web Designer', value: 'Web Designer' },
        { text: 'Web Developer', value: 'Web Developer' },
        { text: 'Tester', value: 'Tester' },
        { text: 'Php Developer', value: 'Php Developer' },
        { text: 'Ios Developer', value: 'Ios Developer' }
      ],
      options2: [
        { value: 'Canada', text: 'Canada' },
        { value: 'Niada', text: 'Niada' },
        { value: 'USA', text: 'USA' },
        { value: 'India', text: 'India' },
        { value: 'Africa', text: 'Africa' }
      ]
    }
  }
}
</script>
