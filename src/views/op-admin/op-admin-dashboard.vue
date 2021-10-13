<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <!-- <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer">
          <img
            class="img-logo-lsp"
            alt="agriledger logo"
            src="../../assets/images/logo.png"
          />
          <sup class="beta">(BETA)</sup>
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
      </div>-->
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h4 class="heading">Dashboard - OP-Admin</h4>
        </div>
        <div class="main-container">
          <div class="service-container service-container-sa">
            <div
              v-on:click="showSAEDashboard"
              class="service-img-container new-request-container ICGiconBox"
            >
              <img
                class="service-img-new SAEicon"
                src="../../assets/images/user_dashboard.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Login as Harvest Planner", "Login as Harvest Planner") }}
              </p>
            </div>
            <div
              @click="showLSPDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Login as LSP", "Login as LSP") }}</p>
            </div>
            <div
              @click="showCollectorScreen"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Login as Collector", "Login as Collector") }}</p>
            </div>
          </div>

          <div class="service-container service-container-sa">
            <div
              @click="showBrokerDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Login as Broker", "Login as Broker") }}</p>
            </div>
            <div
              @click="showPaymentReporting"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new dashboard-icon-reporting"
                src="../../assets/images/payment_report.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Payment Reporting", "Payment Reporting") }}</p>
            </div>
            <div
              @click="showUnsuccessfulSale"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new unsuccessful-mt"
                src="../../assets/images/unsuccessful_batches.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Unsuccessful Sale", "Unsuccessful Sale") }}</p>
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
import isAuthenticated from '../../shared/auth';
export default {
  name: "admin-dashboard",
  data: function () {
    return {
      userName: "",
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    if (localStorage.systemRole == 99) {
      if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
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
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
      ]);
      }
    } else {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
          href: "/op-admin-dashboard",
        },
      ]);
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
  },
  methods: {
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
    showUnsuccessfulSale: function (event) {
      Router.push("view-unsuccessful-sale");
    },
    showPaymentReporting: function (event) {
      localStorage.prevPage = "op-admin-dashboard";
      Router.push("payment-reporting");
    },
    showPreviousRequest: function (event) {
      Router.push("previous-service-requests");
    },
    showManagePackhouse: function (event) {
      Router.push("manage-packhouses");
    },
    showManageCollectionPoints: () => Router.push("manage-collection-points"),
    showSAEDashboard: function () {
      Router.push("dashboard");
    },
    showLSPDashboard: function () {
      Router.push("lsp-dashboard");
    },
    showBrokerDashboard: function () {
      Router.push("broker-dashboard");
    },
    showCollectorScreen: function () {
      Router.push("collector-dashboard");
    },
    showTPADashboard: function () {
      Router.push("tpa-dashboard");
    },
    gotoDashboard: () => Router.push("admin-dashboard"),
  },
};
</script>
<style scoped>
.ICGiconBox img {
  margin-top: 9px !important;
  /* padding:19px !important; */
  height: 57px !important;
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
}
.service-img {
  width: 65px;
  height: auto;
  text-align: center;
  padding: 10px;
}
.service-img-new {
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
  /* height: auto; */
  height: 50px;
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
.service-container-sa .service-img {
  height: 65px;
}
.service-inner-center {
  margin: 0 auto;
}
.dashboard-icon-reporting {
  width: 50px;
  padding-bottom: 6px;
}

.unsuccessful-mt {
  margin-top: -10px;
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
.margin-l-10 {
  margin-left: 10%;
}
.margin-r-10 {
  margin-right: 10%;
}
</style>
