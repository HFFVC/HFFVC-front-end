<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <!-- <Breadcrumb></Breadcrumb> -->
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h4 class="heading">
            {{ $t("Dashboard", "Dashboard") }} - {{ titleHeaderText }}
            <!-- {{ $t("Dashboard - Root Authority", "Dashboard - Root Authority") }} -->
          </h4>
        </div>
        <div class="main-container">
          <div class="service-container service-container-sa">
            <div
              @click="showManageOrganizations"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/unsuccessful_batches.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage Organizations", "Manage Organizations") }}</p>
            </div>
            <div
              v-on:click="showManageUsers"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/user_list.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage Users", "Manage Users") }}</p>
            </div>
            <!-- <div
              @click="showManagePackhouse"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/packhouse.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage Packhouses", "Manage Packhouses") }}</p>
            </div> -->
            <!-- <div
              @click="showManageCollectionPoints"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/collection_point.png"
              />
              <div style="clear:both;"></div>
              <p>
                {{ $t("Manage Collection Points", "Manage Collection Points") }}
              </p>
            </div> -->
            <!-- <div
              @click="showManageNGOs"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage_ngo.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage NGOs", "Manage NGOs") }}</p>
            </div> -->
            <!-- <div
              @click="showManageBankAccounts"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage_bank_accts.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage Bank Accounts", "Manage Bank Accounts") }}</p>
            </div>
           -->

            <!-- <div
              @click="showManageICGDistribution"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage_bank_accts.png"
              />
              <div style="clear:both;"></div>
              <p>
                {{
                  $t(
                    "Manage Harvest Planner Distribution",
                    "Manage Harvest Planner Distribution"
                  )
                }}
              </p>
            </div> -->
            <div
              @click="showManageFruits"
              class="service-img-container new-request-container"
            >
              <img class="service-img-new" src="../../assets/images/flow.png" />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage Fruit Flow", "Manage Fruit Flow") }}</p>
            </div>
          </div>

          <div class="service-container service-container-sa">
            <!-- <div
              @click="showManageProducts"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage-product.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Manage Products", "Manage Products") }}</p>
            </div> -->
            <!-- <div
              v-on:click="showSAEDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new SAEicon"
                src="../../assets/images/user_dashboard-1.png"
              />
              <div style="clear:both;"></div>
              <p>
                {{ $t("Login as Harvest Planner", "Login as Harvest Planner") }}
              </p>
            </div> -->
            <!-- <div
              @click="showLSPDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-2.png"
              />
              <div style="clear:both;"></div>
              <p>
                {{
                  $t(
                    "Login as Packhouse Incharge",
                    "Login as Packhouse Incharge"
                  )
                }}
              </p>
            </div> -->

            <div
              @click="showPaymentReporting"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new dashboard-icon-reporting"
                src="../../assets/images/payment_report.png"
              />
              <div style="clear:both;"></div>
              <p class="margin-tp">
                {{ $t("Payment Reporting", "Payment Reporting") }}
              </p>
            </div>

            <div
              @click="showApproveRejectProposedProducer"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new approve-icon"
                src="../../assets/images/approved-reject.png"
              />
              <div style="clear:both;"></div>
              <p>
                {{
                  $t(
                    "Approve/Reject Proposed Producer",
                    "Approve/Reject Proposed Producer"
                  )
                }}
              </p>
            </div>
            <div v-if="isTechSpoc"
              @click="showLSPSPOCDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new margin-tp"
                src="../../assets/images/user_dashboard-4.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as LSP SPOC", "Login as LSP SPOC") }}</p>
            </div>
          </div>
          <div v-if="isTechSpoc" class="service-container service-container-sa">
            <div
              @click="showBrokerDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-7.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as Broker SPOC", "Login as Broker SPOC") }}</p>
            </div>
            <!-- <div
              @click="showSAEDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-8.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as Extension Services", "Login as Extension Services") }}</p>
            </div> -->
            <!-- <div
              @click="showTPADashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-5.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as TPA", "Login as TPA") }}</p>
            </div> -->

            <!-- <div
              @click="showUnsuccessfulSale"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/unsuccessful_batches.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Unsuccessful Sale", "Unsuccessful Sale") }}</p>
            </div> -->
            <div
              @click="showAuditorPage"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-5.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as Auditor", "Login as Auditor") }}</p>
            </div>
          </div>
          <div class="service-container service-container-sa"></div>
          <!-- <div
            class="service-container unsuccessfulsaleBox service-container-sa"
          > -->
          <!-- <div
              @click="showOpAdminDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-6.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as OP-Admin", "Login as OP-Admin") }}</p>
            </div> -->
          <!-- <div
              @click="showObserverDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-7.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as Observer", "Login as Observer") }}</p>
            </div> -->
          <!-- <div
              @click="showAdminDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-8.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as Admin", "Login as Admin") }}</p>
            </div> -->
          <!-- <div
              @click="showObserverMciDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard.png"
              />
              <div style="clear:both;"></div>
              <p>{{ $t("Login as Observer-MCI", "Login as Observer-MCI") }}</p>
            </div> -->
          <!-- </div> -->
          <!-- <div
            class="service-container unsuccessfulsaleBox service-container-sa"
          >
         
          </div> -->
          <!-- <div
            class="service-container unsuccessfulsaleBox service-container-sa"
          >
           
          </div> -->
          <!-- <div class="service-container service-container-sa">
            <div
              @click="showUnsuccessfulSale"
              class="service-img-container new-request-container single-container"
            >
              <img class="service-img-new" src="../../assets/images/unsuccessful_batches.png" />
              <div style="clear:both;"></div>
              <p>Unsuccessful Sale</p>
            </div>
          </div>-->
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
import Vue from "vue";
import VueBreadcrumbs from "vue-2-breadcrumbs";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

