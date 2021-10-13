<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">
            {{
              $t(
                "Harvest Planner Distributions",
                "Harvest Planner Distributions"
              )
            }}
          </h6>
        </div>

        <div class="main-container-manage-packhouses">
          <div class="emptyContainer" v-if="icgDistributionList.length == 0">
            <h2 class="card-inside-description">
              {{ $t("No data to display", "No data to display") }}
            </h2>
          </div>
          <perfect-scrollbar class="manage-packhouses-ps">
            <div class="card-body">
              <div
                class="outer-container"
                v-for="icgDistribution in icgDistributionList"
                :key="icgDistribution.snapshotKey"
              >
                <div class="photo-container photo-container-icg">
                  <img
                    src="../../assets/images/manage_bank_accts.png"
                    alt="User Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname lbl-pickup">
                    <b
                      >{{
                        $t(
                          "Percentage Distribution",
                          "Percentage Distribution"
                        )
                      }}:</b
                    >
                    <b>{{ icgDistribution.percentageDistribution }}</b>
                    <input
                      type="radio"
                      @click="editicgDistributionDetails(icgDistribution)"
                      :checked="icgDistribution.snapshotKey == snapshotKey"
                    />
                    <img />
                  </label>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container">
          <input
            :disabled="icgDistributionList.length > 0"
            type="button"
            class="btn-save sa-packhouse-btn"
            :value="
              $t(
                'Create New Harvest Planner Distribution',
                'Create New Harvest Planner Distribution'
              )
            "
            @click="createNewicgDistribution()"
          />
        </div>
      </div>

      <!-- right side container -->
      <div class="col-md-7 details-container">
        <div class="header-container">
          <h6 class="heading">{{ $t(pageTitle, pageTitle) }}</h6>
          <div>
            <img
              @click="showDashboard"
              class="close-details"
              src="../../assets/images/close.png"
            />
          </div>
        </div>

        <div
          class="main-container-manage-packhouses manage-bank-accounts-main-container"
        >
          <perfect-scrollbar>
            <div class="card-body manage-packhouses-field-wrap">
              <div class="emptyContainer" v-if="!icgDistributionSelected">
                <h2 class="card-inside-description">
                  {{ $t("No data to display", "No data to display") }}
                </h2>
              </div>

              <div v-if="icgDistributionSelected">
                <div class="inp-container">
                  <input
                    :placeholder="
                      $t('Percentage Distribution', 'Percentage Distribution')
                    "
                    class="inp-details"
                    type="text"
                    v-model="percentageDistribution"
                  />
                </div>
                <div class="inp-container" v-if="isSuperUser">
                  <div class="function-dropdown">
                    <v-select
                      id="dropdownlist"
                      v-model="organizationSelected"
                      :placeholder="$t('Organization', 'Organization')"
                      class="manage-users-v-select rolesel"
                      :options="organizationList"
                      label="name"
                    ></v-select>
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="icgDistributionSelected">
          <input
            type="button"
            @click="clearAll()"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            class="btn-save"
            :value="$t('Save', 'Save')"
            @click="saveicgDistribution"
          />
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
import moment from "moment";
import "../../assets/css/producer-list.css";
import "../../assets/css/planned-pickup.css";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import BootstrapVue from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(DropDownListPlugin);
import Datetime from "vue-datetime";
import { PerfectScrollbar } from "vue2-perfect-scrollbar";
import "vue-datetime/dist/vue-datetime.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
Vue.use(VueToast);

Vue.use(Datetime);
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import isAuthenticated from '../../shared/auth';

