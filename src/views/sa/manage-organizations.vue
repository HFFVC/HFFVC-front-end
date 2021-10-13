<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container new-org-header">
          <div>
            <h6 class="heading">
              {{ $t("Registered Organizations", "Registered Organizations") }}
            </h6>
            <div style="clear: both"></div>
            <div class="search-container-org">
              <div class="seacrch-container-org-label">
                <span>Search:</span>
              </div>
              <div class="seacrch-container-org-searchbox">
                <span class="serbox">
                  <img
                    class="search-icon"
                    src="../../assets/images/search.png"
                  />
                  <input
                    type="text"
                    v-model="searchTerm"
                    class="manage-users-txt-search"
                    @keyup="searchElement"
                    @keyup.enter="searchElement"
                    :placeholder="$t('Organization Name', 'Organization Name')"
                  />
                </span>
              </div>
            </div>
            <img
              class="close-search-icon"
              v-on:click="clearSearch()"
              v-if="closeSearch"
              src="../../assets/images/close.png"
            />
          </div>
          <div style="clear: both"></div>
          <div class="filter-container">
            <label class="filter-lbl-container">Filter:</label>
            <div class="filter-select-container">
              <v-select
                v-model="filteredOrganizationType"
                :placeholder="$t('Organization Type', 'Organization Type')"
                class="manage-bank-accountsv-select"
                :options="organizationTypeList"
                @input="filterListByOrgType()"
              ></v-select>
            </div>
          </div>
        </div>

        <div class="main-container-manage-packhouses">
          <div class="emptyContainer" v-if="organizationsList.length == 0">
            <h2 class="card-inside-description">
              {{ $t("No data to display", "No data to display") }}
            </h2>
          </div>
          <perfect-scrollbar class="manage-packhouses-ps">
            <div class="card-body" v-if="!searchEnabled">
              <div
                class="outer-container"
                v-for="organization in organizationsList"
                :key="organization.snapshotKey"
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
                    <b>{{ organization.name }}</b>
                    <input
                      v-if="
                        organization.organizationType == 'Root Authority'
                          ? isMasterSuperUser
                          : true
                      "
                      type="radio"
                      name="username"
                      @click="editOrganizationDetails(organization)"
                      :checked="organization.snapshotKey == snapshotKey"
                    />
                    <img
                      v-if="
                        organization.organizationType == 'Root Authority'
                          ? isMasterSuperUser
                          : true
                      "
                    />
                    <button
                      title="Delete"
                      v-if="
                        organization.organizationType == 'Root Authority'
                          ? isMasterSuperUser
                          : true
                      "
                      class="delete-option"
                      @click="showConfirmDialog(organization)"
                    >
                      X
                    </button>
                  </label>

                  <label class="lbl-flname lbl-pickup"
                    >{{ organization.countryCode
                    }}{{ organization.contactNumber }}</label
                  >
                  <label class="lbl-flname lbl-pickup">{{
                    organization.emailAddress
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    organization.organizationAddress
                  }}</label>
                  <br />
                </div>
              </div>
            </div>
            <div class="card-body" v-if="searchEnabled">
              <div
                class="outer-container"
                v-for="organization in searchResults"
                :key="organization.snapshotKey"
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
                    <b>{{ organization.name }}</b>
                    <input
                      v-if="
                        organization.organizationType == 'Root Authority'
                          ? isMasterSuperUser
                          : true
                      "
                      type="radio"
                      name="username"
                      @click="editOrganizationDetails(organization)"
                      :checked="organization.snapshotKey == snapshotKey"
                    />
                    <img
                      v-if="
                        organization.organizationType == 'Root Authority'
                          ? isMasterSuperUser
                          : true
                      "
                    />
                    <button
                      v-if="
                        organization.organizationType == 'Root Authority'
                          ? isMasterSuperUser
                          : true
                      "
                      class="delete-option"
                      @click="showConfirmDialog(organization)"
                    >
                      X
                    </button>
                  </label>

                  <label class="lbl-flname lbl-pickup"
                    >{{ organization.countryCode }}
                    {{ organization.contactNumber }}</label
                  >
                  <label class="lbl-flname lbl-pickup">{{
                    organization.emailAddress
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    organization.organizationAddress
                  }}</label>
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
            :value="$t('Create New Organization', 'Create New Organization')"
            @click="createNewOrganization"
          />
        </div>
      </div>

      <!-- right side container -->
      <div class="col-md-7 details-container">
        <div class="header-container new-org-header">
          <h6 class="heading set-margin">{{ $t(pageTitle, pageTitle) }}</h6>
          <div>
            <img
              @click="showDashboard"
              class="close-details"
              src="../../assets/images/close.png"
            />
          </div>
        </div>

        <div
          class="
            main-container-manage-packhouses
            manage-bank-accounts-main-container
          "
        >
          <perfect-scrollbar>
            <div class="card-body manage-packhouses-field-wrap">
              <div class="emptyContainer" v-if="!organizationSelected">
                <h2 class="card-inside-description">
                  {{ $t("No data to display", "No data to display") }}
                </h2>
              </div>

              <div v-if="organizationSelected">
                <h4 class="accnt-details-heading">
                  {{ $t("Organization Info", "Organization Info") }}
                </h4>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Name', 'Name')"
                    class="inp-details"
                    type="text"
                    v-model="name"
                  />
                </div>
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

                <h4 class="accnt-details-heading">
                  {{ $t("Organization Type", "Organization Type") }}
                </h4>
                <div class="inp-container">
                  <v-select
                    v-model="organizationType"
                    :placeholder="$t('Organization Type', 'Organization Type')"
                    class="manage-bank-accountsv-select"
                    :options="organizationTypeList"
                    @input="filterUserData()"
                  ></v-select>
                </div>
                <div class="inp-container">
                  <input
                    v-if="organizationType == 'Broker'"
                    :placeholder="$t('Broker Margin', 'Broker Margin')"
                    class="inp-details"
                    type="text"
                    v-model="brokerMargin"
                  />
                </div>

                <div class="inp-container">
                  <input
                    v-if="organizationType == 'Technology Service Provider'"
                    :placeholder="$t('% Distribution', '% Distribution')"
                    class="inp-details"
                    type="text"
                    v-model="percentDistribution"
                  />
                </div>
                <div class="inp-container">
                  <input
                    v-if="organizationType == 'Extension Services'"
                    :placeholder="$t('% Distribution', '% Distribution')"
                    class="inp-details"
                    type="text"
                    v-model="percentDistribution"
                  />
                </div>

                <div
                  class="inp-container"
                  v-if="
                    organizationType == 'Logistic / Cold Chain Service Provider'
                  "
                >
                  <label class="lbl-percent">{{
                    $t("Distributions", "Distributions")
                  }}</label>

                  <table border="1" class="table white-fonts col-md-12">
                    <tr>
                      <th>{{ $t("Product", "Product") }}</th>
                      <th>% {{ $t("Distribution", "Distribution") }}</th>
                      <th>
                        {{ $t("ESCROW Account No.", "ESCROW Account No.") }}
                      </th>
                      <th>{{ $t("Edit", "Edit") }}</th>
                    </tr>
                    <tr
                      v-for="(item, index) in existingDistributions"
                      :key="index"
                    >
                      <td>{{ $t(item.fruit, item.fruit) }}</td>
                      <td>{{ item.percentage }}</td>
                      <td>{{ item.productEscrowAcNo }}</td>
                      <td>
                        <span @click="editDistribution(item, index)"
                          ><img
                            title="Edit"
                            class="edit-delete-img"
                            src="../../assets/images/edit_record.png"
                        /></span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <v-select
                          v-model="distributionFruit"
                          :placeholder="$t('Select Product', 'Select Product')"
                          class="manage-bank-accountsv-select"
                          :options="fruitsList"
                        ></v-select>
                      </td>

                      <td>
                        <input
                          :placeholder="$t('% Distribution', '% Distribution')"
                          class="inp-details margin-top-15"
                          type="text"
                          v-model="percentageDistribution"
                        />
                      </td>
                      <td>
                        <input
                          :placeholder="
                            $t('ESCROW Account No.', 'ESCROW Account No.')
                          "
                          class="inp-details margin-top-15"
                          type="text"
                          v-model="productEscrowAcNo"
                        />
                      </td>
                      <td>
                        <input
                          type="button"
                          class="btn-save sa-packhouse-btn"
                          :value="addDistributionButtonTitle"
                          @click="addDistribution()"
                        />
                      </td>
                    </tr>
                  </table>
                </div>
                <!-- <h4
                  class="accnt-details-heading"
                  v-if="
                    organizationType == 'Logistic / Cold Chain Service Provider'
                  "
                >
                  {{ $t("Escrow Account Number", "Escrow Account Number") }}
                </h4>
                <div
                  class="inp-container"
                  v-if="
                    organizationType == 'Logistic / Cold Chain Service Provider'
                  "
                >
                  <input
                    :placeholder="
                      $t('Escrow Account Number', 'Escrow Account Number')
                    "
                    class="inp-details"
                    type="text"
                    v-model="escrowAccountNumber"
                  />
                </div> -->
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

                <h4 class="accnt-details-heading">
                  {{ $t("SPOC Details", "SPOC Details") }}
                </h4>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('First Name', 'First Name')"
                    class="inp-details"
                    type="text"
                    v-model="spocFirstName"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Last Name', 'Last Name')"
                    class="inp-details"
                    type="text"
                    v-model="spocLastName"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Email Address', 'Email Address')"
                    class="inp-details"
                    type="text"
                    v-model="spocEmail"
                  />
                </div>

                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Contact Number', 'Contact Number')"
                    class="inp-details"
                    type="number"
                    v-model="spocContactNo"
                  />
                </div>

                <div class="inp-container">
                  <input
                    :placeholder="$t('Address', 'Address')"
                    class="inp-details"
                    type="text"
                    v-model="spocAddress"
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="organizationSelected">
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
            @click="saveOrganization"
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
            "All the users under this organization will also be deleted. Do you still want to delete the organization ",
            "All the users under this organization will also be deleted. Do you still want to delete the organization "
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
          v-on:click="deleteOrganization()"
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
  name: "manage-organizations",
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
    this.fruitsList = [
      this.$t("Avocado", "Avocado"),
      this.$t("Mango", "Mango"),
      this.$t("Pineapple", "Pineapple"),
    ];
    if (
      localStorage.systemRole == 99 &&
      getConfigVars().USERID == isAuthenticated()
    ) {
      this.isMasterSuperUser = true;
      this.checkIfMCIExists();
    }

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
          text: this.$t("Manage Organizations", "Manage Organizations"),
          href: "/manage-organizations",
        },
      ]);
    } else {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Manage Organizations", "Manage Organizations"),
          href: "/manage-organizations",
        },
      ]);
    }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t("Organization Details", "Organization Details");
    this.getBankList();
    this.loadOrganizationDetails();
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
          console.log(error);
        });
    },
    filterListByOrgType: function () {
      if (
        this.filteredOrganizationType == null ||
        this.filteredOrganizationType == ""
      ) {
        this.loadOrganizationDetails();
      } else {
        let vm = this;
        this.organizationsList = [];
        vm.seen = true;
        const ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("organization")
          .orderByChild("organizationType")
          .equalTo(vm.filteredOrganizationType);

        ref.on("child_added", function (requestData) {
          console.log(requestData.val());
          var data = {
            Address: requestData.val().Address,
            Town: requestData.val().Town,
            accountNumber: requestData.val().accountNumber,
            identificationNo: requestData.val().identificationNo,
            emailAddress: requestData.val().emailAddress,
            organizationCurrency: requestData.val().organizationCurrency,
            bankName: requestData.val().bankName,
            contactNumber: requestData.val().contactNumber,
            countryCode: requestData.val().countryCode,
            name: requestData.val().name,
            typeOfAccount: requestData.val().typeOfAccount,
            emailAddress: requestData.val().emailAddress,
            organizationAddress: requestData.val().organizationAddress,
            snapshotKey: requestData.key,
            spocAddress: requestData.val().spocAddress,
            spocFirstName: requestData.val().spocFirstName,
            spocLastName: requestData.val().spocLastName,
            spocEmail: requestData.val().spocEmail,
            spocAddress: requestData.val().spocAddress,
            spocContactNo: requestData.val().spocContactNo,
            organizationType: requestData.val().organizationType,
            zipCode: requestData.val().zipCode,
            brokerMargin: requestData.val().brokerMargin,
            percentDistribution: requestData.val().percentDistribution,
            mangoPercent: requestData.val().mangoPercent,
            avocadoPercent: requestData.val().avocadoPercent,
            pineapplePercent: requestData.val().pineapplePercent,
            escrowAccountNumber: requestData.val().escrowAccountNumber,
            avocadoEscrowAccNo: requestData.val().avocadoEscrowAccNo || "",
            mangoEscrowAccNo: requestData.val().mangoEscrowAccNo || "",
            pineappleEscrowAccNo: requestData.val().pineappleEscrowAccNo || "",
          };
          if (requestData.val().status != "Disabled") {
            vm.organizationsList.push(data);
          }

          vm.seen = false;
        });
        setTimeout(function () {
          if (vm.organizationsList.length == 0) {
            vm.seen = false;
          }
        }, 3000);
      }
    },
    filterUserData: function () {
      if (this.organizationType == "Technology Service Provider") {
        this.organizationType = null;
        Vue.$toast.open({
          message: this.$t(
            "System can have only one Technology Service Provider",
            "System can have only one Technology Service Provider"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.organizationType == "Root Authority") {
        this.organizationType = null;
        Vue.$toast.open({
          message: this.$t(
            "System can have only one Root Authority Organization",
            "System can have only one Root Authority Organization"
          ),
          type: "error",
          position: "top",
        });
      } else if (this.organizationType == "Broker") {
        this.brokerOrg = true;
      } else {
        this.brokerOrg = false;
      }
    },
    showDashboard: () => Router.push("sa-dashboard"),
    loadOrganizationDetails: function () {
      if (
        localStorage.systemRole == 99 &&
        getConfigVars().USERID == isAuthenticated()
      ) {
        this.checkIfMCIExists();
      }
      let vm = this;
      this.organizationsList = [];
      vm.seen = true;
      const ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization");

      ref.on("child_added", function (requestData) {
        console.log(requestData.val());
        var data = {
          Address: requestData.val().Address,
          Town: requestData.val().Town,
          accountNumber: requestData.val().accountNumber,
          identificationNo: requestData.val().identificationNo,
          emailAddress: requestData.val().emailAddress,
          organizationCurrency: requestData.val().organizationCurrency,
          bankName: requestData.val().bankName,
          contactNumber: requestData.val().contactNumber,
          countryCode: requestData.val().countryCode,
          name: requestData.val().name,
          typeOfAccount: requestData.val().typeOfAccount,
          emailAddress: requestData.val().emailAddress,
          organizationAddress: requestData.val().organizationAddress,
          snapshotKey: requestData.key,
          spocAddress: requestData.val().spocAddress,
          spocFirstName: requestData.val().spocFirstName,
          spocLastName: requestData.val().spocLastName,
          spocEmail: requestData.val().spocEmail,
          spocAddress: requestData.val().spocAddress,
          spocContactNo: requestData.val().spocContactNo,
          organizationType: requestData.val().organizationType,
          zipCode: requestData.val().zipCode,
          brokerMargin: requestData.val().brokerMargin,
          percentDistribution: requestData.val().percentDistribution,
          mangoPercent: requestData.val().mangoPercent,
          avocadoPercent: requestData.val().avocadoPercent,
          pineapplePercent: requestData.val().pineapplePercent,
          escrowAccountNumber: requestData.val().escrowAccountNumber,
          avocadoEscrowAccNo: requestData.val().avocadoEscrowAccNo || "",
          mangoEscrowAccNo: requestData.val().mangoEscrowAccNo || "",
          pineappleEscrowAccNo: requestData.val().pineappleEscrowAccNo || "",
        };
        if (requestData.val().status != "Disabled") {
          vm.organizationsList.push(data);
          let temp = Vue._.sortBy(vm.organizationsList, "name");
          vm.organizationsList = temp;
        }

        vm.seen = false;
      });
      setTimeout(function () {
        if (vm.organizationsList.length == 0) {
          vm.seen = false;
        }
      }, 3000);
    },
    createNewOrganization: function () {
      this.snapshotKey = null;
      this.organizationSelected = true;
      this.pageTitle = this.$t("Organization Details", "Organization Details");
      this.bankName = null;
      this.typeOfAccount = null;
      this.accountNumber = null;
      this.identificationNo = null;
      this.organizationCurrency = null;
      this.Address = null;
      this.Town = null;
      this.contactNumber = null;
      this.countryCode = null;
      this.name = null;
      this.emailAddress = null;
      this.editFlag = false;
      this.organizationAddress = null;
      this.organizationType = null;
      this.zipCode = null;
      this.brokerMargin = null;
      this.spocAddress = null;
      this.spocFirstName = null;
      this.spocLastName = null;
      this.spocEmail = null;
      this.spocContactNo = null;
      this.isDisabled = false;
      this.percentDistribution = null;
      this.mangoPercent = null;
      this.avocadoPercent = null;
      this.pineapplePercent = null;
      this.escrowAccountNumber = null;
      this.existingDistributions = [];
    },
    editOrganizationDetails: function ({
      Address,
      Town,
      name,
      contactNumber,
      countryCode,
      organizationCurrency,
      bankName,
      organizationAddress,
      accountNumber,
      identificationNo,
      typeOfAccount,
      emailAddress,
      snapshotKey,
      spocAddress,
      spocFirstName,
      spocLastName,
      spocEmail,
      spocContactNo,
      organizationType,
      zipCode,
      brokerMargin,
      percentDistribution,
      mangoPercent,
      avocadoPercent,
      pineapplePercent,
      escrowAccountNumber,

      mangoEscrowAccNo,
      avocadoEscrowAccNo,
      pineappleEscrowAccNo,
    }) {
      this.existingDistributions = [];
      if (organizationType == "Logistic / Cold Chain Service Provider") {
        if (avocadoPercent && avocadoPercent > 0) {
          this.existingDistributions.push({
            fruit: "Avocado",
            percentage: avocadoPercent,
            productEscrowAcNo: avocadoEscrowAccNo || "",
          });
        }
        if (mangoPercent && mangoPercent > 0) {
          this.existingDistributions.push({
            fruit: "Mango",
            percentage: mangoPercent,
            productEscrowAcNo: mangoEscrowAccNo || "",
          });
        }
        if (pineapplePercent && pineapplePercent > 0) {
          this.existingDistributions.push({
            fruit: "Pineapple",
            percentage: pineapplePercent,
            productEscrowAcNo: pineappleEscrowAccNo || "",
          });
        }
      }
      //(organizationType == "Technology Service Provider" &&localStorage.emailId != getConfigVars().emailId)) || (localStorage.systemRole != 99)
      if (localStorage.systemRole != 99) {
        Vue.$toast.open({
          message: this.$t(
            "You don't have permission to edit the Technology Service Provider Data.",
            "You don't have permission to edit the Technology Service Provider Data."
          ),
          type: "error",
          position: "top",
        });
        $("input:radio[name=username]:checked").prop("checked", false);
      } else {
        this.editFlag = true;
        this.organizationSelected = true;
        this.name = name;
        this.Address = Address;
        this.Town = Town;
        this.contactNumber = contactNumber;
        this.countryCode = countryCode;
        this.accountNumber = accountNumber;
        (this.identificationNo = identificationNo),
          (this.emailAddress = emailAddress);
        this.bankName = bankName;
        this.typeOfAccount = typeOfAccount;
        this.zipCode = zipCode;
        this.organizationCurrency = organizationCurrency;
        this.organizationAddress = organizationAddress;
        this.snapshotKey = snapshotKey;
        this.organizationType = organizationType;
        this.brokerMargin = brokerMargin;
        this.spocContactNo = spocContactNo;
        this.spocFirstName = spocFirstName;
        this.spocLastName = spocLastName;
        this.spocEmail = spocEmail;
        this.spocAddress = spocAddress;
        this.percentDistribution = percentDistribution;
        this.mangoPercent = mangoPercent;
        this.avocadoPercent = avocadoPercent;
        this.pineapplePercent = pineapplePercent;
        this.escrowAccountNumber = escrowAccountNumber;
        this.isDisabled = true;
      }
    },
    sendEmailToSogeBank(name, orgKey) {
      var currentVal = this;
      var body =
        "<p>Hello Soge Bank Team, <br/><br/> " +
        "New LSP organization created in the sytem. " +
        "Please find the Organization name and unique identifier details below," +
        "<br /><b>Organization Name : </b>" +
        name +
        "<br /><b>Unique Indentifier : </b>" +
        orgKey +
        "<br /><br />Thank you.</p>";
      var data = {
        to: ["divya.d@sysfore.com"],
        cc: [],
        subject: "New LSP Organization Registered",
        emailBody: body,
      };
      currentVal.axios
        .post(`${getConfigVars().BASE_URL}50011/api/v1.0/trigger-email`, data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.IDtoken,
          },
        })
        .then(function (response) {})
        .catch(function (error) {
          //alert("fail");
          //refresh token
          let errorObject = JSON.parse(JSON.stringify(error));
          if (
            error.response.status == 401 ||
            errorObject.message.indexOf("401") > -1
          ) {
            firebase
              .auth()
              .currentUser.getIdToken(true)
              .then((idtoken) => {
                localStorage.IDtoken = "";
                localStorage.IDtoken = idtoken;
                currentVal
                  .sendEmailToSogeBank(serviceId, inpData)
                  .then((res) => resolve(res))
                  .catch((err) => reject(err));
              });
          } else {
            reject(error);
          }
        });
    },
    saveOrganization: function () {
      var errorFlag = false;
      var currentSnapshotKey = null;
      const vm = this;
      const ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization");
      ref.on("child_added", (snapshot) => {
        if (snapshot.val().name == this.name) {
          errorFlag = true;
          currentSnapshotKey = snapshot.key;
        }
      });
      const randomPassword = vm.generatePassword();

      vm.seen = true;
      if (!vm.editFlag) {
        if (!errorFlag) {
          for (var i = 0; i < this.banksWithCode.length; i++) {
            if (vm.banksWithCode[i].Name == this.bankName) {
              vm.bankCode = this.banksWithCode[i].Code;
            }
          }
          const {
            Address,
            Town,
            name,
            contactNumber,
            countryCode,
            organizationCurrency,
            bankName,
            emailAddress,
            accountNumber,
            identificationNo,
            typeOfAccount,
            organizationAddress,
            bankCode,
            spocFirstName,
            spocLastName,
            spocEmail,
            spocContactNo,
            spocAddress,
            organizationType,
            zipCode,
            brokerMargin,
            percentDistribution,
            // mangoPercent,
            // avocadoPercent,
            // pineapplePercent,
            escrowAccountNumber,
          } = this;
          const data = {
            Address,
            Town,
            name,
            contactNumber,
            countryCode,
            organizationCurrency,
            // bankName,
            emailAddress,
            // accountNumber,
            identificationNo,
            // typeOfAccount,
            organizationAddress,
            // bankCode,
            spocFirstName,
            spocLastName,
            spocEmail,
            spocContactNo,
            spocAddress,
            organizationType,
            zipCode,
            percentDistribution,
            // mangoPercent,
            // avocadoPercent,
            // pineapplePercent,
            escrowAccountNumber,
          };

          if (
            Address &&
            Address != null &&
            Town &&
            Town != null &&
            name &&
            name != null &&
            contactNumber &&
            contactNumber != null &&
            countryCode &&
            countryCode != null &&
            organizationCurrency &&
            organizationCurrency != null &&
            // bankName &&
            // bankName != null &&
            emailAddress &&
            emailAddress != null &&
            // accountNumber &&
            // accountNumber != null &&
            identificationNo &&
            identificationNo != null &&
            // typeOfAccount &&
            // typeOfAccount != null &&
            organizationAddress &&
            organizationAddress != null &&
            // bankCode &&
            // bankCode != null &&
            spocFirstName &&
            spocFirstName != null &&
            spocLastName &&
            spocLastName != null &&
            spocEmail &&
            spocEmail != null &&
            spocContactNo &&
            spocContactNo != null &&
            spocAddress &&
            spocAddress != null &&
            organizationType != null
            // && zipCode != null &&
            // zipCode != ""
          ) {
            if (organizationType != "Broker") {
              if (
                !bankCode ||
                !accountNumber ||
                !typeOfAccount ||
                !bankCode ||
                bankName == null ||
                bankName == "" ||
                accountNumber == null ||
                accountNumber == "" ||
                typeOfAccount == null ||
                typeOfAccount == "" ||
                bankCode == null ||
                bankCode == ""
              ) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please add bank details.",
                    "Please add bank details."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              }
            }
            data.accountNumber = accountNumber ? accountNumber : "";
            data.typeOfAccount = typeOfAccount ? typeOfAccount : "";
            data.bankName = bankName ? bankName : "";
            data.bankCode = bankCode ? bankCode : "";

            if (organizationType == "Broker") {
              if (
                brokerMargin == null ||
                brokerMargin == "" ||
                brokerMargin == undefined
              ) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please add broker margin.",
                    "Please add broker margin."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              } else {
                data.brokerMargin = brokerMargin;
              }
            } else if (
              organizationType == "Extension Services" ||
              organizationType == "Technology Service Provider"
            ) {
              if (
                percentDistribution == null ||
                percentDistribution == "" ||
                percentDistribution == undefined
              ) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please enter % Distribution.",
                    "Please enter % Distribution."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              } else {
                data.percentDistribution = percentDistribution;
              }
            } else if (
              organizationType == "Logistic / Cold Chain Service Provider"
            ) {
              if (!vm.existingDistributions.length) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please enter at least one distribution.",
                    "Please enter at least one distribution."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              }
              vm.existingDistributions.forEach((item) => {
                if (item.fruit == "Avocado") {
                  data.avocadoPercent = item.percentage;
                  data.avocadoEscrowAccNo = item.avocadoEscrowAccNo;
                } else if (item.fruit == "Mango") {
                  data.mangoPercent = item.percentage;
                  data.mangoEscrowAccNo = item.mangoEscrowAccNo;
                } else if (item.fruit == "Pineapple") {
                  data.pineapplePercent = item.percentage;
                  data.pineappleEscrowAccNo = item.pineappleEscrowAccNo;
                }
              });
              // if (
              //   mangoPercent != null &&
              //   mangoPercent != "" &&
              //   mangoPercent != undefined &&
              //   avocadoPercent != null &&
              //   avocadoPercent != "" &&
              //   avocadoPercent != undefined &&
              //   pineapplePercent != null &&
              //   pineapplePercent != "" &&
              //   pineapplePercent != undefined
              // ) {
              //   data.mangoPercent = mangoPercent;
              //   data.pineapplePercent = pineapplePercent;
              //   data.avocadoPercent = avocadoPercent;
              // } else {
              //   vm.seen = false;
              //   Vue.$toast.open({
              //     message: vm.$t(
              //       "Please enter % Distribution.",
              //       "Please enter % Distribution."
              //     ),
              //     type: "error",
              //     position: "top",
              //   });
              //   return false;
              // }
            }
            // check if email ids are valid
            let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
            if (!pattern.test(emailAddress)) {
              vm.seen = false;
              Vue.$toast.open({
                message: this.$t(
                  "Please enter a valid organization email address.",
                  "Please enter a valid organization email address."
                ),
                type: "error",
                position: "top",
              });
              return false;
            }
            if (!pattern.test(spocEmail)) {
              vm.seen = false;
              Vue.$toast.open({
                message: this.$t(
                  "Please enter a valid SPOC email address.",
                  "Please enter a valid SPOC email address."
                ),
                type: "error",
                position: "top",
              });
              return false;
            }
            // create a new user and send email
            firebase
              .auth()
              .createUserWithEmailAndPassword(spocEmail, randomPassword)
              .then((response) => {
                console.log(response);
                const userKey = response.user.uid;
                mailService(
                  spocEmail,
                  `${spocFirstName} ${spocLastName}`,
                  randomPassword
                )
                  .then((emailSent) => {
                    Vue.$toast.open({
                      message: vm.$t("Email sent", "Email sent"),
                      position: "top",
                      type: "success",
                    });
                    // update user data in profile

                    let userData = {
                      firstName: vm.spocFirstName,
                      lastName: vm.spocLastName,
                      email: spocEmail,
                      roleDesc: vm.organizationType,
                      function: vm.organizationType,
                      systemRole: (function () {
                        if (vm.organizationType == "Root Authority") {
                          return 99;
                        } else if (vm.organizationType == "Broker") {
                          return 97;
                        } else if (
                          vm.organizationType ==
                          "Logistic / Cold Chain Service Provider"
                        ) {
                          return 96;
                        } else if (
                          vm.organizationType == "Financial Services"
                        ) {
                          return 98;
                        } else if (
                          vm.organizationType == "Extension Services"
                        ) {
                          return 91;
                        } else if (
                          vm.organizationType == "Technology Service Provider"
                        ) {
                          return 99;
                        } else if (vm.organizationType == "Auditor") {
                          return 89;
                        } else {
                          return 0;
                        }
                      })(),
                      // organizationKey: organizationKey,
                      organization: vm.name,
                      organizationType: vm.organizationType,
                    };
                    if (vm.organizationType == "Broker") {
                      userData["brokerMargin"] = vm.brokerMargin;
                    }
                    firebase
                      .database()
                      .ref()
                      .child("profile")
                      .child(userKey)
                      .set(userData)
                      .then((inserted) => {
                        console.log(inserted);
                        console.log("user created.");
                        // creating the new organization
                        firebase
                          .database()
                          .ref()
                          .child("masters")
                          .child("organization")
                          .push(data)
                          .then((orgSnapshot) => {
                            let _organizationKey = orgSnapshot.key;
                            let mappingData = {};
                            mappingData[userKey] = userKey;
                            // add user organization mapping
                            firebase
                              .database()
                              .ref()
                              .child("OrganizationUserMapping")
                              .child(_organizationKey)
                              .update(mappingData)
                              .then((mapped) => {
                                console.log(mapped);

                                // update organization type and key in profile
                                let orgData = {
                                  organizationKey: _organizationKey,
                                };
                                firebase
                                  .database()
                                  .ref()
                                  .child("profile")
                                  .child(userKey)
                                  .update(orgData)
                                  .then(() => {
                                    //work here
                                    if (
                                      vm.organizationType ==
                                      "Logistic / Cold Chain Service Provider"
                                    ) {
                                      vm.sendEmailToSogeBank(
                                        vm.name,
                                        _organizationKey
                                      );
                                      vm.seen = false;
                                      Vue.$toast.open({
                                        message: vm.$t(
                                          "New organization details has been added.",
                                          "New organization details has been added."
                                        ),
                                        type: "success",
                                        position: "top",
                                      });
                                      vm.clearFields();
                                      vm.loadOrganizationDetails();
                                      vm.clearSearch();
                                      vm.clearAll();
                                    } else {
                                      vm.seen = false;
                                      Vue.$toast.open({
                                        message: vm.$t(
                                          "New organization details has been added.",
                                          "New organization details has been added."
                                        ),
                                        type: "success",
                                        position: "top",
                                      });
                                      vm.clearFields();
                                      vm.loadOrganizationDetails();
                                      vm.clearSearch();
                                      vm.clearAll();
                                    }
                                  })
                                  .catch(() => {
                                    console.log(
                                      "error updating org data in profile"
                                    );
                                    vm.seen = false;
                                  });
                              })
                              .catch(() => {
                                vm.seen = false;
                                Vue.$toast.open({
                                  message: vm.$t(
                                    "Failed to create new organization.",
                                    "Failed to create new organization."
                                  ),
                                  type: "error",
                                  position: "top",
                                });
                                vm.clearSearch();
                                vm.clearAll();
                              });
                          })
                          .catch(() => {
                            vm.seen = false;
                            Vue.$toast.open({
                              message: vm.$t(
                                "Error creating new organization",
                                "Error creating new organization"
                              ),
                              type: "error",
                              position: "top",
                            });
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        vm.seen = false;
                        Vue.$toast.open({
                          message: vm.$t(
                            "Error pushing new user data in database",
                            "Error pushing new user data in database"
                          ),
                          position: "top",
                          type: "success",
                        });
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    vm.seen = false;
                    Vue.$toast.open({
                      message: vm.$t(
                        "Could not send the email.",
                        "Could not send the email."
                      ),
                      type: "error",
                      position: "top",
                    });
                  });
              })
              .catch((error) => {
                console.log(error);
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "SPOC email id already in use, try another email id.",
                    "SPOC email id already in use, try another email id."
                  ),
                  type: "error",
                  position: "top",
                });
              });
          } else {
            Vue.$toast.open({
              message: vm.$t(
                "Please fill out all the fields.",
                "Please fill out all the fields."
              ),
              type: "error",
              position: "top",
            });
            vm.seen = false;
          }
        } else {
          vm.seen = false;
          Vue.$toast.open({
            message: this.$t(
              "Organization details already exists. Select from the list to edit.",
              "Organization details already exists. Select from the list to edit."
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
            name: this.name,
            contactNumber: this.contactNumber,
            countryCode: this.countryCode,
            organizationCurrency: this.organizationCurrency,
            // bankName: this.bankName,
            emailAddress: this.emailAddress,
            // accountNumber: this.accountNumber,
            identificationNo: this.identificationNo,
            // typeOfAccount: this.typeOfAccount,
            organizationAddress: this.organizationAddress,
            // bankCode: this.bankCode,
            spocFirstName: this.spocFirstName,
            spocLastName: this.spocLastName,
            spocContactNo: this.spocContactNo,
            spocEmail: this.spocEmail,
            spocAddress: this.spocAddress,
            organizationType: this.organizationType,

            // zipCode: this.zipCode,

            // escrowAccountNumber : ""
          };
          if (
            dataToInsert.Address &&
            dataToInsert.Address != null &&
            dataToInsert.Town &&
            dataToInsert.Town != null &&
            dataToInsert.name &&
            dataToInsert.name != null &&
            dataToInsert.contactNumber &&
            dataToInsert.contactNumber != null &&
            dataToInsert.countryCode &&
            dataToInsert.countryCode != null &&
            dataToInsert.organizationCurrency &&
            dataToInsert.organizationCurrency != null &&
            // dataToInsert.bankName &&
            // dataToInsert.bankName != null &&
            dataToInsert.emailAddress &&
            dataToInsert.emailAddress != null &&
            // dataToInsert.accountNumber &&
            // dataToInsert.accountNumber != null &&
            dataToInsert.identificationNo &&
            dataToInsert.identificationNo != null &&
            // dataToInsert.typeOfAccount &&
            // dataToInsert.typeOfAccount != null &&
            dataToInsert.organizationAddress &&
            dataToInsert.organizationAddress != null &&
            // dataToInsert.bankCode &&
            // dataToInsert.bankCode != null &&
            dataToInsert.organizationType != null
            // && dataToInsert.zipCode != null &&
            // dataToInsert.zipCode != ""
          ) {
            if (dataToInsert.organizationType != "Broker") {
              if (
                !this.bankName ||
                this.bankName == "" ||
                this.bankName == null ||
                !this.accountNumber ||
                this.accountNumber == "" ||
                this.accountNumber == null ||
                !this.typeOfAccount ||
                this.typeOfAccount == "" ||
                this.typeOfAccount == null ||
                !this.bankCode ||
                this.bankCode == "" ||
                this.bankCode == null
              ) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please enter proper bank details.",
                    "Please enter proper bank details."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              }
            }

            dataToInsert.accountNumber = this.accountNumber
              ? this.accountNumber
              : "";
            dataToInsert.bankName = this.bankName ? this.bankName : "";
            dataToInsert.typeOfAccount = this.typeOfAccount
              ? this.typeOfAccount
              : "";
            dataToInsert.bankCode = this.bankCode ? this.bankCode : "";

            if (this.escrowAccountNumber != null) {
              dataToInsert["escrowAccountNumber"] = this.escrowAccountNumber;
            }
            if (this.percentDistribution != null) {
              dataToInsert["percentDistribution"] = this.percentDistribution;
            }
            if (this.zipCode != null) {
              dataToInsert["zipCode"] = this.zipCode;
            }
            // if (this.pineapplePercent != null) {
            //   dataToInsert["pineapplePercent"] = this.pineapplePercent;
            // }
            // if (this.avocadoPercent != null) {
            //   dataToInsert["avocadoPercent"] = this.avocadoPercent;
            // }
            // if (this.mangoPercent != null) {
            //   dataToInsert["mangoPercent"] = this.mangoPercent;
            // }
            if (
              dataToInsert.organizationType ==
              "Logistic / Cold Chain Service Provider"
            ) {
              if (!vm.existingDistributions.length) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please enter at least one distribution.",
                    "Please enter at least one distribution."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              }
              vm.existingDistributions.forEach((item) => {
                if (item.fruit == "Avocado") {
                  dataToInsert["avocadoPercent"] = item.percentage;
                  dataToInsert["avocadoEscrowAccNo"] =
                    item.avocadoEscrowAccNo || item.productEscrowAcNo
                      ? item.productEscrowAcNo
                      : "";
                } else if (item.fruit == "Mango") {
                  dataToInsert["mangoPercent"] = item.percentage;
                  dataToInsert["mangoEscrowAccNo"] =
                    item.mangoEscrowAccNo || item.productEscrowAcNo
                      ? item.productEscrowAcNo
                      : "";
                } else if (item.fruit == "Pineapple") {
                  dataToInsert["pineapplePercent"] = item.percentage;
                  dataToInsert["pineappleEscrowAccNo"] =
                    item.pineappleEscrowAccNo || item.productEscrowAcNo
                      ? item.productEscrowAcNo
                      : "";
                }
              });
            }
            if (dataToInsert.organizationType == "Broker") {
              if (
                this.brokerMargin == null ||
                this.brokerMargin == "" ||
                this.brokerMargin == undefined
              ) {
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Please add broker margin.",
                    "Please add broker margin."
                  ),
                  type: "error",
                  position: "top",
                });
                return false;
              } else {
                dataToInsert.brokerMargin = this.brokerMargin;
              }
            }
            let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;

            if (!pattern.test(dataToInsert.emailAddress)) {
              vm.seen = false;
              Vue.$toast.open({
                message: this.$t(
                  "Please enter a valid organization email address.",
                  "Please enter a valid organization email address."
                ),
                type: "error",
                position: "top",
              });
              return false;
            }
            // check spoc
            // if same (old) email id update the details
            // if changed email id then -> check if email

            let userDataToUpdate = {
              firstName: vm.spocFirstName,
              lastName: vm.spocLastName,
              email: vm.spocEmail,
              roleDesc: vm.organizationType,
              function: vm.organizationType,
              systemRole: (function () {
                if (vm.organizationType == "Root Authority") {
                  return 99;
                } else if (vm.organizationType == "Broker") {
                  return 97;
                } else if (
                  vm.organizationType ==
                  "Logistic / Cold Chain Service Provider"
                ) {
                  return 96;
                } else if (vm.organizationType == "Financial Services") {
                  return 98;
                } else if (
                  vm.organizationType == "Technology Service Provider"
                ) {
                  return 99;
                } else if (vm.organizationType == "Auditor") {
                  return 89;
                } else {
                  return 0;
                }
              })(),
              organization: vm.name,
              organizationType: vm.organizationType,
            };
            // get organization ref
            vm.seen = true;
            firebase
              .database()
              .ref()
              .child("masters")
              .child("organization")
              .child(vm.snapshotKey)
              .once("value", (orgSnapshot) => {
                console.log(orgSnapshot.val());
                console.log(orgSnapshot.key);
                vm.seen = true;

                // if broker organization and the broker margin has changed
                if (
                  vm.organizationType == "Broker" &&
                  orgSnapshot.val().brokerMargin != vm.brokerMargin
                ) {
                  vm.updateBrokerMarginForBrokers(
                    vm.snapshotKey,
                    vm.brokerMargin
                  );
                }
                // if spoc email id has not changed
                if (orgSnapshot.val().spocEmail == userDataToUpdate.email) {
                  vm.seen = true;
                  // update spoc details then update organization details

                  // updating spoc user details
                  firebase
                    .database()
                    .ref()
                    .child("profile")
                    .orderByChild("email")
                    .equalTo(userDataToUpdate.email)
                    .once("value", (profileSnapshot) => {
                      vm.seen = true;
                      console.log(profileSnapshot.val().key);
                      let profileKey = Object.keys(profileSnapshot.val())[0];
                      console.log(profileSnapshot.val());
                      console.log(profileSnapshot.key);
                      // updating user details in profile
                      firebase
                        .database()
                        .ref()
                        .child("profile")
                        .child(profileKey)
                        .update(userDataToUpdate)
                        .then(() => {
                          console.log("User details updated in profile");
                          // update organization details
                          firebase
                            .database()
                            .ref()
                            .child("masters")
                            .child("organization")
                            .child(vm.snapshotKey)
                            .update(dataToInsert)
                            .then(() => {
                              console.log("organization details updated");
                              vm.seen = false;
                              Vue.$toast.open({
                                message: vm.$t(
                                  "Organization details updated.",
                                  "Organization details updated."
                                ),
                                type: "success",
                                position: "top",
                              });
                              vm.clearFields();
                              vm.loadOrganizationDetails();
                              vm.clearSearch();
                              vm.clearAll();
                            })
                            .catch(() => {
                              console.log("Error updating organization data");
                              vm.seen = false;
                              Vue.$toast.open({
                                message: vm.$t(
                                  "Error updating organization details.",
                                  "Error updating organization details."
                                ),
                                type: "error",
                                position: "top",
                              });
                            });
                        })
                        .catch(() => {
                          console.log("Error updating user details in profile");
                          vm.seen = false;
                          Vue.$toast.open({
                            message: vm.$t(
                              "Error updating SPOC user data",
                              "Error updating SPOC user data"
                            ),
                            type: "error",
                            position: "top",
                          });
                        });
                    })
                    .catch(() => {
                      console.log("User not found");
                      vm.seen = false;
                      Vue.$toast.open({
                        message: vm.$t(
                          "Could not find the user",
                          "Could not find the user"
                        ),
                        type: "error",
                        position: "top",
                      });
                    });
                } else {
                  // email id has changed
                  // (if email id doesnt exist) try to create a new user with email and password
                  // update new user details in profile
                  // disable old spoc user
                  // update organization details along with spoc details

                  let newUserPassword = vm.generatePassword();
                  firebase
                    .auth()
                    .createUserWithEmailAndPassword(
                      userDataToUpdate.email,
                      newUserPassword
                    )
                    .then((response) => {
                      const userKey = response.user.uid;

                      // send email
                      mailService(
                        userDataToUpdate.email,
                        `${userDataToUpdate.firstName} ${userDataToUpdate.lastName}`,
                        newUserPassword
                      )
                        .then(() => {
                          console.log("new user email sent");
                          Vue.$toast.open({
                            message: vm.$t("Email sent", "Email sent"),
                            type: "success",
                            position: "top",
                          });
                          // disable already existing SPOC
                          firebase
                            .database()
                            .ref()
                            .child("profile")
                            .orderByChild("email")
                            .equalTo(orgSnapshot.val().spocEmail)
                            .once("value", (_profileSnapshot) => {
                              console.log(_profileSnapshot.val());
                              console.log("old user details found.");
                              // updating status to disable
                              const spocKey = Object.keys(
                                _profileSnapshot.val()
                              )[0];
                              firebase
                                .database()
                                .ref()
                                .child("profile")
                                .child(spocKey)
                                .update({ status: "Disabled" })
                                .then(() => {
                                  console.log("old spoc user account disabled");
                                  // push new user data in profile
                                  let _userData = {
                                    firstName: vm.spocFirstName,
                                    lastName: vm.spocLastName,
                                    email: vm.spocEmail,
                                    roleDesc: vm.organizationType,
                                    function: vm.organizationType,
                                    systemRole: (function () {
                                      if (
                                        vm.organizationType == "Root Authority"
                                      ) {
                                        return 99;
                                      } else if (
                                        vm.organizationType == "Broker"
                                      ) {
                                        return 97;
                                      } else if (
                                        vm.organizationType ==
                                        "Logistic / Cold Chain Service Provider"
                                      ) {
                                        return 96;
                                      } else if (
                                        vm.organizationType ==
                                        "Financial Services"
                                      ) {
                                        return 98;
                                      } else if (
                                        vm.organizationType == "Auditor"
                                      ) {
                                        return 89;
                                      } else {
                                        return 0;
                                      }
                                    })(),
                                    organizationKey: vm.snapshotKey,
                                    organization: vm.name,
                                    organizationType: vm.organizationType,
                                  };
                                  if (vm.organizationType == "Broker") {
                                    _userData["brokerMargin"] = vm.brokerMargin;
                                  }
                                  firebase
                                    .database()
                                    .ref()
                                    .child("profile")
                                    .child(userKey)
                                    .set(_userData)
                                    .then(() => {
                                      console.log(
                                        "user profile data inserted."
                                      );
                                      // add mapping
                                      let _mappingData = {};
                                      _mappingData[userKey] = userKey;
                                      firebase
                                        .database()
                                        .ref()
                                        .child("OrganizationUserMapping")
                                        .child(vm.snapshotKey)
                                        .update(_mappingData)
                                        .then(() => {
                                          console.log(
                                            "User mapped to organization"
                                          );
                                          Vue.$toast.open({
                                            message: vm.$t(
                                              "User mapped to the organization.",
                                              "User mapped to the organization."
                                            ),
                                            type: "success",
                                            position: "top",
                                          });
                                          // update organization data
                                          firebase
                                            .database()
                                            .ref()
                                            .child("masters")
                                            .child("organization")
                                            .child(vm.snapshotKey)
                                            .update(dataToInsert)
                                            .then(() => {
                                              console.log(
                                                "organization details updated"
                                              );
                                              vm.seen = false;
                                              Vue.$toast.open({
                                                message: vm.$t(
                                                  "Organization details updated successfully.",
                                                  "Organization details updated successfully."
                                                ),
                                                type: "success",
                                                position: "top",
                                              });
                                              vm.clearFields();
                                              vm.loadOrganizationDetails();
                                              vm.clearSearch();
                                              vm.clearAll();
                                            })
                                            .catch(() => {
                                              console.log(
                                                "Error updating organization data"
                                              );
                                              vm.seen = false;
                                              Vue.$toast.open({
                                                message: vm.$t(
                                                  "Error updating organization details.",
                                                  "Error updating organization details."
                                                ),
                                                type: "error",
                                                position: "top",
                                              });
                                            });
                                        })
                                        .catch(() => {
                                          console.log(
                                            "Error mapping user to organization"
                                          );
                                          vm.seen = false;
                                          Vue.$toast.open({
                                            message: vm.$t(
                                              "Error mapping the user to the organization.",
                                              "Error mapping the user to the organization."
                                            ),
                                            type: "error",
                                            position: "top",
                                          });
                                        });
                                    })
                                    .catch(() => {
                                      console.log(
                                        "error creating new user data"
                                      );
                                      vm.seen = false;
                                      Vue.$toast.open({
                                        message: vm.$t(
                                          "Error creating user in database.",
                                          "Error creating user in database."
                                        ),
                                        type: "error",
                                        position: "top",
                                      });
                                    });
                                })
                                .catch(() => {
                                  console.log("error disabling old spoc user");
                                  vm.seen = false;
                                  Vue.$toast.open({
                                    message: vm.$t(
                                      "Error disabling old SPOC user account.",
                                      "Error disabling old SPOC user account."
                                    ),
                                    type: "error",
                                    position: "top",
                                  });
                                });
                            })
                            .catch(() => {
                              console.log("error fetching old spoc details");
                              vm.seen = false;
                              Vue.$toast.open({
                                message: vm.$t(
                                  "Error finding old SPOC details.",
                                  "Error finding old SPOC details."
                                ),
                                type: "error",
                                position: "top",
                              });
                            });
                        })
                        .catch(() => {
                          console.log("Error sending email");
                          vm.seen = false;
                          Vue.$toast.open({
                            message: vm.$t(
                              "Error sending email.",
                              "Error sending email."
                            ),
                            type: "error",
                            position: "top",
                          });
                        });
                    })
                    .catch(() => {
                      console.log("User email id already exists");
                      // fetch user details and check for his organizationKey

                      // fetch user profile snapshot
                      firebase
                        .database()
                        .ref()
                        .child("profile")
                        .orderByChild("email")
                        .equalTo(userDataToUpdate.email)
                        .once("value", (userProfileSnapshot) => {
                          console.log(userProfileSnapshot.val());
                          let userProfileSnapshotKey = Object.keys(
                            userProfileSnapshot.val()
                          )[0];
                          // check if email id supplied belongs to same organization
                          let userDetails =
                            userProfileSnapshot.val()[userProfileSnapshotKey];
                          if (userDetails.organizationKey == vm.snapshotKey) {
                            console.log("same organization");
                            // disable existing spoc user
                            firebase
                              .database()
                              .ref()
                              .child("profile")
                              .orderByChild("email")
                              .equalTo(orgSnapshot.val().spocEmail)
                              .once("value", (oldUserProfileSnapshot) => {
                                console.log(oldUserProfileSnapshot.val());
                                console.log(oldUserProfileSnapshot.key);
                                let oldUserSnapshotKey = Object.keys(
                                  oldUserProfileSnapshot.val()
                                )[0];
                                // disable old spoc
                                firebase
                                  .database()
                                  .ref()
                                  .child("profile")
                                  .child(oldUserSnapshotKey)
                                  .update({ status: "Disabled" })
                                  .then(() => {
                                    console.log("old spoc disabled");

                                    // update user details as SPOC
                                    let _newData = {
                                      firstName: vm.spocFirstName,
                                      lastName: vm.spocLastName,
                                      email: vm.spocEmail,
                                      roleDesc: vm.organizationType,
                                      function: vm.organizationType,
                                      systemRole: (function () {
                                        if (
                                          vm.organizationType ==
                                          "Root Authority"
                                        ) {
                                          return 99;
                                        } else if (
                                          vm.organizationType == "Broker"
                                        ) {
                                          return 97;
                                        } else if (
                                          vm.organizationType ==
                                          "Logistic / Cold Chain Service Provider"
                                        ) {
                                          return 96;
                                        } else if (
                                          vm.organizationType ==
                                          "Financial Services"
                                        ) {
                                          return 98;
                                        } else if (
                                          vm.organizationType == "Auditor"
                                        ) {
                                          return 89;
                                        } else {
                                          return 0;
                                        }
                                      })(),
                                      organization: vm.name,
                                      organizationType: vm.organizationType,
                                      status: "Active",
                                    };
                                    firebase
                                      .database()
                                      .ref()
                                      .child("profile")
                                      .child(userProfileSnapshotKey)
                                      .update(_newData)
                                      .then(() => {
                                        console.log("User updated to SPOC");

                                        // update organization details
                                        firebase
                                          .database()
                                          .ref()
                                          .child("masters")
                                          .child("organization")
                                          .child(vm.snapshotKey)
                                          .update(dataToInsert)
                                          .then(() => {
                                            console.log(
                                              "organization details updated"
                                            );
                                            vm.seen = false;
                                            Vue.$toast.open({
                                              message: vm.$t(
                                                "Organization details updated.",
                                                "Organization details updated."
                                              ),
                                              type: "success",
                                              position: "top",
                                            });
                                            vm.clearFields();
                                            vm.loadOrganizationDetails();
                                            vm.clearSearch();
                                            vm.clearAll();
                                          })
                                          .catch(() => {
                                            console.log(
                                              "Error updating organization data"
                                            );
                                            vm.seen = false;
                                            Vue.$toast.open({
                                              message: vm.$t(
                                                "Error updating organization details.",
                                                "Error updating organization details."
                                              ),
                                              type: "error",
                                              position: "top",
                                            });
                                          });
                                      })
                                      .catch(() => {
                                        console.log(
                                          "error updating user to SPOC"
                                        );
                                        vm.seen = false;
                                        Vue.$toast.open({
                                          message: vm.$t(
                                            "Error upgrading user to SPOC",
                                            "Error upgrading user to SPOC"
                                          ),
                                          type: "error",
                                          position: "top",
                                        });
                                      });
                                  })
                                  .catch(() => {
                                    console.log("error disabling old SPOC");
                                    vm.seen = false;
                                    Vue.$toast.open({
                                      message: vm.$t(
                                        "Error disabling the old SPOC user.",
                                        "Error disabling the old SPOC user."
                                      ),
                                      type: "error",
                                      position: "top",
                                    });
                                  });
                              })
                              .catch(() => {
                                console.log("Error getting old spoc details");
                                vm.seen = false;
                                Vue.$toast.open({
                                  message: vm.$t(
                                    "Error getting old SPOC data.",
                                    "Error getting old SPOC data."
                                  ),
                                  type: "error",
                                  position: "top",
                                });
                              });
                          } else {
                            console.log("different organization");
                            vm.seen = false;
                            Vue.$toast.open({
                              message: vm.$t(
                                "SPOC email id already in use by a different organization.",
                                "SPOC email id already in use by a different organization."
                              ),
                              type: "error",
                              position: "top",
                            });
                          }
                        })
                        .catch(() => {
                          console.log("Error fetching user profile");
                          vm.seen = false;
                          Vue.$toast.open({
                            message: vm.$t(
                              "Error fetching user spoc details.",
                              "Error fetching user spoc details."
                            ),
                            type: "error",
                            position: "top",
                          });
                        });
                    });
                }
              })
              .catch(() => {
                console.log("Organization not found.");
                vm.seen = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Organization not found",
                    "Organization not found"
                  ),
                  type: "error",
                  position: "top",
                });
              });

            // const ref = firebase
            //   .database()
            //   .ref()
            //   .child("masters")
            //   .child("organization")
            //   .child(this.snapshotKey)
            //   .update(dataToInsert)
            //   .then(() => {
            //     // updating spoc details
            //     firebase
            //       .database()
            //       .ref()
            //       .child("profile")
            //       .orderByChild("email")
            //       .equalTo(userDataToUpdate.email)
            //       .on("child_added", (snapshot) => {
            //         console.log(snapshot.val());
            //         console.log(snapshot.key);

            //         firebase
            //           .database()
            //           .ref()
            //           .child("profile")
            //           .child(snapshot.key)
            //           .update(userDataToUpdate)
            //           .then(() => {
            //             console.log("user data updated");
            //             Vue.$toast.open({
            //               message: vm.$t(
            //                 "Organization details updated.",
            //                 "Organization details updated."
            //               ),
            //               type: "success",
            //               position: "top",
            //             });
            //             vm.clearFields();
            //             vm.loadOrganizationDetails();
            //             vm.clearSearch();
            //             vm.clearAll();
            //             vm.seen = false;
            //           })
            //           .catch(() => {
            //             console.log(error);
            //             vm.seen = false;
            //           });
            //       });
            //   })
            //   .catch((error) => {
            //     Vue.$toast.open({
            //       message: vm.$t(
            //         "Failed to update organization details.",
            //         "Failed to update organization details."
            //       ),
            //       type: "error",
            //       position: "top",
            //     });
            //     this.seen = false;
            //   });
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
          if (
            !this.Address ||
            !this.Town ||
            !this.name ||
            !this.contactNumber ||
            !this.countryCode ||
            !this.organizationCurrency ||
            !this.bankName ||
            !this.emailAddress ||
            !this.accountNumber ||
            !this.identificationNo ||
            !this.typeOfAccount ||
            !this.organizationAddress ||
            !this.bankCode ||
            !this.spocFirstName ||
            !this.spocLastName ||
            !this.spocContactNo ||
            !this.spocEmail ||
            !this.spocAddress ||
            !this.organizationType
          ) {
            vm.seen = false;
            Vue.$toast.open({
              message: this.$t(
                "Please fill out all the fields.",
                "Please fill out all the fields."
              ),
              type: "error",
              position: "top",
            });
          } else {
            vm.seen = false;
            Vue.$toast.open({
              message: vm.$t(
                "Organization details already exists. Select from the list to edit.",
                "Organization details already exists. Select from the list to edit."
              ),
              type: "warning",
              position: "top",
            });
          }
        }
        vm.isDisabled = false;
      }
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.organizationSelected = false;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      }
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

        vm.organizationsList.forEach((value, index) => {
          if (
            value.name
              .toLowerCase()
              .trim()
              .includes(vm.searchTerm.toLowerCase().trim())
          ) {
            vm.searchResults.push(value);
          }
        });
      }
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
            // Vue.$toast.open({
            //   message: vm.$t("Email ID already in use.", "Email ID already in use."),
            //   type: "error",
            //   position: "top",
            // });
            clearTimeout(timeout);
            resolve(data);
          });
      });
    },
    addOrganizationMapping(emailAddress, organizationKey) {
      // addning to organization mapping
      // take the spoc email address
      // check if it exists under 'users'
      // if found then get the key and add it under organizationUserMapping

      let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
      if (!pattern.test(emailAddress)) {
        Vue.$toast.open({
          message: this.$t(
            "Please enter a valid email address.",
            "Please enter a valid email address."
          ),
          type: "error",
          position: "top",
        });
        return false;
      }
      const vm = this;
      vm.seen = true;
      vm.ifEmailExists(emailAddress, organizationKey).then((data) => {
        if (data != null) {
          vm.seen = true;
          let dataToUpdate = {};
          dataToUpdate[data.key] = data.key;
          firebase
            .database()
            .ref()
            .child("OrganizationUserMapping")
            .child(organizationKey)
            .update(dataToUpdate)
            .then((updated) => {
              console.log(updated);
              Vue.$toast.open({
                message: vm.$t("User mapped", "User mapped"),
                position: "top",
                type: "success",
              });
              vm.clearSearch();
              vm.clearAll();
              vm.seen = false;
            })
            .catch((error) => {
              console.log(error);
              vm.seen = false;
            });
        } else {
          vm.seen = true;
          console.log("email doesn't exists");
          const _systemRole = (function () {
            if (
              vm.organizationType == "Logistic / Cold Chain Service Provider"
            ) {
              return 96;
            }
            if (vm.organizationType == "Financial Services") {
              return 98;
            }
            if (vm.organizationType == "Broker") {
              return 97;
            }
            if (vm.organizationType == "Root Authority") {
              return 99;
            }
            if (vm.organizationType == "Auditor") {
              return 89;
            }
            return 0;
          })();
          let spocData = {
            firstName: vm.spocFirstName,
            lastName: vm.spocLastName,
            email: emailAddress,
            roleDesc: vm.organizationType,
            function: vm.organizationType,
            systemRole: _systemRole,
            organizationKey: organizationKey,
            organization: vm.name,
            organizationType: vm.organizationType,
          };
          if (this.organizationType == "Broker") {
            spocData["brokerMargin"] = vm.brokerMargin;
          }
          const userPassword = vm.generatePassword();
          firebase
            .auth()
            .createUserWithEmailAndPassword(emailAddress, userPassword)
            .then((response) => {
              vm.seen = true;
              console.log(response);
              const snapshot = response.user.uid;

              // send email to new user
              mailService(
                emailAddress,
                `${spocData.firstName} ${spocData.lastName}`,
                userPassword
              )
                .then((sent) => {
                  console.log(sent);
                  vm.seen = true;
                  Vue.$toast.open({
                    message: vm.$t("Email sent", "Email sent"),
                    position: "top",
                    type: "success",
                  });
                  firebase
                    .database()
                    .ref()
                    .child("profile")
                    .child(snapshot)
                    .set(spocData)
                    .then((inserted) => {
                      Vue.$toast.open({
                        message: vm.$t("SPOC user added", "SPOC user added"),
                        position: "top",
                        type: "success",
                      });
                      console.log(inserted);
                      vm.addOrganizationMapping(emailAddress, organizationKey);
                    });
                })
                .catch((error) => {
                  console.log(error);
                  vm.seen = false;
                  Vue.$toast.open({
                    message: vm.$t(
                      "Error sending email",
                      "Error sending email"
                    ),
                    position: "top",
                    type: "error",
                  });
                });

              // push to firebase profile node
            });
        }
      });
    },
    generatePassword() {
      var passLength = 8;
      var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
      var pass = "";
      for (var x = 0; x < passLength; x++) {
        var randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
        pass += randomChar;
      }
      return pass;
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
    deleteOrganization() {
      const vm = this;
      vm.seen = true;
      const org = vm.organizationToDelete;
      if (
        org.organizationType == "Root Authority" &&
        isAuthenticated() != getConfigVars().USERID
      ) {
        vm.seen = false;
        Vue.$toast.open({
          message: vm.$t(
            "You are not authorized to delete the Root Authority Organization.",
            "You are not authorized to delete the Root Authority Organization."
          ),
          type: "error",
          position: "top",
        });
        vm.closeConfirmDialog();
        return false;
      }
      console.log(org.snapshotKey);
      vm.disableUsers(org.snapshotKey);
      firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .child(org.snapshotKey)
        .update({ status: "Disabled" })
        .then(() => {
          vm.seen = false;
          vm.loadOrganizationDetails();
          vm.closeConfirmDialog();
          vm.clearAll();
          vm.clearSearch();
          Vue.$toast.open({
            message: vm.$t("Organization deleted.", "Organization deleted."),
            position: "top",
            type: "error",
          });
        })
        .catch((error) => {
          console.log(error);
          vm.seen = false;
          vm.closeConfirmDialog();
          Vue.$toast.open({
            message: vm.$t(
              "Error deleting organization",
              "Error deleting organization"
            ),
            position: "top",
            type: "error",
          });
        });
    },
    disableUsers(organizationKey) {
      console.log(organizationKey);
      firebase
        .database()
        .ref()
        .child("profile")
        .orderByChild("organizationKey")
        .equalTo(organizationKey)
        .on("value", (users) => {
          console.log(users);
          console.log(users.val());
          console.log(users.length);
          users.forEach((user, index) => {
            console.log(user.snapshot);
            firebase
              .database()
              .ref()
              .child("profile")
              .child(user.key)
              .update({ status: "Disabled" })
              .then(() => {
                console.log("Disabled");
              })
              .catch((error) => {
                console.log(error);
              });
          });
        });
    },

    showConfirmDialog(organization) {
      if (
        isAuthenticated() != getConfigVars().emailId &&
        organization.organizationType == "Technology Service Provider"
      ) {
        Vue.$toast.open({
          message: this.$t(
            "You don't have permission to delete the Technology Service Provider Details",
            "You don't have permission to delete the Technology Service Provider Details"
          ),
          type: "error",
          position: "top",
        });
      } else {
        this.organizationToDelete = organization;
        this.$refs["confirm-modal"].show();
      }
    },
    closeConfirmDialog() {
      this.$refs["confirm-modal"].hide();
    },
    checkIfMCIExists() {
      const vm = this;
      vm.seen = true;
      firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .orderByChild("organizationType")
        .equalTo("Root Authority")
        .once("value", (snapshot) => {
          console.log(snapshot.val());
          if (snapshot.val() == null) {
            vm.organizationTypeList.push("Root Authority");
          }
          // else {
          //   snapshot.forEach((org, index) => {
          //     console.log(org.val());
          //     if (org.val().status == "Disabled") {
          //       vm.organizationTypeList.push("MCI");
          //     }
          //   });
          // }
        });
    },
    clearFields() {
      this.snapshotKey = null;
      this.organizationSelected = true;
      this.pageTitle = this.$t("Organization Details", "Organization Details");
      this.bankName = null;
      this.typeOfAccount = null;
      this.accountNumber = null;
      this.identificationNo = null;
      this.organizationCurrency = null;
      this.Address = null;
      this.Town = null;
      this.contactNumber = null;
      this.countryCode = null;
      this.name = null;
      this.emailAddress = null;
      this.editFlag = false;
      this.organizationAddress = null;
      this.organizationType = null;
      this.zipCode = null;
      this.spocAddress = null;
      this.spocFirstName = null;
      this.spocLastName = null;
      this.spocEmail = null;
      this.spocContactNo = null;
      this.isDisabled = false;
      this.organizationSelected = null;
      this.existingDistributions = [];
      this.distributionFruit = null;
      this.percentageDistribution = null;
    },
    createNewUser() {},
    updateBrokerMarginForBrokers(organizationKey, brokerMargin) {
      firebase
        .database()
        .ref()
        .child("profile")
        .orderByChild("organizationKey")
        .equalTo(organizationKey)
        .on("child_added", (profileSnapshot) => {
          console.log(profileSnapshot.val());
          console.log(profileSnapshot.key);
          let userProfileKey = profileSnapshot.key;
          firebase
            .database()
            .ref()
            .child("profile")
            .child(userProfileKey)
            .update({ brokerMargin })
            .then(() => {
              console.log(`updated for ${userProfileKey}`);
            })
            .catch(() => {
              console.log(`error updating for ${userProfileKey}`);
            });
        });
    },
    editDistribution(item, index) {
      const vm = this;
      vm.addDistributionButtonTitle = vm.$t(
        "Update Distribution",
        "Update Distribution"
      );
      vm.productEscrowAcNo = item.productEscrowAcNo;
      vm.distributionFruit = item.fruit;
      vm.percentageDistribution = item.percentage;
    },
    addDistribution() {
      const vm = this;
      let fruit = vm.getFruit(vm.distributionFruit);
      if (
        vm.distributionFruit != null &&
        vm.distributionFruit != undefined &&
        vm.distributionFruit != "" &&
        vm.percentageDistribution != null &&
        vm.percentageDistribution != undefined &&
        vm.percentageDistribution != "" &&
        vm.productEscrowAcNo != null &&
        vm.productEscrowAcNo != "" &&
        vm.productEscrowAcNo != undefined
      ) {
        // get index
        let index = Vue._.findIndex(vm.existingDistributions, { fruit: fruit });
        if (index == -1) {
          console.log("new distribution");
          let newDist = {
            fruit,
            percentage: vm.percentageDistribution,
            productEscrowAcNo: vm.productEscrowAcNo,
          };
          switch (fruit) {
            case "Avocado":
              newDist.avocadoEscrowAccNo = vm.productEscrowAcNo;
              break;
            case "Mango":
              newDist.mangoEscrowAccNo = vm.productEscrowAcNo;
              break;
            case "Pineapple":
              newDist.pineappleEscrowAccNo = vm.productEscrowAcNo;
              break;

            default:
              break;
          }
          // vm.existingDistributions.push({
          //   fruit,
          //   percentage: vm.percentageDistribution,
          //   productEscrowAcNo: vm.productEscrowAcNo
          // });
          vm.existingDistributions.push(newDist);
          Vue.$toast.open({
            message: vm.$t("Distribution Added.", "Distribution Added."),
            type: "success",
            position: "top",
          });
        } else {
          console.log("existing");
          vm.existingDistributions[index].percentage =
            vm.percentageDistribution;
          vm.existingDistributions[index].productEscrowAcNo =
            vm.productEscrowAcNo;
          switch (vm.existingDistributions[index].fruit) {
            case "Mango":
              vm.existingDistributions[index].mangoEscrowAccNo =
                vm.productEscrowAcNo;
              break;
            case "Pineapple":
              vm.existingDistributions[index].pineappleEscrowAccNo =
                vm.productEscrowAcNo;
              break;
            case "Avocado":
              vm.existingDistributions[index].avocadoEscrowAccNo =
                vm.productEscrowAcNo;
              break;

            default:
              break;
          }
          Vue.$toast.open({
            message: vm.$t("Distribution Updated.", "Distribution Updated."),
            type: "success",
            position: "top",
          });
        }
        vm.addDistributionButtonTitle = vm.$t(
          "Add New Distribution",
          "Add New Distribution"
        );
        vm.productEscrowAcNo = null;
        vm.distributionFruit = null;
        vm.percentageDistribution = null;
      } else {
        if (vm.distributionFruit == null && vm.distributionFruit == undefined) {
          Vue.$toast.open({
            message: vm.$t(
              "Please select the prodcut",
              "Please select the product"
            ),
            type: "error",
            position: "top",
          });
        } else if (
          vm.productEscrowAcNo == null ||
          vm.productEscrowAcNo == "" ||
          vm.productEscrowAcNo == undefined
        ) {
          Vue.$toast.open({
            message: vm.$t(
              "Please enter valid ESCROW account number.",
              "Please enter ESCROW account number."
            ),
            type: "error",
            position: "top",
          });
        } else {
          Vue.$toast.open({
            message: vm.$t(
              "Please enter the % distribution ",
              "Please enter the % distribution"
            ),
            type: "error",
            position: "top",
          });
        }
      }
    },
    getFruit(fruit) {
      if (fruit == "Avocado" || fruit == "Avocat" || fruit == "Zaboka") {
        return "Avocado";
      }
      if (fruit == "Mango" || fruit == "Mangue") {
        return "Mango";
      }
      if (fruit == "Pineapple" || fruit == "Anana" || fruit == "Ananas") {
        return "Pineapple";
      }
      return false;
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
  margin-top: -70px !important;
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
