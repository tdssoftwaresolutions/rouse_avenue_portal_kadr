<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12">
        <iq-card body-class="p-0">
          <template v-slot:body>
            <div class="iq-edit-list">
              <tab-nav :pills="true" class="iq-edit-profile d-flex">
                <tab-nav-items class="col-md-3 p-0" :active="true" href="#personal-information" title="Personal Information" />
                <tab-nav-items class="col-md-3 p-0" :active="false" href="#chang-pwd" title=" Change Password" />
                <tab-nav-items class="col-md-3 p-0" :active="false" href="#emailandsms" title="Email and SMS" />
                <tab-nav-items class="col-md-3 p-0" :active="false" href="#manage-contact" title="Manage Contact" />
              </tab-nav>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col lg="12">
        <div class="iq-edit-list-data">
          <tab-content id="pills-tabContent-2">
            <tab-content-item :active="true" id="personal-information" >
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Personal Information</h4>
                </template>
                <template v-slot:body>
                  <b-form>
                    <b-form-group class="row align-items-center">
                      <b-col md="12">
                        <div class="profile-img-edit">
                          <b-img :src="require('../../assets/images/user/11.png')" class="profile-pic" alt="profile-pic"/>
                           <div class="p-image">
                              <i class="ri-pencil-line upload-button"></i>
                              <b-form-file
                                class="file-upload"
                                accept="image/*"
                              ></b-form-file>
                            </div>
                        </div>
                      </b-col>
                    </b-form-group>
                    <b-row align-v="center">
                      <b-form-group class="col-sm-6"
                        label="First Name:"
                        label-for="fname"
                      >
                        <b-form-input id="fname" placeholder="Nik"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label="Last Name:"
                        label-for="lname"
                      >
                        <b-form-input id="lname" placeholder="Jhon"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label="User Name:"
                        label-for="uname"
                      >
                        <b-form-input id="uname" placeholder="Nik@01"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label="City:"
                        label-for="cname"
                      >
                        <b-form-input id="cname" placeholder="Atlanta"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label="Gender:"
                        label-class="d-block"
                      >
                        <b-form-radio inline v-model="radio1" name="customRadio1">Male</b-form-radio>
                        <b-form-radio inline v-model="radio2" name="customRadio1">Female</b-form-radio>
                      </b-form-group>
                       <b-form-group class="col-sm-6"
                        label="Date Of Birth:"
                        label-for="dob"
                      >
                        <b-form-input type="date" id="dob" value="1984-01-24"></b-form-input>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label-for="exampleFormControlSelect1"
                        label="Marital Status:">
                        <b-form-select plain v-model="selectedStatus" :options="options1" id="exampleFormControlSelect1">
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label-for="exampleFormControlSelect2"
                        label="Age:">
                        <b-form-select plain v-model="selectedAge" :options="options2" id="exampleFormControlSelect2">
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label-for="exampleFormControlSelect3"
                        label="Country:">
                        <b-form-select plain v-model="selectedCountry" :options="options3" id="exampleFormControlSelect3">
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-sm-6"
                        label-for="exampleFormControlSelect4"
                        label="State:">
                        <b-form-select plain v-model="selectedState" :options="options4" id="exampleFormControlSelect4">
                        </b-form-select>
                      </b-form-group>
                      <b-form-group class="col-sm-12"
                        label="Address:">
                        <b-form-textarea name="address" style="line-height: 22px;" rows="5" value="37 Cardinal Lane
