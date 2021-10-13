<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer">
          <h3 @click="gotoDashboard" class="inter-head">HFFVC</h3>
          <!-- <img class="img-logo-lsp" alt="agriledger logo" src="../../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup>-->
        </div>
        <div class="username-conatiner-lsp">
          <img
            class="user-icon"
            alt="agriledger logo"
            src="../../assets/images/user.png"
          />
          <label class="lbl-username-lsp">{{ userName }}</label>
          <br />
          <a href="#" v-on:click="logout" class="ref-logout-lsp">Logout</a>
        </div>
      </div>
      <div class="col-md-10 content-container">
        <div class="header-container">
          <h3 class="heading">Previous Invoice & Payments</h3>
          <div class="icon-container">
            <ul>
              <li>
                <img
                  @click="showHome"
                  class="sub-header-close-img"
                  src="../../assets/images/close.png"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="main-container">
          <div id="people" class="invoice-payment-previous-table-wrap">
            <v-client-table
              :data="serviceRequests"
              :columns="columns"
              :options="options"
              class="tbl-services tbl-view-broker-batches"
            >
              <template slot="View" slot-scope="props">
                <div>
                  <a class="btn-icn" @click="viewBatch(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/view.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="Generate Invoice" slot-scope="props">
                <div v-if="isGI">
                  <a class="btn-icn" @click="generateInvoice(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/generate_invoice.png"
                    />
                  </a>
                </div>
              </template>
              <template slot="Confirm Payment" slot-scope="props">
                <div v-if="props.row.isPaymentShow">
                  <a class="btn-icn" @click="confirmPayment(props.row)">
                    <img
                      class="location-img"
                      src="../../assets/images/confirm_payment.png"
                    />
                  </a>
                </div>
              </template>
            </v-client-table>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
      <b-modal
        hide-footer
        id="generate-invoice-modal"
        class
        ref="generate-invoice"
        hide-backdrop
        title="Invoice Details"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">Invoice No.</label>
            <input
              class="text-input"
              type="text"
              readonly
              v-model="invoiceNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Billing Date</label>
            <input class="text-input" type="text" v-model="billingDate" />
          </div>
          <div class="inp-container">
            <label class="input-label">Broker Name</label>
            <v-select
              v-model="fullName"
              placeholder
              class="invoice-payment-v-select"
              :options="brokers"
              @input="onselect()"
            ></v-select>
          </div>
          <div class="inp-container">
            <label class="input-label">Broker Organization</label>
            <input
              class="text-input"
              type="text"
              v-model="brokerOrganization"
            />
          </div>
          <h4 class="sub-heading">Buyer Details</h4>
          <div class="inp-container">
            <label class="input-label">Buyer Name</label>
            <input class="text-input" type="text" v-model="buyerName" />
          </div>
          <div class="inp-container">
            <label class="input-label">Buyer Organization</label>
            <input class="text-input" type="text" v-model="buyerOrganization" />
          </div>
          <div class="inp-container">
            <label class="input-label">Product</label>
            <input class="text-input" type="text" v-model="product" />
          </div>
          <div class="inp-container">
            <label class="input-label">No. of Boxes Purchased</label>
            <input
              class="text-input"
              type="text"
              v-model="noofBoxesPurchased"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Price Per Kg</label>
            <input class="text-input" type="text" v-model="pricePerKg" />
          </div>
          <div class="inp-container">
            <label class="input-label">Currency *</label>
            <v-select
              v-model="GICurrency"
              placeholder
              class="invoice-payment-v-select"
              :options="currencySource"
            ></v-select>
          </div>
          <div class="inp-container">
            <label class="input-label">Net Sales</label>
            <input class="text-input" readonly type="text" v-model="netSales" />
          </div>
        </perfect-scrollbar>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideGIModal"
            class="btn-cancel"
            value="Cancel"
          />
          <input
            type="button"
            v-on:click="SaveGI"
            class="btn-save"
            value="Save"
          />
        </div>
      </b-modal>
      <b-modal
        hide-footer
        id="confirm-payment-modal"
        class
        ref="confirm-payment"
        hide-backdrop
        title="Confirm Payment"
      >
        <perfect-scrollbar class="modal-scroll">
          <div class="inp-container">
            <label class="input-label">Date</label>
            <input
              class="text-input"
              type="text"
              v-model="confrimPaymentDate"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Invoice No.</label>
            <input
              class="text-input"
              type="text"
              v-model="confirmPaymentInvoiceNo"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Buyer Name</label>
            <input
              class="text-input"
              type="text"
              v-model="confirmPaymentBuyerName"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">No. of Boxes Sold</label>
            <input class="text-input" type="text" v-model="noOfBoxesSold" />
          </div>
          <div class="inp-container">
            <label class="input-label">Price per kg</label>
            <input
              class="text-input"
              type="text"
              v-model="confirmPaymentPricePerKg"
            />
          </div>
          <div class="inp-container">
            <label class="input-label">Net Receivables(Net Sales Price)</label>
            <input class="text-input" type="text" v-model="netReceivables" />
          </div>
          <div class="inp-container factored-radio-container">
            <label class="input-label">Was the Invoice Factored?</label>
            <label class="larvae-wrap">
              <input
                v-on:change="wasFactoredChange"
                class="larvae-input radio-btn"
                v-model="wasFactored"
                type="radio"
                name="wasFactored"
                value="Yes"
              />
              <img class="radio-btn-img larvae-rb-img" />
              Yes
            </label>
            <label class="larvae-wrap">
              <input
                v-on:change="wasFactoredChange"
                class="larvae-input radio-btn"
                v-model="wasFactored"
                type="radio"
                name="wasFactored"
                value="No"
              />
              <img class="radio-btn-img larvae-rb-img" />
              No
            </label>
          </div>
          <div class="inp-container" v-if="amountFactoredShowFlag">
            <label class="input-label">Amount Factored (USD)</label>
            <input class="text-input" type="text" v-model="amountFactored" />
          </div>
        </perfect-scrollbar>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideConfirmPaymentModal"
            class="btn-cancel"
            value="Cancel"
          />
          <input
            type="button"
            v-on:click="SaveConfirmPayment"
            class="btn-save"
            value="Save"
          />
        </div>
      </b-modal>
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

