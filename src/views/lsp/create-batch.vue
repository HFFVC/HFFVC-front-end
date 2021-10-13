<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>

    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content create-batch-modal-wrap">
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">{{ $t("Lots", "Lots") }}</h3>
          <div class="icon-container">
            <ul>
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
              class="tbl-services create-batches-table"
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
            </v-client-table>
            <input
              type="button"
              class="btn-save"
              v-on:click="createBatch"
              :value="$t('Create Batch', 'Create Batch')"
            />
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>

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
      <b-modal
        hide-footer
        id="palletelizing-modal"
        ref="palletelizing-modal"
        hide-backdrop
        title="Palletizing"
      >
        <div class="input-wrap carton-filling-input-wrap">
          <div class="inp-container inp-container-same-line">
            <label class="input-label-pallet"
              >{{
                $t("Start QR Code # - Pallets", "Start QR Code # - Pallets")
              }}
              *</label
            >

            <input
              v-model="startQRCodePallets"
              class="text-input"
              type="text"
              placeholder="PA000001"
            />
          </div>

          <div class="inp-container inp-container-same-line">
            <label class="input-label-pallet"
              >{{
                $t("End QR Code # - Pallets", "End QR Code # - Pallets")
              }}
              *</label
            >

            <input
              v-model="endQRCodePallets"
              class="text-input"
              type="text"
              placeholder="PA999999"
            />
          </div>
          <h3>Transportation Details</h3>
          <div class="inp-container inp-container-same-line">
            <div class="row">
              <label class="input-label-pallet">
              {{
                $t("Currency", "Currency")
              }} *
            </label>


            <v-select
                    v-model="currency"
                    :placeholder="$t('Select Currency', 'Select Currency')"
                    class="planned-pickup-v-select currency-planned-pickup currency-selector-wrapper"
                    :options="currencySource"
                  >
                </v-select>
            
            </div>
            
          </div>
          <div class="inp-container inp-container-same-line">
            <label class="input-label-pallet">
              {{
                $t("Transport Cost", "Transport Cost")
              }} *
            </label>

            <input
              type="number"
              class="text-input transportation-cost-wrapper"
              placeholder="00.00"
              v-model="transportCost"
              min="0"
              >
          </div>
        </div>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hidePalletModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="savePallet"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
        </div>
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
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import { uuid } from "vue-uuid";

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import Offline from "v-offline";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

Vue.use(VueToast);

Vue.use(Datetime);

Vue.use(BootstrapVue);
Vue.use(ClientTable);

