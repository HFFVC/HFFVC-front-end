<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h4 class="heading">
            {{ $t("Dashboard", "Dashboard") }} - {{ $t(titleText, titleText) }}
          </h4>
        </div>
        <div class="main-container">
          <div class="service-container">
            <div
              v-if="multiRoles.includes('1')"
              v-on:click="loginAsHarvestPlanner"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/user_dashboard-1.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Login as Harvest Planner", "Login as Harvest Planner") }}
              </p>
            </div>
            <div
              v-if="multiRoles.includes('3')"
              v-on:click="loginAsCollector"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/user_dashboard-3.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Login as Collector", "Login as Collector") }}</p>
            </div>
            <div
              v-if="multiRoles.includes('2')"
              v-on:click="loginAsPackhouseIncharge"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/user_dashboard-5.png"
              />
              <div style="clear: both"></div>
              <p>
                {{
                  $t(
                    "Login as Packhouse Incharge",
                    "Login as Packhouse Incharge"
                  )
                }}
              </p>
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

export default {
  name: "multi-user-dashboard",
  data: function() {
    return {
      userName: "",
      titleText: "MULTI ROLE DASHBOARD",
      multiRoles: localStorage.systemRole.split(","),
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    this.$refs.headercomp.createBreadcrumb([
      {
        text: this.$t("Multi-Role-Dashboard", "Multi-Role-Dashboard"),
        href: "/multi-user-dashboard",
      },
    ]);

    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
  },
  //test
  methods: {
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
    loginAsHarvestPlanner: function(event) {
      Router.push("dashboard");
    },
    showBatchDetails: function(event) {
      Router.push("view-batch-details");
    },
    loginAsCollector: function(event) {
      Router.push("collector-dashboard");
    },
    loginAsPackhouseIncharge: function() {
      Router.push("pack-house-incharge-dashboard");
    },
    showPaymentHistory: () => Router.push("payment-history-broker"),
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
