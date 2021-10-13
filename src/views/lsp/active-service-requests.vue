<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-lg-12 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Active Service Requests", "Active Service Requests") }}
          </h3>
          <div class="icon-container">
            <ul>
              <li v-if="showIcons">
                <img
                  @click="showServiceRequests"
                  class="sub-header-imgs"
                  src="../../assets/images/list_view.png"
                />
              </li>
              <li v-if="showIcons">
                <img
                  @click="showMapView"
                  class="sub-header-imgs"
                  src="../../assets/images/map_view.png"
                />
              </li>
              <li v-if="showIcons">
                <img
                  @click="showCalenderView"
                  class="sub-header-imgs"
                  src="../../assets/images/calendar_view.png"
                />
              </li>
              <li>
                <img
                  @click="showDashboard"
                  class="sub-header-close-img"
                  src="../../assets/images/close.png"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="main-container">
          <div id="people">
            <v-client-table
              :data="serviceRequests"
              :columns="columns"
              :options="options"
              class="tbl-services active-service-table"
            >
              <template slot="Select" slot-scope="props">
                <div>
                  <input
                    type="checkbox"
                    :checked="props.row.selected"
                    v-model="checkedRows"
                    :value="props.row"
                  />
                </div>
              </template>

              <template slot="Location" slot-scope="props">
                <div>
                  <div class="location-text">{{ props.row.Location }}</div>
                  <a class="fa fa-edit" v-on:click="showMap(props.row.Id)">
                    <img
                      class="location-img"
                      src="../../assets/images/location_pin.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="what3words" slot-scope="props">
                <div class="whatwords-wrap-active-sr tooltip whatwords-wrap-tooltip">
                  <span
                    class="tooltiptext whatwords-tooltiptext whatwords-tooltiptext-asr"
                  >
                    {{ $t("Mots", "Mots") }}: {{ props.row.words }}
                    <br />
                    {{ $t("Pays", "Pays") }}: {{ props.row.country }}
                    <br />
                    {{ $t("Lieu le plus proche", "Lieu le plus proche") }}:
                    {{ props.row.nearestPlace }}
                  </span>
                  <a class="a-text" target="_blank" :href="props.row.map">
                    <div class="what-words">{{ props.row.words }}</div>
                    <div class="whatwords-img-wrap">
                      <img
                        class="location-img"
                        src="../../assets/images/location_pin.png"
                      />
                    </div>
                  </a>
                </div>
              </template>
              <template slot="Plan" slot-scope="props">
                <div v-if="Number(noOfRowsChecked) == 0">
                  <a class="btn-edit" @click="sendInfo(props.row)">
                    <img
                      class="location-img plan-img"
                      src="../../assets/images/plan.png"
                    />
                  </a>
                </div>
              </template>
            </v-client-table>
            <input
              type="button"
              v-if="Number(noOfRowsChecked) > 0"
              class="btn-save pickup-save"
              v-on:click="schedulePickup"
              :value="$t('Schedule Pickup', 'Schedule Pickup')"
            />
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
      <b-modal
        hide-footer
        id="modal"
        ref="pickup-modal"
        hide-backdrop
        class="pickup-modal-wrap"
        :title="$t('Plan and Schedule Pickup', 'Plan and Schedule Pickup')"
      >
        <div class="inp-container">
          <v-select
            v-model="collector"
            :placeholder="$t('Collector', 'Collector')"
            class="active-req-v-select collector"
            :options="collectors"
          ></v-select>
        </div>
        <div class="inp-container datepicker-wrap active-sr-datepicker">
          <datetime
            type="datetime"
            v-model="dateTime"
            input-class="my-class datepicker"
            :placeholder="$t('Date of Pickup', 'Date of Pickup')"
            :phrases="{
              ok: $t('Save', 'Save'),
              cancel: $t('Cancel', 'Cancel'),
            }"
            :hour-step="1"
            :minute-step="30"
            :week-start="7"
            use12-hour
            auto
            :min-datetime="minDate"
          ></datetime>
        </div>
        <div class="inp-container">
          <v-select
            v-model="collectionpoint"
            :placeholder="$t('Collection Point', 'Collection Point')"
            class="active-req-v-select collectionpoint"
            :options="collectionPoints"
          ></v-select>
        </div>
        <div class="inp-container">
          <v-select
            v-model="dropoffatpackhouse"
            :placeholder="$t('Drop Off At Packhouse', 'Drop Off At Packhouse')"
            class="active-req-v-select dropoff"
            :options="packHouse"
          ></v-select>
        </div>
        <div class="mandatory-warning">
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>
        <label class="lbl-errormessage">{{ errorMessage }}</label>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="planPickUp"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
      </b-modal>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        :title="$t('Status', 'Status')"
        id="modalnew"
        hide-backdrop
      >
        <label class="lbl-modal-success">{{ succesContent }}</label>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase, { functions } from "firebase";
