<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">
            {{ $t("Registered Bank Accounts", "Registered Bank Accounts") }}
          </h6>
        </div>

        <div class="main-container-manage-packhouses">
          <div class="emptyContainer" v-if="bankAccountsList.length == 0">
            <h2 class="card-inside-description">
              {{ $t("No data to display", "No data to display") }}
            </h2>
          </div>
          <perfect-scrollbar class="manage-packhouses-ps">
            <div class="card-body">
              <div
                class="outer-container"
                v-for="bankAccount in bankAccountsList"
                :key="bankAccount.snapshotKey"
              >
                <div class="photo-container">
                  <img
                    src="../../assets/images/manage_bank_accts.png"
                    alt="User Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname lbl-pickup">
                    <b>{{ bankAccount.userType }}</b>
                    <input
                      type="radio"
                      @click="editBankAccountDetails(bankAccount)"
                      :checked="bankAccount.snapshotKey == snapshotKey"
                    />
                    <img />
                  </label>
                  <label class="lbl-flname lbl-pickup">{{
                    bankAccount.accountOwner
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    bankAccount.accountNumber
                  }}</label>
                  <label class="lbl-flname lbl-pickup"
                    >{{ bankAccount.Address }}, {{ bankAccount.Town }}</label
                  >
                  <br />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container">
          <input
            type="button"
            class="btn-save sa-packhouse-btn"
            :value="$t('Create New Bank Account', 'Create New Bank Account')"
            @click="createNewBankAccount"
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
              <div class="emptyContainer" v-if="!bankAccountSelected">
                <h2 class="card-inside-description">
                  {{ $t("No data to display", "No data to display") }}
                </h2>
              </div>

              <div v-if="bankAccountSelected">
                <div class="inp-container">
                  <v-select
                    v-model="userType"
                    :placeholder="$t('User Type', 'User Type')"
                    class="manage-bank-accountsv-select"
                    @input="onUserTypeSelect()"
                    :options="userTypeList"
                  ></v-select>
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="
                      $t('Identification No.', 'Identification No.')
                    "
                    class="inp-details"
                    type="text"
                    v-model="identificationNo"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Account Owner', 'Account Owner')"
                    class="inp-details"
                    type="text"
                    v-model="accountOwner"
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
                <div class="inp-container">
                  <input
                    :placeholder="$t('Contact No.', 'Contact No.')"
                    class="inp-details"
                    type="text"
                    v-model="contactNumber"
                  />
                </div>
                <h4 class="accnt-details-heading">Account Details</h4>
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
                <div class="inp-container">
                  <v-select
                    v-model="bankAccountCurrency"
                    placeholder="Bank Account Currency"
                    class="manage-bank-accountsv-select"
                    :options="currencySource"
                  ></v-select>
                </div>
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
        <div class="button-container" v-if="bankAccountSelected">
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
            @click="saveBankAccount"
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
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import isAuthenticated from '../../shared/auth';

