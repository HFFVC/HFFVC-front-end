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
          <h3 class="heading">
            {{ $t("New Service Request", "New Service Request") }}
          </h3>
          <img
            @click="showDashboard"
            class="close-img"
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
                <label>{{ $t("Producer", "Producer") }} *</label>
              </div>
              <div class="inp-container">
                <ejs-autocomplete
                  :dataSource="producerData"
                  v-on:change="onselect"
                  @blur="onfocusOut"
                  v-model="producer"
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
                <span class="spn-location">{{
                  $t("(Lat,Lng)", "(Lat,Lng)")
                }}</span>

                <a
                  :href="map"
                  target="_blank"
                  class="what-3-words-location"
                  v-if="words"
                  >{{ $t(words, words) }}</a
                >
              </div>
              <div class="inp-container imp-container-loc">
                <input
                  type="text"
                  readonly
                  v-model="logitudeLatitude"
                  class="inp-user inp-loc-words"
                  placeholder
                />
                <br />
                <div
                  class="whatwords-wrap-active-sr tooltip whatwords-wrap-tooltip"
                >
                  <span
                    class="tooltiptext whatwords-tooltiptext whatwords-tooltiptext-sr"
                  >
                    {{ $t("Mots", "Mots") }}: {{ $t(words, words) }}
                    <br />
                    {{ $t("Pays", "Pays") }}: {{ $t(country, country) }}
                    <br />
                    {{ $t("Lieu le plus proche", "Lieu le plus proche") }} :
                    {{ $t(nearestPlace, nearestPlace) }}
                  </span>
                  <a :href="map" target="_blank">
                    <img
                      class="img-location img-words"
                      src="../../assets/images/location_pin.png"
                    />
                  </a>
                </div>
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
                  class="new-req-v-select"
                  :options="sportsData"
                ></v-select>
                <!-- <ejs-dropdownlist id="dropdownlist" v-model="productId" :dataSource="sportsData"></ejs-dropdownlist> -->
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
               <!-- <div v-if="isSuperUser" class="wrapper-conatiner middle-wrapper">
                   
              
                <label>{{ $t("Organization", "Organization") }} *</label>
              
              <div class="inp-container" >
                  <div class="function-dropdown">
                    <v-select
                      id="dropdownlist"
                      v-model="organizationSelected"
                      :placeholder="$t('Organization', 'Organization')"
                      class="manage-users-v-select rolesel"
                      :options="organizationList"
                      label="name"
                    ></v-select>
                  </div>
                </div> -->
                </div>
                  <div class="wrapper-conatiner" v-if="isSuperUser">
              <div class="img-container">
                <img class="img-producer" src="../../assets/images/batch.png" />
                <label>{{ $t("Organization", "Organization") }} *</label>
              </div>
              <div class="inp-container">
                <v-select
                  v-model="organizationSelected"
                  class="new-req-v-select"
                  :options="organizationList"
                     label="name"
                ></v-select>
                <!-- <ejs-dropdownlist id="dropdownlist" v-model="productId" :dataSource="sportsData"></ejs-dropdownlist> -->
              </div>
            </div>
            </div>
            <div class="wrapper-conatiner">
              <div class="mandatory-warning">
                <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
              </div>
              <!-- <input
                class="btn-request"
                v-on:click="showservicerequests"
                value="$t('Submit Request', 'Submit Request')"
                readonly
              /> -->
              <button class="btn-request" @click="showservicerequests">
                {{ $t("Submit Request", "Submit Request") }}
              </button>
              <button class="cancel-btn" @click="showDashboard">
                {{ $t("Cancel", "Cancel") }}
              </button>
              <br />
              <label class="lbl-error">{{
                $t(erroMessage, erroMessage)
              }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3"></div>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        :title="$t('Status', 'Status')"
        id="modalnew"
        hide-backdrop
      >
        <label class="lbl-modal-success">{{
          $t(succesContent, succesContent)
        }}</label>
      </b-modal>
      <Footer ref="footercomp"></Footer>
    </div>
  <!-- </div> -->
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css//main.css";
import Router from "../../router";
import firebase from "firebase";
import axios from "axios";
import { AutoCompletePlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(AutoCompletePlugin);
import { uuid } from "vue-uuid";

import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
Vue.use(VueToast);
import sendSMS from "../../shared/sms-service";
import moment from "moment";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import Offline from "v-offline";
import sanitizeInput from "../../shared/sanitize_input";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

export default {
  name: "new-request",

  data: function () {
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
      seen: true,
      sportsData: ["Mango", "Pineapple", "Avocado"],
      userName: "",
      department: "",
      town: "",
      succesContent: "",
      existingRequests: [],
      phoneNumber: "",
      requestedOnDate: "",
      cin: "",
      nif: "",
      displayId: null,
      networkStatus: true,
      map: null,
      country: null,
      words: null,
      nearestPlace: null,
      organization: null,
      organizationKey: null,
      isSuperUser: false,
      organizationList: [],
      organizationSelected: null,
    };
  },
  components: {
    Header,
    Footer,
    Offline,
  },
  mounted() {
    let multipleRoles = localStorage.systemRole.split(",");
    if (multipleRoles.length > 1) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Multi-Role-Dashboard", "Multi-Role-Dashboard"),
          href: "/multi-user-dashboard",
        },
        {
          text: this.$t(
            "Harvest Planner - Dashboard",
            "Harvest Planner - Dashboard"
          ),
          href: "/dashboard",
        },
        {
          text: this.$t("New Service Request", "New Service Request"),
          href: "/new-request",
        },
      ]);
    } else {
      if (localStorage.systemRole == 99) {
        if(getConfigVars().USERID == isAuthenticated())
      {
        this.$refs.headercomp.createBreadcrumb([
          {
           text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
            href: "/sa-dashboard",
          },
           {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("New Service Request", "New Service Request"),
            href: "/new-request",
          },
        ]);
      }
      else{
         this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
            href: "/sa-dashboard",
          },
           {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("New Service Request", "New Service Request"),
            href: "/new-request",
          },
        ]);
      }
      } else if (localStorage.systemRole == 9) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
            href: "/admin-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("New Service Request", "New Service Request"),
            href: "/new-request",
          },
        ]);
      } else if (localStorage.systemRole == 1 || localStorage.systemRole == 91) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("New Service Request", "New Service Request"),
            href: "/new-request",
          },
        ]);
      } else if (localStorage.systemRole == 7) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
            href: "/op-admin-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("New Service Request", "New Service Request"),
            href: "/new-request",
          },
        ]);
      } else if (localStorage.systemRole == 96) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
          {
            text: this.$t("New Service Request", "New Service Request"),
            href: "/new-request",
          },
        ]);
      }
    }
    this.userName = localStorage.userName;
    this.pushProducerData();
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.sportsData = [];
    this.sportsData = [
      `${this.$t("Avocado", "Avocado")}`,
      `${this.$t("Mango", "Mango")}`,
      `${this.$t("Pineapple", "Pineapple")}`,
    ];
    if (
      localStorage.producerdetails != "" &&
      localStorage.producerdetails != " " &&
      localStorage.producerdetails != undefined &&
      localStorage.producerdetails != "undefined" &&
      localStorage.producerdetails != null &&
      localStorage.producerdetails != ""
    ) {
      var details = localStorage.producerdetails.split("_");
      this.producer = details[0] + " " + details[1];

      this.logitudeLatitude = details[2];
    }

    if (localStorage.systemRole.includes(99) || localStorage.systemRole.includes(91)) {
      this.isSuperUser = true;
      this.getOrganizationList();
    } else {
      this.isSuperUser = false;
    }
  },
  methods: {
    getOrganizationList() {
      const vm = this;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .orderByChild("organizationType")
        .equalTo("Logistic / Cold Chain Service Provider");
      this.organizationList = [];
      ref.on("value", (snapshot) => {
        snapshot.forEach((requestData) => {
          if (requestData.val().status != "Disabled") {
            this.organizationList.push({
              name: requestData.val().name,
              orgKey: requestData.key,
            });
          }
          //  vm.mappedOrganization[requestData.val().name] = requestData.key;
        });
      });
      console.log(vm.mappedOrganization);
    },
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    onfocusOut: function () {
      if (this.producerData.indexOf(this.producer) == -1) {
        Vue.$toast.open({
          message: "Entered producer not found.",
          position: "top",
          type: "error",
        });
        this.logitudeLatitude = "";
        this.producer = "";
      }
      if (this.producer == null || this.producer == null) {
        this.logitudeLatitude = "";
      }
      // if (this.logitudeLatitude == null || this.logitudeLatitude == "") {
      //   this.producer = "";

      //   Vue.$toast.open({
      //     message: "Entered producer not found.",
      //     position: "top",
      //     type: "error"
      //   });
      // }
    },
    onselect: function () {
      let currentVal = this;
      var valObj = this.producerList.filter(function (elem) {
        if (currentVal.producer != null && currentVal.producer != "") {
          // var producerFullName = currentVal.producer.split(" ");
          // var producerLastName = "";
          // if (producerFullName.length > 2) {
          //   for (var i = 1; i < producerFullName.length; i++) {
          //     producerLastName =
          //       producerLastName + " " + producerFullName[i].trim();
          //   }
          // } else {
          //   if (
          //     producerFullName != null &&
          //     producerFullName[1] != "undefined" &&
          //     producerFullName[1] != undefined &&
          //     producerFullName[1] != "" &&
          //     producerFullName[1] != null
          //   ) {
          //     producerLastName = producerFullName[1].trim();
          //   }
          // }
          // if (
          //   elem.firstname.trim() == producerFullName[0].trim() &&
          //   elem.lastname == producerLastName.trim()
          // )
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

            var dbRefWords = firebase.database().ref("masters/what3words");
            dbRefWords
              .orderByKey()
              .equalTo(currentVal.farmerId)
              .on("child_added", (response) => {
                currentVal.map = response.val().map;
                currentVal.words = response.val().words;
                currentVal.country = response.val().country;
                currentVal.nearestPlace = response.val().nearestPlace;
              });
          }
        } else {
          currentVal.logitudeLatitude = null;
        }
      });
    },
    pushProducerData: function () {
      var currentVal = this;

      var ref = firebase.database().ref().child("masters").child("producer");

      ref.on("value", function (snapshot) {
        var numberOfItems = snapshot.numChildren();
        var itemCount = 0;
        snapshot.forEach((requestData) => {
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
            parcelCode: requestData.val().parcelCode,
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
    pushDataToFirebase: function (callback) {
      let currentValue = this;

      // check for same producer/date/fruit
      console.log(currentValue.farmerId);
      currentValue.existingRequests = [];
      firebase
        .database()
        .ref()
        .child("serviceRequest")
        .orderByChild("farmerId")
        .equalTo(currentValue.farmerId)
        .on("child_added", function (snapshot) {
          if (snapshot.exists()) {
            currentValue.existingRequests.push(snapshot.val());
          }
        });
      var inpData = null;
      var displayRef = firebase.database().ref().child("counter");
      displayRef.on("child_added", (snapshot) => {
        this.displayId = snapshot.val();
        inpData = {
          serviceRequestId: this.linearId,
          farmerId: this.farmerId,
          producer: this.producer,
          location: this.logitudeLatitude,
          department: this.department,
          town: this.town,
          requestedOn: this.requestedOnDate,
          estimatedNoFruits: this.estimatedFruit,
          product: this.getFruit(this.productId),
          status: "New",
          displayId: this.displayId,
          phoneNumber: this.phoneNumber,
          cin: this.cin,
          nif: this.nif,
          organization: currentValue.organizationSelected.name,
          organizationKey: currentValue.organizationSelected.orgKey,
        };
        displayRef.update({ count: Number(this.displayId) + 1 }).then(() => {
          console.log("success");
        });
        setTimeout(function () {
          callback(currentValue.existingRequests, inpData);
        }, 3000);
      });
    },
    showDashboard: function () {
      localStorage.producerdetails = "";
      Router.push({ path: "/dashboard" });
    },

    logout: function () {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function () {
          alert("Error");
        });
    },
    showservicerequests: function () {
      this.seen = true;
      let currentVal = this;
      if (!this.isSuperUser) {
        this.organizationSelected = {
          name: localStorage.organization,
          orgKey: localStorage.organizationKey,
        };
      }

      if (this.producer == null || this.producer == "") {
        //  this.erroMessage = "Please enter producer";
        Vue.$toast.open({
          message: "Please enter valid producer name.",
          position: "top",
          type: "error",
        });
        this.seen = false;
      } else if (this.logitudeLatitude == null || this.logitudeLatitude == "") {
        //   this.erroMessage = "Please enter estimated fruits";
        Vue.$toast.open({
          message: "Selected producer not having longitude and latitude",
          position: "top",
          type: "error",
        });
        this.seen = false;
      } else if (this.productId == null || this.productId == "") {
        // this.erroMessage = "Please select productid";
        Vue.$toast.open({
          message: "Please select product.",
          position: "top",
          type: "error",
        });
        this.seen = false;
      } else if (this.estimatedFruit == null || this.estimatedFruit == "") {
        //   this.erroMessage = "Please enter estimated fruits";
        Vue.$toast.open({
          message: "Please enter estimated fruits.",
          position: "top",
          type: "error",
        });
        this.seen = false;
      } else if (!Number.isInteger(Number(this.estimatedFruit))) {
        Vue.$toast.open({
          message: "Please enter a valid fruit count",
          position: "top",
          type: "error",
        });
        this.seen = false;
      } else if (this.organizationSelected == null) {
        Vue.$toast.open({
          message: "Please select organization",
          position: "top",
          type: "error",
        });
        this.seen = false;
      } else {
        currentVal.linearId = uuid.v1();
        currentVal.requestedOnDate = moment.utc().toString(); //remove this line when block chain added
        if (this.networkStatus) {
          currentVal.pushDataToFirebase(currentVal.checkDuplicates);
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: "Please check the internet connection",
            type: "error",
            position: "top",
          });
        }
      }
    },
    createAPICall: function () {
      let currentVal = this;
      return new Promise(function (resolve, reject) {
        const data = {
          id: currentVal.linearId,
          displayId: currentVal.displayId,
          farmerId: currentVal.farmerId,
          producer: currentVal.producer,
          location: currentVal.logitudeLatitude,
          department: currentVal.department,
          town: currentVal.town,
          requestedOn: moment
            .utc(String(currentVal.requestedOnDate))
            .format("YYYY-MM-DDTHH:mm:ss"),
          estimatedNoFruits: currentVal.estimatedFruit,
          product: currentVal.getFruit(currentVal.productId),
          status: "New",
          phoneNo: currentVal.phoneNumber,
          cin: currentVal.cin,
          nif: currentVal.nif,
        };
        if (data.phoneNo && data.phoneNo.length > 7) {
          currentVal.axios
            .post(
              `${getConfigVars().BASE_URL}50005/api/v1.0/create-servicerequest`,
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + localStorage.IDtoken,
                },
              }
            )
            .then(function () {
              resolve();
            })
            .catch(function (error) {
              //refresh token
              let errorObject = JSON.parse(JSON.stringify(error));
              console.log(errorObject);
              if ((error.response.status == 401) || (errorObject.message.indexOf("401") > -1)) {
                firebase
                  .auth()
                  .currentUser.getIdToken(true)
                  .then((idtoken) => {
                    localStorage.IDtoken = "";
                    localStorage.IDtoken = idtoken;
                    currentVal
                      .createAPICall()
                      .then((resolveData) => resolve(resolveData))
                      .catch((error) => reject(error));
                  });
              } else {
                reject(error);
              }
            });
        } else {
          currentVal.seen = false;
          Vue.$toast.open({
            message: `Couldn't create service request as the phone number is invalid.`,
            position: "top",
            type: "error",
          });
        }
      });
    },
    checkDuplicates(farmerRecords, data) {
      let currentValue = this;
      // records exist
      console.log(farmerRecords);
      console.log(data);
      if (farmerRecords.length > 0) {
        let canServiceRequestBeMade = true;
        farmerRecords.forEach(function (record) {
          console.log(record);
          if (
            record.product == data.product &&
            moment.utc(record.requestedOn).format("YYYY-MM-DD") ==
              moment.utc(data.requestedOn).format("YYYY-MM-DD")
          ) {
            canServiceRequestBeMade = false;
          }
        });
        if (canServiceRequestBeMade) {
          // unique request
          // create corda api call first

          currentValue.createServiceRequest(data);
        } else {
          // duplicate request.
          Vue.$toast.open({
            message: "Similar service request by same producer exists.",
            position: "top",
            type: "error",
          });
          currentValue.seen = false;
        }
      } else {
        // new request
        currentValue.createServiceRequest(data);
      }
    },
    createServiceRequest(inpData) {
      let currentValue = this;
      currentValue
        .createAPICall()
        .then(function () {
          console.log("Updated in Corda Database.");
          inpData.serviceRequestcreatedBy = localStorage.userName;
          firebase
            .database()
            .ref()
            .child("serviceRequest")
            .push(inpData)
            .then(function () {
              console.log("Updated in firebase.");
              currentValue.seen = false;
              Vue.$toast.open({
                message:
                  "New service request created successfully. Service Request Id : " +
                  currentValue.displayId,
                type: "success",
                position: "top",
              });
            });
          currentValue.showDashboard();
        })
        .catch(function (error) {
          console.log(error);
          Vue.$toast.open({
            message: error,
            type: "error",
            position: "top",
          });
          currentValue.showDashboard();
        });
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("dashboard");
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
    },
  },
};
</script>
<style scoped>
.new-req-v-select {
  margin-top: -4px !important;
}
.inp-user {
  margin-top: -10px !important;
}
</style>
<style>
.new-req-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 0px 0px 0px 0px !important;
}
.new-req-v-select {
  font-size: 13px;
}
.new-req-v-select span,
.new-req-v-select input,
.new-req-v-select .vs__no-options {
  color: #fff;
}
.new-req-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.new-req-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.new-req-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.new-req-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.new-req-v-select .vs__open-indicator,
.new-req-v-select .vs__clear {
  fill: #fff;
}
.new-req-v-select .vs__selected-options,
.new-req-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.new-req-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.new-req-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.new-req-v-select .vs__clear {
  margin-top: -10px;
}
.new-req-v-select .vs__open-indicator {
  margin-top: -5px;
}
</style>
<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";