Vue.use(VueBreadcrumbs);
export default {
  name: "lsp-dashboard",
  data: function() {
    return {
      isMasterSuperUser: false,
      userName: "",
      titleHeaderText: "",
      isTechSpoc:false
    };
  },
  components: {
    Header,
    Footer,
  },
  mounted() {
    if (getConfigVars().USERID == isAuthenticated()) {
      this.titleHeaderText = "Technology Service Provider";
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t(
            "Technology Service Provider-Dashboard",
            "Technology Service Provider-Dashboard"
          ),
          href: "/sa-dashboard",
        },
      ]);
      this.isTechSpoc = true;
    } else {
      this.titleHeaderText = "Root Authority";
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
          href: "/sa-dashboard",
        },
      ]);
      this.isTechSpoc = false;
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    if (localStorage.systemRole.includes(99)) {
      this.isMasterSuperUser = true;
    } else {
      this.isMasterSuperUser = false;
    }
    // this.getBreadcrumb({"/sa-dasboard",""})
    // this.$root.$emit("/sa-dashboard");
  },
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
    showLSPSPOCDashboard() {
      localStorage.prevPage = "sa-dashboard";
      Router.push("lsp-dashboard");
    },
    showAuditorPage() {
      localStorage.prevPage = "sa-dashboard";
      Router.push("auditor");
    },
    showApproveRejectProposedProducer() {
      localStorage.prevPage = "sa-dashboard";
      Router.push("approve-reject-proposed-producer");
    },
    showUnsuccessfulSale: function(event) {
      localStorage.prevPage = "sa-dashboard";
      Router.push("view-unsuccessful-sale");
    },
    showPaymentReporting: function(event) {
      localStorage.prevPage = "sa-dashboard";
      Router.push("payment-reporting");
    },
    showObserverMciDashboard: function() {
      localStorage.prevPage = "sa-dashboard";
      Router.push("observer-mci-dashboard");
    },
    showManageUsers: function(event) {
      Router.push("manage-users");
    },
    showPreviousRequest: function(event) {
      Router.push("previous-service-requests");
    },
    showManagePackhouse: function(event) {
      Router.push("manage-packhouses");
    },
    showManageCollectionPoints: () => Router.push("manage-collection-points"),
    showSAEDashboard: function() {
      Router.push("dashboard");
    },
    showLSPDashboard: function() {
      Router.push("pack-house-incharge-dashboard");
    },
    showBrokerDashboard: function() {
      Router.push("broker-dashboard");
    },
    showCollectorScreen: function() {
      Router.push("collector-dashboard");
    },
    showTPADashboard: function() {
      Router.push("tpa-dashboard");
    },
    showObserverDashboard: function() {
      Router.push("observer-dashboard");
    },
    showManageNGOs: function() {
      Router.push("manage-ngos");
    },
    showManageBankAccounts: function() {
      Router.push("manage-bank-accounts");
    },
    showManageICGDistribution: function() {
      Router.push("manage-icg-distribution");
    },
    showManageProducts: function() {
      Router.push("manage-products");
    },
    showOpAdminDashboard: function() {
      Router.push("op-admin-dashboard");
    },
    showAdminDashboard: function() {
      Router.push("admin-dashboard");
    },
    showManageOrganizations: function() {
      Router.push("manage-organizations");
    },
    showManageFruits: function() {
      Router.push("manage-fruits");
    },
    // gotoDashboard: () => Router.push("sa-dashboard")
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      }
    },
  },
};
</script>
<style scoped>
.unsuccessfulsaleBox .service-img-container {
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
.approve-icon {
  width: 68px !important;
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
.service-container-sa .SAEicon {
  margin-top: 9px !important;
}
.service-img-sa {
  margin: 0px !important;
}
.topMagrin img {
  margin-top: 9px !important;
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
.margin-tp {
  margin-top: 10px;
}
.fullConatiner {
  width: 100% !important;
}
</style>
