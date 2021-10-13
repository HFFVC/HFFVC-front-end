<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>

    <div class="row content">
      <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer">
          <h3 @click="gotoDashboard" class="inter-head">HFFVC</h3>
          <!-- <img class="img-logo-lsp" alt="agriledger logo" src="../../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup> -->
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
          <h3 class="heading">Payment History</h3>
        </div>
        <div class="main-container">
          <div id="people">
            <v-client-table
              :data="paymentHistory"
              :columns="columns"
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
import Footer from "../../components/footer-view";
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
  components: { Footer },
  name: "payment-history",
  data: function () {
    return {
      paymentHistory: [
        {
          date: "10-11-2019",
          name: "Alex Albam",
          id: "1",
          locality: "Texas",
          service: "Drop",
          amount: 100,
        },
        {
          date: "11-11-2019",
          name: "Chris Franklin",
          id: "2",
          locality: "NYC",
          service: "Drop",
          amount: 100,
        },
        {
          date: "12-11-2019",
          name: "Allan Cooper",
          id: "3",
          locality: "Brooklyn",
          service: "Drop",
          amount: 100,
        },
        {
          date: "13-11-2019",
          name: "Albert Lee",
          id: "4",
          locality: "NYC",
          service: "Pickup",
          amount: 100,
        },
        {
          date: "14-11-2019",
          name: "Daniel Rodrigues",
          id: "5",
          locality: "New Jersey",
          service: "Pickup",
          amount: 100,
        },
        {
          date: "15-11-2019",
          name: "Flyan Fernandes",
          id: "6",
          locality: "New Jersy",
          service: "Pickup",
          amount: 100,
        },
        {
          date: "16-11-2019",
          name: "Lester Noronha",
          id: "7",
          locality: "Texas",
          service: "Drop",
          amount: 100,
        },
      ],
      columns: ["date", "name", "id", "locality", "service", "amount"],
      seen: false,
      userName: "",
    };
  },
  mounted() {
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.getData();
    this.userName = localStorage.userName;
  },

  methods: {
    getData: function () {},
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

.payment-history-table thead tr th:nth-child(3),
.payment-history-table thead tr th:nth-child(6),
.payment-history-table tbody tr td:nth-child(3),
.payment-history-table tbody tr td:nth-child(6) {
  text-align: right !important;
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
</style>
