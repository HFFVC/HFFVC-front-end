<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">
            {{ $t("Registered Packhouses", "Registered Packhouses") }}
          </h6>
        </div>
        <div class="main-container-manage-packhouses">
          <perfect-scrollbar class="manage-packhouses-ps">
            <div class="card-body">
              <div
                class="outer-container"
                v-for="packhouse in packhouseList"
                :key="packhouse.snapshotKey"
              >
                <div class="photo-container">
                  <img
                    src="../../assets/images/packhouse.png"
                    alt="User Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname lbl-pickup">
                    <b>{{ packhouse.title }}</b>
                    <input
                      type="radio"
                      @click="editPackhouseDetails(packhouse)"
                      :checked="packhouse.snapshotKey == snapshotKey"
                    />
                    <img />
                  </label>
                  <label
                    class="lbl-flname lbl-pickup"
                    v-for="line of packhouse.splitAddress"
                    :key="line"
                    >{{ line }}</label
                  >

                  <label v-if="isSuperUser" class="lbl-flname lbl-pickup"
                    >Organization: {{ packhouse.organization }}</label
                  >
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container">
          <input
            type="button"
            class="btn-save sa-packhouse-btn"
            :value="$t('Create New Packhouse', 'Create New Packhouse')"
            @click="createNewPackhouse"
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

        <div class="main-container-manage-packhouses">
          <perfect-scrollbar>
            <div class="card-body manage-packhouses-field-wrap">
              <div class="emptyContainer" v-if="!packhouseSelected">
                <h2 class="card-inside-description">
                  {{
                    $t(
                      "Select a Packhouse to Edit",
                      "Select a Packhouse to Edit"
                    )
                  }}
                </h2>
              </div>

              <div v-if="packhouseSelected">
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Packhouse Name', 'Packhouse Name')"
                    class="inp-details inp-packhouse-name"
                    type="text"
                    v-model="title"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    placeholder="Town"
                    class="inp-details inp-town"
                    type="text"
                    v-model="town"
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
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Contact Number', 'Contact Number')"
                    class="inp-details inp-contact"
                    type="number"
                    v-model="contactNumber"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Email Address', 'Email Address')"
                    class="inp-details inp-email"
                    type="text"
                    v-model="emailAddress"
                    :readonly="pageTitle == 'Edit Packhouse Details'"
                  />
                </div>
                <div class="inp-container inp-half">
                  <input
                    :placeholder="$t('Truck Registered', 'Truck Registered')"
                    class="inp-details inp-truck"
                    type="number"
                    v-model="noOfTrucks"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="
                      $t(
                        'Lump rate per kg of Fruit for Shipment by Air',
                        'Lump rate per kg of Fruit for Shipment by Air'
                      )
                    "
                    class="inp-details"
                    type="number"
                    v-model="lumpRatePerKgForShipmentByAir"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="
                      $t(
                        'Lump rate per kg of Fruit for Shipment by Sea',
                        'Lump rate per kg of Fruit for Shipment by Sea'
                      )
                    "
                    class="inp-details"
                    type="number"
                    v-model="lumpRatePerKgForShipmentBySea"
                  />
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="$t('Additional Notes', 'Additional Notes')"
                    class="inp-details inp-additional-notes"
                    type="text"
                    v-model="additionalNotes"
                  />
                </div>
                <div class="col-md-12" v-if="isSuperUser">
                  <div class="inp-container">
                    <div class="function-dropdown">
                      <v-select
                        id="organizationList"
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
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="packhouseSelected">
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
            @click="savePackhouse"
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
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