import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
Vue.use(VueToast);

Vue.use(Datetime);

Vue.use(BootstrapVue);

Vue.use(ClientTable);

import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import Footer from "../../components/footer-view";

Vue.use(DropDownListPlugin);
export default {
  components: {
    PerfectScrollbar,
    Footer,
  },
  name: "active-service-requests",
  data: function () {
    return {
      serviceRequests: [],
      columns: [
        "Buyer's Name",
        "Buyer's Contact Details",
        "Buyer's Email",
        "dateOfSale",
        "No of Boxes",
        "Generate Invoice",
        "Confirm Payment",
      ],
      seen: true,
      show: false,
      selectedRow: null,
      userName: "",
      succesContent: "",
      isGI: true,
      isConfirm: false,

      options: {
        perPage: 10,
        sortable: ["Buyer's Name", "dateOfSale"],
        headings: { dateOfSale: "Date of Sale" },
        customSorting: {
          dateOfSale: function (ascending) {
            return function (a, b) {
              let dateA = new Date(a.dateOfSale);
              let dateB = new Date(b.dateOfSale);
              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
      },

      invoiceNo: null,
      billingDate: null,
      brokerName: null,
      brokerOrganization: null,
      buyerName: null,
      buyerOrganization: null,
      product: null,
      noofBoxesPurchased: null,
      pricePerKg: null,
      confrimPaymentDate: moment.utc().local().format("MMM DD, YYYY hh:mm A"),
      confirmPaymentInvoiceNo: null,
      confirmPaymentPricePerKg: null,
      noOfBoxesSold: null,
      confirmPaymentBuyerName: null,
      netReceivables: null,
      batchId: "",
      netSales: null,
      currencySource: ["USD"],
      GICurrency: "USD",
      amountFactored: null,
      wasFactored: null,
      amountFactoredShowFlag: false,
      brokers: [],
      completeBrokerData: [],
      fullName: null,
    };
  },
  mounted() {
    this.batchId = this.$route.params.id;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
    this.getBrokers();
    this.userName = localStorage.userName;
  },

  methods: {
    onselect: function () {
      let currentVal = this;
      var valObj = this.completeBrokerData.filter(function (elem) {
        if (currentVal.fullName != null && currentVal.fullName != "") {
          if (elem.name.trim() == currentVal.fullName.trim()) {
            currentVal.brokerOrganization = elem.organization;
            currentVal.selectedBroker = elem;
          }
        }
      });
    },
    getBrokers: function (event) {
      var currentVal = this;
      var ref = firebase.database().ref().child("masters").child("broker");

      ref.on("value", function (snapshot) {
        snapshot.forEach((requestData) => {
          currentVal.brokers.push(requestData.val().name);
          currentVal.completeBrokerData.push(requestData.val());
        });
      });
    },
    getData: function () {
      //working
      let currentValue = this;
      currentValue.seen = true;
      currentValue.serviceRequests = [];
      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.batchId)
        .child("sell");

      ref.on("child_added", function (snapshot) {
        var isPaymentShow = false;
        var isPayamentDone = false;

        if (snapshot.val().confirmPayment != undefined) {
          isPayamentDone = true;
        }
        if (snapshot.val().invoice != undefined) {
          isPaymentShow = true;
        }
        currentValue.serviceRequests.push({
          "Buyer's Name": snapshot.val().sellBuyerName,
          "Buyer's Contact Details": snapshot.val().sellBuyerContactDetails,
          "Buyer's Email": snapshot.val().sellBuyerEmailAddress,
          dateOfSale: moment
            .utc(snapshot.val().saleTransactionDate)
            .local()
            .format("MMM DD, YYYY hh:mm A"),
          "No of Boxes": snapshot.val().totalNoOfBoxesSold,
          sellId: snapshot.val().sellId,
          batchId: snapshot.val().batchId,
          sellBuyerName: snapshot.val().sellBuyerName,
          sellBuyerOrganization: snapshot.val().sellBuyerOrganization,
          salesPricePerKg: snapshot.val().salesPricePerKg,
          totalNoOfBoxesSold: snapshot.val().totalNoOfBoxesSold,
          snapShotKey: snapshot.key,
          soldProduct: snapshot.val().soldProduct,
          isPayamentDone: isPayamentDone,
          isPaymentShow: isPaymentShow,
        });

        currentValue.serviceRequests.reverse();
        currentValue.seen = false;
        currentValue.show = true;
      });
    },
    showHome: function () {
      Router.push({ path: "/view-broker-batches-previous" });
    },
    generateInvoice: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      console.log(this.selectedRow);
      this.$refs["generate-invoice"].show();
      this.invoiceNo =
        "IN-" + moment(String(new Date())).format("YYYYMMDDHHmmss");
      this.billingDate = moment(String(new Date())).format(
        "YYYY/MM/DD HH:mm:ss"
      );
      let currentValue = this;

      currentValue.buyerName = currentValue.selectedRow.sellBuyerName;
      currentValue.buyerOrganization =
        currentValue.selectedRow.sellBuyerOrganization;
      currentValue.noofBoxesPurchased =
        currentValue.selectedRow.totalNoOfBoxesSold;
      currentValue.pricePerKg = currentValue.selectedRow.salesPricePerKg;
      currentValue.product = currentValue.selectedRow.soldProduct;
      currentValue.seen = false;
      currentValue.show = true;
      if (currentValue.product == "Mango") {
        currentValue.netSales =
          Number(currentValue.selectedRow.totalNoOfBoxesSold) *
          Number(currentValue.selectedRow.salesPricePerKg) *
          4.5;
      } else if (currentValue.product == "Avocado") {
        currentValue.netSales =
          Number(currentValue.selectedRow.totalNoOfBoxesSold) *
          Number(currentValue.selectedRow.salesPricePerKg) *
          5;
      } else {
        currentValue.netSales =
          Number(currentValue.selectedRow.totalNoOfBoxesSold) *
          Number(currentValue.selectedRow.salesPricePerKg) *
          12.25;
      }
    },
    confirmPayment: function (item) {
      this.selectedRow = null;
      this.selectedRow = item;
      var currentVal = this;

      var ref = firebase
        .database()
        .ref()
        .child("batch")
        .child(this.batchId)
        .child("sell")
        .child(currentVal.selectedRow.snapShotKey)
        .child("invoice");

      ref.on("child_added", function (snapshot) {
        console.log(snapshot.val());

        currentVal.$refs["confirm-payment"].show();
        currentVal.confirmPaymentInvoiceNo = snapshot.val().invoiceNo;
        currentVal.confirmPaymentBuyerName = snapshot.val().buyerName;
        currentVal.noOfBoxesSold = snapshot.val().noofBoxesPurchased;
        currentVal.confirmPaymentPricePerKg = snapshot.val().pricePerKg;
      });
    },
    logout: function (event) {
      firebase
        .auth()
        .signOut()
        .then(function () {
          localStorage.emailId = "";
          localStorage.userName = "";
          localStorage.organization = "";
          localStorage.phoneNumber = "";
          Router.push("/");
        })
        .catch(function (error) {
          alert("Error");
        });
    },
    hideGIModal: function () {
      this.$refs["generate-invoice"].hide();
    },
    SaveGI: function () {
      let currentVal = this;
      var dbRef = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.batchId)
        .child("sell")
        .child(currentVal.selectedRow.snapShotKey)
        .child("invoice");
      var inpData = {
        invoiceNo: currentVal.invoiceNo,
        billingDate: moment(currentVal.billingDate).utc().toString(),
        brokerName: currentVal.brokerName,
        brokerOrganization: currentVal.brokerOrganization,
        buyerName: currentVal.buyerName,
        buyerOrganization: currentVal.buyerOrganization,
        noofBoxesPurchased: currentVal.noofBoxesPurchased,
        product: currentVal.product,
        pricePerKg: currentVal.pricePerKg,
        GICurrency: currentVal.GICurrency,
        netSales: currentVal.netSales,
        updatedBy: localStorage.userName,
      };
      dbRef
        .set(inpData)
        .then(function (response) {
          currentVal.getData();
          Vue.$toast.open({
            message: "Generated invoice successfully.",
            type: "success",
            position: "top",
          });
          this.$refs["generate-invoice"].hide();
        })
        .catch(function (error) {
          currentVal.erroMessage = error.message;
          currentVal.seen = false;
          Vue.$toast.open({
            message: "Error updating data to firebase.",
            position: "top",
            type: "error",
          });
        });
    },
    hideConfirmPaymentModal: function () {
      this.$refs["confirm-payment"].hide();
    },
    SaveConfirmPayment: function () {
      let currentVal = this;
      var dbRef = firebase
        .database()
        .ref()
        .child("batch")
        .child(currentVal.selectedRow.batchId)
        .child("sell")
        .child(currentVal.selectedRow.snapShotKey)
        .child("confirmPayment");
      var inpData = {
        confrimPaymentDate: moment(currentVal.confrimPaymentDate)
          .utc()
          .toString(),
        confirmPaymentInvoiceNo: currentVal.confirmPaymentInvoiceNo,
        confirmPaymentBuyerName: currentVal.confirmPaymentBuyerName,
        noOfBoxesSold: currentVal.noOfBoxesSold,
        confirmPaymentPricePerKg: currentVal.confirmPaymentPricePerKg,
        netReceivables: currentVal.netReceivables,
        wasFactored: currentVal.wasFactored,
        updatedBy: localStorage.userName,
      };
      dbRef
        .set(inpData)
        .then(function (response) {
          currentVal.getData();
          Vue.$toast.open({
            message: "Payment confirmed successfully.",
            type: "success",
            position: "top",
          });
          currentVal.$refs["confirm-payment"].hide();
        })
        .catch(function (error) {
          currentVal.erroMessage = error.message;
          currentVal.seen = false;
          Vue.$toast.open({
            message: "Error updating data to firebase.",
            position: "top",
            type: "error",
          });
        });
    },
    wasFactoredChange: function () {
      if (this.wasFactored == "Yes") {
        this.amountFactoredShowFlag = true;
      } else {
        this.amountFactoredShowFlag = false;
      }
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("/sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("/broker-dashboard");
      }
    },
  },
};
</script>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

