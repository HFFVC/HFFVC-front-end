<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>

      <!-- right side container -->
      <div class="col-md-8 details-container">
        <div class="header-container">
          <h6 class="heading">
            {{ $t("Organization Details", "Organization Details") }}
          </h6>
          <div>
            <img
              @click="goToDashboard"
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
              <div>
                <h4 class="accnt-details-heading">
                  {{ $t("Organization Name", "Organization Name") }}
                </h4>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Name', 'Name')"
                    class="inp-details"
                    type="text"
                    v-model="name"
                    readonly
                  />
                </div>
                <h4 class="accnt-details-heading">
                  {{ $t("Contact Details", "Contact Details") }}
                </h4>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Country/Area Code', 'Country/Area Code')"
                    class="inp-details"
                    type="number"
                    v-model="countryCode"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="
                      $t(
                        'Contact No. Without Country/Area Code',
                        'Contact No. Without Country/Area Code'
                      )
                    "
                    class="inp-details"
                    type="number"
                    v-model="contactNumber"
                  />
                </div>

                <div class="inp-container">
                  <input
                    :placeholder="$t('Email Address', 'Email Address')"
                    class="inp-details"
                    type="text"
                    v-model="emailAddress"
                  />
                </div>
                <h4 class="accnt-details-heading">
                  {{ $t("Address", "Address") }}
                </h4>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Address', 'Address')"
                    class="inp-details"
                    type="text"
                    v-model="organizationAddress"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Zip Code', 'Zip Code')"
                    class="inp-details"
                    type="text"
                    v-model="zipCode"
                  />
                </div>

                <div class="inp-container">
                  <input
                    v-if="organizationType == 'Broker'"
                    :placeholder="$t('Broker Margin', 'Broker Margin')"
                    class="inp-details"
                    type="text"
                    v-model="brokerMargin"
                    readonly
                  />
                </div>

                <div class="inp-container">
                  <input
                    v-if="organizationType == 'Technology Service Provider'"
                    :placeholder="$t('% Distribution', '% Distribution')"
                    class="inp-details"
                    type="text"
                    v-model="percentDistribution"
                    readonly
                  />
                </div>
                <div class="inp-container">
                  <input
                    v-if="organizationType == 'Extension Services'"
                    :placeholder="$t('% Distribution', '% Distribution')"
                    class="inp-details"
                    type="text"
                    v-model="percentDistribution"
                    readonly
                  />
                </div>

                <h4 class="accnt-details-heading">
                  {{ $t("Account Details", "Account Details") }}
                </h4>
                <div class="inp-container">
                  <v-select
                    v-model="bankName"
                    :placeholder="$t('Bank Name', 'Bank Name')"
                    class="manage-bank-accountsv-select"
                    :options="banks"
                  ></v-select>
                </div>
                <div class="inp-container inp-half type-of-account-wrap">
                  <label>{{ $t("Type of Account", "Type of Account") }}</label>
                  <label class="larvae-wrap">
                    <input
                      class="larvae-input radio-btn"
                      v-model="typeOfAccount"
                      type="radio"
                      name="typeOfAccount"
                      value="Savings"
                    />
                    <img class="radio-btn-img larvae-rb-img" />
                    {{ $t("Savings", "Savings") }}
                  </label>
                  <label class="larvae-wrap">
                    <input
                      class="larvae-input radio-btn"
                      v-model="typeOfAccount"
                      type="radio"
                      name="typeOfAccount"
                      value="Current"
                    />
                    <img class="radio-btn-img larvae-rb-img" />
                    {{ $t("Current", "Current") }}
                  </label>
                </div>

                <div class="inp-container">
                  <input
                    :placeholder="$t('Account Number', 'Account Number')"
                    class="inp-details"
                    type="text"
                    v-model="accountNumber"
                  />
                </div>
                <h4 class="accnt-details-heading">
                  {{ $t("Identification Number", "Identification Number") }}
                </h4>
                <div class="inp-container">
                  <input
                    :placeholder="
                      $t('Identification Number', 'Identification Number')
                    "
                    class="inp-details"
                    type="text"
                    v-model="identificationNo"
                  />
                </div>
                <h4 class="accnt-details-heading">
                  {{ $t("Organization Currency", "Organization Currency") }}
                </h4>
                <div class="inp-container">
                  <v-select
                    v-model="organizationCurrency"
                    :placeholder="
                      $t('Organization Currency', 'Organization Currency')
                    "
                    class="manage-bank-accountsv-select"
                    :options="currencySource"
                  ></v-select>
                </div>
                <h4 class="accnt-details-heading">
                  {{ $t("Address", "Address") }}
                </h4>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Address', 'Address')"
                    class="inp-details"
                    type="text"
                    v-model="Address"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Town', 'Town')"
                    class="inp-details"
                    type="text"
                    v-model="Town"
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
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
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import axios from "axios";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import mailService from "../../shared/email.service";
import getConfigVars from "../../shared/config-env";
import VueLodash from "vue-lodash";
import $ from "jquery";
import isAuthenticated from "../../shared/auth";
Vue.use(VueLodash, { name: "_" });
export default {
  name: "organization-details",
  data: function () {
    return {
      seen: true,
      organizationsList: [],
      emptyContainer: true,
      userName: null,
      Address: null,
      Town: null,
      contactNumber: null,
      countryCode: null,
      name: null,
      id: null,
      organizationAddress: null,
      emailAddress: null,
      bankName: null,
      typeOfAccount: null,
      accountNumber: null,
      identificationNo: null,
      pageTitle: null,
      organizationCurrency: null,
      organizationSelected: false,
      snapshotKey: null,
      currencySource: ["USD", "HTG"],
      editFlag: false,
      banks: [],
      banksWithCode: [],
      bankCode: null,
      spocFirstName: "",
      spocLastName: "",
      spocEmail: "",
      spocContactNo: "",
      spocAddress: "",
      isDisabled: false,
      organizationType: null,
      organizationTypeList: [
        "Logistic / Cold Chain Service Provider",
        "Financial Services",
        "Broker",
        // "Extension Services",
        "Technology Service Provider",
        "Auditor",
        "Root Authority",
      ],
      brokerOrg: false,
      brokerMargin: null,
      organizationToDelete: null,
      searchEnabled: false,
      searchTerm: null,
      searchResults: [],
      closeSearch: false,
      isMasterSuperUser: false,
      zipCode: null,
      percentDistribution: null,
      mangoPercent: null,
      avocadoPercent: null,
      pineapplePercent: null,
      filteredOrganizationType: null,
      escrowAccountNumber: null,
      distributionFruit: null,
      fruitsList: [],
      percentageDistribution: null,
      existingDistributions: [],
      addDistributionButtonTitle: this.$t(
        "Add Distribution",
        "Add Distribution"
      ),
      productEscrowAcNo: null,
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
    if (localStorage.systemRole == 96) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Organization Details", "Organization Details"),
          href: "/new-request",
        },
      ]);
    } else if (localStorage.systemRole == 97) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Broker SPOC-Dashboard", "Broker SPOC-Dashboard"),
          href: "/broker-dashboard",
        },

        {
          text: this.$t("Organization Details", "Organization Details"),
        },
      ]);
    }
    const vm = this;
    vm.seen = true;
    firebase
      .database()
      .ref()
      .child("masters")
      .child("organization")
      .child(localStorage.organizationKey)
      .on("value", (snapshot) => {
        console.log(snapshot.val());
        vm.seen = false;
        vm.Address = snapshot.val().Address;
        vm.Town = snapshot.val().Town;
        vm.accountNumber = snapshot.val().accountNumber;
        vm.identificationNo = snapshot.val().identificationNo;
        vm.emailAddress = snapshot.val().emailAddress;
        vm.organizationCurrency = snapshot.val().organizationCurrency;
        vm.bankName = snapshot.val().bankName;
        vm.contactNumber = snapshot.val().contactNumber;
        vm.countryCode = snapshot.val().countryCode;
        vm.name = snapshot.val().name;
        vm.typeOfAccount = snapshot.val().typeOfAccount;
        vm.emailAddress = snapshot.val().emailAddress;
        vm.organizationAddress = snapshot.val().organizationAddress;
        vm.snapshotKey = snapshot.key;
        vm.spocAddress = snapshot.val().spocAddress;
        vm.spocFirstName = snapshot.val().spocFirstName;
        vm.spocLastName = snapshot.val().spocLastName;
        vm.spocEmail = snapshot.val().spocEmail;
        vm.spocAddress = snapshot.val().spocAddress;
        vm.spocContactNo = snapshot.val().spocContactNo;
        vm.organizationType = snapshot.val().organizationType;
        vm.zipCode = snapshot.val().zipCode;
        vm.brokerMargin = snapshot.val().brokerMargin;
      });
  },
  methods: {
    goToDashboard() {
      if (localStorage.systemRole == 96) {
        Router.push("lsp-dashboard");
      } else if (localStorage.systemRole == 97) {
        Router.push("broker-dashboard");
      }
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

.manage-packhouses-ps {
  min-height: 383px !important;
  max-height: 383px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.set-margin {
  margin-top: 40px !important;
  position: relative;
}
.search-container-org {
  width: 100%;
}
.seacrch-container-org-label {
  width: 30%;
  float: left;
  text-align: left;
}
.seacrch-container-org-label span {
  color: #fff !important;
}
.seacrch-container-org-searchbox {
  width: 65%;
  float: left;
}
.filter-lbl-container {
  width: 30%;
  float: left;
  text-align: left;
}
.filter-select-container {
  width: 65%;
  float: left;
}
.filter-container {
  float: left;
  width: 100%;
}
.filter-container label {
  color: #fff;
  margin-top: 10px;
  margin-left: 10px;
}
.mrg-top {
  height: 50px;
}
.new-org-header {
  height: 130px !important;
}
.lbl-percent {
  color: #fff;
  float: left;
  display: inline-block;
  width: 20%;
  text-align: left;
}
.inp-distribution {
  width: 80% !important;
  float: left;
}
.manage-users-txt-search {
  float: left;
  background: none;
  border: none;
  border-bottom: 0.5px solid #fff;
  width: auto;
  padding-left: 20px;
  margin-right: -30px;
  z-index: 999 !important;
  position: relative;
  color: #fff;
  width: 95%;
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
  padding-bottom: 10px;
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
  margin-top: -25px !important;
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
.half-input {
  width: 40%;
  float: left;
  display: inline;
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
.delete-option {
  outline: none;
  border: none;
  background: transparent;
  color: white;
  margin-right: 20px;
  float: right;
  position: absolute;
  right: 25px;
  top: 25px;
  font-size: 17px;
}
#confirm-delete-modal .modal-header {
  height: 50px !important;
}
#confirm-delete-modal .modal-header .close {
  margin-top: -20px !important;
}
#confirm-delete-modal .modal-header h5 {
  margin: -5px auto !important;
}
#confirm-delete-modal .modal-content {
  width: 400px;
  margin: 0 auto;
  color: #fff;
}
.white-fonts {
  color: #fff;
}
.margin-top-15 {
  margin-top: 15px !important;
}
.edit-delete-img {
  width: 15px;
  height: auto;
  cursor: pointer;
  margin: 5px;
}
</style>