import axios from "axios";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import "../../assets/css/common.css";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import { AutoCompletePlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(AutoCompletePlugin);
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);
import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import sendSMS from "../../shared/sms-service";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import Offline from "v-offline";

//working

Vue.use(VueToast);

Vue.use(Datetime);

Vue.use(BootstrapVue);
Vue.use(ClientTable);
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  name: "active-service-requests",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Select",
        "Organization",
        "Service Request Id",
        "collectionRequestedOn",
        "Product",
        "Producer",
        "Department / Town",
        "Location",
        "what3words",
        "Estimated Fruits #",
        "Plan",
      ],
      seen: true,
      show: false,
      selectedRow: null,
      sportsData: ["Mango", "Pineapple", "Avocado"],
      collector: null,
      collectionpoint: null,
      dropoffatpackhouse: null,
      dateTime: null,
      userName: "",
      collectionPoints: [],
      collectors: [],
      packHouse: [],
      errorMessage: "",
      succesContent: "",
      showIcons: true,
      minDate: new Date().toISOString(),
      apiData: null,
      checkedRows: [],
      noOfRows: 0,
      penaltyDays: null,
      penaltyType: null,
      coordsData: "",
      networkStatus: true,
      options: {
        perPage: 10,
        orderBy: {
          ascending: false,
          column: "Service Request Id",
        },

        sortable: ["Producer", "collectionRequestedOn", "Organization"],
        headings: {
          Select: `${this.$t("Select", "Select")}`,
          "Service Request Id": `${this.$t("Service Request Id", "Service Request Id")}`,
          collectionRequestedOn: `${this.$t(
            "Collection Requested On",
            "Collection Requested On"
          )}`,
          Product: `${this.$t("Product", "Product")}`,
          Producer: `${this.$t("Producer", "Producer")}`,
          "Department / Town": `${this.$t("Department / Town", "Department / Town")}`,
          Location: `${this.$t("Location", "Location")}`,
          what3words: "what3words",
          "Estimated Fruits #": `${this.$t("Estimated Fruits #", "Estimated Fruits #")}`,
          Plan: `${this.$t("Plan", "Plan")}`,
        },
      },
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
          text: this.$t("Packhouse Incharge-Dashboard", "Packhouse Incharge-Dashboard"),
          href: "/pack-house-incharge-dashboard",
        },
        {
          text: this.$t("Active Service Requests", "Active Service Requests"),
          href: "/active-service-requests",
        },
      ]);
    } else {
      if (localStorage.systemRole == 99) {
        if (getConfigVars().USERID == isAuthenticated()) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t(
                "Technology Service Provider-Dashboard",
                "Technology Service Provider-Dashboard"
              ),
              href: "/sa-dashboard",
            },
            {
              text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
              href: "/lsp-dashboard",
            },
            {
              text: this.$t(
                "Packhouse Incharge-Dashboard",
                "Packhouse Incharge-Dashboard"
              ),
              href: "/pack-house-incharge-dashboard",
            },
            {
              text: this.$t("Active Service Requests", "Active Service Requests"),
              href: "/active-service-requests",
            },
          ]);
        } else {
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
                "Packhouse Incharge-Dashboard",
                "Packhouse Incharge-Dashboard"
              ),
              href: "/pack-house-incharge-dashboard",
            },
            {
              text: this.$t("Active Service Requests", "Active Service Requests"),
              href: "/active-service-requests",
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
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t("Active Service Requests", "Active Service Requests"),
            href: "/active-service-requests",
          },
        ]);
      } else if (localStorage.systemRole == 96) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t("Packhouse Incharge-Dashboard", "Packhouse Incharge-Dashboard"),
            href: "/pack-house-incharge-dashboard",
          },
          {
            text: this.$t("Active Service Requests", "Active Service Requests"),
            href: "/active-service-requests",
          },
        ]);
      } else if (localStorage.systemRole == 2) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Packhouse Incharge-Dashboard", "Packhouse Incharge-Dashboard"),
            href: "/pack-house-incharge-dashboard",
          },
          {
            text: this.$t("Active Service Requests", "Active Service Requests"),
            href: "/active-service-requests",
          },
        ]);
      } else if (localStorage.systemRole == 7) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
            href: "/op-admin-dashboard",
          },
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t("Active Service Requests", "Active Service Requests"),
            href: "/active-service-requests",
          },
        ]);
      }
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.options = {
      perPage: 10,
      orderBy: {
        ascending: false,
        column: "Service Request Id",
      },
      sortable: ["Producer", "collectionRequestedOn", "Organization"],
      headings: {
        Select: `${this.$t("Select", "Select")}`,
        "Service Request Id": `${this.$t("Service Request Id", "Service Request Id")}`,
        collectionRequestedOn: `${this.$t(
          "Collection Requested On",
          "Collection Requested On"
        )}`,
        Product: `${this.$t("Product", "Product")}`,
        Producer: `${this.$t("Producer", "Producer")}`,
        "Department / Town": `${this.$t("Department / Town", "Department / Town")}`,
        Location: `${this.$t("Location", "Location")}`,
        what3words: "what3words",
        "Estimated Fruits #": `${this.$t("Estimated Fruits #", "Estimated Fruits #")}`,
        Plan: `${this.$t("Plan", "Plan")}`,
      },
    };
    this.getData();

    this.userName = localStorage.userName;
  },
  computed: {
    // a computed getter
    noOfRowsChecked: function () {
      // `this` points to the vm instance
      return this.checkedRows.length;
    },
  },
  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    createRejectLotAPI(serviceId) {
      let currentVal = this;
      return new Promise((resolve, reject) => {
        const data = {
          id: serviceId,
          status: "Rejected",
          rejectedOn: moment().utc().format("YYYY-MM-DDTHH:mm:ss").toString(),
          rejectReason: "Scheduled after 10 days",
          rejectAddionalNote: "",
        };

        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50009/api/v1.0/reject-lot`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            currentVal
              .checkPenalityAPI(serviceId)
              .then((resolved) => resolve(resolved))
              .catch((error) => reject(error));
          })
          .catch(function (error) {
            let errorObject = JSON.parse(JSON.stringify(error));
            if (error.response.status == 401 || errorObject.message.indexOf("401") > -1) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal
                    .createRejectLotAPI(serviceId)
                    .then((resolved) => {
                      currentVal
                        .checkPenalityAPI(serviceId)
                        .then((resolved) => resolve(resolved))
                        .catch((error) => reject(error));
                    })
                    .catch((error) => reject(error));
                });
            }
          });
      });
    },
    schedulePickup: function () {
      const vm = this;
      let flag = true;
      if (vm.checkedRows.length > 0) {
        const orgKey = this.checkedRows[0].organizationKey;
        this.checkedRows.forEach((request, index) => {
          if (orgKey != request.organizationKey) {
            Vue.$toast.open({
              message: vm.$t(
                "Please select service requests belonging to same organization.",
                "Please select service requests belonging to same organization."
              ),
              type: "error",
              position: "top",
            });
            flag = false;
            return false;
            vm.seen = false;
          }
        });
      }
      if (flag) {
        this.getCollectors();
        this.getCollectionPoints();
        this.getPackHouse();
        this.$refs["pickup-modal"].show();
      }
    },
    getData: function () {
      let currentValue = this;
      currentValue.serviceRequests = [];
      var count = 0;
      var dbRef = firebase.database().ref("masters/what3words");
      var ref = firebase.database().ref().child("serviceRequest");

      ref
        .orderByChild("status")
        .equalTo("New")
        .on("child_added", (snapshot) => {
          if (snapshot.val() != null) {
            var status = "";
            var depttown = "";
            if (snapshot.val().Status == "New") {
              status = "Pending Assign";
            }
            if (snapshot.val().organizationKey == localStorage.organizationKey) {
              // if not super admin
              dbRef
                .orderByKey()
                .equalTo(snapshot.val().farmerId)
                .on("child_added", (response) => {
                  const _data = {
                    "Service Request Id":
                      snapshot.val().displayId != undefined &&
                      snapshot.val().displayId != null
                        ? snapshot.val().displayId
                        : snapshot.val().serviceRequestId,
                    collectionRequestedOn: moment(String(snapshot.val().requestedOn))
                      .local()
                      .format("MMM DD, YYYY hh:mm A"),
                    Product: `${currentValue.$t(
                      snapshot.val().product,
                      snapshot.val().product
                    )}`,
                    Producer: snapshot.val().producer,
                    "Department / Town":
                      snapshot.val().department + " / " + snapshot.val().town,
                    Location: snapshot.val().location,
                    words: response.val().words,
                    country: response.val().country,
                    nearestPlace: response.val().nearestPlace,
                    map: response.val().map,
                    "Estimated Fruits #": snapshot.val().estimatedNoFruits,
                    Id: snapshot.val().serviceRequestId,
                    requestedOn: snapshot.val().requestedOn,
                    phoneNumber: snapshot.val().phoneNumber,
                    Organization: snapshot.val().organization,
                    organization: snapshot.val().organization,
                    organizationKey: snapshot.val().organizationKey,
                  };
                  currentValue.serviceRequests.push(_data);
                });
            } else if (localStorage.systemRole.includes(99)) {
              // if super admin
              dbRef
                .orderByKey()
                .equalTo(snapshot.val().farmerId)
                .on("child_added", (response) => {
                  const _data = {
                    "Service Request Id":
                      snapshot.val().displayId != undefined &&
                      snapshot.val().displayId != null
                        ? snapshot.val().displayId
                        : snapshot.val().serviceRequestId,
                    collectionRequestedOn: moment(String(snapshot.val().requestedOn))
                      .local()
                      .format("MMM DD, YYYY hh:mm A"),
                    Product: `${currentValue.$t(
                      snapshot.val().product,
                      snapshot.val().product
                    )}`,
                    Producer: snapshot.val().producer,
                    "Department / Town":
                      snapshot.val().department + " / " + snapshot.val().town,
                    Location: snapshot.val().location,
                    words: response.val().words,
                    country: response.val().country,
                    nearestPlace: response.val().nearestPlace,
                    map: response.val().map,
                    "Estimated Fruits #": snapshot.val().estimatedNoFruits,
                    Id: snapshot.val().serviceRequestId,
                    requestedOn: snapshot.val().requestedOn,
                    phoneNumber: snapshot.val().phoneNumber,
                    Organization: snapshot.val().organization,
                    organization: snapshot.val().organization,
                    organizationKey: snapshot.val().organizationKey,
                  };
                  currentValue.serviceRequests.push(_data);
                });
            }
            currentValue.serviceRequests.reverse();
            currentValue.seen = false;
            currentValue.show = true;
          }
        });

      setTimeout(function () {
        if (currentValue.serviceRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 8000);
    },

    hideModal: function () {
      this.$refs["pickup-modal"].hide();
    },
    planPickUp: function (event) {
      this.seen = true;
      if (this.collector == null || this.collector == "") {
        this.seen = false;

        Vue.$toast.open({
          message: this.$t("Please select Collector.", "Please select Collector."),
          type: "error",
          position: "top",
        });
      } else if (this.dateTime == null || this.dateTime == "") {
        this.seen = false;

        Vue.$toast.open({
          message: this.$t("Please select Date.", "Please select Date."),
          type: "error",
          position: "top",
        });
      } else if (this.collectionpoint == null || this.collectionpoint == "") {
        this.seen = false;

        Vue.$toast.open({
          message: this.$t(
            "Please select Collection Point.",
            "Please select Collection Point."
          ),
          type: "error",
          position: "top",
        });
      } else if (this.dropoffatpackhouse == null || this.dropoffatpackhouse == "") {
        this.seen = false;
        Vue.$toast.open({
          message: this.$t(
            "Please select Drop Off At Packhouse.",
            "Please select Drop Off At Packhouse."
          ),
          type: "error",
          position: "top",
        });
      } else {
        if (this.networkStatus) {
          let currentValue = this;
          var dateTimeVal = moment(String(new Date())).format("YYYY-MM-DD HH:mm:ss");

          var inpData = {
            status: "Assigned",
            pickupAddedOn: moment.utc().toString(),
            collector: this.collector,
            collectionPoint: this.collectionpoint.title,
            collectionPointCoord: this.collectionpoint.location,
            dropOffAtPackhouse: this.dropoffatpackhouse,
            dateOfPickup: moment(this.dateTime).utc().toString(),
          };
          if (this.checkedRows.length == 0) {
            currentValue.updatePlannedPickUpData(currentValue.selectedRow.Id, inpData);
          } else {
            this.checkedRows.forEach(function (dataVal, index) {
              currentValue.selectedRow = null;
              currentValue.selectedRow = dataVal;
              currentValue.updatePlannedPickUpData(dataVal.Id, inpData, index);
            });
          }
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: this.$t(
              "Please check the internet connection",
              "Please check the internet connection"
            ),
            type: "error",
            position: "top",
          });
        }
      }
    },
    updatePlannedPickUpData: function (serviceId, inpData, index) {
      let currentValue = this;
      let dateCalc = "";
      dateCalc = currentValue.checkDates(inpData);

      currentValue.penaltyDays = dateCalc;
      if (dateCalc > 7 && dateCalc <= 10) {
        currentValue.penaltyType = "AH_LSP_ACCEPT_DELAY";

        Vue.$toast.open({
          message: currentValue.$t("7 days penalty levied.", "7 days penalty levied."),
          type: "error",
          position: "top",
        });
        //send SMS
        let formattedDate = moment
          .utc(inpData.dateOfPickup)
          .local()
          .format("MMM DD, YYYY hh:mm A");
        sendSMS(
          currentValue.selectedRow.phoneNumber,
          `Nimewo pou jwenn sèvis : ${currentValue.selectedRow["Service Request Id"]}, Pòst pou kolekte: ${inpData.collectionPoint} Jou yo kolete :${formattedDate} `
          // `Service Request No.: ${currentValue.selectedRow["Service Request Id"]}, Collection Point: ${inpData.collectionPoint}  and collected on: ${formattedDate}`
        )
          .then((sent) => console.log(sent))
          .catch((err) => console.log(err));
      }
      if (dateCalc > 10) {
        currentValue.penaltyType = "AH_LSP_DENIAL";
        // sendSMS('ccccc', `Penalty of  Penalty Amount & currency levied for denial in service by 72 hours`)
        //   .then(sent => console.log(sent))
        //   .catch(err => console.log(err))
        Vue.$toast.open({
          message: currentValue.$t("10 days penalty levied.", "10 days penalty levied."),
          type: "error",
          position: "top",
        });
        inpData.status = "Rejected";
        //send SMS
        let formattedDate = moment
          .utc(inpData.dateOfPickup)
          .local()
          .format("MMM DD, YYYY hh:mm A");
        sendSMS(
          currentValue.selectedRow.phoneNumber,
          // `Service Request No.: ${currentValue.selectedRow["Service Request Id"]} has been closed`
          `Nimewo pou jwenn sèvis : ${currentValue.selectedRow["Service Request Id"]} fèmen`
        )
          .then((sent) => console.log(sent))
          .catch((err) => console.log(err));
      }
      if (dateCalc <= 7) {
        let formattedDate = moment
          .utc(inpData.dateOfPickup)
          .local()
          .format("MMM DD, YYYY hh:mm A");
        sendSMS(
          currentValue.selectedRow.phoneNumber,
          `Nimewo pou jwenn sèvis : ${currentValue.selectedRow["Service Request Id"]}, Pòst pou kolekte: ${inpData.collectionPoint} Jou yo kolete :${formattedDate} `
        )
          .then((sent) => console.log(sent))
          .catch((err) => console.log(err));
      }
      inpData.scheduledAfter = dateCalc;
      inpData.scheduledBy = localStorage.userName;
      currentValue.scheduledAfter = dateCalc;
      var dbRef = firebase.database().ref("serviceRequest/");
      dbRef
        .orderByChild("serviceRequestId")
        .equalTo(serviceId)
        .on("child_added", function (data) {
          if (dateCalc > 10) {
            currentValue
              .createRejectLotAPI(serviceId)
              .then((resolved) => {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                ref
                  .update(inpData)
                  .then(function () {
                    currentValue.$refs["pickup-modal"].hide();

                    currentValue.dateTime = null;
                    currentValue.getData();

                    if (
                      currentValue.checkedRows.length == index + 1 ||
                      currentValue.checkedRows.length == 0
                    ) {
                      currentValue.seen = false;
                      if (dateCalc > 10) {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Request and lot got rejected, becuase pick up scheduling after 10 days.",
                            "Request and lot got rejected, becuase pick up scheduling after 10 days."
                          ),
                          type: "success",
                          position: "top",
                        });
                      } else {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Pickup scheduled successfully.",
                            "Pickup scheduled successfully."
                          ),
                          type: "success",
                          position: "top",
                        });
                        currentValue.checkedRows = [];
                        currentValue.collector = null;
                        currentValue.collectionPoint = null;
                        currentValue.dropOffAtPackhouse = null;
                        currentValue.dateTime = null;
                      }
                    }
                  })

                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: error,
                      type: "error",
                      position: "top",
                    });
                  });
              })
              .catch((error) => {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: error,
                  type: "error",
                  position: "top",
                });
              });
          } else {
            currentValue
              .createAPICall(serviceId, inpData)
              .then((resolved) => {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                ref
                  .update(inpData)
                  .then(function () {
                    currentValue.$refs["pickup-modal"].hide();

                    currentValue.dateTime = null;
                    currentValue.getData();
                    if (
                      currentValue.checkedRows.length == index + 1 ||
                      currentValue.checkedRows.length == 0 ||
                      currentValue.checkedRows.length == 1
                    ) {
                      currentValue.seen = false;
                      if (dateCalc > 10) {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Request and lot got rejected, becuase pick up scheduling after 10 days.",
                            "Request and lot got rejected, becuase pick up scheduling after 10 days."
                          ),
                          type: "success",
                          position: "top",
                        });
                      } else {
                        Vue.$toast.open({
                          message: currentValue.$t(
                            "Pickup scheduled successfully.",
                            "Pickup scheduled successfully."
                          ),
                          type: "success",
                          position: "top",
                        });
                        currentValue.checkedRows = [];
                        currentValue.collector = null;
                        currentValue.collectionPoint = null;
                        currentValue.dropOffAtPackhouse = null;
                        currentValue.dateTime = null;
                      }
                    }
                  })

                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: error,
                      type: "error",
                      position: "top",
                    });
                  });
              })
              .catch((error) => {
                currentValue.seen = false;
                Vue.$toast.open({
                  message: error,
                  type: "error",
                  position: "top",
                });
              });
          }
        });
    },
    closeModal() {
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
    },
    getCollectionPoints: function (event) {
      var currentVal = this;
      currentVal.collectionPoints = [];
      var ref = firebase.database().ref().child("masters").child("collectionPoint");

      ref.on("child_added", function (snapshot) {
        let data = {
          title: snapshot.val().title,
          label: snapshot.val().title,
          location: snapshot.val().location || snapshot.val().title,
        };
        const orgKey =
          currentVal.checkedRows.length > 0
            ? currentVal.checkedRows[0].organizationKey
            : currentVal.selectedRow.organizationKey;
        if (snapshot.val().organizationKey == orgKey) {
          currentVal.collectionPoints.push(data);
        }
      });
    },
    getPackHouse: function (event) {
      var currentVal = this;
      currentVal.packHouse = [];
      var ref = firebase.database().ref().child("masters").child("packHouse");

      ref.on("child_added", function (snapshot) {
        if (snapshot.val().organizationKey == localStorage.organizationKey) {
          currentVal.packHouse.push(snapshot.val().title);
        } else if (localStorage.systemRole.includes(99)) {
          const orgKey =
            currentVal.checkedRows.length > 0
              ? currentVal.checkedRows[0].organizationKey
              : currentVal.selectedRow.organizationKey;
          if (snapshot.val().organizationKey == orgKey) {
            currentVal.packHouse.push(snapshot.val().title);
          }
        }
        // currentVal.packHouse.push(requestData.val().title);

        currentVal.packHouse.reverse();
      });
    },
    getCollectors: function (event) {
      var currentVal = this;
      currentVal.collectors = [];
      var ref = firebase.database().ref().child("profile");

      ref.on("child_added", function (snapshot) {
        if (snapshot.val().userRoles != undefined) {
          if (snapshot.val().userRoles.some((user) => user.systemRole === 3)) {
            // selecting organization
            let orgKey =
              currentVal.checkedRows.length > 0
                ? currentVal.checkedRows[0].organizationKey
                : currentVal.selectedRow.organizationKey;

            let collectorNameFullName = `${snapshot.val().firstName} ${
              snapshot.val().lastName
            }`;
            if (snapshot.val().organizationKey == orgKey) {
              currentVal.collectors.push(collectorNameFullName);
            }
          }
        }
      });
    },
    sendInfo(item) {
      this.selectedRow = null;
      this.errorMessage = "";
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
      this.selectedRow = item;
      this.dateTime = "";
      this.$refs["pickup-modal"].show();
      this.getCollectors();
      this.getPackHouse();
      this.getCollectionPoints();
    },
    logout: function (event) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function (error) {
          // alert("Error");
        });
    },
    showMapView: function () {
      Router.push("active-service-map-view");
    },
    showMap: function (id) {
      Router.push("active-service-map/" + id);
    },
    showServiceRequests: function () {
      Router.push("active-service-requests");
    },
    showCalenderView: function () {
      Router.push("active-service-calender-view");
    },
    showDashboard: function () {
      Router.push("pack-house-incharge-dashboard");
    },
    checkDates(inpData) {
      let serviceRequestMadeOn = moment
        .utc(this.selectedRow.requestedOn)
        .format("YYYY-MM-DD HH:mm:ss");
      let currentDate = moment.utc(inpData.pickupAddedOn).format("YYYY-MM-DD HH:mm:ss");
      // to simulate delay add number of days to currentDate().add(7, "d")
      //need to check
      return moment(currentDate).diff(moment.utc(serviceRequestMadeOn), "days") + 1;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("lsp-dashboard");
      }
    },
    createAPICall: function (serviceId, inpData) {
      let currentVal = this;
      var data = null;
      return new Promise((resolve, reject) => {
        data = {
          id: serviceId,
          pickupAddedOn: moment
            .utc(String(inpData.pickupAddedOn))
            .format("YYYY-MM-DDTHH:mm:ss"),
          collectorName: inpData.collector,
          collectionPoint: inpData.collectionPoint,
          dropOffAtPackhouse: inpData.dropOffAtPackhouse,
          dateOfPickup: moment
            .utc(String(inpData.dateOfPickup))
            .format("YYYY-MM-DDTHH:mm:ss"),
          scheduled: "true",
          amount: 0, // no data from UI
          scheduledAfter: inpData.scheduledAfter,
          status: "Assigned",
        };
        currentVal
          .acceptServiceRequestAPICall(data)
          .then((resolved) => resolve(resolved))
          .catch((error) => reject(error));
      });
    },
    checkPenalityAPI(serviceId) {
      let currentVal = this;
      return new Promise((resolve, reject) => {
        const data = {
          id: serviceId,
        };
        currentVal.axios
          .post(`${getConfigVars().BASE_URL}50005/api/v1.0/penalties`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            let errorObject = JSON.parse(JSON.stringify(error));
            if (error.response.status == 401 || errorObject.message.indexOf("401") > -1) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  currentVal
                    .checkPenalityAPI(serviceId)
                    .then((resolved) => resolve(resolved))
                    .catch((error) => reject(error));
                });
            }
          });
      });
    },
    acceptServiceRequestAPICall(data) {
      const vm = this;
      return new Promise(function (resolve, reject) {
        vm.axios
          .post(
            `${getConfigVars().BASE_URL}50007/api/v1.0/accept-service-request`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            //alert("fail");
            let errorObject = JSON.parse(JSON.stringify(error));
            if (error.response.status == 401 || errorObject.message.indexOf("401") > -1) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  vm.acceptServiceRequestAPICall(data)
                    .then(function (resolvedData) {
                      resolve(resolvedData);
                    })
                    .catch((error) => reject(error));
                });
            }
          });
      });
    },
    getHarvestPlannersList() {
      let harvestPlanners = [];
      return new Promise((resolve, reject) => {
        const ref = firebase
          .database()
          .ref()
          .child("profile")
          .orderByChild("systemRole")
          .equalTo(1);

        ref.on("value", function (snapshot) {
          snapshot.forEach((requestData) => {
            if (
              localStorage.systemRole == 99 ||
              localStorage.systemRole == 9 ||
              localStorage.systemRole == 7
            ) {
              if (requestData.val().createdBy) {
                harvestPlanners.push(
                  `${requestData.val().firstName} ${requestData.val().lastName}`
                );
              }
            } else {
              if (
                requestData.val().createdBy &&
                requestData.val().createdBy == localStorage.userName
              ) {
                if (requestData.val().createdBy) {
                  harvestPlanners.push(
                    `${requestData.val().firstName} ${requestData.val().lastName}`
                  );
                }
              }
            }
          });
          resolve(harvestPlanners);
        });
      });
    },
  },
};
</script>
<style scoped>
.header-container {
  height: 50px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.modal-header {
  height: 50px !important;
  padding: 9px !important;
}
.active-service-table tbody tr td:nth-child(8),
.active-service-table thead tr th:nth-child(8) {
  text-align: center !important;
}
.active-req-v-select .vs__open-indicator {
  z-index: 1;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#modal .modal-header {
  height: 50px !important;
}
#modal .modal-header .close {
  margin-top: -12px !important;
}
#modal .modal-header h5 {
  margin: -10px auto !important;
}
.active-req-v-select .vs__dropdown-toggle {
  border: none;
}
.active-req-v-select {
  font-size: 13px;
}
.active-req-v-select span,
.active-req-v-select input,
.active-req-v-select .vs__no-options {
  color: #fff;
}
.active-req-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.active-req-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.active-req-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.active-req-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.active-req-v-select .vs__open-indicator,
.active-req-v-select .vs__clear {
  fill: #fff;
}
.active-req-v-select .vs__selected-options,
.active-req-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.active-req-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 0px 0px;
}
.active-req-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.active-req-v-select .vs__clear {
  margin-top: -10px;
}
.active-req-v-select .vs__open-indicator {
  margin-top: -5px;
}
.lbl-modal-success {
  color: #fff;
}
.pickup-save {
  float: right !important;
  margin-right: -1px !important;
}
.dropdownlist_options {
  background: transparent !important;
  color: #fff;
  padding: 0 !important;
}
.button-container {
  float: right;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 13px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
.lbl-errormessage {
  color: red;
}
ul {
  padding: 0 !important;
}
.e-dropdownbase .e-list-item {
  color: #fff;
  list-style-type: none;
  padding-left: 20px;
}
#dropdownlist_popup {
  color: #fff;
}
#dropdownlist_popup > .e-content {
  color: #fff;
}
.e-input-group:focus {
  outline: none !important;
}
.e-input-group .e-input-group-icon,
.e-input-group.e-control-wrapper .e-input-group-icon {
  color: #fff !important;
}
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-input-group.e-control-wrapper:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap {
  border-color: #fff !important;
}
.e-input-group:not(.e-disabled):not(.e-float-icon-left)::before,
.e-input-group:not(.e-disabled):not(.e-float-icon-left)::after,
.e-input-group.e-float-icon-left:not(.e-disabled) .e-input-in-wrap::before,
.e-input-group.e-float-icon-left:not(.e-disabled) .e-input-in-wrap::after,
.e-input-group.e-control-wrapper:not(.e-disabled):not(.e-float-icon-left)::before,
.e-input-group.e-control-wrapper:not(.e-disabled):not(.e-float-icon-left)::after,
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-disabled)
  .e-input-in-wrap::before,
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-disabled)
  .e-input-in-wrap::after {
  background: transparent !important;
}

.modal-title {
  margin: 0 auto !important;
  color: #fff !important;
}
.active-sr-datepicker .datepicker {
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  border-radius: 0 !important;
  outline: 0 !important;
  height: 43px;
  margin: 0 !important;
}
.active-sr-datepicker .datepicker:focus {
  box-shadow: none !important;
}
.active-sr-datepicker .datepicker {
  background-image: url("../../assets/images/calendar_view2.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
  font-size: 13px;
  margin-top: 0px !important;
}
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
::-moz-placeholder {
  /* Firefox 19+ */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
:-ms-input-placeholder {
  /* IE 10+ */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
:-moz-placeholder {
  /* Firefox 18- */
  font-size: 13px;
  color: #a8a8a8 !important;
  /* color: #fff !important; */
}
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
}
.btn-primary,
.btn-secondary {
  width: 120px;
}
.active-service-table tbody tr td:nth-child(3) {
  width: 200px;
}
.active-service-table tbody tr td:nth-child(6),
.active-service-table thead tr th:nth-child(6) {
  text-align: center !important;
}
.active-service-table tbody tr td:nth-child(8),
.active-service-table thead tr th:nth-child(8) {
  /* text-align: right !important; */
  text-align: center !important;
}
.active-service-table tbody tr td:nth-child(7),
.active-service-table thead tr th:nth-child(7) {
  text-align: center !important;
  /* padding-right: 80px !important; */
}
thead tr th {
  font-weight: 400;
}
tbody tr td {
  font-weight: 400;
}
.modal-body {
  padding: 30px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.modal-header h5 {
  font-size: 1.75rem;
  font-weight: 400;
}
.modal {
  display: table !important;
}
.modal.show .modal-dialog {
  display: table-cell;
  vertical-align: middle;
}
.modal-content {
  min-width: 500px;
  max-width: 500px;
  margin: 0px auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

.active-service-table th:nth-child(3),
.active-service-table td:nth-child(3) {
  text-align: left !important;
}
.active-service-table thead tr th {
  font-weight: bold;
}
.active-service-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.active-service-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.active-req-v-select {
  position: relative !important;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  padding: 10px 0px;
  margin: 0px 0px 0px 0px !important;
}
@media screen and (max-width: 768px) {
  .active-service-table tbody tr td:nth-child(6) {
    padding-right: 20px !important;
  }
}
</style>
<style scoped>
.collector {
  background-image: url("../../assets/images/collector.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
}
.collectionpoint {
  background-image: url("../../assets/images/collection_point.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
}
.dropoff {
  background-image: url("../../assets/images/packhouse.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
}

.dropdownlist {
  width: 95%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff !important;
  height: 36px;
}
#dropdownlist_hidden {
  float: right;
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  width: 100%;
  color: #fff;
  height: 36px;
}
.inp-container {
  margin-bottom: 15px;
}
.e-input-group .e-control-wrapper .e-ddl .e-lib .e-keyboard {
  width: 100%;
}
.input-container {
  width: 68%;
  float: left;
  margin: 10px;
  text-align: left;
}
.active-service-table tbody tr td:nth-child(4) {
  text-align: right;
}
.location-text {
  float: left;
  min-width: 135px;
  display: none;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: 59px !important;
  margin: 5px 0px 3px 0px !important;
}
.product-container {
  text-align: center;
  margin: 10px 10px 30px 10px;
}
p {
  color: #fff;
  text-align: center;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
  height: 125px;
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
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-weight: 400;
}
.container-bg {
  position: absolute;
  background-image: url("../../assets/images/bg10.png");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
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
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: -30px;
}

.VueTables__heading {
  color: #fff !important;
}
.column-content {
  color: #fff !important;
}
/* table design */
.btn-edit {
  cursor: pointer;
  color: blue !important;
}
.VuePagination {
  text-align: center;
}

.vue-title {
  text-align: center;
  margin-bottom: 10px;
}

.vue-pagination-ad {
  text-align: center;
}

.glyphicon.glyphicon-eye-open {
  width: 16px;
  display: block;
  margin: 0 auto;
}
.VueTables__child-row-toggler {
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: block;
  margin: auto;
  text-align: center;
}

.VueTables__child-row-toggler--closed::before {
  content: "+";
}

.VueTables__child-row-toggler--open::before {
  content: "-";
}
.tbl-services {
  color: #fff !important;
  padding: 10px;
  background: rgba(0, 0, 0, 0.3);
}
.tbl-services table {
  color: #fff !important;
}
.table {
  color: #fff !important;
}
td {
  color: #fff !important;
}
.location-img {
  margin-left: 10px;
  width: 15px;
  height: auto;
  cursor: pointer;
}
.control-section {
  padding: 30px;
}
td,
th {
  padding: 5px;
}
ul {
  list-style-type: none;
}
ul li {
  float: left;
  padding: 12px 15px 10px 15px;
}
.sub-header-close-img {
  width: 16px;
  height: auto;
}
.sub-header-imgs {
  width: 22px;
  height: auto;
  cursor: pointer;
}
.icon-container {
  float: right;
  position: relative;
  top: -35px;
}
.manage-img {
  width: 75px !important;
  margin: 5px 0px 3px 0px !important;
}

.new-request-container {
  cursor: pointer;
}

.username-conatiner {
  float: right;
  margin: 20px;
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
}
.main-container {
  background: rgba(0, 0, 0, 0.2);
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
}

.plan-img {
  width: 20px;
  margin-left: 5px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
}
.mandatory-warning {
  position: absolute;
  bottom: 40px;
  font-size: 13px;
  color: #fff;
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
.whatwords-tooltiptext-asr {
  left: 50px;
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 360px) {
  .content-container {
    margin-top: 30px;
  }
}
@media screen and (max-width: 620px) {
  .heading {
    text-align: left !important;
  }
}
</style>
