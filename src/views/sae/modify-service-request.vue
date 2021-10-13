<template>
  <div class="new-request">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h3 class="heading">Modify Service Request</h3>
          <img
            class="close-img"
            @click="showService"
            src="../../assets/images/close.png"
          />
        </div>
        <div class="main-container">
          <div class="service-container">
            <div class="wrapper-conatiner first-wrapper">
              <div class="img-container">
                <img
                  class="img-producer"
                  src="../../assets/images/producer_2.png"
                />
                <label>Producer *</label>
              </div>
              <div class="inp-container">
                <ejs-autocomplete
                  :dataSource="producerData"
                  :value="producer"
                  @blur="onfocusOut"
                  v-model="producer"
                  v-on:change="onselect"
                  :placeholder="$t(waterMark, waterMark)"
                ></ejs-autocomplete>
              </div>
            </div>
            <div class="wrapper-conatiner">
              <div class="img-container">
                <img
                  class="img-location"
                  src="../../assets/images/location_pin.png"
                />
                <label>{{ $t("GPS Location", "GPS Location") }} *</label>
                <br />
                <span class="spn-location">(Lat,Lng)</span>
              </div>
              <div class="inp-container">
                <input
                  type="text"
                  readonly
                  v-model="logitudeLatitude"
                  class="inp-user"
                  placeholder
                />
                <br />
              </div>
            </div>
            <div class="wrapper-conatiner">
              <div class="img-container">
                <img class="img-producer" src="../../assets/images/mango.png" />
                <label>{{ $t("Fruit", "Fruit") }} *</label>
              </div>
              <div class="inp-container">
                <v-select
                  v-model="productId"
                  :value="productId"
                  :selected="productId"
                  class="mod-req-v-select"
                  :options="sportsData"
                ></v-select>
                <!-- <ejs-dropdownlist
                  :value="productId"
                  id="dropdownlist"
                  :selected="productId"
                  v-model="productId"
                  :dataSource="sportsData"
                ></ejs-dropdownlist>-->
              </div>
            </div>
            <div class="wrapper-conatiner middle-wrapper">
              <div class="img-container">
                <img
                  class="img-producer"
                  src="../../assets/images/estimated_fruits.png"
                />
                <label
                  >{{ $t("Estimated Fruits", "Estimated Fruits") }} *</label
                >
              </div>
              <div class="inp-container">
                <input
                  type="number"
                  class="inp-user"
                  v-model="estimatedFruit"
                  placeholder
                />
                <br />
              </div>
            </div>
            <div class="wrapper-conatiner">
              <div class="mandatory-warning">
                <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
              </div>
              <input
                class="btn-request"
                v-on:click="showservicerequests"
                value="Modify Request"
                readonly
              />
              <button class="cancel-btn" @click="showService">{{$t("Cancel", "Cancel") }}</button>
              <br />
              <label class="lbl-error">{{ erroMessage }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3"></div>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        title="Status"
        id="modalnew"
        hide-backdrop
      >
        <label class="lbl-modal-success">{{ succesContent }}</label>
      </b-modal>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/main.css";
import Router from "../../router";
import firebase from "firebase";
import axios from "axios";
import { AutoCompletePlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(AutoCompletePlugin);
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);

import { uuid } from "vue-uuid";

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
Vue.use(VueToast);

import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import moment from "moment";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import Offline from "v-offline";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

export default {
  name: "modify-service-request",

  data: function() {
    return {
      waterMark: "Start Typing Producer",
      producer: "",
      productId: "",
      estimatedFruit: "",
      erroMessage: "",
      producerData: [],
      producerList: [],
      logitudeLatitude: "",
      farmerId: "",
      linearId: "",
      recordedTime: "",
      seen: true,
      sportsData: [],
      userName: "",
      firebaseKey: "",
      department: "",
      nif: "",
      cin: "",
      town: "",
      status: "",
      serviceRequestId: "",
      succesContent: null,
      displayId: "",
      networkStatus: true
    };
  },
  components: {
    Header,
    Footer,
    Offline
  },
  created() {
    this.id = this.$route.params.id;
    var currentVal = this;
    var dbRef = firebase.database().ref("serviceRequest/");
    dbRef
      .orderByChild("serviceRequestId")
      .equalTo(this.id)
      .on("child_added", function(data) {
        console.log(data.val());
        currentVal.firebaseKey = data.key;
        currentVal.producer = data.val().producer;
        currentVal.farmerId = data.val().farmerId;
        currentVal.department = data.val().department;
        currentVal.town = data.val().town;
        currentVal.estimatedFruit = data.val().estimatedNoFruits;
        currentVal.logitudeLatitude = data.val().location;
        currentVal.productId = data.val().product;
        currentVal.status = data.val().status;
        currentVal.serviceRequestId = data.val().serviceRequestId;
        currentVal.displayId = data.val().displayId;
        currentVal.requestedOn = data.val().requestedOn;
      });
  },
  mounted() {
    if (localStorage.systemRole == 99) {
       if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"), href: "/sa-dashboard" },
         {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        { text: "Harvest Planner - Dashboard", href: "/dashboard" },
        { text: "Manage Service Requests", href: "/service-requests" },
        { text: "Modify Service Request", href: "/modify-service-request/:id" }
      ]);
      }
      else
{
   this.$refs.headercomp.createBreadcrumb([
        {text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"), href: "/sa-dashboard" },
         {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        { text: "Harvest Planner - Dashboard", href: "/dashboard" },
        { text: "Manage Service Requests", href: "/service-requests" },
        { text: "Modify Service Request", href: "/modify-service-request/:id" }
      ]);
}
    } else if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "Admin-Dashboard", href: "/admin-dashboard" },
        { text: "Harvest Planner - Dashboard", href: "/dashboard" },
        { text: "Manage Service Requests", href: "/service-requests" },
        { text: "Modify Service Request", href: "/modify-service-request/:id" }
      ]);
    } else if (localStorage.systemRole == 1 || localStorage.systemRole == 91) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "Harvest Planner - Dashboard", href: "/dashboard" },
        { text: "Manage Service Requests", href: "/service-requests" },
        { text: "Modify Service Request", href: "/modify-service-request/:id" }
      ]);
    } else if (localStorage.systemRole == 7) {
      this.$refs.headercomp.createBreadcrumb([
        { text: "OP-Admin-Dashboard", href: "/op-admin-dashboard" },
        { text: "Harvest Planner - Dashboard", href: "/dashboard" },
        { text: "Manage Service Requests", href: "/service-requests" },
        { text: "Modify Service Request", href: "/modify-service-request/:id" }
      ]);
    }
    this.sportsData = [];
    this.sportsData = [
      `${this.$t("Avocado", "Avocado")}`,
      `${this.$t("Mango", "Mango")}`,
      `${this.$t("Pineapple", "Pineapple")}`
    ];
    this.userName = localStorage.userName;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.pushProducerData();
  },
  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    pushProducerData: function(event) {
      var currentVal = this;

      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("producer");

      ref.on("value", function(snapshot) {
        var numberOfItems = snapshot.numChildren();
        var itemCount = 0;
        snapshot.forEach(requestData => {
          currentVal.producerList.push({
            id: requestData.id,
            uuid_externalId: requestData.val().uuid_externalId,
            uuid_id: requestData.val().uuid_id,
            firstname: requestData.val().firstname,
            lastname: requestData.val().lastname,
            longitude: requestData.val().longitude,
            latitude: requestData.val().latitude,
            department: requestData.val().department,
            town: requestData.val().town,
            phoneNumber: requestData.val().phoneNumber,
            farmerPicture: requestData.val().farmerPicture,
            cin: requestData.val().cin,
            nif: requestData.val().nif,
            parcelCode: requestData.val().parcelCode
          });
          currentVal.producerData.push(
            requestData.val().firstname + " " + requestData.val().lastname
          );
          itemCount++;
          if (itemCount == numberOfItems) {
            currentVal.seen = false;
          }
        });
      });
    },
    showService: function(event) {
      Router.push({ path: "/service-requests" });
    },
    onselect: function() {
      let currentVal = this;
      var valObj = this.producerList.filter(function(elem) {
        if (currentVal.producer != null && currentVal.producer != "") {
          if (
            currentVal.producer.toLowerCase() ==
            (elem.firstname + " " + elem.lastname).toLowerCase()
          ) {
            currentVal.logitudeLatitude = elem.latitude + "," + elem.longitude;
            currentVal.farmerId = elem.uuid_id;
            currentVal.department = elem.department;
            currentVal.town = elem.town;
            currentVal.phoneNumber = elem.phoneNumber;
            if (elem.cin != null && elem.cin != undefined) {
              currentVal.cin = elem.cin;
            }
            if (elem.nif != null && elem.nif != undefined) {
              currentVal.nif = elem.nif;
            }
          }
        } else {
          currentVal.logitudeLatitude = null;
        }
      });
    },
    updateFirebaseData: function() {
      var inpData = {
        farmerId: this.farmerId,
        producer: this.producer,
        location: this.logitudeLatitude,
        department: this.department,
        town: this.town,
        requestedOn: moment.utc().toString(),
        estimatedNoFruits: this.estimatedFruit,
        product: this.getFruit(this.productId),
        status: this.status,
        serviceRequestId: this.serviceRequestId,
        displayId: this.displayId,
        modifiedBy: localStorage.userName
      };
      let currentValue = this;
      var dbRef = firebase
        .database()
        .ref()
        .child("serviceRequest")
        .child(this.firebaseKey);
      dbRef
        .update(inpData)
        .then(function(response) {
          currentValue.seen = false;
          currentValue.seen = false;
          console.log("Updated to firebase.");
          Vue.$toast.open({
            message: "Service request updated successfully.",
            position: "top",
            type: "success"
          });
          currentValue.succesContent = "Service request updated successfully.";
          //currentValue.$refs["success-modal"].show();
          setTimeout(function() {
            Router.push({ path: "/dashboard" });
          }, 3000);
          // currentValue.createAPICall(inpData);
        })
        .catch(function(error) {
          currentValue.erroMessage = error.message;
          currentValue.seen = false;
        });
    },
    logout: function(event) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function(error) {
          alert("Error");
        });
    },
    onfocusOut: function() {
      if (this.producerData.indexOf(this.producer) == -1) {
        Vue.$toast.open({
          message: "Entered producer not found.",
          position: "top",
          type: "error"
        });
        this.logitudeLatitude = "";
        this.producer = "";
      }
      if (this.producer == null || this.producer == null) {
        this.logitudeLatitude = "";
      }
      //       const found = this.producerList.some(el => el.username === producer);
      // if (!found)
      // {
      //      Vue.$toast.open({
      //         message: "Entered producer not found.",
      //         position: "top",
      //         type: "error"
      //       });
      // }

      // if (this.logitudeLatitude == null || this.logitudeLatitude == "") {
      //   this.producer = "";

      //   Vue.$toast.open({
      //     message: "Entered producer not found.",
      //     position: "top",
      //     type: "error"
      //   });
      // }
    },
    showservicerequests: function(event) {
      this.seen = true;
      var proStatus = 0;
      // var producerReqName = this.producer.split(" ");
      // if (
      //   this.producerData.includes(
      //     producerReqName[0] + " " + producerReqName[1]
      //   )
      // ) {
      //   proStatus = 1;
      // } else {
      //   proStatus = 0;
      // }
      // if (proStatus == 0) {
      //   this.erroMessage = "Please enter valid producer.";
      //   this.seen = false;
      // } else {
      if (this.producer == null || this.producer == "") {
        Vue.$toast.open({
          message: "Please enter producer.",
          position: "top",
          type: "error"
        });
        // this.erroMessage = "Please enter producer.";
        this.seen = false;
      } else if (this.productId == null || this.productId == "") {
        //  this.erroMessage = "Please select productid.";
        Vue.$toast.open({
          message: "Please select productid.",
          position: "top",
          type: "error"
        });
        this.seen = false;
      } else if (this.estimatedFruit == null || this.estimatedFruit == "") {
        // this.erroMessage = "Please enter estimated fruits.";
        Vue.$toast.open({
          message: "Please enter estimated fruits.",
          position: "top",
          type: "error"
        });
        this.seen = false;
      } else {
        this.erroMessage = "";
        if (this.networkStatus) {
          this.createAPICall();
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: "Please check the internet connection",
            type: "error",
            position: "top"
          });
        }
      }
      // }
    },
    createAPICall: function() {
      let currentVal = this;
      const data = {
        id: currentVal.serviceRequestId,
        displayId: currentVal.displayId,
        farmerId: currentVal.farmerId,
        producer: currentVal.producer,
        location: currentVal.logitudeLatitude,
        department: currentVal.department,
        town: currentVal.town,
        requestedOn: moment
          .utc(String(currentVal.requestedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        estimatedNoFruits: currentVal.estimatedFruit,
        product: currentVal.getFruit(currentVal.productId),
        status: "New",
        phoneNo: currentVal.phoneNumber,
        cin: currentVal.cin,
        nif: currentVal.nif
      };
      //need to work
      currentVal.getProducerData(data).then(function(newInpData) {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50005/api/v1.0/edit-service-request`,
            newInpData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken
              }
            }
          )
          .then(function(response) {
            console.log("updated in corda backend.");

            // update to firebase.
            currentVal.updateFirebaseData();
          })
          .catch(function(error) {
            //refresh token
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
             if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then(idtoken => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal.createAPICall();
                });
            } else {
              currentVal.seen = false;
              Vue.$toast.open({
                message: error,
                type: "error",
                position: "top"
              });
            }
          });
      });
    },
    getProducerData(inpData) {
      return new Promise(function(resolve, reject) {
        firebase
          .database()
          .ref()
          .child("masters")
          .child("producer")
          .orderByChild("uuid_id")
          .equalTo(inpData.farmerId)
          .on("child_added", function(snapshot) {
            console.log(snapshot.val());
            inpData.phoneNo = snapshot.val().phoneNumber;
            inpData.cin = snapshot.val().cin;
            inpData.nif = snapshot.val().nif;
            resolve(inpData);
          });
      });
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("/sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("/dashboard");
      }
    },
    getFruit(fruit) {
      if (fruit == "Avocado" || fruit == "Avocat" || fruit == "Zaboka") {
        return "Avocado";
      } else if (fruit == "Mango" || fruit == "Mangue") {
        return "Mango";
      } else if (
        fruit == "Pineapple" ||
        fruit == "Ananas" ||
        fruit == "Anana"
      ) {
        return "Pineapple";
      } else {
        return "Invalid Fruit";
      }
    }
  }
};
</script>
<style>
.mod-req-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 0px 0px 0px 0px !important;
}
.mod-req-v-select {
  font-size: 13px;
}
.mod-req-v-select span,
.mod-req-v-select input,
.mod-req-v-select .vs__no-options {
  color: #fff;
}
.mod-req-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.mod-req-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.mod-req-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.mod-req-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.mod-req-v-select .vs__open-indicator,
.mod-req-v-select .vs__clear {
  fill: #fff;
}
.mod-req-v-select .vs__selected-options,
.mod-req-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.mod-req-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.mod-req-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.mod-req-v-select .vs__clear {
  margin-top: -10px;
}
.mod-req-v-select .vs__open-indicator {
  margin-top: -5px;
}
</style>
<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.lbl-error {
  color: red;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

option {
  color: #000 !important;
  background: #fff !important;
}
.middle-wrapper {
  margin-bottom: 30px;
}
.first-wrapper {
  margin-top: 30px;
}
.btn-request {
  text-align: center !important;
  float: right;
  margin-right: 20px;
  background: #92d050;
  color: #fff;
  border: none;
  padding: 5px 0px 5px 0px;
  cursor: pointer;
  font-size: 13px !important;
}
input[type="text"],
input[type="number"],
input[type="password"],
textarea,
select {
  outline: none;
  border-bottom: 1px solid #fff !important;
}
.e-ddl-hidden {
  border-bottom: none !important;
}
.wrapper-conatiner {
  clear: both;
  height: 70px;
}
.spn-location {
  color: #fff;
  /* margin-left: 28px; */
  margin-left: 38px;
  top: -10px;
  position: relative;
}
.inp-user {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  padding: 2px;
  background-repeat: no-repeat;
  background-position: left;
  background-size: 25px 25px;
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

label {
  color: #fff;
  margin-left: 20px;
}
.img-producer {
  width: 19px;
  height: auto;
}
.img-location {
  width: 18px;
  height: auto;
}

.username-conatiner {
  float: right;
  margin: 20px;
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.product-container {
  text-align: center;
  margin: 10px;
}
p {
  color: #fff;
  text-align: center;
}
.img-container {
  width: 25%;
  float: left;
  margin: 10px;
  text-align: left;
}
.inp-container {
  width: 68%;
  float: left;
  margin: 10px;
  text-align: left;
}
.service-img {
  width: 80px;
  height: auto;
  text-align: center;
  margin: 10px;
  padding: 10px;
}
.service-container {
  display: inline-block;
  width: 100%;
  font-size: 13px;
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-weight: 400;
}
.container-bg {
  position: absolute;
  background-image: url("../../assets/images/bg2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
  filter: blur(20px);
  -webkit-filter: blur(20px);
}
.content {
  margin: auto;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.header-container {
  height: auto;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
}
.content-container {
  height: fit-content;
}
.ref-logout {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username {
  text-transform: none !important;
  font-size: 13px;
}
.close-img {
  width: 16px;
  height: auto;
  float: right;
  margin-top: -18px;
  cursor: pointer;
  position: relative;
}
.cancel-btn {
  padding: 5px 35px 5px 35px;
  background-color: #685838;
  border: 1px solid #000;
  color: #fff;
  text-align: center;
  float: right;
  margin: -1px 10px 0px 0px;
}
.mandatory-warning {
  position: absolute;
  bottom: 50px;
  font-size: 13px;
  color: #fff;
  padding-left: 15px;
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 602px) {
  .content-container {
    margin-top: 30px;
  }
}

input {
  color: #fff !important;
}
@media screen and (max-width: 451px) {
  .img-container {
    width: 100%;
  }
}
option:hover {
  background: #d0d0d0 !important;
  background-color: #d0d0d0 !important;
}
/* popup design */
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
input[type="text"] {
  font-size: 13px !important;
}
</style>
