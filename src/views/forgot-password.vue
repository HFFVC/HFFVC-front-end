<template>
  <div class="login">
    <video autoplay muted loop id="myVideo">
      <source src="../assets/images/background.mp4" type="video/mp4" />
    </video>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="content">
      <div v-on:keyup.enter="onEnter" class="content-container">
        <div class="logo-container">
          <h3 class="inter-head">HFFVC</h3>
          <!-- <img class="img-logo" alt="agriledger logo" src="../assets/images/logo.png" />
          <sup class="beta-login">(BETA)</sup> -->
          <h6 class="header-login">FORGOT PASSWORD</h6>
        </div>
        <div class="credetial-container">
          <input
            type="text"
            class="inp-user"
            v-model="username"
            placeholder="Email Address"
          />

          <div style="clear:both;"></div>
          <input
            v-on:click="sendPasswordReset"
            type="button"
            class="btn-login"
            value="Send Reset Link"
          />
        </div>
        <div class="col-md-12 powerby">
          <p>Powered By AgriLedger</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../router";
import firebase from "firebase";
import "../assets/css//main.css";
import axios from "axios";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import getConfigVars from '../shared/config-env';
Vue.use(VueToast);

export default {
  name: "login",

  data: function() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      seen: false
    };
  },
  methods: {
    onEnter: function(event) {
      this.sendPasswordReset();
    },

    sendPasswordReset: function(event) {
      this.seen = true;
      if (this.username == null || this.username == "") {
        this.seen = false;
        Vue.$toast.open({
          message: "Please enter the email address.",
          type: "error",
          position: "top"
        });
      } else {
        var actionCodeSettings = {
          url: `${getConfigVars().APP_URL}`,
          // iOS: {
          //   bundleId: 'com.example.ios'
          // },
          // android: {
          //   packageName: 'com.example.android',
          //   installApp: true,
          //   minimumVersion: '12'
          // },
          handleCodeInApp: true
        };
        firebase
          .auth()
          .sendPasswordResetEmail(this.username, actionCodeSettings)
          .then(() => {
            this.seen = false;
            Vue.$toast.open({
              message: "An email has been sent to your email ID.",
              type: "success",
              position: "top"
            });
          })
          .catch(error => {
            this.seen = false;
            Vue.$toast.open({
              message: error.message,
              type: "error",
              position: "top"
            });
          });
      }
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
.beta-login {
  font-size: 9px;
  color: #fff;
  float: left;
  margin-top: 54px;
  padding: 0px;
  position: relative;
  top: 1px;

  margin-left: -18px;
}
.header-login {
  color: #fff;
  float: right;
  padding: 15px;
  margin-top: 13px;
  font-weight: 100;
  font-size: 15px;
}
.lbl-error {
  color: red;
  font-size: 12px;
}
#myVideo {
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
}
.content {
  width: 100%;
  margin: auto;
  position: absolute;
  width: 100%;
  top: 20%;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0px;
}
.img-logo {
  width: 90px;
  height: auto;
  float: left;
  margin: 10px;
}
.logo-container {
  height: 73px;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 7px 7px 0px 0px;
  cursor: pointer;
}
.credetial-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 7px 7px;
}

.inp-user {
  width: 90%;
  margin: 15px;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
  background-image: url("../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 25px 25px;
  font-weight: 100;
}
.inp-password {
  width: 90%;
  margin: 15px;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
  background-image: url("../assets/images/key.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
}
.btn-login {
  margin: 15px;
  background: #92d050;
  color: #fff;
  border: none;
  padding: 5px 25px 5px 25px;
  width: 35%;
  margin-bottom: 30px !important;
  font-size: 13px;
  margin-top: 25px;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: aliceblue;
  opacity: 1; /* Firefox */
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: aliceblue;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  color: aliceblue;
}

.lbl-fp {
  margin: 10px 15px 15px 15px;
  color: aliceblue;
  font-size: 13px;
  float: right;
  font-weight: 100;
}
.lbl-remeber {
  color: aliceblue;
  font-size: 13px;
  position: relative;
  top: -11px;
  left: -20px;
  font-weight: 100;
}
.chk-container {
  display: inline;
  float: left !important;
  padding-right: 5px;
  padding: 10px;
  margin-left: 10px;
}
.inp-chk {
  margin-left: 5px;
  margin-right: 5px;
}
.main {
  display: block;
  position: relative;
  padding-left: 45px;
  margin-bottom: 15px;
  cursor: pointer;
  font-size: 20px;
}

/* Hide the default checkbox */
input[type="checkbox"] {
  visibility: hidden;
}

/* Creating a custom checkbox 
        based on demand */
.geekmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  border: 1px solid #000;
  background-color: #fff;
}

/* Specify the background color to be 
        shown when hovering over checkbox */
.main:hover input ~ .geekmark {
  background-color: #fff;
}

/* Specify the background color to be 
        shown when checkbox is active */
.main input:active ~ .geekmark {
  background-color: #fff;
}

/* Specify the background color to be 
        shown when checkbox is checked */
.main input:checked ~ .geekmark {
  background-color: #fff;
}

/* Checkmark to be shown in checkbox */
/* It is not be shown when not checked */
.geekmark:after {
  content: "";
  position: absolute;
  display: none;
}

/* Display checkmark when checked */
.main input:checked ~ .geekmark:after {
  display: block;
}

/* Styling the checkmark using webkit */
/* Rotated the rectangle by 45 degree and  
        showing only two border to make it look 
        like a tickmark */
.main .geekmark:after {
  left: 3px;
  bottom: 2px;
  width: 7px;
  height: 11px;
  border: solid #000;
  border-width: 0 4px 4px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.content-container {
  height: fit-content;
  margin: 0 auto;
  width: 400px;
}
input[type="text"],
input[type="password"],
textarea,
select {
  outline: none;
}
@media screen and (max-width: 1062px) and (min-width: 576px) {
  .lbl-fp {
    float: right;
    margin: 7px 0px 0px 0px;
    padding-right: 14px;
  }
}
@media screen and (max-width: 879px) and (min-width: 645px) {
  .lbl-fp {
    float: right !important;
    margin: 10px !important;
    padding-left: 14px !important;
  }
}
@media screen and (max-width: 480px) {
  .content-container {
    width: 300px !important;
  }
}
@media screen and (max-width: 394px) {
  .lbl-fp {
    float: right;
    margin: 9px 0px 0px 0px;
  }
}
@media screen and (max-width: 360px) {
  .lbl-fp {
    float: right;
    margin: 9px 0px 0px 0px;
    padding-right: 14px;
  }
}
@media screen and (max-width: 320px) {
  .lbl-fp {
    float: left;
  }
}
@media screen and (max-width: 394px) {
  .lbl-fp {
    float: left;
    margin-left: 22px;
  }
  .content {
    top: 30px;
  }
}
</style>
