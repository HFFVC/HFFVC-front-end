<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-10 content-container">
         <button type="button" class="excel-download-btn" v-on:click="onexport">
          Excel download
        </button>
        <div style="clear:both;"></div>
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Payment Report", "Payment Report") }}
          </h3>
          <div class="icon-container close-icon">
            <img
              @click="showDashboard"
              class="sub-header-close-img"
              src="../../assets/images/close.png"
            />
          </div>
        </div>
        <div class="main-container">
          <div id="people">
            <v-client-table
            ref="paymentHistory"
              :data="paymentHistory"
              :columns="columns"
              :options="options"
              class="tbl-services payment-history-table"
            ></v-client-table>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase, { functions } from "firebase";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";

import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import XLSX from "xlsx";
import isAuthenticated from '../../shared/auth';

Vue.use(VueToast);

Vue.use(BootstrapVue);
Vue.use(ClientTable);

export default {
  components: {
    Header,
    Footer,
  },
  name: "payment-history",
  data: function() {
    return {
      paymentHistory: [],
      columns: [
         "Batch Id",
        "Batch Creation Date",
        "Sale Id",
        "Product",
        "Total Number of Boxes Shipped",
        "Total Weight of the Fruits Shipped (in kg)",
        "Date of Shipment",
        "Amount Paid to LSP (in $)"
      ],
      options: {
        perPage: 10,
        // headings: {
        //   "Invoice No": `${this.$t("Invoice No", "Invoice No")}`,
        //   organizationName: `${this.$t(
        //     "Organization Name",
        //     "Organization Name"
        //   )}`,
        //   Product: `${this.$t("Product", "Product")}`,
        //   "Buyer's Name": `${this.$t("Buyer's Name", "Buyer's Name")}`,
        //   "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
        //   "Net Sales": `${this.$t("Net Sales", "Net Sales")}`,
        //   "Price Per Kg": `${this.$t("Price Per Kg", "Price Per Kg")}`,
        //   paymentConfirmedOn: `${this.$t(
        //     "Payment Confirmed On",
        //     "Payment Confirmed On"
        //   )}`,
        // },
        // sortable: [
        //   "Product",
        //   "Buyer's Name",
        //   "No of Boxes",
        //   "paymentConfirmedOn",
        // ],
        // orderBy: {
        //   ascending: false,
        //   column: "paymentConfirmedOn",
        // },
        customSorting: {
          paymentConfirmedOn: function(ascending) {
            return function(a, b) {
              let dateA = new Date(a.paymentConfirmedOn);
              let dateB = new Date(b.paymentConfirmedOn);

              if (ascending) return dateA >= dateB ? 1 : -1;

              return dateA <= dateB ? 1 : -1;
            };
          },
        },
      },
      seen: false,
      userName: "",
    };
  },
  mounted() {
      if (localStorage.systemRole == 99) {
      if(getConfigVars().USERID == isAuthenticated())
      {
      // this.isSuperAdmin = true;
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
          text: this.$t("Payment Report", "Payment Report"),
          href: "/payment-report",
        },
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
          text: this.$t("Payment Report", "Payment Report"),
          href: "/payment-report",
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
          text: this.$t("Payment Report", "Payment Report"),
          href: "/payment-report",
        },
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
        {
          text: this.$t("Payment Report", "Payment Report"),
          href: "/payment-report",
        },
      ]);
    }else if (localStorage.systemRole == 96) {
  
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Payment Report", "Payment Report"),
          href: "/payment-report",
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
          text: this.$t("Payment Report", "Payment Report"),
          href: "/payment-report",
        },
      ]);
    }
    this.options = {
      perPage: 10,
      // headings: {
      //   "Invoice No": `${this.$t("Invoice No", "Invoice No")}`,
       
      //   Product: `${this.$t("Product", "Product")}`,
      //   "Buyer's Name": `${this.$t("Buyer's Name", "Buyer's Name")}`,
      //   "No of Boxes": `${this.$t("No of Boxes", "No of Boxes")}`,
      //   "Net Sales": `${this.$t("Net Sales", "Net Sales")}`,
      //   "Price Per Kg": `${this.$t("Price Per Kg", "Price Per Kg")}`,
      //     "LSP Amount": `${this.$t("LSP Amount", "LSP Amount")}`,
      //   paymentConfirmedOn: `${this.$t(
      //     "Payment Confirmed On",
      //     "Payment Confirmed On"
      //   )}`,
      // },
      // sortable: [
      //   "Product",
      //   "Buyer's Name",
      //   "No of Boxes",
      //   "paymentConfirmedOn",
      // ],
      // orderBy: {
      //   ascending: false,
      //   column: "paymentConfirmedOn",
      // },
      // customSorting: {
      //   paymentConfirmedOn: function(ascending) {
      //     return function(a, b) {
      //       let dateA = new Date(a.paymentConfirmedOn);
      //       let dateB = new Date(b.paymentConfirmedOn);

      //       if (ascending) return dateA >= dateB ? 1 : -1;

      //       return dateA <= dateB ? 1 : -1;
      //     };
      //   },
      // },
    };
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
    this.userName = localStorage.userName;
  },

  methods: {
      onexport() {
        var jsonData = this.$refs.paymentHistory.allFilteredData;
      var excelData = XLSX.utils.json_to_sheet(jsonData);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, excelData, "Transactions");
      XLSX.writeFile(wb, "lsp-payment-report.xlsx");
    },
    getData: function() {
      var currentValue = this;
      currentValue.seen = true;
      var dbRef = firebase
        .database()
        .ref()
        .child("batch");
//       if (localStorage.systemRole.includes(99)) {
//         dbRef.on("child_added", function(snapshot) {
//           var sellRef = firebase
//             .database()
//             .ref()
//             .child("batch")
//             .child(snapshot.key)
//             .child("sell");
//           sellRef.on("child_added", function(snapshot) {
        
//             console.log(snapshot.val());
//             if (snapshot.val().confirmPayment) {
//                   firebase
//             .database()
//             .ref()
//             .child("paymentDistribution")
//            .orderByChild("saleId").
//             equalTo(snapshot.val().sellId)
// .on("child_added", function(snapshotNew) {
  
//   var brokerAmount = 0;
// snapshotNew.val().sales.forEach(inpVal =>{

// if(inpVal.role == "LSP")
// {
// brokerAmount = Number(inpVal.amount).toFixed(2);
// }
// });
//               currentValue.paymentHistory.push({
//                 "Batch Id":,
//                 "Batch Creation Date":,
//                 // "Invoice No": snapshot.val().confirmPayment
//                 //   .confirmPaymentInvoiceNo,
//                 // organizationName: snapshot.val().invoice.brokerOrganization,
//                 // "Buyer's Name": snapshot.val().confirmPayment
//                 //   .confirmPaymentBuyerName,
//                 // Product: snapshot.val().soldProduct,
//                 // "No of Boxes": snapshot.val().confirmPayment.noOfBoxesSold,
//                 // "Net Sales": Number(snapshot.val().invoice.netSales).toFixed(2),
//                 // "LSP Amount": brokerAmount,
//                 // "Price Per Kg": snapshot.val().confirmPayment
//                 //   .confirmPaymentPricePerKg,
//                 // paymentConfirmedOn: moment
//                 //   .utc(snapshot.val().confirmPayment.confrimPaymentDate)
//                 //   .local()
//                 //   .format("MMM DD, YYYY hh:mm A"),
//               });
//             });
//             }
//             currentValue.seen = false;
//           });
//         });
//       } else {

        dbRef.on("child_added", function(snapshotBatch) {
          if (snapshotBatch.val() != null && snapshotBatch.val().proforma != null) {
            if (
              snapshotBatch.val().organizationKey ==
              localStorage.organizationKey
            ) {
              var sellRef = firebase
                .database()
                .ref()
                .child("batch")
                .child(snapshotBatch.key)
                .child("sell");
              sellRef.on("child_added", function(snapshot) {
               var lots = snapshotBatch.val().lots;
              let keys = [];
              let _noOfBoxes = 0;
              if (lots) {
                keys = Object.keys(lots);
                _noOfBoxes = 0;
                keys.forEach(function (key) {
                  _noOfBoxes += lots[key].noOfBoxes;
                });
              }
                if (snapshot.val().confirmPayment) {
               
                            firebase
            .database()
            .ref()
            .child("paymentDistribution")
            .orderByChild("saleId").
            equalTo(snapshot.val().sellId)
.on("child_added", function(snapshotNew) {

  var lspAmount = 0;
snapshotNew.val().sales.forEach(inpVal =>{

if(inpVal.role == "LSP")
{
lspAmount = Number(inpVal.amount).toFixed(2);
}
});

                  currentValue.paymentHistory.push({
               "Batch Id":snapshot.val().batchId,
                "Batch Creation Date":
                moment(
                    String(snapshotBatch.val().batchCreatedAt)
                  ).format("MMM DD, YYYY hh:mm A"),
                "Sale Id":snapshot.val().sellId,
                "Product":snapshotBatch.val().product,
                "Total Number of Boxes Shipped":_noOfBoxes,
                "Total Weight of the Fruits Shipped (in kg)":Number(_noOfBoxes)*Number(snapshot.val().salesWeightPerBox),
                "Date of Shipment":
                 moment(
                    String(snapshotBatch.val().maintain.arrivalTimestamp)
                  ).format("MMM DD, YYYY hh:mm A"),
                "Amount Paid to LSP (in $)":lspAmount
                    // "Invoice No": snapshot.val().confirmPayment
                    //   .confirmPaymentInvoiceNo,
                    // organizationName: snapshot.val().invoice.brokerOrganization,
                    // "Buyer's Name": snapshot.val().confirmPayment
                    //   .confirmPaymentBuyerName,
                    // Product: snapshot.val().soldProduct,
                    // "No of Boxes": snapshot.val().confirmPayment.noOfBoxesSold,
                    // "Net Sales": snapshot.val().invoice.netSales,
                    //  "LSP Amount": brokerAmount,
                    // "Price Per Kg": snapshot.val().confirmPayment
                    //   .confirmPaymentPricePerKg,
                    // paymentConfirmedOn: moment
                    //   .utc(snapshot.val().confirmPayment.confrimPaymentDate)
                    //   .local()
                    //   .format("MMM DD, YYYY hh:mm A"),
                  });

});
                }
                currentValue.seen = false;
              });
            }
          }
        });
    //  }
      setTimeout(function() {
        if (currentValue.paymentHistory.length == 0) {
          currentValue.seen = false;
        }
      }, 3000);
    },
    logout: function(event) {
      firebase
        .auth()
        .signOut()
        .then(function() {
          localStorage.emailId = "";
          localStorage.userName = "";
          Router.push("/");
        })
        .catch(function(error) {
          alert("Error");
        });
    },
    showDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if(localStorage.systemRole == 96) {
        Router.push("lsp-dashboard");
      }
      else
      {
         Router.push("pack-house-incharge-dashboard");
      }
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if(localStorage.systemRole == 96) {
        Router.push("lsp-dashboard");
      }
      else
      {
         Router.push("pack-house-incharge-dashboard");
      }
    },
  },
};
</script>
<style scoped>
.header-container {
  height: 50px !important;
  padding: 12px !important;
}
</style>