export default {
  name: "manage-packhouses",
  data: function () {
    return {
      seen: true,
      bankAccountsList: [],
      emptyContainer: true,
      userName: null,
      packhouseList: [],
      Address: null,
      Town: null,
      contactNumber: null,
      identificationNo: null,
      id: null,
      accountOwner: null,
      bankName: null,
      typeOfAccount: null,
      accountNumber: null,
      pageTitle: null,
      bankAccountCurrency: null,
      bankAccountSelected: false,
      snapshotKey: null,
      userType: null,
      currencySource: ["USD", "HTG"],
      //  userTypeList: ["Harvest Planner", "LSP"],
      userTypeList: ["Logistic / Cold Chain Service Provider"],
      editFlag: false,
      banks: [],
      banksWithCode: [],
      bankCode: null,
      organizationSelected: null,
      isSuperUser: false,
      organizationList: [],
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
        {
         text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Manage Bank Accounts", "Manage Bank Accounts"),
          href: "/manage-bank-accounts",
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
          text: this.$t("Manage Bank Accounts", "Manage Bank Accounts"),
          href: "/manage-bank-accounts",
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
          text: this.$t("Manage Bank Accounts", "Manage Bank Accounts"),
          href: "/manage-bank-accounts",
        },
      ]);
    }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    if (
      localStorage.systemRole == 99 &&
      localStorage.organizationKey == localStorage.organization
    ) {
      this.isSuperUser = true;
    }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t("Bank Account Details", "Bank Account Details");
    this.getOrganizationList();
    this.getBankList();
    this.loadBankAccountDetails();
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
    loadBankAccountDetails: function () {
      let vm = this;
      this.bankAccountsList = [];
      vm.seen = true;
      let ref = null;
      if (vm.isSuperUser) {
        ref = firebase.database().ref().child("masters").child("bankAccount");
      } else {
        ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("bankAccount")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
      }

      ref.on("child_added", function (requestData) {
        console.log(requestData.val());
        var data = {
          Address: requestData.val().Address,
          Town: requestData.val().Town,
          accountNumber: requestData.val().accountNumber,
          accountOwner: requestData.val().accountOwner,
          bankAccountCurrency: requestData.val().bankAccountCurrency,
          bankName: requestData.val().bankName,
          contactNumber: requestData.val().contactNumber,
          identificationNo: requestData.val().identificationNo,
          typeOfAccount: requestData.val().typeOfAccount,
          userType: requestData.val().userType,
          snapshotKey: requestData.key,
          organization: requestData.val().organization,
          organizationKey: requestData.val().organizationKey,
        };
        vm.bankAccountsList.push(data);

        vm.seen = false;
      });
      setTimeout(function () {
        if (vm.bankAccountsList.length == 0) {
          vm.seen = false;
        }
      }, 3000);
    },
    createNewBankAccount: function () {
      this.snapshotKey = null;
      this.bankAccountSelected = true;
      this.pageTitle = this.$t("Bank Account Details", "Bank Account Details");
      this.bankName = null;
      this.typeOfAccount = null;
      this.accountNumber = null;
      this.bankAccountCurrency = null;
      this.Address = null;
      this.Town = null;
      this.contactNumber = null;
      this.identificationNo = null;
      this.accountOwner = null;
      this.editFlag = false;
      this.userType = null;
      this.organizationSelected = null;
    },
    editBankAccountDetails: function ({
      Address,
      Town,
      identificationNo,
      contactNumber,
      bankAccountCurrency,
      bankName,
      accountOwner,
      accountNumber,
      typeOfAccount,
      userType,
      snapshotKey,
      organization,
      organizationKey,
    }) {
      this.editFlag = true;
      this.bankAccountSelected = true;
      this.identificationNo = identificationNo;
      this.Address = Address;
      this.Town = Town;
      this.contactNumber = contactNumber;
      this.accountNumber = accountNumber;
      this.accountOwner = accountOwner;
      this.bankName = bankName;
      this.typeOfAccount = typeOfAccount;
      this.bankAccountCurrency = bankAccountCurrency;
      this.userType = userType;
      this.snapshotKey = snapshotKey;
      this.organizationSelected = {
        name: organization,
        orgKey: organizationKey,
      };
    },
    saveBankAccount: function () {
      const vm = this;
      var errorFlag = false;
      var currentSnapshotKey = null;
      let mainRef = null;
      if (
        localStorage.systemRole == 99 &&
        localStorage.emailId == localStorage.organizationKey
      ) {
        mainRef = firebase
          .database()
          .ref()
          .child("masters")
          .child("bankAccount");
      } else {
        mainRef = firebase
          .database()
          .ref()
          .child("masters")
          .child("bankAccount")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
      }
      // const ref = firebase
      //   .database()
      //   .ref()
      //   .child("masters")
      //   .child("bankAccount");
      mainRef.on("child_added", (snapshot) => {
        if (snapshot.val().userType == this.userType) {
          errorFlag = true;
          currentSnapshotKey = snapshot.key;
        }
      });

      this.seen = true;
      if (!this.editFlag) {
        if (!errorFlag) {
          for (var i = 0; i < this.banksWithCode.length; i++) {
            if (this.banksWithCode[i].Name == this.bankName) {
              this.bankCode = this.banksWithCode[i].Code;
            }
          }
          const {
            Address,
            Town,
            identificationNo,
            contactNumber,
            bankAccountCurrency,
            bankName,
            accountOwner,
            accountNumber,
            typeOfAccount,
            userType,
            bankCode,
          } = this;

          const data = {
            Address,
            Town,
            identificationNo,
            contactNumber,
            bankAccountCurrency,
            bankName,
            accountOwner,
            accountNumber,
            typeOfAccount,
            userType,
            bankCode,
          };
          if (vm.isSuperUser) {
            data.organization = vm.organizationSelected.name;
            data.organizationKey = vm.organizationSelected.orgKey;
          } else {
            data.organization = localStorage.organization;
            data.organizationKey = localStorage.organizationKey;
          }

          if (
            Address &&
            Address != null &&
            Town &&
            Town != null &&
            identificationNo &&
            identificationNo != null &&
            contactNumber &&
            contactNumber != null &&
            bankAccountCurrency &&
            bankAccountCurrency != null &&
            bankName &&
            bankName != null &&
            accountOwner &&
            accountOwner != null &&
            accountNumber &&
            accountNumber != null &&
            typeOfAccount &&
            typeOfAccount != null &&
            userType &&
            userType != null &&
            bankCode &&
            bankCode != null
          ) {
            let _ref = firebase
              .database()
              .ref()
              .child("masters/bankAccount")
              // .child(data.organizationKey)
              .push(data)
              .then(
                (snapshot) => {
                  vm.addMapping(snapshot.key, data.organizationKey);
                  this.bankAccountSelected = false;
                  Vue.$toast.open({
                    message: vm.$t(
                      "New bank account details has been added.",
                      "New bank account details has been added."
                    ),
                    type: "success",
                    position: "top",
                  });
                  this.loadBankAccountDetails();
                  this.organizationSelected = null;
                  this.seen = false;
                },
                () => {
                  this.bankAccountSelected = false;
                  Vue.$toast.open({
                    message: vm.$t(
                      "Error adding new bank account details.",
                      "Error adding new bank account details."
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
                "Please fill out all the fields.",
                "Please fill out all the fields."
              ),
              type: "error",
              position: "top",
            });
            this.seen = false;
          }
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: this.$t(
              "Bank account details already exists. Select from the list to edit.",
              "Bank account details already exists. Select from the list to edit."
            ),
            type: "warning",
            position: "top",
          });
        }
      } else if (this.editFlag) {
        if (this.snapshotKey == currentSnapshotKey) {
          for (var i = 0; i < this.banksWithCode.length; i++) {
            if (this.banksWithCode[i].Name == this.bankName) {
              this.bankCode = this.banksWithCode[i].Code;
            }
          }
          var dataToInsert = {
            Address: this.Address,
            Town: this.Town,
            identificationNo: this.identificationNo,
            contactNumber: this.contactNumber,
            bankAccountCurrency: this.bankAccountCurrency,
            bankName: this.bankName,
            accountOwner: this.accountOwner,
            accountNumber: this.accountNumber,
            typeOfAccount: this.typeOfAccount,
            userType: this.userType,
            bankCode: this.bankCode,
          };
          if (vm.isSuperUser) {
            dataToInsert.organization = vm.organizationSelected.name;
            dataToInsert.organizationKey = vm.organizationSelected.orgKey;
          } else {
            dataToInsert.organization = localStorage.organization;
            dataToInsert.organizationKey = localStorage.organizationKey;
          }
          if (
            dataToInsert.Address &&
            dataToInsert.Address != null &&
            dataToInsert.Town &&
            dataToInsert.Town != null &&
            dataToInsert.identificationNo &&
            dataToInsert.identificationNo != null &&
            dataToInsert.contactNumber &&
            dataToInsert.contactNumber != null &&
            dataToInsert.bankAccountCurrency &&
            dataToInsert.bankAccountCurrency != null &&
            dataToInsert.bankName &&
            dataToInsert.bankName != null &&
            dataToInsert.accountOwner &&
            dataToInsert.accountOwner != null &&
            dataToInsert.accountNumber &&
            dataToInsert.accountNumber != null &&
            dataToInsert.typeOfAccount &&
            dataToInsert.typeOfAccount != null &&
            dataToInsert.userType &&
            dataToInsert.userType != null &&
            dataToInsert.bankCode &&
            dataToInsert.bankCode != null
          ) {
            const ref = firebase
              .database()
              .ref()
              .child("masters")
              .child("bankAccount")
              // .child(dataToInsert.organizationKey)
              .child(vm.snapshotKey)
              .update(dataToInsert)
              .then(() => {
                vm.addMapping(vm.snapshotKey, dataToInsert.organizationKey);
                Vue.$toast.open({
                  message: vm.$t(
                    "Bank account details updated.",
                    "Bank account details updated."
                  ),
                  type: "success",
                  position: "top",
                });
                this.organizationSelected = null;
                this.loadBankAccountDetails();
                this.seen = false;
              });
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
        } else {
          this.seen = false;
          Vue.$toast.open({
            message: this.$t(
              "Bank account details already exists. Select from the list to edit.",
              "Bank account details already exists. Select from the list to edit."
            ),
            type: "warning",
            position: "top",
          });
        }
      }
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.bankAccountSelected = false;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      }
    },
    onUserTypeSelect() {
      const vm = this;
      var errorFlag = false;
      const ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("bankAccount");
      ref.on("child_added", (snapshot) => {
        if (snapshot.val().userType == this.userType) {
          errorFlag = true;
        }
      });
      if (errorFlag) {
        Vue.$toast.open({
          message: vm.$t(
            "Bank account details already exists. Select from the list to edit.",
            "Bank account details already exists. Select from the list to edit."
          ),
          type: "warning",
          position: "top",
        });
      }
    },
    getBankList: function () {
      var currentVal = this;
      let ref = null;
      if (
        localStorage.systemRole == 99 &&
        localStorage.organization == localStorage.organizationKey
      ) {
        ref = firebase.database().ref().child("masters").child("bank");
      } else {
        ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("bank")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
      }

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
    getOrganizationList() {
      const vm = this;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .orderByChild("organizationType")
        .equalTo("Logistic / Cold Chain Service Provider");
      this.organizationList = [];
      ref.on("value", (snapshot) => {
        snapshot.forEach((requestData) => {
          console.log(requestData.val().status);
          if (requestData.val().status != "Disabled") {
            this.organizationList.push({
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
  width: auto;
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
