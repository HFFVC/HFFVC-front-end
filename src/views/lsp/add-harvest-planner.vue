<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container add-collector-wrap">
        <div class="header-container">
          <h6 class="heading">
            {{ $t("Enrolled Harvest Planners", "Enrolled Harvest Planners") }}
          </h6>
        </div>
        <div class="main-container">
          <perfect-scrollbar class="modal-scroll">
            <div class="card-body modal-container">
              <div
                class="outer-container"
                v-for="collector in collectorsList"
                :key="collector.snapshotKey"
              >
                <div class="photo-container">
                  <img
                    src="../../assets/images/collector.png"
                    alt="User Picture"
                    class="former-picture"
                  />
                </div>
                <div class="description-container">
                  <label class="lbl-flname lbl-pickup">
                    <b>{{ collector.firstName }} {{ collector.lastName }}</b>
                    <input
                      type="radio"
                      @click="editCollectorDetails(collector)"
                      :checked="snapshotKey == collector.snapshotKey"
                    />
                    <img />
                  </label>
                  <label class="lbl-flname lbl-pickup">{{
                    collector.email
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    collector.roleDesc
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    collector.func
                  }}</label>
                  <label class="lbl-flname lbl-pickup">{{
                    collector.contact
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
            class="btn-new-collector btn-lg"
            :value="
              $t('Create New Harvest Planner', 'Create New Harvest Planner')
            "
            @click="createNewCollector"
          />
        </div>
      </div>

      <!-- right side container -->
      <div class="col-md-7 details-container add-collector-wrap">
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

        <div class="main-container">
          <perfect-scrollbar>
            <div class="card-body add-collector-field-wrap">
              <div class="emptyContainer" v-if="isEmptyContainer">
                <h4 class="card-inside-description">
                  {{
                    $t(
                      "Select a Harvest Planner to Edit & Update OR Create a New Harvest Planner",
                      "Select a Harvest Planner to Edit & Update OR Create a New Harvest Planner"
                    )
                  }}
                  <!-- Select a Collector to Edit &amp; Update
                  <br />OR
                  <br />Create a New Harvest Planner -->
                </h4>
              </div>

              <div v-if="selectedCollector">
                <div class="row">
                  <div class="col-md-12">
                    <div class="inp-container inp-half">
                      <input
                        :placeholder="$t('First Name', 'First Name')"
                        class="inp-details inp-firstname"
                        v-model="firstName"
                        type="text"
                      />
                    </div>
                    <div class="inp-container inp-half">
                      <input
                        :placeholder="$t('Last Name', 'Last Name')"
                        class="inp-details"
                        type="text"
                        v-model="lastName"
                      />
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="inp-container">
                      <input
                        :placeholder="$t('Email Address', 'Email Address')"
                        class="inp-details inp-email"
                        type="text"
                        v-model="email"
                        :readonly="pageTitle == 'Edit Harvest Planner Details'"
                      />
                    </div>
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
                  <div class="col-md-12">
                    <div class="inp-container">
                      <input
                        :placeholder="$t('Contact Number', 'Contact Number')"
                        class="inp-details inp-contact"
                        type="number"
                        v-model="contact"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="selectedCollector">
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
            @click="saveCollectorDetails"
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
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';
Vue.use(VueToast);

Vue.use(Datetime);
export default {
  name: "manage-users",
  data: function () {
    return {
      seen: true,
      userName: null,
      pageTitle: "Harvest Planner Details",
      collectorsList: [],
      isEmptyContainer: true,
      selectedCollector: null,
      firstName: null,
      lastName: null,
      roleDesc: null,
      systemRole: null,
      snapshotKey: null,
      func: null,
      email: null,
      loader: false,
      contact: null,
      organizationList: [],
      organizationSelected: null,
      isSuperUser: false,
    };
  },
  components: {
    PerfectScrollbar,
    Header,
    Footer,
  },
  mounted() {
    if (localStorage.systemRole == 99) {
      this.isSuperUser = true;
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
          text: this.$t(
            "Packhouse Incharge-Dashboard",
            "Packhouse Incharge-Dashboard"
          ),
          href: "/pack-house-incharge-dashboard",
        },
        {
          text: this.$t("Add Harvest Planner", "Manage Harvest Planner"),
          href: "/add-harvset-planner",
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
          text: this.$t(
            "Packhouse Incharge-Dashboard",
            "Packhouse Incharge-Dashboard"
          ),
          href: "/pack-house-incharge-dashboard",
        },
        {
          text: this.$t("Add Harvest Planner", "Manage Harvest Planner"),
          href: "/add-harvset-planner",
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
        {
          text: this.$t("Add Harvest Planner", "Manage Harvest Planner"),
          href: "/add-harvest-planner",
        },
      ]);
    } else if (localStorage.systemRole == 2) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("LSP-Dashboard", "LSP-Dashboard"),
          href: "/lsp-dashboard",
        },
        {
          text: this.$t("Add Harvest Planner", "Manage Harvest Planner"),
          href: "/add-harvest-planner",
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
        {
          text: this.$t("Add Harvest Planner", "Manage Harvest Planner"),
          href: "/add-harvest-planner",
        },
      ]);
    }

    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.getOrganizationList();
    this.getCollectorsList();
  },
  methods: {
    signInWithEmailLink: function (email) {
      const currentValue = this;
      var actionCodeSettings = {
        // URL you want to redirect back to. The domain (www.example.com) for this
        // URL must be whitelisted in the Firebase Console.
        url: `${getConfigVars().APP_URL}add-collector`,
        // This must be true.
        handleCodeInApp: true,
      };
      firebase
        .auth()
        .sendSignInLinkToEmail(email, actionCodeSettings)
        .then(function () {
          alert("Succcess");
          // The link was successfully sent. Inform the user.
          // Save the email locally so you don't need to ask the user for it again
          // if they open the link on the same device.
          Vue.$toast.open({
            message: currentValue.$t("Email sent.", "Email sent."),
            type: "success",
            position: "top",
          });
        })
        .catch(function (error) {
          // Some error occurred, you can inspect the code: error.code
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
    clearAll: function () {
      this.snapshotKey = null;
      this.selectedCollector = false;
      this.isEmptyContainer = true;
    },
    showDashboard: () => Router.push("lsp-dashboard"),
    getCollectorsList: function () {
      let currentVal = this;
      currentVal.collectorsList = [];
      const ref = firebase
        .database()
        .ref()
        .child("profile")
        .orderByChild("systemRole")
        .equalTo(1);
      ref.on("value", function (snapshot) {
        currentVal.collectorsList = [];
        snapshot.forEach((requestData) => {
          const {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            contact,
            organization,
            organizationKey,
          } = requestData.val();
          let _data = {
            email,
            firstName,
            lastName,
            roleDesc,
            systemRole,
            contact,
            organization,
            organizationKey,
          };
          const dataToPush = {
            ..._data,
            func: requestData.val().function,
            snapshotKey: requestData.key,
          };
          if (dataToPush.organizationKey == localStorage.organizationKey) {
            currentVal.collectorsList.push(dataToPush);
          } else if (localStorage.systemRole.includes(99)) {
            currentVal.collectorsList.push(dataToPush);
          }
          // if (localStorage.systemRole == 99 || localStorage.systemRole == 9 || localStorage.systemRole == 7) {
          //   currentVal.collectorsList.push(dataToPush);
          // } else {
          //   if (requestData.val().createdBy && requestData.val().createdBy == localStorage.userName) {
          //     currentVal.collectorsList.push(dataToPush);
          //   }
          // }
        });
        currentVal.collectorsList.reverse();
        currentVal.seen = false;
      });
    },
    editCollectorDetails: function ({
      email,
      firstName,
      func,
      lastName,
      roleDesc,
      snapshotKey,
      systemRole,
      contact,
      organization,
      organizationKey,
    }) {
      this.pageTitle = this.$t(
        "Edit Harvest Planner Details",
        "Edit Harvest Planner Details"
      );
      this.isEmptyContainer = false;
      this.selectedCollector = true;
      this.firstName = firstName;
      this.lastName = lastName;
      this.func = func;
      this.systemRole = systemRole;
      this.roleDesc = roleDesc;
      this.email = email;
      this.snapshotKey = snapshotKey;
      this.contact = contact;
      this.organizationSelected = {
        name: organization,
        orgKey: organizationKey,
      };
    },
    createNewCollector: function () {
      this.isEmptyContainer = false;
      this.selectedCollector = true;
      this.pageTitle = this.$t(
        "New Harvest Planner Details",
        "New Harvest Planner Details"
      );
      this.firstName = "";
      this.lastName = "";
      this.func = "";
      this.systemRole = "";
      this.roleDesc = "";
      this.email = "";
      this.contact = "";
    },
    saveCollectorDetails: function () {
      // creating new user
      const vm = this;
      this.seen = true;
      const orgKey = vm.isSuperUser
        ? vm.organizationSelected.orgKey
        : localStorage.organizationKey;
      if (
        this.pageTitle ==
        this.$t("New Harvest Planner Details", "New Harvest Planner Details")
      ) {
        const { firstName, lastName, email, contact } = this;
        const func = "ICG";

        const _systemRole = 1;

        if (firstName && lastName && email && contact && orgKey) {
          let pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
          if (!pattern.test(email)) {
            Vue.$toast.show({
              message: vm.$t(
                "Please enter a valid email address.",
                "Please enter a valid email address."
              ),
              type: "error",
              position: "top",
            });
          } else {
            const userPassword = this.generatePassword();
            // mailService(
            //   email,
            //   { firstName, lastName, userPassword },
            //   this.emailServiceCallback
            // );
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, userPassword)
              .then(function (response) {
                const snapshot = response.user.uid;
                mailService(email, `${firstName} ${lastName}`, userPassword)
                  .then((sent) => {
                    console.log(sent);
                    const dataToPush = {
                      firstName,
                      lastName,
                      email,
                      roleDesc: "",
                      function: func,
                      systemRole: _systemRole,
                      contact,
                      createdBy: localStorage.userName,
                      organization: localStorage.organization,
                      organizationKey: orgKey,
                    };
                    const ref = firebase
                      .database()
                      .ref()
                      .child("profile")
                      .child(snapshot)
                      .set(dataToPush)
                      .then((inserted) => {
                        vm.addMapping(snapshot, orgKey);
                        Vue.$toast.open({
                          message: vm.$t(
                            "New harvest planner has been added.",
                            "New harvest planner has been added."
                          ),
                          type: "success",
                          position: "top",
                        });
                        vm.firstName = null;
                        vm.lastName = null;
                        vm.email = null;
                        vm.func = null;
                        vm._systemRole = null;
                        vm.contact = null;
                        vm.isEmptyContainer = true;
                        vm.pageTitle = vm.$t(
                          "Harvest planner Details",
                          "Harvest planner Details"
                        );
                        vm.selectedCollector = null;
                        vm.getCollectorsList();
                        vm.seen = false;
                        vm.snapshotKey = null;
                        vm.organizationSelected = null;
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    Vue.$toast.open({
                      message: vm.$t(
                        "Error sending email.",
                        "Error sending email."
                      ),
                      type: "error",
                      position: "top",
                    });
                    this.seen = false;
                  });
              })
              .catch((error) => {
                Vue.$toast.open({
                  message: error.message,
                  type: "error",
                  position: "top",
                });
                vm.seen = false;
              });
          }
        } else {
          Vue.$toast.open({
            message: vm.$t(
              "Please fill in all the fields.",
              "Please fill in all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      } else if (
        this.pageTitle ==
        this.$t("Edit Harvest Planner Details", "Edit Harvest Planner Details")
      ) {
        const { firstName, lastName, email, contact, roleDesc } = this;
        const _systemRole = 1;
        const func = "ICG";
        const dataToUpdate = {
          firstName,
          lastName,
          email,
          roleDesc,
          function: func,
          systemRole: _systemRole,
          contact,
          updatedBy: localStorage.userName,
          organization: localStorage.organization,
          organizationKey: orgKey,
        };
        const ref = firebase
          .database()
          .ref()
          .child("profile")
          .child(this.snapshotKey)
          .update(dataToUpdate)
          .then(
            () => {
              vm.addMapping(vm.snapshotKey, orgKey);
              Vue.$toast.open({
                message: vm.$t(
                  "Harvest planner Details updated.",
                  "Harvest planner Details updated."
                ),
                type: "success",
                position: "top",
              });
              this.firstName = null;
              this.lastName = null;
              this.email = null;
              this.func = null;
              this._systemRole = null;
              this.contact = null;
              this.isEmptyContainer = true;
              vm.selectedCollector = null;
              this.pageTitle = "Harvest Planner Details";
              this.getCollectorsList();
              this.seen = false;
              vm.snapshotKey = null;
            },
            () => {
              Vue.$toast.open({
                message: vm.$t(
                  "Failed to update User Details.",
                  "Failed to update User Details."
                ),
                type: "success",
                position: "top",
              });
              this.seen = false;
            }
          );
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
    emailServiceCallback(message) {
      if (message == "OK") {
        Vue.$toast.open({
          message: this.$t(
            "Email sent successfully.",
            "Email sent successfully."
          ),
          position: "top",
          type: "success",
        });
      } else {
        Vue.$toast.open({
          message: this.$t(`Couldn't send email.`, `Couldn't send email.`),
          position: "top",
          type: "error",
        });
      }
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
    getOrganizationList() {
      const vm = this;
      vm.seen = true;
      var ref = firebase
        .database()
        .ref()
        .child("masters")
        .child("organization");
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
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
.button-container {
  margin: 10px -4px 10px 10px !important;
}
.btn-new-collector {
  height: 30px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.ps {
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

.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-new-collector {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 12px;
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
  font-size: 22px;
  color: #fff !important;
  padding: 90px;
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
  display: inline;
  margin: 0px 0px 0px 0px;
  font-size: 13px;
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
  /* height: auto; */
  height: 50px !important;
  padding: 15px;
  background: rgba(0, 0, 0, 0.616);
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
.inp-half {
  width: 40%;
  float: left;
  margin-right: 20px;
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
  margin: 10px 0px 10px 0px;
  background: none;
  border: none;
  border-bottom: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  padding: 10px;
  height: 36px;
}
.inp-firstname {
  background-image: url("../../assets/images/user.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-lastname {
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-bda {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-function {
  background-image: url("../../assets/images/edit_record.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-email {
  background-image: url("../../assets/images/email_address.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
  background-size: 20px 20px;
}
.inp-contact {
  background-image: url("../../assets/images/landline.png");
  background-repeat: no-repeat;
  background-position: left;
  padding-left: 50px;
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
  margin-right: 5px;
}
.add-collector-wrap .modal-scroll {
  height: 400px;
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
  margin: 0px 0px 0px 12%;
  font-size: 13px;
}
.add-collector-field-wrap {
  margin: 10px 25px;
}
.add-collector-wrap .main-container {
  overflow-x: hidden;
  overflow-y: hidden;
}
::-webkit-input-placeholder {
  /* Chrome/Opera/Safari */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
::-moz-placeholder {
  /* Firefox 19+ */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
:-ms-input-placeholder {
  /* IE 10+ */
  /* color: #fff !important; */
  color: #a8a8a8 !important;
  font-size: 13px;
}
:-moz-placeholder {
  /* Firefox 18- */
  font-size: 13px;
  color: #a8a8a8 !important;
  /* color: #fff !important; */
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

.rolesel .vs__dropdown-toggle {
  height: 34px !important;
}
</style>
<style>
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
