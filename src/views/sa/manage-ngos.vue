<template>
  <div class="manage-ngos">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">{{ $t("NGOs", "NGOs") }}</h6>
        </div>
        <div class="main-container-manage-ngos">
          <perfect-scrollbar class="manage-ngos-ps">
            <div class="card-body">
              <div
                class="outer-container"
                v-for="ngo in ngoList"
                :key="ngo.snapshotKey"
              >
                <div class="photo-container ngo-photo-container">
                  <img
                    src="../../assets/images/manage_ngo.png"
                    alt="User Picture"
                    class="former-picture"
                    ngo.splitAddress
                  />
                </div>
                <div class="description-container ngo-description">
                  <label class="lbl-flname lbl-pickup">
                    <p>
                      <b>{{ ngo.title }}</b>
                    </p>
                    <p>{{ ngo.identification }}</p>
                    <p>{{ ngo.accountNumber }}</p>
                    <p>{{ ngo.contactNumber }}</p>
                    <input
                      type="radio"
                      @click="editNGODetails(ngo)"
                      :checked="ngo.snapshotKey == snapshotKey"
                    />
                    <img />
                  </label>
                  <!--                   
                  <label
                    class="lbl-flname lbl-pickup"
                    v-for="line of ngo.splitAddress"
                    :key="line"
                  >{{ line }}</label>-->
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container">
          <input
            type="button"
            class="btn-save sa-ngo-btn"
            :value="$t('Create New NGO', 'Create New NGO')"
            @click="createNewNGO"
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

        <div class="main-container-manage-ngos">
          <perfect-scrollbar>
            <div class="card-body manage-ngo-field-wrap">
              <div class="emptyContainer" v-if="!ngoSelected">
                <h2 class="card-inside-description">
                  {{ $t("Select a NGO to Edit", "Select a NGO to Edit") }}
                </h2>
              </div>

              <div v-if="ngoSelected">
                <div class="inp-container">
                  <input
                    :placeholder="$t('NGO Name', 'NGO Name')"
                    class="inp-details inp-ngo-name"
                    type="text"
                    v-model="title"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="
                      $t('Identification Number', 'Identification Number')
                    "
                    class="inp-details inp-identification"
                    type="text"
                    v-model="identification"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Account Owner', 'Account Owner')"
                    class="inp-details inp-account"
                    type="text"
                    v-model="accountOwner"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Contact Number', 'Contact Number')"
                    class="inp-details inp-contact"
                    type="number"
                    v-model="contactNumber"
                  />
                </div>
                <h4 class="accHeading">
                  <b>{{ $t("Account Details", "Account Details") }}</b>
                </h4>
                <div class="inp-container">
                  <div class="bank-dropdown">
                    <v-select
                      v-model="selectedBank"
                      :placeholder="$t('Select Bank *', 'Select Bank *')"
                      class="planned-pickup-v-select bank-planned-pickup bank-name-input"
                      :options="banks"
                    ></v-select>
                  </div>
                </div>
                <div class="payament-method-container">
                  <label>{{ $t("Type of Account", "Type of Account") }}</label>
                  <div class="radioGroup">
                    <input
                      name="accounttype"
                      v-on:change="selectedAccountType(0)"
                      type="radio"
                      :checked="accounttype == 'Savings'"
                    />{{ $t("Savings", "Savings") }}
                    <input
                      name="accounttype"
                      v-on:change="selectedAccountType(1)"
                      type="radio"
                      :checked="accounttype == 'Current'"
                    />{{ $t("Current", "Current") }}
                    <!-- <input
                      name="accounttype"
                      v-on:change="selectedAccountType(2)"
                      type="radio"
                    />Cash-->
                  </div>
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Account Number', 'Account Number')"
                    class="inp-details inp-accNumber"
                    type="number"
                    v-model="accountNumber"
                  />
                </div>
                <div class="inp-container ngo-currency-container">
                  <v-select
                    v-model="bankaccountCurrency"
                    :placeholder="$t('Select currency', 'Select currency')"
                    class="planned-pickup-v-select v-select currency-planned-pickup"
                    :options="currencySource"
                  ></v-select>
                  <!-- <input
                    placeholder="Bank Account Currency"
                    class="inp-details inp-account-currency"
                    type="text"
                    v-model="bankaccountCurrency"
                  />-->
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('% Distribution', '% Distribution')"
                    class="inp-details inp-accNumber"
                    type="number"
                    v-model="percentageDistribution"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Address', 'Address')"
                    class="inp-details inp-address"
                    type="text"
                    v-model="Address"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Town', 'Town')"
                    class="inp-details inp-town"
                    type="text"
                    v-model="town"
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="ngoSelected">
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
            @click="saveNGO"
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
import Header from "../../components/header-view";

