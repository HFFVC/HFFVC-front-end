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
                    <!-- <label class="lbl-flname lbl-pickup">
                      <b>Created By</b>
                      : {{ item.createdBy }}
                    </label>-->
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ $t("Location", "Location") }}</b>
                      :
                      {{
                        $t(
                          item.collectionPointCoord || "",
                          item.collectionPointCoord || ""
                        )
                      }}
                    </label>
                    <!-- <label class="lbl-flname lbl-pickup">
                      <b>Scheduled By</b>
                      : {{ item.scheduledBy || "" }}
                    </label>
                    <label class="lbl-flname lbl-pickup">
                      <b>Scheduled On</b>
                      : {{ item.scheduledOn }}
                    </label>-->
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
            {{ $t("Status - Enroute Producer", "Status - Enroute Producer") }}
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
              <div v-if="todaysPickups.length > 0" class="enroute-container">
                <input
                  type="text"
                  class="addition-note"
                  v-model="additionalNotes"
                  :placeholder="$t('Additional Notes', 'Additional Notes')"
                />
                <div class="clear-both"></div>
              </div>
            </div>
          </perfect-scrollbar>
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
            v-on:click="updateEnrouteStatus"
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
      title="Status"
      data-backdrop="static"
    >
      <label class="lbl-offline">
        {{
          $t(
            `There seems to be no Internet connectivity. Your data will be automatically
        synchronized the moment connectivity is established. You can continue to
        work with the application in the meanwhile`,
            `There seems to be no Internet connectivity. Your data will be automatically
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
  name: "enroute-producer",
  data: function () {
    return {
      userName: null,
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      enrouteContainer: false,
      currentItem: null,
      // selectedItem: null,
      apiData: null,
      networkStatus: true,
      additionalNotes: null,
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
            text: this.$t("Enroute Producer", "Enroute Producer"),
            href: "/enroute-producer",
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
                text: this.$t("Enroute Producer", "Enroute Producer"),
                href: "/enroute-producer",
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
                text: this.$t("Enroute Producer", "Enroute Producer"),
                href: "/enroute-producer",
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
              text: this.$t("Enroute Producer", "Enroute Producer"),
              href: "/enroute-producer",
            },
          ]);
        } else if (localStorage.systemRole == 3) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
            },
            {
              text: this.$t("Enroute Producer", "Enroute Producer"),
              href: "/enroute-producer",
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
              text: this.$t("Enroute Producer", "Enroute Producer"),
              href: "/enroute-producer",
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
              text: this.$t("Enroute Producer", "Enroute Producer"),
              href: "/enroute-producer",
            },
          ]);
        }
      }
      // if (localStorage.emailId == null || localStorage.emailId == "") {
      //   Router.push("/");
      // }
      this.userName = localStorage.userName;
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
            this.getPickupList();
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
      //IndexedDb code ends here
    });
  },
  methods: {
    handleConnectivityChange(status) {
      const vm = this;
      vm.checkInternetStatus().then((internetStatus) => {
        console.log(internetStatus);
        vm.networkStatus = vm.internetAvailable;
        this.getPickupList();
        var currentVal = this;
        //IndexedDB Code starts here
        if (vm.internetAvailable) {
          let db;
          let request = window.indexedDB.open("pickups_db_enrouteproducer", 1);
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
                  currentVal
                    .createEnrouteAPICall(item)
                    .then((updated) => {
                      console.log(updated);
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
                              var indexinArray =
                                currentVal.pickupsList.findIndex(
                                  (x) => x.Id === item.serviceRequestId
                                );
                              if (indexinArray != -1) {
                                currentVal.pickupsList[indexinArray].status =
                                  item.status;
                              }
                              // currentVal.createEnrouteAPICall(item);
                              console.log("success " + item.serviceRequestId);
                              //creating a new varibale to assign (index + 1) since on code formatting the bracket inside if is dissappearing
                              var checkIndex = index + 1;
                              if (serviceRequestsArray.length == checkIndex) {
                                db.close();
                                currentVal.seen = false;
                                Vue.$toast.open({
                                  position: "top",
                                  message: "Data sync completed.",
                                  type: "success",
                                });
                                var req = indexedDB.deleteDatabase(
                                  "pickups_db_enrouteproducer"
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
                            .catch((error) => {
                              currentVal.seen = false;
                            });
                        });
                    })
                    .catch((error) => {
                      console.log(error);
                      currentVal.seen = false;
                      Vue.$toast.open({
                        message: "Error updating data, please try again.",
                        type: "error",
                        position: "top",
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
          currentVal.$refs["offline-modal"].show();
          setTimeout(function () {
            currentVal.$refs["offline-modal"].hide();
          }, 4000);
          //Create/Open database
          let db;
          let request = window.indexedDB.open("pickups_db_enrouteproducer", 1);
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
    cancelSelectedItem: function () {
      this.enrouteContainer = false;
      this.selectedItem = null;
    },
    updateEnrouteStatus: function () {
      this.seen = true;
      let currentValue = this;
      currentValue.checkInternetStatus().then((internetStatus) => {
        console.log(internetStatus);
        var inpData = {
          status: "Enroute Producer",
          plannedPickUpAddedOn: moment.utc().toString(),
          enrouteAdditionalNote: currentValue.additionalNotes,
          enrouteToProducerAddedBy: localStorage.userName.split("(")[0],
        };
        //IndexedDb Code starts here
        if (!currentValue.internetAvailable) {
          let db;
          let request = window.indexedDB.open("pickups_db_enrouteproducer", 1);
          request.onerror = () => {
            console.log("Database failed to open");
          };
          request.onsuccess = () => {
            console.log("Database opened successfully");
            db = request.result;
            let transaction = db.transaction(["pickups"], "readwrite");
            let objectStore = transaction.objectStore("pickups", {
              keyPath: "serviceRequestId",
            });
            currentValue.todaysPickups.forEach((id, todaysListIndex) => {
              const index = Vue.lodash.findIndex(currentValue.pickupsList, {
                Id: id,
              });
              if (index != -1) {
                const currentItem = currentValue.pickupsList[index];
                //For updating the existing service request on click of save button
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
                      status: inpData.status,
                      plannedPickUpAddedOn: inpData.plannedPickUpAddedOn,
                      enrouteAdditionalNote: inpData.enrouteAdditionalNote,
                      enrouteToProducerAddedBy: localStorage.userName,
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
                              item.status = "Enroute Producer";
                              item.CurrentStatus = "Enroute Producer";
                            } else {
                              if (item.status == "Assigned") {
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
                                currentValue.seen = false;
                                if (
                                  todaysListIndex ==
                                  currentValue.todaysPickups.length - 1
                                ) {
                                  currentValue.todaysPickups = [];
                                  Vue.$toast.open({
                                    message:
                                      "Data will be saved once you are back online.",
                                    type: "success",
                                    position: "top",
                                  });
                                }
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
                      currentValue.enrouteContainer = false;
                      currentValue.emptyContainer = true;
                      // currentValue.todaysPickups = [];
                      currentValue.additionalNotes = "";
                      currentValue.seen = false;
                      console.log("added successfully");
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
                    data.status = inpData.status;
                    data.plannedPickUpAddedOn = inpData.plannedPickUpAddedOn;
                    data.enrouteAdditionalNote = inpData.enrouteAdditionalNote;
                    data.enrouteToProducerAddedBy =
                      inpData.enrouteToProducerAddedBy;
                    let transaction = db.transaction(["pickups"], "readwrite");
                    let objectStore = transaction.objectStore("pickups", {
                      keyPath: "serviceRequestId",
                    });
                    let requestObject = objectStore.put(data);
                    requestObject.onsuccess = () => {
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
                              item.status = "Enroute Producer";
                              item.CurrentStatus = "Enroute Producer";
                            } else {
                              if (item.status == "Assigned") {
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
                                currentValue.seen = false;
                                if (
                                  todaysListIndex ==
                                  currentValue.todaysPickups.length - 1
                                ) {
                                  currentValue.todaysPickups = [];
                                  Vue.$toast.open({
                                    message:
                                      "Data will be saved once you are back online.",
                                    type: "success",
                                    position: "top",
                                  });
                                }
                                console.log(
                                  "pickups list updated successfully"
                                );
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

                      currentValue.enrouteContainer = false;
                      currentValue.emptyContainer = true;
                      currentValue.selectedItem = null;
                      currentValue.additionalNotes = "";
                      currentValue.seen = false;
                      console.log("added successfully");
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
                  }
                };
              } else {
                console.log(`Couldn't find ${id}`);
              }
            });
          };
        } else {
          let itemsToUpdateList = [...currentValue.todaysPickups];
          currentValue.todaysPickups.forEach((id, todaysListIndex) => {
            var dbRef = firebase.database().ref("serviceRequest/");
            dbRef
              .orderByChild("serviceRequestId")
              .equalTo(id)
              .once("child_added", function (data) {
                var ref = firebase.database().ref("serviceRequest/" + data.key);
                console.log(data.val());
                let dataToPush = data.val();
                dataToPush.serviceRequestId = id;
                currentValue
                  .createEnrouteAPICall(dataToPush)
                  .then((updated) => {
                    console.log(updated);
                    ref
                      .update(inpData)
                      .then(function () {
                        // currentValue.createEnrouteAPICall(dataToPush);
                        if (todaysListIndex == itemsToUpdateList.length - 1) {
                          currentValue.seen = false;
                          Vue.$toast.open({
                            message: "Status updated successfully.",
                            type: "success",
                            position: "top",
                          });
                          currentValue.enrouteContainer = false;
                          currentValue.emptyContainer = true;
                          currentValue.selectedItem = null;
                          currentValue.additionalNotes = "";
                        }
                      })
                      .catch(function (error) {
                        currentValue.seen = false;
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    currentValue.seen = false;
                    Vue.$toast.open({
                      message: "Error updating the data, please try again.",
                      type: "success",
                      position: "top",
                    });
                  });
              });
          });
        }
        //IndexedDb Code ends here
      });
    },
    showSelected: function (item) {
      this.addToTodaysPickupsList(item);
      this.initialContainer = false;
      this.currentItem = null;
      this.currentItem = item;
      this.enrouteContainer = true;
      this.emptyContainer = false;
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
              if (requestData.val().status == "Assigned") {
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
                  createdBy: requestData.val().serviceRequestCreatedBy || "",
                  collectionPointCoord:
                    requestData.val().collectionPointCoord || "",
                  scheduledBy: requestData.val().scheduledBy || "",
                  scheduledOn: requestData.val().pickupAddedOn || "",
                  organization: requestData.val().organization,
                  organizationKey: requestData.val().organizationKey,
                };
                currentval.pickupsList.push(data);
                currentval.updateTodaysPickupList(data);
              }
              var checkCount = count + 1;
              if (snapshot.numChildren() == checkCount) {
                // currentval.selectedItem = currentval.pickupsList[0].Id;
                currentval.currentItem = currentval.pickupsList[0];
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
                if (requestData.val().status == "Assigned") {
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
                    status: requestData.val().status,
                    phoneNumber: requestData.val().phoneNumber,
                    collector: requestData.val().collector,
                    scheduledOn: requestData.val().pickupAddedOn,
                    organization: requestData.val().organization,
                    organizationKey: requestData.val().organizationKey,
                  };
                  currentval.pickupsList.push(data);
                  currentval.updateTodaysPickupList(data);
                }
                var checkCount = count + 1;
                if (snapshot.numChildren() == checkCount) {
                  currentval.pickupsList.reverse();
                  currentval.seen = false;
                }
                count++;
              });
            });
        }
      } else {
        //IndexedDB code starts here - for fetching pickupslist from indexedDB if network is not there
        let dbList;
        let requestList = window.indexedDB.open("pickupsList_db", 1);
        requestList.onsuccess = function () {
          console.log("Database opened successfully");
          dbList = requestList.result;
          var pickupsListArray = [];
          var objectStoreList = dbList
            .transaction("pickupsList")
            .objectStore("pickupsList");
          objectStoreList.getAll().onsuccess = () => {
            pickupsListArray = event.target.result;
            currentval.seen = true;
            pickupsListArray[0].values.forEach((item, index) => {
              if (item.status == "Assigned") {
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
        Router.push("enroute-producer");
      }
    },
    createEnrouteAPICall(data) {
      console.log(data);
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
      return new Promise((resolve, reject) => {
        currentVal.axios
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
          .then((resolved) => {
            console.log(resolved);
            resolve("updated");
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
                  currentVal
                    .createEnrouteAPICall(data)
                    .then(() => resolve("resolved"))
                    .catch(() => reject("error"));
                });
            } else {
              reject(error);
            }
          });
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

      if (index == -1) {
        console.log("new entry");
        vm.todaysPickups.push(item.Id);
      } else {
        console.log("deleting entry");
        vm.todaysPickups.splice(index, 1);
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
