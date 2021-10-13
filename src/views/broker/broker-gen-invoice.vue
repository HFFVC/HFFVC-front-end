<template>
  <div class="get-invoice">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row-content">
      <div class="col-md-8 content-container">
        <div class="header-container">
          <h3 class="heading">Invoice Details</h3>
        </div>
        <div class="main-container">
          <div class="tbl-services">
            <div>
              <table
                id="printThis"
                style="width: 100%"
                border="0"
                class="pdf-table table table-striped table-bordered table-hover"
              >
                <tr>
                  <td>Invoice Number</td>
                  <td>{{ invoiceNo }}</td>
                </tr>
                <tr>
                  <td>Billing Date</td>
                  <td>{{ billingDate }}</td>
                </tr>
                <tr>
                  <td>Broker Name</td>
                  <td>{{ brokerName }}</td>
                </tr>
                <tr>
                  <td>Broker Organization</td>
                  <td>{{ brokerOrganization }}</td>
                </tr>
                <tr>
                  <td>Buyer Name</td>
                  <td>{{ buyerName }}</td>
                </tr>
                <tr>
                  <td>Buyer Organization</td>
                  <td>{{ buyerOrganization }}</td>
                </tr>
                <tr>
                  <td>Product</td>
                  <td>{{ product }}</td>
                </tr>
                <tr>
                  <td>No. of Boxes Purchased</td>
                  <td>{{ noofBoxesPurchased }}</td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{{ pricePerKgCurrency }}</td>
                </tr>
                <tr>
                  <td>Price Per Kg</td>
                  <td>{{ pricePerKg }}</td>
                </tr>
                <tr>
                  <td>Approximate Weight Of Product Sold</td>
                  <td>{{ aproximateWeightOfProduct }}</td>
                </tr>
                <tr>
                  <td>Currency</td>
                  <td>{{ GICurrency }}</td>
                </tr>
                <tr>
                  <td>Net Sales</td>
                  <td>{{ netSales }}</td>
                </tr>
              </table>
            </div>
            <div class="btn-wrap">
              <input
                type="button"
                id="ignoreThis"
                @click="showPDF"
                class="btn-save btn-save-pdf"
                value="Download Invoice"
              />
            </div>
          </div>
        </div>
      </div>
      <p id="ignorePDF"></p>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import firebase, { functions } from "firebase";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import BootstrapVue from "bootstrap-vue";
import { uuid } from "vue-uuid";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import VueToast from "vue-toast-notification";
import moment from "moment";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";

