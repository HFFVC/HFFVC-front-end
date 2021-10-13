<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <span class="serbox">
            <img class="search-icon" src="../../assets/images/search.png" />
            <input
              type="text"
              v-model="searchTerm"
              class="manage-users-txt-search"
              @keyup="searchElement"
              @keyup.enter="searchElement"
              :placeholder="$t('Name / Email', 'Name / Email')"
            />
          </span>
          <img
            class="close-search-icon"
            v-on:click="clearSearch()"
            v-if="closeSearch"
            src="../../assets/images/close.png"
          />
          <h6 class="heading">{{ $t("Enrolled Users", "Enrolled Users") }}</h6>
        </div>
        <div class="main-container main-container-manage-users">
          <div class="card-body" v-if="!searchEnabled">
            <perfect-scrollbar class="sa-left-scroll">
              <div>
                <div
                  class="outer-container manageUserOuterContainer"
                  v-for="(user, index) in userList"
                  :key="index"
                >
                  <div class="photo-container">
                    <img
                      src="../../assets/images/user.png"
                      alt="User Picture"
                      class="former-picture"
                    />
                  </div>
                  <div class="description-container">
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ user.firstName }} {{ user.lastName }}</b>

                      <input
                        name="username"
                        type="radio"
                        @click="(userToEdit = user), editUserDetails(user)"
                      />

                      <img />
                      <span v-if="user.systemRole != 99 && !isRootUser">
                        <button
                          title="Delete"
                          v-if="
                            isSuperUser &&
                            (user.email || user.phoneNumber) &&
                            (user.email != loggedInUserEmailId ||
                              user.phoneNumber != loggedInUserPhoneNumber)
                          "
                          class="delete-option"
                          @click="showConfirmDialog(user)"
                        >
                          X
                        </button>
                      </span>
                    </label>
                    <label class="lbl-flname lbl-pickup">{{
                      user.email
                    }}</label>
                    <label class="lbl-flname lbl-pickup">
                      {{ user.roleDesc }}
                    </label>
                    <label class="lbl-flname lbl-pickup">{{ user.func }}</label>
                    <label class="lbl-flname lbl-pickup">{{
                      user.organization
                    }}</label>
                    <br />
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
          <!-- -->
          <div class="card-body" v-if="searchEnabled">
            <perfect-scrollbar class="sa-left-scroll">
              <div>
                <div
                  class="outer-container manageUserOuterContainer"
                  v-for="(user, index) in searchResults"
                  :key="index"
                >
                  <div class="photo-container">
                    <img
                      src="../../assets/images/user.png"
                      alt="User Picture"
                      class="former-picture"
                    />
                  </div>
                  <div class="description-container">
                    <label class="lbl-flname lbl-pickup">
                      <b>{{ user.firstName }} {{ user.lastName }}</b>

                      <input
                        name="username"
                        type="radio"
                        @click="(userToEdit = user), editUserDetails(user)"
                      />

                      <img />
                      <span v-if="user.systemRole != 99 && !isRootUser">
                        <button
                          title="Delete"
                          v-if="
                            isSuperUser &&
                            (user.email || user.phoneNumber) &&
                            (user.email != loggedInUserEmailId ||
                              user.phoneNumber != loggedInUserPhoneNumber)
                          "
                          class="delete-option"
                          @click="showConfirmDialog(user)"
                        >
                          X
                        </button>
                      </span>
                    </label>
                    <label class="lbl-flname lbl-pickup">{{
                      user.email
                    }}</label>
                    <label class="lbl-flname lbl-pickup">
                      {{ user.roleDesc }}
                    </label>
                    <label class="lbl-flname lbl-pickup">{{ user.func }}</label>
                    <label class="lbl-flname lbl-pickup">{{
                      user.organization
                    }}</label>
                    <br />
                  </div>
                </div>
              </div>
            </perfect-scrollbar>
          </div>
        </div>

        <div class="button-container">
          <input
            type="button"
            class="btn-save btn-lg"
            :value="$t('Create New User', 'Create New User')"
            @click="createNewUser"
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

        <div class="main-container main-container-manage-users">
          <perfect-scrollbar>
            <div class="card-body manage-users-field-wrap">
              <div class="emptyContainer" v-if="isEmptyContainer">
                <h2 class="card-inside-description">
                  {{ $t("Select a User to Edit", "Select a User to Edit") }}
                </h2>
              </div>

              <div v-if="selectedUser">
                <div class="col col-md-12">
                  <div class="row">
                    <div class="inp-container inp-half-first-name">
                      <input
                        :placeholder="$t('First Name', 'First Name')"
                        class="inp-details inp-firstname"
                        v-model="firstName"
                        type="text"
                      />
                    </div>
                    <div class="inp-container inp-half-first-name">
                      <input
                        :placeholder="$t('Last Name', 'Last Name')"
                        class="inp-details"
                        type="text"
                        v-model="lastName"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <h4 class="accnt-details-heading">
                      {{ $t("Organization Type", "Organization Type") }}
                    </h4>
                  </div>

                  <div class="row">
                    <div class="inp-container">
                      <v-select
                        :disabled="isSpocUser"
                        v-model="organizationType"
                        :placeholder="
                          $t('Organization Type', 'Organization Type')
                        "
                        class="manage-users-v-select rolesel"
                        :options="organizationTypeList"
                        @input="filterOrganizations()"
                      ></v-select>
                    </div>
                  </div>

                  <div class="row">
                    <div class="inp-container">
                      <p
                        v-if="
                          organizationType &&
                          organizationType ==
                            'Logistic / Cold Chain Service Provider' &&
                          systemRole != 96
                        "
                      >
                        *Note: You can register user using email address or
                        phone number
                      </p>
                      <input
                        :placeholder="$t('Email Address', 'Email Address')"
                        class="inp-details inp-email"
                        type="text"
                        v-model="email"
                        :readonly="
                          pageTitle ==
                          $t('Edit User Details', 'Edit User Details')
                        "
                      />
                    </div>
                  </div>

                  <div class="row" v-if="phoneNumberEditable">
                    <div
                      class="inp-container"
                      v-if="
                        organizationType &&
                        organizationType ==
                          'Logistic / Cold Chain Service Provider' &&
                        systemRole != 96
                      "
                    >
                      <h4 class="accnt-details-heading">
                        {{ $t("Phone Number", "Phone Number") }}
                      </h4>
                      <div class="inp-container country-code">
                        <input
                          :placeholder="
                            $t('Country Code (+509)', 'Country Code (+509)')
                          "
                          class="inp-details"
                          type="text"
                          maxlength="4"
                          v-model="countryCode"
                        />
                      </div>
                      <input
                        :placeholder="$t('Phone Number', 'Phone Number')"
                        class="inp-details phone-number"
                        type="number"
                        v-model="phoneNumber"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div
                      class="payament-method-container"
                      v-if="phoneNumber && email"
                    >
                      <label>{{
                        $t("Enable login via", "Enable login via")
                      }}</label>
                      <div class="radioGroup">
                        <input
                          value="phone"
                          name="loginMode"
                          v-model="loginMode"
                          type="radio"
                          :readonly="
                            pageTitle ==
                            $t('Edit User Details', 'Edit User Details')
                          "
                        />{{ $t("Phone Number", "Phone Number") }}
                        <input
                          value="email"
                          name="loginMode"
                          v-model="loginMode"
                          type="radio"
                          :readonly="
                            pageTitle ==
                            $t('Edit User Details', 'Edit User Details')
                          "
                        />{{ $t("Email", "Email") }}
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <h4 class="accnt-details-heading">
                      {{ $t("Select Organization", "Select Organization") }}
                    </h4>
                  </div>

                  <div class="row">
                    <div class="inp-container">
                      <div class="function-dropdown">
                        <v-select
                          :disabled="isSpocUser"
                          id="dropdownlist"
                          v-model="organizationSelected"
                          :placeholder="$t('Organization', 'Organization')"
                          class="manage-users-v-select rolesel"
                          :options="filteredOrganizationList"
                          label="name"
                          @input="getBrokerMargin()"
                        ></v-select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <h4
                      class="accnt-details-heading"
                      v-if="
                        organizationType &&
                        organizationType != 'Root Authority' &&
                        organizationType != 'Technology Service Provider' &&
                        organizationType != 'Auditor' &&
                        systemRole != 96 &&
                        systemRole != 97
                      "
                    >
                      {{ $t("Select Roles", "Select Roles") }}
                    </h4>
                  </div>

                  <div class="row">
                    <div class="user-roles-selection" v-if="organizationType">
                      <div
                        v-if="
                          organizationType ==
                            'Logistic / Cold Chain Service Provider' &&
                          systemRole != 96
                        "
                      >
                        <input
                          class="padding-left-10"
                          type="checkbox"
                          name="Harvest Planner"
                          v-model="harvestPlannerRole"
                          value="Harvest Planner"
                        /><span class="user-role-checkbox-label"
                          >Harvest Planner</span
                        >
                        <input
                          class="padding-left-10"
                          type="checkbox"
                          name="Collector"
                          v-model="collectorRole"
                          value="collector"
                        /><span class="user-role-checkbox-label"
                          >Collector</span
                        >
                        <input
                          class="padding-left-10"
                          type="checkbox"
                          name="Packhouse Incharge"
                          v-model="packhouseInchargeRole"
                          value="Packhouse Incharge"
                        /><span class="user-role-checkbox-label"
                          >Packhouse Incharge</span
                        >
                      </div>
                      <div
                        v-if="organizationType == 'Broker' && systemRole != 97"
                      >
                        <input
                          class="padding-left-10"
                          type="checkbox"
                          name="Harvest Planner"
                          v-model="brokerRole"
                          value="Harvest Planner"
                        /><span class="user-role-checkbox-label">Broker</span>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div
                      v-if="organizationType == 'Broker'"
                      class="inp-container"
                    >
                      <input
                        readonly
                        :placeholder="
                          $t('Broker Margin In %', 'Broker Margin In %')
                        "
                        class="inp-details inp-bda"
                        type="text"
                        v-model="brokerMargin"
                      />
                    </div>
                  </div>
                </div>

                <div class="clear"></div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="selectedUser">
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
            @click="saveUserDetails"
          />
        </div>
      </div>
      <Footer ref="footercomp"></Footer>
    </div>
    <b-modal
      hide-footer
      id="confirm-delete-modal"
      ref="confirm-modal"
      hide-backdrop
      :title="$t('Warning', 'Warning')"
    >
      <label>
        {{
          $t(
            "Are you sure you want to delete the user",
            "Are you sure you want to delete the user"
          )
        }}
        ?
      </label>
      <div class="button-container">
        <input
          type="button"
          v-on:click="closeConfirmDialog()"
          class="btn-cancel"
          :value="$t('Cancel', 'Cancel')"
        />
        <input
          type="button"
          v-on:click="deleteUser()"
          class="btn-save"
          :value="$t('Delete', 'Delete')"
        />
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase, { functions } from "firebase";
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
import mailService from "../../shared/email.service";
Vue.use(VueToast);
Vue.use(Datetime);
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import sendMail from "../../shared/email.service";
import VueLodash from "vue-lodash";
import isAuthenticated from "../../shared/auth";
import sendSMS from "../../shared/sms-service";
Vue.use(VueLodash, { name: "_" });
export default {
  name: "manage-users",
  data: function () {
    return {
      seen: true,
      userName: null,
      pageTitle: this.$t("User Details", "User Details"),
      userList: [],
      isEmptyContainer: true,
      selectedUser: null,
      firstName: null,
      lastName: null,
      roleDesc: null,
      systemRole: null,
      snapshotKey: null,
      func: null,
      email: null,
      isSuperAdmin: false,
      roleDescriptions: [
        "Logistic / Cold Chain Service Provider",
        // "Harvest Planner",
        // "Super User",
        "Admin",
        // "Collector",
        "Broker",
        "AML",
        "TPA",
        "Observer",
        "Broker Super User",
        "OP-Admin",
        "Observer-MCI",
      ],
      snapshotKey: null,
      loader: false,
      isBroker: false,
      brokerMargin: null,
      brokerOrganization: null,
      isCheckAll: false,
      organizationList: null,
      organizationSelected: null,
      userEmailAddress: null,
      superAdminAddress: getConfigVars().USERID,
      mappedOrganization: {},
      isSuperUser: false,
      searchEnabled: false,
      searchTerm: null,
      searchResults: [],
      closeSearch: false,
      organizationTypeList: [
        "Root Authority",
        "Logistic / Cold Chain Service Provider",
        "Financial Services",
        "Broker",
      ],
      organizationType: null,
      filteredOrganizationList: [],
      userRolesSelected: [],
      harvestPlannerRole: false,
      collectorRole: false,
      packhouseInchargeRole: false,
      brokerRole: false,
      loggedInUserEmailId: localStorage.emailId,
      userToDelete: null,
      isRootSpoc: false,
      isRootUser: false,
      isSpocUser: false,
      phoneNumber: null,
      loginMode: null,
      countryCode: null,
      unregisteredUser: false,
      userToEdit: null,
      phoneNumberEditable: true,
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
    const vm = this;
    const user = firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user.providerData[0].email);
        console.log(vm.superAdminAddress);
        vm.userEmailAddress = user.providerData[0].email;
        if (vm.userEmailAddress == vm.superAdminAddress) {
          vm.roleDescriptions.push("Super User");
        }
      } else {
        console.log("error");
      }
    });
    if (localStorage.systemRole == 99) {
      if (getConfigVars().USERID == isAuthenticated()) {
        this.organizationTypeList.push("Root Authority");

        this.$refs.headercomp.createBreadcrumb([
          {
            text: this.$t(
              "Technology Service Provider-Dashboard",
              "Technology Service Provider-Dashboard"
            ),
            href: "/sa-dashboard",
          },
          {
            text: this.$t("Manage Users", "Manage Users"),
            href: "/manage-users",
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
            text: this.$t("Manage Users", "Manage Users"),
            href: "/manage-users",
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
          text: this.$t("Manage Users", "Manage Users"),
          href: "/manage-users",
        },
      ]);
    }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.getOrganizationList();
    this.getUserList();
    this.getRoleDesc();
  },
  methods: {
    getRoleDesc: function () {
      var vm = this;
      const ref = firebase.database().ref().child("profile");
      ref
        .orderByChild("email")
        .equalTo(localStorage.emailId)
        .on("child_added", function (requestData) {
          if (
            requestData.roleDesc != null &&
            requestData.roleDesc != undefined &&
            requestData.roleDesc == "Root Authority User"
          ) {
            vm.isRootUser = true;
          }
        });
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
    showDashboard: () => Router.push("sa-dashboard"),
    getUserList: function () {
      let currentVal = this;
      currentVal.userList = [];

      if (localStorage.systemRole.includes(99)) {
        currentVal.isSuperUser = true;
        currentVal.getPhoneUsers();
        const ref = firebase.database().ref().child("profile");
        ref.orderByChild("firstName").on("child_added", function (requestData) {
          const {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            brokerMargin,
            brokerOrganization,
            organization,
            organizationKey,
            userRoles,
            organizationType,
            phoneNumber,
            countryCode,
            splitPhoneNo,
          } = requestData.val();
          let _data = {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            brokerMargin,
            brokerOrganization,
            organization,
            organizationKey,
            userRoles,
            organizationType,
            phoneNumber,
            countryCode,
            splitPhoneNo,
          };
          const dataToPush = {
            ..._data,
            func: requestData.val().function,
            snapshotKey: requestData.key,
            isSuperAdmin:
              requestData.val().function == "Super User" ? true : false,
            organizationSelected: requestData.val().organization,
          };
          if (requestData.val().status != "Disabled") {
            currentVal.userList.push(dataToPush);
            let temp = Vue._.sortBy(currentVal.userList, "firstName");
            currentVal.userList = temp;
          }
        });
      } else {
        currentVal.isSuperUser = false;
        const ref = firebase
          .database()
          .ref()
          .child("profile")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);
        ref.on("child_added", function (requestData) {
          const {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            brokerMargin,
            brokerOrganization,
            organization,
            userRoles,
            organizationType,
            phoneNumber,
            countryCode,
            splitPhoneNo,
          } = requestData.val();
          let _data = {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            brokerMargin,
            brokerOrganization,
            organization,
            userRoles,
            organizationType,
            phoneNumber,
            countryCode,
            splitPhoneNo,
          };
          const dataToPush = {
            ..._data,
            func: requestData.val().function,
            snapshotKey: requestData.key,
            isSuperAdmin:
              requestData.val().function == "Super User" ? true : false,
            organizationSelected: requestData.val().organization,
          };
          if (requestData.val().status != "Disabled") {
            currentVal.userList.push(dataToPush);
            let temp = Vue._.sortBy(currentVal.userList, "firstName");
            currentVal.userList = temp;
          }
        });
      }

      currentVal.seen = false;
    },
    editUserDetails: function ({
      email,
      firstName,
      func,
      lastName,
      roleDesc,
      snapshotKey,
      isSuperAdmin,
      systemRole,
      brokerMargin,
      brokerOrganization,
      organizationSelected,
      organizationKey,
      userRoles,
      organizationType,
      phoneNumber,
      countryCode,
      splitPhoneNo,
      unregisteredUser,
    }) {
      this.pageTitle = this.$t("Edit User Details", "Edit User Details");
      const vm = this;
      this.isEmptyContainer = false;
      this.selectedUser = true;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phoneNumber = splitPhoneNo;
      this.countryCode = countryCode;
      this.func = func;
      this.systemRole = systemRole;
      this.roleDesc = roleDesc;
      this.email = email;
      this.snapshotKey = snapshotKey;
      this.isSuperAdmin = isSuperAdmin;
      this.brokerMargin = brokerMargin;
      this.brokerOrganization = brokerOrganization;
      this.organizationSelected = {
        name: organizationSelected,
        orgKey: organizationKey,
      };
      this.unregisteredUser = unregisteredUser;

      vm.harvestPlannerRole = false;
      vm.collectorRole = false;
      vm.packhouseInchargeRole = false;
      vm.brokerRole = false;
      vm.isRootSpoc = false;

      this.organizationType = organizationType;
      if (userRoles && userRoles.length) {
        userRoles.forEach((item) => {
          if (item.role == "Harvest Planner") {
            vm.harvestPlannerRole = true;
          }
          if (item.role == "Collector") {
            vm.collectorRole = true;
          }
          if (item.role == "Packhouse Incharge") {
            vm.packhouseInchargeRole = true;
          }
          if (item.role == "Broker") {
            vm.brokerRole = true;
          }
          if (item.role == "Root Authority") {
            vm.isRootSpoc = true;
          }
        });
      }
      this.setphoneNumberEditable();
      if (systemRole == 4) {
        this.isBroker = true;
      } else {
        this.isBroker = false;
      }
      if (
        this.systemRole == 99 ||
        this.systemRole == 96 ||
        this.systemRole == 98 ||
        this.systemRole == 89 ||
        this.systemRole == 97 ||
        this.systemRole == 91
      ) {
        this.isSpocUser = true;
      } else {
        this.isSpocUser = false;
      }
    },
    createNewUser: function () {
      this.userToEdit = null;
      this.snapshotKey = null;
      this.isEmptyContainer = false;
      this.selectedUser = true;
      this.pageTitle = this.$t("New User Details", "New User Details");
      this.firstName = "";
      this.lastName = "";
      this.func = "";
      this.phoneNumber = null;
      this.countryCode = null;
      this.systemRole = "";
      this.roleDesc = "";
      this.email = "";
      this.countryCode = null;
      this.harvestPlannerRole = false;
      this.brokerRole = false;
      this.isRootSpoc = false;
      this.packhouseInchargeRole = false;
      this.collectorRole = false;
      this.organizationType = null;
      this.brokerMargin = null;
      this.brokerOrganization = null;
      this.organizationSelected = null;
      this.isSpocUser = false;
      this.setphoneNumberEditable();
    },
    saveUserDetails: function () {
      // creating new user
      const vm = this;
      this.seen = true;
      vm.getUserRoles();
      if (this.pageTitle == this.$t("New User Details", "New User Details")) {
        const {
          firstName,
          lastName,
          email,
          organizationSelected,
          organizationType,
          phoneNumber,
        } = this;
        if (
          vm.organizationType == "Broker" &&
          (vm.brokerMargin == undefined ||
            (vm.brokerMargin == undefined) == null ||
            vm.brokerMargin == "")
        ) {
          Vue.$toast.open({
            message: this.$t(
              "Please fill all the fields.",
              "Please fill all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
          return false;
        }

        if (firstName && lastName && organizationType && organizationSelected) {
          if (vm.systemRole != 96 && vm.systemRole != 97) {
            if (vm.userRolesSelected.length < 1) {
              Vue.$toast.open({
                message: this.$t(
                  "Please select a role.",
                  "Please select a role."
                ),
                type: "error",
                position: "top",
              });
              vm.seen = false;
              return false;
            }
          }
          if (vm.userRolesSelected.length == 0) {
            Vue.$toast.open({
              message: this.$t(
                "Please select at least one role for the user.",
                "Please select at least one role for the user."
              ),
              type: "error",
              position: "top",
            });
            vm.seen = false;
            return false;
          }
          let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
          const _phoneNumber = `${vm.countryCode}${phoneNumber}`;
          if (
            vm.organizationType == "Logistic / Cold Chain Service Provider" &&
            phoneNumber &&
            !vm.countryCode &&
            !vm.isValidPhonenumber(_phoneNumber)
          ) {
            Vue.$toast.open({
              message: this.$t(
                "Please enter a valid phone number.",
                "Please enter a valid phone number."
              ),
              type: "error",
              position: "top",
            });
            vm.seen = false;
            return false;
          }
          if (
            vm.organizationType != "Logistic / Cold Chain Service Provider" &&
            !pattern.test(email)
          ) {
            Vue.$toast.open({
              message: this.$t(
                "Please enter a valid email address.",
                "Please enter a valid email address."
              ),
              type: "error",
              position: "top",
            });
            vm.seen = false;
            return false;
          }

          if (!email && !phoneNumber) {
            Vue.$toast.open({
              message: this.$t(
                "Please enter an email id or a phone number.",
                "Please enter an email id or a phone number."
              ),
              type: "error",
              position: "top",
            });
            vm.seen = false;
            return false;
          } else {
            if (email && phoneNumber) {
              if (vm.loginMode == "phone") {
                vm.registerViaPhone();
                return false;
              } else {
                vm.regiseterViaEmail();
                return false;
              }
            }

            if (email) {
              // all users with email id
              vm.regiseterViaEmail();
              return false;
            } else {
              // for all users with phone number
              vm.registerViaPhone();
              return false;
            }
          }
        } else {
          Vue.$toast.open({
            message: this.$t(
              "Please fill all the fields.",
              "Please fill all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      } else if (
        this.pageTitle == this.$t("Edit User Details", "Edit User Details")
      ) {
        if (
          this.firstName &&
          this.lastName &&
          this.organizationType &&
          this.organizationSelected
        ) {
          let dataToUpdate = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email || "",
            systemRole: vm.systemRole || "",
            userRoles: vm.userRolesSelected,
            organizationType: vm.organizationType,
          };
          if (vm.organizationType == "Root Authority") {
            dataToUpdate.systemRole = 99;
            dataToUpdate.function = "Root Authority";
            dataToUpdate.roleDesc = "Root Authority User";
          }
          if (vm.organizationType == "Broker") {
            dataToUpdate["brokerMargin"] = vm.brokerMargin;
          }
          if (
            this.organizationSelected == null ||
            this.organizationSelected == undefined
          ) {
            dataToUpdate["organization"] = localStorage.organization;
          } else {
            dataToUpdate["organization"] = this.organizationSelected.name;
            dataToUpdate["organizationKey"] = this.organizationSelected.orgKey;
            if (vm.organizationType == "Broker") {
              dataToUpdate[
                "brokerOrganization"
              ] = this.organizationSelected.name;
            }
          }

          // if type is lsp
          // check valid phone and email
          // if phone
          // if phone changed
          // check if phone already exists
          // check if user is registered
          // if not registered update phoneUsers
          // if REGISTERED updateExistingUser else updateNewPhoneUser

          // if (vm.unregisteredUser) {
          //   firebase
          //     .database()
          //     .ref()
          //     .child("phoneUsers")
          //     .child(vm.snapshotKey)
          //     .update(dataToUpdate)
          //     .then(() => {
          //       Vue.$toast.open({
          //         message: vm.$t(
          //           "User details updated.",
          //           "User details updated."
          //         ),
          //         type: "success",
          //         position: "top",
          //       });
          //       vm.clearSearch();
          //       vm.clearAllFields();
          //     })
          //     .catch((error) => {
          //       console.log(error);
          //       Vue.$toast.open({
          //         message: vm.$t(
          //           "Failed to update user details.",
          //           "Failed to update user details."
          //         ),
          //         type: "success",
          //         position: "top",
          //       });
          //       vm.seen = false;
          //     });
          //   return false;
          // }

          let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
          const _phoneNumber = `${vm.countryCode}${vm.phoneNumber}`;

          if (
            vm.organizationType ==
            vm.$t(
              "Logistic / Cold Chain Service Provider",
              "Logistic / Cold Chain Service Provider"
            )
          ) {
            if (vm.email) {
              if (!pattern.test(vm.email)) {
                Vue.$toast.open({
                  message: this.$t("Invalid email Id", "Invalid email Id"),
                  type: "error",
                  position: "top",
                });
                vm.seen = false;
                return false;
              }
            }
            if (vm.phoneNumber) {
              if (
                !vm.countryCode &&
                !vm.phoneNumber &&
                !vm.isValidPhonenumber(_phoneNumber)
              ) {
                Vue.$toast.open({
                  message: this.$t(
                    "Please enter a valid phone number.",
                    "Please enter a valid phone number."
                  ),
                  type: "error",
                  position: "top",
                });
                vm.seen = false;
                return false;
              }
            }

            if (!vm.email && !vm.phoneNumber) {
              Vue.$toast.open({
                message: this.$t(
                  "Please enter an email id or a phone number.",
                  "Please enter an email id or a phone number."
                ),
                type: "error",
                position: "top",
              });
              vm.seen = false;
              return false;
            }
            console.log(vm.hasPhoneNumberChanged);
            if (vm.hasPhoneNumberChanged()) {
              if (vm.unregisteredUser) {
                vm.updateNewPhoneUser();
              } else {
                vm.updateExistingPhoneUser();
              }
              return false;
            }
          }
          const ref = firebase
            .database()
            .ref()
            .child("profile")
            .child(vm.snapshotKey)
            .update(dataToUpdate)
            .then(
              () => {
                if (
                  dataToUpdate.systemRole == 99 ||
                  dataToUpdate.systemRole == 96 ||
                  dataToUpdate.systemRole == 98 ||
                  dataToUpdate.systemRole == 89 ||
                  dataToUpdate.systemRole == 97 ||
                  dataToUpdate.systemRole == 91
                ) {
                  let orgDataToUpdate = {
                    spocFirstName: vm.firstName,
                    spocLastName: vm.lastName,
                    spocEmail: vm.email,
                  };
                  const ref = firebase
                    .database()
                    .ref()
                    .child("masters")
                    .child("organization")
                    .child(dataToUpdate.organizationKey)
                    .update(orgDataToUpdate)
                    .then(() => {
                      Vue.$toast.open({
                        message: vm.$t(
                          "User details updated.",
                          "User details updated."
                        ),
                        type: "success",
                        position: "top",
                      });
                      let organizationKey = dataToUpdate.organizationKey;
                      vm.clearSearch();
                      vm.addMapping(vm.snapshotKey, organizationKey);
                      vm.firstName = null;
                      vm.lastName = null;
                      vm.email = null;
                      vm.roleDesc = null;
                      vm.func = null;
                      vm.systemRole = null;
                      vm.organizationType = null;
                      vm.selectedUser = null;
                      vm.isEmptyContainer = true;
                      vm.userRolesSelected = [];
                      vm.harvestPlannerRole = false;
                      vm.collectorRole = false;
                      vm.brokerRole = false;
                      vm.packhouseInchargeRole = false;
                      vm.isBroker = false;
                      vm.getUserList();
                      vm.seen = false;
                      vm.isCheckAll = false;
                      vm.clearAllFields();
                    });
                } else {
                  Vue.$toast.open({
                    message: vm.$t(
                      "User details updated.",
                      "User details updated."
                    ),
                    type: "success",
                    position: "top",
                  });
                  let organizationKey = dataToUpdate.organizationKey;
                  vm.clearSearch();
                  vm.addMapping(vm.snapshotKey, organizationKey);
                  vm.firstName = null;
                  vm.lastName = null;
                  vm.email = null;
                  vm.roleDesc = null;
                  vm.func = null;
                  vm.systemRole = null;
                  vm.organizationType = null;
                  vm.selectedUser = null;
                  vm.isEmptyContainer = true;
                  vm.userRolesSelected = [];
                  vm.harvestPlannerRole = false;
                  vm.collectorRole = false;
                  vm.brokerRole = false;
                  vm.packhouseInchargeRole = false;
                  vm.isBroker = false;
                  vm.getUserList();
                  vm.seen = false;
                  vm.isCheckAll = false;
                }
              },
              () => {
                Vue.$toast.open({
                  message: vm.$t(
                    "Failed to update user details.",
                    "Failed to update user details."
                  ),
                  type: "success",
                  position: "top",
                });
                this.seen = false;
              }
            );
        } else {
          Vue.$toast.open({
            message: this.$t(
              "Please fill all the fields.",
              "Please fill all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      }
    },
    generatePassword: function () {
      var passLength = 8;
      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < passLength; x++) {
        var randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
        pass += randomChar;
      }
      return pass;
    },
    makeSuperUser() {
      if (this.isSuperAdmin == false) {
        this.isSuperAdmin = true;
        this.func = "Super User";
      } else {
        this.isSuperAdmin = false;
        this.func = null;
      }
    },
    emailServiceCallback(message) {
      const vm = this;
      if (message == "OK") {
        Vue.$toast.open({
          message: vm.$t(
            "Email sent successfully.",
            "Email sent successfully."
          ),
          position: "top",
          type: "success",
        });
      } else {
        Vue.$toast.open({
          message: vm.$t(`Couldn't send an email.`, `Couldn't send an email.`),
          position: "top",
          type: "error",
        });
      }
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.selectedUser = false;
      this.isEmptyContainer = true;
    },
    onFunctionSelect: function () {
      if (this.func == "Broker") {
        this.isBroker = true;
      } else {
        this.isBroker = false;
      }
      if (this.func == "Super User") {
        this.isSuperAdmin = true;
      } else {
        this.isSuperAdmin = false;
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
      ref.on("child_added", (requestData) => {
        if (
          requestData.status == undefined ||
          requestData.status != "Disabled"
        ) {
          this.organizationList.push({
            name: requestData.val().name,
            orgKey: requestData.key,
          });
        }
        //  vm.mappedOrganization[requestData.val().name] = requestData.key;
      });
      console.log(vm.mappedOrganization);
    },
    gotoDashboard: () => Router.push("sa-dashboard"),
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
    ifEmailExists(emailAddress) {
      const vm = this;
      vm.seen = true;
      let data = null;
      return new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          resolve(data);
        }, 8000);
        firebase
          .database()
          .ref()
          .child("profile")
          .orderByChild("email")
          .equalTo(emailAddress)
          .on("child_added", (snapshot) => {
            data = snapshot;
            clearTimeout(timeout);
            resolve(data);
          });
      });
    },
    clearSearch() {
      this.searchTerm = null;
      this.searchResults = [];
      this.searchEnabled = false;
    },
    searchElement() {
      const vm = this;
      if (
        vm.searchTerm == null ||
        vm.searchTerm == "" ||
        vm.searchTerm == undefined
      ) {
        // vm.clearSearch = false;
        vm.clearSearch();
      } else {
        vm.closeSearch = true;
        vm.searchResults = [];
        vm.searchEnabled = true;
        vm.userList.forEach((value, index) => {
          if (
            value.firstName
              .toLowerCase()
              .trim()
              .includes(vm.searchTerm.toLowerCase().trim()) ||
            value.lastName
              .toLowerCase()
              .trim()
              .includes(vm.searchTerm.toLowerCase().trim()) ||
            (value.email &&
              value.email
                .toLowerCase()
                .trim()
                .includes(vm.searchTerm.toLowerCase().trim()))
          ) {
            vm.searchResults.push(value);
            console.log("####");
            console.log(vm.searchResults);
          }
        });
      }
    },
    filterOrganizations() {
      const vm = this;
      vm.seen = true;
      vm.filteredOrganizationList = [];
      // var ref = null;
      // if (vm.organizationType == "Root Authority") {
      //   ref = firebase.database().ref().child("masters").child("organization");
      // } else {
      if (vm.organizationType) {
        var ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("organization")
          .orderByChild("organizationType")
          .equalTo(vm.organizationType);
        // }
        ref.on("child_added", (item) => {
          if (
            item.val().status == undefined &&
            item.val().status != "disabled"
          ) {
            // snapshot.forEach((item) => {
            vm.filteredOrganizationList.push({
              name: item.val().name,
              orgKey: item.key,
            });
          }
          // });
          vm.seen = false;
        });
      } else {
        vm.seen = false;
      }
    },
    getUserRoles() {
      const vm = this;
      vm.userRolesSelected = [];
      if (vm.organizationType == "Logistic / Cold Chain Service Provider") {
        if (vm.harvestPlannerRole)
          vm.userRolesSelected.push({ role: "Harvest Planner", systemRole: 1 });
        if (vm.collectorRole)
          vm.userRolesSelected.push({ role: "Collector", systemRole: 3 });
        if (vm.packhouseInchargeRole)
          vm.userRolesSelected.push({
            role: "Packhouse Incharge",
            systemRole: 2,
          });
      } else if (vm.organizationType == "Broker") {
        if (vm.brokerRole)
          vm.userRolesSelected.push({ role: "Broker", systemRole: 4 });
      } else if (vm.organizationType == "Root Authority") {
        vm.userRolesSelected.push({ role: "Root Authority", systemRole: 99 });
      }
    },
    deleteUser() {
      const vm = this;
      vm.seen = true;
      const user = vm.userToDelete;
      console.log(user);
      vm.checkIfSPOCUser(user)
        .then((spocEmail) => {
          if (spocEmail == user.email) {
            vm.seen = true;
            Vue.$toast.open({
              message: vm.$t(
                "You are trying to delete the SPOC user, please change the SPOC user for the organization and try again.",
                "You are trying to delete the SPOC user, please change the SPOC user for the organization and try again."
              ),
              type: "error",
              position: "top",
            });
          } else {
            firebase
              .database()
              .ref()
              .child("profile")
              .child(user.snapshotKey)
              .update({ status: "Disabled" })
              .then(() => {
                vm.seen = false;
                vm.getUserList();
                Vue.$toast.open({
                  message: vm.$t("User deleted", "User deleted"),
                  type: "success",
                  position: "top",
                });
                vm.userToDelete = null;
                vm.closeConfirmDialog();
              })
              .catch((error) => {
                console.log(error);
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t("Error deleting user", "Error deleting user"),
                  type: "error",
                  position: "top",
                });
              });
          }
        })
        .catch((error) => {
          console.log(error);
          vm.seen = false;
          Vue.$toast.open({
            message: vm.$t(
              "Error fetching organization details",
              "Error fetching organization details"
            ),
            type: "error",
            position: "top",
          });
        });
    },
    checkIfSPOCUser(user) {
      const vm = this;
      // get organization based on key
      // get the spoc
      // check if user email == spoc email
      vm.seen = true;
      let spocEmail = null;
      return new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          vm.seen = false;
          reject(null);
        }, 6000);

        firebase
          .database()
          .ref()
          .child("masters")
          .child("organization")
          .child(user.organizationKey)
          .on("value", (snapshot) => {
            console.log(snapshot.val());
            clearTimeout(timeout);

            const spocEmail = snapshot.val().spocEmail;
            vm.seen = false;
            resolve(spocEmail);
          });
      });
    },
    showConfirmDialog(user) {
      console.log(user);
      this.userToDelete = user;
      this.$refs["confirm-modal"].show();
    },
    closeConfirmDialog() {
      this.$refs["confirm-modal"].hide();
    },
    getBrokerMargin() {
      const vm = this;
      if (vm.organizationSelected) {
        console.log(vm.organizationSelected);
        firebase
          .database()
          .ref()
          .child("masters")
          .child("organization")
          .child(vm.organizationSelected.orgKey)
          .on("value", (snapshot) => {
            console.log(snapshot.val());
            vm.brokerMargin = snapshot.val().brokerMargin;
          });
      }
    },
    isValidPhonenumber(value) {
      return /^\d{7,}$/.test(value.replace(/[\s()+\-\.]|ext/gi, ""));
    },
    ifPhoneNumberExists() {
      const vm = this;
      let data = null;
      const phoneNumber = `${vm.countryCode}${vm.phoneNumber}`;
      return new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          if (data != null) {
            reject("number already in use.");
          } else {
            resolve("new phone number");
          }
        }, 3000);
        firebase
          .database()
          .ref()
          .child("phoneUsers")
          .orderByChild("phoneNumber")
          .equalTo(phoneNumber)
          .once("value", (snapshot) => {
            console.log(snapshot.val());
            if (snapshot.val() == null) {
              clearTimeout(timeout);
              resolve("new phone number");
            } else {
              data = snapshot.val();
              clearTimeout(timeout);
              reject("phone number already in use");
            }
          });
      });
    },
    regiseterViaEmail() {
      const vm = this;
      const {
        firstName,
        lastName,
        email,
        organizationSelected,
        organizationType,
      } = this;

      const userPassword = this.generatePassword();
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, userPassword)
        .then((response) => {
          const snapshot = response.user.uid;
          sendMail(email, `${firstName} ${lastName}`, userPassword)
            .then((sent) => {
              console.log(sent);
              const dataToPush = {
                firstName,
                lastName,
                email,
                systemRole: vm.systemRole || "",
                userRoles: vm.userRolesSelected,
                organizationType: vm.organizationType,
              };
              if (vm.organizationType == "Root Authority") {
                dataToPush.systemRole = 99;
                dataToPush.function = "Root Authority";
                dataToPush.roleDesc = "Root Authority User";
              }
              if (vm.organizationType == "Broker") {
                dataToPush["brokerMargin"] = vm.brokerMargin;
              }

              if (
                organizationSelected == null ||
                organizationSelected == undefined
              ) {
                dataToPush["organizationKey"] = localStorage.organizationKey;
                dataToPush["organization"] = localStorage.organization;
                if (vm.organizationType == "Broker")
                  dataToPush["brokerOrganization"] = localStorage.organization;
              } else {
                dataToPush[
                  "organizationKey"
                ] = this.organizationSelected.orgKey;
                dataToPush["organization"] = this.organizationSelected.name;
                if (vm.organizationType == "Broker") {
                  dataToPush[
                    "brokerOrganization"
                  ] = this.organizationSelected.name;
                }
              }
              firebase
                .database()
                .ref()
                .child("profile")
                .child(snapshot)
                .update(dataToPush)
                .then((inserted) => {
                  vm.addMapping(snapshot, dataToPush.organizationKey);
                  Vue.$toast.open({
                    message: vm.$t(
                      "New user has been added.",
                      "New user has been added."
                    ),
                    type: "success",
                    position: "top",
                  });
                  vm.clearAllFields();
                })
                .catch(function (error) {
                  Vue.$toast.open({
                    message: error.message,
                    type: "error",
                    position: "top",
                  });
                  vm.seen = false;
                });
            })
            .catch((error) => {
              console.log(error);
              vm.seen = false;
            });
        })
        .catch(function (error) {
          Vue.$toast.open({
            message: error.message,
            type: "error",
            position: "top",
          });
          vm.seen = false;
        });
    },
    registerViaPhone() {
      const vm = this;
      var {
        firstName,
        lastName,
        email,
        organizationSelected,
        organizationType,
        phoneNumber,
        countryCode,
      } = this;
      if (!countryCode) {
        Vue.$toast.open({
          message: this.$t("Invalid country code", "Invalid country code"),
          type: "error",
          position: "top",
        });
        return false;
      }
      if (!countryCode.includes("+")) {
        countryCode = "+" + countryCode;
      }

      const _phoneNumber = `${countryCode}${phoneNumber}`;
      if (vm.isValidPhonenumber(_phoneNumber)) {
        const dataToPush = {
          firstName,
          lastName,
          countryCode,
          splitPhoneNo: phoneNumber,
          phoneNumber: _phoneNumber,
          systemRole: vm.systemRole || "",
          userRoles: vm.userRolesSelected,
          organizationType: vm.organizationType,
          registered: false,
        };
        if (vm.organizationType == "Broker") {
          dataToPush["brokerMargin"] = vm.brokerMargin;
        }

        if (organizationSelected == null || organizationSelected == undefined) {
          dataToPush["organizationKey"] = localStorage.organizationKey;
          dataToPush["organization"] = localStorage.organization;
          if (vm.organizationType == "Broker")
            dataToPush["brokerOrganization"] = localStorage.organization;
        } else {
          dataToPush["organizationKey"] = this.organizationSelected.orgKey;
          dataToPush["organization"] = this.organizationSelected.name;
          if (vm.organizationType == "Broker") {
            dataToPush["brokerOrganization"] = this.organizationSelected.name;
          }
        }
        // check if phone number is already in use
        vm.ifPhoneNumberExists()
          .then((status) => {
            console.log(status);
            firebase
              .database()
              .ref()
              .child("/phoneUsers")
              .push(dataToPush)
              .then((snapshot) => {
                //working
                sendSMS(
                  phoneNumber,
                  `Ou anrejistre kòm itilizatè nan sistèm HFFVC. Pou indantifye w  itilize nimewo telefòn ou ${_phoneNumber}, apre klike sou lyen sa pou rive konekte ${
                    getConfigVars().APP_URL
                  } `,
                  countryCode
                )
                  .then((sent) => console.log(sent))
                  .catch((err) => console.log(err));
                vm.seen = false;
                Vue.$toast.open({
                  message: this.$t(
                    "New user has been added.",
                    "New user has been added."
                  ),
                  type: "success",
                  position: "top",
                });
                vm.clearAllFields();
              })
              .catch((error) => {
                console.log(error);
                Vue.$toast.open({
                  message: this.$t(
                    "Error saving user details.",
                    "Error saving user details."
                  ),
                  type: "error",
                  position: "top",
                });
                vm.clearAllFields();
              });
          })
          .catch((error) => {
            console.log(error);
            Vue.$toast.open({
              message: this.$t(
                "Phone number is already in use",
                "Phone number is already in use"
              ),
              type: "error",
              position: "top",
            });

            vm.seen = false;
          });
      } else {
        Vue.$toast.open({
          message: this.$t(
            "Please enter a valid phone number.",
            "Please enter a valid phone number."
          ),
          type: "error",
          position: "top",
        });
        vm.seen = false;
        return false;
      }
    },
    clearAllFields() {
      const vm = this;
      vm.clearSearch();
      vm.firstName = null;
      vm.lastName = null;
      vm.email = null;
      vm.roleDesc = null;
      vm.func = null;
      vm.systemRole = null;
      vm.selectedUser = null;
      vm.organizationSelected = null;
      vm.isEmptyContainer = true;
      vm.userRolesSelected = [];
      vm.harvestPlannerRole = false;
      vm.brokerMargin = null;
      vm.brokerOrganization = null;
      vm.collectorRole = false;
      vm.brokerRole = false;
      vm.isRootSpoc = false;
      vm.organizationType = false;
      vm.packhouseInchargeRole = false;
      vm.isBroker = false;
      vm.getUserList();
      vm.seen = false;
      vm.isCheckAll = false;
      vm.phoneNumber = null;
      vm.countryCode = null;
    },
    getPhoneUsers() {
      const currentVal = this;
      firebase
        .database()
        .ref()
        .child("phoneUsers")
        .orderByChild("registered")
        .equalTo(false)
        .on("child_added", (requestData) => {
          const {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            brokerMargin,
            brokerOrganization,
            organization,
            organizationKey,
            userRoles,
            organizationType,
            phoneNumber,
            countryCode,
            splitPhoneNo,
          } = requestData.val();
          let _data = {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            brokerMargin,
            brokerOrganization,
            organization,
            organizationKey,
            userRoles,
            organizationType,
            phoneNumber,
            countryCode,
            splitPhoneNo,
            unregisteredUser: true,
          };
          const dataToPush = {
            ..._data,
            func: requestData.val().function,
            snapshotKey: requestData.key,
            isSuperAdmin:
              requestData.val().function == "Super User" ? true : false,
            organizationSelected: requestData.val().organization,
          };
          if (requestData.val().status != "Disabled") {
            currentVal.userList.push(dataToPush);
            let temp = Vue._.sortBy(currentVal.userList, "firstName");
            currentVal.userList = temp;
          }
        });
    },
    hasPhoneNumberChanged() {
      const vm = this;
      console.log(vm.userToEdit);
      return (
        vm.userToEdit.countryCode != vm.countryCode ||
        vm.userToEdit.splitPhoneNo != vm.phoneNumber
      );
    },
    updateExistingPhoneUser() {
      const vm = this;
      var {
        firstName,
        lastName,
        organizationSelected,
        phoneNumber,
        countryCode,
      } = this;
      if (!countryCode.includes("+")) {
        countryCode = "+" + countryCode;
      }
      const _phoneNumber = `${countryCode}${phoneNumber}`;
      if (
        !phoneNumber ||
        !vm.isValidPhonenumber(_phoneNumber) ||
        !countryCode
      ) {
        Vue.$toast.open({
          message: vm.$t(
            "Invalid phone number or country code",
            "Invalid phone number or country code"
          ),
          type: "error",
          position: "top",
        });
        vm.seen = false;
        return false;
      }
      const dataToPush = {
        firstName,
        lastName,
        countryCode,
        splitPhoneNo: phoneNumber,
        phoneNumber: _phoneNumber,
        userRoles: vm.userRolesSelected,
        organizationType: "Logistic / Cold Chain Service Provider",
        registered: "UPDATE",
        uuid: vm.snapshotKey,
      };
      if (localStorage.systemRole == 99) {
        dataToPush["organizationKey"] = this.organizationSelected.orgKey;
        dataToPush["organization"] = this.organizationSelected.name;
      } else {
        dataToPush["organizationKey"] = localStorage.organizationKey;
        dataToPush["organization"] = localStorage.organization;
      }
      vm.ifPhoneNumberExists()
        .then((valid) => {
          console.log(valid);

          vm.getUserInPhoneUsers().then((key) => {
            console.log(key);
            firebase
              .database()
              .ref()
              .child("phoneUsers")
              .child(key)
              .update(dataToPush)
              .then((updated) => {
                console.log(updated);
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t("User data updated.", "User data updated."),
                  type: "success",
                  position: "top",
                });
                vm.clearAllFields();
                vm.seen = false;

                sendSMS(
                  phoneNumber,
                  "Dear " +
                    firstName +
                    "," +
                    "You have been registered as a user on the HFFVC. You will be able to use your phone number " +
                    _phoneNumber +
                    " as your login credentials. " +
                    "Please use this link to login: " +
                    getConfigVars().APP_URL,
                  countryCode
                )
                  .then((sent) => console.log(sent))
                  .catch((err) => console.log(err));
              })
              .catch((error) => {
                console.log(error);
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Error creating user, please try again.",
                    "Error creating user, please try again."
                  ),
                  type: "error",
                  position: "top",
                });
              });
          });
        })
        .catch((error) => {
          console.log(error);
          Vue.$toast.open({
            message: vm.$t(
              "Phone number is already registered, please try a different one.",
              "Phone number is already registered, please try a different one."
            ),
            type: "error",
            position: "top",
          });
          vm.seen = false;
        });
    },
    updateNewPhoneUser() {
      const vm = this;
      console.log("non logged user, updating phone number");
      var {
        firstName,
        lastName,
        organizationSelected,
        phoneNumber,
        countryCode,
      } = this;
      if (!countryCode.includes("+")) {
        countryCode = "+" + countryCode;
      }
      const _phoneNumber = `${countryCode}${phoneNumber}`;
      if (
        !phoneNumber ||
        !vm.isValidPhonenumber(_phoneNumber) ||
        !countryCode
      ) {
        Vue.$toast.open({
          message: vm.$t(
            "Invalid phone number or country code",
            "Invalid phone number or country code"
          ),
          type: "error",
          position: "top",
        });
        vm.seen = false;
        return false;
      }
      const dataToPush = {
        firstName,
        lastName,
        countryCode,
        splitPhoneNo: phoneNumber,
        phoneNumber: _phoneNumber,
        userRoles: vm.userRolesSelected,
        organizationType: "Logistic / Cold Chain Service Provider",
      };
      if (localStorage.systemRole == 99) {
        dataToPush["organizationKey"] = this.organizationSelected.orgKey;
        dataToPush["organization"] = this.organizationSelected.name;
      } else {
        dataToPush["organizationKey"] = localStorage.organizationKey;
        dataToPush["organization"] = localStorage.organization;
      }
      vm.ifPhoneNumberExists()
        .then((valid) => {
          console.log(valid);
          firebase
            .database()
            .ref()
            .child("phoneUsers")
            .child(vm.snapshotKey)
            .update(dataToPush)
            .then(() => {
              Vue.$toast.open({
                message: this.$t(
                  "User details updated.",
                  "User details updated."
                ),
                type: "success",
                position: "top",
              });
              vm.seen = false;
              vm.clearAllFields();
            })
            .catch((error) => {
              console.log(error);
              Vue.$toast.open({
                message: this.$t(
                  "Error updating user data.",
                  "Error updating user data."
                ),
                type: "error",
                position: "top",
              });
              vm.seen = false;
            });
        })
        .catch((error) => {
          console.log(error);
          Vue.$toast.open({
            message: vm.$t(
              "Phone number is already registered, please try a different one.",
              "Phone number is already registered, please try a different one."
            ),
            type: "error",
            position: "top",
          });
          vm.seen = false;
        });
    },
    getUserInPhoneUsers() {
      const vm = this;
      return new Promise((resolve, reject) => {
        firebase
          .database()
          .ref()
          .child("phoneUsers")
          .orderByChild("phoneNumber")
          .equalTo(vm.userToEdit.phoneNumber)
          .once("value", (snapshot) => {
            console.log(snapshot.val());
            console.log(snapshot.key);
            const key = Object.keys(snapshot.val())[0];
            console.log(key);
            resolve(key);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    setphoneNumberEditable() {
      const vm = this;
      if (vm.pageTitle == vm.$t("Edit User Details", "Edit User Details")) {
        if (vm.userToEdit) {
          if (!vm.userToEdit.phoneNumber) {
            vm.phoneNumberEditable = false;
          } else {
            vm.phoneNumberEditable = true;
          }
        }
      } else {
        vm.phoneNumberEditable = true;
      }
    },
  },
};
</script>
<style scoped>
.grant-privilage-container .lbl-pickup-sa {
  margin-left: -9px !important;
}
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
.inp-bda {
  height: 34px !important;
}
.rolesel .vs__dropdown-toggle {
  height: 34px !important;
}
.clear {
  clear: both;
}
.close-details {
  margin-top: -16px !important;
}
.sa-left-scroll {
  padding: 1.25em !important;
  min-height: 379px !important;
  max-height: 379px !important;
}
.card-body {
  padding: 0rem !important;
}
.manageUserOuterContainer {
  width: 98% !important;
}
/* .ps{
  height:0px !important;
} */
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";

.ps {
  height: 399px;
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
  display: flex;
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
.main-container-manage-users {
  border: 0.5px solid #000;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0px 0px 5px 5px;
  border: 1px solid #000;
  border-top: 0px !important;
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}
.edit-user-container {
  float: left;
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
.e-input-group:not(.e-success):not(.e-warning):not(.e-error):not(.e-float-n-left),
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
  height: 36px;
}
.inp-firstname {
  width: 100%;
  background-image: url("../../assets/images/user.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-lastname {
  width: 100%;
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 0px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-bda {
  width: 100%;
  /* background-image: url("../../assets/images/edit_record.png"); */
  background-repeat: no-repeat;
  background-position: left;
  /* padding-left: 30px; */
  background-size: 20px 20px;
  height: 36px;
}
.inp-function {
  width: 100%;
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.inp-email {
  width: 100%;
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 30px;
  background-size: 20px 20px;
  height: 36px;
}
.email-container {
  padding: 0px;
  margin: -20px;
}
.grant-privilage-container {
  float: left;
  padding-top: 5px;
  margin-left: 10px;
  margin-top: 5px;
  text-align: left;
}
.grant-privilage {
  float: left;
  margin-left: 10px;
  margin-top: -2px;
}
.close-details {
  height: 16px;
  float: right;
  margin-top: -30px !important;
  cursor: pointer;
}
.sa-left-scroll {
  min-height: 360px;
  max-height: 360px;
  overflow: hidden;
}
.dropdownlist {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff !important;
  height: 36px;
}
#dropdownlist_hidden {
  float: right;
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  width: 100%;
  color: #fff;
  height: 36px;
}
.role-descriptions {
  background-image: url("../../assets/images/user_role.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  position: absolute !important;
  width: 100% !important;
  color: #fff !important;
}
label > input:checked + img {
  background: url("../../assets/images/tick.png");
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 10px 10px;
}
.function-dropdown {
  display: inline;
  font-size: 13px;
}
.e-input-group:not(.e-disabled) .e-input-group-icon:hover,
.e-input-group.e-control-wrapper:not(.e-disabled) .e-input-group-icon:hover {
  color: #fff !important;
}
.name-container {
  width: 40%;
  float: left;
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
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
}
.inp-half-first-name {
  width: 45%;
  float: left;
  margin-right: 20px;
}
.manage-users-txt-search {
  float: left;
  background: none;
  border: none;
  border-bottom: 0.5px solid #fff;
  width: 170px;
  padding-left: 20px;
  margin-right: -30px;
  z-index: 999 !important;
  position: relative;
  color: #fff;
}
.accnt-details-heading {
  color: #fff;
  text-align: left;
  margin: 20px 0px;
}
.user-roles-selection {
  display: flex;
  margin: 5px;
  color: white;
}
.user-role-checkbox-label {
  padding-left: 10px;
  padding-right: 10px;
}
.padding-left-10 {
  padding-left: 10px;
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
  margin-top: -12px !important;
}
#confirm-delete-modal .modal-header h5 {
  margin: -10px auto !important;
}
#confirm-delete-modal .modal-content {
  width: 350px;
  margin: 0 auto;
  color: #fff;
}
.country-code {
  width: 20%;
  float: left;
  margin-right: 20px;
}
.phone-number {
  width: 70%;
  /* float: left; */
  margin-right: 20px;
}
</style>