Vue.use(Datetime);
export default {
  name: "manage-packhouses",
  data: function () {
    return {
      seen: true,
      pickupsList: [],
      emptyContainer: true,
      userName: null,
      packhouseList: [],
      Address: null,
      contactNumber: null,
      emailAddress: null,
      id: null,
      noOfTrucks: null,
      title: null,
      town: null,
      additionalNotes: null,
      pageTitle: null,
      packhouseSelected: false,
      snapshotKey: null,
      lumpRatePerKgForShipmentByAir: null,
      lumpRatePerKgForShipmentBySea: null,
      isSuperUser: false,
      organizationList: [],
      organizationSelected: null,
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
      localStorage.prevPage == "observer-mci-dashboard"
    ) {
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
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
        },
      ]);
      localStorage.prevPage = "";
      }
      else{
         this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
        },
      ]);
      localStorage.prevPage = "";
      }
    }
    if (localStorage.systemRole == 99) {
       if(getConfigVars().USERID == isAuthenticated())
      {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Technology Service Provider-Dashboard", "Technology Service Provider-Dashboard"),
          href: "/sa-dashboard",
        },
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
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
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
        },
      ]);
      }
    }
    if (localStorage.systemRole == 96) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
        },
      ]);
    }
    if (localStorage.systemRole == 9) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Admin-Dashboard", "Admin-Dashboard"),
          href: "/admin-dashboard",
        },
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
        },
      ]);
    }
    if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },
        {
          text: this.$t("Manage Packhouses", "Manage Packhouses"),
          href: "/manage-packhouses",
        },
      ]);
    }

    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t("Packhouse Details", "Packhouse Details");
    this.loadPackhouses();
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
    showDashboard: function () {
      if (localStorage.systemRole == 99) {
        Router.push("lsp-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else if (localStorage.systemRole == 96) {
        Router.push("lsp-dashboard");
      }
    },
    getOrganizationList() {
      const vm = this;
      vm.seen = true;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization")
        .orderByChild("organizationType")
        .equalTo("Logistic / Cold Chain Service Provider");
      vm.organizationList = [];
      vm.mappedOrganization = {};
      ref.on("value", (snapshot) => {
        snapshot.forEach((requestData) => {
          if (requestData.val().status != "Disabled") {
            this.organizationList.push({
              name: requestData.val().name,
              orgKey: requestData.key,
            });
          }
        });
      });
      vm.seen = false;
    },
    loadPackhouses: function () {
      let vm = this;
      this.packhouseList = [];
      vm.seen = true;
      if (localStorage.systemRole.includes(99)) {
        this.getOrganizationList();
        this.isSuperUser = true;
        const ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("packHouse");

        ref.on("child_added", function (requestData) {
          console.log(requestData.val());
          const { Address } = requestData.val();
          let splitAddress = Address.split(",");
          const data = {
            ...requestData.val(),
            splitAddress,
            snapshotKey: requestData.key,
          };
          vm.packhouseList.push(data);
          vm.seen = false;
        });
      } else {
        this.organizationSelected = {
          name: localStorage.organization,
          orgKey: localStorage.organizationKey,
        };
        this.isSuperUser = false;
        const ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("packHouse")
          .orderByChild("organizationKey")
          .equalTo(localStorage.organizationKey);

        ref.on("child_added", function (requestData) {
          const { Address } = requestData.val();
          let splitAddress = Address.split(",");
          const data = {
            ...requestData.val(),
            splitAddress,
            snapshotKey: requestData.key,
          };
          vm.packhouseList.push(data);
          vm.seen = false;
        });
      }
      setTimeout(function () {
        if (vm.packhouseList.length == 0) {
          vm.seen = false;
        }
      }, 3000);
    },
    createNewPackhouse: function () {
      this.snapshotKey = null;
      this.packhouseSelected = true;
      this.pageTitle = this.$t(
        "New Packhouse Details",
        "New Packhouse Details"
      );
      this.title = "";
      this.town = "";
      this.Address = "";
      this.contactNumber = "";
      this.emailAddress = "";
      this.noOfTrucks = "";
      this.additionalNotes = "";
      this.lumpRatePerKgForShipmentByAir = "";
      this.lumpRatePerKgForShipmentBySea = "";
    },
    editPackhouseDetails: function ({
      Address,
      splitAddress,
      emailAddress,
      contactNumber,
      title,
      noOfTrucks,
      additionalNotes,
      snapshotKey,
      lumpRatePerKgForShipmentByAir,
      lumpRatePerKgForShipmentBySea,
      organizationKey,
      organization,
    }) {
      this.organizationSelected = {
        name: organization,
        orgKey: organizationKey,
      };
      this.pageTitle = this.$t(
        "Edit Packhouse Details",
        "Edit Packhouse Details"
      );
      this.packhouseSelected = true;
      this.title = title;
      this.town = splitAddress[splitAddress.length - 1];
      this.Address = (function () {
        let formattedAddress = "";
        for (let i = 0; i < splitAddress.length - 1; i++) {
          formattedAddress += `${splitAddress[i]}, `;
        }
        return formattedAddress;
      })();
      this.contactNumber = contactNumber;
      this.emailAddress = emailAddress;
      this.noOfTrucks = noOfTrucks;
      this.additionalNotes = additionalNotes;
      this.snapshotKey = snapshotKey;
      this.lumpRatePerKgForShipmentByAir = lumpRatePerKgForShipmentByAir;
      this.lumpRatePerKgForShipmentBySea = lumpRatePerKgForShipmentBySea;
    },
    savePackhouse: function () {
      this.seen = true;
      const vm = this;
      if (
        this.pageTitle ==
        this.$t("New Packhouse Details", "New Packhouse Details")
      ) {
        const {
          Address,
          emailAddress,
          contactNumber,
          noOfTrucks,
          additionalNotes,
          town,
          title,
          lumpRatePerKgForShipmentBySea,
          lumpRatePerKgForShipmentByAir,
        } = this;
        const data = {
          Address: `${Address}, ${town}`,
          emailAddress,
          contactNumber,
          noOfTrucks,
          additionalNotes: additionalNotes || "",
          title,
          lumpRatePerKgForShipmentByAir,
          lumpRatePerKgForShipmentBySea,
          organization: vm.organizationSelected.name,
          organizationKey: vm.organizationSelected.orgKey,
        };
        if (Address && emailAddress && contactNumber && town && title) {
          const pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
          if (pattern.test(emailAddress)) {
            const ref = firebase
              .database()
              .ref()
              .child("masters")
              .child("packHouse")
              .push(data)
              .then(
                () => {
                  this.packhouseSelected = false;
                  Vue.$toast.open({
                    message: vm.$t(
                      "New packhouse has been added.",
                      "New packhouse has been added."
                    ),
                    type: "success",
                    position: "top",
                  });
                  this.loadPackhouses();
                  this.seen = false;
                },
                () => {
                  this.packhouseSelected = false;
                  Vue.$toast.open({
                    message: vm.$t(
                      "Error adding new packhouse.",
                      "Error adding new packhouse."
                    ),
                    type: "error",
                    position: "top",
                  });
                  this.seen = false;
                }
              );
          } else {
            Vue.$toast.open({
              message: this.$t(
                "Invalid email address.",
                "Invalid email address."
              ),
              type: "error",
              position: "top",
            });
            this.seen = false;
          }
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
        this.pageTitle ==
        this.$t("Edit Packhouse Details", "Edit Packhouse Details")
      ) {
        const {
          title,
          emailAddress,
          contactNumber,
          noOfTrucks,
          Address,
          additionalNotes,
          splitAddress,
          town,
          lumpRatePerKgForShipmentBySea,
          lumpRatePerKgForShipmentByAir,
        } = this;
        const formattedAddress = (function () {
          return `${Address}, ${town}`;
        })();
        const dataToInsert = {
          title,
          emailAddress,
          contactNumber,
          noOfTrucks,
          Address: formattedAddress,
          additionalNotes: additionalNotes || "",
          lumpRatePerKgForShipmentByAir,
          lumpRatePerKgForShipmentBySea,
        };
        const ref = firebase
          .database()
          .ref()
          .child("masters")
          .child("packHouse")
          .child(this.snapshotKey)
          .update(dataToInsert)
          .then(
            () => {
              Vue.$toast.open({
                message: vm.$t(
                  "Packhouse details updated.",
                  "Packhouse details updated."
                ),
                type: "success",
                position: "top",
              });
              this.loadPackhouses();
              this.seen = false;
            },
            () => {
              Vue.$toast.open({
                message: vm.$t(
                  "Failed to update packhouse details.",
                  "Failed to update packhouse details."
                ),
                type: "error",
                position: "top",
              });
              this.seen = false;
            }
          );
      }
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.packhouseSelected = false;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
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
