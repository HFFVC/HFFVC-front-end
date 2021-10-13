<template>
  <div class="lsp-dashboard">
    <Offline @detected-condition="handleConnectivityChange"></Offline>
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-lg-11 content-container">
        <div class="header-container">
          <h3 class="heading">
            {{
              $t(
                "Approve/Reject Proposed Producer",
                "Approve/Reject Proposed Producer"
              )
            }}
          </h3>
          <div class="icon-container">
            <ul>
              <li>
                <img
                  @click="showDashboard"
                  class="sub-header-close-img"
                  src="../../assets/images/close.png"
                />
              </li>
            </ul>
          </div>
        </div>
        <div class="main-container">
          <div id="people">
            <v-client-table
              :data="producerList"
              :columns="columns"
              :options="options"
              class="tbl-services proposed-producer-table"
            >
              <template slot="Reject" slot-scope="props">
                <div>
                  <a
                    class="btn-edit"
                    @click="openRejectionConfirmModal(props.row.id)"
                  >
                    <img
                      class="location-img plan-img"
                      src="../../assets/images/plan.png"
                    />
                  </a>
                </div>
              </template>
            </v-client-table>
          </div>
        </div>
      </div>
      <Footer ref="footercomp"></Footer>

      <b-modal
        hide-footer
        id="rejection-confirm-modal"
        ref="rejection-confirm-modal"
        hide-backdrop
        :title="$t('Warning', 'Warning')"
      >
        <label class="appove-success-label">
          {{
            $t(
              "Are you sure you want to proceed to reject this producer",
              "Are you sure you want to proceed to reject this producer"
            )
          }}
          ?
        </label>
        <div class="button-container">
          <input
            type="button"
            v-on:click="hideRejectConfirmModal"
            class="btn-cancel"
            :value="$t('Cancel', 'Cancel')"
          />
          <input
            type="button"
            v-on:click="rejectProducer()"
            class="btn-save"
            :value="$t('Proceed', 'Proceed')"
          />
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Router from "../../router";
import firebase, { functions } from "firebase";
import axios from "axios";
import "../../assets/css/main.css";
import "../../assets/css/manage-services.css";
import "../../assets/css/common.css";
import { ClientTable } from "vue-tables-2";
import BootstrapVue from "bootstrap-vue";
import moment from "moment";
import { AutoCompletePlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(AutoCompletePlugin);
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
Vue.use(DropDownListPlugin);
import Datetime from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/index.css";
import sendSMS from "../../shared/sms-service";
import Header from "../../components/header-view";
import Footer from "../../components/footer-view";
import Offline from "v-offline";

//working

Vue.use(VueToast);

Vue.use(Datetime);

Vue.use(BootstrapVue);
Vue.use(ClientTable);
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import getConfigVars from "../../shared/config-env";
import isAuthenticated from '../../shared/auth';

export default {
  name: "active-service-requests",
  data: function () {
    return {
      producerList: [],
      columns: [
        "firstName",
        "lastName",
        "department",
        "town",
        "phoneNumber",
        "location",
        "ProposedBy",
        "Reject",
      ],
      seen: true,
      show: false,
      selectedRow: null,

      userName: "",

      errorMessage: "",
      succesContent: "",
      showIcons: true,

      noOfRows: 0,

      networkStatus: true,
      options: {
        perPage: 10,
        sortable: ["Producer", "collectionRequestedOn"],
        headings: {
          firstName: `${this.$t("First Name", "First Name")}`,
          lastName: `${this.$t("Last Name", "Last Name")}`,
          department: `${this.$t("Department", "Department")}`,
          town: `${this.$t("Town", "Town")}`,
          phoneNumber: `${this.$t("Phone Number", "Phone Number")}`,
          location: `${this.$t("Location", "Location")}`,
          ProposedBy: `${this.$t("Proposed By", "Proposed By")}`,
          Reject: `${this.$t("Reject", "Reject")}`,
        },
      },
      selectedId: null,
    };
  },
  components: {
    Header,
    Footer,
    Offline,
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
          text: this.$t(
            "Approve/Reject Proposed Producer",
            "Approve/Reject Proposed Producer"
          ),
          href: "/approve-reject-proposed-producer",
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
            "Approve/Reject Proposed Producer",
            "Approve/Reject Proposed Producer"
          ),
          href: "/approve-reject-proposed-producer",
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
          text: this.$t(
            "Approve/Reject Proposed Producer",
            "Approve/Reject Proposed Producer"
          ),
          href: "/approve-reject-proposed-producer",
        },
      ]);
    } else if (localStorage.systemRole == 10) {
      this.$refs.headercomp.createBreadcrumb([
        {
          text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"),
          href: "/observer-mci-dashboard",
        },

        {
          text: this.$t(
            "Approve/Reject Proposed Producer",
            "Approve/Reject Proposed Producer"
          ),
          href: "/approve-reject-proposed-producer",
        },
      ]);
    }
    // if (localStorage.emailId == null || localStorage.emailId == "") {
    //   Router.push("/");
    // }
    this.options = {
        perPage: 10,
        sortable: ["Producer", "collectionRequestedOn"],
        headings: {
          firstName: `${this.$t("First Name", "First Name")}`,
          lastName: `${this.$t("Last Name", "Last Name")}`,
          department: `${this.$t("Department", "Department")}`,
          town: `${this.$t("Town", "Town")}`,
          phoneNumber: `${this.$t("Phone Number", "Phone Number")}`,
          location: `${this.$t("Location", "Location")}`,
          ProposedBy: `${this.$t("Proposed By", "Proposed By")}`,
          Reject: `${this.$t("Reject", "Reject")}`,
        },
      }
    this.getData();
    this.userName = localStorage.userName;
  },
  methods: {
    showDashboard: function () {
      if (localStorage.systemRole == 6) {
        Router.push("tpa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
      } else if (localStorage.systemRole == 7) {
        Router.push("op-admin-dashboard");
      } else if (localStorage.systemRole == 13) {
        Router.push("observer-dashboard");
      } else if (localStorage.systemRole == 10) {
        Router.push("observer-mci-dashboard");
      } else {
        Router.push("sa-dashboard");
      }
    },
    rejectProducer() {
      var inpData = {
        isAccepted: false,
      };

      var ref = firebase
        .database()
        .ref()
        .child("proposedProducer/" + this.selectedId);
      ref.update(inpData).then(() => {
        this.$refs["rejection-confirm-modal"].hide();
        Vue.$toast.open({
          message: this.$t("Rejected successfully", "Rejected successfully"),
          type: "success",
          position: "top",
        });
        this.getData();
      });
    },
    openRejectionConfirmModal(id) {
      this.selectedId = id;
      this.$refs["rejection-confirm-modal"].show();
    },
    hideRejectConfirmModal: function () {
      this.$refs["rejection-confirm-modal"].hide();
    },
    handleConnectivityChange(status) {
      this.networkStatus = status;
    },
    getData: function () {
      let currentValue = this;
      currentValue.producerList = [];
      var count = 0;
      var ref = firebase.database().ref().child("proposedProducer");

      ref.on(
        "child_added",
        (snapshot) => {
          if (snapshot.val() != null) {
            if (
              snapshot.val().isAccepted == undefined ||
              snapshot.val().isAccepted == null
            ) {
              count++;

              currentValue.producerList.push({
                id: snapshot.key,
                firstName: snapshot.val().firstName,
                lastName: snapshot.val().lastName,
                department: snapshot.val().department,
                town: snapshot.val().town,
                phoneNumber: snapshot.val().phoneNumber,
                location: snapshot.val().location,
                ProposedBy: snapshot.val().proposedByName,
              });
              currentValue.producerList.reverse();
              currentValue.seen = false;
              currentValue.show = true;
            }
          } else {
            currentValue.showIcons = false;
            currentValue.seen = false;
          }
        },
        function (error) {
          console.log("Error: " + error.code);
        }
      );
      setTimeout(function () {
        if (currentValue.producerList.length == 0) {
          currentValue.seen = false;
        }
      }, 8000);
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
          // alert("Error");
        });
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
  },
};
</script>
<style scoped>
.header-container {
  height: 50px !important;
}
.btn-save,
.btn-cancel {
  height: 30px !important;
}
.modal-header {
  height: 50px !important;
  padding: 9px !important;
}
.active-service-table tbody tr td:nth-child(8),
.active-service-table thead tr th:nth-child(8) {
  text-align: center !important;
}
.active-req-v-select .vs__open-indicator {
  z-index: 1;
}
</style>
<style>
@import "../../../node_modules/@syncfusion/ej2-base/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-inputs/styles/material.css";
@import "../../../node_modules/@syncfusion/ej2-vue-dropdowns/styles/material.css";
@import "../../assets/css/main.css";

