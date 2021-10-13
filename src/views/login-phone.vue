<template>
  <div class="login">
    <video autoplay muted loop id="myVideo">
      <source src="../assets/images/background.mp4" type="video/mp4" />
    </video>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="content">
   <div>
    <h2>SignUp</h2>
    +91<input type="number" v-model="phNo" placeholder="Phone Number"/>
    <button id="sign-in-button" @click="sendOtp">Get OTP</button>
    <div id="recaptcha-container"></div><br>
    <input type="number" v-model="otp" placeholder="OTP"/>
    <button @click="verifyOtp">Verify</button><br>
    <button @click="sendOtp()">Resend OTP</button>
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
import getConfigVars from "../shared/config-env";
Vue.use(VueToast);

export default {
  name: "login",

  data: function () {
    return {
     phNo: '',
        appVerifier : '',
        otp : '',
        seen:false
    };
  },
  mounted() {

  },
  methods: {
 sendOtp(){
        if(this.phNo.length != 10){
          alert('Invalid Phone Number Format !');
        }else{
          //
          let countryCode = '+91' //india
          let phoneNumber = countryCode + this.phNo
          //
          let appVerifier = this.appVerifier
          //
          firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
              // SMS sent. Prompt user to type the code from the message, then sign the
              // user in with confirmationResult.confirm(code).
              window.confirmationResult = confirmationResult;
              //
              alert('SMS sent')
            }).catch(function (error) {
            // Error; SMS not sent
            // ...
            alert('Error ! SMS not sent')
          });
        }
      },
      //
      verifyOtp(){
        if(this.phNo.length != 10 || this.otp.length != 6){
          alert('Invalid Phone Number/OTP Format !');
        }else{
          //
          let vm = this
          let code = this.otp
          //
          window.confirmationResult.confirm(code).then(function (result) {
            // User signed in successfully.
            var user = result.user;
            console.log(user);
             firebase
              .auth()
              .currentUser.getIdToken(true)
              .then((idtoken) => {
                console.log(idtoken);
               // localStorage.IDtoken = idtoken;
               // console.log(localStorage.IDtoken);
              });
            // ...
            //route to set password !
            //vm.$router.push({path:'/setPassword'})
          }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            // ...
          });
        }
      },
      initReCaptcha(){
        setTimeout(()=>{
          let vm = this
          window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': function(response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            'expired-callback': function() {
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            }
          });
          //
          this.appVerifier =  window.recaptchaVerifier
        },1000)
      }
    },
    created(){
      this.initReCaptcha()
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- https://github.com/devatquarxss/phone-password-authentication-firebase/blob/master/src/components/signup.vue-->