<template>
  <div class="dashboard">
    <div class="container-bg"></div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-3"></div>
      <div class="col-md-6 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{ $t("Dashboard - Observer-MCI", "Dashboard - Observer-MCI") }}
          </h3>
        </div>
        <div class="main-container">
          <div class="service-container">
               <div v-on:click="showManageUsers" class="service-img-container new-request-container">
              <img class="service-img service-img-sa" src="../../assets/images/user_list.png" />
              <div style="clear:both;"></div>
              <p>{{$t('Manage Users', 'Manage Users')}}</p>
            </div>
          
            <div
              v-on:click="showManagePackhouse"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/packhouse.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Manage Packhouse", "Manage Packhouse") }}</p>
            </div>
            <div
              v-on:click="showManageCollectionPoints"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/collection_point.png"
              />
              <div style="clear: both"></div>
              <p>
                {{ $t("Manage Collection Points", "Manage Collection Points") }}
              </p>
            </div>
               <div @click="showManageNGOs" class="service-img-container new-request-container">
              <img class="service-img service-img-sa" src="../../assets/images/manage_ngo.png" />
              <div style="clear:both;"></div>
              <p>{{$t('Manage NGOs', 'Manage NGOs')}}</p>
            </div>
          </div>

                  <div class="service-container service-container-sa">
            <div
              @click="showManageBankAccounts"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage_bank_accts.png"
              />
              <div style="clear:both;"></div>
              <p>{{$t('Manage Bank Accounts', 'Manage Bank Accounts')}}</p>
            </div>
            <div
              @click="showManageICGDistribution"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage_bank_accts.png"
              />
              <div style="clear:both;"></div>
              <p>{{$t('Manage Harvest Planner Distribution', 'Manage Harvest Planner Distribution')}}</p>
            </div>
            <div @click="showManageProducts" class="service-img-container new-request-container">
              <img
                class="service-img service-img-sa"
                src="../../assets/images/manage-product.png"
              />
              <div style="clear:both;"></div>
              <p>{{$t('Manage Products', 'Manage Products')}}</p>
            </div>
             <div @click="showManageFruits" class="service-img-container new-request-container">
              <img class="service-img-new" src="../../assets/images/unsuccessful_batches.png" />
              <div style="clear:both;"></div>
              <p>{{$t('Manage Fruits', 'Manage Fruits')}}</p>
            </div>
          </div>

          <div class="service-container">
            <div
              v-on:click="showPaymentReporting"
              class="service-img-container-2-col new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/payment_report.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Payment Reporting", "Payment Reporting") }}</p>
            </div>
            <div
              v-on:click="showUnsuccessfulSale"
              class="service-img-container-2-col new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/unsuccessful_batches.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("Unsuccessful Sale", "Unsuccessful Sale") }}</p>
            </div>
              <div
              v-on:click="viewServiceRequest()"
              class="service-img-container new-request-container"
            >
              <img
                class="service-img"
                src="../../assets/images/sr_status.png"
              />
              <div style="clear: both"></div>
              <p>{{ $t("View Service Request", "View Service Request") }}</p>
            </div>
              <div @click="showApproveRejectProposedProducer" class="service-img-container new-request-container">
              <img
                class="service-img-new dashboard-icon-reporting"
                src="../../assets/images/payment_report.png"
              />
              <div style="clear:both;"></div>
              <p>{{$t('Approve/Reject Proposed Producer', 'Approve/Reject Proposed Producer')}}</p>
            </div>
          </div>
         
          <!-- <div v-on:click="showUnsuccessfulSale" class="product-container">
            <img class="service-img produce-img" src="../../assets/images/unsuccessful_batches.png" />
            <p>Unsuccessful Sale</p>
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
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import isAuthenticated from '../../shared/auth';

export default {
  name: "observer-mci-dashboard",
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
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
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
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
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
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
      ]);
    } else if (localStorage.systemRole == 13) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-Dashboard", "Observer-Dashboard"),
          href: "/observer-dashboard",
        },
      ]);
    } else if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
      ]);
    }

    this.userName = localStorage.userName;
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
  },
  methods: {
      showApproveRejectProposedProducer(){
      localStorage.prevPage = "sa-dashboard";
      Router.push("approve-reject-proposed-producer");
    },
      showManageNGOs: function() {
      Router.push("manage-ngos");
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
       showManageBankAccounts: function() {
      Router.push("manage-bank-accounts");
    },
    showManageICGDistribution: function() {
      Router.push("manage-icg-distribution");
    },
    showManageProducts: function() {
      Router.push("manage-products");
    },
     showManageFruits: function() {
      Router.push("manage-fruits");
    },
     showManageUsers: function(event) {
      Router.push("manage-users");
    },
    viewServiceRequest: function (event) {
      localStorage.prevPage = "observer-mci-dashboard";
      Router.push("view-service-requests");
    },
    showPaymentReporting: function (event) {
      localStorage.prevPage = "observer-mci-dashboard";
      Router.push("/payment-reporting");
    },
    showUnsuccessfulSale: function (event) {
      localStorage.prevPage = "observer-mci-dashboard";
      Router.push("view-unsuccessful-sale");
    },
    showPreviousRequest: function (event) {
      localStorage.prevPage = "observer-mci-dashboard";
      Router.push("previous-service-requests");
    },
    showManagePackhouse: function (event) {
      localStorage.prevPage = "observer-mci-dashboard";
      Router.push("manage-packhouses");
    },
    showManageCollectionPoints: function () {
      localStorage.prevPage = "observer-mci-dashboard";
      Router.push("manage-collection-points");
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
  width: 33%;
  float: left;
  /* margin: 10px; */
  height: 125px;
}
.service-img-container-2-col {
  width: 47%;
  float: left;
  margin: 10px;
  height: 125px;
}
.service-img {
  width: 65px;
  height: 65px;
  text-align: center;
  padding: 10px;
}
.service-container {
  display: inline-flex;
  width: 100%;
  padding-top: 35px;
  padding-bottom: 35px;
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
.service-img-new {
  width: 65px;
  height: auto;
  text-align: center;
  padding: 10px;
}

</style>
