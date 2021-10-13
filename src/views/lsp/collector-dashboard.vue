<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-5 content-container">
        <div class="header-container">
          <h4 class="heading">
            {{ $t("Dashboard", "Dashboard") }} -
            {{ $t("Collector", "Collector") }}
          </h4>
        </div>
        <div class="main-container">
          <div class="service-container">
            <div class="row">
              <div class="col-md-6">
                <div
                  v-on:click="showEnrouteProducer"
                  class="
                    service-img-container
                    new-request-container
                    lsp-dashboard-container
                  "
                >
                  <img
                    class="service-img"
                    src="../../assets/images/schedule_pickup.png"
                  />
                  <div style="clear: both"></div>
                  <p>
                    {{ $t("Enroute Producer", "Enroute Producer") }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  v-on:click="showWithProducer"
                  class="
                    service-img-container
                    new-request-container
                    lsp-dashboard-container
                  "
                >
                  <img
                    class="service-img img-previous"
                    src="../../assets/images/history.png"
                  />
                  <div style="clear: both"></div>
                  <p>{{ $t("With Producer", "With Producer") }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="service-container">
            <div class="row">
              <div class="col-md-6">
                <div
                  v-on:click="showEnroutePackhouse"
                  class="
                    service-img-container
                    new-request-container
                    lsp-dashboard-container
                  "
                >
                  <img
                    class="service-img"
                    src="../../assets/images/packhouse.png"
                  />
                  <div style="clear: both"></div>
                  <p>{{ $t("Enroute Packhouse", "Enroute Packhouse") }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div
                  v-on:click="showArrivedAtPackhouse"
                  class="
                    service-img-container
                    new-request-container
                    lsp-dashboard-container
                  "
                >
                  <img
                    class="service-img"
                    src="../../assets/images/batch.png"
                  />
                  <div style="clear: both"></div>
                  <p>
                    {{ $t("Arrived At Packhouse", "Arrived At Packhouse") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3"></div>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase from "firebase";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import moment from "moment";
import Offline from "v-offline";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  name: "collector-dashboard",
  data: function () {
    return {
      userName: "",
      networkStatus: false,
      seen: true,
      internetAvailable: null,
    };
  },
  components: {
    Header,
    Footer,
    Offline,
  },
  mounted() {
    this.checkInternetStatus().then((internetStatus) => {
      console.log(internetStatus);
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
          ]);
        } else if (localStorage.systemRole == 2) {
          this.$refs.headercomp.createBreadcrumb([
            {
              text: this.$t("Collector-Dashboard", "Collector-Dashboard"),
              href: "/collector-dashboard",
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
          ]);
        }
      }

      this.userName = localStorage.userName;
      var currentValue = this;
      // clearing up indexedDB if already exists
      currentValue
        .clearIndexedDB()
        .then((resolved) => {
          console.log(resolved);
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
            let objectStoreStatus = transactionStatus.objectStore(
              "pickupsList",
              {
                keyPath: "key",
              }
            );
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
              if (dataStatus != undefined) {
                currentValue.handleConnectivityChange(dataStatus.values);
              } else {
                currentValue.handleConnectivityChange(true);
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
        })
        .catch((error) => {
          console.log("error deleting indexedDB databases");
        });
      //IndexedDb code ends here
    });
  },
  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
      var currentValue = this;
      setTimeout(() => {
        currentValue.seen = false;
      }, 15000);
      //Fetching pickups list when online
      if (currentValue.internetAvailable) {
        currentValue.getBanksList();
        currentValue.getNgoList();
        currentValue.getPerUnitCosts();
        currentValue.getPackhouseList();
        currentValue.getCurrencyExchangeRate();
        let dbList;
        let requestList = window.indexedDB.open("pickupsList_db", 1);
        requestList.onerror = () => {
          console.log("Database failed to open");
        };
        requestList.onsuccess = () => {
          console.log("Database opened successfully");
          dbList = requestList.result;
          let newItemList = {
            key: 1,
            values: [],
          };
          let transactionList = dbList.transaction(
            ["pickupsList"],
            "readwrite"
          );
          let objectStoreList = transactionList.objectStore("pickupsList", {
            keyPath: "key",
          });
          var requestWPList = objectStoreList.get(1);
          requestWPList.onsuccess = (event) => {
            var dataList = event.target.result;
            //Fetching pickups list when online
            let rawName = this.userName.trim().split("(", 1);
            rawName = rawName[0].trim();
            var ref = firebase.database().ref("serviceRequest/");
            if (localStorage.systemRole == 99) {
              var count = 0;

              ref.on("value", function (snapshot) {
                console.log(snapshot);
                snapshot.forEach((requestData) => {
                  if (
                    [
                      "Assigned",
                      "Enroute Producer",
                      "With Producer",
                      "Enroute Packhouse",
                    ].indexOf(requestData.val().status) != -1
                  ) {
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
                      phoneNumber: requestData.val().phoneNumber,
                      status: requestData.val().status,
                      collector: requestData.val().collector,
                      town: requestData.val().town,
                      collectionPoint: requestData.val().collectionPoint,
                      dateOfPickup: requestData.val().dateOfPickup,
                      producer: requestData.val().producer,
                      scheduledOn: requestData.val().pickupAddedOn,
                      organization: requestData.val().organization,
                      organizationKey: requestData.val().organizationKey,
                      displayId: requestData.val().displayId,
                      // serviceRequestedOn: moment
                      //   .utc(requestData.val().requestedOn)
                      //   .local(),
                    };
                    newItemList.values.push(data);
                  }
                  var checkCount = count + 1;
                  if (snapshot.numChildren() == checkCount) {
                    if (newItemList.values.length > 0) {
                      newItemList.values.reverse();
                      //For rejecting the inactive service requests -start
                      for (let i = 0; i < newItemList.values.length; i++) {
                        let _serviceRequestedOn = moment
                          .utc(requestData.val().requestedOn)
                          .local();
                        let tenDaysBefore = moment(new Date())
                          .subtract(10, "days")
                          .toDate();
                        if (_serviceRequestedOn < tenDaysBefore) {
                          var inpData = {
                            status: "Rejected",
                            rejectedOn: moment.utc().toString(),
                            rejectReason: "Inactive service request",
                            rejectAddionalNote: "",
                          };
                          var dbRef = firebase
                            .database()
                            .ref("serviceRequest/")
                            .orderByChild("serviceRequestId")
                            .equalTo(newItemList.values[i].Id);
                          dbRef.on("child_added", (rejectionSnapshot) => {
                            let ref = firebase
                              .database()
                              .ref("serviceRequest/" + rejectionSnapshot.key);
                            ref.update(inpData).then((res) => {
                              console.log("success");
                            });
                          });
                        }
                      }
                      //For rejecting the inactive service requests -end
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
                      let requestObjectList;
                      if (dataList == undefined) {
                        requestObjectList = objectStoreList.add(newItemList);
                      } else {
                        requestObjectList = objectStoreList.put(newItemList);
                      }
                      requestObjectList.onsuccess = () => {
                        console.log("added successfully");
                        currentValue.seen = false;
                      };
                      transactionList.oncomplete = () => {
                        console.log(
                          "Transaction completed: database modification finished."
                        );
                        dbList.close();
                      };
                      transactionList.onerror = (error) => {
                        console.log("Transaction not opened due to error");
                        console.log(error);
                      };
                    }
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
                  snapshot.forEach((requestData) => {
                    if (
                      [
                        "Assigned",
                        "Enroute Producer",
                        "With Producer",
                        "Enroute Packhouse",
                      ].indexOf(requestData.val().status) != -1
                    ) {
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
                        scheduledOn: requestData.val().pickupAddedOn,
                        organization: requestData.val().organization,
                        organizationKey: requestData.val().organizationKey,
                        displayId: requestData.val().displayId,
                        // serviceRequestedOn: moment
                        //   .utc(requestData.val().requestedOn)
                        //   .local(),
                      };
                      newItemList.values.push(data);
                    }
                    var checkCount = count + 1;
                    if (snapshot.numChildren() == checkCount) {
                      newItemList.values.reverse();
                      // For rejecting the inactive service requests -start
                      for (let i = 0; i < newItemList.values.length; i++) {
                        let _serviceRequestedOn = moment
                          .utc(requestData.val().requestedOn)
                          .local();
                        let tenDaysBefore = moment(new Date())
                          .subtract(10, "days")
                          .toDate();
                        if (_serviceRequestedOn < tenDaysBefore) {
                          var inpData = {
                            status: "Rejected",
                            rejectedOn: moment.utc().toString(),
                            rejectReason: "Inactive service request",
                            rejectAddionalNote: "",
                          };
                          var dbRef = firebase
                            .database()
                            .ref("serviceRequest/")
                            .orderByChild("serviceRequestId")
                            .equalTo(newItemList.values[i].Id);
                          dbRef.on("child_added", (rejectionSnapshot) => {
                            let ref = firebase
                              .database()
                              .ref("serviceRequest/" + rejectionSnapshot.key);
                            ref.update(inpData).then((res) => {
                              console.log("success");
                            });
                          });
                        }
                      }
                      //For rejecting the inactive service requests -end
                      if (newItemList.values.length > 0) {
                        let requestObjectList;
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
                        if (dataList == undefined) {
                          requestObjectList = objectStoreList.add(newItemList);
                        } else {
                          requestObjectList = objectStoreList.put(newItemList);
                        }
                        requestObjectList.onsuccess = () => {
                          console.log("added successfully");
                          currentValue.seen = false;
                        };
                        transactionList.oncomplete = () => {
                          currentValue.seen = false;
                          console.log(
                            "Transaction completed: database modification finished."
                          );
                          dbList.close();
                        };
                        transactionList.onerror = (error) => {
                          console.log("Transaction not opened due to error");
                          console.log(error);
                        };
                      }
                    }
                    count++;
                  });
                });
            }
          };
          requestWPList.onerror = (event) => {
            console.log("Failed to get the list from IndexedDB");
          };
        };
        requestList.onupgradeneeded = function (e) {
          let dbList = e.target.result;
          let objectStoreList = dbList.createObjectStore("pickupsList", {
            keyPath: "key",
          });
          console.log("Database setup complete");
        };
      } else {
        currentValue.seen = false;
      }
      //fetching Pickupslist complete

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
          let objectStoreStatus = transactionStatus.objectStore("pickupsList", {
            keyPath: "key",
          });
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
    showArrivedAtPackhouse: function () {
      Router.push("arrived-at-packhouse");
    },
    showEnrouteProducer: function (event) {
      Router.push("enroute-producer");
    },
    showWithProducer: function (event) {
      Router.push("with-producer");
    },
    showEnroutePackhouse: function (event) {
      Router.push("enroute-packhouse");
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("collector-dashboard");
      }
    },
    getBanksList() {
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_banks", 1);
      requestList.onerror = () => {
        console.log("Database failed to open");
      };
      requestList.onsuccess = () => {
        console.log("Database opened successfully");
        dbList = requestList.result;
        let newItemList = {
          key: 1,
          values: [],
        };
        let transactionList = dbList.transaction(["pickupsList"], "readwrite");
        let objectStoreList = transactionList.objectStore("pickupsList", {
          keyPath: "key",
        });
        var requestWPList = objectStoreList.get(1);
        requestWPList.onsuccess = (event) => {
          var dataList = event.target.result;
          //Fetching banks list when online
          if (dataList == undefined) {
            var ref = firebase.database().ref().child("masters").child("bank");

            var count = 0;

            ref.on("value", function (snapshot) {
              snapshot.forEach((requestData) => {
                var data = "";
                data = requestData.val();
                newItemList.values.push(data);
                var checkCount = count + 1;
                if (snapshot.numChildren() == checkCount) {
                  if (newItemList.values.length > 0) {
                    newItemList.values.reverse();
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
                    let requestObjectList;
                    if (dataList == undefined) {
                      requestObjectList = objectStoreList.add(newItemList);
                    } else {
                      requestObjectList = objectStoreList.put(newItemList);
                    }
                    requestObjectList.onsuccess = () => {
                      console.log("added successfully");
                    };
                    transactionList.oncomplete = () => {
                      console.log(
                        "Transaction completed: database modification finished."
                      );
                      dbList.close();
                    };
                    transactionList.onerror = (error) => {
                      console.log("Transaction not opened due to error");
                      console.log(error);
                    };
                  }
                }
                count++;
              });
            });
          }
        };
        requestWPList.onerror = (event) => {
          console.log("Failed to get the list from IndexedDB");
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

    getPerUnitCosts() {
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_unitCost", 1);
      requestList.onerror = () => {
        console.log("Database failed to open");
      };
      requestList.onsuccess = () => {
        console.log("Database opened successfully");
        dbList = requestList.result;
        let newItemList = {
          key: 1,
          values: [],
        };
        let transactionList = dbList.transaction(["pickupsList"], "readwrite");
        let objectStoreList = transactionList.objectStore("pickupsList", {
          keyPath: "key",
        });
        var requestWPList = objectStoreList.get(1);
        requestWPList.onsuccess = (event) => {
          var dataList = event.target.result;

          if (dataList == undefined) {
            var ref = firebase
              .database()
              .ref()
              .child("masters")
              .child("product");

            var count = 0;

            ref.on("value", function (snapshot) {
              console.log(snapshot);
              console.log(snapshot.val());
              snapshot.forEach((requestData) => {
                var data = {};
                data[requestData.key] = requestData.val();
                newItemList.values.push(data);
                var checkCount = count + 1;

                console.log(snapshot.numChildren());

                if (snapshot.numChildren() == checkCount) {
                  if (newItemList.values.length > 0) {
                    newItemList.values.reverse();
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
                    let requestObjectList;
                    if (dataList == undefined) {
                      requestObjectList = objectStoreList.add(newItemList);
                    } else {
                      requestObjectList = objectStoreList.put(newItemList);
                    }
                    requestObjectList.onsuccess = () => {
                      console.log("added successfully");
                    };
                    transactionList.oncomplete = () => {
                      console.log(
                        "Transaction completed: database modification finished."
                      );
                      dbList.close();
                    };
                    transactionList.onerror = (error) => {
                      console.log("Transaction not opened due to error");
                      console.log(error);
                    };
                  }
                }
                count++;
              });
            });
          }
        };
        requestWPList.onerror = (event) => {
          console.log("Failed to get the list from IndexedDB");
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

    getNgoList() {
      var currentVal = this;
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_ngo", 1);
      requestList.onerror = () => {
        console.log("Database failed to open");
      };
      requestList.onsuccess = () => {
        console.log("Database opened successfully");
        dbList = requestList.result;
        let newItemList = {
          key: 1,
          values: [],
        };
        let transactionList = dbList.transaction(["pickupsList"], "readwrite");
        let objectStoreList = transactionList.objectStore("pickupsList", {
          keyPath: "key",
        });
        var requestWPList = objectStoreList.get(1);
        requestWPList.onsuccess = (event) => {
          var dataList = event.target.result;
          //Fetching ngo list when online

          var ref = firebase.database().ref().child("masters").child("ngos");

          var count = 0;

          ref.on("child_added", function (snapshot) {
            console.log(snapshot.val());

            var data = snapshot.val();
            console.log(snapshot.val());
            data = snapshot.val().title;
            newItemList.values.push(data);
            var checkCount = count + 1;
            if (snapshot.numChildren() == checkCount) {
              if (newItemList.values.length > 0) {
                newItemList.values.reverse();
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
                let requestObjectList;
                if (dataList == undefined) {
                  requestObjectList = objectStoreList.add(newItemList);
                } else {
                  requestObjectList = objectStoreList.put(newItemList);
                }
                requestObjectList.onsuccess = () => {
                  console.log("added successfully");
                };
                transactionList.oncomplete = () => {
                  console.log(
                    "Transaction completed: database modification finished."
                  );
                  dbList.close();
                };
                transactionList.onerror = (error) => {
                  console.log("Transaction not opened due to error");
                  console.log(error);
                };
              }
            }
            count++;
          });
        };
        requestWPList.onerror = (event) => {
          console.log("Failed to get the list from IndexedDB");
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
    getPackhouseList() {
      let dbList;
      let requestList = window.indexedDB.open("pickupsList_db_packhouse", 1);
      requestList.onerror = () => {
        console.log("Database failed to open");
      };
      requestList.onsuccess = () => {
        console.log("Database opened successfully");
        dbList = requestList.result;
        let newItemList = {
          key: 1,
          values: [],
        };
        let transactionList = dbList.transaction(["pickupsList"], "readwrite");
        let objectStoreList = transactionList.objectStore("pickupsList", {
          keyPath: "key",
        });
        var requestWPList = objectStoreList.get(1);
        requestWPList.onsuccess = (event) => {
          var dataList = event.target.result;
          //Fetching banks list when online
          if (dataList == undefined) {
            let ref = null;
            if (localStorage.systemRole == 99) {
              ref = firebase
                .database()
                .ref()
                .child("masters")
                .child("packHouse");
            } else {
              ref = firebase
                .database()
                .ref()
                .child("masters")
                .child("packHouse")
                .orderByChild("organizationKey")
                .equalTo(localStorage.organizationKey);
            }

            var count = 0;

            ref.on("value", function (snapshot) {
              console.log(snapshot.val());
              snapshot.forEach((requestData, index) => {
                var data = "";
                console.log(requestData.val());
                data = {
                  name: requestData.val().title,
                  organization: requestData.val().organization,
                  organizationKey: requestData.val().organizationKey,
                };
                newItemList.values.push(data);
                var checkCount = count + 1;
                if (snapshot.numChildren() == checkCount) {
                  if (newItemList.values.length > 0) {
                    newItemList.values.reverse();
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
                    let requestObjectList;
                    if (dataList == undefined) {
                      requestObjectList = objectStoreList.add(newItemList);
                    } else {
                      requestObjectList = objectStoreList.put(newItemList);
                    }
                    requestObjectList.onsuccess = () => {
                      console.log("added successfully");
                    };
                    transactionList.oncomplete = () => {
                      console.log(
                        "Transaction completed: database modification finished."
                      );
                      dbList.close();
                    };
                    transactionList.onerror = (error) => {
                      console.log("Transaction not opened due to error");
                      console.log(error);
                    };
                  }
                }
                count++;
              });
            });
          }
        };
        requestWPList.onerror = (event) => {
          console.log("Failed to get the list from IndexedDB");
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
    getCurrencyExchangeRate() {
      let currentValue = this;
      currentValue.axios
        .get(
          `https://openexchangerates.org/api/latest.json?app_id=7e54f418ea954e02be2248a3b6df63aa`
        )
        .then(function (response) {
          console.log(response.data.rates.HTG);
          const currencyExchangeRate = Number(response.data.rates.HTG).toFixed(
            2
          );

          // store in indexedDb

          let dbList;
          let requestList = window.indexedDB.open(
            "pickupsList_db_currencyRate",
            1
          );
          requestList.onerror = () => {
            console.log("Database failed to open");
          };

          requestList.onupgradeneeded = function (e) {
            let dbList = e.target.result;
            let objectStoreList = dbList.createObjectStore("pickupsList", {
              keyPath: "key",
            });
            console.log("Database setup complete");
          };

          requestList.onsuccess = () => {
            console.log("Database opened successfully");
            dbList = requestList.result;
            let newItemList = {
              key: 1,
              values: [],
            };
            let transactionList = dbList.transaction(
              ["pickupsList"],
              "readwrite"
            );
            let objectStoreList = transactionList.objectStore("pickupsList", {
              keyPath: "key",
            });
            var requestWPList = objectStoreList.get(1);
            requestWPList.onsuccess = (event) => {
              var dataList = event.target.result;

              newItemList.values.push(currencyExchangeRate);

              if (newItemList.values.length > 0) {
                newItemList.values.reverse();
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
                let requestObjectList;
                if (dataList == undefined) {
                  requestObjectList = objectStoreList.add(newItemList);
                } else {
                  requestObjectList = objectStoreList.put(newItemList);
                }
                requestObjectList.onsuccess = () => {
                  console.log("added successfully");
                };
                transactionList.oncomplete = () => {
                  console.log(
                    "Transaction completed: database modification finished."
                  );
                  dbList.close();
                };
                transactionList.onerror = (error) => {
                  console.log("Transaction not opened due to error");
                  console.log(error);
                };
              }
            };
            requestWPList.onerror = (event) => {
              console.log("Failed to get the list from IndexedDB");
            };
          };

          // indexedDb code ends here.
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    clearIndexedDB() {
      const vm = this;
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
        if (!vm.internetAvailable) {
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
              vm.internetAvailable = false;
              resolve("not available");
            }
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
</style>
<style>
.single-container {
  width: 100% !important;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: auto !important;
}

.new-request-container {
  cursor: pointer;
}

.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.product-container {
  text-align: center;
  padding-top: 0px !important;
}
p {
  color: #fff;
  text-align: center;
}
.service-img-container {
  width: 50%;
  float: left;
  height: 125px;
  margin: 0px !important;
}
.service-img {
  width: 65px;
  height: auto;
  text-align: center;
  padding: 10px;
}
.service-container {
  display: inline-block;
  width: 100%;
  padding-top: 35px;
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
  margin-top: 10px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
}
.lsp-dashboard-container {
  width: 100% !important;
}
.lsp-dashboard-container .service-img {
  height: 65px !important;
}
.lsp-dashboard-container .img-previous {
  width: 48px !important;
}
@media screen and (max-width: 768px) {
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
@media screen and (max-width: 768px) {
  .col-md-5 {
    flex: 95% !important;
    max-width: 95% !important;
  }
}
</style>
