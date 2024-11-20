<template>
  <b-container fluid>
    <b-row>
      <b-col lg="12" sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title">Validate Wizard</h4>
          </template>
          <template v-slot:body>
            <div class="stepwizard mt-4">
              <div class="stepwizard-row setup-panel">
                <div id="user" class="wizard-step active">
                  <b-button href="#user-detail" class="active" variant="none">
                    <i class="ri-lock-unlock-line text-primary"></i><span>User Detail</span>
                  </b-button>
                </div>
                <div id="document" class="wizard-step">
                  <a href="#document-detail" type="button" class="btn btn-default"  disabled="disabled">
                    <i class="ri-user-fill text-danger"></i><span>Document Detail</span>
                  </a>
                </div>
                <div id="bank" class="wizard-step">
                  <a href="#bank-detail" type="button" class="btn btn-default"  disabled="disabled">
                    <i class="ri-camera-fill text-success"></i><span>Bank Detail</span>
                  </a>
                </div>
                <div id="confirm" class="wizard-step">
                  <a href="#cpnfirm-data" type="button" class="btn btn-default"  disabled="disabled">
                    <i class="ri-check-fill text-warning"></i><span>Confirm</span>
                  </a>
                </div>
              </div>
            </div>
             <b-form role="form">
              <b-row class="setup-content" id="user-detail">
                <b-col sm="12">
                  <b-col md="12" class="p-0">
                    <h3 class="mb-4">User Information:</h3>
                    <b-row>
                      <b-form-group class="col-md-6"
                        label="First Name: *"
                        label-for="fname"
                      >
                        <b-form-input name="fname" maxlength="100" type="text" required placeholder="Enter First Name" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label="Last Name: *"
                        label-for="lname"
                      >
                        <b-form-input name="lname" maxlength="100" type="text" required placeholder="Enter Last Name" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label="User Name: *"
                        label-for="uname"
                      >
                        <b-form-input name="uname" type="text" required placeholder="Enter User Name" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="emailid"
                        label="Email Id: *"
                      >
                        <b-form-input type="email" required name="emailid" id="emailid" placeholder="Email ID" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="pwd"
                        label="Password: *"
                      >
                        <b-form-input type="password" required name="pwd" id="pwd" placeholder="Password" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="cpwd"
                        label="Confirm Password: *"
                      >
                        <b-form-input type="password" required name="cpwd" id="cpwd" placeholder="Confirm Password" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="cno"
                        label="Contact Number: *"
                      >
                        <b-form-input type="text" required name="cno" id="cno" placeholder="Contact Number" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="acno"
                        label="Alternate Contact Number: *"
                      >
                        <b-form-input type="text" required name="acno" id="acno" placeholder="Alternate Contact Number" />
                      </b-form-group>
                      <b-form-group class="col-md-12 mb-3"
                        label-for="address"
                        label="Address: *"
                      >
                        <b-form-textarea id="address" rows="5" required></b-form-textarea>
                      </b-form-group>
                    </b-row>
                    <b-button variant="primary" size="lg" class="nextBtn pull-right" type="button">Next</b-button>
                  </b-col>
                </b-col>
              </b-row>
              <b-row class="setup-content" id="document-detail">
                <b-col sm="12">
                  <b-col md="12" class="p-0">
                    <h3 class="mb-4">Document Details:</h3>
                    <b-row>
                      <b-form-group class="col-md-6"
                        label-for="cname"
                        label="Company Name: *"
                      >
                        <b-form-input type="text" required name="cname" id="cname" placeholder="Company Name" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="ccno"
                        label="Contact Number: *"
                      >
                        <b-form-input type="text" required name="ccno" id="ccno" placeholder="Contact Number" />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="url"
                        label="Company Url: *"
                      >
                        <b-form-input type="text" required name="url" id="url" placeholder="Company Url." />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="cemail"
                        label="Company Mail Id: *"
                      >
                        <b-form-input type="email" required name="cemail" id="cemail" placeholder="Company Mail Id." />
                      </b-form-group>
                      <b-form-group class="col-md-12"
                        label-for="cadd"
                        label="Company Address: *"
                      >
                        <b-form-textarea name="cadd" id="cadd" rows="5" required></b-form-textarea>
                      </b-form-group>
                    </b-row>
                    <b-button variant="primary" size="lg" class="nextBtn pull-right" type="button">Next</b-button>
                  </b-col>
                </b-col>
              </b-row>
              <b-row class="setup-content" id="bank-detail">
                <b-col sm="12">
                  <b-col md="12" class="p-0">
                    <h3 class="mb-4">Bank Details:</h3>
                    <b-row>
                      <b-form-group class="col-md-6"
                        label-for="panno"
                        label="Pan No: *"
                      >
                        <b-form-input type="text" required name="panno" id="panno" placeholder="Pan No." />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="accno"
                        label="Account No: *"
                      >
                        <b-form-input type="text" required name="accno" id="accno" placeholder="Account No." />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="accname"
                        label="Account Holder Name: *"
                      >
                        <b-form-input type="text" required name="accname" id="accname" placeholder="Account Holder Name." />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="ifsc"
                        label="IFSC Code: *"
                      >
                        <b-form-input type="text" required name="ifsc" id="ifsc" placeholder="IFSC Code." />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="bankname"
                        label="Bank Name: *"
                      >
                        <b-form-input type="text" required name="bankname" id="bankname" placeholder="Bank Name." />
                      </b-form-group>
                      <b-form-group class="col-md-6"
                        label-for="branch"
                        label="Bank Branch Name: *"
                      >
                        <b-form-input type="text" required name="branch" id="branch" placeholder="Bank Branch Name." />
                      </b-form-group>
                    </b-row>
                    <b-button variant="primary" size="lg" class="nextBtn pull-right" type="button">Next</b-button>
                  </b-col>
                </b-col>
              </b-row>
              <b-row class="setup-content" id="cpnfirm-data">
                <b-col sm="12">
                  <b-col md="12" class="p-0">
                    <h3 class="mb-4 text-left">Finish:</h3>
                    <b-row class="justify-content-center">
                      <b-col cols="3">
                        <b-img :src="require('../../assets/images/page-img/img-success.png')" class="fit-image" />
                      </b-col>
                    </b-row>
                  </b-col>
                </b-col>
              </b-row>
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
  name: 'WizardValidate',
  mounted () {
    sofbox.index()
  }
}
</script>
