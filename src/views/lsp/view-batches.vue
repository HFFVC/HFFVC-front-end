<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">{{ $t("Batches", "Batches") }}</h3>
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
              class="tbl-services view-batches-table"
            >
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
              <template slot="Plan" slot-scope="props">
                <div>
                  <a class="btn-invoice" @click="sendInfo(props.row)">{{
                    $t("Plan/Generate Invoice", "Plan/Generate Invoice")
                  }}</a>
                </div>
              </template>
            </v-client-table>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
      <b-modal
        hide-footer
        no-close-on-backdrop
        id="proforma-modal"
        ref="invoice-modal"
        hide-backdrop
        :title="$t('Proforma Invoice', 'Proforma Invoice')"
        @hide="hideModal()"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">{{
              $t("Proforma No.", "Proforma No.")
            }}</label>
            <input
              class="text-input"
              type="text"
              readonly
              v-model="proformaNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Seller Name", "Seller Name") }} *</label
            >
            <input class="text-input" type="text" v-model="sellerName" />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Packhouse", "Packhouse")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="dropLocation"
              readonly
            />
          </div>

          <div class="inp-container">
            <label class="input-label">{{ $t("Product", "Product") }}</label>
            <input class="text-input" type="text" v-model="product" readonly />
          </div>
          <div class="inp-container view-batches-v-select-wrap">
            <label class="input-label"
              >{{ $t("Currency", "Currency") }} *</label
            >
            <v-select
              v-model="proformaInvoiceCurrency"
              :placeholder="$t('Select Currency', 'Select Currency')"
              class="view-batches-v-select"
              :options="currencySource"
            ></v-select>
          </div>
          <div class="inp-container unit-price-container">
            <label class="input-label"
              >{{ $t("Unit Price Per Kg", "Unit Price Per Kg") }} *</label
            >
            <span class="prefixCurrency">
              <span class="pref" v-if="this.proformaInvoiceCurrency == 'USD'"
                >$</span
              >
              <span class="pref" v-if="this.proformaInvoiceCurrency == 'HTG'"
                >G</span
              >
              <input class="text-input" type="number" v-model="unitPrice" />
            </span>
          </div>

          <h4 class="sub-heading">{{ $t("Selling to", "Selling to") }}</h4>
          <div class="inp-container full-name-container">
            <label class="input-label"
              >{{ $t("Broker Name", "Broker Name") }} *</label
            >
            <v-select
              v-model="fullName"
              @input="onselect()"
              class="view-batches-v-select"
              :options="brokers"
            ></v-select>
            <!-- <ejs-dropdownlist
              id="dropdownlist-full-name"
              class="dropdownlist fullname-dropdown"
              v-model="fullName"
              v-on:change="onselect"
              :dataSource="brokers"
            ></ejs-dropdownlist>-->
          </div>
          <div class="inp-container">
            <label class="input-label">{{ $t("Email", "Email") }} *</label>
            <input class="text-input" type="text" readonly v-model="email" />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Organization", "Organization") }} *</label
            >
            <input
              class="text-input"
              type="text"
              readonly
              v-model="organizationName"
            />
          </div>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Address Line 1", "Address Line 1") }} *</label
            >
            <input
              class="text-input"
              type="text"
              v-model="sellingAddressLine1"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 2", "Address Line 2")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="sellingAddressLine2"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 3", "Address Line 3")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="sellingAddressLine3"
            />
          </div>
          <h4 class="sub-heading">{{ $t("Shipping", "Shipping") }}</h4>
          <div class="inp-container">
            <label class="input-label"
              >{{ $t("Address Line 1", "Address Line 1") }} *</label
            >
            <input
              class="text-input"
              type="text"
              v-model="shippingAddressLine1"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 2", "Address Line 2")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="shippingAddressLine2"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">{{
              $t("Address Line 3", "Address Line 3")
            }}</label>
            <input
              class="text-input"
              type="text"
              v-model="shippingAddressLine3"
            />
          </div>
        </perfect-scrollbar>
        <div class="view-batches-mandatory-warning">
          <span>* {{ $t("Mandatory Fields", "Mandatory Fields") }}</span>
        </div>

        <div class="button-container">
          <input
            type="button"
            v-on:click="saveProForma"
            class="btn-save"
            :value="$t('Save', 'Save')"
          />
          <input
            type="button"
            v-on:click="hideModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
        </div>
      </b-modal>
      <b-modal
        ref="success-modal"
        hide-footer
        hide-header
        :title="$t('Status', 'Status')"
        id="modalnewsuccess"
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
import firebase from "firebase";
import axios from "axios";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);
Vue.use(Datetime);
Vue.use(BootstrapVue);
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import Footer from "../../components/footer-view";
import Offline from "v-offline";

