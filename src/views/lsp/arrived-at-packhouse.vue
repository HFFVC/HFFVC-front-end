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
                        :name="item.id"
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
            {{
              $t(
                "Status - Arrived at Packhouse",
                "Status - Arrived at Packhouse"
              )
            }}
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
              <div v-if="todaysPickups.length > 0" class="arrived-at-packhouse">
                <input
                  type="text"
                  class="todayDate"
                  v-model="todayDate"
                  readonly
                  :placeholder="
                    $t(
                      'Arrival time at the pack house',
                      'Arrival time at the pack house'
                    )
                  "
                />
                <div class="atpck-currency-container currency-arrived">
                  <v-select
                    v-model="bckCurrency"
                    :placeholder="$t('Select Currency', 'Select Currency')"
                    class="planned-pickup-v-select currency-planned-pickup"
                    :options="currencySource"
                  ></v-select>
                </div>
                <div class="transport-cost-wrap">
                  <span class="prefixCurrency">
                    <span class="pref" v-if="this.bckCurrency == 'USD'">$</span>
                    <span class="pref" v-if="this.bckCurrency == 'HTG'">G</span>
                    <input
                      type="number"
                      class="small-input"
                      v-model="transportCostArrivedAtPackhouse"
                      :placeholder="$t('Transport Cost', 'Transport Cost')"
                    />
                  </span>
                </div>
                <datetime
                  type="time"
                  v-model="dateTimeVal"
                  input-class="my-class datepicker time-of-admittence"
                  :placeholder="
                    $t('Time of Admittence', 'Time of Admittence') + ' *'
                  "
                  :phrases="{
                    ok: $t('Save', 'Save'),
                    cancel: $t('Cancel', 'Cancel'),
                  }"
                  :hour-step="1"
                  :minute-step="1"
                  :week-start="7"
                  use12-hour
                  auto
                ></datetime>

                <input
                  type="text"
                  class="addition-note"
                  v-model="arrivedAtAdditionalNotes"
                  :placeholder="$t('Additional Notes', 'Additional Notes')"
                />
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="planned-pickup-mandatory-warning" v-if="arrivedAtPackHouse">
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
            v-on:click="updateArrivedAtPackHouseStatus"
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
      <Footer ref="footercomp"></Footer>
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
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import moment from "moment";
import tz from "moment-timezone";
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
import VueSignaturePad from "vue-signature-pad";
import uploadFiles from "../../shared/uploa-files";
import VueQrcodeReader from "vue-qrcode-reader";
import VueQRCodeComponent from "vue-qrcode-component";
Vue.component("qr-code", VueQRCodeComponent);
Vue.use(VueQrcodeReader);
Vue.use(VueToast);
Vue.use(VueSignaturePad);
Vue.use(Datetime);
import VueLodash from "vue-lodash";
import "vue-select/dist/vue-select.css";
import sendSMS from "../../shared/sms-service";
import Header from "../../components/header-view";
import Offline from "v-offline";
import Footer from "../../components/footer-view";

