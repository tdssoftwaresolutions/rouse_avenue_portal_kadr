<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12" sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Simple Wizard</h4>
          </template>
          <template v-slot:body>
            <b-form id="form-wizard1" class="text-center mt-4">
              <ul id="top-tab-list" class="p-0">
                <li class="active" id="account">
                  <b-link href="javascript:void();">
                      <i class="ri-lock-unlock-line"></i><span>Account</span>
                  </b-link>
                </li>
                <li id="personal">
                  <b-link href="javascript:void();">
                    <i class="ri-user-fill"></i><span>Personal</span>
                  </b-link>
                </li>
                <li id="payment">
                  <b-link href="javascript:void();">
                    <i class="ri-camera-fill"></i><span>Image</span>
                  </b-link>
                </li>
                <li id="confirm">
                  <b-link href="javascript:void();">
                    <i class="ri-check-fill"></i><span>Finish</span>
                  </b-link>
                </li>
              </ul>
              <fieldset>
                <div class="form-card text-left">
                  <b-row>
                    <b-col cols="7">
                      <h3 class="mb-4">Account Information:</h3>
                    </b-col>
                    <b-col cols="5">
                      <h2 class="steps">Step 1 - 4</h2>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col md="6">
                      <b-form-group
                        label="Email: *"
                        label-for="email"
                      >
                        <b-form-input name="email" type="email" placeholder="Email Id" />
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Username: *"
                        label-for="uname"
                      >
                        <b-form-input name="uname" type="text" id="uname" placeholder="User Name" />
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Password: *"
                        label-for="pwd"
                      >
                        <b-form-input type="password" name="pwd" id="pwd" placeholder="Password" />
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group
                        label="Confirm Password: *"
                        label-for="cpwd"
                      >
                        <b-form-input type="password" name="cpwd" id="cpwd" placeholder="Confirm Password" />
                      </b-form-group>
                    </b-col>
                  </b-row>
                </div>
              <b-button name="next" variant="primary" class="next action-button float-right" value="Next">Next</b-button>
              </fieldset>
              <fieldset>
                <div class="form-card text-left">
                  <b-row>
                    <b-col cols="7">
                      <h3 class="mb-4">Personal Information:</h3>
                    </b-col>
                    <b-col cols="5">
                      <h2 class="steps">Step 2 - 4</h2>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-form-group class="col-md-6"
                      label="First Name: *"
                      label-for="fname"
                    >
                      <b-form-input id="fname" name="fname" placeholder="First Name"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                      label="Last Name: *"
                      label-for="lname"
                    >
                      <b-form-input id="lname" name="lname" placeholder="Last Name"></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                      label="Contact No.: *"
                      label-for="phno"
                    >
                      <b-form-input type="text" name="phno" id="phno" placeholder="Contact No."></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                      label="Alternate Contact No.: *"
                      label-for="phno_2"
                    >
                      <b-form-input type="text" name="phno_2" id="phno_2" placeholder="Alternate Contact No."></b-form-input>
                    </b-form-group>
                  </b-row>
                </div>
                <b-button name="next" variant="primary" class="next action-button float-right" value="Next">Next</b-button>
                <b-button name="previous" variant="dark" class="previous action-button-previous float-right mr-3" value="Previous">Previous</b-button>
              </fieldset>
              <fieldset>
                <div class="form-card text-left">
                  <b-row>
                    <b-col cols="7">
                      <h3 class="mb-4">Image Upload:</h3>
                    </b-col>
                    <b-col cols="5">
                      <h2 class="steps">Step 3 - 4</h2>
                    </b-col>
                  </b-row>
                  <b-form-group
                    label-for="pic"
                    label="Upload Your Photo:"
                  >
                    <b-form-file plain class="form-control" name="pic" id="pic" accept="image/*"></b-form-file>
                  </b-form-group>
                  <b-form-group
                    label-for="pic-2"
                    label="Upload Signature Photo:"
                  >
                    <b-form-file plain class="form-control" name="pic-2" id="pic-2" accept="image/*" ></b-form-file>
                  </b-form-group>
                </div>
                <b-button name="next" variant="primary" class="next action-button float-right" value="Next">Next</b-button>
                <b-button name="previous" variant="dark" class="previous action-button-previous float-right mr-3" value="Previous">Previous</b-button>
              </fieldset>
              <fieldset>
                <div class="form-card text-left">
                  <b-row>
                    <b-col cols="7">
                      <h3 class="mb-4">Finish:</h3>
                    </b-col>
                    <b-col cols="5">
                      <h2 class="steps">Step 4 - 4</h2>
                    </b-col>
                  </b-row><br><br>
                  <h2 class="text-success text-center"><strong>SUCCESS !</strong></h2><br>
                  <b-row class="justify-content-center">
                    <b-col cols="3">
                      <b-img :src="require('../../assets/images/page-img/img-success.png')" class="fit-image" />
                    </b-col>
                  </b-row><br><br>
                  <b-row class="justify-content-center">
                    <b-col cols="7" class="text-center">
                      <h5 class="purple-text text-center">You Have Successfully Signed Up</h5>
                    </b-col>
                  </b-row>
                </div>
              </fieldset>
            </b-form>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'SimpleWizard',
  mounted () {
    sofbox.index()
  }
}
</script>