.cancel-btn {
  height: 30px;
  margin: 0px 10px 0px 0px !important;
}
.e-input {
  border-bottom: none;
}

.close-img {
  width: 16px !important;
  height: auto !important;
  float: right !important;
  margin-top: -20px !important;
  cursor: pointer;
  margin-right: 8px;
}
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
  margin-right: 9px;
  background: #92d050;
  color: #fff;
  border: none;
  /* padding: 5px 0px 5px 0px; */
  cursor: pointer;
  font-size: 13px !important;
  float: right;
  /* margin-right: 23px; */
  margin-right: 25px;
  height: 30px;
  padding: auto;
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
  font-size: 16px;
  padding: 2px;
  background-repeat: no-repeat;
  background-position: left;
  background-size: 25px 25px;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  /* color: aliceblue; */
  opacity: 1; /* Firefox */
  color: #a8a8a8 !important;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  /* color: aliceblue; */
  color: #a8a8a8 !important;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  /* color: aliceblue; */
  color: #a8a8a8 !important;
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
  width: 27%;
  float: left;
  margin: 10px;
  text-align: left;
}
.inp-container {
  width: 66%;
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
  /* height: auto; */
  height: 50px !important;
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
  margin-top: 40px;
  margin-left: 15px !important;
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
.img-words {
  width: 13px;
}
.imp-container-loc {
  position: relative;
}
.inp-loc-words {
  padding-left: 15px;
}
@media screen and (max-width: 1220px) and (min-width: 768px) {
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
  font-size: 16px !important;
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
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
.e-dropdownbase .e-list-item {
  background: red !important;
}
::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  /* color: aliceblue; */
  opacity: 1; /* Firefox */
  color: #a8a8a8 !important;
}

:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  /* color: aliceblue; */
  color: #a8a8a8 !important;
}