.invoice-payment-previous-table-wrap .table-striped tbody tr td:nth-child(6),
.invoice-payment-previous-table-wrap .table-striped thead tr th:nth-child(5),
.invoice-payment-previous-table-wrap .table-striped tbody tr td:nth-child(5),
.invoice-payment-previous-table-wrap .table-striped thead tr th:nth-child(6),
.invoice-payment-previous-table-wrap .table-striped tbody tr td:nth-child(4),
.invoice-payment-previous-table-wrap .table-striped thead tr th:nth-child(4) {
  text-align: center !important;
}
.invoice-payment-previous-table-wrap .table-striped tbody tr td:nth-child(3),
.invoice-payment-previous-table-wrap .table-striped thead tr th:nth-child(3) {
  text-align: left !important;
}
.invoice-payment-previous-table-wrap thead tr th {
  font-weight: bold;
}
.btn-invoice {
  color: #fff !important;
  border-bottom: 1px solid #fff;
  cursor: pointer;
}
.lbl-modal-success {
  color: #fff;
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
  color: #fff !important;
  font-size: 13px;
}
::-moz-placeholder {
  /* Firefox 19+ */
  color: #fff !important;
  font-size: 13px;
}
:-ms-input-placeholder {
  /* IE 10+ */
  color: #fff !important;
  font-size: 13px;
}
:-moz-placeholder {
  /* Firefox 18- */
  font-size: 13px;

  color: #fff !important;
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
  width: 500px;
  margin: 0px auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.modal-scroll {
  height: 355px;
}
.view-tbl-services {
  padding: 0px !important;
  background: none !important;
}
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}
.custom-file-label {
  background: transparent;
  border: none;
  border-radius: 0px;
  color: #fff;
  padding: 0;
  font-size: 13px;
}
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: "Attach";
  background: #585a4d;
  border: 1px solid #000;
  padding: 4px 12px 4px 12px;
  color: #fff;
  margin-top: 6px;
}
.custom-file-input:focus ~ .custom-file-label {
  border: none;
  box-shadow: none;
}
</style>
<style scoped>
.inter-head {
  color: #fff;
  font-size: 39px;
  margin-top: 14px;
  float: left;
  margin-left: 14px;
  position: absolute;
}
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
  border-top-color: rgba(0, 0, 0, 0.4);
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
  width: 20px;
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
  margin: 15px;
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
  margin-bottom: 20px;
}
.attach-border {
  border-bottom: 1px solid #ffffff;
  position: absolute;
  width: 335px;
}
.input-wrap {
  background-color: rgb(0, 0, 0, 0.5);
  border: 1px solid #000;
  border-radius: 10px;
  padding: 10px;
  position: relative;
  padding-bottom: 20px;
  margin: 25px;
}
.input-readonly-label {
  padding: 10px !important;
}
.input-readonly-label:focus,
.active {
  color: #8a5d04 !important;
  text-decoration: underline;
  outline: none;
  box-shadow: 0px;
}
.attach-container {
  margin-bottom: 20px;
}
.larvae-input-wrap {
  padding: 10px 0px 10px 0px;
}
.radio-btn {
  visibility: hidden;
}
.radio-btn-img {
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.factored-radio-container .larvae-wrap {
  width: 30%;
  padding: 10px 0px 10px 0px;
  color: #fff;
}
.larvae-wrap > input:checked + img {
  background: url("../../assets/images/black-circle.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 12px 12px;
  background-color: #fff;
}
.larvae-rb-img {
  background-color: #fff;
  border-radius: 29px;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
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
