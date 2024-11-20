<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12" sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Vertical Wizard</h4>
          </template>
          <template v-slot:body>
            <b-row>
              <b-col md="3">
                <ul id="top-tabbar-vertical" class="p-0">
                  <li class="active" id="personal">
                    <b-link href="javascript:void();"><i class="ri-lock-unlock-line text-primary"></i><span>Personal</span></b-link>
                  </li>
                  <li id="contact">
                    <b-link href="javascript:void();"><i class="ri-user-fill text-danger"></i><span>Contact</span></b-link>
                  </li>
                  <li id="official">
                    <b-link href="javascript:void();"><i class="ri-camera-fill text-success"></i><span>Official</span></b-link>
                  </li>
                  <li id="payment">
                    <b-link href="javascript:void();"><i class="ri-check-fill text-warning"></i><span>Payment</span></b-link>
                  </li>
                </ul>
              </b-col>
              <b-col md="9">
                <b-form id="form-wizard3" class="text-center">
                  <fieldset>
                    <div class="form-card text-left">
                      <b-row>
                        <b-col cols="12">
                          <h3 class="mb-4">User Information:</h3>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col md="12">
                          <b-form-group
                            label-for="fname"
                            label="First Name: *"
                          >
                            <b-form-input type="text" name="fname" id="fname" placeholder="First Name" required />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="lname"
                            label="Last Name: *"
                          >
                            <b-form-input type="text" name="lname" id="lname" placeholder="Last Name" />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group label="Gender: *" label-for="gender" >
                            <b-form-radio inline name="customRadio">Male</b-form-radio>
                            <b-form-radio inline name="customRadio">Female</b-form-radio>
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label="Date Of Birth: *"
                            label-for="dob"
                          >
                            <b-form-input type="date" id="dob" name="dob" ></b-form-input>
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </div>
                    <b-button name="next" id="submit" variant="primary" class="next action-button float-right" value="Next">Next</b-button>
                  </fieldset>
                  <fieldset>
                    <div class="form-card text-left">
                      <b-row>
                        <b-col cols="12">
                          <h3 class="mb-4">Contact Information:</h3>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col md="12">
                          <b-form-group
                            label-for="email"
                            label="Email Id: *"
                          >
                            <b-form-input type="email" name="email" id="email" placeholder="Email Id" />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="ccno"
                            label="Contact Number: *"
                          >
                            <b-form-input type="text" name="ccno" id="ccno" placeholder="Contact Number" />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="city"
                            label="City: *"
                          >
                            <b-form-input type="text" name="city" id="city" placeholder="City" />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="state"
                            label="State: *"
                          >
                            <b-form-input type="text" name="state" id="state" placeholder="State" />
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </div>
                    <b-button name="next" variant="primary" class="next action-button float-right" value="Next">Next</b-button>
                    <b-button name="previous" variant="dark" class="previous action-button-previous float-right mr-3" value="Previous">Previous</b-button>
                  </fieldset>
                  <fieldset>
                    <div class="form-card text-left">
                      <b-row>
                        <b-col cols="12">
                          <h3 class="mb-4">Official Information:</h3>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col md="12">
                          <b-form-group
                            label-for="empid"
                            label="Employee Id: *"
                          >
                            <b-form-input type="email" name="empid" id="empid" placeholder="Employee Id." />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="desg"
                            label="Designation: *"
                          >
                            <b-form-input type="text" name="desg" id="desg" placeholder="Designation." />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="deptname"
                            label="Department Name: *"
                          >
                            <b-form-input type="text" name="deptname" id="deptname" placeholder="Department Name." />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="workhour"
                            label="Working Hour: *"
                          >
                            <b-form-input type="text" name="workhour" id="workhour" placeholder="Working Hour." />
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </div>
                    <b-button name="next" variant="primary" class="next action-button float-right" value="Next">Next</b-button>
                    <b-button name="previous" variant="dark" class="previous action-button-previous float-right mr-3" value="Previous">Previous</b-button>
                  </fieldset>
                  <fieldset>
                    <div class="form-card text-left">
                      <b-row>
                        <b-col cols="12">
                          <h3 class="mb-4 text-left">Payment:</h3>
                        </b-col>
                      </b-row>
                      <b-row>
                        <b-col md="12">
                          <b-form-group
                            label-for="panno" label="Pan No: *">
                            <b-form-input type="text" name="panno" id="panno" placeholder="Pan No." />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="accno" label="Account No: *">
                            <b-form-input type="text" name="accno" id="accno" placeholder="Account No." />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="accname" label="Account Holder Name: *">
                            <b-form-input type="text" name="accname" id="accname" placeholder="Account Holder Name." />
                          </b-form-group>
                        </b-col>
                        <b-col md="12">
                          <b-form-group
                            label-for="ifsc" label="IFSC Code: *">
                            <b-form-input type="text" name="ifsc" id="ifsc" placeholder="IFSC Code." />
                          </b-form-group>
                        </b-col>
                      </b-row>
                    </div>
                    <b-button name="next" variant="primary" href="form-wizard-vertical" class="next action-button float-right" type="submit" value="Submit">Submit</b-button>
                    <b-button name="previous" variant="dark" class="previous action-button-previous float-right mr-3" value="Previous">Previous</b-button>
                  </fieldset>
                </b-form>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { sofbox } from '../../config/pluginInit'
export default {
  name: 'VerticalWizard',
  mounted () {
    sofbox.index()
  }
}
</script>