::-ms-input-placeholder {
  /* Microsoft Edge */
  /* color: aliceblue; */
  color: #a8a8a8 !important;
}
input[type="text"],
input[type="number"] {
  font-size: 13px !important;
}
.tooltip {
  position: relative;
  display: inline-block;
  opacity: 1;
  font-size: 14px;
  text-align: center;
  z-index: 1;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 70px;
  background-color: #3a4527;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Position the tooltip */
  position: absolute;
  z-index: 99999;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.whatwords-tooltiptext {
  width: 250px !important;
  text-align: left !important;
  padding: 10px !important;
  bottom: -15px;
}
.whatwords-img-wrap {
  width: 20%;
  float: right;
}
.what-words {
  width: 80%;
  float: left;
  text-align: left;
  word-break: break-all;
  text-decoration: underline;
}
.whatwords-wrap-active-sr {
  width: 100%;
  cursor: pointer;
  position: absolute;
  top: -5px;
  text-align: left;
}
.a-text {
  color: #fff;
}
.a-text:hover,
.a-text:active,
.a-text:focus {
  color: #fff;
  outline: none;
  text-decoration: none;
}
.whatwords-tooltiptext-sr {
  left: 21px;
}
.what-3-words-location {
  color: #fff;
  text-decoration: underline;
  position: relative;
  top: 8px;
  left: -50px;
}
</style>
