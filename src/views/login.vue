<template>
  <div class="login">
    <video autoplay muted loop id="myVideo">
      <source src="../assets/images/background.mp4" type="video/mp4" />
    </video>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="content">
      <div v-on:keyup.enter="onEnter" class="content-container">
        <div class="logo-container">
          <!-- <img class="img-logo" alt="agriledger logo" src="../assets/images/logo.png" />
          <sup class="beta-login">(BETA)</sup>-->
          <h3 class="main-head">HFFVC</h3>
          <h6 class="header-login">LOGIN</h6>
        </div>
        <div class="credetial-container">
          <input
            type="text"
            class="inp-user"
            v-model="username"
            placeholder="Email Address / Phone Number with Country Code"
            v-on:keyup="checkLoginMode"
          />

          <input
            type="password"
            class="inp-password"
            v-model="password"
            placeholder="Password"
            v-if="isEmailId"
          />

          <input
            type="password"
            class="inp-password"
            v-model="otp"
            placeholder="*  *  *  *  *  *"
            v-if="isMobileNumber && isOTPSent"
          />

          <label v-if="!isMobileNumber && !isEmailId" class="lbl-error">{{
            errorMessage
          }}</label>

          <!-- <div class="chk-container">
            <label class="main">
              <label class="lbl-remeber">Remember Me</label>
              <input type="checkbox" class="inp-chk" value="Remember Me" />
              <span class="geekmark"></span>
            </label>
          </div>-->
          <a class="lbl-fp" v-on:click="forgotRedirection" v-if="isEmailId"
            >Forgot Password?</a
          >
          <br />
          <div style="clear: both"></div>
          <input
            v-on:click="login"
            type="button"
            class="btn-login"
            value="Login"
            v-if="isEmailId"
          />
          <div style="clear: both"></div>
          <input
            v-on:click="sendOtp"
            type="button"
            class="btn-login"
            value="Get OTP"
            v-if="isMobileNumber && !isOTPSent"
          />
          <div style="clear: both"></div>
          <div class="row">
            <div class="col-md-6">
              <input
                v-on:click="sendOtp"
                type="button"
                class="phone-login"
                :class="
                  isMobileNumber && isOTPSent
                    ? 'dark-green-background'
                    : 'phone-login'
                "
                :value="getOtpBTnText"
                v-if="isMobileNumber && isOTPSent"
              />
            </div>

            <div class="col-md-6">
              <input
                v-on:click="verifyOtp"
                type="button"
                class="phone-login"
                value="Verify OTP"
                v-if="isOTPSent"
              />
            </div>
          </div>
        </div>
        <div class="col-md-12 powerby">
          <p>Powered By AgriLedger</p>
        </div>
      </div>
      <div id="recaptcha-container"></div>
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
import isAuthenticated from "../shared/auth";
Vue.use(VueToast);

