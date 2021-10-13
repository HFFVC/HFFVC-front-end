<template>
  <div class="login">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="logo-container">
          <h3 class="inter-head">HFFVC</h3>
          <!-- <img class="img-logo" alt="agriledger logo" src="../../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup> -->
          <label class="header-title">NEW USER SIGN UP</label>
        </div>
        <div class="credetial-container">
          <div class="col-md-12">
            <div class="col-md-6 inp-container">
              <input
                placeholder="First Name"
                v-model="firstName"
                class="inp-details inp-firstname"
                type="text"
              />
            </div>
            <div class="col-md-6 inp-container">
              <input
                placeholder="Last Name"
                v-model="lastName"
                class="inp-details"
                type="text"
              />
            </div>
          </div>
          <div style="clear:both;"></div>
          <div class="col-md-12">
            <div class="col-md-12 inp-container email-container">
              <input
                placeholder="Email Address"
                v-model="emailId"
                class="inp-details inp-email"
                type="text"
              />
            </div>
            <div style="clear:both;"></div>
            <div class="col-md-12 signup-container">
              <label class="lbl-sign">
                Already have an account?
                <a class="ref-signin" @click="login">Sign in here</a>
              </label>
              <br />
            </div>
            <label class="lbl-error">{{ errorMessage }}</label>
            <label class="lbl-success">{{ successMessage }}</label>
            <br />
            <input
              type="button"
              @click="signup"
              class="btn-signup"
              value="Sign Up"
            />
            <br />
            <input
              type="button"
              @click="login"
              class="btn-cancel"
              value="Cancel"
            />
          </div>
        </div>
        <div class="col-md-12 powerby">
          <p>Powered By AgriLedger</p>
        </div>
      </div>
      <div class="col-md-3"></div>
    </div>
    <b-modal
      ref="success-modal"
      hide-footer
      title="Status"
      id="modal"
      hide-backdrop
    >
      <label class="lbl-modal-success">User created successfully</label>
      <img
        @click="hideModal"
        class="modal-close"
        src="../../assets/images/close.png"
      />
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import "../../assets/css/main.css";
import "../../assets/css/status-modal.css";
import BootstrapVue from "bootstrap-vue";
import axios from "axios";
Vue.use(BootstrapVue);

export default {
  name: "planner-signup",

  data: function() {
    return {
      firstName: "",
      lastName: "",
      emailId: "",
      errorMessage: "",
      successMessage: "",
      password: "",
      seen: false,
      userId: ""
    };
  },
  mounted() {},
  methods: {
    signup: function() {
      var dumpDtaa = {
        email: "broker@agriledger.com",
        firstName: "Broker",
        lastName: "Actor",
        roleDesc: "Receive Shipment and sell",
        function: "Broker",
        systemRole: 4
      };
      var dbRef = firebase
        .database()
        .ref()
        .child("profile")
        .child("Ww2dvl5QsBbRWkvKCN0lWSkJzBZ2");
      dbRef
        .set(dumpDtaa)
        .then(function(response) {
          alert("success");
        })
        .catch(function(error) {
          currentValue.erroMessage = error.message;
          currentValue.seen = false;
        });
      this.userId = "";
      this.password = this.generatePassword();
      var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
      if (this.firstName == null || this.firstName == "") {
        this.errorMessage = "Please enter first name.";
      } else if (this.lastName == null || this.lastName == "") {
        this.errorMessage = "Please enter last name.";
      } else if (this.emailId == null || this.emailId == "") {
        this.errorMessage = "Please enter email address.";
      } else if (!pattern.test(this.emailId)) {
        this.errorMessage = "Please enter valid email address.";
      } else {
        this.errorMessage = "";
        this.seen = true;
        var currentVal = this;
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.emailId, this.password)
          .then(function(response) {
            //create profile entry
            currentVal.userId = response.user.uid;
            currentVal.createProfile();
          })
          .catch(function(error) {
            currentVal.seen = false;
            currentVal.errorMessage = error.message;
          });
      }
    },
    createProfile: function() {
      var currentVal = this;
      var dbRef = firebase
        .database()
        .ref()
        .child("profile")
        .child(this.userId);
      var inpData = {
        firstName: currentVal.firstName,
        lastName: currentVal.lastName,
        email: currentVal.emailId,
        function: "",
        roleDesc: "",
        systemRole: ""
      };
      dbRef
        .set(inpData)
        .then(function(response) {
          currentVal.seen = false;
          currentVal.errorMessage = "";
          currentVal.$refs["success-modal"].show();
          setTimeout(function() {
            currentVal.$refs["success-modal"].hide();
          }, 5000);
        })
        .catch(function(error) {
          currentVal.erroMessage = error.message;
          currentVal.seen = false;
        });
    },
    hideModal: function() {
      this.$refs["success-modal"].hide();
    },
    generatePassword: function() {
      var passLength = 8;
      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < passLength; x++) {
        var randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
        pass += randomChar;
      }
      return pass;
    },
    login: function() {
      Router.push("/");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.powerby p {
  color: #fff !important;
  /* position: relative; */
  /* bottom: 2px;
  right: 19px; */
  font-size: 14px;
}
.inter-head {
  color: #fff;
  font-size: 39px;
  margin-top: 13px;
  float: left;
  margin-left: 14px;
  position: absolute;
}
.lbl-model-success {
  color: #fff;
}
.content-container {
  height: fit-content;
  margin: auto;
}
::-webkit-input-placeholder {
  /* Edge */
  color: #fff;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #fff;
}

::placeholder {
  color: #fff;
}
.btn-signup {
  background: #92d050;
  color: #fff;
  border: 0px;
  padding: 2px 35px 2px 35px;
  margin-bottom: 20px;
  font-size: 13px;
}
.ref-signin {
  cursor: pointer;
  text-decoration: underline !important;
}
.btn-cancel {
  background: transparent;
  color: #fff;
  font-size: 13px;
  padding: 2px 25px 2px 25px;
  border: 1px solid #000;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.3);
}
.email-container {
  padding: 0px;
  margin: 0px;
}
.signup-container {
  text-align: right;
  padding: 0px;
}
.lbl-sign {
  color: #fff;
  padding: 10px;
  font-size: 13px;
  margin-right: 19px;
}
.inp-container {
  float: left;
  display: inline;
  margin: 0px 0px 0px 0px;
  font-size: 13px;
}
.lbl-success {
  color: green;
  text-align: center;
}
.lbl-error {
  color: red;
  text-align: center;
}
.container-bg {
  position: absolute;
  background-image: url("../../assets/images/bg9.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
}
.inp-details {
  width: 90%;
  margin: 15px;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
}
.inp-firstname {
  background-image: url("../../assets/images/user.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-email {
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.content {
  margin: auto;
  position: absolute;
  width: 99%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 30px;
}
.img-logo {
  width: 90px;
  height: auto;
  float: left;
  margin: 10px;
}
.logo-container {
  height: 70px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 10px 10px 0px 0px;
  cursor: pointer;
}
.credetial-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px 0px 10px 10px;
}
.header-title {
  float: right;
  padding: 10px;
  color: #fff;
  margin-top: 15px;
  font-size: 13px;
}

input[type="text"],
input[type="password"],
textarea,
select {
  outline: none;
}
@media screen and (max-width: 365px) {
  .header-title {
    font-size: 13px;
    margin-top: 0px;
  }
  .img-logo {
    width: 80px;
  }
}
</style>
