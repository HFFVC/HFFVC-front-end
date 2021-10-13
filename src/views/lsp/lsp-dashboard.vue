<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h4 class="heading">{{ $t("Dashboard", "Dashboard") }} - LSP</h4>
        </div>
        <div class="main-container">
          <div class="service-container service-container-sa">
            <div
              v-on:click="showManageUsers"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/user_list.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Manage LSP Users", "Manage LSP Users") }}</p>
            </div>

            <div
              @click="showManagePackhouse"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/packhouse.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Manage Packhouses", "Manage Packhouses") }}</p>
            </div>

            <div
              v-on:click="showManageCollectionPoints"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/collection_point.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Manage Collection Points", "Manage Collection Points") }}
              </p>
            </div>

            <div
              v-on:click="showProducer"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/view_batches.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Propose Producer", "Propose Producer") }}</p>
            </div>
          </div>
          <!-- <div class="service-container">
            <div class="row">
                <div class="col-md-3">
                <div
                  v-on:click="showActiveRequest"
                  class="service-img-container new-request-container lsp-dashboard-container"
                >
                  <img
                    class="service-img"
                    src="../../assets/images/schedule_pickup.png"
                  />
                  <div style="clear: both"></div>
                  <p>{{ $t("Schedule Pickup", "Schedule Pickup") }}</p>
                </div>
              </div>
           
                 <div class="col-md-3">
                <div
                  v-on:click="showPreviousRequest"
                  class="service-img-container new-request-container lsp-dashboard-container"
                >
                  <img
                    class="service-img img-previous"
                    src="../../assets/images/history.png"
                  />
                  <div style="clear: both"></div>
                  <p>
                    {{ $t("View Previous Requests", "View Previous Requests") }}
                  </p>
                </div>
              </div>
               <div class="col-md-3">
                <div
                  v-on:click="showLotsatPackhouse"
                  class="service-img-container new-request-container lsp-dashboard-container"
                >
                  <img
                    class="service-img"
                    src="../../assets/images/packhouse.png"
                  />
                  <div style="clear: both"></div>
                  <p>{{ $t("Lots at Packhouse", "Lots at Packhouse") }}</p>
                </div>
              </div>
              <div class="col-md-3">
                <div
                  v-on:click="createBatch"
                  class="service-img-container new-request-container lsp-dashboard-container"
                >
                  <img
                    class="service-img"
                    src="../../assets/images/batch.png"
                  />
                  <div style="clear: both"></div>
                  <p>{{ $t("Create Batches", "Create Batches") }}</p>
                </div>
              </div>
             
         
          
                

            </div>
          </div> -->
          <div class="service-container service-container-sa">
            <!-- 
                   <div class="col-md-4">
                <div
                  v-on:click="showBatches"
                  class="service-img-container new-request-container lsp-dashboard-container"
                >
                  <img
                    class="service-img"
                    src="../../assets/images/view_batches.png"
                  />
                  <div style="clear: both"></div>
                  <p>{{ $t("View Batches", "View Batches") }}</p>
                </div>
              </div> -->

            <div
              @click="showCollectorScreen"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new"
                src="../../assets/images/user_dashboard-3.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Login as Collector", "Login as Collector") }}</p>
            </div>

            <div
              v-on:click="showSAEDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new SAEicon"
                src="../../assets/images/user_dashboard-1.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Login as Harvest Planner", "Login as Harvest Planner") }}
              </p>
            </div>

            <div
              v-on:click="showpackhouseDashboard"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new SAEicon"
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
            <div
              v-if="!isSuperUser"
              v-on:click="showLSPReport"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img-new report-icn"
                src="../../assets/images/payment_report.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Payment Report", "Payment Report") }}
              </p>
            </div>
          </div>
          <div
            v-if="isLSPSpoc"
            class="service-container service-container-sa padding-bottom-35"
          >
            <div
              v-on:click="goToOrganizationDetails"
              class="single-container new-request-container"
            >
              <img
                class="service-img-new report-icn"
                src="../../assets/images/organization_details.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Organization Details", "Organization Details") }}
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
import getConfigVars from "../../shared/config-env";
import isAuthenticated from "../../shared/auth";
export default {
  name: "lsp-dashboard",
  data: function () {
    return {
      userName: "",
      isSuperUser: false,
      isLSPSpoc: false,
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
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
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
            text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
            href: "/lsp-dashboard",
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
      ]);
    } else if (localStorage.systemRole == 96) {
      this.isLSPSpoc = true;
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
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
      ]);
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
  },
  methods: {
    showLSPReport() {
      Router.push("lsp-payment-history");
    },
    showManagePackhouse: function (event) {
      Router.push("manage-packhouses");
    },
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
    showCollectorScreen: function () {
      Router.push("collector-dashboard");
    },
    showManageUsers: function (event) {
      Router.push("add-manage-user");
    },
    showPickup: function () {
      Router.push("collector-dashboard");
    },
    showBatches: function () {
      Router.push("view-batches");
    },
    createBatch: function () {
      Router.push("create-batch");
    },
    showActiveRequest: function (event) {
      Router.push("active-service-requests");
    },
    showpackhouseDashboard() {
      Router.push("pack-house-incharge-dashboard");
    },
    showPreviousRequest: function (event) {
      Router.push("previous-service-requests");
    },
    showLotsatPackhouse: function (event) {
      Router.push("lots-at-packhouse");
    },
    showAddCollector: () => Router.push("add-collector"),
    showProducer() {
      Router.push("propose-producer");
    },
    showManageCollectionPoints() {
      Router.push("manage-collection-points");
    },
    showManageHarvestPlanner() {
      Router.push("manage-harvest-planner");
    },
    showPachouseIncharge() {
      Router.push("pack-house-incharge-dashboard");
    },
    showSAEDashboard: function () {
      Router.push("dashboard");
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else {
        Router.push("lsp-dashboard");
      }
    },
    goToOrganizationDetails() {
      Router.push("organization-details");
    },
  },
};
</script>
<style scoped>
.header-container {
  height: 50px !important;
}
</style>
<style>
.report-icn {
  width: 52px !important;
}
.full-container {
  width: 100% !important;
}
.service-container-sa .service-img {
  height: 65px;
}
.service-container-sa .SAEicon {
  margin-top: 9px !important;
}
.service-img-new {
  width: 65px;
  height: auto;
  text-align: center;
  padding: 10px;
}
.single-container {
  width: 100% !important;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.service-img-container {
  width: 50%;
  float: left;
  height: 125px;
}
@media screen and (max-width: 768px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
.img-previous {
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
.lsp-dashboard-container {
  width: 100% !important;
}
.lsp-dashboard-container .service-img {
  height: 65px !important;
}
.lsp-dashboard-container .img-previous {
  width: 48px !important;
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
.padding-bottom-35 {
  padding-bottom: 35px;
}
</style>