export default {
  components: {
    Header,
    Footer,
    Offline,
  },
  name: "active-service-requests",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Select",
        "Organization",
        "Product",
        "No of Boxes",
        "fruitFlowCompletedOn",
        "Destination",
        "Shipping",
      ],
      currencySource: ["USD", "HTG"],
      currency: null,
      transportCost: null,
      boxData: null,
      options: {
        perPage: 10,
        sortable: ["fruitFlowCompletedOn"],
        headings: {
          Select: `${this.$t("Select", "Select")}`,
          Product: `${this.$t("Product", "Product")}`,
          "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
          fruitFlowCompletedOn: `${this.$t(
            "Fruit Flow Completed On",
            "Fruit Flow Completed On"
          )}`,
          Destination: `${this.$t("Destination", "Destination")}`,
          Shipping: `${this.$t("Shipping", "Shipping")}`,
          Organization: `${this.$t("Organization", "Organization")}`,
        },
        customSorting: {
          fruitFlowCompletedOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.fruitFlowCompletedOn);
              let dateB = new Date(b.fruitFlowCompletedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
        orderBy: {
          ascending: false,
          column: "fruitFlowCompletedOn",
        },
      },
      seen: true,
      show: false,
      selectedRow: null,
      sportsData: ["Mango", "Pineapple", "Avocado"],
      dateTime: null,
      userName: "",
      packHouse: [],
      errorMessage: "",
      succesContent: "",
      checkedRows: [],
      batchId: "",
      batchCreatedAt: null,
      lotIds: [],
      batchCreatedAt: null,
      palletsQRCodesFile: null,
      startQRCodePallets: null,
      endQRCodePallets: null,
      networkStatus: true,
    };
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
            "Packhouse Incharge-Dashboard",
            "Packhouse Incharge-Dashboard"
          ),
          href: "/pack-house-incharge-dashboard",
        },
        { text: this.$t("Lots", "Lots"), href: "/create-batch" },
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
              "Packhouse Incharge-Dashboard",
              "Packhouse Incharge-Dashboard"
            ),
            href: "/pack-house-incharge-dashboard",
          },
          { text: this.$t("Lots", "Lots"), href: "/create-batch" },
        ]);
      }
      else
      {
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
          { text: this.$t("Lots", "Lots"), href: "/create-batch" },
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
          { text: this.$t("Lots", "Lots"), href: "/create-batch" },
        ]);
      } else if (localStorage.systemRole == 96) {
        this.$refs.headercomp.createBreadcrumb([
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
          { text: this.$t("Lots", "Lots"), href: "/create-batch" },
        ]);
      } else if (localStorage.systemRole == 2) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Packhouse Incharge-Dashboard",
              "Packhouse Incharge-Dashboard"
            ),
            href: "/pack-house-incharge-dashboard",
          },
          { text: this.$t("Lots", "Lots"), href: "/create-batch" },
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
          { text: this.$t("Lots", "Lots"), href: "/create-batch" },
        ]);
      }
    }
    this.options = {
      perPage: 10,
      sortable: ["fruitFlowCompletedOn"],
      headings: {
        Select: `${this.$t("Select", "Select")}`,
        Product: `${this.$t("Product", "Product")}`,
        "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
        fruitFlowCompletedOn: `${this.$t(
          "Fruit Flow Completed On",
          "Fruit Flow Completed On"
        )}`,
        Destination: `${this.$t("Destination", "Destination")}`,
        Shipping: `${this.$t("Shipping", "Shipping")}`,
        Organization: `${this.$t("Organization", "Organization")}`,
      },
      customSorting: {
        fruitFlowCompletedOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.fruitFlowCompletedOn);
            let dateB = new Date(b.fruitFlowCompletedOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
      orderBy: {
        ascending: false,
        column: "fruitFlowCompletedOn",
      },
    };
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();

    this.userName = localStorage.userName;
  },

  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    hidePalletModal: function () {
      this.$refs["palletelizing-modal"].hide();
    },
    savePallet: function () {
      let currentValue = this;
      currentValue.seen = true;
      if (
        this.startQRCodePallets != null &&
        this.startQRCodePallets != "" &&
        this.endQRCodePallets != null &&
        this.endQRCodePallets != ""
      ) {
        currentValue.batchCreatedAt = moment.utc().toString();
        var batchRef = firebase
          .database()
          .ref()
          .child("batch")
          .child(this.batchId);

        var lspOrganizationName = "";
        var lspOrganizationKey = "";
        if (localStorage.systemRole == 99) {
          lspOrganizationName = currentValue.serviceRequests[0].Organization;
          lspOrganizationKey = currentValue.serviceRequests[0].organizationKey;
        } else {
          lspOrganizationName = localStorage.organization;
          lspOrganizationKey = localStorage.organizationKey;
        }

        var inpData = {
          status: "Batch Created",
          batchId: currentValue.batchId,
          batchCreatedAt: currentValue.batchCreatedAt,
          noOfLots: currentValue.checkedRows.length,
          product: currentValue.serviceRequests[0].Product,
          dropOfLocation: currentValue.serviceRequests[0].dropOfLocation,
          startQRCodePallets: currentValue.startQRCodePallets,
          endQRCodePallets: currentValue.endQRCodePallets,
          createdBy: localStorage.userName,
          organization: lspOrganizationName,
          organizationKey: lspOrganizationKey,
          transportCost: currentValue.transportCost,
          transportCurrency: currentValue.currency
        };

        currentValue
          .createBatchAPICall(
            currentValue.batchId,
            inpData,
            currentValue.lotIds,
            inpData.startQRCodePallets,
            inpData.startQRCodePallets
          )
          .then((resolved) => {
            console.log(resolved);
            batchRef.set(inpData).then(function (response) {
              var rowLength = currentValue.checkedRows.length;

              for (var i = 0; i < currentValue.checkedRows.length; i++) {
                currentValue.updateBatch(
                  i,
                  inpData.startQRCodePallets,
                  inpData.endQRCodePallets
                );
              }
              currentValue.startQRCodePallets = "";
              currentValue.endQRCodePallets = "";
            });
          })
          .catch((error) => {
            console.log(error);
            currentValue.seen = false;
            Vue.$toast.open({
              message: currentValue.$t(
                "Error updating data to corda blockchain.",
                "Error updating data to corda blockchain."
              ),
              type: "error",
              position: "top",
            });
          });
      } else {
        Vue.$toast.open({
          message: currentValue.$t(
            "Please fill all the fields.",
            "Please fill all the fields."
          ),
          type: "error",
          position: "top",
        });
        currentValue.seen = false;
      }
    },
    createBatch: function () {
      const currentValue = this;
      if (this.networkStatus) {
        this.batchId = "";
        this.batchId = uuid.v1();
        this.lotIds = [];
        if (this.checkedRows.length == 0) {
          Vue.$toast.open({
            message: currentValue.$t(
              "Please select one or more lots to create batch.",
              "Please select one or more lots to create batch."
            ),
            type: "error",
            position: "top",
          });
        } else {
          let currentValue = this;

          for (var i = 0; i < this.checkedRows.length; i++) {
            currentValue.lotIds.push(currentValue.checkedRows[i].Id);
          }
          // console.log(currentValue.checkedRows[0].Organization);
          let _product = currentValue.checkedRows[0].Product;
          let _shippingDetails = currentValue.checkedRows[0].Shipping;
          let _organization = currentValue.checkedRows[0].Organization;
          let canBatchBeCreated = true;
          for (let i = 0; i < currentValue.checkedRows.length; i++) {
            if (
              currentValue.checkedRows[i].Product != _product ||
              currentValue.checkedRows[i].Shipping != _shippingDetails ||
              currentValue.checkedRows[i].Organization != _organization
            ) {
              canBatchBeCreated = false;
              break;
            }
          }
          console.log(canBatchBeCreated);
          if (canBatchBeCreated) {
            currentValue.getTotalNoOfBoxes().then(resolved => {
              console.log(resolved);
              currentValue.$refs["palletelizing-modal"].show();
            })
            .catch(
              error => {
                console.log(error);
                currentValue.seen = false;
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Error getting total number of boxes",
                    "Error getting total number of boxes"
                  )
                })
                return false;
              }
            )
          } else {
            Vue.$toast.open({
              message: currentValue.$t(
                `Product, Shipping mode and Organzation has to be same for creating batch.`,
                `Product, Shipping mode and Organzation  has to be same for creating batch.`
              ),
              type: "error",
              position: "top",
            });
            //  currentValue.seen = false;
          }
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
    },
    udateStatus: function (i) {
      let currentValue = this;
      console.log(currentValue.boxData);
      console.log(currentValue.boxData[currentValue.checkedRows[i].Id]);
      // calculate share in transportation cost based on no. of boxes
      let ratio = Number((Number(currentValue.boxData[currentValue.checkedRows[i].Id]) / Number(currentValue.boxData.totalNoOfBoxes)).toFixed(2));
      let transportCost = Number(ratio * Number(currentValue.transportCost).toFixed(2));
      var serviceRef = firebase.database().ref().child("serviceRequest");
      var inpData = {
        status: "Batch Created",
        batchId: currentValue.batchId,
        batchCreatedAt: currentValue.batchCreatedAt,
        updatedBy: localStorage.userName,
        transportCurrency: currentValue.currency,
        transportCost
      };
      serviceRef
        .orderByChild("serviceRequestId")
        .equalTo(currentValue.checkedRows[i].Id)
        .on("child_added", function (data) {
          var ref = firebase.database().ref("serviceRequest/" + data.key);
          ref
            .update(inpData)
            .then(function () {
              if (currentValue.checkedRows.length == i + 1) {
                currentValue.seen = false;
                currentValue.clearSelection();
                Vue.$toast.open({
                  message: currentValue.$t(
                    "Batch created successfully.",
                    "Batch created successfully."
                  ),
                  type: "success",
                  position: "top",
                });
                //currentValue.startQRCodePallets = "";
                // currentValue.endQRCodePallets = "";
                currentValue.transportCost = null;
                currentValue.currency = null;
                currentValue.checkedRows = [];
                currentValue.lotIds = [];
                currentValue.hidePalletModal();
                currentValue.serviceRequests = [];
                currentValue.getData();
              }
            })
            .catch(function (error) {
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Error updating details in firebase",
                  "Error updating details in firebase"
                ),
                type: "error",
                position: "top",
              });
            });
        });
    },
    updateBatch: function (i, palletStartQRCode, palletEndQRCode) {
      let currentValue = this;
      var inpData = {
        status: "Batch Created",
        displayId : currentValue.checkedRows[i]["displayId"],
        batchCreatedOn: moment.utc().toString(),
        noOfBoxes: currentValue.checkedRows[i]["No of Boxes"],
        fruitFlowCompletedOn:
          currentValue.checkedRows[i]["fruitFlowCompletedOn"],
        destination: currentValue.checkedRows[i]["Destination"],
        product: currentValue.checkedRows[i]["Product"],
        serviceRequestId: currentValue.checkedRows[i]["Id"],
        shipping: currentValue.checkedRows[i]["Shipping"],
        phoneNumber: currentValue.checkedRows[i]["phoneNumber"],
        updatedBy: localStorage.userName,
      };
      var batchRef = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.batchId)
        .child("lots")
        .child(currentValue.checkedRows[i]["Id"]);

      batchRef
        .set(inpData)
        .then(function (response) {
          currentValue.udateStatus(i);
        })
        .catch(function (error) {
          Vue.$toast.open({
            message: error.message,
            type: "error",
            position: "top",
          });
          currentValue.seen = false;
          Vue.$toast.open({
            message: currentValue.$t(
              "Something went wrong!! Please try again!!",
              "Something went wrong!! Please try again!!"
            ),
            type: "error",
            position: "top-right",
          });
        });
    },
    getData: function () {
      let currentValue = this;
      currentValue.serviceRequests = [];
      var ref = firebase.database().ref().child("serviceRequest");

      currentValue
        .getHarvestPlannersList()
        .then((harvestPlanners) => {
          console.log(harvestPlanners);
        })
        .catch(() => {
          currentValue.seen = false;
          console.log("No harvest planners found");
        });

      ref
        .orderByChild("status")
        .equalTo("Packing Completed")
        .on(
          "child_added",
          function (snapshot) {
            console.log(snapshot.val());
            const cartonFillingAndPalletizingData = snapshot.val()
              .cartonFillingAndPalletizingData;
            let numberOfBoxes = 0;
            cartonFillingAndPalletizingData.forEach((item) => {
              console.log(item);
              numberOfBoxes += item.boxQRCodes.length;
            });
            // let splittingFactor = 0;
            // let startCode = snapshot.val().startQRCodeBoxes.toLowerCase();
            // let endCode = snapshot.val().endQRCodeBoxes.toLowerCase();
            // for (let i = 0; i < startCode.length; i++) {
            //   if (startCode.charAt(i) == endCode.charAt(i)) {
            //     splittingFactor++;
            //   } else {
            //     break;
            //   }
            // }
            // console.log(splittingFactor);
            // let startBox = Number(
            //   startCode.substring(splittingFactor, startCode.length)
            // );
            // let endBox = Number(
            //   endCode.substring(splittingFactor, endCode.length)
            // );
            console.log("******************");
            console.log(snapshot.val());
            const _data = {
              Product: snapshot.val().product,
              displayId: snapshot.val().displayId,
              "No of Boxes": numberOfBoxes,
              // (Number(snapshot.val().endQRCodeBoxes.split("A")[1]) -
              // Number(snapshot.val().startQRCodeBoxes.split("A")[1]))+1,

              fruitFlowCompletedOn: moment(
                String(snapshot.val().fruitFlowCompletedOn)
              ).format("MMM DD, YYYY hh:mm A"),
              Destination: snapshot.val().destinationTransport,
              Shipping: snapshot
                .val()
                .shippingDetails.shippingMode.split("(")[0],
              Id: snapshot.val().serviceRequestId,
              dropOfLocation: snapshot.val().dropOffAtPackhouse,
              phoneNumber: snapshot.val().phoneNumber,
              Organization: snapshot.val().organization,
              organizationKey: snapshot.val().organizationKey,
            };
            if (
              snapshot.val().organizationKey == localStorage.organizationKey
              // localStorage.systemRole == 99 ||
              // localStorage.systemRole == 9 ||
              // localStorage.systemRole == 7
            ) {
              currentValue.serviceRequests.push(_data);
            } else if (localStorage.systemRole.includes(99)) {
              currentValue.serviceRequests.push(_data);
              // console.log(snapshot.val());
              // const createdBy = (() => {
              //   if (snapshot.val().serviceRequestcreatedBy) {
              //     const name = snapshot
              //       .val()
              //       .serviceRequestcreatedBy.split("(")[0];
              //     return name.trim();
              //   }
              // })();
              // if (harvestPlanners.includes(createdBy)) {
              //   currentValue.serviceRequests.push(_data);
              // }
            }
            currentValue.serviceRequests.reverse();
            currentValue.seen = false;
          },
          function (error) {
            console.log("Error: " + error.code);
          }
        );
      setTimeout(function () {
        console.log(currentValue.serviceRequests);
        if (currentValue.serviceRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 4000);
    },

    hideModal: function () {
      this.$refs["pickup-modal"].hide();
    },

    closeModal() {
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
    },

    sendInfo(item) {
      this.selectedRow = null;
      this.errorMessage = "";
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
      this.selectedRow = item;
      this.$refs["pickup-modal"].show();
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
    showMapView: function (event) {
      Router.push("active-service-map-view");
    },
    showMap: function (id) {
      Router.push("active-service-map/" + id);
    },
    showServiceRequests: function (event) {
      Router.push("active-service-requests");
    },
    showCalenderView: function (event) {
      Router.push("active-service-calender-view");
    },
    showDashboard: function () {
      Router.push("pack-house-incharge-dashboard");
    },
    clearSelection() {
      this.checkedRows = [];
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
    createBatchAPICall(
      batchId,
      inpData,
      lotIds,
      palletStartQRCode,
      palletEndQRCode
    ) {
      console.log(inpData);

      let currentVal = this;
      const data = {
        batchId: batchId,
        batchCreatedAt: moment(inpData.batchCreatedAt)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss"),
        palletStartQRCode: palletStartQRCode,
        palletEndQRCode: palletEndQRCode,
        lotIds: lotIds,
       transportCost: inpData.transportCost,
       transportCurrency: inpData.transportCurrency
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50007/api/v1.0/create-batch`,
            data,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.IDtoken,
              },
            }
          )
          .then(function (response) {
            // currentVal.checkedRows = [];
            // currentVal.lotIds = [];
            resolve(response);
          })
          .catch(function (error) {
            console.log(error.message);
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
                    .createBatchAPICall(
                      batchId,
                      inpData,
                      lotIds,
                      palletStartQRCode,
                      palletEndQRCode
                    )
                    .then((res) => {
                      // currentVal.checkedRows = [];
                      // currentVal.lotIds = [];
                      resolve(res);
                    })
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
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
            console.log(requestData.val());

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
                    `${requestData.val().firstName} ${
                      requestData.val().lastName
                    }`
                  );
                }
              }
            }
          });
          resolve(harvestPlanners);
        });
      });
    },
    getTotalNoOfBoxes() {
      const vm = this;
      vm.boxData = null;
      console.log(vm.lotIds);
      let totalNoOfBoxes = 0;
      let finalData = {};
      return new Promise((resolve, reject) => {
        vm.lotIds.forEach((serviceRequestId, index) => {
          firebase
            .database()
            .ref("serviceRequest")
            .orderByChild("serviceRequestId")
            .equalTo(serviceRequestId)
            .once('child_added', snapshot => {
              console.log(snapshot.val());
              let data = snapshot.val()
              console.log(data);
              if (data) {
                if (data.cartonFillingAndPalletizingData) {
                  console.log(data.cartonFillingAndPalletizingData);
                  data.cartonFillingAndPalletizingData.map(lot => {
                    console.log(lot.boxQRCodes.length);
                    totalNoOfBoxes += lot.boxQRCodes.length
                    if (finalData && finalData[serviceRequestId]) {
                      finalData[serviceRequestId] += lot.boxQRCodes.length
                    } else {
                      finalData[serviceRequestId] = lot.boxQRCodes.length
                    }
                  })
                }
              }
              if (index == vm.lotIds.length-1) {
                finalData["totalNoOfBoxes"] = totalNoOfBoxes;
                console.log(finalData);
                vm.boxData = finalData;
                resolve(finalData)
              }
            })
        })
      })
    }
  },
};
</script>
<style scoped>
.input-label-pallet {
  color: #fff;
  /* padding: 20px; */
  padding: 6px;
}
.btn-save {
  margin: 10px -1px 10px 10px !important;
  height: 30px;
}
.btn-cancel {
  height: 30px;
  margin-top: 10px !important;
}
.inp-container inp-container-same-line {
  width: 50%;
  float: left;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";
.lbl-modal-success {
  color: #fff;
}
#palletelizing-modal___BV_modal_header_ {
  height: 50px !important;
}

#palletelizing-modal .modal-header .close {
  margin-top: -23px !important;
  font-size: 30px;
  color: #fff !important;
  margin-left: -8px !important;
}
#palletelizing-modal .modal-header h5 {
  margin: -8px 185px !important;
}
.text-input {
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  width: 60%;
  background: transparent;
  margin-bottom: 20px;
  height: 36px;
  /* margin-left: 10px; */
  color: #fff;
  font-size: 12px !important;
}
.create-batches-table thead tr th:nth-child(5),
.create-batches-table tbody tr td:nth-child(5),
.create-batches-table tbody tr td:nth-child(6) {
  text-align: left !important;
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
  float: right;
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
.create-batch-modal-wrap .modal-header .close {
  display: none !important;
  visibility: hidden;
}
.modal-title {
  margin: 0 auto !important;
  color: #fff !important;
}
.datepicker {
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  margin-bottom: 20px !important;
  border-radius: 0 !important;
  outline: 0 !important;
  height: 36px;
}
.datepicker:focus {
  box-shadow: none !important;
}
.datepicker {
  background-image: url("../../assets/images/calendar_view2.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
  font-size: 13px;
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
.create-batches-table thead tr th:nth-child(6),
.create-batches-table tbody tr td:nth-child(6) {
  text-align: left !important;
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
  width: 500px;
  margin: 0px auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.create-batches-table thead tr th:nth-child(3),
.create-batches-table tbody tr td:nth-child(3) {
  text-align: center !important;
}
.create-batches-table thead tr th {
  font-weight: bold;
}
.create-batches-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.create-batches-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}

@media screen and (max-width: 768px) {
  .create-batches-table tbody tr td:nth-child(6) {
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
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}
.collectionpoint {
  background-image: url("../../assets/images/collection_point.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}
.dropoff {
  background-image: url("../../assets/images/packhouse.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
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
.create-batches-table tbody tr td:nth-child(4) {
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
  /* height: auto;
  padding: 15px; */
  height: 50px !important;
  padding: 12px !important;
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

.create-batches-table th:nth-child(3) {
  text-align: center;
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
  padding: 30px;
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
  margin-right: 1px;
  margin-top: 5px;
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
.currency-selector-wrapper {
    margin-left: 21%;
    width: 58%;
}
.transportation-cost-wrapper {
  margin-left: 13%;
  width: 58% !important;
}
</style>