#modal .modal-header {
  height: 50px !important;
}
#modal .modal-header .close {
  margin-top: -12px !important;
}
#modal .modal-header h5 {
  margin: -10px auto !important;
}
.active-req-v-select .vs__dropdown-toggle {
  border: none;
}
.active-req-v-select {
  font-size: 13px;
}
.active-req-v-select span,
.active-req-v-select input,
.active-req-v-select .vs__no-options {
  color: #fff;
}
.active-req-v-select span {
  margin-left: 0px;
  padding-left: 0px;
}
.active-req-v-select .vs__dropdown-menu {
  background: none;
  padding: 0px;
  max-height: 155px;
}
.active-req-v-select .vs__dropdown-option {
  color: #fff;
  padding: 10px;
  background: #1e2318;
}
.active-req-v-select .vs__dropdown-option--highlight {
  background: #000;
}
.active-req-v-select .vs__open-indicator,
.active-req-v-select .vs__clear {
  fill: #fff;
}
.active-req-v-select .vs__selected-options,
.active-req-v-select .vs__search,
.vs__search:focus {
  padding: 0px;
  margin: 0px;
}
.active-req-v-select .vs__dropdown-toggle {
  padding: 0px;
  padding-bottom: 2px;
  margin: 0px 0px;
}
.active-req-v-select .vs__selected {
  margin: 0px;
  padding: 0px;
}
.active-req-v-select .vs__clear {
  margin-top: -10px;
}
.active-req-v-select .vs__open-indicator {
  margin-top: -5px;
}
.lbl-modal-success {
  color: #fff;
}
.pickup-save {
  float: right !important;
  margin-right: -1px !important;
}
.dropdownlist_options {
  background: transparent !important;
  color: #fff;
  padding: 0 !important;
}
.button-container {
  float: right;
}
.btn-save {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
  width: 115px;
  height: 26px;
  margin: 5px;
  color: #fff;
}
.btn-cancel {
  background: #1e2318;
  border-radius: 0px;
  border: 1px solid #000;
  font-size: 13px;
  color: #fff;
  width: 115px;
  height: 26px;
  margin: 5px;
}
.lbl-errormessage {
  color: red;
}
ul {
  padding: 0 !important;
}
.e-dropdownbase .e-list-item {
  color: #fff;
  list-style-type: none;
  padding-left: 20px;
}
#dropdownlist_popup {
  color: #fff;
}
#dropdownlist_popup > .e-content {
  color: #fff;
}
.e-input-group:focus {
  outline: none !important;
}
.e-input-group .e-input-group-icon,
.e-input-group.e-control-wrapper .e-input-group-icon {
  color: #fff !important;
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
.e-input-group:not(.e-disabled):not(.e-float-icon-left)::before,
.e-input-group:not(.e-disabled):not(.e-float-icon-left)::after,
.e-input-group.e-float-icon-left:not(.e-disabled) .e-input-in-wrap::before,
.e-input-group.e-float-icon-left:not(.e-disabled) .e-input-in-wrap::after,
.e-input-group.e-control-wrapper:not(.e-disabled):not(.e-float-icon-left)::before,
.e-input-group.e-control-wrapper:not(.e-disabled):not(.e-float-icon-left)::after,
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-disabled)
  .e-input-in-wrap::before,