Vue.use(BootstrapVue);
Vue.use(VueToast);
export default {
  name: "broker-get-invoice",
  components: {
    PerfectScrollbar,
    Footer,
  },
  data() {
    return {
      seen: false,
      GICurrency: "",
      billingDate: "",
      brokerName: "",
      brokerOrganization: "",
      buyerName: "",
      buyerOrganization: "",
      invoiceNo: "",
      netSales: "",
      noofBoxesPurchased: "",
      pricePerKg: "",
      aproximateWeightOfProduct: "",
      product: "",
      pricePerKgCurrency: "",
    };
  },
  mounted() {
    //this.$refs.headercomp.testMethod([{"text":"SA-Dashboard","href":"/sa-dashboard"},{"text":"Broker-Dashboard","href":"/broker-dashboard"},{"text":"Active Batches","href":"/view-broker-batches"},{"text":"Invoice","href":"/invoice/:id"},{"text":"Invoice Details","href":"/broker-invoice/:invoiceNumber"}]);
    this.seen = true;
    var currentval = this;
    // firebase
    //   .auth()
    //   .signInWithEmailAndPassword(`${getConfigVars().USERID}`, `${getConfigVars().PASSWORD}`)
    //   .then(response => {
    // localStorage.emailId = response.user.email;

    // var ref = firebase
    //   .database()
    //   .ref()
    //   .child("profile")
    //   .child(response.user.uid);
    // ref.on("value", snapshot => {
    //   localStorage.userName =
    //     snapshot.val().firstName +
    //     " " +
    //     snapshot.val().lastName +
    //     " (" +
    //     snapshot.val().function +
    //     ")";
    //   localStorage.systemRole = snapshot.val().systemRole;

    this.invoiceNumber = this.$route.params.invoiceNumber;
    this.getInvoiceDetails(this.invoiceNumber);
    // });

    // })
    // .catch(function() {
    //   currentval.seen = false;
    //   Vue.$toast.open({
    //     message: "Something went wrong! Please try after sometime!",
    //     type: "error",
    //     position: "top"
    //   });
    // });
  },
  methods: {
    showPDF() {
      let fileName = `${this.invoiceNumber}.pdf`;
      var doc = new jsPDF("p", "pt", "a4");
      var elementHandler = {
        "#ignorePDF": function (element, renderer) {
          return true;
        },
        "#ignoreThis": function (element, renderer) {
          return true;
        },
      };
        var src = window.document.getElementById("printThis").innerHTML;
       var varNewElem = document.createElement('table');
       varNewElem.setAttribute("id","pdfTableContent");
        varNewElem.setAttribute("border","1");
       varNewElem.setAttribute("style","width:100%");
       varNewElem.innerHTML = src;
        doc.html(varNewElem, {
          callback: function (doc) {
            doc.save(fileName);
          },
          x: 10,
          y: 10,
          fileName: fileName,
        });

    },
    getInvoiceDetails(invoiceNumber) {
      const vm = this;
      vm.seen = true;
      var firebaseRef = firebase.database().ref().child("batch");
      firebaseRef.on("child_added", function (snapshot) {
        if (snapshot.val().sell != null) {
          var saleRef = firebase
            .database()
            .ref()
            .child("batch")
            .child(snapshot.key);
          saleRef
            .child("sell")
            .orderByChild("sellId")
            .equalTo(invoiceNumber)
            .on("child_added", function (snapshot) {
              console.log(snapshot.val());
              if (snapshot.val().invoice) {
                const {
                  GICurrency,
                  billingDate,
                  brokerName,
                  brokerOrganization,
                  buyerName,
                  buyerOrganization,
                  invoiceNo,
                  netSales,
                  noofBoxesPurchased,
                  pricePerKg,
                  pricePerKgCurrency,
                  aproximateWeightOfProduct,
                  product,
                } = snapshot.val().invoice;

                vm.GICurrency = GICurrency;
                vm.pricePerKgCurrency = pricePerKgCurrency;
                vm.billingDate = moment
                  .utc(billingDate)
                  .local()
                  .format("MMM DD, YYYY hh:mm A");
                vm.brokerName = brokerName;
                vm.brokerOrganization = brokerOrganization;
                vm.buyerName = buyerName;
                vm.buyerOrganization = buyerOrganization;
                vm.invoiceNo = invoiceNo;
                vm.netSales = netSales;
                vm.noofBoxesPurchased = noofBoxesPurchased;
                vm.pricePerKg = pricePerKg;
                vm.aproximateWeightOfProduct = aproximateWeightOfProduct;
                vm.product = product;

                vm.seen = false;
              } else {
                vm.seen = false;
                Vue.$toast.open({
                  message: "Invalid invoice ID.",
                  type: "error",
                  position: "top",
                });
              }
            });
        }
      });
    },
  },
};
</script>
<style>
#pdfTableContent
{
  width: 520px !important;
  height: auto !important;
border-collapse: collapse !important;
}
#pdfTableContent td:nth-child(odd)
 {width: 210px !important;
 padding: 10px !important;}

#pdfTableContent td:nth-child(even)
 {width: 210px !important;
  padding: 10px !important;}
#pdfTableContent tbody
{
  width:100% !important;
}
#pdfTableContent tr,#pdfTableContent td
{
  background-color: #fff !important;
  color:#000 !important;
  width:100% !important;
}
</style>
<style scoped>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";
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
#printThis thead tr th {
  font-weight: 400;
}
#printThis tbody tr td {
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
.view-batches-table tbody tr td:nth-child(3) {
  text-align: right !important;
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
#printThis td {
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
#printThis td,
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
.pdf-table {
  color: #fff !important;
  font-size: 13px !important;
  border: 1px solid rgba(0, 0, 0, 0.7) !important;
  border-radius: 30px !important;
}
.pdf-table tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05);
}
.pdf-table tr:nth-of-type(even) {
  background: rgba(0, 0, 0, 0.4) !important;
}
.btn-save-pdf {
  margin-bottom: 10px;
  width: 160px;
}
.btn-wrap {
  width: 100%;
  margin-bottom: 30px;
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
.print-this-css > tr > td {
  background-color: white !important;
  color: black !important;
}
</style>
