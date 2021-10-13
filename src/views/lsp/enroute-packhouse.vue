<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div style="clear: both"></div>
      <div class="dashboard-container">
        <button class="back-to-dashboard-btn" @click="goToCollectorDashboard">
          &lt; {{ $t("Dashboard", "Dashboard") }}
        </button>
      </div>
      <div class="col-md-5 details-container planned-pickups-container-wrap">
        <div class="header-container">
          <h6 class="heading planHeading">
            {{ $t("Planned Pickups", "Planned Pickups") }}
          </h6>
        </div>
        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body">
              <div v-if="pickupsList.length == 0">
                <h2 class="card-inside-description">
                  {{ $t("No Data", "No Data") }}
                </h2>
              </div>
              <div v-if="pickupsList.length > 0">
                <div
                  class="outer-container"
                  v-for="(item, index) in pickupsList"
                  :key="index"
                >
                  <div class="photo-container">
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Mango'"
                      src="../../assets/images/mango.png"
                      :alt="$t('Product Picture', 'Product Picture')"
                      class="former-picture produce-picture-mango"
                    />
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Pineapple'"
                      src="../../assets/images/pineapple.png"
                      :alt="$t('Product Picture', 'Product Picture')"
                      class="former-picture"
                    />
                    <img
                      v-if="item.Produce.split(' ')[0] == 'Avocado'"
                      src="../../assets/images/avocado.png"
                      :alt="$t('Product Picture', 'Product Picture')"
                      class="former-picture"
                    />
                  </div>
                  <div class="description-container">
                    <label class="lbl-flname lbl-pickup">
                      <b>{{
                        $t("PickUp Requested On", "PickUp Requested On")
                      }}</b>
                      : {{ $t(item.PickupRequestedOn, item.PickupRequestedOn) }}
                      <input
                        v-on:click="showSelected(item)"
                        type="radio"
                        :name="item.Id"
                        :value="item.Id"
                        :checked="todaysPickups.includes(item.Id)"
                      />
                      <img />
                    </label>

                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Produce", "Produce") }}</b>
                      : {{ $t(item.Produce, item.Produce) }} ({{
                        item.estimatedNoFruits
                      }})
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Producer", "Producer") }}</b>
                      : {{ $t(item.Producer, item.Producer) }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Collect at", "Collect at") }}</b>
                      : {{ $t(item.Collectat, item.Collectat) }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Drop Off At", "Drop Off At") }}</b>
                      : {{ $t(item.DropOffAt, item.DropOffAt) }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Current Status", "Current Status") }}</b>
                      : {{ $t(item.CurrentStatus, item.CurrentStatus) }}
                    </label>
                    <label v-if="isSuperAdmin" class="lbl-flname lbl-pickup">
                      <b>{{ $t("Organization", "Organization") }}</b>
                      : {{ $t(item.organization, item.organization) }}
                    </label>
                    <!-- <label class="lbl-flname lbl-pickup">
                      <b>Request Created By</b>
                      : {{ item.createdBy }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Planned Pickup Added On</b>
                      : {{ item.plannedPickUpAddedOn }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Enroute To Producer Added On</b>
                      : {{ item.enrouteToProducerAddedOn }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Enroute To Producer Added By</b>
                      : {{ item.enrouteToProducerAddedBy }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Enroute To Producer Added By</b>
                      : {{ item.enrouteToProducerAddedBy }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>With Producer Added By</b>
                      : {{ item.withProducerAddedBy }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>With Producer Added On</b>
                      : {{ item.withProducerAddedOn }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>With Producer Payment Method</b>
                      : {{ item.withProducerPaymentMethod }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>With Producer Fruits Harvested</b>
                      : {{ item.withProducerFruitsHarvested }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>With Producer Fruits Rejected</b>
                      : {{ item.withProducerFruitsRejected }}
                    </label>-->
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
      </div>
      <div class="col-md-7 details-container planned-pickups-container-wrap">
        <div class="header-container">
          <h6 class="heading">
            {{ $t("Status - Enroute Packhouse", "Status - Enroute Packhouse") }}
          </h6>
        </div>

        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body card-body-planned-pickup-status">
              <div v-if="todaysPickups.length == 0" class="empty-container">
                <h2 class="card-inside-description">
                  {{
                    $t(
                      "Please Select a Pickup from the list to update Status",
                      "Please Select a Pickup from the list to update Status"
                    )
                  }}
                </h2>
              </div>
              <div v-if="todaysPickups.length > 0" class="enroute-packhouse">
                <v-select
                  v-model="selectedDropOffLocation"
                  :placeholder="$t('Drop-Off location', 'Drop-Off location')"
                  class="planned-pickup-v-select drop-off-loc-planned-pickup"
                  :options="packHouse"
                  label="name"
                ></v-select>
                <input
                  type="text"
                  class="addition-note"
                  v-model="enrouteAdditionalNotes"
                  :placeholder="$t('Additional Notes', 'Additional Notes')"
                />
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div
          v-if="todaysPickups.length > 0"
          class="planned-pickup-mandatory-warning"
        >
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>
        <div
          v-if="todaysPickups.length > 0"
          class="button-container enroute-button-container"
        >
          <input
            type="button"
            v-on:click="cancelSelectedItem"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="updateEnroutePackhouseStatus"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
      </div>
      <div v-if="!networkStatus" class="offline-container">
        <label class="offline-label"
          >{{
            $t("Application is offline now", "Application is offline now")
          }}.</label
        >
      </div>
      <b-modal
        hide-footer
        id="offline-modal"
        class="dqrcode-modal"
        ref="offline-modal"
        hide-backdrop
        no-close-on-backdrop
        :title="$t('Status', 'Status')"
        data-backdrop="static"
      >
        <label class="lbl-offline">
          {{
            $t(
              `There seems to no Internet connectivity. Your data will be automatically
          synchronized the moment connectivity is established. You can continue to
          work with the application in the meanwhile`,
              `There seems to no Internet connectivity. Your data will be automatically
          synchronized the moment connectivity is established. You can continue to
          work with the application in the meanwhile`
            )
          }}.
        </label>
      </b-modal>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import moment from "moment";
import "../../assets/css/producer-list.css";
import "../../assets/css/planned-pickup.css";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(DropDownListPlugin);
import Datetime from "vue-datetime";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue-datetime/dist/vue-datetime.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import uploadFiles from "../../shared/uploa-files";
Vue.use(VueToast);
Vue.use(Datetime);
import VueLodash from "vue-lodash";
import "vue-select/dist/vue-select.css";
import sendSMS from "../../shared/sms-service";
import Header from "../../components/header-view";
import Offline from "v-offline";
import Footer from "../../components/footer-view";
import $ from "jquery";

import vSelect from "vue-select";
Vue.use(VueLodash, { name: "lodash" });
Vue.component("v-select", vSelect);
import { uuid } from "vue-uuid";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  name: "enroute-packhouse",
  data: function () {
    return {
      userName: null,
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      enrouteContainer: false,
      currentItem: null,
      selectedStatus: "",
      isSelected: false,
      enrouteContainerPackHouse: false,
      enrouteAdditionalNotes: "",
      selectedItem: null,
      packHouse: [],
      selectedDropOffLocation: null,
      selectedpickupItem: false,
      serviceRequestIds: [],
      pickupcount: 0,
      networkStatus: true,
      todaysPickups: [],
      isSuperAdmin: false,
      selectedItemsArray: [],
      internetAvailable: null,
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Offline,
    Footer,
  },
  mounted() {
    this.checkInternetStatus().then((internetStatus) => {
      console.log(internetStatus);
      if (localStorage.systemRole == 99) {
        this.isSuperAdmin = true;
      }
      let multipleRoles = localStorage.systemRole.split(",");
      if (multipleRoles.length > 1) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Multi-Role-Dashboard", "Multi-Role-Dashboard"),
            href: "/multi-user-dashboard",
          },
          {
            text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
            href: "/collector-dashboard",
          },
          {
            text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
            href: "/enroute-packhouse",
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
                text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
                href: "/collector-dashboard",
              },
              {
                text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
                href: "/enroute-packhouse",
              },
            ]);
          } else {
            this.$refs.headercomp.createBreadcrumb([
              {
                text: this.$t(
                  "Root Authority-Dashboard",
                  "Root Authority-Dashboard"
                ),
                href: "/sa-dashboard",
              },
              {
                text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
                href: "/lsp-dashboard",
              },
              {
                text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
                href: "/collector-dashboard",
              },
              {
                text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
                href: "/enroute-packhouse",
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
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
              href: "/enroute-packhouse",
            },
          ]);
        } else if (localStorage.systemRole == 3) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
              href: "/enroute-packhouse",
            },
          ]);
        } else if (localStorage.systemRole == 7) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
              href: "/op-admin-dashboard",
            },
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
              href: "/enroute-packhouse",
            },
          ]);
        } else if (localStorage.systemRole == 96) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
              href: "/lsp-dashboard",
            },
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("Enroute Packhouse", "Enroute Packhouse"),
              href: "/enroute-packhouse",
            },
          ]);
        }
      }
      // if (localStorage.emailId == null || localStorage.emailId == "") {
      //   Router.push("/");
      // }
      this.userName = localStorage.userName;
      this.selectedpickupItem = false;
      var currentValue = this;
      this.getPackHouse();
      //IndexedDb code starts here - for setting networkstatus
      let dbStatus;
      let requestStatus = window.indexedDB.open("pickupsList_db", 1);
      requestStatus.onerror = () => {
        console.log("Database failed to open");
      };
      requestStatus.onsuccess = () => {
        console.log("Database opened successfully");
        dbStatus = requestStatus.result;
        let transactionStatus = dbStatus.transaction(
          ["pickupsList"],
          "readwrite"
        );
        let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
          keyPath: "key",
        });
        var requestWPStatus = objectStoreStatus.get(2);
        requestWPStatus.onsuccess = (event) => {
          var dataStatus = event.target.result;
          let transactionStatus = dbStatus.transaction(
            ["pickupsList"],
            "readwrite"
          );
          let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
            keyPath: "key",
          });
          if (dataStatus != undefined) {
            currentValue.handleConnectivityChange(dataStatus.values);
          }
          transactionStatus.oncomplete = () => {
            console.log(
              "Transaction completed: database modification finished."
            );
            dbStatus.close();
          };
          transactionStatus.onerror = (error) => {
            console.log("Transaction not opened due to error");
            console.log(error);
          };
          //fetching Pickupslist complete
        };
        requestWPStatus.onerror = (event) => {
          console.log("Failed to get the list from IndexedDB");
        };
      };
      requestStatus.onupgradeneeded = function (e) {
        let dbStatus = e.target.result;
        let objectStoreStatus = dbStatus.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
    });
  },
  methods: {
    handleConnectivityChange(status) {
      this.checkInternetStatus().then((internetStatus) => {
        console.log(internetStatus);
        this.networkStatus = status;
        this.getPickupList();
        var currentVal = this;
        //IndexedDB Code starts here
        if (currentVal.internetAvailable) {
          let db;
          let request = window.indexedDB.open("pickups_db_enroutepackhouse", 1);
          request.onsuccess = function () {
            console.log("Database opened successfully");
            db = request.result;
            console.log(db);
            var serviceRequestsArray = [];
            var objectStore = db.transaction("pickups").objectStore("pickups");
            objectStore.getAll().onsuccess = () => {
              serviceRequestsArray = event.target.result;
              if (
                serviceRequestsArray != undefined &&
                serviceRequestsArray.length > 0
              ) {
                currentVal.seen = true;
                Vue.$toast.open({
                  message: "Offline data syncing.....",
                  type: "warning",
                  position: "top",
                });

                serviceRequestsArray.forEach((item, index) => {
                  var dbRef = firebase.database().ref("serviceRequest/");
                  dbRef
                    .orderByChild("serviceRequestId")
                    .equalTo(item.serviceRequestId)
                    .on("child_added", function (data) {
                      var phoneNumber = data.val().phoneNumber;
                      var ref = firebase
                        .database()
                        .ref("serviceRequest/" + data.key);
                      ref
                        .update(item)
                        .then(function () {
                          var indexinArray = currentVal.pickupsList.findIndex(
                            (x) => x.Id === item.serviceRequestId
                          );
                          if (indexinArray != -1) {
                            currentVal.pickupsList[indexinArray].status =
                              item.status;
                          }
                          currentVal.seen = false;
                          currentVal.createEnroutePackhouseAPICall(item);
                          console.log("success " + item.serviceRequestId);
                          //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                          var checkIndex = index + 1;
                          if (serviceRequestsArray.length == checkIndex) {
                            db.close();
                            currentVal.seen = false;
                            var req = indexedDB.deleteDatabase(
                              "pickups_db_enroutepackhouse"
                            );
                            req.onsuccess = function () {
                              console.log("Deleted database successfully");
                            };
                            req.onerror = function () {
                              console.log("Couldn't delete database");
                            };
                            req.onblocked = function () {
                              console.log(
                                "Couldn't delete database due to the operation being blocked"
                              );
                            };
                          }
                        })
                        .catch(() => {
                          currentVal.seen = false;
                        });
                    });
                });
              }
            };
          };
          request.onupgradeneeded = function (e) {
            e.target.transaction.abort();
          };
        } else {
          currentVal.getPackHouseListFromINdexedDb();
          currentVal.$refs["offline-modal"].show();
          setTimeout(function () {
            currentVal.$refs["offline-modal"].hide();
          }, 4000);
          //Create/Open database
          let db;
          let request = window.indexedDB.open("pickups_db_enroutepackhouse", 1);
          request.onerror = function () {
            console.log("Database failed to open");
          };
          request.onsuccess = function () {
            console.log("Database opened successfully");
          };
          request.onupgradeneeded = function (e) {
            let db = e.target.result;
            let objectStore = db.createObjectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            console.log("Database setup complete");
          };
        }
        //IndexedDB Code ends here
        //IndexedD Code start here - for setting the network status in IndexedDB
        let dbStatus;
        let requestStatus = window.indexedDB.open("pickupsList_db", 1);
        requestStatus.onerror = () => {
          console.log("Database failed to open");
        };
        requestStatus.onsuccess = () => {
          console.log("Database opened successfully");
          dbStatus = requestStatus.result;
          let newItemStatus = {
            key: 2,
            values: status,
          };
          let transactionStatus = dbStatus.transaction(
            ["pickupsList"],
            "readwrite"
          );
          let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
            keyPath: "key",
          });
          var requestWPStatus = objectStoreStatus.get(2);
          requestWPStatus.onsuccess = (event) => {
            var dataStatus = event.target.result;
            let transactionStatus = dbStatus.transaction(
              ["pickupsList"],
              "readwrite"
            );
            let objectStoreStatus = transactionStatus.objectStore(
              "pickupsList",
              {
                keyPath: "key",
              }
            );
            let requestObjectStatus;
            if (dataStatus == undefined) {
              requestObjectStatus = objectStoreStatus.add(newItemStatus);
            } else {
              requestObjectStatus = objectStoreStatus.put(newItemStatus);
            }
            requestObjectStatus.onsuccess = () => {
              console.log("added successfully");
            };
            transactionStatus.oncomplete = () => {
              console.log(
                "Transaction completed: database modification finished."
              );
              dbStatus.close();
            };
            transactionStatus.onerror = (error) => {
              console.log("Transaction not opened due to error");
              console.log(error);
            };
          };
          requestWPStatus.onerror = (event) => {
            console.log("Failed to get the list from IndexedDB");
          };
        };
        requestStatus.onupgradeneeded = function (e) {
          let dbStatus = e.target.result;
          let objectStoreStatus = dbStatus.createObjectStore("pickupsList", {
            keyPath: "key",
          });
          console.log("Database setup complete");
        };
        //IndexedDB code ends here
      });
    },

    showSelected: function (item) {
      console.log("############");
      console.log(item);
      this.addToTodaysPickupsList(item);
      //this.filterPackhouses(item);
      this.currentItem = null;
      this.currentItem = item;
      this.emptyContainer = false;
      this.enrouteContainerPackHouse = true;
      this.enrouteAdditionalNotes = null;
      this.selectedDropOffLocation = null;
    },
    cancelSelectedItem: function () {
      this.enrouteContainerPackHouse = false;
      this.emptyContainer = true;
      this.selectedItem = null;
      this.enrouteAdditionalNotes = null;
      this.selectedDropOffLocation = null;
      this.getPackHouse();
    },
    getPickupList: function () {
      let currentval = this;
      let rawName = this.userName.trim().split("(", 1);
      rawName = rawName[0].trim();
      var ref = firebase.database().ref("serviceRequest/");
      if (currentval.internetAvailable) {
        if (localStorage.systemRole == 99) {
          var count = 0;
          ref.on("value", function (snapshot) {
            currentval.pickupsList = [];
            snapshot.forEach((requestData) => {
              if (requestData.val().status == "With Producer") {
                console.log(requestData.val());
                var data = "";
                data = {
                  Id: requestData.val().serviceRequestId,
                  PickupRequestedOn: moment
                    .utc(requestData.val().dateOfPickup)
                    .local()
                    .format("MMM DD, YYYY hh:mm A"),
                  Produce: requestData.val().product,
                  estimatedNoFruits: requestData.val().estimatedNoFruits,
                  Producer: requestData.val().producer,
                  Collectat: requestData.val().collectionPoint,
                  DropOffAt: requestData.val().dropOffAtPackhouse,
                  CurrentStatus: requestData.val().status,
                  totalFruits: requestData.val().estimatedNoFruits,
                  _delayedBy: requestData.val().scheduledAfter,
                  farmerId: requestData.val().farmerId,
                  phoneNumber: requestData.val().phoneNumber,
                  status: requestData.val().status,
                  collector: requestData.val().collector,
                  withProducerAddedBy:
                    requestData.val().withProducerAddedBy || "",
                  withProducerAddedOn:
                    requestData.val().withProducerAddedOn || "",
                  withProducerPaymentMethod:
                    requestData.val().paymentMethod || "",
                  withProducerFruitsHarvested:
                    requestData.val().fruitsHarvested,
                  withProducerFruitsRejected: requestData.val().fruitsRejected,
                  createdBy: requestData.val().serviceRequestCreatedBy || "",
                  scheduledBy: requestData.val().scheduledBy || "",
                  scheduledOn: requestData.val().pickupAddedOn || "",
                  enrouteToProducerAddedBy:
                    requestData.val().enrouteToProducerAddedBy || "",
                  enrouteToProducerAddedOn:
                    requestData.val().plannedPickUpAddedOn || "",
                  organization: requestData.val().organization,
                  organizationKey: requestData.val().organizationKey,
                };
                currentval.pickupsList.push(data);
                currentval.updateTodaysPickupList(data);
              }
              var checkCount = count + 1;
              if (snapshot.numChildren() == checkCount) {
                currentval.seen = false;
                currentval.pickupsList.reverse();
              }
              count++;
            });
          });
        } else {
          var count = 0;
          ref
            .orderByChild("organizationKey")
            .equalTo(localStorage.organizationKey)
            .on("value", function (snapshot) {
              currentval.pickupsList = [];
              snapshot.forEach((requestData) => {
                if (requestData.val().status == "With Producer") {
                  var data = "";
                  data = {
                    Id: requestData.val().serviceRequestId,
                    PickupRequestedOn: moment
                      .utc(requestData.val().dateOfPickup)
                      .local()
                      .format("MMM DD, YYYY hh:mm A"),
                    Produce:
                      requestData.val().product +
                      " (" +
                      requestData.val().estimatedNoFruits +
                      ")",
                    Producer: requestData.val().producer,
                    Collectat: requestData.val().collectionPoint,
                    DropOffAt: requestData.val().dropOffAtPackhouse,
                    CurrentStatus: requestData.val().status,
                    totalFruits: requestData.val().estimatedNoFruits,
                    _delayedBy: requestData.val().scheduledAfter,
                    farmerId: requestData.val().farmerId,
                    status: requestData.val().status,
                    phoneNumber: requestData.val().phoneNumber,
                    collector: requestData.val().collector,
                    withProducerAddedBy:
                      requestData.val().withProducerAddedBy || "",
                    withProducerAddedOn:
                      requestData.val().withProducerDataAddedOn || "",
                    withProducerPaymentMethod:
                      requestData.val().paymentMethod || "",
                    withProducerFruitsHarvested:
                      requestData.val().fruitsHarvested,
                    withProducerFruitsRejected:
                      requestData.val().fruitsRejected,
                    createdBy: requestData.val().serviceRequestCreatedBy || "",
                    scheduledBy: requestData.val().scheduledBy || "",
                    scheduledOn: requestData.val().pickupAddedOn || "",
                    enrouteToProducerAddedBy:
                      requestData.val().enrouteToProducerAddedBy || "",
                    enrouteToProducerAddedOn:
                      requestData.val().plannedPickUpAddedOn || "",
                    organization: requestData.val().organization,
                    organizationKey: requestData.val().organizationKey,
                  };
                  currentval.pickupsList.push(data);
                  currentval.updateTodaysPickupList(data);
                }
                var checkCount = count + 1;
                if (snapshot.numChildren() == checkCount) {
                  currentval.seen = false;
                  currentval.pickupsList.reverse();
                }
                count++;
              });
            });
        } // end of else condition
      } else {
        //IndexedDB code starts here - for fetching pickupslist from indexedDB if network is not there
        let dbList;
        let requestList = window.indexedDB.open("pickupsList_db", 1);
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          console.log(dbList);
          var pickupsListArray = [];
          var objectStoreList = dbList
            .transaction("pickupsList")
            .objectStore("pickupsList");
          objectStoreList.getAll().onsuccess = () => {
            pickupsListArray = event.target.result;
            currentval.seen = true;
            pickupsListArray[0].values.forEach((item, index) => {
              if (item.status == "With Producer") {
                currentval.pickupsList.push(item);
                currentval.updateTodaysPickupList(item);
              }
              //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
              var checkIndex = index + 1;
              if (pickupsListArray[0].values.length == checkIndex) {
                currentval.seen = false;
              }
            });
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickupsList", {
            keyPath: "key",
          });
          console.log("Database setup complete");
        };
        //IndexedDB code ends here
      }
      setTimeout(function () {
        if (currentval.pickupsList.length == 0) {
          currentval.seen = false;
        }
      }, 8000);
    },
    updateEnroutePackhouseStatus() {
      let currentValue = this;
      currentValue.seen = true;
      if (
        currentValue.selectedDropOffLocation != null &&
        currentValue.selectedDropOffLocation != undefined
      ) {
        var inpData = {
          status: "Enroute Packhouse",
          enroutePackhouseAddedOn: moment.utc().toString(),
          enroutePackhouseAdditionalNote: currentValue.enrouteAdditionalNotes,
          dropOffAtPackhouse: currentValue.selectedDropOffLocation.name,
          enrouteToPackhouseAddedBy: localStorage.userName,
          // ,
          // serviceRequestId: currentValue.currentItem.Id
        };
        //IndexedDb Code starts here
        if (!currentValue.internetAvailable) {
          let db;
          let request = window.indexedDB.open("pickups_db_enroutepackhouse", 1);
          request.onsuccess = () => {
            console.log("Database opened successfully");
            db = request.result;
            let transaction = db.transaction(["pickups"], "readwrite");
            let objectStore = transaction.objectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            //For updating the existing service request on click of save button

            currentValue.todaysPickups.forEach((id, todaysItemIndex) => {
              const index = Vue.lodash.findIndex(currentValue.pickupsList, {
                Id: id,
              });
              if (index != -1) {
                const currentItem = currentValue.pickupsList[index];
                var requestWP = objectStore.get(id);
                requestWP.onerror = (event) => {
                  console.log("Failed to get the data from IndexedDB");
                };
                requestWP.onsuccess = (event) => {
                  var data = event.target.result;
                  //adding new values
                  if (data == undefined) {
                    let newItem = {
                      serviceRequestId: currentItem.Id,
                      status: "Enroute Packhouse",
                      enroutePackhouseAddedOn: inpData.enroutePackhouseAddedOn,
                      enroutePackhouseAdditionalNote:
                        inpData.enroutePackhouseAdditionalNote,
                      dropOffAtPackhouse: inpData.dropOffAtPackhouse,
                      enrouteToPackhouseAddedBy: localStorage.userName,
                    };
                    let transaction = db.transaction(["pickups"], "readwrite");
                    let objectStore = transaction.objectStore("pickups", {
                      keyPath: "serviceRequestId",
                    });
                    let requestObject = objectStore.add(newItem);
                    requestObject.onsuccess = () => {
                      var indexinArray = currentValue.pickupsList.findIndex(
                        (x) => x.Id === newItem.serviceRequestId
                      );
                      if (indexinArray != -1) {
                        currentValue.pickupsList[indexinArray].status =
                          newItem.status;
                      }
                      //IndexedDB code starts here - for updating the pickupslist in indexedDB
                      let dbList;
                      let requestList = window.indexedDB.open(
                        "pickupsList_db",
                        1
                      );
                      requestList.onsuccess = function () {
                        console.log("Database opened successfully");
                        dbList = requestList.result;
                        console.log(db);
                        var pickupsListArray = [];
                        let transactionList = dbList.transaction(
                          ["pickupsList"],
                          "readwrite"
                        );
                        let objectStoreList = transactionList.objectStore(
                          "pickupsList",
                          {
                            keyPath: "key",
                          }
                        );
                        var requestWPList = objectStoreList.get(1);
                        requestWPList.onsuccess = (event) => {
                          pickupsListArray = event.target.result;
                          currentValue.pickupsList = [];
                          pickupsListArray.values.forEach((item, index) => {
                            if (currentValue.todaysPickups.includes(item.Id)) {
                              item.status = "Enroute Packhouse";
                              item.CurrentStatus = "Enroute Packhouse";
                            } else {
                              if (item.status == "With Producer") {
                                currentValue.pickupsList.push(item);
                              }
                            }
                            //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                            var checkIndex = index + 1;
                            if (pickupsListArray.values.length == checkIndex) {
                              let transactionUpdateList = dbList.transaction(
                                ["pickupsList"],
                                "readwrite"
                              );
                              let objectStoreUpdateList =
                                transactionUpdateList.objectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                              let requestObjectUpdateList;
                              requestObjectUpdateList =
                                objectStoreUpdateList.put(pickupsListArray);
                              requestObjectUpdateList.onsuccess = () => {
                                currentValue.enrouteContainerPackHouse = false;
                                currentValue.emptyContainer = true;
                                currentValue.selectedItem = null;
                                currentValue.enrouteAdditionalNotes = "";
                                if (
                                  todaysItemIndex ==
                                  currentValue.todaysPickups.length - 1
                                ) {
                                  Vue.$toast.open({
                                    message:
                                      currentValue.$t(
                                        "Data will be saved once you are back online",
                                        "Data will be saved once you are back online"
                                      ) + ".",
                                    type: "success",
                                    position: "top",
                                  });
                                  currentValue.selectedItemsArray = [];
                                  currentValue.updateTodaysPickupList(item);
                                  currentValue.todaysPickups = [];
                                  currentValue.selectedDropOffLocation = null;
                                  currentValue.getPackHouse();
                                  currentValue.seen = false;
                                  console.log(
                                    "pickups list updated successfully"
                                  );
                                }
                              };
                            }
                          });
                        };
                      };
                      requestList.onupgradeneeded = function (e) {
                        let dbList = e.target.result;
                        let objectStoreList = dbList.createObjectStore(
                          "pickupsList",
                          {
                            keyPath: "key",
                          }
                        );
                        console.log("Database setup complete");
                      };
                      //IndexedDB code ends here - for updating the pickupslist in indexedDB

                      console.log("added successfully");
                    };
                    requestObject.onerror = (event) => {
                      Vue.$toast.open({
                        message: "Please try again",
                        type: "error",
                        position: "top",
                      });
                      currentValue.seen = false;
                      console.log(
                        "Failed to update Enroute Packhouse details in IndexedDB"
                      );
                    };
                    transaction.oncomplete = () => {
                      console.log(
                        "Transaction completed: database modification finished."
                      );
                      db.close();
                    };
                    transaction.onerror = (error) => {
                      console.log("Transaction not opened due to error");
                      console.log(error);
                    };
                  } else {
                    data.serviceRequestId = id;
                    data.status = "Enroute Packhouse";
                    data.enroutePackhouseAddedOn =
                      inpData.enroutePackhouseAddedOn;
                    data.enroutePackhouseAdditionalNote =
                      inpData.enroutePackhouseAdditionalNote;
                    data.dropOffAtPackhouse = inpData.dropOffAtPackhouse;
                    data.enrouteToPackhouseAddedBy = localStorage.userName;
                    var requestUpdate = objectStore.put(data);
                    requestUpdate.onerror = (event) => {
                      Vue.$toast.open({
                        message: "Please try again",
                        type: "error",
                        position: "top",
                      });
                      currentValue.seen = false;
                      console.log(
                        "Failed to update Enroute Packhouse details in IndexedDB"
                      );
                    };
                    requestUpdate.onsuccess = (event) => {
                      var indexinArray = currentValue.pickupsList.findIndex(
                        (x) => x.Id === data.serviceRequestId
                      );
                      if (indexinArray != -1) {
                        currentValue.pickupsList[indexinArray].status =
                          data.status;
                      }
                      let _dbList;
                      let _requestList = window.indexedDB.open(
                        "pickupsList_db",
                        1
                      );
                      _requestList.onsuccess = function () {
                        console.log("Database opened successfully");
                        _dbList = _requestList.result;
                        console.log(db);
                        var pickupsListArray = [];
                        let transactionList = _dbList.transaction(
                          ["pickupsList"],
                          "readwrite"
                        );
                        let objectStoreList = transactionList.objectStore(
                          "pickupsList",
                          {
                            keyPath: "key",
                          }
                        );
                        var requestWPList = objectStoreList.get(1);
                        requestWPList.onsuccess = (event) => {
                          pickupsListArray = event.target.result;
                          currentValue.pickupsList = [];
                          pickupsListArray.values.forEach((item, index) => {
                            if (currentValue.todaysPickups.includes(item.Id)) {
                              item.status = "Enroute Packhouse";
                              item.CurrentStatus = "Enroute Packhouse";
                            } else {
                              if (item.status == "With Producer") {
                                currentValue.pickupsList.push(item);
                              }
                            }
                            //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                            var checkIndex = index + 1;
                            if (pickupsListArray.values.length == checkIndex) {
                              let transactionUpdateList = _dbList.transaction(
                                ["pickupsList"],
                                "readwrite"
                              );
                              let objectStoreUpdateList =
                                transactionUpdateList.objectStore(
                                  "pickupsList",
                                  {
                                    keyPath: "key",
                                  }
                                );
                              let requestObjectUpdateList;
                              requestObjectUpdateList =
                                objectStoreUpdateList.put(pickupsListArray);
                              requestObjectUpdateList.onsuccess = () => {
                                currentValue.enrouteContainerPackHouse = false;
                                currentValue.emptyContainer = true;
                                currentValue.selectedItem = null;
                                currentValue.enrouteAdditionalNotes = "";
                                if (
                                  todaysItemIndex ==
                                  currentValue.todaysPickups.length - 1
                                ) {
                                  Vue.$toast.open({
                                    message:
                                      currentValue.$t(
                                        "Data will be saved once you are back online",
                                        "Data will be saved once you are back online"
                                      ) + ".",
                                    type: "success",
                                    position: "top",
                                  });
                                  currentValue.selectedItemsArray = [];
                                  currentValue.updateTodaysPickupList(item);
                                  currentValue.todaysPickups = [];
                                  currentValue.selectedDropOffLocation = null;
                                  currentValue.getPackHouse();
                                  currentValue.seen = false;
                                  console.log(
                                    "pickups list updated successfully"
                                  );
                                }
                              };
                            }
                          });
                        };
                      };
                      _requestList.onupgradeneeded = function (e) {
                        let dbList = e.target.result;
                        let objectStoreList = dbList.createObjectStore(
                          "pickupsList",
                          {
                            keyPath: "key",
                          }
                        );
                        console.log("Database setup complete");
                      };
                      currentValue.enrouteContainerPackHouse = false;
                      currentValue.emptyContainer = true;
                      currentValue.selectedItem = null;
                      currentValue.enrouteAdditionalNotes = "";
                      currentValue.selectedDropOffLocation = null;
                      Vue.$toast.open({
                        message:
                          currentValue.$t(
                            "Data will be saved once you are back online",
                            "Data will be saved once you are back online"
                          ) + ".",
                        type: "success",
                        position: "top",
                      });
                      currentValue.selectedItemsArray = [];
                      currentValue.todaysPickups = [];
                      currentValue.getPackHouse();
                      currentValue.selectedDropOffLocation = null;
                      currentValue.seen = false;
                      console.log(
                        "Successfully updated Enroute Packhouse details in IndexedDB"
                      );
                    };
                  }
                };
              } else {
                console.log(`service request ${id} not found.`);
              }
            });
          };
        } else {
          var dbRef = firebase.database().ref("serviceRequest/");
          currentValue.todaysPickups.forEach((id, todaysItemIndex) => {
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(id)
              .on("child_added", function (data) {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                ref
                  .update(inpData)
                  .then(function () {
                    currentValue.seen = false;
                    inpData.serviceRequestId = id;
                    currentValue.createEnroutePackhouseAPICall(inpData);
                    currentValue.selectedDropOffLocation = null;
                    currentValue.seen = false;
                    if (
                      currentValue.todaysPickups.length - 1 ==
                      todaysItemIndex
                    ) {
                      Vue.$toast.open({
                        message:
                          currentValue.$t(
                            "Status updated successfully",
                            "Status updated successfully"
                          ) + ".",
                        type: "success",
                        position: "top",
                      });
                      currentValue.selectedItemsArray = [];
                      currentValue.todaysPickups = [];
                      currentValue.selectedDropOffLocation = null;
                    }
                    currentValue.getPackHouse();
                    currentValue.enrouteContainerPackHouse = false;
                    currentValue.emptyContainer = true;
                    currentValue.selectedItem = null;
                    currentValue.enrouteAdditionalNotes = "";
                    // currentValue.selectedItemsArray = [];
                  })
                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                  });
              });
          });
        }
      } else {
        Vue.$toast.open({
          message: this.$t(
            "Please select drop off location",
            "Please select drop off location"
          ),
          type: "error",
          position: "top",
        });
        this.seen = false;
      }
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
          alert("Error");
        });
    },
    showDashboard: function () {
      Router.push("lsp-dashboard");
    },
    getPackHouse: function (event) {
      var currentVal = this;
      currentVal.packHouse = [];
      let ref = null;
      if (localStorage.systemRole == 99) {
        ref = firebase.database().ref().child("masters").child("packHouse");
      } else {
        ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("packHouse")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
      }
      if (currentVal.internetAvailable) {
        ref.on("value", function (snapshot) {
          snapshot.forEach((requestData) => {
            currentVal.packHouse.push({
              name: requestData.val().title,
              organization: requestData.val().organization,
              organizationKey: requestData.val().organizationKey,
            });
          });
        });
      } else {
        currentVal.getPackHouseListFromINdexedDb();
      }
    },
    getPackHouseListFromINdexedDb() {
      this.packHouse = [];
      var currentval = this;
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_packhouse", 1);
      requestList.onsuccess = function () {
        console.log("Database opened successfully");
        dbList = requestList.result;
        console.log(dbList);
        var pickupsListArray = [];
        var objectStoreList = dbList
          .transaction("pickupsList")
          .objectStore("pickupsList");
        objectStoreList.getAll().onsuccess = () => {
          pickupsListArray = event.target.result;
          currentval.seen = true;
          if (pickupsListArray != undefined && pickupsListArray.length > 0)
            pickupsListArray[0].values.forEach((item, index) => {
              currentval.packHouse.push({
                name: item.name,
                organization: item.organization,
                organizationKey: item.organizationKey,
              });
              //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
              var checkIndex = index + 1;
              if (pickupsListArray[0].values.length == checkIndex) {
                currentval.seen = false;
              }
            });
        };
      };
      requestList.onupgradeneeded = function (e) {
        let dbList = e.target.result;
        let objectStoreList = dbList.createObjectStore("pickupsList", {
          keyPath: "key",
        });
        console.log("Database setup complete");
      };
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 7) {
        Router.push("op-admin-dashboard");
      } else {
        Router.push("collector-dashboard");
      }
    },
    createEnroutePackhouseAPICall(inpData) {
      let currentVal = this;
      const data = {
        id: inpData.serviceRequestId,
        status: "Enroute Packhouse",
        enroutePackhouseAddedOn: moment
          .utc(String(inpData.enroutePackhouseAddedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        enroutePackhouseAdditionalNote: inpData.enroutePackhouseAdditionalNote,
        dropOffAtPackhouse: inpData.dropOffAtPackhouse,
      };
      currentVal.axios
        .post(
          `${
            getConfigVars().BASE_URL
          }50009/api/v1.0/collector-enroute-packhouse`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          }
        )
        .then(function (response) {
          console.log("Successfully update database");
        })
        .catch(function (error) {
          let errorObject = JSON.parse(JSON.stringify(error));
          if (
            error.response.status == 401 ||
            errorObject.message.indexOf("401") > -1
          ) {
            firebase
              .auth()
              .currentUser.getIdToken(true)
              .then((idtoken) => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal.createEnroutePackhouseAPICall(inpData);
              });
          }
        });
    },
    goToCollectorDashboard() {
      Router.push("collector-dashboard");
    },
    updateTodaysPickupList(item) {
      const todaysDate = moment.utc().toString();
      const requestedOnDate = item.PickupRequestedOn || item.scheduledOn;
      const vm = this;
      const check = moment(todaysDate).isSame(requestedOnDate, "days");
      if (moment(todaysDate).isSame(requestedOnDate, "days")) {
        const index = vm.todaysPickups.indexOf(item.Id);
        if (index == -1) {
          vm.todaysPickups.push(item.Id);
        }
      }
      console.log(vm.todaysPickups);
    },
    addToTodaysPickupsList(item) {
      const vm = this;
      const index = vm.todaysPickups.indexOf(item.Id);
      const indexOrg = vm.selectedItemsArray.indexOf(item.organizationKey);
      if (index == -1) {
        if (vm.selectedItemsArray.length > 0) {
          if (vm.selectedItemsArray.indexOf(item.organizationKey) !== -1) {
            console.log("new entry");
            vm.todaysPickups.push(item.Id);
            vm.selectedItemsArray.push(item.organizationKey);
            vm.filterPackhouses(item);
          } else {
            $("input:radio").each(function () {
              if ($(this).is(":checked")) {
                if ($(this).prop("name") == item.Id) {
                  $(this).removeAttr("checked");
                  $(this).prop("checked", false);
                }
                // You have a checked radio button here...
              } else {
                // Or an unchecked one here...
              }
            });
            Vue.$toast.open({
              message: vm.$t(
                "Please select service requests belonging to same organization.",
                "Please select service requests belonging to same organization."
              ),
              type: "error",
              position: "top",
            });
            return;
          }
        } else {
          vm.todaysPickups.push(item.Id);
          vm.selectedItemsArray.push(item.organizationKey);
        }
      } else {
        console.log("deleting entry");
        vm.todaysPickups.splice(index, 1);
        vm.selectedItemsArray.splice(indexOrg, 1);
      }
    },
    filterPackhouses(item) {
      console.log(item);
      const vm = this;
      let filteredPackhouses = [];
      if (vm.isSuperAdmin) {
        vm.packHouse.forEach((packhouse) => {
          if (packhouse.organizationKey == item.organizationKey) {
            filteredPackhouses.push(packhouse);
          }
        });
        vm.packHouse = filteredPackhouses;
      }
    },
    checkInternetStatus() {
      const vm = this;
      return new Promise((resolve, reject) => {
        vm.axios
          .get(`${getConfigVars().BASE_URL}50005/api/v1.0/templateendpoint`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(() => {
            console.log("internet available");
            vm.internetAvailable = true;
            resolve("available");
          })
          .catch((error) => {
            console.log(error);
            console.log(error.message);
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
            if (
              errorObject != undefined &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              console.log("internet available");
              vm.internetAvailable = true;
              resolve("available");
            }
            if (error.status >= 200 && error.status < 300) {
              vm.internetAvailable = true;
              resolve("available");
            } else {
              vm.$refs["offline-modal"].show();
              setTimeout(function () {
                vm.$refs["offline-modal"].hide();
              }, 4000);
              vm.internetAvailable = false;
              resolve("not available");
            }
          });
      });
    },
  },
};
</script>
<style>
#offline-modal .modal.show .modal-dialog {
  display: table-cell !important;
}
#offline-modal .modal-content {
  min-width: 400px !important;
  max-width: 400px !important;
  margin: 0px auto !important;
  width: auto !important;
}
.offline-container {
  width: 100%;
}
.offline-label {
  color: #fff;
  background: red;
  padding: 10px;
}
#pl #planned-pickup-reject-modal .modal-header {
  height: 50px !important;
}
#planned-pickup-reject-modal .modal-header .close {
  margin-top: -22px !important;
}
#planned-pickup-reject-modal .modal-header h5 {
  margin: -10px auto !important;
}