<style>
.excel-download-btn {
  position: relative;
  top: -15px;
  float: right;
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
thead tr th {
  font-weight: 400;
}
tbody tr td {
  font-weight: 400;
}
.payment-history-table thead tr th:nth-child(4),
.payment-history-table thead tr th:nth-child(5),
.payment-history-table tbody tr td:nth-child(4),
.payment-history-table tbody tr td:nth-child(5) {
  /* text-align: right !important; */
  text-align: center !important;
}
.payment-history-table tbody tr td:nth-child(6),
.payment-history-table thead tr th:nth-child(6),
.payment-history-table tbody tr td:nth-child(5),
.payment-history-table thead tr th:nth-child(5),
.payment-history-table tbody tr td:nth-child(8),
.payment-history-table thead tr th:nth-child(8)  {
  text-align: right !important;
}
.payment-history-table thead tr th {
  font-weight: bold;
}
.payment-history-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.payment-history-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
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
</style>
<style scoped>
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
}
.sub-header-imgs {
  width: 22px;
  height: auto;
  cursor: pointer;
}
.icon-container {
  float: right;
  position: relative;
  /* top: -35px; */
  top: -49px;
  margin-right: 17px;
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
.close-icon {
     margin-top: -2% !important;
    top: 0 !important;
}
</style>