Vue.use(VueToast);

Vue.use(ClientTable);

import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Header from "../../components/header-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  components: {
    PerfectScrollbar,
    Header,
    Footer,
    Offline,
  },
  name: "active-service-requests",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Batch Id",
        "batchCreatedOn",
        "No Of Lots",
        "Total No Of Boxes",
        "Plan",
      ],
      options: {
        perPage: 10,
        headings: {
          "Batch Id": `${this.$t("Batch Id", "Batch Id")}`,
          batchCreatedOn: `${this.$t("Batch Created On", "Batch Created On")}`,
          "No Of Lots": `${this.$t("No. of Lots", "No. of Lots")}`,
          "Total No Of Boxes": `${this.$t(
            "Total No Of Boxes",
            "Total No Of Boxes"
          )}`,
          Plan: `${this.$t("Plan", "Plan")}`,
        },
        orderBy: {
          ascending: false,
          column: "batchCreatedOn",
        },
        sortable: ["batchCreatedOn"],
        customSorting: {
          batchCreatedOn: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.batchCreatedOn);
              let dateB = new Date(b.batchCreatedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
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
      proformaNo: null,
      fullName: null,
      email: null,
      sellingAddressLine1: null,
      sellingAddressLine2: null,
      sellingAddressLine3: null,
      shippingAddressLine1: null,
      shippingAddressLine2: null,
      shippingAddressLine3: null,
      unitPrice: null,
      brokers: [],
      completeBrokerData: [],
      brokerOrganization: "",
      lots: [],
      proformaInvoiceCurrency: null,
      currencySource: ["USD", "HTG"],
      product: null,
      shippingDetail: null,
      dropLocation: null,
      sellerName: null,
      selectedBroker: null,
      brokerMargin: null,
      networkStatus: true,
      organizationName: null,
      organizationKeyVal: null,
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
        { text: this.$t("Batches", "Batches"), href: "/view-batches" },
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
            { text: this.$t("Batches", "Batches"), href: "/view-batches" },
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
              text: this.$t(
                "Packhouse Incharge-Dashboard",
                "Packhouse Incharge-Dashboard"
              ),
              href: "/pack-house-incharge-dashboard",
            },
            { text: this.$t("Batches", "Batches"), href: "/view-batches" },
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
          { text: this.$t("Batches", "Batches"), href: "/view-batches" },
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
          { text: this.$t("Batches", "Batches"), href: "/view-batches" },
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
          { text: this.$t("Batches", "Batches"), href: "/view-batches" },
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
          { text: this.$t("Batches", "Batches"), href: "/view-batches" },
        ]);
      }
    }
    this.options = {
      perPage: 10,
      headings: {
        "Batch Id": `${this.$t("Batch Id", "Batch Id")}`,
        batchCreatedOn: `${this.$t("Batch Created On", "Batch Created On")}`,
        "No Of Lots": `${this.$t("No. of Lots", "No. of Lots")}`,
        "Total No Of Boxes": `${this.$t(
          "Total No Of Boxes",
          "Total No Of Boxes"
        )}`,
        Plan: `${this.$t("Plan", "Plan")}`,
      },
      orderBy: {
        ascending: false,
        column: "batchCreatedOn",
      },
      sortable: ["batchCreatedOn"],
      customSorting: {
        batchCreatedOn: function (ascending) {
          return function (a, b) {
            let dateA = new Date(a.batchCreatedOn);
            let dateB = new Date(b.batchCreatedOn);

            if (ascending) return dateA >= dateB ? 1 : -1;

            return dateA <= dateB ? 1 : -1;
          };
        },
      },
    };
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
    this.getBrokers();

    this.userName = localStorage.userName;
  },

  methods: {
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    onselect: function () {
      let currentVal = this;

      var valObj = this.completeBrokerData.filter(function (elem) {
        if (currentVal.fullName != null && currentVal.fullName != "") {
          if (elem.name.trim() == currentVal.fullName.trim()) {
            currentVal.email = elem.email;
            currentVal.brokerMargin = elem.brokerMargin;
            currentVal.brokerOrganization = elem.brokerOrganization;
            currentVal.organizationName = elem.organization;
            currentVal.organizationKeyVal = elem.organizationKey;
            currentVal.selectedBroker = elem;
            currentVal.getBrokersOrganizationAddress(elem.organizationKey);
          }
        }
      });
      console.log(valObj);
    },
    updateLotStatus: function () {
      let currentValue = this;
      var dbRef = firebase
        .database()
        .ref("batch/" + currentValue.selectedRow.Id + "/lots");
      dbRef.on("child_added", function (snapshot) {
        var serviceRequestRef = firebase.database().ref("serviceRequest");
        serviceRequestRef
          .orderByChild("serviceRequestId")
          .equalTo(snapshot.key)
          .on("child_added", function (data) {
            var ref = firebase.database().ref("serviceRequest/" + data.key);
            ref
              .update({
                status: "Batch Proforma Completed",
                updatedBy: localStorage.userName,
              })
              .then(function () {});
          });
      });
    },
    getBrokers: function () {
      var currentVal = this;

      var ref = firebase.database().ref().child("profile");

      ref.on("child_added", function (requestData) {
        if (
          requestData.val().systemRole == 4 ||
          requestData.val().systemRole == 97
        ) {
          console.log(requestData.val());
          var data = "";
          data = {
            name:
              requestData.val().firstName + " " + requestData.val().lastName,
            email: requestData.val().email,
            organization: requestData.val().organization,
            organizationKey: requestData.val().organizationKey,
            brokerMargin: requestData.val().brokerMargin,
            brokerOrganization: requestData.val().brokerOrganization,
          };

          currentVal.completeBrokerData.push(data);
          currentVal.brokers.push(
            requestData.val().firstName + " " + requestData.val().lastName
          );
        }
      });
      // var ref = firebase
      //   .database()
      //   .ref()
      //   .child("masters")
      //   .child("broker");

      // ref.on("value", function(snapshot) {
      //   snapshot.forEach(requestData => {
      //     currentVal.brokers.push(requestData.val().name);
      //     currentVal.completeBrokerData.push(requestData.val());
      //   });
      // });
    },
    saveProForma: function () {
      if (this.networkStatus) {
        let currentValue = this;

        var proformaCreatedData = moment.utc().toString();
        var inpData = {
          proFormaUpdatedOn: proformaCreatedData,
          batchProforma_ProformaNo: this.proformaNo,
          batchProforma_FullName: this.fullName,
          batchProforma_Email: this.email,
          batchProforma_Selling_AddressLine1: this.sellingAddressLine1,
          batchProforma_Selling_AddressLine2: this.sellingAddressLine2,
          batchProforma_Selling_AddressLine3: this.sellingAddressLine3,
          batchProforma_Shipping_AddressLine1: this.shippingAddressLine1,
          batchProforma_Shipping_AddressLine2: this.shippingAddressLine2,
          batchProforma_Shipping_AddressLine3: this.shippingAddressLine3,
          batchProforma_Shipping_UnitPrice: this.unitPrice,
          batchProforma_Shipping_Currency: this.proformaInvoiceCurrency,
          product: this.product,
          dropLocation: this.dropLocation,
          sellerName: this.sellerName,
          brokerMargin: this.brokerMargin,
          brokerOrganization: this.organizationName,
          brokerOrganizationKey: this.organizationKeyVal,
          updatedBy: localStorage.userName,
        };
        if (
          this.sellerName == undefined ||
          this.sellerName == null ||
          this.sellerName == "" ||
          this.unitPrice == undefined ||
          this.unitPrice == null ||
          this.unitPrice == "" ||
          this.sellingAddressLine1 == undefined ||
          this.sellingAddressLine1 == null ||
          this.sellingAddressLine1 == "" ||
          this.shippingAddressLine1 == undefined ||
          this.shippingAddressLine1 == null ||
          this.shippingAddressLine1 == "" ||
          this.proformaInvoiceCurrency == undefined ||
          this.proformaInvoiceCurrency == null ||
          this.proformaInvoiceCurrency == "" ||
          this.email == undefined ||
          this.email == null ||
          this.email == "" ||
          this.fullName == undefined ||
          this.fullName == null ||
          this.fullName == ""
        ) {
          Vue.$toast.open({
            message: this.$t(
              "Please enter all the fields marked with *",
              "Please enter all the fields marked with *"
            ),
            type: "error",
            position: "top",
          });
        } else {
          this.seen = true;
          currentValue
            .createProformaDetailsAPICall(currentValue.selectedRow.Id, inpData)
            .then((resolved) => {
              console.log(resolved);
              var ref = firebase
                .database()
                .ref("batch/" + currentValue.selectedRow.Id)
                .child("proforma");
              ref
                .update(inpData)
                .then(function () {
                  var isideRef = firebase
                    .database()
                    .ref("batch/" + currentValue.selectedRow.Id);
                  isideRef
                    .update({
                      status: "Batch Proforma Completed",
                      proformaCreatedOn: proformaCreatedData,
                      updatedBy: localStorage.userName,
                    })
                    .then(function () {
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Proforma details saved successfully. Email with invoice details sent",
                          "Proforma details saved successfully. Email with invoice details sent"
                        ),
                        type: "success",
                        position: "top",
                      });

                      currentValue.sellerName = null;
                      currentValue.updateLotStatus();
                      currentValue.hideModal();
                      currentValue.serviceRequests = [];
                      currentValue.getData();
                    })
                    .catch(function (error) {
                      console.log("API After Proforma creation failed.");
                      currentValue.erroMessage = error.message;
                      currentValue.seen = false;
                      Vue.$toast.open({
                        message: currentValue.$t(
                          "Error updating data to firebase.",
                          "Error updating data to firebase."
                        ),
                        position: "top",
                        type: "error",
                      });
                    });
                })
                .catch(function (error) {
                  currentValue.erroMessage = error.message;
                  currentValue.seen = false;
                  Vue.$toast.open({
                    message: currentValue.$t(
                      "Error updating data to firebase.",
                      "Error updating data to firebase."
                    ),
                    position: "top",
                    type: "error",
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              currentValue.erroMessage = error.message;
              currentValue.seen = false;
              Vue.$toast.open({
                message: currentValue.$t(
                  "Error updating data to corda blockchain.",
                  "Error updating data to corda blockchain."
                ),
                position: "top",
                type: "error",
              });
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
    },
    getData: function () {
      let currentValue = this;

      currentValue.serviceRequests = [];
      var ref = firebase.database().ref().child("batch");
      ref
        .orderByChild("status")
        .equalTo("Batch Created")
        .on(
          "child_added",
          function (snapshot) {
            if (snapshot.val() != null) {
              //console.log(snapshot.val());
              let _batchId = snapshot.val().batchId;
              console.log(_batchId);
              var _noOfBoxes = 0;
              var lots = snapshot.val().lots;
              if (lots) {
                var keys = Object.keys(lots);

                keys.forEach(function (key) {
                  console.log(lots[key]);
                  _noOfBoxes += lots[key].noOfBoxes;
                });
              }
              const _data = {
                "Batch Id": snapshot.val().batchId,
                batchCreatedOn: moment(String(snapshot.val().batchCreatedAt))
                  .local()
                  .format("MMM DD, YYYY hh:mm A"),
                "No Of Lots": snapshot.val().noOfLots,
                "Total No Of Boxes": _noOfBoxes,
                Id: snapshot.val().batchId,

                dropLocation: snapshot.val().dropOfLocation,
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
                // if (
                //   snapshot.val().createdBy &&
                //   snapshot.val().createdBy == localStorage.userName
                // ) {
                //   currentValue.serviceRequests.push(_data);
                // }
              }
              currentValue.serviceRequests.reverse();
              currentValue.seen = false;
              currentValue.show = true;
              // });
            } else {
              currentValue.showIcons = false;
              currentValue.seen = false;
            }
          },
          function (error) {
            console.log("Error: " + error.code);
          }
        );
      setTimeout(function () {
        if (currentValue.serviceRequests.length == 0) {
          currentValue.seen = false;
        }
      }, 4000);
    },

    hideModal: function () {
      this.$refs["invoice-modal"].hide();
      this.proformaNo = null;
      this.fullName = null;
      this.email = null;
      this.sellingAddressLine1 = null;
      this.sellingAddressLine2 = null;
      this.sellingAddressLine3 = null;
      this.shippingAddressLine1 = null;
      this.shippingAddressLine2 = null;
      this.shippingAddressLine3 = null;
      this.unitPrice = null;
      this.proformaInvoiceCurrency = null;
      this.product = null;
    },

    closeModal() {
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
    },

    sendInfo(item) {
      const vm = this;
      console.log(item);
      this.selectedRow = null;
      this.errorMessage = "";
      this.collector = null;
      this.collectionpoint = null;
      this.dropoffatpackhouse = null;
      this.date = null;
      this.selectedRow = item;
      console.log(this.selectedRow);
      this.dropLocation = item.dropLocation;
      this.proformaNo =
        "PF-" + moment(String(new Date())).format("DDMMYYhhmmss");
      firebase
        .database()
        .ref()
        .child("batch")
        .child(item["Batch Id"])
        .on("value", function (snapshot) {
          console.log(snapshot.val());
          vm.product = snapshot.val().product;
        });
      if (localStorage.userName != undefined && localStorage.userName != null) {
        this.sellerName = localStorage.userName.split("(")[0];
      }
      this.$refs["invoice-modal"].show();
      this.getDetailsForBLockChainAPI();
    },
    getDetailsForBLockChainAPI: function () {
      let currentValue = this;
      currentValue.lots = [];
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentValue.selectedRow.Id)
        .child("lots");

      ref.on("child_added", function (snapshot) {
        if (snapshot.val().shipping.trim() == "Shipment by Sea") {
          console.log(snapshot.val().shipping.trim());
          currentValue.shippingDetail = "sea";
        } else {
          console.log(snapshot.val().shipping.trim());
          currentValue.shippingDetail = "air";
        }
        //currentValue.shippingDetail = snapshot.val().shipping;
        currentValue.lots.push(snapshot.key);
      });
      console.log(currentValue.lots);
    },
    getRandomNum: function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
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
        .catch(function (error) {
          console.log(error);
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
    Save: function () {
      this.$refs["invoice-modal"].hide();
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
    createProformaDetailsAPICall(serviceId, inpData) {
      console.log(serviceId);
      console.log(inpData);
      let currentVal = this;
      const data = {
        status: "PROFORMA INVOICE CREATED",
        batchId: serviceId,
        proFormaUpdatedOn: moment
          .utc(String(inpData.proFormaUpdatedOn))
          .format("YYYY-MM-DDTHH:mm:ss"),
        batchProforma_ProformaNo: inpData.batchProforma_ProformaNo,
        batchProforma_FullName: inpData.batchProforma_FullName,
        batchProforma_Email: inpData.batchProforma_Email,
        batchProforma_Selling_AddressLine1:
          inpData.batchProforma_Selling_AddressLine1,
        batchProforma_Selling_AddressLine2:
          inpData.batchProforma_Selling_AddressLine2,
        batchProforma_Selling_AddressLine3:
          inpData.batchProforma_Selling_AddressLine3,
        batchProforma_Shipping_AddressLine1:
          inpData.batchProforma_Shipping_AddressLine1,
        batchProforma_Shipping_AddressLine2:
          inpData.batchProforma_Shipping_AddressLine2,
        batchProforma_Shipping_AddressLine3:
          inpData.batchProforma_Shipping_AddressLine3,
        batchProforma_Shipping_UnitPrice:
          inpData.batchProforma_Shipping_UnitPrice,
        batchProforma_Shipping_Currency:
          inpData.batchProforma_Shipping_Currency,
        dropLocation: inpData.dropLocation,
        sellerName: inpData.sellerName,
      };
      return new Promise((resolve, reject) => {
        currentVal.axios
          .post(
            `${getConfigVars().BASE_URL}50007/api/v1.0/proforma-invoice`,
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
            console.log(error.message);
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
                  currentVal
                    .createProformaDetailsAPICall(serviceId, inpData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
                });
            } else {
              reject(error);
            }
          });
      });
    },
    getBrokersOrganizationAddress(organizationKey) {
      console.log(organizationKey);
      const vm = this;
      vm.seen = true;
      let timeout = setTimeout(() => {
        console.log("Address not found");
        vm.seen = false;
      }, 300);
      firebase
        .database()
        .ref(`masters/organization/${organizationKey}`)
        .on("value", (snapshot) => {
          clearTimeout(timeout);
          console.log(snapshot);
          console.log(snapshot.val());
          const { Address, Town } = snapshot.val();
          vm.sellingAddressLine1 = Town;
          vm.sellingAddressLine2 = Address;
          vm.seen = false;
        });
    },
  },
};
</script>
<style scoped>
.prefixCurrency {
  display: inline-flex;
  width: 100%;
  color: #fff;
}
.prefixCurrency .pref {
  margin-top: 8px;
  font-size: 15px;
  padding-right: 1px;
  font-weight: bolder;
}
.btn-save {
  margin: 10px -1px 10px 10px !important;
  height: 30px;
}
.btn-cancel {
  height: 30px;
  margin: 10px !important;
}
.modal-scroll {
  padding: 1.45rem !important;
}
.modal-body {
  padding: 25px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#modalnewsuccess .modal-header {
  height: 50px !important;
}
#modalnewsuccess .modal-header .close {
  margin-top: -12px !important;
}
#modalnewsuccess .modal-header h5 {
  margin: -10px auto !important;
}
#proforma-modal .modal-header {
  height: 50px !important;
}
#proforma-modal .modal-header .close {
  margin-top: -12px !important;
}
#proforma-modal .modal-header h5 {
  margin: -10px auto !important;
}