export default {
  name: "login",

  data: function () {
    return {
      username: "",
      password: "",
      errorMessage: "",
      seen: false,
      producerList: [],
      IDtoken: "",
      isMultipleRole: false,
      isMobileNumber: false,
      isEmailId: false,
      appVerifier: "",
      otp: null,
      newUserData: null,
      isOTPSent: false,
      getOtpBTnText: this.$t("Get OTP", "Get OTP"),
    };
  },
  mounted() {
    if (isAuthenticated()) {
      this.clearIndexedDB()
        .then(() => {
          if (localStorage.systemRole == 2) {
            Router.push("lsp-dashboard");
          } else if (localStorage.systemRole == 1) {
            Router.push("dashboard");
          } else if (localStorage.systemRole == 3) {
            Router.push("collector-dashboard");
          } else if (localStorage.systemRole == 99) {
            Router.push("sa-dashboard");
          } else if (
            localStorage.systemRole == 4 ||
            localStorage.systemRole == 5
          ) {
            Router.push("broker-dashboard");
          } else if (localStorage.systemRole == 8) {
            Router.push("payment-history");
          } else if (localStorage.systemRole == 6) {
            Router.push("tpa-dashboard");
          } else if (localStorage.systemRole == 9) {
            Router.push("admin-dashboard");
          } else if (localStorage.systemRole == 13) {
            Router.push("observer-dashboard");
          } else if (localStorage.systemRole == 7) {
            Router.push("op-admin-dashboard");
          } else if (localStorage.systemRole == 10) {
            Router.push("observer-mci-dashboard");
          } else if (localStorage.systemRole == 89) {
            Router.push("auditor");
          } else {
            Router.push("dashboard");
          }
        })
        .catch(() => {
          console.log("error deleting indexedDB");
        });
    }
  },
  methods: {
    clearIndexedDB() {
      let indexedDbList = [
        "pickups_db_arrivedatpackhouse",
        "pickups_db_enrouteproducer",
        "pickups_db_withproducer",
        "pickups_db_enroutepackhouse",
        "pickupsList_db_banks",
        "pickupsList_db_ngo",
        "pickupsList_db_packhouse",
        "pickupsList_db_currencyRate",
        "pickupsList_db_unitCost",
      ];

      return new Promise((resolve, reject) => {
        if (!navigator.onLine) {
          resolve();
        } else {
          indexedDbList.forEach((dbname, index) => {
            let request = indexedDB.deleteDatabase(dbname);
            request.onsuccess = function () {
              if (index + 1 == indexedDbList.length) {
                resolve(`Finished deleting Databases.`);
              }
            };
            request.onerror = function () {
              if (index + 1 == indexedDbList.length) {
                resolve(`Finished deleting Databases.`);
              }
            };
            request.onblocked = function () {
              if (index + 1 == indexedDbList.length) {
                resolve(`Finished deleting Databases.`);
              }
            };
          });
        }
      });
    },
    onEnter: function (event) {
      if (this.isMobileNumber) {
        if (this.isValidPhonenumber(this.username)) {
          this.sendOtp();
        } else {
          Vue.$toast.open({
            message: this.$t("Invalid phone number.", "Invalid phone number."),
            position: "top",
            type: "error",
          });
          this.seen = false;
        }
      } else {
        this.login();
      }
    },
    forgotRedirection: function () {
      Router.push("forgot-password");
    },
    login: function (event) {
      this.seen = true;
      const vm = this;
      //push producerData to local Storage
      if (this.username == null || this.username == "") {
        this.seen = false;
        Vue.$toast.open({
          message: "Please enter the email address.",
          type: "error",
          position: "top",
        });
      } else if (this.password == null || this.password == "") {
        this.seen = false;
        const vm = this;
        Vue.$toast.open({
          message: "Please enter the password.",
          type: "error",
          position: "top",
        });
      } else {
        this.clearIndexedDB()
          .then(() => {
            var currentval = this;
            var systemRoles = null;
            firebase
              .auth()
              .signInWithEmailAndPassword(this.username.trim(), this.password)
              .then(function (response) {
                localStorage.emailId = response.user.email;
                firebase
                  .auth()
                  .currentUser.getIdToken(true)
                  .then((idtoken) => {
                    console.log(idtoken);
                    localStorage.IDtoken = idtoken;
                    console.log(localStorage.IDtoken);
                  });
                //  vm.getUserOrganization(vm.username.trim());

                var ref = firebase
                  .database()
                  .ref()
                  .child("profile")
                  .child(response.user.uid);
                ref.on("value", function (snapshot) {
                  console.log(snapshot.val());
                  if (snapshot.val() == null) {
                    currentval.username = null;
                    currentval.password = null;
                    currentval.seen = false;
                    Vue.$toast.open({
                      message: "Your profile not found.",
                      type: "error",
                      position: "top",
                    });
                    localStorage.emailId = null;
                    localStorage.IDtoken = null;
                    Router.push("/");
                    return false;
                  }
                  if (snapshot.val().status == "Disabled") {
                    currentval.seen = false;
                    Vue.$toast.open({
                      message: "Your account has been disabled by the admin.",
                      type: "error",
                      position: "top",
                    });
                    localStorage.emailId = null;
                    localStorage.IDtoken = null;
                    Router.push("/");
                    return false;
                  }
                  if (
                    snapshot.val().systemRole == undefined ||
                    snapshot.val().systemRole == null ||
                    snapshot.val().systemRole == ""
                  ) {
                    currentval.systemRoles = snapshot
                      .val()
                      .userRoles.map(function (val) {
                        return val.systemRole;
                      })
                      .join(",");
                    if (currentval.systemRoles.split(",").length > 1) {
                      currentval.isMultipleRole = true;
                    } else {
                      currentval.isMultipleRole = false;
                    }
                  } else {
                    currentval.isMultipleRole = false;
                    currentval.systemRoles = snapshot
                      .val()
                      .systemRole.toString();
                  }
                  localStorage.userName =
                    snapshot.val().firstName + " " + snapshot.val().lastName;
                  localStorage.systemRole = currentval.systemRoles;

                  if (localStorage.systemRole == 99) {
                    localStorage.organizationKey = snapshot.val().email.trim();
                    localStorage.organization = snapshot.val().email.trim();
                  } else {
                    localStorage.organizationKey = snapshot.val().organizationKey;
                    localStorage.organization = snapshot.val().organization;
                  }
                  if (currentval.isMultipleRole) {
                    Router.push("multi-user-dashboard");
                  } else {
                    if (currentval.systemRoles == 96) {
                      Router.push("lsp-dashboard");
                    } else if (currentval.systemRoles == 97) {
                      Router.push("broker-dashboard");
                    } else if (currentval.systemRoles == 2) {
                      Router.push("pack-house-incharge-dashboard");
                    } else if (currentval.systemRoles == 1) {
                      Router.push("dashboard");
                    } else if (currentval.systemRoles == 3) {
                      Router.push("collector-dashboard");
                    } else if (currentval.systemRoles == 99) {
                      Router.push("sa-dashboard");
                    } else if (
                      currentval.systemRoles == 4 ||
                      currentval.systemRoles == 5
                    ) {
                      Router.push("broker-dashboard");
                    } else if (currentval.systemRoles == 8) {
                      Router.push("payment-history");
                    } else if (currentval.systemRoles == 6) {
                      Router.push("tpa-dashboard");
                    } else if (currentval.systemRoles == 9) {
                      Router.push("admin-dashboard");
                    } else if (currentval.systemRoles == 13) {
                      Router.push("observer-dashboard");
                    } else if (currentval.systemRoles == 7) {
                      Router.push("op-admin-dashboard");
                    } else if (currentval.systemRoles == 10) {
                      Router.push("observer-mci-dashboard");
                    } else if (currentval.systemRoles == 91) {
                      Router.push("dashboard");
                    } else if (currentval.systemRoles == 89) {
                      Router.push("auditor");
                    } else {
                      Router.push("dashboard");
                    }
                  }
                });
              })
              .catch(function (error) {
                currentval.seen = false;
                Vue.$toast.open({
                  message: error.message,
                  type: "error",
                  position: "top",
                });
              });
          })
          .catch((error) => {
            console.log("error:" + error);
          });
      }
    },
    checkLoginMode() {
      const vm = this;
      let phoneNumber = vm.username;
      if (!phoneNumber.includes("+")) {
        phoneNumber = "+" + phoneNumber;
      }

      if (vm.isValidPhonenumber(phoneNumber)) {
        console.log("valid mobile number");
        vm.isMobileNumber = true;
        vm.isEmailId = false;
      } else if (vm.isValidEmailId(vm.username)) {
        vm.isEmailId = true;
        vm.isMobileNumber = false;
        console.log("valid email id");
      } else {
        vm.username.length > 3
          ? (vm.errorMessage = "Please enter a valid email id or phone number.")
          : null;
      }
    },
    isValidPhonenumber(value) {
      return /^\d{7,}$/.test(value.replace(/[\s()+\-\.]|ext/gi, ""));
    },
    isValidEmailId(emailId) {
      return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(emailId);
    },
    isMobileNumberRegistered() {
      const vm = this;
      let data = null;
      vm.seen = true;
      return new Promise((resolve, reject) => {
        // let timeout = setTimeout(() => {
        //   if (data == null) {
        //     reject("phone number not registered.")
        //   }
        // }, 3000);
        let _phoneNumber = vm.username;
        if (!_phoneNumber.includes("+")) {
          _phoneNumber = "+" + _phoneNumber;
        }
        firebase
          .database()
          .ref("phoneUsers")
          .orderByChild("phoneNumber")
          .equalTo(_phoneNumber)
          .once("value", (snapshot) => {
            if (snapshot.val() != null) {
              console.log(snapshot.val());
              let key = Object.keys(snapshot.val());
              data = snapshot.val()[key[0]];
              // clearTimeout(timeout);
              vm.seen = false;
              resolve(data);
            } else {
              vm.seen = false;
              reject("not registered");
            }
          });
      });
    },
    sendOtp() {
      const vm = this;
      //
      let countryCode = "+91"; //india

      let phoneNumber = vm.username;
      if (!phoneNumber.includes("+")) {
        phoneNumber = "+" + phoneNumber;
      }
      //
      let appVerifier = this.appVerifier;
      //

      vm.isMobileNumberRegistered()
        .then((userSnapshot) => {
          vm.newUserData = userSnapshot;
          // mobile number exists under phoneUsers node
          console.log(userSnapshot);
          // mobile number is registered and sms can be sent
          firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult) => {
              console.log(confirmationResult);
              window.confirmationResult = confirmationResult;
              Vue.$toast.open({
                message: vm.$t(
                  "OTP sent to the registred  mobile number.",
                  "OTP sent to the registred  mobile number."
                ),
                type: "success",
                position: "top",
              });
              vm.isOTPSent = true;
              vm.getOtpBTnText = vm.$t("Resend OTP", "Resend OTP");
              vm.seen = false;
            });
        })
        .catch((error) => {
          console.log(error);
          vm.seen = false;
          Vue.$toast.open({
            message: vm.$t(
              "Mobile number not registered.",
              "Mobile number not registered."
            ),
            type: "error",
            position: "top",
          });
          return false;
        });
      // firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      //   .then(function (confirmationResult) {
      //     // SMS sent. Prompt user to type the code from the message, then sign the
      //     // user in with confirmationResult.confirm(code).
      //     window.confirmationResult = confirmationResult;
      //     //
      //     // alert('SMS sent')
      //     Vue.$toast.open({
      //       message:
      //     })
      //   }).catch(function (error) {
      //     console.log(error);
      //   // Error; SMS not sent
      //   // ...
      //   alert('Error ! SMS not sent')
      // });
    },
    verifyOtp() {
      //
      let vm = this;
      let code = this.otp;
      //
      window.confirmationResult
        .confirm(code)
        .then(function (result) {
          vm.seen = true;
          // User signed in successfully.
          var user = result.user;
          console.log(user);
          firebase
            .auth()
            .currentUser.getIdToken(true)
            .then((idtoken) => {
              vm.seen = true;
              console.log(idtoken);
              localStorage.IDtoken = idtoken;
              localStorage.phoneNumber = vm.username;
              console.log(localStorage.IDtoken);
              console.log(vm.newUserData);
              if (vm.newUserData.registered == "REGISTERED") {
                // has signed in once
                vm.clearIndexedDB()
                  .then((cleared) => {
                    console.log(cleared);
                    vm.routeTheUser(user.uid);
                  })
                  .catch((error) => {
                    console.log(error);
                    vm.seen = false;
                    Vue.$toast.open({
                      message: vm.$t(
                        "Error deleting indexedDB.",
                        "Error deleting indexedDB."
                      ),
                      type: "error",
                      position: "top",
                    });
                  });
              } else if (vm.newUserData.registered == "UPDATE") {
                vm.pushDataToUserProfile(vm.newUserData, user.uid)
                  .then((created) => {
                    console.log(created);
                    vm.deleteOldUserRecord(vm.newUserData.uuid)
                      .then((deleted) => {
                        console.log(deleted);
                        // update registered status to REGISTERED
                        vm.updateRegisteredStatus(vm.newUserData.phoneNumber)
                          .then((updated) => {
                            console.log(updated);
                            // add user mapping
                            vm.addUserMapping(
                              user.uid,
                              vm.newUserData.organizationKey
                            )
                              .then((mapped) => {
                                console.log(mapped);
                                // clear indexeddb
                                vm.clearIndexedDB()
                                  .then((cleared) => {
                                    console.log(cleared);
                                    vm.routeTheUser(user.uid);
                                  })
                                  .catch((error) => {
                                    console.log(error);
                                    vm.seen = false;
                                    Vue.$toast.open({
                                      message: vm.$t(
                                        "Error deleting indexedDB.",
                                        "Error deleting indexedDB."
                                      ),
                                      type: "error",
                                      position: "top",
                                    });
                                  });
                              })
                              .catch((error) => {
                                console.log(error);
                                vm.seen = false;
                                Vue.$toast.open({
                                  message: vm.$t(
                                    "Error mapping the user to organization.",
                                    "Error mapping the user to organization."
                                  ),
                                  type: "error",
                                  position: "top",
                                });
                              });
                          })
                          .catch((error) => {
                            console.log(error);
                            vm.seen = false;
                            Vue.$toast.open({
                              message: vm.$t(
                                "Error updating user status.",
                                "Error updating user status."
                              ),
                              type: "error",
                              position: "top",
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        vm.seen = false;
                        Vue.$toast.open({
                          message: vm.$t(
                            "Error deleting old user data.",
                            "Error deleting old user data."
                          ),
                          type: "error",
                          position: "top",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    vm.seen = false;
                    Vue.$toast.open({
                      message: vm.$t(
                        "Error creating user.",
                        "Error creating user."
                      ),
                      type: "error",
                      position: "top",
                    });
                  });
              } else {
                // signing in for the first time

                // push data to userProfile
                vm.pushDataToUserProfile(vm.newUserData, user.uid)
                  .then((updated) => {
                    console.log(updated);
                    // add mapping
                    vm.addUserMapping(user.uid, vm.newUserData.organizationKey)
                      .then((mapped) => {
                        console.log(mapped);
                        vm.clearIndexedDB()
                          .then((cleared) => {
                            console.log(cleared);
                            vm.routeTheUser(user.uid);
                          })
                          .catch((error) => {
                            console.log(error);
                            vm.seen = false;
                            Vue.$toast.open({
                              message: vm.$t(
                                "Error deleting indexedDB.",
                                "Error deleting indexedDB."
                              ),
                              type: "error",
                              position: "top",
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        vm.seen = false;
                        Vue.$toast.open({
                          message: vm.$t(
                            "Error mapping the user to the organization.",
                            "Error mapping the user to the organization"
                          ),
                          type: "error",
                          position: "top",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    vm.seen = false;
                    Vue.$toast.open({
                      message: vm.$t(
                        "Error creating user.",
                        "Error creating user."
                      ),
                      type: "error",
                      position: "top",
                    });
                  });
              }
            });
          // ...
          //route to set password !
          //vm.$router.push({path:'/setPassword'})
        })
        .catch(function (error) {
          console.log(error);
          vm.seen = false;
          Vue.$toast.open({
            message: vm.$t("Invalid OTP", "Invalid OTP"),
            type: "error",
            position: "top",
          });
          // User couldn't sign in (bad verification code?)
          // ...
        });
    },
    initReCaptcha() {
      setTimeout(() => {
        let vm = this;
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function (response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            "expired-callback": function () {
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            },
          }
        );
        //
        this.appVerifier = window.recaptchaVerifier;
      }, 1000);
    },
    pushDataToUserProfile(userData, uuid) {
      const vm = this;
      userData.registered = "REGISTERED";
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref()
          .child("profile")
          .child(uuid)
          .set(userData)
          .then((updated) => {
            console.log(updated);
            console.log("user data updated under user profile");
            vm.updateRegisteredStatus(userData.phoneNumber)
              .then(() => {
                resolve(updated);
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },

    addUserMapping(uuid, organizationKey) {
      console.log(uuid);
      console.log(organizationKey);
      let dataToUpdate = {};
      dataToUpdate[uuid] = uuid;
      // adding user mapping
      return new Promise((resolve, reject) => {
        let data = null;
        let timeout = setTimeout(() => {
          if (data == null) {
            reject("mapping failed");
          }
        }, 3000);
        firebase
          .database()
          .ref()
          .child("OrganizationUserMapping")
          .child(organizationKey)
          .update(dataToUpdate)
          .then((updated) => {
            data = "mapping done";
            clearTimeout(timeout);
            console.log(updated);
            console.log("mapping done");
            resolve(updated);
          })
          .catch((error) => {
            console.log("error adding mapping");
            console.log(error);
            reject(error);
          });
      });
    },
    routeTheUser(uuid) {
      const vm = this;
      firebase
        .database()
        .ref()
        .child("profile")
        .child(uuid)
        .on("value", (snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val() == null) {
            Vue.$toast.open({
              message: "Could not find your profile.",
              type: "error",
              position: "top",
            });
            localStorage.emailId = null;
            localStorage.IDtoken = null;
            Router.push("/");
            return false;
          }
          if (snapshot.val().status == "Disabled") {
            vm.seen = false;
            Vue.$toast.open({
              message: "Your account has been disabled by the admin.",
              type: "error",
              position: "top",
            });
            localStorage.emailId = null;
            localStorage.IDtoken = null;
            Router.push("/");
            return false;
          }
          if (
            snapshot.val().systemRole == undefined ||
            snapshot.val().systemRole == null ||
            snapshot.val().systemRole == ""
          ) {
            vm.systemRoles = snapshot
              .val()
              .userRoles.map((val) => val.systemRole)
              .join(",");
            if (vm.systemRoles.split(",").length > 1) {
              vm.isMultipleRole = true;
            } else {
              vm.isMultipleRole = false;
            }
          } else {
            vm.isMultipleRole = false;
            vm.systemRoles = snapshot.val().systemRole.toString();
          }
          localStorage.userName =
            snapshot.val().firstName + " " + snapshot.val().lastName;
          localStorage.systemRole = vm.systemRoles;
          if (localStorage.systemRole == 99) {
            localStorage.organizationKey = snapshot.val().email.trim();
            localStorage.organization = snapshot.val().email.trim();
          } else {
            localStorage.organizationKey = snapshot.val().organizationKey;
            localStorage.organization = snapshot.val().organization;
          }
          if (vm.isMultipleRole) {
            Router.push("multi-user-dashboard");
          } else {
            if (vm.systemRoles == 96) {
              Router.push("lsp-dashboard");
            } else if (vm.systemRoles == 97) {
              Router.push("broker-dashboard");
            } else if (vm.systemRoles == 2) {
              Router.push("pack-house-incharge-dashboard");
            } else if (vm.systemRoles == 1) {
              Router.push("dashboard");
            } else if (vm.systemRoles == 3) {
              Router.push("collector-dashboard");
            } else if (vm.systemRoles == 99) {
              Router.push("sa-dashboard");
            } else if (vm.systemRoles == 4 || vm.systemRoles == 5) {
              Router.push("broker-dashboard");
            } else if (vm.systemRoles == 8) {
              Router.push("payment-history");
            } else if (vm.systemRoles == 6) {
              Router.push("tpa-dashboard");
            } else if (vm.systemRoles == 9) {
              Router.push("admin-dashboard");
            } else if (vm.systemRoles == 13) {
              Router.push("observer-dashboard");
            } else if (vm.systemRoles == 7) {
              Router.push("op-admin-dashboard");
            } else if (vm.systemRoles == 10) {
              Router.push("observer-mci-dashboard");
            } else if (vm.systemRoles == 91) {
              Router.push("dashboard");
            } else if (vm.systemRoles == 89) {
              Router.push("auditor");
            } else {
              Router.push("dashboard");
            }
          }
        });
    },
    updateRegisteredStatus(phoneNumber) {
      const vm = this;
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref()
          .child("phoneUsers")
          .orderByChild("phoneNumber")
          .equalTo(phoneNumber)
          .once("value", (snapshot) => {
            let key = Object.keys(snapshot.val())[0];
            firebase
              .database()
              .ref()
              .child("phoneUsers")
              .child(key)
              .update({ registered: "REGISTERED" })
              .then(() => {
                resolve();
              })
              .catch((error) => {
                console.log(error);
                reject(error);
              });
          });
      });
    },
    deleteOldUserRecord(uuid) {
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref()
          .child("profile")
          .child(uuid)
          .remove()
          .then((deleted) => {
            console.log(deleted);
            resolve(deleted);
          })
          .catch((error) => {
            console.log(error);
            reject("Error deleting old user");
          });
      });
    },
  },
  created() {
    this.initReCaptcha();
  },
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
.main-head {
  text-align: left;
  color: #fff;
  padding-top: 9px;
  padding-left: 18px;
  font-size: 43px;
}
.lbl-fp {
  color: #fff !important;
  cursor: pointer;
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
  /* margin-top: 13px; */
  margin-top: -52px;
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
  min-height: 100px;
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
.phone-login {
  margin: 15px;
  background: #92d050;
  color: #fff;
  border: none;
  padding: 5px 25px 5px 25px;
  width: 80%;
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
.dark-green-background {
  background-color: #118530 !important;
}
</style>