export default {
  name: "manage-packhouses",
  data: function () {
    return {
      seen: true,
      icgDistributionList: [],
      emptyContainer: true,
      userName: null,
      snapshotKey: null,
      editFlag: false,
      percentageDistribution: null,
      pageTitle: null,
      icgDistributionSelected: null,
      isSuperUser: false,
      organizationSelected: null,
      organizationList: [],
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
    if (
      localStorage.systemRole == 99 &&
      isAuthenticated() == localStorage.organizationKey
    ) {
      this.isSuperUser = true;
    }
    this.getOrganizationList();
    if (localStorage.systemRole == 99) {
       if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {
          
         text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t(
            "Manage Harvest Planner Distribution",
            "Manage Harvest Planner Distribution"
          ),
          href: "/manage-icg-distribution",
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
          text: this.$t(
            "Manage Harvest Planner Distribution",
            "Manage Harvest Planner Distribution"
          ),
          href: "/manage-icg-distribution",
        },
      ]);
      }
    } else if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t(
            "Manage Harvest Planner Distribution",
            "Manage Harvest Planner Distribution"
          ),
          href: "/manage-icg-distribution",
        },
      ]);
    }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t(
      "Harvest Planner Distribution Details",
      "Harvest Planner Distribution Details"
    );
    this.loadicgDistributionDetails();
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
    showDashboard: () => Router.push("sa-dashboard"),
    loadicgDistributionDetails: function () {
      let vm = this;
      this.icgDistributionList = [];
      vm.seen = true;
      let ref = null;
      if (vm.isSuperUser) {
        ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("icgDistribution");
      } else {
        ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("icgDistribution")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
      }

      ref.on("child_added", function (requestData) {
        console.log(requestData.val());
        var data = {
          percentageDistribution: requestData.val().percentageDistribution,
          snapshotKey: requestData.key,
          organization: requestData.val().organization,
          organizationKey: requestData.val().organizationKey,
        };
        vm.icgDistributionList.push(data);

        vm.seen = false;
      });
      setTimeout(function () {
        if (vm.icgDistributionList.length == 0) {
          vm.seen = false;
        }
      }, 3000);
    },
    createNewicgDistribution: function () {
      this.snapshotKey = null;
      this.percentageDistribution = null;
      this.icgDistributionSelected = true;
      this.pageTitle = this.$t(
        "Harvest Planner Distribution Details",
        "Harvest Planner Distribution Details"
      );
      this.editFlag = false;
    },
    editicgDistributionDetails: function ({
      percentageDistribution,
      snapshotKey,
    }) {
      this.editFlag = true;
      this.icgDistributionSelected = true;
      this.percentageDistribution = percentageDistribution;
      this.snapshotKey = snapshotKey;
    },
    saveicgDistribution: function () {
      var errorFlag = false;
      var currentSnapshotKey = null;
      const vm = this;
      this.seen = true;
      if (!this.editFlag) {
        const { percentageDistribution } = this;
        const data = {
          percentageDistribution,
        };
        if (vm.isSuperUser) {
          data.organization = vm.organizationSelected.name;
          data.organizationKey = vm.organizationSelected.orgKey;
        } else {
          data.organization = localStorage.organization;
          data.organizationKey = localStorage.organizationKey;
        }

        if (
          this.percentageDistribution &&
          this.percentageDistribution != null
        ) {
          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("icgDistribution")
            .push(data)
            .then((snapshot) => {
              vm.addMapping(snapshot.key, data.organizationKey);
              this.icgDistributionSelected = false;
              Vue.$toast.open({
                message: vm.$t(
                  "New Harvest Planner distribution details has been added.",
                  "New Harvest Planner distribution details has been added."
                ),
                type: "success",
                position: "top",
              });
              this.loadicgDistributionDetails();
              this.seen = false;
            });
        } else {
          Vue.$toast.open({
            message: vm.$t(
              "Please fill out the field.",
              "Please fill out the field."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      } else if (this.editFlag) {
        var dataToInsert = {
          percentageDistribution: this.percentageDistribution,
        };
        if (vm.isSuperUser) {
          dataToInsert.organization = vm.organizationSelected.name;
          dataToInsert.organizationKey = vm.organizationSelected.orgKey;
        } else {
          dataToInsert.organization = localStorage.organization;
          dataToInsert.organizationKey = localStorage.organizationKey;
        }
        if (
          dataToInsert.percentageDistribution &&
          dataToInsert.percentageDistribution != null
        ) {
          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("icgDistribution")
            .child(this.snapshotKey)
            .update(dataToInsert)
            .then(
              () => {
                vm.addMapping(this.snapshotKey, dataToInsert.organizationKey);
                Vue.$toast.open({
                  message: vm.$t(
                    "Harvest Planner Distribution details updated.",
                    "Harvest Planner Distribution details updated."
                  ),
                  type: "success",
                  position: "top",
                });
                this.loadicgDistributionDetails();
                this.seen = false;
              },
              () => {
                Vue.$toast.open({
                  message: vm.$t(
                    "Failed to update Harvest Planner Distribution details.",
                    "Failed to update Harvest Planner Distribution details."
                  ),
                  type: "error",
                  position: "top",
                });
                this.seen = false;
              }
            );
        } else {
          Vue.$toast.open({
            message: vm.$t(
              "Please fill out the field.",
              "Please fill out the field."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      }
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.icgDistributionSelected = false;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      }
    },
    getOrganizationList() {
      const vm = this;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization");
      this.organizationList = [];
      ref.on("value", (snapshot) => {
        snapshot.forEach((requestData) => {
          if (requestData.val().status != "Disabled") {
            vm.organizationList.push({
              name: requestData.val().name,
              orgKey: requestData.key,
            });
          }
          //  vm.mappedOrganization[requestData.val().name] = requestData.key;
        });
      });
      console.log(vm.mappedOrganization);
    },
    addMapping(profileKey, organizationKey) {
      let dataToUpdate = {};
      dataToUpdate[profileKey] = profileKey;
      firebase
        .database()
        .ref()
        .child("OrganizationUserMapping")
        .child(organizationKey)
        .update(dataToUpdate)
        .then((updated) => {
          console.log(updated);
          console.log("mapping added");
        });
    },
  },
};
</script>
<style scoped>
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.header-container {
  height: 50px;
}
.close-details {
  margin-top: -16px !important;
}
.manage-packhouses-ps {
  min-height: 383px !important;
  max-height: 383px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.sa-packhouse-btn {
  width: auto !important;
}
.manage-packhouses-ps {
  height: 400px;
  overflow-x: hidden !important;
}
.ps__rail-x {
  display: none !important;
}
.addition-note {
  background-color: transparent;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 95%;
  margin: 15px;
  color: #fff !important;
}
.small-input {
  background: none !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  width: 100px;
  margin: 15px;
  color: #fff !important;
}
.modal-input {
  background-color: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  float: left;
  margin: 15px;
  width: 96%;
}
.button-container {
  float: right;
  margin: 10px 0px 10px 10px;
  position: relative;
  bottom: 0px;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  min-width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-reject {
  background-color: #c55a11;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 12px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
label > input {
  visibility: hidden;
}
.close-img {
  width: 13px !important;
  margin-top: -10px !important;
}

.lbl-pickup > img {
  float: right;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}

.lbl-pickup-sa > img {
  float: left;
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.photo-container {
  margin-top: 22px !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}

.card-inside-description {
  font-weight: 400 !important;
  font-size: 32px;
  color: #fff !important;
  margin-top: 60px;
}
.outer-container {
  width: 100%;
  margin: 0px !important;
  padding: 0px !important;
  padding-top: 10px !important;
}
.description-container {
  margin-left: 30px;
}
.former-picture {
  width: 65px;
}
.lbl-pickup {
  display: block;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: 59px !important;
  margin: 5px 0px 3px 0px !important;
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
  margin: 10px 10px 30px 10px;
}
p {
  color: #fff;
  text-align: center;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
  height: 125px;
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
}
.inp-container {
  margin: 0px 0px 0px 0px;
  font-size: 13px;
  width: 100%;
  margin-bottom: 20px;
}
.heading {
  color: #fff;
  text-align: center;
  margin: auto;
  font-size: 14px !important;
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
  background: rgba(0, 0, 0, 0.616);
  border-radius: 5px 5px 0px 0px;
  border: 1px solid #000;
}
.main-container-manage-packhouses {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
  height: 400px;
  overflow-y: hidden;
  overflow-x: hidden;
}
.sign-up-form-container {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px 10px 10px 10px;
}
.details-container {
  margin: auto;
  margin-top: 35px;
  margin-bottom: 35px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
  font-size: 13px;
}
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-input-group.e-control-wrapper:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-icon-left),
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap,
.e-float-input.e-control-wrapper.e-float-icon-left:not(.e-success):not(.e-warning):not(.e-error)
  .e-input-in-wrap {
  border-color: #fff !important;
}
.additional-modal-note {
  float: left;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 22px;
  background-size: 15px 15px;
  width: 100%;
}
.inp-details {
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
}
.inp-packhouse-name {
  background-image: url("../../assets/images/packhouse.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-town {
  background-image: url("../../assets/images/row_houses.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-contact {
  background-image: url("../../assets/images/landline.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-address {
  background-image: url("../../assets/images/address_signboard.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-truck {
  background-image: url("../../assets/images/truck_front_facing.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-additional-notes {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-email {
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.email-container {
  padding: 0px;
  margin: -20px;
}
.grant-privilage-container {
  padding-top: 5px;
  margin-left: 35px;
}
.close-details {
  height: 16px;
  float: right;
  margin-top: -15px;
  cursor: pointer;
}
.manage-packhouses-ps {
  min-height: 340px;
  max-height: 340px;
  overflow: hidden;
}
.manage-packhouses-left-container {
  min-height: 350px;
  max-height: 350px;
  overflow-y: hidden;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
}
.manage-packhouses-field-wrap {
  margin: 10px 25px;
}
.sa-packhouse-btn {
  width: 160px;
}
.manage-bank-accountsv-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.manage-bank-accountsv-select {
  font-size: 13px;
}
.manage-bank-accountsv-select span,
.manage-bank-accountsv-select input,
.manage-bank-accountsv-select .vs__no-options {
  color: #fff;
}
.manage-bank-accountsv-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.manage-bank-accountsv-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.manage-bank-accountsv-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.manage-bank-accountsv-select .vs__dropdown-option--highlight {
  background: #000;
}
.manage-bank-accountsv-select .vs__open-indicator,
.manage-bank-accountsv-select .vs__clear {
  fill: #fff;
}
.manage-bank-accountsv-select .vs__selected-options,
.manage-bank-accountsv-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.manage-bank-accountsv-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.manage-bank-accountsv-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.manage-bank-accountsv-select .vs__clear {
  margin-top: -10px;
}
.manage-bank-accountsv-select .vs__open-indicator {
  margin-top: -5px;
}
.v-select-wrap {
  margin: 10px;
}
.accnt-details-heading {
  color: #fff;
  text-align: left;
  margin: 20px 0px;
}
.type-of-account-wrap .radio-btn {
  visibility: hidden;
}
.type-of-account-wrap .radio-btn-img {
  display: inline-block;
  padding: 0px;
  height: 15px;
  width: 15px;
  background: none;
}
.type-of-account-wrap .radiobtn-wrap > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 11px 11px;
}
.type-of-account-wrap .description-container {
  width: 70%;
}
.type-of-account-wrap .radiobtn-wrap {
  float: right;
}
.type-of-account-wrap .larvae-wrap {
  width: 30%;
  padding: 10px 0px 10px 0px;
  color: #fff;
  float: left;
}
.type-of-account-wrap .larvae-rb-img {
  background-color: #fff;
  border-radius: 29px;
  width: 18px;
  height: 18px;
  margin-bottom: 3px;
}
.type-of-account-wrap .larvae-wrap > input:checked + img {
  background: url("../../assets/images/black-circle.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 12px 12px;
  background-color: #fff;
}
.type-of-account-wrap label {
  float: left;
  color: #fff;
  padding-top: 10px;
}
.type-of-account-wrap {
  margin-bottom: 0px;
}
.manage-bank-accounts-main-container .inp-details {
  padding: 0px 0px 10px 0px;
}
.manage-bank-accounts-main-container .vs__selected-options {
  padding-bottom: 8px;
}

.manage-users-v-select .vs__dropdown-toggle {
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  margin: 15px 0px 0px 0px !important;
}
.manage-users-v-select {
  font-size: 13px;
}
.manage-users-v-select span,
.manage-users-v-select input,
.manage-users-v-select .vs__no-options {
  color: #fff;
}
.manage-users-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.manage-users-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.manage-users-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.manage-users-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.manage-users-v-select .vs__open-indicator,
.manage-users-v-select .vs__clear {
  fill: #fff;
}
.manage-users-v-select .vs__selected-options,
.manage-users-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.manage-users-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 15px 0px;
}
.manage-users-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.manage-users-v-select .vs__clear {
  margin-top: -10px;
}
.manage-users-v-select .vs__open-indicator {
  margin-top: -5px;
}
.manage-users-v-select {
  margin-bottom: 15px;
}
.manage-users-field-wrap {
  /* margin: 10px 25px; */
  margin: 17px 25px;
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
  }
}
</style>