.btn-invoice {
  color: #fff !important;
  border-bottom: 1px solid #fff;
  cursor: pointer;
}
.lbl-modal-success {
  color: #fff;
}
#dropdownlist_options {
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
.view-batches-table thead tr th:nth-child(3),
.view-batches-table tbody tr td:nth-child(3),
.view-batches-table thead tr th:nth-child(4),
.view-batches-table tbody tr td:nth-child(4) {
  /* text-align: right !important; */
  text-align: center !important;
}
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}
.modal-scroll {
  height: 450px;
}

.dropdownlist {
  width: 95%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff !important;
  height: 36px;
}
.fullname-dropdown #dropdownlist_hidden {
  float: right;
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  width: 0%;
  color: #fff;
  height: 36px;
}
.full-name-container span {
  margin: 0px;
}
.view-batches-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.view-batches-v-select {
  font-size: 13px;
}
.view-batches-v-select span,
.view-batches-v-select input,
.view-batches-v-select .vs__no-options {
  color: #fff;
}
.view-batches-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.view-batches-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.view-batches-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.view-batches-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.view-batches-v-select .vs__open-indicator,
.view-batches-v-select .vs__clear {
  fill: #fff;
}
.view-batches-v-select .vs__selected-options,
.view-batches-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.view-batches-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.view-batches-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.view-batches-v-select .vs__clear {
  margin-top: -10px;
}
.view-batches-v-select .vs__open-indicator {
  margin-top: -5px;
}
.tbl-sell-list thead tr th,
.tbl-sell-list tbody tr td {
  text-align: left !important;
}
.view-batches-table thead tr th {
  font-weight: bold;
}
.view-batches-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.view-batches-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}

@media screen and (max-width: 768px) {
  .view-batches-table tbody tr td:nth-child(6) {
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
.view-batches-table tbody tr td:nth-child(4) {
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
  height: 50px;
  padding: 12px;
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

.view-batches-table th:nth-child(3) {
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
  margin-top: 5px;
  margin-right: 3px;
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
.input-label {
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  width: 100%;
  padding: 0px;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-bottom: 0px !important;
}
.text-input {
  border: none;
  border-bottom: 1px solid #fff;
  outline: none;
  width: 100%;
  background: transparent;
  height: 36px;
  color: #fff;
  font-size: 12px !important;
}
.sub-heading {
  color: #fff !important;
  text-align: center;
  margin: 20px 0px;
}
.unit-price-container {
  margin-top: 40px;
}
.view-batches-mandatory-warning {
  position: absolute;
  bottom: 40px;
  font-size: 13px;
  color: #fff;
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
</style>