.e-input-group.e-control-wrapper.e-float-icon-left:not(.e-disabled)
  .e-input-in-wrap::after {
  background: transparent !important;
}

.modal-title {
  margin: 0 auto !important;
  color: #fff !important;
}
.active-sr-datepicker .datepicker {
  width: 100% !important;
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid #fff !important;
  border-radius: 0 !important;
  outline: 0 !important;
  height: 43px;
  margin: 0 !important;
}
.active-sr-datepicker .datepicker:focus {
  box-shadow: none !important;
}
.active-sr-datepicker .datepicker {
  background-image: url("../../assets/images/calendar_view2.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
  font-size: 13px;
  margin-top: 0px !important;
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
.btn-primary:not(:disabled):not(.disabled).active,
.btn-primary:not(:disabled):not(.disabled):active,
.show > .btn-primary.dropdown-toggle {
  background-color: #92d050;
  border-radius: 0px;
  border: none;
  font-size: 13px;
}
.btn-primary,
.btn-secondary {
  width: 120px;
}
.active-service-table tbody tr td:nth-child(3) {
  width: 200px;
}
.active-service-table tbody tr td:nth-child(6),
.active-service-table thead tr th:nth-child(6) {
  text-align: center !important;
}
.active-service-table tbody tr td:nth-child(8),
.active-service-table thead tr th:nth-child(8) {
  /* text-align: right !important; */
  text-align: center !important;
}
.active-service-table tbody tr td:nth-child(7),
.active-service-table thead tr th:nth-child(7) {
  text-align: center !important;
  /* padding-right: 80px !important; */
}
thead tr th {
  font-weight: 400;
}
tbody tr td {
  font-weight: 400;
}
.modal-body {
  padding: 30px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
}
.modal-header h5 {
  font-size: 1.75rem;
  font-weight: 400;
}
.modal {
  display: table !important;
}
.modal.show .modal-dialog {
  display: table-cell;
  vertical-align: middle;
}
.modal-content {
  min-width: 500px;
  max-width: 500px;
  margin: 0px auto !important;
}
.modal-header {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}
.modal-header .close {
  color: #fff !important;
  font-size: 2.5rem !important;
  margin: 0 !important;
  padding: 0 !important;
}

.active-service-table th:nth-child(3),
.active-service-table td:nth-child(3) {
  text-align: left !important;
}
.active-service-table thead tr th {
  font-weight: bold;
}
.active-service-table .VueTables__search-field input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.active-service-table .VueTables__limit-field select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid;
  border-radius: 3px;
}
.active-req-v-select {
  position: relative !important;
  border-bottom: 1px solid #fff;
  border-radius: 0px;
  padding: 10px 0px;
  margin: 0px 0px 0px 0px !important;
}
@media screen and (max-width: 768px) {
  .active-service-table tbody tr td:nth-child(6) {
    padding-right: 20px !important;
  }
}
</style>
<style scoped>
.collector {
  background-image: url("../../assets/images/collector.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
}
.collectionpoint {
  background-image: url("../../assets/images/collection_point.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
}
.dropoff {
  background-image: url("../../assets/images/packhouse.png") !important;
  background-position: left !important;
  background-size: 25px !important;
  background-repeat: no-repeat !important;
  padding-left: 35px !important;
  width: 100% !important;
  color: #fff !important;
}

.dropdownlist {
  width: 95%;
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
.inp-container {
  margin-bottom: 15px;
}
.e-input-group .e-control-wrapper .e-ddl .e-lib .e-keyboard {
  width: 100%;
}
.input-container {
  width: 68%;
  float: left;
  margin: 10px;
  text-align: left;
}
.active-service-table tbody tr td:nth-child(4) {
  text-align: right;
}
.location-text {
  float: left;
  min-width: 135px;
  display: none;
}
.service-img-container,
.product-container {
  cursor: pointer;
}
.img-previous {
  width: 59px !important;
  margin: 5px 0px 3px 0px !important;
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
  margin-top: -30px;
}

.VueTables__heading {
  color: #fff !important;
}
.column-content {
  color: #fff !important;
}
/* table design */
.btn-edit {
  cursor: pointer;
  color: blue !important;
}
.VuePagination {
  text-align: center;
}

.vue-title {
  text-align: center;
  margin-bottom: 10px;
}

.vue-pagination-ad {
  text-align: center;
}

.glyphicon.glyphicon-eye-open {
  width: 16px;
  display: block;
  margin: 0 auto;
}
.VueTables__child-row-toggler {
  width: 16px;
  height: 16px;
  line-height: 16px;
  display: block;
  margin: auto;
  text-align: center;
}

.VueTables__child-row-toggler--closed::before {
  content: "+";
}

.VueTables__child-row-toggler--open::before {
  content: "-";
}
.tbl-services {
  color: #fff !important;
  padding: 30px;
  background: rgba(0, 0, 0, 0.3);
}
.tbl-services table {
  color: #fff !important;
}
.table {
  color: #fff !important;
}
td {
  color: #fff !important;
}
.location-img {
  margin-left: 10px;
  width: 15px;
  height: auto;
  cursor: pointer;
}
.control-section {
  padding: 30px;
}
td,
th {
  padding: 5px;
}
ul {
  list-style-type: none;
}
ul li {
  float: left;
  padding: 12px 15px 10px 15px;
}
.sub-header-close-img {
  width: 16px;
  height: auto;
}
.sub-header-imgs {
  width: 22px;
  height: auto;
  cursor: pointer;
}
.icon-container {
  float: right;
  position: relative;
  top: -35px;
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
}
.no-padding {
  margin: 0px !important;
  padding: 0px !important;
}
.service-img-container {
  width: 46%;
  float: left;
  margin: 10px;
}
.main-container {
  background: rgba(0, 0, 0, 0.2);
}

.content-container {
  height: fit-content;
  margin: auto;
  margin-top: 40px;
  margin-bottom: 40px;
}

.plan-img {
  width: 20px;
  margin-left: 5px;
}
.ref-logout-lsp {
  font-size: 13px;
  margin-top: -5px;
  text-transform: none !important;
}
.lbl-username-lsp {
  text-transform: none !important;
}
.mandatory-warning {
  position: absolute;
  bottom: 40px;
  font-size: 13px;
  color: #fff;
}
.tooltip {
  position: relative;
  display: inline-block;
  opacity: 1;
  font-size: 14px;
  text-align: center;
  z-index: 1;
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 70px;
  background-color: #3a4527;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  /* Position the tooltip */
  position: absolute;
  z-index: 99999;
  font-size: 12px;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.whatwords-tooltiptext {
  width: 250px !important;
  text-align: left !important;
  padding: 10px !important;
  bottom: -15px;
}
.whatwords-img-wrap {
  width: 20%;
  float: right;
}
.what-words {
  width: 80%;
  float: left;
  text-align: left;
  word-break: break-all;
  text-decoration: underline;
}
.whatwords-wrap-active-sr {
  width: 100%;
  cursor: pointer;
}
.a-text {
  color: #fff;
}
.a-text:hover,
.a-text:active,
.a-text:focus {
  color: #fff;
  outline: none;
  text-decoration: none;
}
.whatwords-tooltiptext-asr {
  left: 50px;
}
.appove-success-label {
  color: #fff;
}
@media screen and (max-width: 1063px) and (min-width: 768px) {
  .col-md-6 {
    max-width: 100% !important;
    width: 100% !important;
    flex: 100%;
  }
}
@media screen and (max-width: 531px) {
  .service-img-container {
    width: 100%;
    text-align: center;
  }
}
@media screen and (max-width: 360px) {
  .content-container {
    margin-top: 30px;
  }
}
@media screen and (max-width: 620px) {
  .heading {
    text-align: left !important;
  }
}
</style>
