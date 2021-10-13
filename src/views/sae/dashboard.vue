<template>
  <div class="dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <!-- <div class="col-md-12 no-padding main-header">
        <div class="logo-container cursor-pointer" @click="gotoDashboard">
          <img class="img-logo" alt="agriledger logo" src="../../assets/images/logo.png" />
          <sup class="beta">(BETA)</sup>
        </div>
        <div class="username-conatiner">
          <img class="user-icon" alt="agriledger logo" src="../../assets/images/user.png" />
          <label class="lbl-username">{{userName}}</label>
          <br />
          <a href="#" v-on:click="logout" class="ref-logout">Logout</a>
        </div>
      </div>-->
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{
              $t("Dashboard - Harvest Planner", "Dashboard - Harvest Planner")
            }}
          </h3>
        </div>
        <div class="main-container">
          <div class="service-container">
            <div
              v-on:click="newrequest"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/service_request.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("New Service Request", "New Service Request") }}</p>
            </div>
            <div
              v-on:click="showservicerequest"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img manage-img"
                src="../../assets/images/sr_status.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Manage Service Requests", "Manage Service Requests") }}
              </p>
            </div>
          </div>
          <div v-on:click="showListOfProducers" class="product-container">
            <img
              class="service-img produce-img"
              src="../../assets/images/producer.png"
            />
            <p>{{ $t("View Producers", "View Producers") }}</p>
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
import isAuthenticated from '../../shared/auth';
export default {
  name: "dashboard",
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
    let multipleRoles = localStorage.systemRole.split(",");
    if (multipleRoles.length > 1) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Multi-Role-Dashboard", "Multi-Role-Dashboard"),
          href: "/multi-user-dashboard",
        },
        {
          text: this.$t(
            "Harvest Planner - Dashboard",
            "Harvest Planner - Dashboard"
          ),
          href: "/dashboard",
        },
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
            { text: "Harvest Planner - Dashboard", href: "/dashboard" },
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
            { text: "Harvest Planner - Dashboard", href: "/dashboard" },
          ]);
        }
      } else if (localStorage.systemRole == 9) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
            href: "/admin-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
        ]);
      } else if (localStorage.systemRole == 7) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("OP-Admin-Dashboard", "OP-Admin-Dashboard"),
            href: "/op-admin-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
        ]);
      } else if (localStorage.systemRole == 96) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
          },
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
        ]);
      } else if (
        localStorage.systemRole == 1 ||
        localStorage.systemRole == 91
      ) {
        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Harvest Planner - Dashboard",
              "Harvest Planner - Dashboard"
            ),
            href: "/dashboard",
          },
        ]);
      }
    }
    this.userName = localStorage.userName;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
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
    newrequest: function (event) {
      Router.push("new-request");
    },
    showservicerequest: function (event) {
      localStorage.prevPage = "dashboard";
      Router.push("service-requests");
    },
    showListOfProducers: function (event) {
      Router.push("list-of-producers");
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("dashboard");
      }
    },
  },
};
</script>
<style scoped>
.service-img-container,
.product-container {
  cursor: pointer;
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
  text-transform: none !important;
  font-size: 13px;
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.product-container {
  text-align: center;
  margin: 10px 10px 40px 10px;
}
p {
  color: #fff;
  text-align: center;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
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
  background-image: url("../../assets/images/bg2.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  position: fixed;
  right: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
  filter: blur(20px);
  -webkit-filter: blur(20px);
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
  height: 50px !important;
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
.ref-logout {
  font-size: 13px;
  margin-top: -5px;
}
@media screen and (max-width: 531px) {
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
    margin-bottom: 30px;
  }
}
</style>
