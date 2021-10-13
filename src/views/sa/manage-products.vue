<template>
  <div class="lsp-dashboard">
    <div class="container-bg"></div>
    <div v-if="seen" class="loading">Loading&#8230;</div>
    <div class="row content">
      <Header ref="headercomp"></Header>
      <div class="col-md-5 details-container">
        <div class="header-container">
          <h6 class="heading">{{ $t("Products", "Products") }}</h6>
        </div>

        <div class="main-container-manage-packhouses">
          <div class="emptyContainer" v-if="productsList.length == 0">
            <h2 class="card-inside-description">
              {{ $t("No data to display", "No data to display") }}
            </h2>
          </div>
          <perfect-scrollbar class="manage-packhouses-ps">
            <div class="card-body">
              <div
                class="outer-container"
                v-for="product in productsList"
                :key="product.snapshotKey"
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
                    <b>{{ $t("Name", "Name") }}: </b>
                    <b>{{ product.productName }}</b>

                    <input
                      type="radio"
                      @click="editproductDetails(product)"
                      :checked="
                        product.snapshotKey == snapshotKey && productSelected
                      "
                    />
                    <img />
                  </label>
                  <label class="lbl-flname lbl-pickup">
                    <b
                      >{{
                        $t(
                          "Average weight of the fruits/box",
                          "Average weight of the fruits/box"
                        )
                      }}
                      :
                    </b>
                    <b>{{ product.averageWeight }}</b>
                  </label>
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container">
          <input
            :disabled="productsList.length > 2 && allProductsPresent"
            type="button"
            class="btn-save sa-packhouse-btn"
            :value="$t('Create New Product', 'Create New Product')"
            @click="createNewproduct"
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
              <div class="emptyContainer" v-if="!productSelected">
                <h2 class="card-inside-description">
                  {{ $t("No data to display", "No data to display") }}
                </h2>
              </div>

              <div v-if="productSelected">
                <div class="inp-container">
                  <v-select
                    v-model="productName"
                    :placeholder="
                      $t('Select the Product', 'Select the Product')
                    "
                    class="manage-bank-accountsv-select"
                    :options="fruitsList"
                  ></v-select>
                </div>
                <div class="inp-container">
                  <input
                    :placeholder="
                      $t(
                        'Average weight of fruits/box',
                        'Average weight of fruits/box'
                      )
                    "
                    class="inp-details"
                    type="text"
                    v-model="averageWeight"
                  />
                </div>
              </div>
            </div>
          </perfect-scrollbar>
        </div>
        <div class="button-container" v-if="productSelected">
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
            @click="saveproduct"
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
import vSelect from "vue-select";
Vue.component("v-select", vSelect);
import "vue-select/dist/vue-select.css";
import isAuthenticated from '../../shared/auth';

