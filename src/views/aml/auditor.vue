<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-12"></div>
      <div class="col-md-10 content-container">
        <button type="button" class="excel-download-btn" v-on:click="onexport">
          Excel download
        </button>
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Transactions", "Transactions") }}
          </h3>
        </div>
        <div class="main-container">
          <div id="people">
            <v-client-table
              :data="flaggedTransactions"
              :columns="columns"
              :options="options"
              class="tbl-services flagged-transactions-table"
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
import firebase from "firebase";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import axios from "axios";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import Footer from "../../components/footer-view";
import Header from "../../components/header-view";
import getConfigVars from "../../shared/config-env";
import XLSX from "xlsx";
import isAuthenticated from "../../shared/auth";
Vue.use(VueToast);

Vue.use(BootstrapVue);
Vue.use(
  ClientTable,
  {
    perPage: 10,
    headings: {
      date: "Payment Date",
      name: "Name of Account Owner",
      id: "Tax ID/National Identification",
      locality: "Locality",
      service: "Service Rendered",
      amount: "Amount",
    },
    sortable: ["date"],
    customSorting: {
      date: function (ascending) {
        return function (a, b) {
          let dateA = new Date(a.date);
          let dateB = new Date(b.date);

          if (ascending) return dateA >= dateB ? 1 : -1;

          return dateA <= dateB ? 1 : -1;
        };
      },
    },
  },
  false
);

export default {
  components: { Header, Footer },
  name: "auditor",
  data: function () {
    return {
      flaggedTransactions: [],
      columns: [
        "Payment Date",
        "Name of Account Owner",
        "Tax Id / National Identification",
        "Locality",
        "Address",
        "Zip Code",
        "Service Rendered",
        "Payment Amount (in $)",
      ],
      options: {
        perPage: 20,
        sortable: [],
        headings: {
          "Payment Date": `${this.$t("Payment Date", "Payment Date")}`,
          "Name of Account Owner": `${this.$t(
            "Name of Account Owner",
            "Name of Account Owner"
          )}`,
          "Tax Id / National Identification": `${this.$t(
            "Tax Id / National Identification",
            "Tax Id / National Identification"
          )}`,
          Locality: `${this.$t("Locality", "Locality")}`,
          Address: `${this.$t("Address", "Address")}`,
          "Service Rendered": `${this.$t(
            "Service Rendered",
            "Service Rendered"
          )}`,
          "Zip Code": `${this.$t("Zip Code", "Zip Code")}`,
          "Payment Amount": `${this.$t("Payment Amount", "Payment Amount")}`,
        },
        orderBy: {
          ascending: false,
          column: "Payment Date",
        },
        customSorting: {},
      },
      seen: false,
      userName: "",
    };
  },
  mounted() {
    // testing
    // let testData = {
    //   batchId: "79b63af0-3ec4-11eb-9e10-13f7ce30ca7c",
    //   receivingPerson: "BROKER",
    // }
    // this.getOrganizationLocation(testData).then(ddd => {
    //   console.log(ddd);
    // })
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
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
            text: this.$t("Auditor", "Auditor"),
            href: "/auditor",
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
            text: this.$t("Auditor", "Auditor"),
            href: "/auditor",
          },
        ]);
      }
    } else if (localStorage.systemRole == 89) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Auditor", "Auditor"),
          href: "/auditor",
        },
      ]);
    }
    this.getData();
    this.userName = localStorage.userName;
  },

  methods: {
    getData: function () {
      const vm = this;
      vm.seen = true;
      vm.flaggedTransactions = [];
      vm.axios
        .get(
          `${
            getConfigVars().BASE_URL
          }50011/api/v1.0/get-flagged-transactions?pageNo=${1}&pageSize=${20}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.IDtoken,
            },
          }
        )
        .then((response) => {
          console.log(response.data);
          let data = response.data;
          data.forEach((element, index) => {
            let dataToPush = {
              "Payment Date": moment(element.confirmPaymentDate).format(
                "MMM DD, YYYY hh:mm A"
              ),
              "Name of Account Owner": element.receivingPerson,
              "Tax Id / National Identification": element.identificationNo,
              Locality: element.location,
              Address: "",
              "Zip Code": "",
              "Service Rendered": element.serviceRendered,
              "Payment Amount (in $)": Number(element.amount).toFixed(2),
            };
            if (
              element.receivingPerson == "LSP" ||
              element.receivingPerson == "BROKER"
            ) {
              //get organization location
              vm.getOrganizationLocation(element).then((orgData) => {
                dataToPush["Name of Account Owner"] = orgData.name;
                dataToPush["Address"] = orgData.address;
                dataToPush["Zip Code"] = orgData.zipCode;
                if (index == data.length - 1) {
                  vm.seen = false;
                }
                vm.flaggedTransactions.push(dataToPush);
              });
            } else {
              vm.flaggedTransactions.push(dataToPush);
              if (index == data.length - 1) {
                vm.seen = false;
              }
            }
          });
          setTimeout(function () {
            if (vm.flaggedTransactions.length == 0) {
              vm.seen = false;
            }
          }, 4000);
        })
        .catch((error) => {
          console.log(error.message);
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
                vm.getData();
              });
          } else {
            console.log(error);
            vm.seen = false;
          }
        });
    },
    getOrganizationLocation(data) {
      let vm = this;
      vm.seen = true;
      return new Promise((resolve, reject) => {
        if (data.receivingPerson) {
          firebase
            .database()
            .ref()
            .child("batch")
            .child(data.batchId)
            .on("value", (snapshot) => {
              console.log(snapshot.val());

              let orgKey = (function () {
                if (data.receivingPerson == "LSP") {
                  return snapshot.val().organizationKey;
                } else {
                  return snapshot.val().proforma.brokerOrganizationKey;
                }
              })();
              // get organization location
              firebase
                .database()
                .ref()
                .child("masters")
                .child("organization")
                .child(orgKey)
                .on("value", (orgSnapshot) => {
                  console.log(orgSnapshot.val());
                  let orgData = {
                    name: orgSnapshot.val().name,
                    zipCode: orgSnapshot.val().zipCode,
                    address: orgSnapshot.val().Address,
                  };
                  console.log(orgData);
                  vm.seen = false;
                  resolve(orgData);
                });
            });
        }
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
    onexport() {
      var excelData = XLSX.utils.json_to_sheet(this.flaggedTransactions);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, excelData, "Transactions");
      XLSX.writeFile(wb, "FlaggedTransactions.xlsx");
    },
  },
};
</script>
<style>
thead tr th {
  font-weight: 400;
}
tbody tr td {
  font-weight: 400;
}

.flagged-transactions-table thead tr th:nth-child(3),
.flagged-transactions-table thead tr th:nth-child(6),
.flagged-transactions-table tbody tr td:nth-child(3),
.flagged-transactions-table tbody tr td:nth-child(6) {
  /* text-align: right !important; */
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
.excel-download-btn {
  position: relative;
  top: -35px;
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
</style>