#qrcode-modal .modal-header {
  height: 50px !important;
}
#qrcode-modal .modal-header .close {
  margin-top: -22px !important;
}
#qrcode-modal .modal-header h5 {
  /* margin: -10px auto !important; */
  margin: -7px 10px !important;
}

#qrcode-view-modal .modal-header {
  height: 50px !important;
}
#qrcode-view-modal .modal-header .close {
  margin-top: -22px !important;
}
#qrcode-view-modal .modal-header h5 {
  margin: -4px 107px !important;
}
#confirm-warning-modal .modal-header {
  height: 50px !important;
}
#confirm-warning-modal .modal-header .close {
  margin-top: -22px !important;
}
#confirm-warning-modal .modal-header h5 {
  margin: -10px auto !important;
}
</style>

<style scoped>
.payment-method-container {
  color: #fff;
  text-align: left;
}
.payment-method-container label {
  margin-top: 15px !important;
}
.card-body-planned-pickup-status .bank-account-no {
  color: #fff !important;
}
.digital-signature-container {
  overflow-y: hidden !important;
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
.prefixCurrency {
  color: #fff;
  float: left !important;
}
.prefixCurrency input {
  float: none;
}
.pref {
  margin-top: 8px;
  font-size: 15px;
  padding-right: 1px;
  font-weight: bolder;
}
.advance {
  margin-left: 10px !important;
}
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-save,
.btn-cancel,
.btn-reject {
  height: 30px !important;
}
.header-container {
  height: 50px !important;
}
.lbl-offline {
  color: #fff;
}
.back-to-dashboard-btn {
  float: right;
  position: relative;
  right: 16px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
  color: #fff;
  margin: 10px 10px -20px 10px;
}
.dashboard-container {
  width: 100%;
  clear: both;
}
</style>