export default {
  name: "manage-packhouses",
  data: function () {
    return {
      seen: true,
      productsList: [],
      emptyContainer: true,
      userName: null,
      snapshotKey: null,
      editFlag: false,
      percentageDistribution: null,
      pageTitle: null,
      productSelected: null,
      fruitsList: ["Mango", "Avocado", "Pineapple"],
      averageWeight: null,
      productName: null,
      allProductsPresent: false,
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
      {
        text: this.$t("Manage Harvest Planner Distribution", "Manage Harvest Planner Distribution"),
        href: "/manage-products",
      },
    ]);
      }
      else
      { this.$refs.headercomp.createBreadcrumb([
      {   text: this.$t("Root Authority-Dashboard", "Root Authority-Dashboard"), href: "/sa-dashboard" },
      {
        text: this.$t("Manage Harvest Planner Distribution", "Manage Harvest Planner Distribution"),
        href: "/manage-products",
      },
    ]);

      }
       }
      else if(localStorage.systemRole == 10)
     {
        this.$refs.headercomp.createBreadcrumb([
     
        { text: this.$t("Observer-MCI-Dashboard", "Observer-MCI-Dashboard"), href: "/observer-mci-dashboard" },
     {
        text: this.$t("Manage Harvest Planner Distribution", "Manage Harvest Planner Distribution"),
        href: "/manage-products",
      },
    ]);
     }
    // if (!localStorage.emailId) {
    //   Router.push("/");
    // }
    this.userName = localStorage.userName;
    this.pageTitle = this.$t("Product Details", "Product Details");

    this.loadproductDetails();
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
    loadproductDetails: function () {
      let vm = this;
      this.productsList = [];
      this.productName = null;
      this.averageWeight = null;
      vm.seen = true;
      const ref = firebase.database().ref().child("masters").child("product");

      ref.on("child_added", function (requestData) {
        var data = {
          productName: requestData.val().productName,
          averageWeight: requestData.val().averageWeight,
          snapshotKey: requestData.key,
        };
        vm.productsList.push(data);
      });
      setTimeout(() => {
        if (vm.productsList.length == 0) {
          vm.seen = false;
        }
        this.resetFruitsList();
      }, 3000);
    },
    resetFruitsList() {
      var mango = false;
      var avocado = false;
      var pineapple = false;
      var count = 0;
      var currentVal = this;
      this.productsList.forEach((value) => {
        count++;
        if (value.productName == "Mango") {
          mango = true;
        } else if (value.productName == "Avocado") {
          avocado = true;
        } else if (value.productName == "Pineapple") {
          pineapple = true;
        }
        if (count == currentVal.productsList.length) {
          if (mango && pineapple && avocado) {
            currentVal.allProductsPresent = true;
          }
          if (mango) {
            currentVal.fruitsList = ["Avocado", "Pineapple"];
            if (avocado && mango) {
              currentVal.fruitsList = ["Pineapple"];
            }
            if (pineapple && mango) {
              currentVal.fruitsList = ["Avocado"];
            }
          } else if (avocado) {
            currentVal.fruitsList = ["Mango", "Pineapple"];
            if (pineapple && avocado) {
              currentVal.fruitsList = ["Mango"];
            }
            if (mango && avocado) {
              currentVal.fruitsList = ["Pineapple"];
            }
          } else if (pineapple) {
            currentVal.fruitsList = ["Avocado", "Mango"];
            if (avocado && pineapple) {
              currentVal.fruitsList = ["Mango"];
            }
            if (mango && pineapple) {
              currentVal.fruitsList = ["Avocado"];
            }
          }
        }
      });
      this.seen = false;
    },
    createNewproduct: function () {
      this.snapshotKey = null;
      this.productSelected = true;
      this.pageTitle = this.$t("Product Details", "Product Details");
      this.editFlag = false;
      this.productName = null;
      this.averageWeight = null;
      this.resetFruitsList();
    },
    editproductDetails: function ({ productName, averageWeight, snapshotKey }) {
      this.editFlag = true;
      this.productSelected = true;
      this.productName = productName;
      this.averageWeight = averageWeight;
      this.snapshotKey = snapshotKey;
      this.fruitsList = [this.productName];
    },
    saveproduct: function () {
      var errorFlag = false;
      var currentSnapshotKey = null;
      this.seen = true;
      const vm = this;
      if (!this.editFlag) {
        const { productName, averageWeight } = this;
        const data = {
          productName,
          averageWeight,
        };

        if (
          this.productName &&
          this.productName != null &&
          this.averageWeight &&
          this.averageWeight != null
        ) {
          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("product")
            .push(data)
            .then(
              () => {
                this.productSelected = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "New product details has been added.",
                    "New product details has been added."
                  ),
                  type: "success",
                  position: "top",
                });
                this.loadproductDetails();
              },
              () => {
                this.productSelected = false;
                Vue.$toast.open({
                  message: vm.$t(
                    "Error adding new product details.",
                    "Error adding new product details."
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
              "Please fill out all the fields.",
              "Please fill out all the fields."
            ),
            type: "error",
            position: "top",
          });
          this.seen = false;
        }
      } else if (this.editFlag) {
        var dataToInsert = {
          productName: this.productName,
          averageWeight: this.averageWeight,
        };
        if (
          dataToInsert.productName &&
          dataToInsert.productName != null &&
          dataToInsert.averageWeight &&
          dataToInsert.averageWeight != null
        ) {
          const ref = firebase
            .database()
            .ref()
            .child("masters")
            .child("product")
            .child(this.snapshotKey)
            .update(dataToInsert)
            .then(() => {
              this.productSelected = false;
              Vue.$toast.open({
                message: vm.$t(
                  "Product details updated.",
                  "Product details updated."
                ),
                type: "success",
                position: "top",
              });
              this.loadproductDetails();
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
      }
    },
    clearAll: function () {
      this.snapshotKey = null;
      this.productSelected = false;
    },
    gotoDashboard() {
      if (localStorage.systemRole == 99) {
        Router.push("sa-dashboard");
      } else if (localStorage.systemRole == 9) {
        Router.push("admin-dashboard");
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
