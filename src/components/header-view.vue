<template>
  <div class="col-md-12 no-padding main-header">
    <div class="logo-container cursor-pointer">
      <h3 @click="gotoDashboard" class="inter-head">HFFVC</h3>
      <!-- <img class="img-logo" alt="agriledger logo" src="../assets/images/logo.png" />
      <sup class="beta">(BETA)</sup>-->

      <Breadcrumb ref="crumbs"></Breadcrumb>
    </div>
    <div class="username-conatiner">
      <language ref="lang"></language>
      <!-- <img class="user-icon" alt="agriledger logo" src="../assets/images/user.png" /> -->
      <label class="lbl-username">{{ userName }}</label>
      <br />
      <a href="#" v-on:click="logout" class="ref-logout">{{
        $t("Logout", "Logout")
      }}</a>
    </div>
    <!-- <Breadcrumb ref="crumbs"></Breadcrumb> -->
  </div>
</template>
<script>
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../router";
import firebase from "firebase";
import Breadcrumb from "./breadcrumb";
import language from "./language";

export default {
  name: "Header",
  data: function () {
    return {
      userName: "",
      crumbItem: [],
    };
  },
  components: {
    language,
    Breadcrumb,
  },
  mounted() {
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
  },
  methods: {
    createBreadcrumb: function (nameURLList) {
      this.crumbItem = nameURLList;
      console.log(this.crumbItem);
      this.$refs.crumbs.getBreadcrumb(this.crumbItem);
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
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("/sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("/admin-dashboard");
      } else if (localStorage.systemRole == 1) {
        Router.push("/dashboard");
      } else if (localStorage.systemRole == 2) {
        Router.push("/lsp-dashboard");
      } else if (localStorage.systemRole == 3) {
        Router.push("/collector-dashboard");
      } else if (localStorage.systemRole == 4 || localStorage.systemRole == 5) {
        Router.push("/broker-dashboard");
      } else if (localStorage.systemRole == 6) {
        Router.push("/tpa-dashboard");
      } else if (localStorage.systemRole == 13) {
        Router.push("/observer-dashboard");
      } else if (localStorage.systemRole == 7) {
        Router.push("/op-admin-dashboard");
      }
    },
  },
};
</script>
<style scoped>
.inter-head {
  color: #fff;
  font-size: 39px;
  margin-top: 5px;
  float: left;
  margin-left: 14px;
  position: absolute;
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.lbl-username-lsp {
  text-transform: none !important;
}
.ref-logout {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
@media screen and (max-width: 800px) {
  .main-header {
    height: 160px !important;
  }
  .username-conatiner {
    margin-top: 40px !important;
  }
}
</style>
