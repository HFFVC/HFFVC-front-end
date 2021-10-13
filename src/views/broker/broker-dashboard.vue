<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-5 content-container">
        <div class="header-container">
          <h4 class="heading">
            {{ $t("Dashboard", "Dashboard") }} - {{ titleText }}
          </h4>
        </div>
        <div class="main-container">
          <div class="service-container">
            <div
              v-on:click="showActiveRequest"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/active_batches.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Active Batches", "Active Batches") }}</p>
            </div>
            <div
              v-on:click="showPreviousRequest"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/unsuccessful_batches.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Unsuccessful Batches", "Unsuccessful Batches") }}</p>
            </div>
          </div>
          <div class="service-container product-container">
            <div
              v-on:click="showPaymentHistory"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img payment-history-service-img"
                src="../../assets/images/payment_history.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Payment History", "Payment History") }}</p>
            </div>
            <div
              v-on:click="showBatchDetails"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/active_batches.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Batch Details", "Batch Details") }}</p>
            </div>
          </div>

          <div class="service-container product-container">
            <div
              v-if="isAddBroker || isSuperUser"
              v-on:click="goToAddBroker"
              class="single-container new-request-container"
            >
              <img
                class="service-img payment-history-service-img"
                src="../../assets/images/user_list.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Add Broker", "Add Broker") }}</p>
            </div>
            <div
              v-if="!isSuperUser"
              v-on:click="goToPaymentBrokerReport"
              class="single-container new-request-container"
            >
              <img
                class="service-img payment-history-service-img"
                src="../../assets/images/payment_report.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Broker Payment Report", "Broker Payment Report") }}</p>
            </div>
          </div>

          <div class="service-container product-container">
            <div
              v-if="isAddBroker"
              v-on:click="goToOrganizatioDetails"
              class="single-container new-request-container"
            >
              <img
                class="service-img payment-history-service-img"
                src="../../assets/images/organization_details.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Organization Details", "Organization Details") }}</p>
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
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";

export default {
  name: "broker-dashboard",
  data: function () {
    return {
      userName: "",
      titleText: "BROKER",
      isAddBroker: false,
      isSuperUser: false,
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    if (localStorage.systemRole == 99) {
      this.isSuperUser = true;
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
            text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
            href: "/broker-dashboard",
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
            text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
            href: "/broker-dashboard",
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
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
      ]);
    } else if (localStorage.systemRole == 7) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
      ]);
    } else if (localStorage.systemRole == 4) {
      this.isAddBroker = false;
      this.titleText = "BROKER";
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
      ]);
    } else if (localStorage.systemRole == 97) {
      this.isAddBroker = true;
      this.titleText = "BROKER SPOC";
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker SPOC-Dashboard", "Broker SPOC-Dashboard"),
          href: "/broker-dashboard",
        },
      ]);
    } else if (localStorage.systemRole == 5) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker-Dashboard", "Broker-Dashboard"),
          href: "/broker-dashboard",
        },
      ]);
      this.titleText = "Super Broker";
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
  },
  //test
  methods: {
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
    showActiveRequest: function (event) {
      Router.push("view-broker-batches");
    },
    showBatchDetails: function (event) {
      Router.push("view-batch-details");
    },
    showPreviousRequest: function (event) {
      Router.push("view-broker-batches-previous");
    },
    goToAddBroker: function () {
      Router.push("add-broker");
    },
    goToPaymentBrokerReport: function () {
      Router.push("broker-payment-history");
    },
    showPaymentHistory: () => Router.push("payment-history-broker"),
    goToOrganizatioDetails() {
      Router.push("organization-details");
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("broker-dashboard");
      }
    },
  },
};
</script>
<style scoped>
.header-container {
  height: 50px !important;
  padding: 16px !important;
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
  height: 70px !important;
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
  display: inline-flex;
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
.single-container {
  width: 100% !important;
}
</style>