Vue.use(Datetime);
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Footer from "../../components/footer-view";
import isAuthenticated from '../../shared/auth';

export default {
  name: "manage-ngos",
  data: function () {
    return {
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      userName: null,
      packhouseList: [],
      Address: null,
      contactNumber: null,
      id: null,
      title: null,
      identification: null,
      accountOwner: null,
      accountNumber: null,
      pageTitle: null,
      ngoSelected: false,
      snapshotKey: null,
      bankaccountCurrency: null,
      banks: [],
      selectedBank: null,
      selectedBankCode: "",
      bankaccountcurrency: "HTG",
      currencySource: ["USD", "HTG"],
      ngoList: [],
      banksWithCode: [],
      town: null,
      percentageDistribution: null,
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
     if (localStorage.systemRole == 99) {
        if(getConfigVars().USERID == isAuthenticated())
      {
    this.$refs.headercomp.createBreadcrumb([
      {   text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"), href: "/sa-dashboard" },
      { text: this.$t("Manage NGOs", "Manage NGOs"), href: "/manage-ngos" },
    ]);
      }
      else
      {
        this.$refs.headercomp.createBreadcrumb([
      {   text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"), href: "/sa-dashboard" },
      { text: this.$t("Manage NGOs", "Manage NGOs"), href: "/manage-ngos" },
    ]);
      }
     }
      else if(localStorage.systemRole == 10)
     {
        this.$refs.headercomp.createBreadcrumb([
     
        { text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"), href: "/observer-mci-dashboard" },
      { text: this.$t("Manage NGOs", "Manage NGOs"), href: "/manage-ngos" },
    ]);
     }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t("NGO Details", "NGO Details");
    this.loadNGOs();
    this.getBankList();
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
    loadNGOs: function () {
      let vm = this;
      this.ngoList = [];
      vm.seen = true;
      const ref = firebase.database().ref().child("masters").child("ngos");

      ref.on("child_added", function (requestData) {
        const { Address } = requestData.val();
        let splitAddress = Address.split(",");
        const data = {
          ...requestData.val(),
          splitAddress,
          snapshotKey: requestData.key,
        };
        vm.ngoList.push(data);

        vm.seen = false;
      });
      setTimeout(function () {
        if (vm.ngoList.length == 0) {
          vm.seen = false;
        }
      }, 3000);
    },
    createNewNGO: function () {
      this.snapshotKey = null;
      this.ngoSelected = true;
      this.pageTitle = this.$t("New NGO Details", "New NGO Details");
      this.title = "";
      this.identification = "";
      this.Address = "";
      this.contactNumber = "";
      this.accountOwner = "";
      this.bankaccountCurrency = "";
      this.accounttype = "";
      this.accountNumber = "";
      this.selectedBank = "";
      this.town = "";
      this.percentageDistribution = "";
    },
    editNGODetails: function ({
      Address,
      splitAddress,
      contactNumber,
      title,
      identification,
      accountOwner,
      accounttype,
      bankaccountCurrency,
      accountNumber,
      selectedBank,
      snapshotKey,
      town,
      percentageDistribution,
    }) {
      this.pageTitle = this.$t("Edit NGO Details", "Edit NGO Details");
      this.ngoSelected = true;
      this.title = title;
      this.identification = identification;
      this.Address = Address;
      // this.town = splitAddress[splitAddress.length - 1];
      // this.Address = (function() {
      //   let formattedAddress = "";
      //   for (let i = 0; i < splitAddress.length - 1; i++) {
      //     formattedAddress += `${splitAddress[i]}, `;
      //   }
      //   return formattedAddress;
      // })();
      this.percentageDistribution = percentageDistribution;
      this.town = town;
      this.contactNumber = contactNumber;
      this.accountOwner = accountOwner;
      this.accounttype = accounttype;
      (this.bankaccountCurrency = bankaccountCurrency),
        (this.accountNumber = accountNumber),
        (this.selectedBank = selectedBank),
        (this.snapshotKey = snapshotKey);
    },
    saveNGO: function () {
      this.seen = true;
      const vm = this;
      if (this.pageTitle == this.$t("New NGO Details", "New NGO Details")) {
        var selectedBankCode = null;
        for (var i = 0; i < this.banksWithCode.length; i++) {
          if (this.banksWithCode[i].Name == this.selectedBank) {
            selectedBankCode = this.banksWithCode[i].Code;
          }
        }
        const {
          Address,
          accountNumber,
          identification,
          accountOwner,
          contactNumber,
          selectedBank,
          accounttype,
          town,
          bankaccountCurrency,
          title,
          percentageDistribution,
        } = this;

        const data = {
          // Address: `${Address}, ${town}`,
          Address,
          accountNumber,
          identification,
          accountOwner,
          contactNumber,
          selectedBank,
          selectedBankCode,
          accounttype,
          town,
          bankaccountCurrency,
          title,
          percentageDistribution,
        };
        if (
          Address &&
          contactNumber &&
          accountNumber &&
          identification &&
          title
        ) {
          // const pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
          // if (pattern.test(emailAddress)) {

          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("ngos")
            .push(data)
            .then(
              () => {
                this.ngoSelected = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "New NGO has been added.",
                    "New NGO has been added."
                  ),
                  type: "success",
                  position: "top",
                });
                this.loadNGOs();
                this.seen = false;
              },
              () => {
                this.ngoSelected = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Error adding new NGO.",
                    "Error adding new NGO."
                  ),
                  type: "error",
                  position: "top",
                });
                this.seen = false;
              }
            );
          // } else {
          //   Vue.$toast.open({
          //     message: "Invalid email address.",
          //     type: "error",
          //     position: "top"
          //   });
          //   this.seen = false;
          // }
        } else {
          Vue.$toast.open({
            message: this.$t(
              "Please fill out all the fields.",
              "Please fill out all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      } else if (
        this.pageTitle == this.$t("Edit NGO Details", "Edit NGO Details")
      ) {
        const {
          title,
          contactNumber,
          accountOwner,
          accountNumber,
          accounttype,
          selectedBank,

          bankaccountCurrency,
          Address,
          splitAddress,
          town,
          identification,
          percentageDistribution,
        } = this;
        var selectedBankCode = null;
        for (var i = 0; i < this.banksWithCode.length; i++) {
          if (this.banksWithCode[i].Name == this.selectedBank) {
            selectedBankCode = this.banksWithCode[i].Code;
          }
        }

        const formattedAddress = (function () {
          return `${Address}`;
        })();
        const dataToInsert = {
          title,
          contactNumber,
          accountOwner,
          accountNumber,
          accounttype,
          selectedBank,
          selectedBankCode,
          bankaccountCurrency,
          Address: formattedAddress,
          town,
          percentageDistribution,
          //Address
        };
        const ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("ngos")
          .child(this.snapshotKey)
          .update(dataToInsert)
          .then(() => {
            Vue.$toast.open({
              message: vm.$t("NGO details updated.", "NGO details updated."),
              type: "success",
              position: "top",
            });
            this.loadNGOs();
            this.seen = false;
          });
      }
    },
    onBankSelect() {},
    clearAll: function () {
      this.snapshotKey = null;
      this.ngoSelected = false;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      }
    },
    selectedAccountType: function (val) {
      if (val == 0) {
        this.accounttype = "Savings";
      } else if (val == 1) {
        this.accounttype = "Current";
      }
      // if (this.accounttype == "Savings") {
      //   this.amountFactoredShowFlag = true;
      // } else {
      //   this.amountFactoredShowFlag = false;
      // }
    },
    getBankList: function () {
      var currentVal = this;
      var ref = firebase.database().ref().child("masters").child("bank");

      ref.on("value", function (snapshot) {
        snapshot.forEach((requestData) => {
          currentVal.banks.push(requestData.val().institutionName);
          currentVal.banksWithCode.push({
            Name: requestData.val().institutionName,
            Code: requestData.val().bic,
          });
        });
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
.manage-ngos-ps {
  min-height: 383px !important;
  max-height: 383px !important;
}
.accHeading {
  text-align: left !important;
  color: #fff;
  padding-bottom: 10px;
  padding-top: 15px;
}
.ngo-photo-container {
  margin-top: 15px !important;
}
.ngo-description p {
  text-align: left !important;
  margin-bottom: 6px !important;
}
.ngo-description {
  margin-bottom: 0px !important;
}
.ngo-currency-container {
  margin-top: 29px !important;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";

.manage-ngos-ps {
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
.main-container-manage-ngos {
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
.inp-ngo-name {
  background-image: url("../../assets/images/manage_ngo.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-identification {
  background-image: url("../../assets/images/row_houses.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
}
.inp-account {
  background-image: url("../../assets/images/producer_2.png");
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
.manage-ngos-ps {
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
.manage-ngo-field-wrap {
  margin: 10px 25px;
}
.sa-ngo-btn {
  width: 160px;
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
</style>