Petersburg, VA 23803
United States of America
Zip Code: 85001">
                        </b-form-textarea>
                      </b-form-group>
                    </b-row>
                    <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
                    <b-button type="reset" variant="none" class="iq-bg-danger">Cancle</b-button>
                  </b-form>
                </template>
              </iq-card>
            </tab-content-item>
            <tab-content-item :active="false" id="chang-pwd">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Change Password</h4>
                </template>
                <template v-slot:body>
                  <b-form>
                    <b-form-group>
                      <label for="cpass">Current Password:</label>
                      <b-link href="javascripe:void();" class="float-right">Forgot Password</b-link>
                      <b-form-input type="password" id="cpass"></b-form-input>
                    </b-form-group>
                    <b-form-group>
                      <label for="npass">New Password:</label>
                      <b-form-input type="password" id="npass"></b-form-input>
                    </b-form-group>
                    <b-form-group>
                      <label for="vpass">Verify Password:</label>
                      <b-form-input type="password" id="vpass"></b-form-input>
                    </b-form-group>
                    <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
                    <b-button type="reset" variant="none" class="iq-bg-danger">Cancle</b-button>
                  </b-form>
                </template>
              </iq-card>
            </tab-content-item>
            <tab-content-item :active="false" id="emailandsms">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Email and SMS</h4>
                </template>
                <template v-slot:body>
                  <b-form>
                    <div class="form-group row align-items-center">
                      <label class="col-md-3" for="emailnotification">Email Notification:</label>
                      <div class="col-md-9 custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="emailnotification" checked="">
                        <label class="custom-control-label" for="emailnotification"></label>
                    </div>
                      </div>
                      <div class="form-group row align-items-center">
                        <label class="col-md-3" for="smsnotification">SMS Notification:</label>
                        <div class="col-md-9 custom-control custom-switch">
                          <input type="checkbox" class="custom-control-input" id="smsnotification" checked="">
                          <label class="custom-control-label" for="smsnotification"></label>
                        </div>
                      </div>
                      <div class="form-group row align-items-center">
                        <label class="col-md-3" for="npass">When To Email</label>
                        <div class="col-md-9">
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="email01">
                            <label class="custom-control-label" for="email01">You have new notifications.</label>
                          </div>
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="email02">
                            <label class="custom-control-label" for="email02">You're sent a direct message</label>
                          </div>
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="email03" checked="">
                            <label class="custom-control-label" for="email03">Someone adds you as a connection</label>
                          </div>
                        </div>
                      </div>
                      <div class="form-group row align-items-center">
                        <label class="col-md-3" for="npass">When To Escalate Emails</label>
                        <div class="col-md-9">
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="email04">
                            <label class="custom-control-label" for="email04"> Upon new order.</label>
                          </div>
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="email05">
                            <label class="custom-control-label" for="email05"> New membership approval</label>
                          </div>
                          <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="email06" checked="">
                            <label class="custom-control-label" for="email06"> Member registration</label>
                          </div>
                        </div>
                      </div>
                    <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
                    <b-button type="reset" variant="none" class="iq-bg-danger">Cancle</b-button>
                  </b-form>
                </template>
              </iq-card>
            </tab-content-item>
            <tab-content-item :active="false" id="manage-contact">
              <iq-card>
                <template v-slot:headerTitle>
                  <h4 class="card-title">Manage Contact</h4>
                </template>
                <template v-slot:body>
                  <b-form>
                    <b-form-group>
                      <label for="cno">Contact Number:</label>
                      <b-form-input type="text" id="cno" value="001 2536 123 458"></b-form-input>
                    </b-form-group>
                    <b-form-group>
                      <label for="email">Email:</label>
                      <b-form-input type="text" id="email"  value="nikjone@demo.com"></b-form-input>
                    </b-form-group>
                    <b-form-group>
                      <label for="vpass">Url:</label>
                      <b-form-input type="text" id="url" value="https://getbootstrap.com"></b-form-input>
                    </b-form-group>
                    <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
                    <b-button type="reset" variant="none" class="iq-bg-danger">Cancle</b-button>
                  </b-form>
                </template>
              </iq-card>
            </tab-content-item>
          </tab-content>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'ProfileEdit',
  mounted () {
    sofbox.index()
  },
  data () {
    return {
      radio1: true,
      radio2: null,
      selectedStatus: 'Single',
      selectedAge: '33-45',
      selectedCountry: 'USA',
      selectedState: 'Georgia',
      options1: [
        { value: 'Single', text: 'Single' },
        { value: 'Married', text: 'Married' },
        { value: 'Widowed', text: 'Widowed' },
        { value: 'Divorced', text: 'Divorced' },
        { value: 'Separated', text: 'Separated' }
      ],
      options2: [
        { value: '12-18', text: '12-18' },
        { value: '19-32', text: '19-32' },
        { value: '33-45', text: '33-45' },
        { value: '46-62', text: '46-62' },
        { value: '63 >', text: '60 >' }
      ],
      options3: [
        { value: 'Canada', text: 'Canada' },
        { value: 'Niada', text: 'Niada' },
        { value: 'USA', text: 'USA' },
        { value: 'India', text: 'India' },
        { value: 'Africa', text: 'Africa' }
      ],
      options4: [
        { value: 'California', text: 'California' },
        { value: 'Florida', text: 'Florida' },
        { value: 'Georgia', text: 'Georgia' },
        { value: 'Connecticut', text: 'Connecticut' },
        { value: 'Louisiana', text: 'Louisiana' }
      ]
    }
  }
}
</script>