import vSelect from "vue-select";
Vue.use(VueLodash, { name: "lodash" });
Vue.component("v-select", vSelect);
import { uuid } from "vue-uuid";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  name: "arrived-at-packhouse",
  data: function () {
    return {
      userName: null,
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      currentItem: null,
      additionalNotes: "",
      isSelected: false,
      currencySource: ["USD", "HTG"],
      arrivedAtPackHouse: false,
      arrivedAtAdditionalNotes: "",
      selectedItem: null,
      transportCostArrivedAtPackhouse: null,
      packHouse: [],
      selectedpickupItem: false,
      serviceRequestIds: [],
      networkStatus: true,
      bckCurrency: null,
      dateTimeVal: null,
      todayDate: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      todaysPickups: [],
      isSuperAdmin: false,
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
            text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
            href: "/arrived-at-packhouse",
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
                text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
                href: "/arrived-at-packhouse",
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
                text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
                href: "/arrived-at-packhouse",
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
              text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
              href: "/arrived-at-packhouse",
            },
          ]);
        } else if (localStorage.systemRole == 3) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
              href: "/arrived-at-packhouse",
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
              text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
              href: "/arrived-at-packhouse",
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
              text: this.$t("Arrived At Packhouse", "Arrived At Packhouse"),
              href: "/arrived-at-packhouse",
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
          } else {
            currentValue.getPickupList();
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
      //IndexedDb code starts here
    });
  },
  methods: {
    updateWhenOnlineFromIndexedDB() {
      var currentVal = this;
      currentVal.seen = true;
      Vue.$toast.open({
        message: "Offline data syncing.....",
        type: "warning",
        position: "top",
      });
      currentVal
        .updateEnrouteProducerData()
        .then(function (enrouteProducerSuccess) {
          currentVal.seen = true;
          console.log(enrouteProducerSuccess);
          currentVal
            .updateWithProducerData()
            .then(function (withProducerSuccess) {
              currentVal.seen = true;
              console.log(withProducerSuccess);
              currentVal
                .updateEnroutePackhouseData()
                .then(function (enroutePackhouseSuccess) {
                  currentVal.seen = true;
                  console.log(enroutePackhouseSuccess);
                  currentVal
                    .updateArrivedAtPackhouseData()
                    .then(function (arrivedAtPackhouseSuccess) {
                      console.log(arrivedAtPackhouseSuccess);
                      currentVal
                        .updateWithProducerRejectData()
                        .then((rejectSuccess) => {
                          console.log(rejectSuccess);
                          currentVal.todaysPickups = [];
                          currentVal.todayDate = moment
                            .utc()
                            .local()
                            .format("MMM DD, YYYY hh:mm A");
                          currentVal.bckCurrency = null;
                          currentVal.transportCostArrivedAtPackhouse = null;
                          currentVal.dateTimeVal = null;
                          currentVal.arrivedAtAdditionalNotes = null;
                          Vue.$toast.open({
                            position: "top",
                            message: "Data sync completed.",
                            type: "success",
                          });
                          currentVal.seen = false;
                          currentVal.dropdownContainer = false;
                          currentVal.arrivedAtPackHouse = false;
                          currentVal.emptyContainer = true;
                          currentVal.selectedItem = null;
                        })
                        .catch((rejectError) => {
                          console.log(rejectError);
                          currentVal.todaysPickups = [];
                          Vue.$toast.open({
                            position: "top",
                            message: "Data sync completed.",
                            type: "success",
                          });
                          currentVal.seen = false;
                          currentVal.dropdownContainer = false;
                          currentVal.arrivedAtPackHouse = false;
                          currentVal.emptyContainer = true;
                          currentVal.selectedItem = null;
                        });
                    })
                    .catch(function (arrivedAtPackhouseError) {
                      currentVal.seen = false;
                      Vue.$toast.open({
                        message: "Error syncing arrived at packhouse data",
                        type: "error",
                        position: "top",
                      });
                      console.log(arrivedAtPackhouseError);
                    });
                })
                .catch(function (enroutePackhouseError) {
                  currentVal.seen = false;
                  Vue.$toast.open({
                    message: "Error syncing enroute-packhouse data",
                    type: "error",
                    position: "top",
                  });
                  console.log(enroutePackhouseError);
                });
            })
            .catch(function (withProducerError) {
              currentVal.seen = false;
              Vue.$toast.open({
                message: "Error syncing with-producer data",
                type: "error",
                position: "top",
              });
              console.log(withProducerError);
            });
        })
        .catch(function (enrouteProducerError) {
          currentVal.seen = false;
          Vue.$toast.open({
            message: "Error syncing enroute-producer data",
            type: "error",
            position: "top",
          });
          console.log(enrouteProducerError);
        });
    },
    handleConnectivityChange(status) {
      this.networkStatus = status;
      var currentVal = this;
      currentVal.checkInternetStatus().then((internetStatus) => {
        console.log(internetStatus);
        currentVal.getPickupList();

        //IndexedDB Code starts here
        if (currentVal.internetAvailable) {
          let requestArrivedAtPackhouse = window.indexedDB.open(
            "pickups_db_arrivedatpackhouse",
            1
          );
          requestArrivedAtPackhouse.onsuccess = function () {
            currentVal.updateWhenOnlineFromIndexedDB();
            console.log("Database opened successfully");
          };
          requestArrivedAtPackhouse.onupgradeneeded = function (e) {
            e.target.transaction.abort();
            let requestEnrouteProducer = window.indexedDB.open(
              "pickups_db_enrouteproducer",
              1
            );
            requestEnrouteProducer.onsuccess = function () {
              currentVal.updateWhenOnlineFromIndexedDB();
              console.log("Database opened successfully");
            };
            requestEnrouteProducer.onupgradeneeded = function (e) {
              e.target.transaction.abort();
              let requestWithProducer = window.indexedDB.open(
                "pickups_db_withproducer",
                1
              );
              requestWithProducer.onsuccess = function () {
                currentVal.updateWhenOnlineFromIndexedDB();
                console.log("Database opened successfully");
              };
              requestWithProducer.onupgradeneeded = function (e) {
                e.target.transaction.abort();
                let requestEnroutePackhouse = window.indexedDB.open(
                  "pickups_db_enroutepackhouse",
                  1
                );
                requestWithProducer.onsuccess = function () {
                  currentVal.updateWhenOnlineFromIndexedDB();
                  console.log("Database opened successfully");
                };
                requestEnroutePackhouse.onupgradeneeded = function (e) {
                  e.target.transaction.abort();
                };
              };
            };
          };

          /**
        let db;
        let request = window.indexedDB.open("pickups_db_arrivedatpackhouse", 1);
        request.onsuccess = function() {
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
                position: "top"
              });
              serviceRequestsArray.forEach((item, index) => {
                var dbRef = firebase.database().ref("serviceRequest/");
                dbRef
                  .orderByChild("serviceRequestId")
                  .equalTo(item.serviceRequestId)
                  .on("child_added", function(data) {
                    var phoneNumber = data.val().phoneNumber;
                    var ref = firebase
                      .database()
                      .ref("serviceRequest/" + data.key);
                    ref
                      .update(item)
                      .then(function() {
                        sendSMS(
                          phoneNumber,
                          "Fri yo rive nan stasyon pou kondisyònman"
                        );
                        currentVal.createArrivedAtPackhouseAPICall(item);
                        console.log("success " + item.serviceRequestId);
                        //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                        var checkIndex = index + 1;
                        if (serviceRequestsArray.length == checkIndex) {
                          db.close();
                          currentVal.seen = false;
                          var req = indexedDB.deleteDatabase(
                            "pickups_db_arrivedatpackhouse"
                          );
                          req.onsuccess = function() {
                            console.log("Deleted database successfully");
                          };
                          req.onerror = function() {
                            console.log("Couldn't delete database");
                          };
                          req.onblocked = function() {
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
        request.onupgradeneeded = function(e) {
          let db = e.target.result;
          let objectStore = db.createObjectStore("pickups", {
            keyPath: "serviceRequestId"
          });
          console.log("Database setup complete");
        };


**/
        } else {
          currentVal.$refs["offline-modal"].show();
          setTimeout(function () {
            currentVal.$refs["offline-modal"].hide();
          }, 4000);
          //Create/Open database
          let db;
          let request = window.indexedDB.open(
            "pickups_db_arrivedatpackhouse",
            1
          );
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
        // IndexedDB code ends here
      });
    },

    cancelSelectedItem: function () {
      this.enrouteContainer = false;
      this.dropdownContainer = false;
      this.producerContainer = false;
      this.enrouteContainerPackHouse = false;
      this.arrivedAtPackHouse = false;
      this.initialContainer = true;
      this.selectedItem = null;
      this.statusText = "";

      this.temperature = null;
      this.ambientTemp = null;
      this.crates = null;
      this.cratesPart = null;
      this.fruitHarvested = null;
      this.fruitRejected = null;
      this.advanceGiven = "0";
      this.currency = "HTG";
      this.paymentMethod = null;
      this.withProducerNote = null;
      this.selectedBank = null;
      this.accountNumber = null;
      this.selectedPaymentCurrency = null;
      this.mobilePaymentOperator = null;
      this.mobilePaymentNumber = null;
      this.qrCodeFiles = null;
      this.wireTransfer = false;
      this.mobileTransfer = false;
      this.cashTranser = false;
      this.transportCostArrivedAtPackhouse = null;
      this.dateTimeVal = null;
      this.arrivedAtAdditionalNotes = null;
      this.startQRCode = null;
      this.endQRCode = null;
      this.isAgreed = false;
      this.isNGOAccepted = false;
      this.NGOAlreadyExists = false;
    },
    showSelected: function (item) {
      this.addToTodaysPickupsList(item);
      this.currentItem = null;
      this.currentItem = item;
      this.emptyContainer = false;
      this.arrivedAtPackHouse = true;
      this.currency = "HTG";
      this.transportCostArrivedAtPackhouse = null;
      this.dateTimeVal = null;
      this.arrivedAtAdditionalNotes = null;
    },
    getPickupList: function () {
      this.seen = true;
      this.todaysPickups = [];
      let currentval = this;
      var ref = firebase.database().ref("serviceRequest/");
      if (currentval.internetAvailable) {
        if (localStorage.systemRole == 99) {
          var count = 0;
          ref
            .orderByChild("status")
            .equalTo("Enroute Packhouse")
            .on("value", function (snapshot) {
              currentval.pickupsList = [];
              var count = 0;
              snapshot.forEach((requestData) => {
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
                  enrouteToProducerAddedBy:
                    requestData.val().enrouteToProducerAddedBy || "",
                  enrouteToProducerAddedOn:
                    requestData.val().pickupAddedOn || "",
                  withProducerAddedBy:
                    requestData.val().withProducerAddedBy || "",
                  withProducerAddedOn:
                    requestData.val().withProducerAddedOn || "",
                  withProducerPaymentMethod:
                    requestData.val().withProducerPaymentMethod || "",
                  withProducerPaymentMethod:
                    requestData.val().paymentMethod || "",
                  withProducerFruitsHarvested:
                    requestData.val().fruitsHarvested,
                  withProducerFruitsRejected: requestData.val().fruitsRejected,
                  enrouteToPackhouseAddedOn:
                    requestData.val().enrouteToPackhouseAddedOn || "",
                  enrouteToPackhouseAddedBy:
                    requestData.val().enrouteToPackhouseAddedBy || "",
                  scheduledOn: requestData.val().pickupAddedOn,
                  organization: requestData.val().organization,
                  organizationKey: requestData.val().organizationKey,
                };
                currentval.pickupsList.push(data);
                currentval.updateTodaysPickupList(data);
                var checkCount = count + 1;
                if (snapshot.numChildren() == checkCount) {
                  currentval.seen = false;
                  currentval.pickupsList.reverse();
                }
                count++;
              });
            });
        } else {
          let rawName = this.userName.trim().split("(", 1);
          rawName = rawName[0].trim();
          var count = 0;
          ref
            .orderByChild("organizationKey")
            .equalTo(localStorage.organizationKey)
            .on("value", function (snapshot) {
              currentval.pickupsList = [];
              var count = 0;
              snapshot.forEach((requestData) => {
                if (requestData.val().status == "Enroute Packhouse") {
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
              if (item.status == "Enroute Packhouse") {
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
    updateArrivedAtPackHouseStatus: function () {
      this.seen = true;
      let currentValue = this;
      if (currentValue.dateTimeVal != null && currentValue.dateTimeVal != "") {
        var inpData = {
          // serviceRequestId: currentValue.currentItem.Id,
          status: "Arrived At Packhouse",
          arrivedAtPackhouseAddedOn: moment.utc().toString(),
          arrivedAtPackhouseAdditionalNote:
            currentValue.arrivedAtAdditionalNotes || "",
          transportCostArrivedAtPackhouse:
            currentValue.transportCostArrivedAtPackhouse,
          timeofAdmittence: currentValue.dateTimeVal,
          arrivedAtPackhouseAddedBy: localStorage.userName,
        };
        //IndexedDb Code starts here
        if (!currentValue.internetAvailable) {
          let db;
          let request = window.indexedDB.open(
            "pickups_db_arrivedatpackhouse",
            1
          );
          request.onsuccess = () => {
            console.log("Database opened successfully");
            db = request.result;
            let transaction = db.transaction(["pickups"], "readwrite");
            let objectStore = transaction.objectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            currentValue.todaysPickups.forEach((id, todaysPickupsIndex) => {
              const index = Vue.lodash.findIndex(currentValue.pickupsList, {
                Id: id,
              });
              if (index != -1) {
                //For updating the existing service request on click of save button
                var requestWP = objectStore.get(id);
                requestWP.onerror = (event) => {
                  currentValue.seen = false;
                  console.log("Failed to get the data from IndexedDB");
                };
                requestWP.onsuccess = (event) => {
                  var data = event.target.result;
                  //adding new values
                  if (data == undefined) {
                    let newItem = {
                      serviceRequestId: id,
                      status: "Arrived At Packhouse",
                      arrivedAtPackhouseAddedOn:
                        inpData.arrivedAtPackhouseAddedOn,
                      arrivedAtPackhouseAdditionalNote:
                        inpData.arrivedAtPackhouseAdditionalNote || "",
                      transportCostArrivedAtPackhouse:
                        inpData.transportCostArrivedAtPackhouse,
                      timeofAdmittence: inpData.timeofAdmittence,
                      arrivedAtPackhouseAddedBy: localStorage.userName,
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
                      currentValue.dropdownContainer = false;
                      currentValue.arrivedAtPackHouse = false;
                      currentValue.emptyContainer = true;
                      currentValue.selectedItem = null;
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
                              item.status = "Arrived At Packhouse";
                              item.CurrentStatus = "Arrived At Packhouse";
                            } else {
                              if (item.status == "Enroute Packhouse") {
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
                                console.log(
                                  "pickups list updated successfully"
                                );
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
                      if (indexinArray != -1) {
                        currentValue.pickupsList[indexinArray].status =
                          newItem.status;
                      }
                      if (
                        todaysPickupsIndex ==
                        currentValue.todaysPickups.length - 1
                      ) {
                        Vue.$toast.open({
                          message:
                            "Data will be saved once you are back online.",
                          type: "success",
                          position: "top",
                        });
                        currentValue.seen = false;
                        console.log("added successfully");
                        currentValue.todaysPickups = [];
                        currentValue.dateTimeVal = null;
                        currentValue.bckCurrency = null;
                        currentValue.transportCostArrivedAtPackhouse = null;
                        currentValue.todayDate = moment
                          .utc()
                          .local()
                          .format("MMM DD, YYYY hh:mm A");
                        currentValue.arrivedAtAdditionalNotes = null;
                      }
                    };
                    requestObject.onerror = (event) => {
                      Vue.$toast.open({
                        message: "Please try again",
                        type: "error",
                        position: "top",
                      });
                      currentValue.seen = false;
                      console.log(
                        "Failed to update Arrived at packhouse details in IndexedDB"
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
                    data.status = "Arrived At Packhouse";
                    data.arrivedAtPackhouseAddedOn =
                      inpData.arrivedAtPackhouseAddedOn;
                    data.arrivedAtPackhouseAdditionalNote =
                      inpData.arrivedAtPackhouseAdditionalNote || "";
                    data.transportCostArrivedAtPackhouse =
                      inpData.transportCostArrivedAtPackhouse;
                    data.timeofAdmittence = inpData.timeofAdmittence;
                    data.serviceRequestId = id;
                    var requestUpdate = objectStore.put(data);
                    requestUpdate.onerror = (event) => {
                      Vue.$toast.open({
                        message: "Please try again",
                        type: "error",
                        position: "top",
                      });
                      currentValue.seen = false;
                      console.log(
                        "Failed to update arrived at packhouse details in IndexedDB"
                      );
                    };
                    requestUpdate.onsuccess = (event) => {
                      var indexinArray = currentValue.pickupsList.findIndex(
                        (x) => x.Id === id
                      );
                      currentValue.dropdownContainer = false;
                      currentValue.arrivedAtPackHouse = false;
                      currentValue.emptyContainer = true;
                      currentValue.selectedItem = null;
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
                              item.status = "Arrived At Packhouse";
                              item.CurrentStatus = "Arrived At Packhouse";
                            } else {
                              if (item.status == "Enroute Packhouse") {
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
                                console.log(
                                  "pickups list updated successfully"
                                );
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
                      if (indexinArray != -1) {
                        currentValue.pickupsList[indexinArray].status =
                          data.status;
                      }
                      Vue.$toast.open({
                        message: "Data will be saved once you are back online.",
                        type: "success",
                        position: "top",
                      });
                      currentValue.seen = false;
                      currentValue.todaysPickups = [];
                      currentValue.dateTimeVal = null;
                      currentValue.bckCurrency = null;
                      currentValue.transportCostArrivedAtPackhouse = null;
                      currentValue.todayDate = moment
                        .utc()
                        .local()
                        .format("MMM DD, YYYY hh:mm A");
                      currentValue.arrivedAtAdditionalNotes = null;
                      console.log(
                        "Successfully updated arrived at packhouse details in IndexedDB"
                      );
                      db.close();
                    };
                  }
                };
              } else {
                console.log(`Couldn't find ${id}`);
              }
            });
          };
          request.onupgradeneeded = function (e) {
            let db = e.target.result;
            let objectStore = db.createObjectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            console.log("Database setup complete");
          };
        } else {
          var dbRef = firebase.database().ref("serviceRequest/");
          currentValue.todaysPickups.forEach((id, todaysPickupsIndex) => {
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(id)
              .on("child_added", function (data) {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                ref
                  .update(inpData)
                  .then(function () {
                    var _dbRef = firebase.database().ref("serviceRequest/");
                    _dbRef
                      .orderByChild("serviceRequestId")
                      .equalTo(id)
                      .on("child_added", function (data) {
                        var phoneNumber = data.val().phoneNumber;
                        sendSMS(
                          phoneNumber,
                          //  "Les fruits sont arrivés à la station de conditionnement"
                          "Nimewo pou jwenn sèvis : " +
                            data.val().displayId +
                            ". Fri yo rive nan stasyon pou kondisyònman"
                        )
                          .then((sent) => console.log(sent))
                          .catch((err) => console.log(err));
                      });

                    inpData.serviceRequestId = id;
                    currentValue.createArrivedAtPackhouseAPICall(inpData);
                    currentValue.dropdownContainer = false;
                    currentValue.arrivedAtPackHouse = false;
                    currentValue.emptyContainer = true;
                    currentValue.selectedItem = null;
                    currentValue.dateTimeVal = null;
                    currentValue.bckCurrency = null;
                    currentValue.transportCostArrivedAtPackhouse = null;
                    currentValue.todayDate = moment
                      .utc()
                      .local()
                      .format("MMM DD, YYYY hh:mm A");
                    currentValue.arrivedAtAdditionalNotes = null;
                    if (
                      currentValue.todaysPickups.length - 1 ==
                      todaysPickupsIndex
                    ) {
                      Vue.$toast.open({
                        message: "Status updated successfully.",
                        type: "success",
                        position: "top",
                      });
                      currentValue.todaysPickups = [];
                    }
                  })
                  .catch(function (error) {
                    currentValue.erroMessage = error.message;
                    currentValue.seen = false;
                  });
              });
          });
        }
      } else {
        currentValue.seen = false;
        Vue.$toast.open({
          message: "Please fill the mandatory fields",
          type: "error",
          position: "top",
        });
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
    createArrivedAtPackhouseAPICall(inpData) {
      let currentVal = this;
      const data = {
        id: inpData.serviceRequestId,
        status: "Arrived At Packhouse",
        arrivedAtPackhouseAddedOn: moment
          .utc(String(inpData.arrivedAtPackhouseAddedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        arrivedAtPackhouseAdditionalNote:
          inpData.arrivedAtPackhouseAdditionalNote,
        transportCostArrivedAtPackhouse:
          inpData.transportCostArrivedAtPackhouse,
        timeOfAdmittance: moment(String(inpData.timeofAdmittence)).format(
          "YYYY-MM-DDTHH:mm:ss"
        ),
      };
      currentVal.axios
        .post(
          `${
            getConfigVars().BASE_URL
          }50009/api/v1.0/collector-arrived-at-packhouse`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          }
        )
        .then(function (response) {
          currentVal.seen = false;
        })
        .catch(function (error) {
          currentVal.seen = false;

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
                currentVal.createArrivedAtPackhouseAPICall(inpData);
              });
          } else {
            currentVal.seen = false;
          }
        });
    },
    updateEnrouteProducerData() {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        let dbList;
        let requestList = window.indexedDB.open(
          "pickups_db_enrouteproducer",
          1
        );
        requestList.onerror = function () {
          resolve("failed to load database, or it does not exist.");
        };
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          var enrouteProducerArray = [];
          var objectStoreList = dbList
            .transaction("pickups")
            .objectStore("pickups");
          objectStoreList.getAll().onsuccess = () => {
            enrouteProducerArray = event.target.result;
            if (enrouteProducerArray.length == 0) {
              resolve("Nothing to update.");
            } else {
              enrouteProducerArray.forEach((item, index) => {
                console.log(item);
                vm.updateEnrouteProducerFirebaseData(item)
                  .then(function (resolved) {
                    console.log(resolved);
                    vm.enrouteProducerAPICall(item).then(
                      function (resolved) {
                        console.log(resolved);
                        var checkIndex = index + 1;
                        if (enrouteProducerArray.length == checkIndex) {
                          dbList.close();
                          var req = indexedDB.deleteDatabase(
                            "pickups_db_enrouteproducer"
                          );
                          req.onsuccess = function () {
                            resolve(
                              `Finished syncing enroute-producer data. Deleted Database.`
                            );
                          };
                          req.onerror = function () {
                            resolve(
                              `Couldn't delete database but finished syncing enroute-producer data.`
                            );
                          };
                          req.onblocked = function () {
                            resolve(
                              `Finished syncing, Couldn't delete database due to the operation being blocked`
                            );
                          };
                        }
                      },
                      function (err) {
                        console.log(err);
                        reject(err);
                      }
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          console.log("Database setup complete");
        };
      });
    },
    updateEnrouteProducerFirebaseData(item) {
      this.seen = true;
      return new Promise(function (resolve, reject) {
        console.log(item);
        var dbRef = firebase.database().ref("serviceRequest/");
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(item.serviceRequestId)
          .on("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update(item)
              .then(function () {
                console.log(
                  `${item.serviceRequestId} enroute-producer updated.`
                );
                resolve("updated");
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          });
      });
    },
    enrouteProducerAPICall(data) {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        let pickupDate = data.plannedPickUpAddedOn || data.pickupAddedOn;
        let currentVal = this;
        const apiData = {
          id: data.serviceRequestId,
          status: "Enroute Producer",
          plannedPickUpAddedOn: moment
            .utc(String(pickupDate))
            .format("YYYY-MM-DDTHH:mm:ss"),
          enrouteAdditionalNote: data.enrouteAdditionalNote || "",
        };
        vm.axios
          .post(
            `${
              getConfigVars().BASE_URL
            }50009/api/v1.0/collector-en-route-to-producer`,
            apiData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(
            function () {
              resolve(`${data.serviceRequestId} data updated in corda.`);
            },
            function (error) {
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
                    vm.enrouteProducerAPICall(data);
                  });
              } else {
                reject(error);
              }
              resolve("Error updating data to corda backend.");
            }
          )
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
                  vm.enrouteProducerAPICall(data);
                });
            } else {
              reject(error);
            }
          });
      });
    },
    updateWithProducerData() {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        let dbList;
        let requestList = window.indexedDB.open("pickups_db_withproducer", 1);
        requestList.onerror = function () {
          resolve("failed to load database, or it does not exist.");
        };
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          var withProducerArray = [];
          var objectStoreList = dbList
            .transaction("pickups")
            .objectStore("pickups");
          objectStoreList.getAll().onsuccess = () => {
            withProducerArray = event.target.result;
            if (withProducerArray.length == 0) {
              resolve("nothing to update");
            } else {
              withProducerArray.forEach((item, index) => {
                vm.updateWithProducerFirebaseData(item)
                  .then(function (resolved) {
                    var checkIndex = index + 1;
                    if (withProducerArray.length == checkIndex) {
                      dbList.close();
                      var req = indexedDB.deleteDatabase(
                        "pickups_db_withproducer"
                      );
                      req.onsuccess = function () {
                        resolve(
                          `Finished syncing with-producer data. Deleted Database.`
                        );
                      };
                      req.onerror = function () {
                        resolve(
                          `Couldn't delete database but finished syncing with-producer data.`
                        );
                      };
                      req.onblocked = function () {
                        resolve(
                          `Finished syncing, Couldn't delete database due to the operation being blocked`
                        );
                      };
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          console.log("Database setup complete");
        };
      });
    },
    updateWithProducerRejectData() {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        let dbList;
        let requestList = window.indexedDB.open("pickups_db_reject", 1);
        requestList.onerror = function () {
          resolve("failed to load database, or it does not exist.");
        };
        requestList.onsuccess = function () {
          console.log("With-Producer Reject Database opened successfully");
          dbList = requestList.result;
          var withProducerArray = [];
          var objectStoreList = dbList
            .transaction("pickups")
            .objectStore("pickups");
          objectStoreList.getAll().onsuccess = () => {
            withProducerArray = event.target.result;
            if (withProducerArray.length == 0) {
              resolve("nothing to update");
            } else {
              withProducerArray.forEach((item, index) => {
                vm.updateWithProducerRejectFirebaseData(item)
                  .then(function (resolved) {
                    console.log(resolved);
                    vm.rejectAPICall(item)
                      .then((res) => {
                        console.log(res);
                        var checkIndex = index + 1;
                        if (withProducerArray.length == checkIndex) {
                          dbList.close();
                          var req = indexedDB.deleteDatabase(
                            "pickups_db_withproducer"
                          );
                          req.onsuccess = function () {
                            resolve(
                              `Finished syncing with-producer data. Deleted Database.`
                            );
                          };
                          req.onerror = function () {
                            resolve(
                              `Couldn't delete database but finished syncing with-producer data.`
                            );
                          };
                          req.onblocked = function () {
                            resolve(
                              `Finished syncing, Couldn't delete database due to the operation being blocked`
                            );
                          };
                        }
                      })
                      .catch((err) => {
                        console.log(err);
                        resolve(err);
                      });
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          console.log("Database setup complete");
        };
      });
    },
    updateWithProducerRejectFirebaseData(item) {
      const vm = this;
      return new Promise((resolve, reject) => {
        var dbRef = firebase.database().ref("serviceRequest/");
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(item.serviceRequestId)
          .on("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update(item)
              .then((resolved) => {
                const phoneNumber = data.val().phoneNumber;

                // alert(item.rejectReason);
                switch (item.rejectReason) {
                  case "Quality":
                    {
                      sendSMS(
                        phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          data.val().displayId +
                          ". Yon lo fri rejete poutèt Kalite maksimal"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "Quantity":
                    {
                      sendSMS(
                        phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          data.val().displayId +
                          ". Yon lo fri rejete poutèt Kantite"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "Maturity":
                    {
                      sendSMS(
                        phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          data.val().displayId +
                          ". Yon lo fri rejete poutèt Lè fri a rèk"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "Temperature":
                    {
                      sendSMS(
                        phoneNumber,
                        "Nimewo pou jwenn sèvis : " +
                          data.val().displayId +
                          ". Yon lo fri rejete poutèt Lè Tanperati limit fri a"
                      )
                        .then((sent) => console.log(sent))
                        .catch((err) => console.log(err));
                    }
                    break;
                  case "R4NOSHOW":
                  case "R4OTHER":
                  default:
                    console.log("sms not needed");
                }
                console.log(resolved);
                resolve(resolved);
              })
              .catch((err) => {
                console.log(err);
                resolve(err);
              });
          });
      });
    },
    updateWithProducerFirebaseData(item) {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        if (item.fruitsHarvested != null && item.fruitsHarvested != undefined) {
          var fruitCount =
            Number(item.fruitsHarvested) - Number(item.fruitRejected);

          var dbRef = firebase.database().ref("serviceRequest/");
          dbRef
            .orderByChild("serviceRequestId")
            .equalTo(item.serviceRequestId)
            .on("child_added", function (data) {
              var product = data.val().product;
              var phoneNumber = data.val().phoneNumber;
              var ref = firebase.database().ref("serviceRequest/" + data.key);
              ref.update(item).then(function () {
                sendSMS(
                  phoneNumber,
                  "Nimewo pou jwenn sèvis : " +
                    data.val().displayId +
                    ". Kontra ki siyen " +
                    fruitCount +
                    " " +
                    product.trim() +
                    " nan pòst kolekt"
                );
              });
            });
        }
        if (item.status == "Rejected") {
          var ref = firebase.database().ref("serviceRequest/");
          ref
            .orderByChild("serviceRequestId")
            .equalTo(item.serviceRequestId)
            .on("child_added", function (data) {
              var phoneNumber = data.val().phoneNumber;
              sendSMS(
                phoneNumber,
                "Nimewo pou jwenn sèvis : " +
                  data.val().displayId +
                  ". Yon lo fri rejete poutèt Kalite maksimal"
              );
              vm.rejectAPICall(item).then(
                function (data) {
                  resolve(data);
                },
                (err) => {
                  reject(err);
                }
              );
            });
        } else if (item.status == "With Producer") {
          vm.uploadRejectedFruitsImages(item)
            .then((uploaded) => {
              console.log(uploaded);
              vm.uploadAgreemntDoc(
                item.serviceRequestId,
                item.agreementDocumentUrl
              ).then(
                function (url) {
                  item.agreementDocUrl = url;
                  delete item.agreementDocumentUrl;
                  delete item.fruitsRejectedImageBlobs;
                  item.agreementDocumentUrl = url;
                  var ref = firebase.database().ref("serviceRequest/");
                  ref
                    .orderByChild("serviceRequestId")
                    .equalTo(item.serviceRequestId)
                    .on("child_added", function (data) {
                      var ref = firebase
                        .database()
                        .ref("serviceRequest/" + data.key);
                      ref.update(item).then(function () {
                        console.log(
                          `${item.serviceRequestId} with producer data updated.`
                        );
                        vm.withProducerAPICall(item).then(
                          function () {
                            resolve(
                              `${item.serviceRequestId} with producer data updated to firebase.`
                            );
                          },
                          (err) => {
                            reject(err);
                          }
                        );
                      });
                    });
                },
                function (err) {
                  reject("error uploading doc.");
                }
              );
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      });
    },
    uploadAgreemntDoc(serviceRequestId, blobFile) {
      const vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        var storageRef = firebase
          .storage()
          .ref(`uploaded-files/agreements/${serviceRequestId}.pdf`);
        const uploadTask = storageRef.put(blobFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => console.log(snapshot),
          (error) => reject(error),
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              resolve(url);
            });
          }
        );
      });
    },
    withProducerAPICall(inpData) {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        let cordaData = {};
        if (inpData.paymentMethod == "Wire") {
          cordaData = {
            id: inpData.serviceRequestId,
            status: inpData.status,
            temperature: inpData.temperature,
            ambientTemp: inpData["ambient Temp"],
            crates: inpData.crates,
            fruitsHarvested: inpData.fruitsHarvested,
            fruitRejected: inpData.fruitRejected,
            advanceGiven: inpData.advanceGiven,
            lspAdvanceGivenCurrency: inpData.lspAdvanceGivenCurrency,
            lspAdvanceGiven: inpData.lspAdvanceGiven,
            ngo: inpData.selectedNGO,
            conversionRate: inpData.conversionRate,
            conversionCurrency: "USD",
            currency: inpData.currency,
            startingQRCode: inpData.withProducerQrCodeFile[0],
            endingQRCode:
              inpData.withProducerQrCodeFile[
                inpData.withProducerQrCodeFile.length - 1
              ],
            paymentMethod: inpData.paymentMethod,
            wirePayment: {
              SelectedBank: inpData.SelectedBank,
              selectedBankCode: inpData.selectedBankCode,
              AccountNumber: inpData.AccountNumber,
              BankCurrency: inpData.BankCurrency,
              accountType: inpData.accounttype,
            },
            AdditionalNotes: inpData.additionalNotes,
            withProducerTimeStamp: moment()
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss")
              .toString(),
            withProducerQrCodeFile: inpData.withProducerQrCodeFile,
          };
        } else if (inpData.paymentMethod == "Cash") {
          cordaData = {
            id: inpData.serviceRequestId,
            status: inpData.status,
            temperature: inpData.temperature,
            ambientTemp: inpData["ambient Temp"],
            crates: inpData.crates,
            fruitsHarvested: inpData.fruitsHarvested,
            fruitRejected: inpData.fruitRejected,
            advanceGiven: inpData.advanceGiven,
            lspAdvanceGivenCurrency: inpData.lspAdvanceGivenCurrency,
            lspAdvanceGiven: inpData.lspAdvanceGiven,
            ngo: inpData.selectedNGO,
            conversionRate: inpData.conversionRate,
            conversionCurrency: "USD",
            currency: inpData.currency,
            startingQRCode: inpData.withProducerQrCodeFile[0], //not passed from UI
            endingQRCode:
              inpData.withProducerQrCodeFile[
                inpData.withProducerQrCodeFile.length - 1
              ], // not passed from UI
            paymentMethod: inpData.paymentMethod,
            cashPayment: {
              cashPaymentCurrency: inpData.cashPaymentCurrency,
              farmerVoucher: inpData.farmerVoucher,
              contactnumber: inpData.contactnumber,
            },
            AdditionalNotes: inpData.additionalNotes,
            withProducerTimeStamp: moment()
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss")
              .toString(),
            withProducerQrCodeFile: inpData.withProducerQrCodeFile,
          };
        } else if (inpData.paymentMethod == "Mobile") {
          cordaData = {
            id: inpData.serviceRequestId,
            status: inpData.status,
            temperature: inpData.temperature,
            ambientTemp: inpData["ambient Temp"],
            crates: inpData.crates,
            fruitsHarvested: inpData.fruitsHarvested,
            fruitRejected: inpData.fruitRejected,
            advanceGiven: inpData.advanceGiven,
            lspAdvanceGivenCurrency: inpData.lspAdvanceGivenCurrency,
            lspAdvanceGiven: inpData.lspAdvanceGiven,
            ngo: inpData.selectedNGO,
            // selectedNGO: this.selectedNGO,
            conversionRate: inpData.conversionRate,
            conversionCurrency: "USD",
            currency: inpData.currency,
            startingQRCode: inpData.withProducerQrCodeFile[0], //not passed from UI
            endingQRCode:
              inpData.withProducerQrCodeFile[
                inpData.withProducerQrCodeFile.length - 1
              ], // not passed from UI
            paymentMethod: inpData.paymentMethod,
            mobilePayment: {
              mobilePaymentOperator: inpData.mobilePaymentOperator,
              mobilePaymentNumber: inpData.mobilePaymentNumber,
              mobilePaymentCurrency: inpData.mobilePaymentCurrency,
            },
            AdditionalNotes: inpData.additionalNotes,
            withProducerTimeStamp: moment()
              .utc()
              .format("YYYY-MM-DDTHH:mm:ss")
              .toString(),
            withProducerQrCodeFile: inpData.withProducerQrCodeFile,
          };
        }
        vm.axios
          .post(
            `${getConfigVars().BASE_URL}50009/api/v1.0/with-producer`,
            cordaData,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function () {
            if (inpData.PaidByLSP) {
              cordaData["PaidByLSP"] = true;
            }
            vm.updateReportData(cordaData);
            resolve(`Updated to corda backend.`);
          })
          .catch(function (error) {
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
            if (
              errorObject != undefined &&
              errorObject.message != undefined &&
              errorObject.message.indexOf("401") > -1
            ) {
              firebase
                .auth()
                .currentUser.getIdToken(true)
                .then((idtoken) => {
                  localStorage.IDtoken = "";
                  localStorage.IDtoken = idtoken;
                  vm.withProducerAPICall(inpData);
                });
            }
          });
      });
    },
    rejectAPICall(inpData) {
      let vm = this;
      return new Promise(function (resolve, reject) {
        const data = {
          id: inpData.serviceRequestId,
          status: inpData.status,
          rejectedOn: moment
            .utc(String(inpData.rejectedOn))
            .format("YYYY-MM-DDTHH:mm:ss"),
          rejectReason: inpData.rejectReason,
          rejectAddionalNote: inpData.rejectAddionalNote,
        };
        vm.axios
          .post(`${getConfigVars().BASE_URL}50009/api/v1.0/reject-lot`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(function (response) {
            vm.checkPenalityAPI(inpData.serviceRequestId).then(
              function (data) {
                resolve(data);
              },
              function (error) {
                console.log(error.message);
                //alert("fail");
                //refresh token
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
                      vm.rejectAPICall(inpData)
                        .then((res) => resolve(res))
                        .catch((err) => resolve(err));
                    });
                }
              }
            );
          })
          .catch(function (error) {
            console.log(error.message);
            //alert("fail");
            //refresh token
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
                  vm.rejectAPICall(inpData)
                    .then((res) => resolve(res))
                    .catch((err) => resolve(err));
                });
            }
          });
      });
    },
    checkPenalityAPI(serviceRequestId) {
      return new Promise(function (resolve, reject) {
        let vm = this;
        const data = {
          id: serviceRequestId,
        };
        vm.axios
          .post(`${getConfigVars().BASE_URL}50005/api/v1.0/penalties`, data, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          })
          .then(
            function () {
              resolve(`${serviceRequestId} rejected.`);
            },
            function (error) {
              let errorObject = JSON.parse(JSON.stringify(error));
              if (
                errorObject != undefined &&
                errorObject.message != undefined &&
                errorObject.message.indexOf("401") > -1
              ) {
                firebase
                  .auth()
                  .currentUser.getIdToken(true)
                  .then((idtoken) => {
                    localStorage.IDtoken = "";
                    localStorage.IDtoken = idtoken;
                    vm.checkPenalityAPI(serviceRequestId);
                  });
              }
              resolve("Error updating data to corda backend.");
            }
          )
          .catch(function (error) {
            let errorObject = JSON.parse(JSON.stringify(error));
            console.log(errorObject);
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
                  vm.checkPenalityAPI(serviceRequestId);
                });
            }
          });
      });
    },
    updateEnroutePackhouseData() {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        let dbList;
        let requestList = window.indexedDB.open(
          "pickups_db_enroutepackhouse",
          1
        );
        requestList.onerror = function () {
          resolve("failed to load database, or it does not exist.");
        };
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          var enroutePackhouseArray = [];
          var objectStoreList = dbList
            .transaction("pickups")
            .objectStore("pickups");
          objectStoreList.getAll().onsuccess = () => {
            enroutePackhouseArray = event.target.result;
            if (enroutePackhouseArray.length == 0) {
              resolve("Nothing to update.");
            } else {
              enroutePackhouseArray.forEach((item, index) => {
                vm.updateEnroutePackhouseFirebaseData(item)
                  .then(function (resolved) {
                    console.log(resolved);
                    vm.enroutePackhouseAPICall(item).then(
                      function (resolved) {
                        console.log(resolved);
                        var checkIndex = index + 1;
                        if (enroutePackhouseArray.length == checkIndex) {
                          dbList.close();
                          var req = indexedDB.deleteDatabase(
                            "pickups_db_enroutepackhouse"
                          );
                          req.onsuccess = function () {
                            resolve(
                              `Finished syncing enroute-producer data. Deleted Database.`
                            );
                          };
                          req.onerror = function () {
                            resolve(
                              `Couldn't delete database but finished syncing enroute-producer data.`
                            );
                          };
                          req.onblocked = function () {
                            resolve(
                              `Finished syncing, Couldn't delete database due to the operation being blocked`
                            );
                          };
                        }
                      },
                      function (err) {
                        console.log(err);
                        reject(err);
                      }
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          console.log("Database setup complete");
        };
      });
    },
    updateEnroutePackhouseFirebaseData(item) {
      const vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        var dbRef = firebase.database().ref("serviceRequest/");
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(item.serviceRequestId)
          .on("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref.update(item).then(
              function () {
                resolve(
                  `${item.serviceRequestId} enroute packhouse data updated.`
                );
              },
              (err) => {
                reject(err);
              }
            );
          });
      });
    },
    enroutePackhouseAPICall(inpData) {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        const data = {
          id: inpData.serviceRequestId,
          status: "Enroute Packhouse",
          enroutePackhouseAddedOn: moment
            .utc(String(inpData.enroutePackhouseAddedOn))
            .format("YYYY-MM-DDTHH:mm:ss"),
          enroutePackhouseAdditionalNote:
            inpData.enroutePackhouseAdditionalNote,
          dropOffAtPackhouse: inpData.dropOffAtPackhouse,
        };
        vm.axios
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
          .then(function () {
            resolve(`${inpData.serviceRequestId} updated to corda backend.`);
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
                  vm.enroutePackhouseAPICall(inpData);
                });
            }
          });
      });
    },
    //working here
    updateReportData(inputData) {
      var currentVal = this;
      let id = inputData.id || inputData.serviceRequestId;
      firebase
        .database()
        .ref("serviceRequest/")
        .orderByChild("serviceRequestId")
        .equalTo(id)
        .on("child_added", function (data) {
          var farmerVoucher = uuid.v1().replace(/-/g, "");
          var inputReportData = null;
          inputReportData = {
            ServiceRequestId: id,
            organizationKey: data.val().organizationKey,
            mode: "Advance",
            advanceTransactionId: uuid.v1(),
            advanceFarmerVoucher: farmerVoucher,
          };

          if (inputData.PaidByLSP) {
            inputReportData["PaidByLSP"] = true;
          }

          var nodeName = null;
          var formattedDate = moment(String(moment.utc(new Date()))).format(
            "YYYYMMDD"
          );

          var formattedTomorrowsDate = moment(
            String(moment.utc(new Date()).add("days", 1))
          ).format("YYYYMMDD");
          var currentDateinESTDate = moment(new Date()).tz("America/New_York");

          var currentDate = moment(new Date()).format("YYYY-MM-DD");
          var compareDate = moment.tz(
            currentDate + " 14:45:59",
            "America/New_York"
          );
          if (currentDateinESTDate > compareDate) {
            nodeName = "_" + formattedTomorrowsDate;
          } else {
            nodeName = "_" + formattedDate;
          }
          var reportDataRef = firebase
            .database()
            .ref("reportData")
            .child(nodeName);
          reportDataRef
            .push(inputReportData)
            .then(function () {
              console.log("success");
              console.log(data.val().phoneNumber);
              if (Number(inputData.advanceGiven) != 0) {
                var modeTransfer = "";
                if (inputData.paymentMethod == "Wire") {
                  modeTransfer = "fil";
                } else if (inputData.paymentMethod == "Cash") {
                  modeTransfer = "Lajan Kach";
                } else if (inputData.paymentMethod == "Mobile") {
                  modeTransfer = "lajan mobil";
                }
                let smsDate = moment(data.val().requestedOn).format("MM.DD");
                sendSMS(
                  data.val().phoneNumber,
                  `Wap resevwa HTG ${
                    inputData.advanceGiven
                  } nan ${modeTransfer} pou Harvest ${
                    data.val().displayId
                  } la ki te fèt nan dat (${smsDate})`
                )
                  .then((sent) => console.log(sent))
                  .catch((err) => console.log(err));
              }
            })
            .catch(function (error) {
              console.log(error);
              console.log("");
              currentVal.seen = false;
              Vue.$toast.open({
                message: currentVal.$t(
                  "Error updating data to firebase",
                  "Error updating data to firebase"
                ),
                type: "error",
                position: "top",
              });
            });
        });
    },

    updateArrivedAtPackhouseData() {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        let dbList;
        let requestList = window.indexedDB.open(
          "pickups_db_arrivedatpackhouse",
          1
        );
        requestList.onerror = function () {
          resolve("failed to load database, or it does not exist.");
        };
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          var arrivedAtPackhouseArray = [];
          var objectStoreList = dbList
            .transaction("pickups")
            .objectStore("pickups");
          objectStoreList.getAll().onsuccess = () => {
            arrivedAtPackhouseArray = event.target.result;
            if (arrivedAtPackhouseArray.length == 0) {
              resolve("nothing to update.");
            } else {
              arrivedAtPackhouseArray.forEach((item, index) => {
                console.log(item);
                vm.updateArrivedAtPackhouseFirebaseData(item)
                  .then(function (resolved) {
                    console.log(resolved);
                    vm.arrivedAtPackhouseAPICall(item).then(
                      function (resolved) {
                        console.log(resolved);
                        var checkIndex = index + 1;
                        if (arrivedAtPackhouseArray.length == checkIndex) {
                          vm.todaysPickups = [];
                          vm.todayDate = moment
                            .utc()
                            .local()
                            .format("MMM DD, YYYY hh:mm A");
                          vm.bckCurrency = null;
                          vm.transportCostArrivedAtPackhouse = null;
                          vm.dateTimeVal = null;
                          vm.arrivedAtAdditionalNotes = null;
                          dbList.close();
                          var req = indexedDB.deleteDatabase(
                            "pickups_db_arrivedatpackhouse"
                          );
                          req.onsuccess = function () {
                            resolve(
                              `Finished syncing enroute-producer data. Deleted Database.`
                            );
                          };
                          req.onerror = function () {
                            resolve(
                              `Couldn't delete database but finished syncing enroute-producer data.`
                            );
                          };
                          req.onblocked = function () {
                            resolve(
                              `Finished syncing, Couldn't delete database due to the operation being blocked`
                            );
                          };
                        }
                      },
                      function (err) {
                        console.log(err);
                        reject(err);
                      }
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
            }
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickups", {
            keyPath: "serviceRequestId",
          });
          console.log("Database setup complete");
        };
      });
    },
    updateArrivedAtPackhouseFirebaseData(item) {
      const vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        var dbRef = firebase.database().ref("serviceRequest/");
        dbRef
          .orderByChild("serviceRequestId")
          .equalTo(item.serviceRequestId)
          .on("child_added", function (data) {
            var phoneNumber = data.val().phoneNumber;
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update(item)
              .then(function () {
                sendSMS(
                  phoneNumber,
                  "Nimewo pou jwenn sèvis : " +
                    data.val().displayId +
                    ". Fri yo rive nan stasyon pou kondisyònman"
                );
                resolve(
                  `${item.serviceRequestId} arrived at packhouse data updated.`
                );
              })
              .catch((err) => {
                reject(err);
              });
          });
      });
    },
    arrivedAtPackhouseAPICall(inpData) {
      let vm = this;
      vm.seen = true;
      return new Promise(function (resolve, reject) {
        vm.seen = true;
        const data = {
          id: inpData.serviceRequestId,
          status: "Arrived At Packhouse",
          arrivedAtPackhouseAddedOn: moment
            .utc(String(inpData.arrivedAtPackhouseAddedOn))
            .format("YYYY-MM-DDTHH:mm:ss"),
          arrivedAtPackhouseAdditionalNote:
            inpData.arrivedAtPackhouseAdditionalNote,
          transportCostArrivedAtPackhouse:
            inpData.transportCostArrivedAtPackhouse,
          timeOfAdmittance: moment(String(inpData.timeofAdmittence)).format(
            "YYYY-MM-DDTHH:mm:ss"
          ),
        };
        vm.axios
          .post(
            `${
              getConfigVars().BASE_URL
            }50009/api/v1.0/collector-arrived-at-packhouse`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(
            function () {
              resolve(
                `${inpData.serviceRequestId} arrived at packhouse data updated in corda backend.`
              );
            },
            function (error) {
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
                    vm.arrivedAtPackhouseAPICall(inpData);
                  });
              }
              resolve("some error while updating to corda.");
            }
          )
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
                  vm.arrivedAtPackhouseAPICall(inpData);
                });
            }
          });
      });
    },
    goToCollectorDashboard() {
      Router.push("collector-dashboard");
    },
    updateTodaysPickupList(item) {
      const todaysDate = moment.utc().toString();
      const requestedOnDate = item.scheduledOn || item.PickupRequestedOn;
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

      if (index == -1) {
        console.log("new entry");
        vm.todaysPickups.push(item.Id);
      } else {
        console.log("deleting entry");
        vm.todaysPickups.splice(index, 1);
      }
    },
    uploadRejectedFruitsImages(inpData) {
      const vm = this;
      return new Promise((resolve, reject) => {
        if (inpData.fruitsRejectedImageBlobs.length == 0) {
          resolve("no images to upload.");
        } else {
          inpData.fruitsRejectedImageBlobs.forEach((image, index) => {
            const uploadRef = firebase
              .storage()
              .ref(
                `uploaded-files/with-producer-fruits-rejected/${inpData.serviceRequestId}/`
              );

            const uploadTask = uploadRef.put(image);

            uploadTask.on(
              "state_changed",
              (snapshot) => console.log(snapshot),
              (err) => console.log(err),
              () => {
                uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then((url) => {
                    console.log(url);
                    if (index == inpData.fruitsRejectedImageBlobs.length - 1) {
                      resolve("uploaded");
                    }
                  })
                  .catch((err) => reject(err));
              }
            );
          });
        }
      });
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
